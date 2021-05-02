# FaasConverter

Express API application that consumes NodeRed admin api to fetch NodeRed flows and convert them to FaaS compatible functions.
* Supported FaaS platforms: Openshisk
* Only function nodes are supported from NodeRed. All other nodes will be ignored
* 3 endpoints:
  * GET /flows -> Returns all flows from NodeRed
  * GET /flows/:flowId -> Returns specific flow
  * POST /flows/:flowId/convert -> Converts NodeRed functions to FaaS functions. seq parameter can be used to indicate if sequence has to be created
