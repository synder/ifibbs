/**
 * @desc 个推(http://www.getui.com/)
 * */

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
const client = new GeTui(HOST, APP_KEY, MASTER_SECRET);

/**
 * @desc 苹果推送
 * */
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


/**
 * iOS 推送动作模板支持点击通知打开应用模板、点击通知打开网页模板、透传消息模板
 * 由于在 iOS 中只有当应用启动时才能通过个推 SDK 进行推送(未启动应用时通过 APNs 进行推送)，
 * 而使用 LinkTemplate(点击通知打开网页模板)和 NotificationTemplate(点击通知打开应用模板)
 * 进行推送的话在客户端是以弹窗方式进行通知，因此不推荐在 iOS 上使用这两个推送动作模板。
 * 使用个推 SDK 的 TransmissionTemplate(透传消息模板)发送消息，其传输的数据最大为是 2KB，
 * 而 APNs 最大只支持 256Byte，因此建议 iOS 推送采用TransmissionTemplate(透传消 息模板)。
 * */


/**
 * @desc 推送打开应用通知，主要针对安卓，IOS无法实现离线下推送
 * */
exports.notifyClientToOpenApp = function (isIOS, clientID, title, summary, detail, callback) {
    
    let template = new NotificationTemplate({
        appId: APP_ID,
        appKey: APP_KEY,
        title: title,
        text: summary,
        logo: '',
        isRing: true,
        isVibrate: true,
        isClearable: true,
        transmissionType: 1,
        transmissionContent: detail
    });

    if(isIOS === true){

        let payload = new APNPayload();
        let alertMsg = new DictionaryAlertMsg();

        alertMsg.body = 'body';
        alertMsg.actionLocKey = 'actionLocKey';
        alertMsg.locKey = 'locKey';
        alertMsg.locArgs = ['locArgs'];
        alertMsg.launchImage = 'launchImage';

        //ios8.2以上版本支持
        alertMsg.title = 'title';
        alertMsg.titleLocKey = 'titleLocKey';
        alertMsg.titleLocArgs = ['titleLocArgs'];

        payload.alertMsg = alertMsg;
        payload.badge = 5;
        payload.contentAvailable = 1;
        payload.category = "";
        payload.sound = "";
        payload.customMsg.payload1 = 'payload';

        template.setApnInfo(payload);
    }

    const batch = client.getBatch();

    //个推信息体
    let message = new SingleMessage({
        isOffline: true,                        //是否离线
        offlineExpireTime: 3600 * 12 * 1000,    //离线时间
        data: template                          //设置推送消息类型
    });

    //接收方
    let target = new Target({
        appId: APP_ID,
        clientId: clientID
    });
    
    batch.add(message, target);

    batch.submit(function (err, res) {
        if(err){
            return batch.retry(function (err, res) {
                callback(err, res.info);
            });
        }
        
        if(res.result !== 'ok'){
            return batch.retry(function (err, res) {
                callback(err, res.info);
            });
        }
        
        callback(null, res.info);
    });
};


/**
 * @desc 推送打开网页通知，主要针对安卓，IOS无法实现离线推送
 * */
exports.notifyClientToOpenUrl = function (isIOS, clientID, title, summary, url, callback) {
    let template = new LinkTemplate({
        appId: APP_ID,
        appKey: APP_KEY,
        title: title,
        text: summary,
        logo: '',
        logoUrl: '',
        isRing: true,
        isVibrate: true,
        isClearable: true,
        url: url
    });

    if(isIOS === true){

        let payload = new APNPayload();
        let alertMsg = new DictionaryAlertMsg();

        alertMsg.body = 'body';
        alertMsg.actionLocKey = 'actionLocKey';
        alertMsg.locKey = 'locKey';
        alertMsg.locArgs = ['locArgs'];
        alertMsg.launchImage = 'launchImage';

        //ios8.2以上版本支持
        alertMsg.title = 'title';
        alertMsg.titleLocKey = 'titleLocKey';
        alertMsg.titleLocArgs = ['titleLocArgs'];

        payload.alertMsg = alertMsg;
        payload.badge = 5;
        payload.contentAvailable = 1;
        payload.category = "";
        payload.sound = "";
        payload.customMsg.payload1 = 'payload';

        template.setApnInfo(payload);
    }

    const batch = client.getBatch();

    //个推信息体
    let message = new SingleMessage({
        isOffline: true,                        //是否离线
        offlineExpireTime: 3600 * 12 * 1000,    //离线时间
        data: template                          //设置推送消息类型
    });

    //接收方
    let target = new Target({
        appId: APP_ID,
        clientId: clientID
    });

    batch.add(message, target);

    batch.submit(function (err, res) {
        if(err){
            return batch.retry(function (err, res) {
                callback(err, res.info);
            });
        }

        if(res.result !== 'ok'){
            return batch.retry(function (err, res) {
                callback(err, res.info);
            });
        }

        callback(null, res.info);
    });
};

