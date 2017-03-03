/**
 * @author synder
 * @date 16/1/10
 * @desc
 */

const captcha = require('../../controller/common/captcha');


exports.map = function (app) {
    
    app.get('/common/sms/code', captcha.getSmsSecurityCode);      //获取短信验证码
    
};