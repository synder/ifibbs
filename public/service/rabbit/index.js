/**
 * @author synder on 2017/2/27
 * @copyright
 * @desc
 */

const url = require('url');

const queues = require('./ifibbs/index');
const Connection = require('./lib/index').Connection;
const config = require('../config');

if(!config && !config.amqp && config.amqp.ifibbs){
    throw new Error('please provide amqp config');
}

const IFIBBS_CONFIG = config.amqp.ifibbs;

const IFIBBS_CLIENT = new Connection(IFIBBS_CONFIG.host, IFIBBS_CONFIG.port);

exports.ifibbs = IFIBBS_CLIENT;
exports.ifibbs.queues = queues;