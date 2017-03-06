/**
 * @author synder on 2017/2/18
 * @copyright
 * @desc
 */


const redis = require('redis');

const config = require('../config');

if(!config && !config.redis && config.redis.host){
    throw new Error('please provide mongodb config');
}

const redisConfig = {
    host: config.redis.host,
    port: config.redis.port || 6379,
    db: config.redis.db || 0
};

if(config.redis.password){
    redisConfig.password = config.redis.password;
}

const client = redis.createClient(redisConfig);

client.on('error', function (err) {
    console.error(err.stack);
});

exports.client = client;