
const config = global.config || require('../../config');

if(!config.service.getui || !config.service.getui.appID){
    throw new Error('pelase provide getui config');
}

const GeTui = require('./sdk/push');
const Target = require('./sdk/getui/Target');

const APNPayload = require('./sdk/payload/APNPayload');

/**
 * @desc 模版类型
 * NotyPopLoadTemplate  ：通知弹框下载功能模板
 * LinkTemplate         ：通知打开链接功能模板
 * NotificationTemplate ：通知透传功能模板
 * TransmissionTemplate ：透传功能模板
 * */
const APNTemplate = require('./sdk/getui/template/APNTemplate');
const BaseTemplate = require('./sdk/getui/template/BaseTemplate');
const NotyPopLoadTemplate = require('./sdk/getui/template/NotyPopLoadTemplate');
const LinkTemplate = require('./sdk/getui/template/LinkTemplate');
const NotificationTemplate = require('./sdk/getui/template/NotificationTemplate');
const PopupTransmissionTemplate = require('./sdk/getui/template/PopupTransmissionTemplate');
const TransmissionTemplate = require('./sdk/getui/template/TransmissionTemplate');

/**
 * @desc 消息类型
 * */
const SingleMessage = require('./sdk/getui/message/SingleMessage');
const AppMessage = require('./sdk/getui/message/AppMessage');
const ListMessage = require('./sdk/getui/message/ListMessage');
const DictionaryAlertMsg = require('./sdk/payload/DictionaryAlertMsg');
const SimpleAlertMsg = require('./sdk/payload/SimpleAlertMsg');


const GET_TUI_API_CONFIG = {
    httpHost: 'http://sdk.open.api.igexin.com/apiex.htm',
    httpsHost : 'https://api.getui.com/apiex.htm',
    appID: config.service.getui.appID,
    appKey: config.service.getui.appKey,
    masterSecret: config.service.getui.masterSecret
};

const client = new GeTui(GET_TUI_API_CONFIG.httpHost, GET_TUI_API_CONFIG.appKey, GET_TUI_API_CONFIG.masterSecret);


function pushMessageToSingle() {
    let template = TransmissionTemplateDemo();
//    var template = LinkTemplateDemo();
//    var template = NotificationTemplateDemo();
//    var template = NotyPopLoadTemplateDemo();

    //个推信息体
    let message = new SingleMessage({
        isOffline: true,                        //是否离线
        offlineExpireTime: 3600 * 12 * 1000,    //离线时间
        data: template,                          //设置推送消息类型
        pushNetWorkType:0                     //是否wifi ，0不限，1wifi
    });

    //接收方
    let target = new Target({
        appId: APPID,
        clientId: CID
//        alias:'_lalala_'
    });
    //target.setAppId(APPID).setClientId(CID);

    client.pushMessageToSingle(message, target, function(err, res){
        console.log(res);
        if(err != null && err.exception != null && err.exception instanceof  RequestError){
            let requestId = err.exception.requestId;
            console.log(err.exception.requestId);
            client.pushMessageToSingle(message,target,requestId,function(err, res){
                console.log(err);
                console.log(res);
            });
        }
    });

}


exports.client = client;
