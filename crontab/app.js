/**
 * @author synder on 2017/3/15
 * @copyright
 * @desc
 */


const kue = require('kue');

const Logger = require('./lib/logger');
const error = require('./lib/error');

const config = global.config = require('./config');
const logger = global.logger = new Logger(config.log);

const server = kue.app.listen(config.server.port.http, function(err){
    if (err) {
        throw err;
    }

    logger.log('cron tab app listening on port ', server.address().port);
});
