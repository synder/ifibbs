/**
 * @author synder on 2017/2/19
 * @copyright
 * @desc
 */

const async = require('async');
const mongodb = require('../service/mongodb').db;
const elasticsearch = require('../service/elasticsearch').client;

const UserCollection = mongodb.model('UserCollection');

/**
 * @desc 获取用户收藏的回答列表
 * */
exports.getUserCollectionList = function (userID, pageSkip, pageSize, callback) {
    
    let condition = {
        status: UserCollection.STATUS.COLLECTED,
        user_id: userID,
    };
    
    async.parallel({
        count: function (cb) {
            UserCollection.count(condition, cb);
        },

        collections: function (cb) {
            UserCollection.find(condition)
                .populate('answer_id article_id user_id')
                .sort('create_time')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback);
    
    
};


/**
 * @desc 查询获取用户收藏的回答(根据用户ID和关注ID)
 * */
exports.findUserCollectionAnswerByCollectionID = function (userID, collectionID, callback) {
    let condition = {
        status: UserCollection.STATUS.COLLECTED,
        user_id: userID,
        target_id: collectionID,
    };
    UserCollection.findOne(condition).populate('target_id').exec(callback);
};


/**
 * @desc 查询获取用户收藏的文章(根据用户ID和关注ID)
 * */
exports.findUserCollectionArticleByCollectionID = function (userID, collectionID, callback) {
    let condition = {
        status: UserCollection.STATUS.COLLECTED,
        user_id: userID,
        target_id: collectionID,
    };
    UserCollection.findOne(condition).populate('target_id').exec(callback);
};


/**
 * @desc 创建对问题回答的收藏
 * */
exports.addAnswerToCollection = function (userID, questionID, answerID, callback) {

    let condition = {
        user_id: userID,
        answer_id: answerID,
    };

    let update = {
        status: UserCollection.STATUS.COLLECTED,
        type: UserCollection.TYPES.ANSWER,
        user_id: userID,
        answer_id: answerID,
        question_id: questionID
    };

    UserCollection.update(condition, update, {upsert: true}, function (err, result) {
        if(err){
            return callback(err);
        }

        callback(null, result.ok === 1);
    });
};


/**
 * @desc 取消对问题回答收藏
 * */
exports.removeAnswerFromCollection = function (userID, answerID, callback) {

    let condition = {
        status: UserCollection.STATUS.COLLECTED,
        user_id: userID,
        answer_id: answerID,
    };

    let update = {
        status: UserCollection.STATUS.UNCOLLECTED,
    };

    UserCollection.update(condition, update, function (err, result) {
        if(err){
            return callback(err);
        }

        callback(null, result.ok === 1);
    });
};

/**
 * @desc 创建对文章的收藏
 * */
exports.addArticleToCollection = function (userID, subjectID, articleID, callback) {

    let condition = {
        user_id: userID,
        article_id: articleID,
    };

    let update = {
        status: UserCollection.STATUS.COLLECTED,
        type: UserCollection.TYPES.ANSWER,
        user_id: userID,
        article_id: articleID,
        subject_id: subjectID
    };

    UserCollection.update(condition, update, {upsert: true}, function (err, result) {
        if(err){
            return callback(err);
        }

        callback(null, result.ok === 1);
    });
};


/**
 * @desc 取消对文章收藏
 * */
exports.removeArticleFromCollection = function (userID, articleID, callback) {

    let condition = {
        status: UserCollection.STATUS.COLLECTED,
        user_id: userID,
        article_id: articleID,
    };

    let update = {
        status: UserCollection.STATUS.UNCOLLECTED,
    };

    UserCollection.update(condition, update, function (err, result) {
        if(err){
            return callback(err);
        }

        callback(null, result.ok === 1);
    });
};