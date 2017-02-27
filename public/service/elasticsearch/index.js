/**
 * @author synder on 2017/2/18
 * @copyright
 * @desc
 */


const elasticsearch = require('elasticsearch');

const indices = require('./indices');

const config = require('../config');

if(!config && !config.elasticsearch && !config.elasticsearch.host){
    throw new Error('please provide elasticsearch config');
}

const host = config.elasticsearch.host;
const port = config.elasticsearch.port || 9200;
const log = config.elasticsearch.log || 'error'; 

const elasticSearchClient = new elasticsearch.Client({
    host: host + ':' + port,
    log: log
});

indices.initIndices(elasticSearchClient);

elasticSearchClient.indices = indices.indices;

exports.client = elasticSearchClient;


