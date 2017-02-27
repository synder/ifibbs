/**
 * @author synder on 2017/2/27
 * @copyright
 * @desc
 */

const url = require('url');

const queues = require('./queues/index');
const Connection = require('./lib/index').Connection;
const config = require('../config');

if(!config && !config.amqp && config.amqp.host){
    throw new Error('please provide amqp config');
}

const client = new Connection(config.amqp.host, config.amqp.port);

exports.client = client;
exports.queues = queues;