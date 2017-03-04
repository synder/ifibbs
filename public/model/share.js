/**
 * @author synder on 2017/3/4
 * @copyright
 * @desc
 */

const async = require('async');
const mongodb = require('../service/mongodb').db;
const elasticsearch = require('../service/elasticsearch').client;

const UserShare = mongodb.model('UserShare');
const UserDynamic = mongodb.model('UserDynamic');

/**
 * @desc 分享问题
 * */
exports.createUserShareQuestion = function (userID, questionID, callback) {
    
    let shareDoc = {
        status: UserShare.STATUS.ENABLE,
        type: UserShare.TYPES.SHARE_QUESTION,
        user_id: userID,
        question: questionID,
        create_time: new Date(),
        update_time: new Date(),
    };
    
    UserShare.create(shareDoc, function (err) {
        if(err){
            return callback(err);
        }

        //插入用户动态
        UserDynamic.create({
            status: UserDynamic.STATUS.ENABLE,
            type: UserDynamic.TYPES.SHARE_QUESTION,
            user_id: userID,
            question: questionID,
            create_time: new Date(),
            update_time: new Date(),
        }, callback);
    });
};

/**
 * @desc 分享文章
 * */
exports.createUserShareArticle = function (userID, articleID, callback) {

    let shareDoc = {
        status: UserShare.STATUS.ENABLE,
        type: UserShare.TYPES.SHARE_QUESTION,
        user_id: userID,
        article: articleID,
        create_time: new Date(),
        update_time: new Date(),
    };

    UserShare.create(shareDoc, function (err) {
        if(err){
            return callback(err);
        }

        //插入用户动态
        UserDynamic.create({
            status: UserDynamic.STATUS.ENABLE,
            type: UserDynamic.TYPES.SHARE_ARTICLE,
            user_id: userID,
            article: articleID,
            create_time: new Date(),
            update_time: new Date(),
        }, callback);
    });
};