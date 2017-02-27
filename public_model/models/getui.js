/**
 * @author synder on 2017/2/24
 * @copyright
 * @desc
 */

const async = require('async');
const mongodb = require('../public_service/mongodb').db;

const UserGeTuiMapping = mongodb.model('UserGeTuiMapping');

/**
 * @desc 创建新的设备记录
 * */
exports.createNewGeTuiMapping = function (userID, getui, callback) {
    
    let getuiAppID = getui.getuiAppID;
    let getuiClientID = getui.getuiClientID;
    let deviceToken = getui.deviceToken;

    let condition = {
        getui_client_id: getui.getuiClientID
    };
    
    if(getui.devicePlatform !==  'ios' && getui.devicePlatform !==  'android'){
        return callback(new Error('platform should be ios or android'));
    }
    
    let devicePlatform = UserGeTuiMapping.PLATFORM.IOS;
    
    if(getui.devicePlatform ===  'android'){
        devicePlatform = UserGeTuiMapping.PLATFORM.ANDROID;
    }

    let update = {
        getui_app_id: getuiAppID,
        getui_client_id: getuiClientID,
        device_token: deviceToken,
        device_platform: devicePlatform,
        create_time: new Date(),
        update_time: new Date(),
        belong_user_id: userID,
    };

    UserGeTuiMapping.update(condition, update, {upsert: true}, callback);
};