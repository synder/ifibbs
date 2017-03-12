/**
 * @author synder on 2017/2/18
 * @copyright
 * @desc elastic search 搜索引擎
 */

const async = require('async');
const elasticsearch = require('elasticsearch');

const question = require('./indices/question');
const tags = require('./indices/tags');
const answer = require('./indices/answer');
const article = require('./indices/article');
const subject = require('./indices/subject');

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

//保存原来的indices对象，然后覆盖原来的indices对象，防止index被误删除
const indices = elasticSearchClient.indices;

elasticSearchClient.indices = {
    question: question.index,
    tags: tags.index,
    answer: answer.index,
    article: article.index,
    subject: subject.index,
};

exports.client = elasticSearchClient;

if(process.env.INIT_ELASTIC === 'yes'){

    let initIndexMapping = function (mapping, callback) {
        indices.delete({
            index: mapping.index,
            body: {}
        }, function (err, result) {
            
            if(err && err.status != 404){
                if(err){
                    return callback(err);
                }
            }
            
            indices.create(mapping, callback);
        });
    };

    async.parallel([
        function (cb) {
            initIndexMapping(question, cb);
        },
        function (cb) {
            initIndexMapping(tags, cb);
        },
        function (cb) {
            initIndexMapping(answer, cb);
        },
        function (cb) {
            initIndexMapping(subject, cb);
        },
        function (cb) {
            initIndexMapping(article, cb);
        },
    ], function (err, results) {
        if(err){
            return console.log(err);
        }

        console.log(results);
    });
}
