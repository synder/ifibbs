/**
 * @author synder on 2017/2/19
 * @copyright
 * @desc
 */


const async = require('async');
const mongodb = require('../service/mongodb').db;
const elasticsearch = require('../service/elasticsearch').client;

const UserFavourAnswer = mongodb.model('UserFavourAnswer');
const UserFavourArticle = mongodb.model('UserFavourArticle');
const UserFavourAnswerComment = mongodb.model('UserFavourAnswerComment');

/**
 * @desc 查询获取用户赞的回答(根据用户ID和关注ID)
 * */
exports.findUserFavourAnswerByFavourID = function (userID, favourID, callback) {
    let condition = {
        status: UserFavourAnswer.STATUS.FAVOUR,
        user_id: userID,
        target_id: favourID,
    };
    UserFavourAnswer.findOne(condition, callback);
};


/**
 * @desc 查询获取用户赞的文章(根据用户ID和关注ID)
 * */
exports.findUserFavourArticleByFavourID = function (userID, favourID, callback) {
    let condition = {
        status: UserFavourArticle.STATUS.FAVOUR,
        user_id: userID,
        target_id: favourID,
    };
    UserFavourArticle.findOne(condition, callback);
};


/**
 * @desc 查询获取用户赞的回答评论(根据用户ID和关注ID)
 * */
exports.findUserFavourAnswerCommentByFavourID = function (userID, favourID, callback) {
    let condition = {
        status: UserFavourAnswerComment.STATUS.FAVOUR,
        user_id: userID,
        target_id: favourID,
    };
    UserFavourAnswerComment.findOne(condition, callback);
};


/**
 * @desc 创建对问题回答的点赞
 * */
exports.createFavourToAnswer = function (userID, answerID, callback) {

    let condition = {
        user_id: userID,
        target_id: answerID,
    };
    
    let update = {
        status: UserFavourAnswer.STATUS.FAVOUR,
        user_id: userID,
        target_id: answerID,
        create_time: new Date(),
        update_time: new Date(),
    };
    
    UserFavourAnswer.update(condition, update, {upsert: true}, function (err, result) {
        if(err){
            return callback(err);
        }
        
        callback(null, result.ok === 1);
    });
};


/**
 * @desc 取消对问题回答点赞
 * */
exports.cancelFavourToAnswer = function (userID, answerID, callback) {

    let condition = {
        status: UserFavourAnswer.STATUS.FAVOUR,
        user_id: userID,
        target_id: answerID,
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

        callback(null, result.ok === 1);
    });
};


/**
 * @desc 创建对文章的点赞
 * */
exports.createFavourToArticle = function (userID, articleID, callback) {

    let condition = {
        user_id: userID,
        target_id: articleID,
    };

    let update = {
        status: UserFavourArticle.STATUS.FAVOUR,
        user_id: userID,
        target_id: articleID,
        create_time: new Date(),
        update_time: new Date(),
    };

    UserFavourArticle.update(condition, update, {upsert: true}, function (err, result) {
        if(err){
            return callback(err);
        }

        callback(null, result.ok === 1);
    });
};


/**
 * @desc 取消对文章点赞
 * */
exports.cancelFavourToArticle = function (userID, articleID, callback) {

    let condition = {
        status: UserFavourArticle.STATUS.FAVOUR,
        user_id: userID,
        target_id: articleID,
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

        callback(null, result.ok === 1);
    });
};

/**
 * @desc 创建对问题回答的评论的点赞
 * */
exports.createFavourToAnswerComment = function (userID, commentID, callback) {

    let condition = {
        user_id: userID,
        target_id: commentID,
    };

    let update = {
        status: UserFavourAnswerComment.STATUS.FAVOUR,
        user_id: userID,
        target_id: commentID,
        create_time: new Date(),
        update_time: new Date(),
    };

    UserFavourAnswerComment.update(condition, update, {upsert: true}, function (err, result) {
        if(err){
            return callback(err);
        }

        callback(null, result.ok === 1);
    });
};


/**
 * @desc 取消对问题回答的评论点赞
 * */
exports.cancelFavourToAnswerComment = function (userID, commentID, callback) {

    let condition = {
        status: UserFavourAnswerComment.STATUS.FAVOUR,
        user_id: userID,
        target_id: commentID,
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

        callback(null, result.ok === 1);
    });
};