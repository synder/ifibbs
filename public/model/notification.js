/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */

const async = require('async');
const ifibbs = require('../service/mongodb').ifibbs;
const rabbit = require('../service/rabbit');
const getui = require('../service/getui');

const User = ifibbs.model('User');
const Question = ifibbs.model('Question');
const QuestionAnswer = ifibbs.model('QuestionAnswer');
const UserNotification = ifibbs.model('UserNotification');
const AttentionUser = ifibbs.model('AttentionUser');
const AttentionSubject = ifibbs.model('AttentionSubject');
const AttentionQuestion = ifibbs.model('AttentionQuestion');


/**
 * @desc 获取未读系统通知
 * */
exports.getNotReadSysNotificationCount = function (userID, callback) {
    let condition = {
        user_id: userID,
        category: UserNotification.CATEGORY.SYSTEM,
        status: UserNotification.STATUS.UNREAD
    };

    UserNotification.count(condition, callback);
};

/**
 * @desc 获取未读业务通知
 * */
exports.getNotReadBusinessNotificationCount = function (userID, callback) {
    let condition = {
        user_id: userID,
        category: UserNotification.CATEGORY.BUSINESS,
        status: UserNotification.STATUS.UNREAD
    };

    UserNotification.count(condition, callback);
};

/*
 * @desc 获取用户系统通知
 * */
