/**
 * @author synder on 2017/3/12
 * @copyright
 * @desc
 */


const ifibbsElasticsearch = require('../../../public/service/elasticsearch/ifibbs');

exports.init = function (callback) {
    ifibbsElasticsearch.init(callback);
};
