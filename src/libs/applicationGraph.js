var Graph = require("graph-data-structure");
var _ = require("underscore");

module.exports = {
    generateApplicationGraph: async(nodes, registeredFunctions) => {
        var appComponents = [];
        registeredFunctions.forEach(faasFunction => {
            var node = _.find(nodes, (node) => {
                return faasFunction.name == node.name || faasFunction.name == "function." + node.id;
            });
            appComponents.push({
                faasName: faasFunction.name,
                id: node.id,
                wires: node.wires[0]
            })
        });
        var appGraph = new Graph();
        appComponents.forEach((component) => {
            appGraph.addNode(component.faasName);
        });
        appComponents.forEach((component) => {
            if(component.wires.lenght == 0) return;
            component.wires.forEach((wire) => {
                var connetedComponent = _.find(appComponents, (testComponent) => {
                    return testComponent.id == wire;
                });
                if (connetedComponent) appGraph.addEdge(component.faasName, connetedComponent.faasName);
            });
        });
        console.log("[INFO] Generated application graph: ", appGraph.serialize());
        return appGraph
    }
}
