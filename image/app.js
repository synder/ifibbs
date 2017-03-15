/**
 * @author synder
 * @date 16/1/10
 * @desc create http server
 */

const Server = require('./lib/server');
const Logger = require('./lib/logger');
const error = require('./lib/error');

const config = global.config = require('./config');
const logger = global.logger = new Logger(config.log);

const server = new Server({
    host: config.server.host,
    key: config.server.key,
    cert: config.server.cert,
    port: {
        http: config.server.port.http,
        https: config.server.port.https
    }
});

server.config(function(app){
    app.set('x-powered-by', false);
    app.set('trust proxy', true);
});


//=======================================

const image = require('./router/image');

server.route(function(app){
    image.map(app);
});

//=======================================
const errorHandler = require('./middleware/error/index');

server.error(function(app){
    app.use(errorHandler.notFoundHandler());
    app.use(errorHandler.serverErrorHandler());
});

module.exports = server;