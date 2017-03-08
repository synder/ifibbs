/**
 * @author synder on 2017/3/3
 * @copyright
 * @desc 验证码
 */

const uuid = require('uuid/v4');
const mongodb = require('../service/mongodb').db;
const redis = require('../service/redis').client;
const sms = require('../service/sms').client;

const SecurityCode = mongodb.model('SecurityCode');

const genSmsCodeFrequencyKey = function (phone) {
    return 'SSC:' + phone;
};


/**
 * @desc 发送验证码
 * */
exports.sendSmsSecurityCode = function (phone, callback) {
    
    let code = Math.random().toString().substr(2, 6);
    let message = `【网金院】您的验证码：${code}，打死都不告诉别人`;
    
    let now = Date.now();
    let frequency = 60000; //发送频率
    let expireTime = Date.now() + 1800000;

    let securityCodeDoc = {
        uid          : uuid(),
        status       : SecurityCode.STATUS.ENABLE,
        mobile       : phone,
        code         : code,
        use_count    : 0,
        expire_time  : expireTime,
        create_time  : now,
        update_time  : now,
    };
    
    //发送频率验证
    let key = genSmsCodeFrequencyKey(phone);
    
    redis.get(key, function (err, val) {
        
        if(err){
            return callback(err);
        }
        
        if(val){
            return callback(null, null);
        }

        SecurityCode.create(securityCodeDoc, function (err, doc) {
            if(err){
                return callback(err);
            }

            if(!doc){
                return callback(new Error('sms security code save failed'));
            }

            sms.send(message, function (err, result) {
                if(err){
                    return callback(err);
                }

                if(result !== true){
                    return callback(new Error('sms security code send failed'));
                }
                
                redis.setex(key, code, frequency, function (err, ok) {
                    if(err){
                        return callback(err);
                    }

                    callback(null, doc);
                });
            });
        });
    });
};

/**
 * @desc 查找验证码
 * @param codeID 短信ID
 * @param phoneNumber 手机号
 * @param smsCode 短信验证码
 * @param maxVerifyCount 最大验证次数
 * @param isLast 是否是最后一次验证
 * @param callback
 * */
exports.verifySmsSecurityCode = function (codeID, phoneNumber, smsCode, maxVerifyCount, isLast, callback) {
    
    let condition = {
        uid: codeID,
        mobile: phoneNumber,
        code: smsCode,
        status: SecurityCode.STATUS.ENABLE,
        use_count: {$lt: maxVerifyCount},
        expire_time: {$gt: new Date()},
    };


    let update = {
        $inc: {use_count: 1}
    };

    if(isLast){
        update = {
            $set: {
                status: SecurityCode.STATUS.DISABLED,
            }
        }
    }
    
    SecurityCode.update(condition, update, function (err, result) {
        if(err){
            return callback(err);
        }
        
        callback(null, result.nModified === 1);
    });
};