/**
 * @author synder on 2017/3/12
 * @copyright
 * @desc @desc
 */

const ifibbsRedis = require('../../../public/service/redis').ifibbs;

exports.init = function (callback) {
    ifibbsRedis.flushall(callback);
};
