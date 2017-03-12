/**
 * @author synder on 2017/3/12
 * @copyright
 * @desc @desc
 */

const redis = require('../../../public/service/redis').client;

exports.init = function (callback) {
    redis.flushall(callback);
};
