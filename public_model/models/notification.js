/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */

const async = require('async');
const mongodb = require('../public_service/mongodb').db;

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
                .sort('create_time')
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
                .sort("create_time")
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb)
        }
    }, callback)
};

/*
 * @desc 修改通知阅读状态
 * */
exports.changeNotificationToReaded = function (userID, notificationIDS, callback) {
    
    async.eachLimit(notificationIDS, 10, function(id, cb){
        
        let condition = {
            _id: id,
            user_id: userID,
            status: UserNotification.STATUS.UNREAD
        };

        let update = {
            $set: {
                status: UserNotification.STATUS.READED
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
 * @desc 推送通知给手机端
 * */
exports.pushNotificationToSingleUser = function (userID, notification, callback) {
    
};


/**
 * @desc 推送通知给手机端
 * */
exports.pushNotificationToUsers = function (userIDS, notification, callback) {

};


/**
 * @desc 广播通知给所有客户端
 * */
exports.broadcastNotification = function (platform, notification, callback) {

};