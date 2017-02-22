/**
 * @author synder on 2017/2/18
 * @copyright
 * @desc
 */

const redis = require('../../service/redis').client;

const NODE_ENV = process.env.NODE_ENV;

/**
 * @desc 检测用户是否登录
 * */
exports.check = function (req, res, next) {
    
    if(!req.session.id){
        return res.json({
            flag: '0001',
            msg: 'this interface need login, please login and then retry',
            result: null
        });
    }
    
    next();
    
};  