/**
 * @author synder on 2017/2/19
 * @copyright
 * @desc
 */

const async = require('async');
const mongodb = require('../service/mongodb').db;
const elasticsearch = require('../service/elasticsearch').client;

const QuestionAnswer = mongodb.model('QuestionAnswer');

/**
 * @desc 获取最热回答列表
 * */
exports.getHottestAnswerList = function (pageSkip, pageSize, callback) {
    let condition = {};

    async.parallel({
        count: function (cb) {
            QuestionAnswer.count(condition, cb);
        },
        answers: function (cb) {
            QuestionAnswer.find({})
                .populate('create_user_id question_id')
                .sort('comment_count favour_count create_time')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback);
};

/**
 * @desc 获取最新回答列表
 * */
exports.getLatestAnswerList = function (pageSkip, pageSize, callback) {
    
    let condition = {};

    async.parallel({
        count: function (cb) {
            QuestionAnswer.count(condition, cb);
        },
        answers: function (cb) {
            QuestionAnswer.find({})
                .populate('create_user_id question_id')
                .sort('-create_time -_id')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback);
};

/**
 * @desc 获取问题回答列表
 * */
exports.getQuestionAnswerList = function (questionID, lastAnswerID, pageSkip, pageSize, callback) {
    let condition = {
        question_id: questionID,
        status: QuestionAnswer.STATUS.NORMAL
    };

    async.parallel({
        count: function (cb) {
            QuestionAnswer.count(condition, cb);
        },
        answers: function (cb) {
            if(!lastAnswerID){
                QuestionAnswer.find(condition)
                    .populate('create_user_id question_id')
                    .sort('-_id') //这里只能使用ID排序，不能使用create_time排序
                    .skip(pageSkip)
                    .limit(pageSize)
                    .exec(cb);
            }else{
                QuestionAnswer.findOne({ _id : lastAnswerID}, function (err, answer) {
                    if(err){
                        return cb(err);
                    }
                    
                    if(!QuestionAnswer){
                        return QuestionAnswer.find(condition)
                            .populate('create_user_id question_id')
                            .sort('-_id') //这里只能使用ID排序，不能使用create_time排序
                            .skip(pageSkip)
                            .limit(pageSize)
                            .exec(cb);
                    }
                    
                    let lastAnswerCreateTime = answer.create_time;
                    
                    let pageCondition = {
                        question_id: questionID,
                        _id: {$ne: lastAnswerID},
                        create_time: {$gte: lastAnswerCreateTime}
                    };

                    QuestionAnswer.find(pageCondition)
                        .populate('create_user_id question_id')
                        .sort('-_id') //这里只能使用ID排序，不能使用create_time排序
                        .limit(pageSize)
                        .exec(cb);
                });
            }
        }
    }, callback);
};

/**
 * @desc 根据当前回答ID，获取签名的回答ID和后面的回答ID
 * */
exports.getPrevAndNextAnswerIDSByAnswerID = function (questionID, answerID, callback) {

    async.parallel({

        prev: function(cb) {

            let gtCondition = {
                question_id: questionID,
                _id: {$gt: answerID},
                status: QuestionAnswer.STATUS.NORMAL
            };

            QuestionAnswer.find(gtCondition)
                .sort('_id')
                .limit(10)
                .exec(cb)
        },

        next: function(cb) {

            let ltCondition = {
                question_id: questionID,
                _id: {$lt: answerID},
                status: QuestionAnswer.STATUS.NORMAL
            };

            QuestionAnswer.find(ltCondition)
                .sort('-_id')
                .limit(10)
                .exec(cb)
        },
    }, function (err, results) {

        if(err){
            return ;
        }


        let prev = results.prev;
        let next = results.next;

        let answerIDS = [];
        
        for(let i = prev.length - 1; i > -1; i--){
            answerIDS.push(prev[i]._id)
        }

        answerIDS.push(answerID);

        next.forEach(function (answer) {
            answerIDS.push(answer._id);
        });

        callback(null, answerIDS);
    });
};


/**
 * @desc 获取用户的回答列表
 * */
exports.getUserAnswerList = function (userID, pageSkip, pageSize, callback) {
    let condition = {
        create_user_id: userID,
        status: QuestionAnswer.STATUS.NORMAL
    };
    
    async.parallel({
        count: function (cb) {
            QuestionAnswer.count(condition, cb);
        },
        answers: function (cb) {
            QuestionAnswer.find(condition)
                .populate('create_user_id question_id')
                .sort('-create_time -_id')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback);
};


/**
 * @desc 获取回答详情
 * */
exports.getQuestionAnswerDetail = function (answerID, callback) {
    let condition = {
        _id: answerID,
        status: QuestionAnswer.STATUS.NORMAL
    };
    
    QuestionAnswer.findOne(condition)
        .populate('create_user_id question_id')
        .exec(callback);
};


/**
 * @desc 创建新的回答
 * */
exports.createNewQuestionAnswer = function (userID, questionID, content, callback) {
    let answerDoc = {
        status: QuestionAnswer.STATUS.NORMAL,
        content: content,
        comment_count: 0,
        favour_count: 0,
        collect_count: 0,
        question_id: questionID,
        create_user_id: userID,
        create_time: new Date(),
        update_time: new Date(),
    };
    
    QuestionAnswer.create(answerDoc, function (err, result) {
        if(err){
            return callback(err);
        }
        
        let answerID = result._id;
        
        //创建es索引
        elasticsearch.create({
            index: elasticsearch.indices.answer,
            type: elasticsearch.indices.answer,
            id: answerID.toString(),
            body: {
                create_user_id: result.create_user_id,
                question_id: result.question_id,
                content: result.content,
                create_time: result.create_time,
                update_time: result.update_time
            }
        }, function (err, response) {
            if (err) {
                return callback(err);
            }

            callback(null, answerID);
        });
        
    });
};

/**
 * @desc 删除回答
 * */
exports.removeQuestionAnswer = function (userID, answerID, callback) {
    let condition = {
        _id: answerID,
        create_user_id: userID,
    };
    
    let update = {
        status: QuestionAnswer.STATUS.REMOVED
    };
    
    QuestionAnswer.update(condition, update, function (err, result) {
        if(err){
            return callback(err);
        }
        
        callback(null, result.ok === 1);
    });
};
