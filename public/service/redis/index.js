/**
 * @author synder on 2017/2/18
 * @copyright
 * @desc
 */


const redis = require('redis');

const config = require('../config');

if(!config && !config.redis && config.redis.ifibbs){
    throw new Error('please provide mongodb config');
}

const IFIBBS_CONFIG = config.redis.ifibbs;

const REDIS_CONFIG = {
    host: IFIBBS_CONFIG.host,
    port: IFIBBS_CONFIG.port || 6379,
    db: IFIBBS_CONFIG.db || 0
};

if(IFIBBS_CONFIG.password){
    REDIS_CONFIG.password = IFIBBS_CONFIG.password;
}

const IFIBBS_CLIENT = redis.createClient(REDIS_CONFIG);

IFIBBS_CLIENT.on('error', function (err) {
    console.error(err.stack);
});

exports.ifibbs = IFIBBS_CLIENT;