/**
 * @author synder on 2017/2/27
 * @copyright
 * @desc
 */

const url = require('url');
const amqp = require('amqplib/callback_api');

const config = require('../config');

if(!config && !config.amqp && config.amqp.host){
    throw new Error('please provide amqp config');
}


const CONN_STRING =  url.format({
    protocol: 'amqp',
    host: config.amqp.host,
    port: config.amqp.port
});

exports.connect = function (callback) {
    amqp.connect(CONN_STRING, callback);
};