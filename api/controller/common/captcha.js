/**
 * @author synder on 2017/3/1
 * @copyright
 * @desc 验证码
 */


const captchaModel = require('../../../public/model/captcha');

/***
 * @desc 发送短信验证码
 * */
exports.getSmsSecurityCode = function (req, res, next) {
    let phoneNumber = req.query.phone;
    
    if(!phoneNumber){
        return next(new BadRequestError('mobile is need'));
    }
    
    let regex = /^1[0-9]{10}$/;

    if(regex.test(phoneNumber.toString()) !== true){
        return next(new BadRequestError('mobile is illegal'));
    }

    captchaModel.sendSmsSecurityCode(phoneNumber, function (err, captcha) {
        if(err){
            return next(err);
        }
        
        res.json({
            flag: '0000',
            msg: '',
            result: {
                uid: captcha ? captcha.uid : null,
                msg: captcha ? null : '验证码发送失败'
            }
        });
    });
};

/**
 * @desc 验证验证码是否正确
 * */
exports.verifySmsSecurityCode = function (req, res, next) {
    let smsCode = req.body.code;
    let phoneNumber = req.body.phone;
    let smsCodeUid = req.body.uid;
    
    captchaModel.verifySmsSecurityCode(smsCodeUid, phoneNumber, smsCode, 1000000, false, function (err, success) {
       if(err){
           return next(err);
       } 
       
       res.json({
           flag: '0000',
           msg: '',
           result: {
               ok: !!success
           }
       });
    });
    
};