exports.getSysNotificationList = function (userId, pageSkip, pageSize, callback) {

    let condition = {
        user_id: userId,
        category: UserNotification.CATEGORY.SYSTEM,
        status: {$ne: UserNotification.STATUS.DELETED}
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
        status: {$ne: UserNotification.STATUS.DELETED}
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
 * @desc 问题被管理员加精
 * */
exports.produceForQuestionBeenStickiedMQS = function (questionID, callback) {

    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_STICKIED;

    let message = questionID + '';

    rabbit.client.produceMessage(QUEUE, message, callback);
};

exports.consumeForQuestionBeenStickiedMQS = function (callback) {

    //推送通知给创建问题的用户和关注该问题的用户

    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_STICKIED;

    const content = {
        func: 'notification',
        type: UserNotification.CATEGORY.BUSINESS
    };

    rabbit.client.consumeMessage(QUEUE, function (err, channel, message) {
        if (err) {
            return callback(err, channel);
        }

        let questionID = message.content.toString();

        let questionCondition = {
            _id: questionID,
            status: Question.STATUS.NORMAL
        };

        Question.findOne(questionCondition, function (err, question) {
            if (err) {
                return callback(err, channel);
            }

            if (!question) {
                return callback(null, channel);
            }

            let createUserID = question.create_user_id;

            async.parallel({
                pushNotifyToQuestionOwner: function (cb) {
                    //推送通知给问题发布者

                    let userCondition = {
                        _id: createUserID,
                    };

                    User.findOne(userCondition, function (err, user) {
                        if (err) {
                            return cb(err);
                        }

                        if (!user) {
                            return cb();
                        }

                        let getuiCID = user.getui_cid;

                        if (!getuiCID) {
                            return cb();
                        }

                        let message = '您发布的问题已被管理员加精';

                        //推送通知给问题的所有者
                        getui.notifyTransmissionMsg([getuiCID], message, content, cb);
                    });
                },

                //推送通知给问题的关注者
                pushNotifyToQuestionAttentionUser: function (cb) {

                    let attentionQuestionCondition = {
                        question_id: questionID,        //关注用户ID
                        status: AttentionQuestion.STATUS.ATTENTION
                    };

                    let message = '您发布的问题已被管理员加精';

                    let stream = AttentionUser
                        .find(attentionQuestionCondition)
                        .populate({
                            path: 'user_id',
                            select: 'getui_cid',
                            match: {
                                getui_cid: {$exists: true}
                            }
                        })
                        .stream();

                    let temp = [];

                    //流的方式处理
                    stream
                        .on('data', function (doc) {

                            let getuiCID = doc.user_id ? doc.user_id.getui_cid : null;

                            if (!getuiCID) {
                                return;
                            }

                            temp.push(getuiCID);

                            if (temp.length > 19) {

                                stream.pause();

                                let clientIDS = temp;

                                temp = [];

                                getui.notifyTransmissionMsg(true, clientIDS, message, function (err, result) {
                                    
                                    stream.resume();
                                    
                                    if(err){
                                        console.error(err.stack);
                                    }
                                });
                            }
                        })
                        .on('error', function (err) {

                            if (temp.length > 0) {

                                let clientIDS = temp;

                                temp = [];

                                getui.notifyTransmissionMsg(true, clientIDS, message, function (err) {
                                    if(err){
                                        console.error(err.stack);
                                    }
                                });
                            }
                            
                            cb(err);

                        })
                        .on('close', function () {

                            if (temp.length > 0) {
                                let clientIDS = temp;
                                temp = [];
                                getui.notifyTransmissionMsg(true, clientIDS, message, function (err) {
                                    if(err){
                                        console.error(err.stack);
                                    }
                                });
                            }

                            cb();
                        });
                },
            }, function (err, results) {
                callback(err, channel);
            });
        });
    });
};


/**
 * @desc 问题被管理员删除
 * */
exports.produceForQuestionBeenDeletedMQS = function (questionID, callback) {

    questionID = questionID.toString();

    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_DELETED;

    rabbit.client.produceMessage(QUEUE, questionID, callback);
};

exports.consumeForQuestionBeenDeletedMQS = function (callback) {

    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_DELETED;

    rabbit.client.consumeMessage(QUEUE, function (err, channel, message) {
        if (err) {
            return callback(err, channel);
        }

        let questionID = message.content.toString();

        //查找问题的创建者
        Question.findOne({_id: questionID})
            .populate({
                path: 'create_user_id',
                select: 'getui_cid',
                match: {
                    getui_cid: {$exists: true}
                }
            })
            .exec(function (err, question) {
                if (err) {
                    return callback(err, channel);
                }

                if (!question) {
                    return callback(null, channel);
                }

                if (question.create_user_id && question.create_user_id.getui_cid) {
                    let getuiCID = question.create_user_id.getui_cid;
                    let questionTitle = question.title;
                    let message = questionTitle + '被管理员加精';

                    //推送通知给问题的所有者
                    getui.notifyTransmissionMsg(true, [getuiCID], message, function (err) {
                        callback(err, channel);
                    });
                } else {
                    callback(null, channel);
                }
            });
    });
};


/**
 * @desc 问题被关注
 * */
exports.produceForQuestionBeenAttentionMQS = function (questionID, callback) {
    questionID = questionID.toString();

    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_ATTENTION;

    rabbit.client.produceMessage(QUEUE, questionID, callback);
};

exports.consumeForQuestionBeenAttentionMQS = function (callback) {

    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_ATTENTION;

    rabbit.client.consumeMessage(QUEUE, function (err, channel, message) {
        if (err) {
            return callback(err, channel);
        }

        let questionID = message.content.toString();

        if (!questionID) {
            return callback(null, channel);
        }

        //查找问题
        let questionCondition = {_id: questionID, status: Question.STATUS.NORMAL};

        Question.findOne(questionCondition, function (err, question) {
            if (err) {
                return callback(err, channel);
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

                //一次批量推送20条
                if (temp.length > 19) {
                    stream.pause();
                    let clientIDS = temp;
                    temp = [];
                    getui.notifyTransmissionMsg(true, clientIDS, message, function (err, result) {
                        stream.resume();
                        callback(err, channel);
                    });
                }

            }).on('error', function (err) {
                if (temp.length > 0) {
                    let clientIDS = temp;
                    temp = [];
                    getui.notifyTransmissionMsg(true, clientIDS, message, function (err) {
                        callback(err, channel);
                    });
                } else {
                    callback(err, channel);
                }
            }).on('close', function () {

                if (temp.length > 0) {
                    let clientIDS = temp;
                    temp = [];
                    getui.notifyTransmissionMsg(true, clientIDS, message, function (err) {
                        callback(err, channel);
                    });
                } else {
                    callback(null, channel);
                }
            });
        });
    });
};


/**
 * @desc 问题有了新的回答
 * */
exports.produceForQuestionBeenAnsweredMQS = function (questionID, answerID, callback) {

    answerID = answerID.toString();

    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_ANSWERED;

    rabbit.client.produceMessage(QUEUE, questionID + ':' + answerID, callback);
};

exports.consumeForQuestionBeenAnsweredMQS = function (callback) {

    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_ANSWERED;

    rabbit.client.consumeMessage(QUEUE, function (err, channel, message) {
        if (err) {
            return callback(err, channel);
        }

        let content = message.content.toString();

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
                return callback(err, channel);
            }

            let question = results.question;
            let answer = results.answer;

            if (!question) {
                return callback(null, channel);
            }

            if (!answer) {
                return callback(null, channel);
            }

            let questionCreateUserID = question.create_user_id;
            let questionTitle = question.title;

            let message = questionTitle + '有了新的回答';


            async.parallel({
                pushToAttentionUser: function (cb) {
                    let temp = [];

                    //推送通知给问题关注者
                    let attentionUserCondition = {
                        to_user_id: questionCreateUserID,        //关注用户ID
                        status: AttentionUser.STATUS.ATTENTION
                    };

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

                    //流的方式处理
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
                },
                pushToQuestionOwner: function (cb) {

                },
            }, function (err, results) {

                if (err) {
                    return;
                }

                let pushToAttentionUser = results.pushToAttentionUser;
                let pushToQuestionOwner = results.pushToQuestionOwner;

            });


        });
    });
};


/**
 * @desc 问题被收藏
 * */
exports.produceForQuestionBeenCollectedMQS = function (questionID, userID, callback) {

    questionID = questionID.toString();

    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_COLLECTED;

    let message = questionID + ':' + userID;

    rabbit.client.produceMessage(QUEUE, questionID, callback);
};

