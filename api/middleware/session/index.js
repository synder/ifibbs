/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */


const userModel = require('../../../public/ifibbs/user');

const NODE_ENV = process.env.NODE_ENV;

/**
 * 对分页参数进行修正, 防止被攻击
 * */
module.exports = function () {
    return function (req, res, next) {

        req.session = {};

        let token = null;
        let now = Date.now();

        if(req.method === 'GET' || req.method === 'DELETE'){
            token = req.query.login_token;
        }else{
            token = req.body.login_token;
        }
        
        token = token ? token.trim() : null;

        if(!token && (NODE_ENV === 'pre' || NODE_ENV === 'dev')){
            req.session = {
                id: '58aa50177ddbf5507c51f082',
                username: 'synder',
                expire: Date.now() + 100000000
            };
            return next();
        }
        
        if(!token){
            return next();
        }
        
        userModel.getUserLoginToken(token,function (err, session) {
            if(err){
                return next();
            }
            
            if(session){
                req.session = session;
            }
            
            next();
        });


    }
};