/**
 * @desc 推送下载通知
 * */
exports.notifyClientToDownload = function (isIOS, clientID, title, content, icon, url, callback) {
    
    let template = new NotyPopLoadTemplate({
        appId: APP_ID,
        appKey: APP_KEY,
        notyTitle: title,
        notyContent: content,
        notyIcon: '',
        isRing: true,
        isVibrate: true,
        isClearable: true,
        popTitle: title,
        setPopContent: content,
        popImage: icon,
        popButton1: '下载',
        popButton2: '取消',
        loadIcon: '',
        loadUrl: url,
        loadTitle: title + '下载',
        autoInstall: false,
        actived: true
    });

    if(isIOS === true){

        let payload = new APNPayload();
        let alertMsg = new DictionaryAlertMsg();

        alertMsg.body = 'body';
        alertMsg.actionLocKey = 'actionLocKey';
        alertMsg.locKey = 'locKey';
        alertMsg.locArgs = ['locArgs'];
        alertMsg.launchImage = 'launchImage';

        //ios8.2以上版本支持
        alertMsg.title = 'title';
        alertMsg.titleLocKey = 'titleLocKey';
        alertMsg.titleLocArgs = ['titleLocArgs'];

        payload.alertMsg = alertMsg;
        payload.badge = 5;
        payload.contentAvailable = 1;
        payload.category = "";
        payload.sound = "";
        payload.customMsg.payload1 = 'payload';

        template.setApnInfo(payload);
    }

    const batch = client.getBatch();

    //个推信息体
    let message = new SingleMessage({
        isOffline: true,                        //是否离线
        offlineExpireTime: 3600 * 12 * 1000,    //离线时间
        data: template                          //设置推送消息类型
    });

    //接收方
    let target = new Target({
        appId: APP_ID,
        clientId: clientID
    });

    batch.add(message, target);

    batch.submit(function (err, res) {
        if(err){
            return batch.retry(function (err, res) {
                callback(err, res.info);
            });
        }

        if(res.result !== 'ok'){
            return batch.retry(function (err, res) {
                callback(err, res.info);
            });
        }

        callback(null, res.info);
    });
};


/**
 * @desc 推送穿透消息
 * */
