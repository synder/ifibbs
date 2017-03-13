/**
 * @author synder on 2017/2/19
 * @copyright
 * @desc
 */

const async = require('async');
const ifibbsMongodb = require('../service/mongodb/ifibbs').client;
const ifibbsElastic = require('../service/elasticsearch/ifibbs').client;

const User = ifibbsMongodb.model('User');
const UserDynamic = ifibbsMongodb.model('UserDynamic');
const Question = ifibbsMongodb.model('Question');
const AnswerComment = ifibbsMongodb.model('AnswerComment');
const QuestionAnswer = ifibbsMongodb.model('QuestionAnswer');


/**
 * @desc 创建评论
 * */
exports.createNewAnswerComment = function (userID, answerID, comment, callback) {
    
    let commentDoc = {
        status: AnswerComment.STATUS.NORMAL,
        content: comment.content,
        comment_count: 0,
        favour_count: 0,
        collect_count: 0,
        question_id: comment.question_id,
        answer_id: answerID,
        create_user_id: userID,
        to_user_id: comment.to_user_id,
        to_comment_id: comment.to_comment_id,
        create_time: new Date(),
        update_time: new Date(),
    };

    AnswerComment.create(commentDoc, function (err, comment) {
        if(err){
            return callback(err);
        }
        
        if(!comment){
            return callback(null, null);
        }
        
        async.parallel({
            updateAnswerCommentCount: function(cb) {
                //更新评论数
                QuestionAnswer.update({_id: answerID}, {$inc: {comment_count: 1}}, cb);
            },
            insertUserDynamic: function(cb) {
                //创建用户动态
                UserDynamic.create({
                    status: UserDynamic.STATUS.ENABLE,
                    type: UserDynamic.TYPES.COMMENT_ANSWER,
                    user_id: userID,
                    answer: answerID,
                    create_time: new Date(),
                    update_time: new Date(),
                }, cb);
            },
        }, function (err, results) {
            callback(err, comment);
        });
    });
};

/**
 * @desc 删除评论
 * */
exports.removeAnswerComment = function (userID, commentID, callback) {
    
    let condition = {
        create_user_id: userID,
        _id: commentID,
        status: AnswerComment.STATUS.ENABLE,
    };
    
    let update = {
        $set: {
            status: AnswerComment.STATUS.REMOVED,
            update_time: new Date(),
        }
    };

    AnswerComment.findOneAndUpdate(condition, update, function (err, comment) {
        if(err){
            return callback(err);
        }

        if(!comment){
            return callback(null, false);
        }

        let updateAnswerCondition = {_id: comment.answer_id, comment_count: {$gte: 1}};
        let updateAnswer =  {$inc: {comment_count: -1}};

        QuestionAnswer.update(updateAnswerCondition, updateAnswer, function (err) {
            callback(err, true);
        });
    });
};


/**
 * @desc 获取回答的评论列表
 * */
exports.getAnswerCommentList = function (answerID, lastCommentID, pageSkip, pageSize, callback) {
    
    let condition = {
        status: AnswerComment.STATUS.NORMAL,
        answer_id: answerID
    };
    
    async.parallel({
        count: function (cb) {
            AnswerComment.count(condition, cb);
        },
        
        comments: function (cb) {
            if(!lastCommentID){
                AnswerComment.find(condition)
                    .populate({
                        path: 'question_id',
                        match: {
                            _id: {$exists : true},
                            status: Question.STATUS.NORMAL
                        }
                    })
                    .populate({
                        path: 'answer_id',
                        match: {
                            _id: {$exists : true},
                            status: QuestionAnswer.STATUS.NORMAL
                        }
                    })
                    .populate({
                        path: 'create_user_id',
                        match: {
                            _id: {$exists : true},
                            status: User.STATUS.NORMAL
                        }
                    })
                    .populate({
                        path: 'to_user_id',
                        match: {
                            _id: {$exists : true},
                            status: User.STATUS.NORMAL
                        }
                    })
                    .sort('-create_time -_id')
                    .skip(pageSkip)
                    .limit(pageSize)
                    .exec(cb);
            }else{
                
                AnswerComment.findOne({_id: lastCommentID}, function (err, comment) {
                    if(err){
                        return cb(err);
                    }
                    
                    if(!comment){
                        return AnswerComment.find(condition)
                            .populate('question_id answer_id create_user_id to_user_id')
                            .sort('-create_time -_id')
                            .skip(pageSkip)
                            .limit(pageSize)
                            .exec(cb);
                    }
                    
                    let lastCommentCreateTime = comment.create_time;
                    
                    let pageCondition = {
                        status: AnswerComment.STATUS.NORMAL,
                        answer_id: answerID,
                        create_time: {$gte: lastCommentCreateTime},
                        _id: {$ne: lastCommentID}
                    };

                    AnswerComment.find(pageCondition)
                        .populate('question_id answer_id create_user_id to_user_id')
                        .sort('-create_time -_id')
                        .limit(pageSize)
                        .exec(cb);
                });
            }
        }
    }, callback);
    
};


/**
 * @desc 获取用户的评论列表
 * */
exports.getUserAnswerCommentsList = function (userID, pageSkip, pageSize, callback) {
    let condition = {
        status: AnswerComment.STATUS.NORMAL,
        create_user_id: userID
    };

    async.parallel({
        count: function (cb) {
            AnswerComment.count(condition, cb);
        },

        comments: function (cb) {
            AnswerComment.find(condition)
                .populate({
                    path: 'question_id',
                    match: {
                        _id: {$exists : true},
                        status: Question.STATUS.NORMAL
                    }
                })
                .populate({
                    path: 'answer_id',
                    match: {
                        _id: {$exists : true},
                        status: QuestionAnswer.STATUS.NORMAL
                    }
                })
                .populate({
                    path: 'create_user_id',
                    match: {
                        _id: {$exists : true},
                        status: User.STATUS.NORMAL
                    }
                })
                .populate({
                    path: 'to_user_id',
                    match: {
                        _id: {$exists : true},
                        status: User.STATUS.NORMAL
                    }
                })
                .sort('-create_time -_id')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback);
};