/**
 * @author synder on 2017/3/4
 * @copyright
 * @desc
 */

const async = require('async');
const ifibbsMongodb = require('../../service/mongodb/ifibbs').client;
const ifibbsElasticsearch = require('../../service/elasticsearch/ifibbs').client;

const UserShare = ifibbsMongodb.model('UserShare');
const UserDynamic = ifibbsMongodb.model('UserDynamic');

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
    
    UserShare.create(shareDoc, function (err, share) {
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
        }, function (err) {
            callback(err, share._id);
        });
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

    UserShare.create(shareDoc, function (err, share) {
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
        }, function (err) {
            if(err){
                return callback(err);
            }
            
            callback(null, share._id);
        });
        
    });
};