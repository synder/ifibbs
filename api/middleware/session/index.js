/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */


const userModel = require('../../../public/model/ifibbs/user');

const NODE_ENV = process.env.NODE_ENV;

/**
 * 对分页参数进行修正, 防止被攻击
 * */
module.exports = function () {
    return function (req, res, next) {

        req.session = {};

        let token = null;

        if(req.method === 'GET' || req.method === 'DELETE'){
            token = req.query.login_token;
        }else{
            token = req.body.login_token;
        }
        
        token = token ? token.trim() : null;

        if(!token){
            return next();
        }
        
        userModel.getUserLoginToken(token, function (err, session) {
            if(err){
                logger.error(err);
                return next();
            }
            
            if(session){
                req.session = session;
            }
            
            next();
        });


    }
};