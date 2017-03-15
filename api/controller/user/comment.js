/**
 * @author synder on 2017/2/18
 * @copyright
 * @desc
 */

const commentModel = require('../../../public/model/ifibbs/comment');
const notificationModel = require('../../../public/model/ifibbs/notification');

/**
 * @desc 对回答新增评论
 * */
exports.addNewCommentToAnswer = function (req, res, next) {
    
    //必填参数
    let questionId = req.body.question_id;
    let answerId = req.body.answer_id;
    let commentContent = req.body.comment_content;

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
        return next(new BadRequestError('comment_content is needed'));
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
        
        let commentID = doc._id;

        notificationModel.produceForAnswerBeenCommendedMQS(answerId, commentID, function (err) {
            if(err){
                logger.error(err);
            }
        });

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: !!commentID,
                failed_message: !!commentID ? null : '评论失败',
                success_message: null,
                question_id: questionId,
                answer_id: answerId,
                comment_id: commentID
            }
        });
    });


    
};


/**
 * @desc 删除回答评论
 * */
exports.removeUserComments = function (req, res, next) {
    let commentID = req.query.comment_id;
    
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
                ok: !!success,
                failed_message: !!success ? null : '删除评论失败',
                success_message: null,
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
    let userID = req.query.user_id;

    if(!userID){
        return next(new BadRequestError('user_id is need'));
    }

    commentModel.getUserAnswerCommentsList(userID, pageSkip, pageSize, function (err, results) {
        if(err){
            return next(err);
        }

        let count = results.count;
        let comments = [];

        results.comments.forEach(function (comment) {
            if(comment.question_id && comment.answer_id && comment.create_user_id){
                comments.push({
                    question_id: comment.question_id._id,
                    question_title: comment.question_id.title,
                    answer_id: comment.answer_id._id,
                    answer_content: comment.answer_id.content,
                    user_id: comment.create_user_id._id,
                    user_avatar: comment.create_user_id.user_avatar,
                    user_name: comment.create_user_id.user_name,
                    to_user_id: comment.to_user_id ? comment.to_user_id.user_name : null,
                    to_user_name: comment.to_user_id ? comment.to_user_id.user_name : null,
                    comment_id: comment._id,
                    comment_content: comment.content,
                    comment_favour_count: comment.favour_count,
                    comment_publish_time: comment.create_time.valueOf()
                });
            }
        });

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: true,
                failed_message: null,
                success_message: null,
                count: count,
                list: comments
            }
        });
    });

};