/**
 * @author synder on 2017/2/18
 * @copyright
 * @desc
 */

const commentModel = require('../../../public/model/comment');

/**
 * @desc 对回答新增评论
 * */
exports.addNewCommentToAnswer = function (req, res, next) {
    
    //必填参数
    let questionId = req.body.question_id;
    let answerId = req.body.answer_id;
    let commentContent = req.body.content;

    //可以为空
    let toUserId = req.body.to_user_id;
    let toCommentId = req.body.to_comment_id;
    
    let userID = req.session.id;
    

    if(!questionId){
        return next(new BadRequestError('question_id is needed'));
    }

    if(!answerId){
        return next(new BadRequestError('answer_id is needed'));
    }

    if(!commentContent){
        return next(new BadRequestError('content is needed'));
    }

    commentModel.createNewAnswerComment(userID, answerId, {
        to_user_id: toUserId,
        to_comment_id: toCommentId,
        question_id: questionId,
        content: commentContent
    }, function (err, doc) {
        if(err){
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                question_id: questionId,
                answer_id: answerId,
                comment_id: doc._id
            }
        });
    });


    
};


/**
 * @desc 删除回答评论
 * */
exports.removeUserComments = function (req, res, next) {
    let commentID = req.body.comment_id;
    
    let userID = req.session.id;

    if(!commentID){
        return next(new BadRequestError('comment_id is needed'));
    }
    
    commentModel.removeAnswerComment(userID, commentID, function (err, success) {
        if(err){
            return next(err);
        }
        
        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: success
            }
        });
    });
};


/**
 * @desc 用户获取评论列表
 * */
exports.getUserCommentsList = function (req, res, next) {
    let pageSkip = req.query.page_skip;
    let pageSize = req.query.page_size;
    let userID = req.session.id;

    commentModel.getUserAnswerCommentsList(userID, pageSkip, pageSize, function (err, results) {
        if(err){
            return next(err);
        }

        let count = results.count;
        let comments = results.comments;

        comments = comments.map(function (comment) {
            return {
                question_id: comment.question_id ? comment.question_id._id : null,
                answer_id: comment.answer_id ? comment.answer_id._id : null,
                user_id: comment.create_user_id ? comment.create_user_id._id : null,
                user_avatar: comment.create_user_id ? comment.create_user_id.user_avatar : null,
                user_name: comment.create_user_id ? comment.create_user_id.user_name : null,
                to_user_id: comment.to_user_id ? comment.to_user_id.user_name : null,
                to_user_name: comment.to_user_id ? comment.to_user_id.user_name : null,
                comment_id: comment._id,
                content: comment.comment_count,
                comment_favour_count: comment.favour_count,
                comment_publish_time: comment.create_time
            };
        });

        res.json({
            flag: '0000',
            msg: '',
            result: {
                count: count,
                list: comments
            }
        });
    });

};