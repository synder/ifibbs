/**
 * @author synder on 2017/2/24
 * @copyright
 * @desc
 */

const async = require('async');

const deviceModel = require('../../model/device');
const getuiModel = require('../../model/getui');

/**
 * @desc 上报用户设备信息
 * */
exports.reportUserDeviceInfo = function(req, res, next){
    
    let userID = req.session.id;
    
    //设备信息
    let  deviceToken = req.body.device_token;
    let  devicePlatform = req.body.device_platform;
    let  deviceResolution = req.body.device_resolution;
    let  deviceBrand = req.body.device_brand;
    let  deviceVersion = req.body.device_version;
    let  getuiAppID = req.body.getui_app_id;
    let  getuiClientID = req.body.getui_client_id;
    
    async.parallel({
        //保存设备信息
        createDeviceInfo: function(cb) { 
            deviceModel.createNewDevice(userID, {
                deviceToken: deviceToken,
                devicePlatform: devicePlatform,
                deviceResolution: deviceResolution,
                deviceBrand: deviceBrand,
                deviceVersion: deviceVersion,
            }, cb);
        },
        
        //保存个推的映射信息
        createGetuiMapping: function(cb) { 
            getuiModel.createNewGeTuiMapping(userID, {
                deviceToken: deviceToken,
                devicePlatform: devicePlatform,
                deviceVersion: deviceVersion,
                getuiAppID: getuiAppID,
                getuiClientID: getuiClientID,
            }, cb)
        },
    }, function (err, results) {
    
        if(err){
             return next(err);
        }
        
        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: true
            }
        });
    });
};