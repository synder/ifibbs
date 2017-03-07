/**
 * @author synder on 2017/2/19
 * @copyright
 * @desc
 */


const async = require('async');
const mongodb = require('../service/mongodb').db;
const elasticsearch = require('../service/elasticsearch').client;

const User = mongodb.model('User');
const UserDynamic = mongodb.model('UserDynamic');
const Article = mongodb.model('Article');
const Question = mongodb.model('Question');
const QuestionAnswer = mongodb.model('QuestionAnswer');
const AnswerComment = mongodb.model('AnswerComment');
const UserFavourAnswer = mongodb.model('UserFavourAnswer');
const UserFavourArticle = mongodb.model('UserFavourArticle');
const UserFavourAnswerComment = mongodb.model('UserFavourAnswerComment');

/**
 * @desc 查询获取用户赞的回答(根据用户ID和关注ID)
 * */
exports.findUserFavourAnswerByFavourID = function (userID, answerID, callback) {
    let condition = {
        status: UserFavourAnswer.STATUS.FAVOUR,
        user_id: userID,
        answer_id: answerID,
    };
    UserFavourAnswer.findOne(condition, callback);
};


/**
 * @desc 查询获取用户赞的文章(根据用户ID和关注ID)
 * */
exports.findUserFavourArticleByFavourID = function (userID, articleID, callback) {
    let condition = {
        status: UserFavourArticle.STATUS.FAVOUR,
        user_id: userID,
        article_id: articleID,
    };
    UserFavourArticle.findOne(condition, callback);
};


/**
 * @desc 查询获取用户赞的回答评论(根据用户ID和关注ID)
 * */
exports.findUserFavourAnswerCommentByFavourID = function (userID, commentID, callback) {
    let condition = {
        status: UserFavourAnswerComment.STATUS.FAVOUR,
        user_id: userID,
        comment_id: commentID,
    };
    UserFavourAnswerComment.findOne(condition, callback);
};


/**
 * @desc 创建对问题回答的点赞
 * */
exports.createFavourToAnswer = function (userID, questionID, answerID, callback) {

    let condition = {
        user_id: userID,
        answer_id: answerID,
        question_id: questionID
    };
    
    let update = {
        status: UserFavourAnswer.STATUS.FAVOUR,
        user_id: userID,
        answer_id: answerID,
        question_id: questionID,
        create_time: new Date(),
        update_time: new Date(),
    };
    
    UserFavourAnswer.update(condition, update, {upsert: true}, function (err, result) {
        if(err){
            return callback(err);
        }

        if(!result.upserted && result.nModified === 0){
            return callback(null, false);
        }
        
        async.parallel({
            updateQuestionAnswer: function(cb) {
                //更新问题关注数
                QuestionAnswer.update({_id: answerID}, {$inc: {favour_count: 1}}, cb);
            },
            insertUserDynamic: function(cb) {
                UserDynamic.create({
                    status: UserDynamic.STATUS.ENABLE,
                    type: UserDynamic.TYPES.FAVOUR_ANSWER,
                    user_id: userID,
                    question: questionID,
                    answer: answerID,
                    create_time: new Date(),
                    update_time: new Date(),
                }, cb);
            },
        }, function (err, results) {
            callback(err, true);
        });
    });
};


/**
 * @desc 取消对问题回答点赞
 * */
exports.cancelFavourToAnswer = function (userID, answerID, callback) {

    let condition = {
        status: UserFavourAnswer.STATUS.FAVOUR,
        user_id: userID,
        answer_id: answerID,
    };
    
    let update = {
        $set:{
            status: UserFavourAnswer.STATUS.UNFAVOUR,
            update_time: new Date(),
        }
    };

    UserFavourAnswer.update(condition, update, function (err, result) {
        if(err){
            return callback(err);
        }

        if(result.nModified === 0){
            return callback(null, false);
        }

        //更新问题关注数
        let answerCondition = {_id: answerID, favour_count: {$gte: 1}};
        QuestionAnswer.update(answerCondition, {$inc: {favour_count: -1}}, function (err) {
            callback(err, true);
        });
    });
};


/**
 * @desc 创建对文章的点赞
 * */
