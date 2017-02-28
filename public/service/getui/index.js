
const config = require('../config');

if(!config.getui || !config.getui.appID){
    throw new Error('please provide getui config');
}

const GeTui = require('./sdk/push');
const Target = require('./sdk/getui/Target');

const HOST = config.getui.protocol === 'http' ? 'http://sdk.open.api.igexin.com/apiex.htm' : 'https://api.getui.com/apiex.htm';
const APP_ID = config.getui.appID;
const APP_KEY = config.getui.appKey;
const MASTER_SECRET = config.getui.masterSecret;

/**
 * @desc 创建推送客户端
 * */
const client = exports.client = new GeTui(HOST, APP_KEY, MASTER_SECRET);

/**
 * @desc 苹果推送
 * */
const APNPayload = exports.APNPayload = require('./sdk/payload/APNPayload');

/**
 * @desc 模版类型
 * NotyPopLoadTemplate  ：通知弹框下载功能模板
 * LinkTemplate         ：通知打开链接功能模板
 * NotificationTemplate ：通知透传功能模板
 * TransmissionTemplate ：透传功能模板
 * */
const APNTemplate = exports.APNTemplate = require('./sdk/getui/template/APNTemplate');
const BaseTemplate = exports.BaseTemplate = require('./sdk/getui/template/BaseTemplate');
const NotyPopLoadTemplate = exports.NotyPopLoadTemplate = require('./sdk/getui/template/NotyPopLoadTemplate');
const LinkTemplate = exports.LinkTemplate = require('./sdk/getui/template/LinkTemplate');
const NotificationTemplate = exports.NotificationTemplate = require('./sdk/getui/template/NotificationTemplate');
const PopupTransmissionTemplate = exports.PopupTransmissionTemplate = require('./sdk/getui/template/PopupTransmissionTemplate');
const TransmissionTemplate = exports.TransmissionTemplate = require('./sdk/getui/template/TransmissionTemplate');

/**
 * @desc 消息类型
 * */
const SingleMessage = exports.SingleMessage = require('./sdk/getui/message/SingleMessage');
const AppMessage = exports.AppMessage = require('./sdk/getui/message/AppMessage');
const ListMessage = exports.ListMessage = require('./sdk/getui/message/ListMessage');
const DictionaryAlertMsg = exports.DictionaryAlertMsg = require('./sdk/payload/DictionaryAlertMsg');
const SimpleAlertMsg = exports.SimpleAlertMsg = require('./sdk/payload/SimpleAlertMsg');


/**
 * @desc 推送打开应用通知
 * */
exports.pushNotificationToOpenApp = function () {
    
};


/**
 * @desc 推送打开网页通知
 * */
exports.pushNotificationToOpenWebPage = function () {

};

/**
 * @desc 推送下载通知
 * */
exports.pushNotificationToDownload = function () {

};


/**
 * @desc 推送
 * */