/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */

const async = require('async');
const mongodb = require('../service/mongodb').db;
const rabbit = require('../service/rabbit');

const UserNotification = mongodb.model('UserNotification');


/*
 * @desc 获取用户系统通知
 * */
exports.getSysNotificationList = function (userId, pageSkip, pageSize, callback) {
    
    let condition = {
        user_id: userId,
        category: UserNotification.CATEGORY.SYSTEM,
        status: UserNotification.STATUS.UNREAD
    };

    async.parallel({
        count: function (cb) {
            UserNotification.count(condition, cb)
        },
        notifications: function (cb) {
            UserNotification.find(condition)
                .sort('-create_time -_id')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback)
};

/*
 * @desc 获取用户业务通知
 * */

exports.getBusinessNotificationList = function (userId, pageSkip, pageSize, callback) {
    let condition = {
        user_id: userId,
        category: UserNotification.CATEGORY.BUSINESS,
        status: UserNotification.STATUS.UNREAD
    };

    async.parallel({
        count: function (cb) {
            UserNotification.count(condition, cb)
        },
        notifications: function (cb) {
            UserNotification.find(condition)
                .sort('-create_time -_id')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb)
        }
    }, callback)
};

/*
 * @desc 修改通知阅读状态
 * */
exports.changeNotificationToRead = function (userID, notificationIDS, callback) {
    
    async.eachLimit(notificationIDS, 10, function(id, cb){
        
        let condition = {
            _id: id,
            user_id: userID,
            status: UserNotification.STATUS.UNREAD
        };

        let update = {
            $set: {
                status: UserNotification.STATUS.READ
            }
        };

        UserNotification.update(condition, update, cb)
        
    }, function(err, result){
        if(err){
            return callback(err);
        }
        
        callback(null, true);
    });
};

/*
 * @desc 修改通知阅读状态
 * */
exports.changeNotificationToNotified = function (userID, notificationIDS, callback) {

    async.eachLimit(notificationIDS, 10, function(id, cb){

        let condition = {
            _id: id,
            user_id: userID,
            status: UserNotification.STATUS.UN_NOTIFIED
        };

        let update = {
            $set: {
                status: UserNotification.STATUS.NOTIFIED
            }
        };

        UserNotification.update(condition, update, cb)

    }, function(err, result){
        if(err){
            return callback(err);
        }

        callback(null, true);
    });
};




//推送通知=======================================================================================
/**
 * @desc 用户发布了新的问题，推送通知给关注该用户的用户
 * */
exports.produceForUserPublishNewQuestionMQS = function (questionID, callback) {
    questionID = questionID.toString();
    
    const QUEUE = rabbit.queues.notifications.ATTENTION_USER_PUBLISH_NEW_QUESTION;
    
    rabbit.client.produceMessage(QUEUE, questionID, callback);
};

exports.consumeForUserPublishNewQuestionMQS = function (callback) {
    const QUEUE = rabbit.queues.notifications.ATTENTION_USER_PUBLISH_NEW_QUESTION;

    rabbit.client.produceMessage(QUEUE, function (err, message) {
        if(err){
            return callback(err);
        }

        let questionID = message.content.toString();
        
        if(!questionID){
            return callback(null, null);
        }
        
        //todo
        
        callback(null, questionID);
    });
};


/**
 * @desc 问题有了新的回答，推送通知给关注该问题的用户和问题的发布者
 * */
exports.produceForQuestionBeenAnsweredMQS = function (questionID, answerID, callback) {
    answerID = answerID.toString();
    //通知相关用户
    async.parallel({
        notifyQuestionOwner: function(cb) {
            const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_ANSWERED;
            rabbit.client.produceMessage(QUEUE, questionID + ':' + answerID, cb);
        },
        notifyQuestionAttentionUser: function(cb) {
            const QUEUE = rabbit.queues.notifications.ATTENTION_QUESTION_BEEN_ANSWERED;
            rabbit.client.produceMessage(QUEUE, answerID, cb);
        },
    }, callback);
};

exports.consumeForQuestionBeenAnsweredMQS = function (callback) {
    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_ANSWERED;
    rabbit.client.produceMessage(QUEUE, function (err, message) {
        if(err){
            return callback(err);
        }
        
        let content = message.content.toString();
        
        if(!content){
            return callback(null);
        }
        
        content = content.split(':');
        
        let questionID = content[0];
        let answerID = content[1];
        
        //todo
        callback(null, questionID, answerID);
    });
};

/**
 * @desc 问题被管理员加精，推送通知给关注该问题的发布者
 * */
exports.produceForQuestionBeenStickiedMQS = function (questionID, callback) {
    
    questionID = questionID.toString();
    
    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_STICKIED;
    rabbit.client.produceMessage(QUEUE, questionID, callback);
};

exports.consumeForQuestionBeenStickiedMQS = function (callback) {
    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_STICKIED;
    rabbit.client.produceMessage(QUEUE, function (err, message) {
        if(err){
            return callback(err);
        }

        let questionID = message.content.toString();

        if(!questionID){
            return callback(new Error('questionID is null'));
        }

        //todo
        callback(null, questionID);
    });
};

/**
 * @desc 用户关注的专题有了新的文章，推送通知给关注专题的用户
 * */
exports.produceForAttentionSubjectHasNewArticleMQS = function (subjectID, articleID, callback) {
    const QUEUE = rabbit.queues.notifications.ATTENTION_SUBJECT_HAS_NEW_ARTICLE;

    rabbit.client.produceMessage(QUEUE, subjectID +  ':' + articleID, callback);
};

exports.consumeForAttentionSubjectHasNewArticleMQS = function (callback) {
    const QUEUE = rabbit.queues.notifications.ATTENTION_SUBJECT_HAS_NEW_ARTICLE;
    rabbit.client.produceMessage(QUEUE, function (err, message) {
        if(err){
            return callback(err);
        }

        let content = message.content.toString();

        if(!content){
            return callback(null);
        }
        
        content = content.split(':');

        let subjectID = content[0];
        let articleID = content[1];
        
        callback(null, subjectID, articleID);
    });
};
