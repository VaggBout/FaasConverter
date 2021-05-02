var openwhisk = require('openwhisk');
var graphUtils = require('../libs/applicationGraph');
const authHandler = {
    getAuthHeader: ()=>{
        return Promise.resolve('Basic ' + Buffer.from(process.env.OW_USER + ":" + process.env.OW_PWD).toString('base64'));
    }
}

var owOptions = {
    apihost: process.env.OW_API_HOST,
    namespace: "guest",
    auth_handler: authHandler
}
var ow = openwhisk(owOptions)
module.exports = {
    convertFlowsToFaas: async (flow, sequence) => {
        var flowId = flow.id;
        var nodes = flow.nodes;
        return new Promise(async (resolve, reject) => {
            if (nodes.length == 0) return {err: "Empty array"};
            var functions = [];
            nodes.forEach((node) => {
                if(node.type == "function") {
                    console.log('[INFO] Found function node with id: ', node.id);
                    functions.push({
                        code: wrapCode(node.func),
                        name: node.name || "function." + node.id
                    });
                }
            });
            var existingOwActions = await ow.actions.list()
            .catch((err) => {
                reject(err);
                return;
            });
            registerToFaas(functions, existingOwActions)
            .then((results) => {
                return Promise.resolve(graphUtils.generateApplicationGraph(nodes, results));
            })
            .then((applicationGraph) => {
                if(sequence) {
                    return generateSequence(applicationGraph, flowId, existingOwActions);
                }
                return Promise.resolve({graph: applicationGraph.serialize()});
            })
            .then((results) => {
                resolve(results);
            })
            .catch((err) => {
                reject(err)
            })
        });
    }
}

function wrapCode(code) {
    var wrappedConde = "function main(msg) {\n"
                        +"if(!msg) var msg = {};\n "
                        + code 
                    + "\n}";
    return wrappedConde;
}

async function registerToFaas(faaSFunctions, owActions) {
    return new Promise(async (resolve, reject) => {
        var promises = [];
        var existingActions = [];

        owActions.forEach((action) => {
            existingActions.push(action.name);
        });

        faaSFunctions.forEach((faaSFunction) => {
            var owMethod = existingActions.includes(faaSFunction.name) ? "update" : "create"
            promises.push(ow.actions[owMethod]({
                    name: faaSFunction.name,
                    namespace: owOptions.namespace,
                    action: faaSFunction.code
                })
            );
        });
        Promise.all(promises)
        .then((results) => {
            resolve(results);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

async function generateSequence(applicationGraph, seqName, owActions) {
    return new Promise((resolve, reject) => {
        var existingActions = [];
        owActions.forEach((action) => {
            existingActions.push(action.name);
        });

        
        var faasFucPath = [];
        applicationGraph.topologicalSort().forEach((func) => {
            faasFucPath.push("/"+owOptions.namespace+"/"+func);
        });
        var owMethod = existingActions.includes(seqName) ? "update" : "create"
        ow.actions[owMethod]({
            name: seqName,
            namespace: owOptions.namespace,
            sequence: faasFucPath
        })
        .then((results) => {
            resolve(results);
        })
        .catch((err) => {
            reject(err)
        });
    });
}