exports.consumeForQuestionBeenCollectedMQS = function (callback) {

    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_COLLECTED;

    rabbit.client.consumeMessage(QUEUE, function (err, channel, message) {
        if (err) {
            return callback(err, channel);
        }

        let content = message.content.toString();


    });
};


/**
 * @desc 问题被分享
 * */
exports.produceForQuestionBeenSharedMQS = function (questionID, userID, callback) {

    questionID = questionID.toString();

    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_STICKIED;

    let message = questionID + ':' + userID;

    rabbit.client.produceMessage(QUEUE, questionID, callback);
};

exports.consumeForQuestionBeenSharedMQS = function (callback) {
    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_STICKIED;
    rabbit.client.consumeMessage(QUEUE, function (err, channel, message) {
        if (err) {
            return callback(err, channel);
        }

        let content = message.content.toString();


    });
};


/**
 * @desc 回答被点赞
 * */
exports.produceForAnswerBeenFavouredMQS = function (questionID, userID, callback) {

    questionID = questionID.toString();

    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_STICKIED;

    let message = questionID + ':' + userID;

    rabbit.client.produceMessage(QUEUE, questionID, callback);
};

exports.consumeForAnswerBeenFavouredMQS = function (callback) {
    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_STICKIED;
    rabbit.client.consumeMessage(QUEUE, function (err, channel, message) {
        if (err) {
            return callback(err, channel);
        }

        let content = message.content.toString();


    });
};


/**
 * @desc 回答被评论
 * */
exports.produceForAnswerBeenCommendedMQS = function (answerID, commentID, callback) {

    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_STICKIED;

    let message = answerID + ':' + commentID;

    rabbit.client.produceMessage(QUEUE, message, callback);

};

exports.consumeForAnswerBeenCommendedMQS = function (callback) {
    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_STICKIED;
    rabbit.client.consumeMessage(QUEUE, function (err, channel, message) {
        if (err) {
            return callback(err, channel);
        }

        let content = message.content.toString();

    });
};


/**
 * @desc 用户发布了新的问题
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
            return callback(err, channel);
        }

        let questionID = message.content.toString();

        if (!questionID) {
            return callback(null, channel);
        }

        //查找问题
        let questionCondition = {_id: questionID, status: Question.STATUS.NORMAL};

        Question.findOne(questionCondition, function (err, question) {
            if (err) {
                return callback(err, channel);
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

                //一次批量推送20条
                if (temp.length > 19) {
                    stream.pause();
                    let clientIDS = temp;
                    temp = [];
                    getui.notifyTransmissionMsg(true, clientIDS, message, function (err, result) {
                        stream.resume();
                        callback(err, channel);
                    });
                }

            }).on('error', function (err) {
                if (temp.length > 0) {
                    let clientIDS = temp;
                    temp = [];
                    getui.notifyTransmissionMsg(true, clientIDS, message, function (err) {
                        callback(err, channel);
                    });
                } else {
                    callback(err, channel);
                }
            }).on('close', function () {

                if (temp.length > 0) {
                    let clientIDS = temp;
                    temp = [];
                    getui.notifyTransmissionMsg(true, clientIDS, message, function (err) {
                        callback(err, channel);
                    });
                } else {
                    callback(null, channel);
                }
            });
        });
    });
};


/**
 * @desc 专题有了新的文章
 * */
exports.produceForSubjectHasNewArticleMQS = function (subjectID, articleID, callback) {

    const QUEUE = rabbit.queues.notifications.ATTENTION_SUBJECT_HAS_NEW_ARTICLE;

    let message = subjectID + ':' + articleID;

    rabbit.client.produceMessage(QUEUE, message, callback);
};

exports.consumeForSubjectHasNewArticleMQS = function (callback) {

    const QUEUE = rabbit.queues.notifications.ATTENTION_SUBJECT_HAS_NEW_ARTICLE;

    rabbit.client.consumeMessage(QUEUE, function (err, channel, message) {
        if (err) {
            return callback(err, channel);
        }

        let content = message.content.toString();

        if (!content) {
            return callback(null, channel);
        }

        content = content.split(':');

        let subjectID = content[0];
        let articleID = content[1];

        callback(null, channel);
    });
};


/**
 * @desc 用户被关注
 * */
exports.produceForUserBeenAttentionMQS = function (userID, toUserID, callback) {

    const QUEUE = rabbit.queues.notifications.USER_BEEN_ATTENTION;

    let message = userID + ':' + toUserID;

    rabbit.client.produceMessage(QUEUE, message, callback);
};

exports.consumeForUserBeenAttentionMQS = function (callback) {

    const QUEUE = rabbit.queues.notifications.USER_BEEN_ATTENTION;

    rabbit.client.consumeMessage(QUEUE, function (err, channel, message) {
        if (err) {
            return callback(err, channel);
        }

        let content = message.content.toString();


    });
};


//系统推送=======================================================================