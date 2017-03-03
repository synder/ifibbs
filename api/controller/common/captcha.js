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

    if(!/^1[0-9]{10}$/.test(phoneNumber)){
        return next(new BadRequestError('phone is illegal'));
    }

    captchaModel.sendSmsSecurityCode(phoneNumber, function (err, captchaID) {
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