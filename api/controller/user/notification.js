/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

const notificationModel = require('../../../public/model/notification');

/**
 * @desc 获取用户系统通知
 * */
exports.getUserSystemNotification = function (req, res, next) {
    let pageSize = req.query.page_size;
    let pageSkip = req.query.page_skip;
    let userId = req.session.id;

    notificationModel.getSysNotificationList(userId, pageSkip, pageSize, function (err, results) {
        if (err) {
            return next(err);
        }
        let count = results.count;
        let list = [];

        results.notifications.forEach(function(notification) {
            list.push({
                id: notification._id,
                title: notification.title,
                content: notification.content,
                type: notification.type,
            })
        });

        res.json({
            flag: '0000',
            msg: '',
            result: {
                count: count,
                list: list
            }
        })
    });
};


/**
 * @desc 获取用户业务通知
 * */
exports.getUserBusinessNotification = function (req, res, next) {
    let pageSize = req.query.page_size;
    let pageSkip = req.query.page_skip;
    let userId = req.session.id;

    notificationModel.getBusinessNotificationList(userId, pageSkip, pageSize, function(err, results) {
        if (err) {
            return next(err);
        }

        let count = results.count;
        let list = [];

        results.notifications.forEach(function(notification) {
            list.push({
                id: notification._id,
                title: notification.title,
                content: notification.content,
                type: notification.type,
            })
        });

        res.json({
            flag: '0000',
            msg: '',
            result: {
                count: count,
                list: list
            }
        })
    });
};


/**
 * @desc 标记通知为已读
 * */
exports.changeNotificationToRead = function (req, res, next) {
    let notificationIDS = req.body.notification_ids;
    let userID = req.session.id;

    if(!Array.isArray(notificationIDS)){
        return next(new BadRequestError('notification_ids should be array'));
    }

    notificationModel.changeNotificationToRead(userID, notificationIDS, function(err, success) {
        if (err) {
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: !!success
            }
        });
    })

};
