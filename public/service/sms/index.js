/**
 * @author synder on 2017/3/3
 * @copyright
 * @desc 短消息服务
 */

const config = require('../config');

const DefaultSMSClient = require('./lib/client').DefaultSMSClient;

if(!config && !config.sms && !config.sms.ifibbs){
    throw new Error('please provide sms.ifibbs config');
}

const IFIBBS_CONFIG = config.sms.ifibbs;

const IFIBBS_CLIENT = new DefaultSMSClient(IFIBBS_CONFIG.username, IFIBBS_CONFIG.password);

exports.ifibbs = IFIBBS_CLIENT;