exports.createFavourToArticle = function (userID, subjectID, articleID, callback) {

    let condition = {
        user_id: userID,
        subject_id: subjectID,
        article_id: articleID,
    };

    let update = {
        status: UserFavourArticle.STATUS.FAVOUR,
        user_id: userID,
        subject_id: subjectID,
        article_id: articleID,
        create_time: new Date(),
        update_time: new Date(),
    };

    UserFavourArticle.update(condition, update, {upsert: true}, function (err, result) {
        if(err){
            return callback(err);
        }

        if(!result.upserted && result.nModified === 0){
            return callback(null, false);
        }

        async.parallel({
            updateArticle: function(cb) {
                //更新文章关注数
                Article.update({_id: articleID}, {$inc: {favour_count: 1}}, cb);
            },
            insertUserDynamic: function(cb) {
                UserDynamic.create({
                    status: UserDynamic.STATUS.ENABLE,
                    type: UserDynamic.TYPES.FAVOUR_ARTICLE,
                    user_id: userID,
                    article: articleID,
                    create_time: new Date(),
                    update_time: new Date(),
                }, cb);
            },
        }, function (err, results) {
            callback(err, true);
        });
    });
};


/**
 * @desc 取消对文章点赞
 * */
exports.cancelFavourToArticle = function (userID, articleID, callback) {

    let condition = {
        status: UserFavourArticle.STATUS.FAVOUR,
        user_id: userID,
        article_id: articleID,
    };

    let update = {
        $set:{
            status: UserFavourArticle.STATUS.UNFAVOUR,
            update_time: new Date(),
        }
    };

    UserFavourArticle.update(condition, update, function (err, result) {
        if(err){
            return callback(err);
        }

        if(result.nModified === 0){
            return callback(null, false);
        }

        //更新问题关注数
        let articleCondition = {_id: articleID, favour_count: {$gte: 1}};
        Article.update(articleCondition, {$inc: {favour_count: -1}}, function (err) {
            callback(err, true);
        });
    });
};

/**
 * @desc 创建对问题回答的评论的点赞
 * */
exports.createFavourToAnswerComment = function (userID, answerID, commentID, callback) {

    let condition = {
        user_id: userID,
        comment_id: commentID,
        answer_id: answerID,
    };

    let update = {
        status: UserFavourAnswerComment.STATUS.FAVOUR,
        user_id: userID,
        comment_id: commentID,
        answer_id: answerID,
        create_time: new Date(),
        update_time: new Date(),
    };

    UserFavourAnswerComment.update(condition, update, {upsert: true}, function (err, result) {
        if(err){
            return callback(err);
        }

        if(result.upserted == null && result.nModified){
            return callback(null, false);
        }

        async.parallel({
            updateAnswerComment: function(cb) {
                //更新评论关注数
                AnswerComment.update({_id: commentID}, {$inc: {favour_count: 1}}, cb);
            },
            insertUserDynamic: function(cb) {
                UserDynamic.create({
                    status: UserDynamic.STATUS.ENABLE,
                    type: UserDynamic.TYPES.FAVOUR_COMMENT,
                    user_id: userID,
                    answer: answerID,
                    comment: commentID,
                    create_time: new Date(),
                    update_time: new Date(),
                }, cb);
            },
        }, function (err, results) {
            callback(err, true);
        });
    });
};


/**
 * @desc 取消对问题回答的评论点赞
 * */
exports.cancelFavourToAnswerComment = function (userID, commentID, callback) {

    let condition = {
        status: UserFavourAnswerComment.STATUS.FAVOUR,
        user_id: userID,
        comment_id: commentID,
    };

    let update = {
        $set:{
            status: UserFavourAnswerComment.STATUS.UNFAVOUR,
            update_time: new Date(),
        }
    };

    UserFavourAnswerComment.update(condition, update, function (err, result) {
        if(err){
            return callback(err);
        }

        if(result.nModified === 0){
            return callback(null, false);
        }

        //更新问题关注数
        let commentCondition = {_id: commentID, favour_count: {$gte: 1}};
        AnswerComment.update(commentCondition, {$inc: {favour_count: -1}}, function (err) {
            callback(err, true);
        });
    });
};