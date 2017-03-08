/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */


const userModel = require('../../../public/model/user');

const NODE_ENV = process.env.NODE_ENV;

/**
 * 对分页参数进行修正, 防止被攻击
 * */
module.exports = function () {
    return function (req, res, next) {

        req.session = {};



        let token = null;
        let now = Date.now();

        if(req.method === 'GET'){
            token = req.query.token;
        }else{
            token = req.body.token;
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


        userModel.getUserLoginToken(token,function (err, session) {
            if(err){
                return next();
            }

            req.session = session;
            next();
        });


    }
};