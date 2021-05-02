var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var debug = require('debug')('fass-converter:server');
require('dotenv').config();

var routes = require('./routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port);
console.log('Listening to port: ' + port)
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
* Event listener for HTTP server "error" event.
*/
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
		default:
			throw error;
	}
}

/**
* Event listener for HTTP server "listening" event.
*/
function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	debug('Listening on ' + bind);
}

// var results = null; 
// results = (async function (msg, __send__, __done__) {
// 	var __msgid__ = msg._msgid; 
// 	var node = { 
// 		id: __node__.id, 
// 		name: __node__.name, 
// 		log: __node__.log, error: 
// 		__node__.error, 
// 		warn: __node__.warn, 
// 		debug: __node__.debug, 
// 		trace: __node__.trace, 
// 		on: __node__.on, 
// 		status: __node__.status, 
// 		send: function (msgs, cloneMsg) {
// 			__node__.send(__send__, __msgid__, msgs, cloneMsg); 
// 		}, 
// 		done: __done__ };
		
// 	msg.payload = "Hello World!"
// 	return msg;
// })(msg, __send__, __done__);