/**
 * @author synder on 2017/2/24
 * @copyright
 * @desc
 */


const async = require('async');
const ifibbsMongodb = require('../service/mongodb/ifibbs').client;

const UserDevice = ifibbsMongodb.model('UserDevice');

/**
 * @desc 创建新的设备记录
 * */
exports.createNewDevice = function (userID, device, callback) {
    
    let condition = {
        device_token: device.deviceToken
    };

    let update = {
        device_token: device.deviceToken || 'unknown',
        device_platform: device.devicePlatform || "unknown",
        device_resolution: device.deviceResolution || [0, 0],
        device_brand: device.deviceBrand || "unknown",
        device_version: device.deviceVersion || "unknown",
        create_time: new Date(),
        update_time: new Date(),
        belong_user_id: userID,
    };

    UserDevice.update(condition, update, {upsert: true}, callback);
};