exports.notifyTransmissionMsg = function (clientIDS, title, content, callback) {
    
    if(typeof content !== 'string'){
        content = JSON.stringify(content);
    }

    let template = new TransmissionTemplate({
        appId: APP_ID,
        appKey: APP_KEY,
        transmissionType: 1,
        transmissionContent: content
    });

    //个推信息体
    let message = new AppMessage({
        isOffline: false,
        offlineExpireTime: 3600 * 12 * 1000,
        data: template,
        appIdList: [APP_ID],
        speed: 10000
    });

    //for ios
    let payload = new APNPayload();
    let alertMsg = new DictionaryAlertMsg();

    alertMsg.body = title;
    alertMsg.actionLocKey = '';
    alertMsg.locKey = '';
    alertMsg.locArgs = [''];
    alertMsg.launchImage = '';

    //ios8.2以上版本支持
    alertMsg.title = title;
    alertMsg.titleLocKey = '';
    alertMsg.titleLocArgs = [''];

    payload.alertMsg = alertMsg;
    payload.badge = 5;
    payload.contentAvailable = 1;
    payload.category = "";
    payload.sound = "";
    payload.customMsg.payload1 = 'payload';

    template.setApnInfo(payload);

    //get batch
    const batch = client.getBatch();
    
    if(Array.isArray(clientIDS)){
        clientIDS.forEach(function (clientID) {
            //接收方
            let target = new Target({
                appId: APP_ID,
                clientId: clientID.toString()
            });

            batch.add(message, target);
        });
    }else{
        //接收方
        let target = new Target({
            appId: APP_ID,
            clientId: clientIDS.toString()
        });

        batch.add(message, target);
    }

    batch.submit(function (err, res) {
        if(err){
            return batch.retry(function (err, res) {
                callback(err, res.info);
            });
        }

        if(res.result !== 'ok'){
            return batch.retry(function (err, res) {
                callback(err, res.info);
            });
        }

        callback(null, res.info);
    });
};


/**
 * @desc 广播消息给所有APP客户端
 * */
exports.broadcastClientsToOpenApp = function (isIOS, title, summary, detail, callback) {
    
    let taskGroupName = null;
    
    let template = new NotificationTemplate({
        appId: APP_ID,
        appKey: APP_KEY,
        title: title,
        text: summary,
        logo: '',
        isRing: true,
        isVibrate: true,
        isClearable: true,
        transmissionType: 1,
        transmissionContent: detail
    });

    if(isIOS === true){

        let payload = new APNPayload();
        let alertMsg = new DictionaryAlertMsg();

        alertMsg.body = 'body';
        alertMsg.actionLocKey = 'actionLocKey';
        alertMsg.locKey = 'locKey';
        alertMsg.locArgs = ['locArgs'];
        alertMsg.launchImage = 'launchImage';

        //ios8.2以上版本支持
        alertMsg.title = 'title';
        alertMsg.titleLocKey = 'titleLocKey';
        alertMsg.titleLocArgs = ['titleLocArgs'];

        payload.alertMsg = alertMsg;
        payload.badge = 5;
        payload.contentAvailable = 1;
        payload.category = "";
        payload.sound = "";
        payload.customMsg.payload1 = 'payload';

        template.setApnInfo(payload);
    }

    //个推信息体
    let message = new AppMessage({
        isOffline: false,
        offlineExpireTime: 3600 * 12 * 1000,
        data: template,
        appIdList: [APP_ID],
        speed: 1000
    });

    client.pushMessageToApp(message, taskGroupName, function (err, res) {
        
        if(err){
            return callback(err);
        }
        
        if(res.result === 'ok'){
            return callback(null, res.contentId);
        }
        
        callback(new Error(res.result));
    });
};

/**
 * @desc 广播消息给所有APP客户端
 * */
exports.broadcastClientsToOpenUrl = function (isIOS, title, summary, url, callback) {
    
    let taskGroupName = null;
    
    let template = new LinkTemplate({
        appId: APP_ID,
        appKey: APP_KEY,
        title: title,
        text: summary,
        logo: '',
        logoUrl: '',
        isRing: true,
        isVibrate: true,
        isClearable: true,
        url: url
    });

    //个推信息体
    let message = new AppMessage({
        isOffline: false,
        offlineExpireTime: 3600 * 12 * 1000,
        data: template,
        appIdList: [APP_ID],
        speed: 10000
    });

    if(isIOS === true){

        let payload = new APNPayload();
        let alertMsg = new DictionaryAlertMsg();

        alertMsg.body = 'body';
        alertMsg.actionLocKey = 'actionLocKey';
        alertMsg.locKey = 'locKey';
        alertMsg.locArgs = ['locArgs'];
        alertMsg.launchImage = 'launchImage';

        //ios8.2以上版本支持
        alertMsg.title = 'title';
        alertMsg.titleLocKey = 'titleLocKey';
        alertMsg.titleLocArgs = ['titleLocArgs'];

        payload.alertMsg = alertMsg;
        payload.badge = 5;
        payload.contentAvailable = 1;
        payload.category = "";
        payload.sound = "";
        payload.customMsg.payload1 = 'payload';

        template.setApnInfo(payload);
    }


    client.pushMessageToApp(message, taskGroupName, function (err, res) {

        if(err){
            return callback(err);
        }

        if(res.result === 'ok'){
            return callback(null, res.contentId);
        }

        callback(new Error(res.result));
    });
};

