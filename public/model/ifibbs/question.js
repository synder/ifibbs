/**
 * @author synder on 2017/2/18
 * @copyright
 * @desc
 */

const async = require('async');
const ifibbsMongodb = require('../../service/mongodb/ifibbs').client;
const ifibbsElasticsearch = require('../../service/elasticsearch/ifibbs').client;

const User = ifibbsMongodb.model('User');
const Question = ifibbsMongodb.model('Question');
const QuestionAnswer = ifibbsMongodb.model('QuestionAnswer');
const UserDynamic = ifibbsMongodb.model('UserDynamic');

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
                    title: decodeURIComponent(questionDoc.title),
                    describe: decodeURIComponent(questionDoc.describe),
                    tags: questionDoc.tags,
                    create_time: questionDoc.create_time,
                    update_time: questionDoc.update_time,
                    create_user_id: userID,
                    create_user_name: user.user_name,
                    create_user_avatar: user.user_avatar,
                };

                ifibbsElasticsearch.create({
                    index: ifibbsElasticsearch.indices.question,
                    type: ifibbsElasticsearch.indices.question,
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

        ifibbsElasticsearch.delete({
            index: ifibbsElasticsearch.indices.question,
            type: ifibbsElasticsearch.indices.question,
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

    ifibbsElasticsearch.search({
        index: ifibbsElasticsearch.indices.question,
        from: pageSkip,
        size: pageSize,
        body: {
            query: {
                multi_match: {
                    query: content,
                    fields: ['title', 'describe']
                }
            },
            highlight: {
                fields: {
                    title: {"pre_tags": ["<font color='red'>"], "post_tags": ["</font>"]},
                    describe: {"pre_tags": ["<font color='red'>"], "post_tags": ["</font>"]}
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
                question_collect_count: hit._source.collect_count || 0,
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
    ifibbsElasticsearch.search({
        index: ifibbsElasticsearch.indices.answer,
        from: pageSkip,
        size: pageSize,
        body: {
            query: {
                multi_match: {
                    query: content,
                    fields: ['question_title', 'question_describe' , 'answer_content']
                }
            },
            highlight: {
                fields: {
                    question_title: {"pre_tags": ["<font color='red'>"], "post_tags": ["</font>"]},
                    question_describe: {"pre_tags": ["<font color='red'>"], "post_tags": ["</font>"]},
                    answer_content: {"pre_tags": ["<font color='red'>"], "post_tags": ["</font>"]},
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

            let title = hit.highlight.question_title ? hit.highlight.question_title.join() : hit._source.question_title;
            let answerContent = hit.highlight.answer_content ? hit.highlight.answer_content.join() : hit._source.answer_content;

            return {
                question_id: hit._source.question_id,
                question_tags: hit._source.tags,
                question_title: title,
                answer_id: hit._id,
                answer_content: answerContent,
                answer_comment_count: hit._source.answer_comment_count || 0,
                answer_favour_count: hit._source.answer_favour_count || 0,
                answer_collect_count: hit._source.answer_collect_count || 0,
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
