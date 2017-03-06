/**
 * @author synder on 2017/3/3
 * @copyright
 * @desc 短消息服务
 */

const config = require('../config');

const DefaultSMSClient = require('./lib/client').DefaultSMSClient;

const client = new DefaultSMSClient(config.sms);

exports.client = client;