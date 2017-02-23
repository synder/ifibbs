/**
 * @author synder on 2017/2/18
 * @copyright
 * @desc
 */



const elasticsearch = require('elasticsearch');

const indices = require('./indices');

const config = global.config || require('../../config');

if(!config.service && !config.service.elasticsearch && !config.service.elasticsearch.host){
    throw new Error('please provide elasticsearch config');
}

const host = config.service.elasticsearch.host;
const port = config.service.elasticsearch.port || 9200;
const log = config.service.elasticsearch.log || 'error'; 

const elasticSearchClient = new elasticsearch.Client({
    host: host + ':' + port,
    log: log
});

indices.initIndices(elasticSearchClient);

elasticSearchClient.indices = indices.indices;

exports.client = elasticSearchClient;


