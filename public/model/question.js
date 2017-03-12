/**
 * @author synder on 2017/2/18
 * @copyright
 * @desc
 */

const async = require('async');
const ifibbs = require('../service/mongodb').ifibbs;
const elasticsearch = require('../service/elasticsearch').client;
const rabbit = require('../service/rabbit');

const User = ifibbs.model('User');
const Question = ifibbs.model('Question');
const UserDynamic = ifibbs.model('UserDynamic');

/**
 * @desc 新建问题
 * */
exports.createNewQuestion = function (userID, question, callback) {

    let now = new Date();

    let questionDoc = {
        status: Question.STATUS.NORMAL,
        tags: question.tags,
        title: question.title,
        describe: question.describe,
        answer_count: 0,
        favour_count: 0,
        attention_count: 0,
        collect_count: 0,
        create_user_id: userID,
        create_time: now,
        update_time: now,
    };

    async.parallel({
        //创建问题
        question: function (cb) {
            Question.create(questionDoc, cb);
        },
        //查找用户信息
        user: function (cb) {
            User.findOne({_id: userID}, cb);
        },
    }, function (err, results) {

        if (err) {
            return callback(err);
        }

        let question = results.question;
        let user = results.user;

        if (!question) {
            return callback(null);
        }

        if (!user) {
            return callback(null);
        }

        let questionID = question._id.toString();


        async.parallel({
            createElasticSearchDoc: function (cb) {
                //在搜索引擎中创建索引
                let elasticDoc = {
                    title: questionDoc.title,
                    describe: questionDoc.describe,
                    tags: questionDoc.tags,
                    create_time: questionDoc.create_time,
                    update_time: questionDoc.update_time,
                    create_user_id: userID,
                    create_user_name: user.user_name,
                    create_user_avatar: user.user_avatar,
                };

                elasticsearch.create({
                    index: elasticsearch.indices.question,
                    type: elasticsearch.indices.question,
                    id: questionID.toString(),
                    body: elasticDoc
                }, cb);
            },
            insertUserDynamic: function (cb) {
                //插入用户动态
                UserDynamic.create({
                    status: UserDynamic.STATUS.ENABLE,
                    type: UserDynamic.TYPES.PUBLISH_QUESTION,
                    user_id: userID,
                    question: questionID,
                    create_time: new Date(),
                    update_time: new Date(),
                }, cb);
            },
        }, function (err, results) {
            if (err) {
                return callback(err);
            }

            callback(null, questionID);
        });
    });
};

/**
 * @desc 删除用户提问
 * */
exports.removeUserQuestion = function (questionID, callback) {

    let condition = {
        _id: questionID,
        status: Question.STATUS.NORMAL,
    };

    let update = {
        $set: {
            status: Question.STATUS.REMOVED,
            update_time: new Date(),
        }
    };

    Question.update(condition, update, function (err, result) {
        if (err) {
            return callback(err);
        }

        if (result.nModified !== 1) {
            return callback(null, false);
        }

        elasticsearch.delete({
            index: elasticsearch.indices.question,
            type: elasticsearch.indices.question,
            id: questionID.toString()
        }, function (err, results) {

            if (err && err.status != 404) {
                return callback(err);
            }

            callback(null, true);
        });
    });
};

/**
 * @desc 获取用户的问题列表
 * */
exports.getQuestionList = function (userID, pageSkip, pageSize, callback) {

    let condition = {
        create_user_id: userID
    };

    async.parallel({
        count: function (cb) {
            Question.count(condition, cb);
        },

        questions: function (cb) {
            Question
                .find(condition)
                .sort('create_time _id')
                .skip(pageSkip)
                .limit(pageSize).exec(cb);
        }
    }, callback);
};

/**
 * @desc 获取推荐问题列表
 * */
exports.getRecommendQuestionList = function (pageSkip, pageSize, callback) {

    let condition = {
        status: Question.STATUS.NORMAL
    };

    async.parallel({
        count: function (cb) {
            Question.count(condition, cb);
        },

        questions: function (cb) {
            Question
                .find(condition)
                .sort('answer_count favour_count attention_count create_time')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback);
};


/**
 * @desc 获取问题详情
 * */
exports.getQuestionDetail = function (questionID, callback) {

    let condition = {
        _id: questionID,
    };

    Question.findOne(condition, callback);
};


/**
 * @desc 根据问题、问题描述搜索问题
 * */
exports.searchQuestionByAttribute = function (content, pageSkip, pageSize, callback) {

    elasticsearch.search({
        index: elasticsearch.indices.question,
        body: {
            query: {
                multi_match: {
                    query: content,
                    fields: ['title', 'describe']
                }
            },
            highlight: {
                fields: {
                    title: {"pre_tags": ["<font color='red' size='20'>"], "post_tags": ["</font>"]},
                    describe: {"pre_tags": ["<font color='red' size='20'>"], "post_tags": ["</font>"]}
                }
            }
        }
    }, function (err, response) {

        if (err) {
            return callback(err);
        }

        let total = response.hits.total;
        let hits = response.hits.hits;

        let questions = hits.map(function (hit) {

            let title = hit.highlight.title ? hit.highlight.title.join() : hit._source.title;
            let describe = hit.highlight.describe ? hit.highlight.describe.join() : hit._source.describe;

            return {
                question_id: hit._id,
                question_tags: hit._source.tags,
                question_title: title,
                question_describe: describe,
                create_user_id: hit._source.create_user_id,
                create_user_name: hit._source.create_user_name,
                create_user_avatar: hit._source.create_user_avatar,
                create_time: hit._source.create_time,
                update_time: hit._source.update_time,
            };
        });


        callback(null, {
            count: total,
            questions: questions
        });
    });
};

/**
 * @desc 根据问题回答搜索问题
 * */
exports.searchQuestionByAnswer = function (content, pageSkip, pageSize, callback) {
    elasticsearch.search({
        index: elasticsearch.indices.answer,
        body: {
            query: {
                match: {
                    content: content
                }
            },
            highlight: {
                fields: {
                    content: {"pre_tags": ["<font color='red' size='20'>"], "post_tags": ["</font>"]},
                }
            }
        }
    }, function (err, response) {
        if (err) {
            return callback(err);
        }

        let total = response.hits.total;
        let hits = response.hits.hits;

        let ids = [];

        hits.forEach(function (hit) {
            ids.push(hit._source.question_id);
        });

        Question.find({_id: {$in: ids}})
            .populate('create_user_id')
            .exec(function (err, questions) {
                if (err) {
                    return callback(err);
                }

                callback(null, {
                    count: total,
                    questions: questions
                });
            });
    });

};
