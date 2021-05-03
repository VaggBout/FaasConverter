var axios = require('axios');

var node_host = process.env.NODE_HOST;

module.exports = {
	fetchAllFlows: () => {
        return new Promise((resolve, reject) => {
            auth()
            .then((data) => {
                var headers = {}
                if(data.token) {
                    headers = {
                        'Authorization': `Bearer ${data.token}`
                    }
                }
                return axios.get(node_host + "/flows", {headers: headers})
            })
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
            auth()
            .then((data) => {
                var headers = {}
                if(data.token) {
                    headers = {
                        'Authorization': `Bearer ${data.token}`
                    }
                }
                return axios.get(node_host + "/flow/" + flowId, {headers: headers})
            })
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

function auth() {
    return new Promise(async (resolve, reject) => {
        if(!process.env.NODE_AUTH) return resolve({err: null, token: null});
        if(process.env.NODE_AUTH != "credentials") return reject({err: "Unsupported auth schema: "+process.env.NODE_AUTH, token: null});
    
        var body = {
            client_id: "node-red-admin",
            grant_type: "password",
            scope: "*",
            username: process.env.NODE_USER,
            password: process.env.NODE_PWD
        }
        axios.post(node_host + "/auth/token", body)
        .then((response) => {
            resolve({err: null, token: response.data.access_token})
        })
        .catch((err) => {
            reject(err);
        })
    })
}