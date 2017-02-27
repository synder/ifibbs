/**
 * @author synder on 2017/2/18
 * @copyright
 * @desc
 */

const async = require('async');

const question = require('./question');
const tags = require('./tags');
const answer = require('./answer');
const article = require('./article');
const subject = require('./subject');


exports.initIndices = function (elasticSearchClient) {
    let INIT_ELASTIC_SEARCH = process.env.INIT_ELASTIC;

    if(INIT_ELASTIC_SEARCH === 'yes'){

        let initIndexMapping = function (mapping, callback) {
            elasticSearchClient.indices.delete({
                index: mapping.index,
                body: {}
            }, function (err, result) {
                if(err){
                    return cb(err);
                }
                elasticSearchClient.indices.create(mapping, callback);
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
};

exports.indices = {
    question: question.index,
    tags: tags.index,
    answer: answer.index,
    article: article.index,
    subject: subject.index,
};