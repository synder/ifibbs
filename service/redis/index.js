/**
 * @author synder on 2017/2/18
 * @copyright
 * @desc
 */


const redis = require('redis');

const config = global.config || require('../../config');

if(!config.service && !config.service.redis && config.service.redis.host){
    throw new Error('please provice mongodb config');
}

const redisConfig = {
    host: config.service.redis.host,
    port: config.service.redis.port || 6379,
    db: config.service.redis.db || 0
};

if(config.service.redis.password){
    redisConfig.password = config.service.redis.password;
}

const client = redis.createClient(redisConfig);

client.on('error', function (err) {
    console.error(err.stack);
});

exports.client = client;