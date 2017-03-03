/**
 * @author synder on 2017/3/3
 * @copyright
 * @desc 验证码
 */
const async = require('async');
const mongodb = require('../service/mongodb').db;
const sms = require('../service/sms').client;

const SecurityCode = mongodb.model('SecurityCode');


/**
 * @desc 发送验证码
 * */
exports.sendSmsSecurityCode = function (phone, callback) {
    
    let code = Math.random().toString().substr(2, 6);
    let msg = '短信验证码是:' + code;
    let random = Math.random() + '';
    let now = new Date();
    let expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 30);

    let securityCodeDoc = {
        status       : SecurityCode.STATUS.ENABLE,   //验证码状态
        random       : random,       //随机串
        mobile       : phone,        //手机号码
        code         : code,         //验证码
        use_count    : 0,            //已验证次数
        expire_time  : expireTime,   //过期时间
        create_time  : now,          //创建时间
        update_time  : now,          //更新次数
    };

    SecurityCode.create(securityCodeDoc, function (err, doc) {
        if(err){
            return callback(err);
        }
        
        if(!doc){
            return callback(new Error('sms security code save failed'));
        }

        sms.send(msg, function (err, result) {
            if(err){
                return callback(err);
            }

            if(result !== true){
                return callback(new Error('sms security code send failed'));
            }
            
            callback(null, doc);
        });
    });
    
    
};


/**
 * @desc 查找验证码
 * */
exports.verifySmsSecurityCode = function (codeID, phoneNumber, smsCode, randomString, maxVerifyCount, callback) {
    
    let condition = {
        _id: codeID,
        mobile: phoneNumber,
        code: smsCode,
        random: randomString,
        status: SecurityCode.STATUS.ENABLE,
        use_count: {$lt: maxVerifyCount}
    };
    
    let update = {
        $set: {
            $inc: {use_count: 1}
        }
    };
    
    SecurityCode.update(condition, update, function (err, result) {
        if(err){
            return callback(err);
        }
        
        callback(null, result.nModified === 1);
    });
};