/**
 * @desc 广播消息给所有APP客户端
 * */
exports.broadcastClientsToDownload = function (isIOS, title, content, icon, url, callback) {
    let taskGroupName = null;
    
    let template = new NotyPopLoadTemplate({
        appId: APP_ID,
        appKey: APP_KEY,
        notyTitle: title,
        notyContent: content,
        notyIcon: '',
        isRing: true,
        isVibrate: true,
        isClearable: true,
        popTitle: title,
        setPopContent: content,
        popImage: icon,
        popButton1: '下载',
        popButton2: '取消',
        loadIcon: '',
        loadUrl: url,
        loadTitle: title + '下载',
        autoInstall: false,
        actived: true
    });

    //个推信息体
    let message = new AppMessage({
        isOffline: false,
        offlineExpireTime: 3600 * 12 * 1000,
        data: template,
        appIdList: [APP_ID],
        speed: 10000
    });

    if(isIOS === true){

        let payload = new APNPayload();
        let alertMsg = new DictionaryAlertMsg();

        alertMsg.body = 'body';
        alertMsg.actionLocKey = 'actionLocKey';
        alertMsg.locKey = 'locKey';
        alertMsg.locArgs = ['locArgs'];
        alertMsg.launchImage = 'launchImage';

        //ios8.2以上版本支持
        alertMsg.title = 'title';
        alertMsg.titleLocKey = 'titleLocKey';
        alertMsg.titleLocArgs = ['titleLocArgs'];

        payload.alertMsg = alertMsg;
        payload.badge = 5;
        payload.contentAvailable = 1;
        payload.category = "";
        payload.sound = "";
        payload.customMsg.payload1 = 'payload';

        template.setApnInfo(payload);
    }


    client.pushMessageToApp(message, taskGroupName, function (err, res) {

        if(err){
            return callback(err);
        }

        if(res.result === 'ok'){
            return callback(null, res.contentId);
        }

        callback(new Error(res.result));
    });
};

/**
 * @desc 广播消息给所有APP客户端
 * */
exports.broadcastTransmissionMsg = function (isIOS, content, callback) {
    
    let taskGroupName = null;
    let template = new TransmissionTemplate({
        appId: APP_ID,
        appKey: APP_KEY,
        transmissionType: 1,
        transmissionContent: content
    });

    //个推信息体
    let message = new AppMessage({
        isOffline: false,
        offlineExpireTime: 3600 * 12 * 1000,
        data: template,
        appIdList: [APP_ID],
        speed: 10000
    });

    if(isIOS === true){

        let payload = new APNPayload();
        let alertMsg = new DictionaryAlertMsg();

        alertMsg.body = 'body';
        alertMsg.actionLocKey = 'actionLocKey';
        alertMsg.locKey = 'locKey';
        alertMsg.locArgs = ['locArgs'];
        alertMsg.launchImage = 'launchImage';

        //ios8.2以上版本支持
        alertMsg.title = 'title';
        alertMsg.titleLocKey = 'titleLocKey';
        alertMsg.titleLocArgs = ['titleLocArgs'];

        payload.alertMsg = alertMsg;
        payload.badge = 5;
        payload.contentAvailable = 1;
        payload.category = "";
        payload.sound = "";
        payload.customMsg.payload1 = 'payload';

        template.setApnInfo(payload);
    }


    client.pushMessageToApp(message, taskGroupName, function (err, res) {

        if(err){
            return callback(err);
        }

        if(res.result === 'ok'){
            return callback(null, res.contentId);
        }

        callback(new Error(res.result));
    });
};