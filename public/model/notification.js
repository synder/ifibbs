/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */

const async = require('async');
const mongodb = require('../service/mongodb').db;
const rabbit = require('../service/rabbit');
const getui = require('../service/getui');

const User = mongodb.model('User');
const Question = mongodb.model('Question');
const QuestionAnswer = mongodb.model('QuestionAnswer');
const UserNotification = mongodb.model('UserNotification');
const AttentionUser = mongodb.model('AttentionUser');
const AttentionSubject = mongodb.model('AttentionSubject');
const AttentionQuestion = mongodb.model('AttentionQuestion');


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

    async.eachLimit(notificationIDS, 10, function (id, cb) {

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

    }, function (err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, true);
    });
};

/*
 * @desc 修改通知阅读状态
 * */
exports.changeNotificationToNotified = function (userID, notificationIDS, callback) {

    async.eachLimit(notificationIDS, 10, function (id, cb) {

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

    }, function (err, result) {
        if (err) {
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

    rabbit.client.consumeMessage(QUEUE, function (err, channel, message) {
        if (err) {
            return callback(err);
        }

        let questionID = message.content.toString();

        if (!questionID) {
            return callback(null, null);
        }
        
        //查找问题
        let questionCondition = {_id: questionID, status: Question.STATUS.NORMAL};
        Question.findOne(questionCondition, function (err, question) {
            if(err){
                return callback(err);
            }

            let questionCreateUserID = question.create_user_id;
            let questionTitle = question.title;

            let message = questionTitle + '有了新的回答';


            //推送通知给问题的发布者和关注者
            let attentionUserCondition = {
                to_user_id: questionCreateUserID,        //关注用户ID
                status: AttentionUser.STATUS.ATTENTION
            };

            let temp = [];

            let stream = AttentionUser
                .find(attentionUserCondition)
                .populate({
                    path: 'user_id',
                    select: 'getui_cid',
                    match: {
                        getui_cid: {$exists: true}
                    }
                })
                .stream();

            stream.on('data', function (doc) {

                if (doc.user_id && doc.user_id.getui_cid) {
                    let getuiCID = doc.user_id.getui_cid;
                    temp.push(getuiCID);
                }

                if (temp.length > 19) {
                    stream.pause();
                    let clientIDS = temp;
                    temp = [];
                    getui.notifyTransmissionMsg(true, clientIDS, message, function (err, result) {
                        stream.resume();
                        callback(err, result);
                    });
                }
            }).on('error', function (err) {

                if (temp.length > 0) {
                    let clientIDS = temp;
                    temp = [];
                    getui.notifyTransmissionMsg(true, clientIDS, message, callback);
                }

                callback(err);

            }).on('close', function () {

                if (temp.length > 0) {
                    let clientIDS = temp;
                    temp = [];
                    getui.notifyTransmissionMsg(true, clientIDS, message, callback);
                }

                callback();
            });
        });
    });
};


/**
 * @desc 问题有了新的回答，推送通知给关注该问题的用户和问题的发布者
 * */
exports.produceForQuestionBeenAnsweredMQS = function (questionID, answerID, callback) {
    answerID = answerID.toString();
    //通知相关用户
    async.parallel({
        notifyQuestionOwner: function (cb) {
            const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_ANSWERED;
            rabbit.client.produceMessage(QUEUE, questionID + ':' + answerID, cb);
        },
        notifyQuestionAttentionUser: function (cb) {
            const QUEUE = rabbit.queues.notifications.ATTENTION_QUESTION_BEEN_ANSWERED;
            rabbit.client.produceMessage(QUEUE, answerID, cb);
        },
    }, callback);
};

exports.consumeForQuestionBeenAnsweredMQS = function (callback) {

    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_ANSWERED;
    
    rabbit.client.consumeMessage(QUEUE, function (err, message) {
        if (err) {
            return callback(err);
        }

        let content = message.content.toString();

        if (!content) {
            return callback(null);
        }

        content = content.split(':');

        let questionID = content[0];
        let answerID = content[1];

        async.parallel({
            question: function (cb) {
                let condition = {_id: questionID, status: Question.STATUS.NORMAL};
                Question.findOne(condition, cb);
            },
            answer: function (cb) {
                let condition = {_id: answerID, status: QuestionAnswer.STATUS.NORMAL};
                QuestionAnswer.findOne(condition, cb);
            },
        }, function (err, results) {

            if (err) {
                return callback(err);
            }

            let question = results.question;
            let answer = results.answer;

            if (!question) {
                return callback(null, null);
            }

            if (!answer) {
                return callback(null, null);
            }

            let questionCreateUserID = question.create_user_id;
            let questionTitle = question.title;
            let answerContent = answer.content;

            let message = questionTitle + '有了新的回答';


            //推送通知给问题的发布者和关注者
            let attentionUserCondition = {
                to_user_id: questionCreateUserID,        //关注用户ID
                status: AttentionUser.STATUS.ATTENTION
            };

            let temp = [];

            let stream = AttentionUser
                .find(attentionUserCondition)
                .populate({
                    path: 'user_id',
                    select: 'getui_cid',
                    match: {
                        getui_cid: {$exists: true}
                    }
                })
                .stream();

            stream.on('data', function (doc) {

                if (doc.user_id && doc.user_id.getui_cid) {
                    let getuiCID = doc.user_id.getui_cid;
                    temp.push(getuiCID);
                }

                if (temp.length > 19) {
                    stream.pause();
                    let clientIDS = temp;
                    temp = [];
                    getui.notifyTransmissionMsg(true, clientIDS, message, function (err, result) {
                        stream.resume();
                        callback(err, result);
                    });
                }
            }).on('error', function (err) {

                if (temp.length > 0) {
                    let clientIDS = temp;
                    temp = [];
                    getui.notifyTransmissionMsg(true, clientIDS, message, callback);
                }

                callback(err);

            }).on('close', function () {

                if (temp.length > 0) {
                    let clientIDS = temp;
                    temp = [];
                    getui.notifyTransmissionMsg(true, clientIDS, message, callback);
                }

                callback();
            });
        });
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
    rabbit.client.consumeMessage(QUEUE, function (err, message) {
        if (err) {
            return callback(err);
        }

        let questionID = message.content.toString();

        if (!questionID) {
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

    rabbit.client.produceMessage(QUEUE, subjectID + ':' + articleID, callback);
};

exports.consumeForAttentionSubjectHasNewArticleMQS = function (callback) {
    const QUEUE = rabbit.queues.notifications.ATTENTION_SUBJECT_HAS_NEW_ARTICLE;
    rabbit.client.consumeMessage(QUEUE, function (err, message) {
        if (err) {
            return callback(err);
        }

        let content = message.content.toString();

        if (!content) {
            return callback(null);
        }

        content = content.split(':');

        let subjectID = content[0];
        let articleID = content[1];

        callback(null, subjectID, articleID);
    });
};
