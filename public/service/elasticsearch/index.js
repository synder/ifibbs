/**
 * @author synder on 2017/2/18
 * @copyright
 * @desc elastic search 搜索引擎
 */

const async = require('async');
const elasticsearch = require('elasticsearch');

const question = require('./ifibbs/question');
const tags = require('./ifibbs/tags');
const answer = require('./ifibbs/answer');
const article = require('./ifibbs/article');
const subject = require('./ifibbs/subject');

const config = require('../config');

if(!config && !config.elasticsearch && !config.elasticsearch.ifibbs){
    throw new Error('please provide elasticsearch config');
}

const IFIBBS_CONFIG = config.elasticsearch.ifibbs;

const host = IFIBBS_CONFIG.host;
const port = IFIBBS_CONFIG.port || 9200;
const log = IFIBBS_CONFIG.log || 'error'; 

const IFIBBS_CLIENT = new elasticsearch.Client({
    host: host + ':' + port,
    log: log
});

//保存原来的indices对象，然后覆盖原来的indices对象，防止index被误删除
const indices = IFIBBS_CLIENT.indices;

IFIBBS_CLIENT.indices = {
    question: question.index,
    tags: tags.index,
    answer: answer.index,
    article: article.index,
    subject: subject.index,
};

exports.ifibbs = IFIBBS_CLIENT;

exports.ifibbs.init_index = function init(callback) {
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
    ], callback);
};

if(process.env.INIT_ELASTIC === 'yes'){
    init(function (err, res) {
        if(err){
            console.error(err.stack);
        }
        
        console.log(res);
    });
}
