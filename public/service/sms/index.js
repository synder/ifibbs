/**
 * @author synder on 2017/3/3
 * @copyright
 * @desc 短消息服务
 */

const DefaultSMSClient = require('./lib/client').DefaultSMSClient;

const client = new DefaultSMSClient();

exports.client = client;