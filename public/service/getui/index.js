
const config = require('../config');

if(!config.getui || !config.getui.appID){
    throw new Error('please provide getui config');
}

const GeTui = require('./sdk/push');
const Target = require('./sdk/getui/Target');

/**
 * @desc 苹果推送
 * */
exports.APNPayload = require('./sdk/payload/APNPayload');

/**
 * @desc 模版类型
 * NotyPopLoadTemplate  ：通知弹框下载功能模板
 * LinkTemplate         ：通知打开链接功能模板
 * NotificationTemplate ：通知透传功能模板
 * TransmissionTemplate ：透传功能模板
 * */
exports.APNTemplate = require('./sdk/getui/template/APNTemplate');
exports.BaseTemplate = require('./sdk/getui/template/BaseTemplate');
exports.NotyPopLoadTemplate = require('./sdk/getui/template/NotyPopLoadTemplate');
exports.LinkTemplate = require('./sdk/getui/template/LinkTemplate');
exports.NotificationTemplate = require('./sdk/getui/template/NotificationTemplate');
exports.PopupTransmissionTemplate = require('./sdk/getui/template/PopupTransmissionTemplate');
exports.TransmissionTemplate = require('./sdk/getui/template/TransmissionTemplate');

/**
 * @desc 消息类型
 * */
exports.SingleMessage = require('./sdk/getui/message/SingleMessage');
exports.AppMessage = require('./sdk/getui/message/AppMessage');
exports.ListMessage = require('./sdk/getui/message/ListMessage');
exports.DictionaryAlertMsg = require('./sdk/payload/DictionaryAlertMsg');
exports.SimpleAlertMsg = require('./sdk/payload/SimpleAlertMsg');


const GET_TUI_API_CONFIG = {
    httpHost: 'http://sdk.open.api.igexin.com/apiex.htm',
    httpsHost : 'https://api.getui.com/apiex.htm',
    appID: config.getui.appID,
    appKey: config.getui.appKey,
    masterSecret: config.getui.masterSecret
};

const client = new GeTui(GET_TUI_API_CONFIG.httpHost, GET_TUI_API_CONFIG.appKey, GET_TUI_API_CONFIG.masterSecret);

exports.client = client;
