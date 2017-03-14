/**
 * @author synder on 2017/3/3
 * @copyright
 * @desc 验证码
 */

const uuid = require('uuid/v4');
const ifibbsMongodb = require('../../service/mongodb/ifibbs').client;
const ifibbsRedis = require('../../service/redis/ifibbs').client;
const ifibbsSms = require('../../service/sms/ifibbs').client;

const SecurityCode = ifibbsMongodb.model('SecurityCode');

const genSmsCodeFrequencyKey = function (phone) {
    return 'SSC:' + phone;
};


/**
 * @desc 发送验证码
 * */
exports.sendSmsSecurityCode = function (phone, callback) {
    
    let code = Math.random().toString().substr(2, 6);
    let message = `您的验证码：${code}，打死都不告诉别人`;
    
    let now = Date.now();
    let frequency = 60; //发送频率S
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
    
    ifibbsRedis.get(key, function (err, val) {

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

            let condition = {
                uid: doc.uid,
            };

            let update = {
                $set: {
                    status: SecurityCode.STATUS.DISABLED,
                }
            };
            ifibbsSms.send(phone, message, function (err, result) {
                if(err){
                    SecurityCode.update(condition, update);
                    return callback(err);
                }

                if(!result){
                    SecurityCode.update(condition, update);
                    return callback(new Error('sms security code send failed'));
                }

                ifibbsRedis.setex(key, frequency, code, function (err, ok) {
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