var nodeApi = require('../services/node-redApi');
var faasConverter = require('../services/faasConverter');

module.exports = {
	fetchFlows: async (req, res) => {
        nodeApi.fetchAllFlows()
        .then((flows) => {
            res.send(flows);
        })
        .catch((error) => {
            res.send({err: error});
        })
    },
    getFlow: async (req, res) => {
        var flowId = req.params.id;
        nodeApi.fetchFlow(flowId)
        .then((flow) => {
            res.send(flow);
        })
        .catch((err) => {
            res.send(err);
        });
    },
    convertFlow: async (req, res) => {
        var flowId = req.params.id;
        var sequence = req.query.seq ? req.query.seq : false;
        nodeApi.fetchFlow(flowId)
        .then((flow) => {
            return faasConverter.convertFlowsToFaas(flow, sequence);
        })
        .then((results) => {
            res.send({results: results});
        })
        .catch((err) => {
            res.send(err);
        });
    }
}
