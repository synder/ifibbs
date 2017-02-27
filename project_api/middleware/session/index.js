/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */


const redis = require('../../service/redis').client;

const NODE_ENV = process.env.NODE_ENV;

/**
 * 对分页参数进行修正, 防止被攻击
 * */
module.exports = function () {
    return function (req, res, next) {

        req.session = {};

        if(NODE_ENV === 'dev'){
            req.session = {
                id: '58aa50177ddbf5507c51f082',
                username: 'synder',
                expire: Date.now() + 100000000
            };

            return next();
        }

        let token = null;
        let now = Date.now();

        if(req.method === 'GET'){
            token = req.query.token;
        }else{
            token = req.body.token;
        }
        
        token = token ? token.trim() : null;
        
        if(!token){
            return next();
        }

        //从redis用户信息
        redis.get(token, function (err, session) {
            if(err){
                return next(err);
            }
            
            if(!session){
                return next();
            }

            if(session && session.id){
                
                let temp = session.expire - now;
                
                
                if(temp < 0){
                    return next();
                }

                req.session = {
                    id: session.id,
                    username: session.user_name,
                    expire: session.expire,
                };


                if(temp > 70000000){
                    return next();
                }
                
                //更新token
                let expire = new Date();
                expire.setDate(expire.getDate() + 30);

                session.expire = expire;

                let ttl = (expire.valueOf() - now) / 1000;

                redis.setex(token, session, ttl, function (err, result) {
                    if(err){
                        logger.error(err.stack);
                    }
                    
                    next();
                });
            }
        });
    }
};