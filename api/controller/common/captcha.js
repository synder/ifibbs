/**
 * @author synder on 2017/3/1
 * @copyright
 * @desc 验证码
 */


const captchaModel = require('../../../public/model/ifibbs/captcha');

/***
 * @desc 发送短信验证码
 * */
exports.getSmsSecurityCode = function (req, res, next) {
    let phoneNumber = req.query.user_mobile;
    
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
                security_code_id: captcha ? captcha.uid : null,
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
    let phoneNumber = req.body.user_mobile;
    let smsSecurityCodeUid = req.body.security_code_id;
    
    captchaModel.verifySmsSecurityCode(smsSecurityCodeUid, phoneNumber, smsCode, 1000000, false, function (err, success) {
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