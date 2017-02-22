/**
 * @author synder on 2017/2/19
 * @copyright
 * @desc
 */

const async = require('async');
const mongodb = require('../service/mongodb').db;
const elasticsearch = require('../service/elasticsearch').client;

const AnswerComment = mongodb.model('AnswerComment');


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
        create_time: 0,
        update_time: 0,
        question_id: comment.question_id,
        answer_id: answerID,
        create_user_id: userID,
        to_user_id: comment.to_user_id,
        to_comment_id: comment.to_comment_id
    };

    AnswerComment.create(commentDoc, callback);
};

/**
 * @desc 删除评论
 * */
exports.removeAnswerComment = function (userID, commentID, callback) {
    
    let condition = {
        create_user_id: userID,
        _id: commentID,
    };
    
    let update = {
        status: AnswerComment.STATUS.REMOVED
    };

    AnswerComment.update(condition, update, function (err, result) {
        if(err){
            return callback(err);
        }
        
        callback(null, result.ok === 1);
    });
    
};


/**
 * @desc 获取回答的评论列表
 * */
exports.getAnswerCommentList = function (answerID, pageSkip, pageSize, callback) {
    
    let condition = {
        status: AnswerComment.STATUS.NORMAL,
        answer_id: answerID
    };
    
    async.parallel({
        count: function (cb) {
            AnswerComment.count(condition, cb);
        },
        
        comments: function (cb) {
            AnswerComment.find(condition)
                .populate('question_id answer_id create_user_id to_user_id')
                .sort('create_time')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
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
                .populate('question_id answer_id create_user_id to_user_id')
                .sort('create_time')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback);
};