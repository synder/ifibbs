/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

const favourModel = require('../../../public/model/ifibbs/favour');
const notificationModel = require('../../../public/model/ifibbs/notification');

/**
 * @desc 用户对回答点赞
 * */
exports.addAnswerToFavour = function (req, res, next) {
    let questionID = req.body.question_id;
    let answerID = req.body.answer_id;

    let userID = req.session.id;

    if (!questionID) {
        return next(new BadRequestError('question_id is needed'));
    }

    if (!answerID) {
        return next(new BadRequestError('answer_id is needed'));
    }

    favourModel.createFavourToAnswer(userID, questionID, answerID, function (err, success) {
        if (err) {
            return next(err);
        }

        //发送通知
        notificationModel.produceForAnswerBeenFavouredMQS(userID, answerID, function (err) {
            if(err){
                logger.error(err);
            } 
        });

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: !!success,
                failed_message: !!success ? null : '点赞失败',
                success_message: null,
            }
        });
    });
};

/**
 * @desc 用户取消对回答点赞
 * */
exports.removeAnswerFromFavour = function (req, res, next) {
    let answerID = req.query.answer_id;

    let userID = req.session.id;

    if (!answerID) {
        return next(new BadRequestError('answer_id is needed'));
    }

    favourModel.cancelFavourToAnswer(userID, answerID, function (err, success) {
        if (err) {
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: !!success,
                failed_message: !!success ? null : '取消点赞失败',
                success_message: null,
            }
        });
    });

};

/**
 * @desc 用户对文章点赞
 * */
exports.addArticleToFavour = function (req, res, next) {

    //必填参数
    let articleID = req.body.article_id;

    //可为空
    let subjectID = req.body.subject_id;

    let userID = req.session.id;

    if (!articleID) {
        return next(new BadRequestError('article_id is needed'));
    }

    favourModel.createFavourToArticle(userID, subjectID, articleID, function (err, success) {
        if (err) {
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: !!success,
                failed_message: !!success ? null : '点赞失败',
                success_message: null,
            }
        });
    });
};

/**
 * @desc 用户取消对文章点赞
 * */
exports.removeArticleFromFavour = function (req, res, next) {
    let articleID = req.query.article_id;
    let userID = req.session.id;

    if (!articleID) {
        return next(new BadRequestError('article_id is needed'));
    }

    favourModel.cancelFavourToArticle(userID, articleID, function (err, success) {
        if (err) {
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: !!success,
                failed_message: !!success ? null : '取消点赞失败',
                success_message: null,
            }
        });
    });
};


/**
 * @desc 用户对文章点赞
 * */
exports.addAnswerCommentToFavour = function (req, res, next) {
    let answerID = req.body.answer_id;
    let commentID = req.body.comment_id;

    let userID = req.session.id;

    if (!answerID) {
        return next(new BadRequestError('answer_id is needed'));
    }

    if (!commentID) {
        return next(new BadRequestError('comment_id is needed'));
    }

    favourModel.createFavourToAnswerComment(userID, answerID, commentID, function (err, success) {
        if (err) {
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: !!success,
                failed_message: !!success ? null : '点赞失败',
                success_message: null,
            }
        });
    });
};

/**
 * @desc 用户取消对回答评论点赞
 * */
exports.removeAnswerCommentFromFavour = function (req, res, next) {
    let commentID = req.query.comment_id;

    let userID = req.session.id;

    if (!commentID) {
        return next(new BadRequestError('comment_id is needed'));
    }

    favourModel.cancelFavourToAnswerComment(userID, commentID, function (err, success) {
        if (err) {
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: !!success,
                failed_message: !!success ? null : '取消点赞失败',
                success_message: null,
            }
        });
    });
};