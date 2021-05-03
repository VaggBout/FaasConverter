# FaasConverter

Express API application that consumes NodeRed admin api to fetch NodeRed flows and convert them to FaaS compatible functions.
* Supported FaaS platforms: Openwhisk
* Only function nodes are supported from NodeRed. All other nodes will be ignored
* 3 endpoints:
  * GET /flows -> Returns all flows from NodeRed
  * GET /flows/:flowId -> Returns specific flow
  * POST /flows/:flowId/convert -> Converts NodeRed functions to FaaS functions. seq parameter can be used to indicate if sequence has to be created

### Requiered env variables:
* **NODE_HOST** Hostname of NodeRED
* **NODE_AUTH** Authentication schema that is used. Leave empty if nodeRed server has no authentication. 
  * Supported authentication schemas: credentials
* **NODE_USER** username for credentials schema
* **NODE_PWD** password for credentials schema
* **OW_API_HOST** Openwhisk host name
* **OW_USER** Openwhisk username
* **OW_PWD** Openwhisk password
