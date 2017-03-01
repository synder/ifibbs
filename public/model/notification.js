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


/**
 * @desc 用户因某个用户回答了我发布的问题而被推送通知
 * */
exports.pushNotificationForQuestionBeenAnswered = function (userID, clientID, answerUserName, questionTitle, callback) {
    
    let notification = {
        user_id     : userID,
        status      : UserNotification.STATUS.UN_NOTIFIED,
        category    : UserNotification.CATEGORY.BUSINESS,
        type        : UserNotification.TYPE.QUESTION_BEEN_ANSWERED,
        push_title       : answerUserName + '回答了您的问题',
        push_content     : questionTitle,
        push_client_id   : clientID,
        create_time : new Date(),
        update_time : new Date(),
    };
    
    UserNotification.create(notification, function (err, doc) {
        if(err){
            return callback(err);
        }
        
        let msg = doc._id.toString();
        
        rabbit.client.produceMessage(rabbit.queues.BUSINESS.QUESTION_BEEN_ANSWERED, msg, function (err, ch) {
            if(err){
                return callback(err);
            }
            
            return callback(null, doc._id);
        });
    });
};

/**
 * @desc 用户因某个用户对我的回答进行的点赞而被推送通知
 * */
exports.pushNotificationForAnswerBeenFavoured = function (userID, clientID, favourUserName, questionTitle, callback) {
    let notification = {
        user_id     : userID,
        status      : UserNotification.STATUS.UN_NOTIFIED,
        category    : UserNotification.CATEGORY.BUSINESS,
        type        : UserNotification.TYPE.ANSWER_BEEN_FAVOURED,
        push_title       : favourUserName + '赞了您的回答',
        push_content     : questionTitle,
        push_client_id   : clientID,
        create_time : new Date(),
        update_time : new Date(),
    };

    UserNotification.create(notification, function (err, doc) {
        if(err){
            return callback(err);
        }

        let msg = doc._id.toString();

        rabbit.client.produceMessage(rabbit.queues.BUSINESS.ANSWER_BEEN_FAVOURED, msg, function (err, ch) {
            if(err){
                return callback(err);
            }

            return callback(null, doc._id);
        });
    });
};

/**
 * @desc 用户因某个用户分享了我发布的问题而被推送通知
 * */
exports.pushNotificationForQuestionBeenShared = function (userID, clientID, sharedUserName, questionTitle, callback) {
    let notification = {
        user_id     : userID,
        status      : UserNotification.STATUS.UN_NOTIFIED,
        category    : UserNotification.CATEGORY.BUSINESS,
        type        : UserNotification.TYPE.QUESTION_BEEN_SHARED,
        push_title       : sharedUserName + '分享您的问题',
        push_content     : questionTitle,
        push_client_id   : clientID,
        create_time : new Date(),
        update_time : new Date(),
    };

    UserNotification.create(notification, function (err, doc) {
        if(err){
            return callback(err);
        }

        let msg = doc._id.toString();

        rabbit.client.produceMessage(rabbit.queues.BUSINESS.QUESTION_BEEN_SHARED, msg, function (err, ch) {
            if(err){
                return callback(err);
            }

            return callback(null, doc._id);
        });
    });
};