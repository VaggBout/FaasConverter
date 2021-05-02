var axios = require('axios');

var node_host = process.env.NODE_HOST;

module.exports = {
	fetchAllFlows: () => {
        return new Promise((resolve, reject) => {
            axios.get(node_host + "/flows")
            .then((api_res) => {
                if(api_res.data.length > 0) {
                   resolve(api_res.data);
                } else {
                    reject({error: "No flows found"});
                }
            })
            .catch((api_err) => {
                console.log(api_err);
                reject({error: "Error trying to fetch flows. Is node-red running?"});
            });
        });
    },
    fetchFlow: (flowId) => {
        return new Promise((resolve, reject) => {
            axios.get(node_host + "/flow/" + flowId)
            .then((api_res) => {
                resolve(api_res.data)
            })
            .catch((api_err) => {
                console.log(api_err);
                reject({error: "Error trying to fetch flows. Is node-red running?"});
            })
        })
    }
    
}