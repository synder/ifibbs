/**
 * @author synder on 2017/3/12
 * @copyright
 * @desc
 */


const elasticsearch = require('../../../public/service/elasticsearch');

exports.init = function (callback) {
    elasticsearch.init(callback);
};
