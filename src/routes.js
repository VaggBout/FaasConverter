const routes = require('express').Router();
var index = require('./controllers/index');
var red = require('./controllers/redFlows');

routes.get('/', index.root);

routes.get('/flows', red.fetchFlows);
routes.get('/flows/:id', red.getFlow);
routes.post('/flows/:id/convert', red.convertFlow);

module.exports = routes;