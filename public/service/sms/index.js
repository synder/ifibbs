/**
 * @author synder on 2017/3/3
 * @copyright
 * @desc 短消息服务
 */

const config = require('../config').sms;

const DefaultSMSClient = require('./lib/client').DefaultSMSClient;

if(!config && !config.username && !config.password){
    throw new Error('please provide sms config');
}

const client = new DefaultSMSClient(config.username, config.password);

exports.client = client;

client.send('13120975917', '【网金院】您的验证码：123456，打死都不告诉别人', function (err) {
    
});

setTimeout(function () {
    
}, 10000000);