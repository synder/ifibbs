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
    let mobileNumber = req.query.mobile;
    
    if(!mobileNumber){
        return next(new BadRequestError('mobile is need'));
    }
    
    let regex = /^1[0-9]{10}$/;

    if(regex.test(mobileNumber.toString()) !== true){
        return next(new BadRequestError('mobile is illegal'));
    }

    captchaModel.sendSmsSecurityCode(mobileNumber, function (err, captchaID) {
        if(err){
            return next(err);
        }
        
        res.json({
            flag: '0000',
            msg: '',
            result: {
                code_id: captchaID
            }
        });
    });
};