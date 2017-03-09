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
const AnswerComment = ifibbs.model('AnswerComment');
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

/**
 * @desc 批量删除
 * */
exports.removeNotification = function (userID, notificationIDS, callback) {
    async.eachLimit(notificationIDS, 10, function (id, cb) {

        let condition = {
            _id: id,
            user_id: userID,
            status: {$ne: UserNotification.STATUS.DELETED}
        };

        let update = {
            $set: {
                status: UserNotification.STATUS.DELETED
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

    rabbit.client.consumeMessage(QUEUE, function (err, channel, message) {
        if (err) {
            return callback(err, channel);
        }

        let questionID = message.content.toString();

        let questionCondition = {
            _id: questionID,
            status: Question.STATUS.NORMAL
        };

        Question.findOne(questionCondition)
            .populate('create_user_id')
            .exec(function (err, question) {
                if (err) {
                    return callback(err, channel);
                }

                if (!question) {
                    return callback(null, channel);
                }

                let createUserID = question.create_user_id ? question.create_user_id._id : null;
                let createUserName = question.create_user_id ? question.create_user_id.user_name : null;
                let createUserGetuiCID = question.create_user_id ? question.create_user_id.getui_cid : null;
                let questionTitle = question.title;

                if (!createUserID) {
                    return callback(null, channel);
                }

                if (!createUserGetuiCID) {
                    return callback(null, channel);
                }

                async.parallel({
                    pushNotifyToQuestionOwner: function (cb) {
                        //推送通知给问题发布者

                        let message = '您发布的问题已被管理员加精';
                        const content = {
                            func: 'notification',
                            type: UserNotification.CATEGORY.SYSTEM
                        };

                        async.parallel({
                            push: function (cb) {
                                //推送通知给问题的所有者
                                getui.notifyTransmissionMsg([createUserGetuiCID], message, content, cb);
                            },
                            save: function (cb) {
                                UserNotification.create({
                                    status: UserNotification.STATUS.UNREAD,      //通知状态
                                    category: UserNotification.CATEGORY.SYSTEM,      //通知类别
                                    type: UserNotification.TYPE.USER_QUESTION_BEEN_STICKIED,      //通知类型
                                    push_title: message,      //通知标题
                                    push_content: questionTitle,      //通知内容
                                    push_content_id: questionID,     //通知内容ID
                                    push_client_id: createUserGetuiCID,     //客户端ID，详见个推文档
                                    push_task_id: null,     //任务ID，详见个推文档
                                    push_time: new Date(),   //推送时间
                                    create_time: new Date(),    //创建时间
                                    update_time: new Date(),    //更新时间
                                    user_id: createUserID,    //用户ID
                                }, cb);
                            },
                        }, cb);
                    },

                    //推送通知给问题的关注者
                    pushNotifyToQuestionAttentionUser: function (cb) {

                        let attentionQuestionCondition = {
                            question_id: questionID,        //关注用户ID
                            status: AttentionQuestion.STATUS.ATTENTION
                        };

                        let message = createUserName + ' 发布的问题已被管理员加精';

                        const content = {
                            func: 'notification',
                            type: UserNotification.CATEGORY.SYSTEM
                        };

                        let stream = AttentionUser
                            .find(attentionQuestionCondition)
                            .populate({
                                path: 'user_id',
                                select: '_id getui_cid',
                                match: {
                                    getui_cid: {$exists: true}
                                }
                            })
                            .stream();

                        let clientIDS = [];
                        let notifications = [];

                        //推送函数
                        let pushAndSaveFunction = function (clientIDS, notifications, callback) {
                            async.parallel({
                                save: function (cb) {
                                    UserNotification.create(notifications, cb);
                                },
                                push: function (cb) {
                                    getui.notifyTransmissionMsg(true, clientIDS, message, content, cb);
                                },
                            }, function (err) {

                                clientIDS = [];
                                notifications = [];

                                callback(err);
                            });
                        };

                        //流的方式处理
                        stream
                            .on('data', function (doc) {

                                let getuiCID = doc.user_id ? doc.user_id.getui_cid : null;
                                let userID = doc.user_id ? doc.user_id._id : null;

                                if (!getuiCID) {
                                    return;
                                }

                                if (!userID) {
                                    return;
                                }

                                clientIDS.push(getuiCID);
                                notifications.push({
                                    status: UserNotification.STATUS.UNREAD,      //通知状态
                                    category: UserNotification.CATEGORY.SYSTEM,      //通知类别
                                    type: UserNotification.TYPE.USER_QUESTION_BEEN_STICKIED,      //通知类型
                                    push_title: message,      //通知标题
                                    push_content: questionTitle,      //通知内容
                                    push_content_id: questionID,     //通知内容ID
                                    push_client_id: getuiCID,     //客户端ID，详见个推文档
                                    push_task_id: null,     //任务ID，详见个推文档
                                    push_time: new Date(),   //推送时间
                                    create_time: new Date(),    //创建时间
                                    update_time: new Date(),    //更新时间
                                    user_id: userID,    //用户ID
                                });

                                if (clientIDS.length > 19) {

                                    stream.pause();

                                    pushAndSaveFunction(clientIDS, notifications, function (err) {
                                        if (err) {
                                            console.error(err.stack);
                                        }

                                        stream.resume();
                                    });
                                }
                            })
                            .on('error', function (err) {

                                if (clientIDS.length > 0) {
                                    pushAndSaveFunction(clientIDS, notifications, function (err) {
                                        if (err) {
                                            console.error(err.stack);
                                        }
                                    });
                                }

                                cb(err);

                            })
                            .on('close', function () {

                                if (clientIDS.length > 0) {
                                    pushAndSaveFunction(clientIDS, notifications, function (err) {
                                        if (err) {
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

    //推送通知给问题的所有者
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
                select: '_id getui_cid',
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

                let userID = question.create_user_id ? question.create_user_id._id : null;
                let getuiCID = question.create_user_id ? question.create_user_id.getui_cid : null;

                if (!getuiCID) {
                    return callback(null, channel);
                }

                if (!userID) {
                    return callback(null, channel);
                }

                const message = "您的问题被管理员加精";
                const content = {
                    func: 'notification',
                    type: UserNotification.CATEGORY.SYSTEM
                };

                async.parallel({
                    push: function (cb) {
                        //推送通知给问题的所有者
                        getui.notifyTransmissionMsg([getuiCID], message, content, cb);
                    },
                    save: function (cb) {
                        UserNotification.create({
                            status: UserNotification.STATUS.UNREAD,      //通知状态
                            category: UserNotification.CATEGORY.SYSTEM,      //通知类别
                            type: UserNotification.TYPE.USER_QUESTION_BEEN_STICKIED,      //通知类型
                            push_title: message,      //通知标题
                            push_content: question.title,      //通知内容
                            push_content_id: questionID,     //通知内容ID
                            push_client_id: getuiCID,     //客户端ID，详见个推文档
                            push_task_id: null,     //任务ID，详见个推文档
                            push_time: new Date(),   //推送时间
                            create_time: new Date(),    //创建时间
                            update_time: new Date(),    //更新时间
                            user_id: userID,    //用户ID
                        }, cb);
                    },
                }, function (err) {
                    callback(err, channel);
                });
            });
    });
};


/**
 * @desc 问题被关注
 * */
exports.produceForQuestionBeenAttentionMQS = function (userID, questionID, callback) {
    questionID = questionID.toString();

    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_ATTENTION;

    let message = userID + ':' + questionID;

    rabbit.client.produceMessage(QUEUE, message, callback);
};

exports.consumeForQuestionBeenAttentionMQS = function (callback) {
    //推送通知给问题的所有者

    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_ATTENTION;

    rabbit.client.consumeMessage(QUEUE, function (err, channel, message) {
        if (err) {
            return callback(err, channel);
        }

        let content = message.content.toString();

        if (!content) {
            return callback(null, channel);
        }

        content = content.split(':');

        let userID = content[0];
        let questionID = content[1];

        //查找问题
        let attentionCondition = {question_id: questionID, user_id: userID};

        AttentionQuestion.findOne(attentionCondition)
            .populate('user_id')
            .populate('question_user_id')
            .exec(function (err, question) {
                if (err) {
                    return callback(err, channel);
                }

                if (!question) {
                    return callback(null, channel);
                }

                let attentionUserID = question.user_id ? question.user_id._id : null;
                let attentionUserName = question.user_id ? question.user_id.user_name : null;
                let questionCreateUserID = question.question_user_id ? question.question_user_id._id : null;
                let questionCreateUserGetuiCID = question.question_user_id ? question.question_user_id.getui_cid : null;

                if (!attentionUserID) {
                    return callback(null, channel);
                }

                if (!questionCreateUserID) {
                    return callback(null, channel);
                }

                if (!questionCreateUserGetuiCID) {
                    return callback(null, channel);
                }

                const message = attentionUserName + ' 关注了你的问题';
                const content = {
                    func: 'notification',
                    type: UserNotification.CATEGORY.BUSINESS
                };


                async.parallel({
                    push: function (cb) {
                        //推送通知给问题的所有者
                        getui.notifyTransmissionMsg([questionCreateUserGetuiCID], message, content, cb);
                    },
                    save: function (cb) {
                        UserNotification.create({
                            status: UserNotification.STATUS.UNREAD,      //通知状态
                            category: UserNotification.CATEGORY.BUSINESS,      //通知类别
                            type: UserNotification.TYPE.USER_QUESTION_BEEN_ATTENTION,      //通知类型
                            push_title: message,      //通知标题
                            push_content: JSON.stringify(content),      //通知内容
                            push_content_id: questionID,     //通知内容ID
                            push_client_id: questionCreateUserGetuiCID,     //客户端ID，详见个推文档
                            push_task_id: null,     //任务ID，详见个推文档
                            push_time: new Date(),   //推送时间
                            create_time: new Date(),    //创建时间
                            update_time: new Date(),    //更新时间
                            user_id: questionCreateUserID,    //用户ID
                        }, cb);
                    },
                }, function (err) {
                    callback(err, channel);
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

    let message = questionID + ':' + answerID;

    rabbit.client.produceMessage(QUEUE, message, callback);
};

exports.consumeForQuestionBeenAnsweredMQS = function (callback) {

    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_ANSWERED;

    //推送通知给问题所有者和问题关注者

    rabbit.client.consumeMessage(QUEUE, function (err, channel, message) {
        if (err) {
            return callback(err, channel);
        }

        let content = message.content.toString();

        content = content.split(':');

        if (!content) {
            return callback(null, channel);
        }

        let questionID = content[0];
        let answerID = content[1];


        async.parallel({
            question: function (cb) {
                let condition = {
                    _id: questionID,
                    status: Question.STATUS.NORMAL
                };

                Question.findOne(condition)
                    .populate('create_user_id')
                    .exec(cb);
            },
            answer: function (cb) {
                let condition = {
                    _id: answerID,
                    status: QuestionAnswer.STATUS.NORMAL
                };

                QuestionAnswer.findOne(condition)
                    .populate('create_user_id')
                    .exec(cb);
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

            let questionTitle = question.title;

            let questionCreateUserID = question.create_user_id ? question.create_user_id._id : null;
            let questionCreateUserName = question.create_user_id ? question.create_user_id.user_name : null;
            let questionCreateUserGetuiCID = question.create_user_id ? question.create_user_id.getui_cid : null;

            let answerCreateUserID = answer.create_user_id ? answer.create_user_id._id : null;
            let answerCreateUserName = answer.create_user_id ? answer.create_user_id.user_name : null;
            let answerCreateUserGetuiCID = answer.create_user_id ? answer.create_user_id.getui_cid : null;

            if (!(questionCreateUserID && answerCreateUserID)) {
                return callback(null, channel);
            }

            if (!(questionCreateUserGetuiCID && answerCreateUserGetuiCID)) {
                return callback(null, channel);
            }

            async.parallel({
                //推送通知给问题发布者
                pushNotifyToQuestionOwner: function (cb) {

                    const message = answerCreateUserName + ' 回答了您发布的问题';

                    const content = {
                        func: 'notification',
                        type: UserNotification.CATEGORY.BUSINESS
                    };

                    async.parallel({
                        push: function (cb) {
                            //推送通知给问题的所有者
                            getui.notifyTransmissionMsg([questionCreateUserGetuiCID], message, content, cb);
                        },
                        save: function (cb) {
                            UserNotification.create({
                                status: UserNotification.STATUS.UNREAD,      //通知状态
                                category: UserNotification.CATEGORY.SYSTEM,      //通知类别
                                type: UserNotification.TYPE.USER_QUESTION_BEEN_ANSWERED,      //通知类型
                                push_title: message,      //通知标题
                                push_content: questionTitle,      //通知内容
                                push_content_id: questionID,     //通知内容ID
                                push_client_id: questionCreateUserGetuiCID,     //客户端ID，详见个推文档
                                push_task_id: null,     //任务ID，详见个推文档
                                push_time: new Date(),   //推送时间
                                create_time: new Date(),    //创建时间
                                update_time: new Date(),    //更新时间
                                user_id: questionCreateUserID,    //用户ID
                            }, cb);
                        },
                    }, cb);
                },

                //推送通知给问题的关注者
                pushNotifyToQuestionAttentionUser: function (cb) {

                    const message = answerCreateUserName + ' 回答了你关注的问题';
                    const content = {
                        func: 'notification',
                        type: UserNotification.CATEGORY.SYSTEM
                    };

                    let attentionQuestionCondition = {
                        question_id: questionID,        //关注用户ID
                        status: AttentionQuestion.STATUS.ATTENTION
                    };

                    let stream = AttentionQuestion
                        .find(attentionQuestionCondition)
                        .populate({
                            path: 'user_id',
                            select: '_id getui_cid',
                            match: {
                                getui_cid: {$exists: true}
                            }
                        })
                        .stream();

                    let clientIDS = [];
                    let notifications = [];

                    //推送函数
                    let pushAndSaveFunction = function (clientIDS, notifications, callback) {
                        async.parallel({
                            save: function (cb) {
                                UserNotification.create(notifications, cb);
                            },
                            push: function (cb) {
                                getui.notifyTransmissionMsg(true, clientIDS, message, content, cb);
                            },
                        }, function (err) {

                            clientIDS = [];
                            notifications = [];

                            callback(err);
                        });
                    };

                    //流的方式处理
                    stream
                        .on('data', function (doc) {

                            let getuiCID = doc.user_id ? doc.user_id.getui_cid : null;
                            let userID = doc.user_id ? doc.user_id._id : null;

                            if (!getuiCID) {
                                return;
                            }

                            if (!userID) {
                                return;
                            }

                            clientIDS.push(getuiCID);
                            notifications.push({
                                status: UserNotification.STATUS.UNREAD,      //通知状态
                                category: UserNotification.CATEGORY.BUSINESS,      //通知类别
                                type: UserNotification.TYPE.USER_QUESTION_BEEN_ANSWERED,      //通知类型
                                push_title: message,      //通知标题
                                push_content: questionTitle,      //通知内容
                                push_content_id: questionID,     //通知内容ID
                                push_client_id: getuiCID,     //客户端ID，详见个推文档
                                push_task_id: null,     //任务ID，详见个推文档
                                push_time: new Date(),   //推送时间
                                create_time: new Date(),    //创建时间
                                update_time: new Date(),    //更新时间
                                user_id: userID,    //用户ID
                            });

                            if (clientIDS.length > 19) {

                                stream.pause();

                                pushAndSaveFunction(clientIDS, notifications, function (err) {
                                    if (err) {
                                        console.error(err.stack);
                                    }

                                    stream.resume();
                                });
                            }
                        })
                        .on('error', function (err) {

                            if (clientIDS.length > 0) {
                                pushAndSaveFunction(clientIDS, notifications, function (err) {
                                    if (err) {
                                        console.error(err.stack);
                                    }
                                });
                            }

                            cb(err);

                        })
                        .on('close', function () {

                            if (clientIDS.length > 0) {
                                pushAndSaveFunction(clientIDS, notifications, function (err) {
                                    if (err) {
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
 * @desc 问题被分享
 * */
exports.produceForQuestionBeenSharedMQS = function (userID, questionID, callback) {

    questionID = questionID.toString();

    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_SHARED;

    let message = userID + ':' + questionID;

    rabbit.client.produceMessage(QUEUE, message, callback);
};

exports.consumeForQuestionBeenSharedMQS = function (callback) {

    const QUEUE = rabbit.queues.notifications.USER_QUESTION_BEEN_SHARED;

    rabbit.client.consumeMessage(QUEUE, function (err, channel, message) {
        if (err) {
            return callback(err, channel);
        }

        let content = message.content.toString();

        if (!content) {
            return callback(null, channel);
        }

        content = content.split(':');

        let userID = content[0];
        let questionID = content[1];

        async.parallel({
            shareUser: function (cb) {
                User.findOne({_id: userID}, cb);
            },
            question: function (cb) {
                Question.findOne({_id: questionID})
                    .populate('create_user_id')
                    .exec(cb);
            },
        }, function (err, results) {

            if (err) {
                return callback(err, channel);
            }

            let shareUser = results.shareUser;
            let question = results.question;

            if (!shareUser) {
                return callback(null, channel);
            }

            if (!question) {
                return callback(null, channel);
            }

            //推送通知给问题所有者
            let shareUserID = shareUser._id;
            let shareUserName = shareUser.user_name;
            let questionOwnerID = question.create_user_id ? question.create_user_id._id : null;
            let questionOwnerGetuiCID = question.create_user_id ? question.create_user_id.getui_cid : null;
            let questionTitle = question.title;

            if (!(shareUserID && questionOwnerID && questionOwnerGetuiCID)) {
                return callback(null, channel);
            }

            let message = shareUserName + ' 分享了您发布的问题';
            const content = {
                func: 'notification',
                type: UserNotification.CATEGORY.BUSINESS
            };

            async.parallel({
                push: function (cb) {
                    //推送通知给问题的所有者
                    getui.notifyTransmissionMsg([questionOwnerGetuiCID], message, content, cb);
                },
                save: function (cb) {
                    UserNotification.create({
                        status: UserNotification.STATUS.UNREAD,      //通知状态
                        category: UserNotification.CATEGORY.SYSTEM,      //通知类别
                        type: UserNotification.TYPE.USER_QUESTION_BEEN_SHARED,      //通知类型
                        push_title: message,      //通知标题
                        push_content: questionTitle,      //通知内容
                        push_content_id: questionID,     //通知内容ID
                        push_client_id: questionOwnerGetuiCID,     //客户端ID，详见个推文档
                        push_task_id: null,     //任务ID，详见个推文档
                        push_time: new Date(),   //推送时间
                        create_time: new Date(),    //创建时间
                        update_time: new Date(),    //更新时间
                        user_id: questionOwnerID,    //用户ID
                    }, cb);
                },
            }, function (err) {
                callback(err, channel);
            });
        });
    });
};


/**
 * @desc 回答被点赞
 * */
exports.produceForAnswerBeenFavouredMQS = function (userID, answerID, callback) {

    const QUEUE = rabbit.queues.notifications.USER_ANSWER_BEEN_FAVOURED;

    let message = userID + ':' + answerID;

    rabbit.client.produceMessage(QUEUE, message, callback);
};

exports.consumeForAnswerBeenFavouredMQS = function (callback) {

    const QUEUE = rabbit.queues.notifications.USER_ANSWER_BEEN_FAVOURED;

    rabbit.client.consumeMessage(QUEUE, function (err, channel, message) {
        if (err) {
            return callback(err, channel);
        }

        let content = message.content.toString();

        if (!content) {
            return callback(null, channel);
        }

        content = content.split(':');

        let userID = content[0];
        let answerID = content[1];

        async.parallel({
            favourUser: function (cb) {
                User.findOne({_id: userID}, cb);
            },
            answer: function (cb) {
                QuestionAnswer.findOne({_id: answerID})
                    .populate('create_user_id')
                    .exec(cb);
            },
        }, function (err, results) {
            if (err) {
                return callback(err, channel);
            }

            let favourUser = results.favourUser;
            let answer = results.answer;

            if (!favourUser) {
                return callback(null, channel);
            }

            if (!answer) {
                return callback(null, channel);
            }

            //推送通知给回答所有者
            let favourUserID = favourUser._id;
            let favourUserName = favourUser.user_name;
            let answerUserID = answer.create_user_id ? answer.create_user_id._id : null;
            let answerUserName = answer.create_user_id ? answer.create_user_id.user_name : null;
            let answerUserGetuiCID = answer.create_user_id ? answer.create_user_id.getui_cid : null;
            let answerContent = answer.content;

            if (!(favourUserID && answerUserID && answerUserGetuiCID)) {
                return callback(null, channel);
            }

            let message = favourUserName + ' 赞了您的回答';

            const content = {
                func: 'notification',
                type: UserNotification.CATEGORY.BUSINESS
            };

            async.parallel({
                push: function (cb) {
                    //推送通知给问题的所有者
                    getui.notifyTransmissionMsg([answerUserGetuiCID], message, content, cb);
                },
                save: function (cb) {
                    UserNotification.create({
                        status: UserNotification.STATUS.UNREAD,      //通知状态
                        category: UserNotification.CATEGORY.SYSTEM,      //通知类别
                        type: UserNotification.TYPE.USER_QUESTION_BEEN_STICKIED,      //通知类型
                        push_title: message,      //通知标题
                        push_content: answerContent,      //通知内容
                        push_content_id: answerID,        //通知内容ID
                        push_client_id: answerUserGetuiCID,     //客户端ID，详见个推文档
                        push_task_id: null,     //任务ID，详见个推文档
                        push_time: new Date(),   //推送时间
                        create_time: new Date(),    //创建时间
                        update_time: new Date(),    //更新时间
                        user_id: answerUserID,    //用户ID
                    }, cb);
                },
            }, function (err) {
                callback(err, channel);
            });
        });
    });
};


/**
 * @desc 回答被评论
 * */
exports.produceForAnswerBeenCommendedMQS = function (answerID, commentID, callback) {

    const QUEUE = rabbit.queues.notifications.USER_ANSWER_BEEN_COMMEND;

    let message = answerID + ':' + commentID;

    rabbit.client.produceMessage(QUEUE, message, callback);

};

exports.consumeForAnswerBeenCommendedMQS = function (callback) {

    const QUEUE = rabbit.queues.notifications.USER_ANSWER_BEEN_COMMEND;

    rabbit.client.consumeMessage(QUEUE, function (err, channel, message) {
        if (err) {
            return callback(err, channel);
        }

        let content = message.content.toString();

        if (!content) {
            return callback(null, channel);
        }

        content = content.split(':');

        let answerID = content[0];
        let commentID = content[1];

        async.parallel({
            comment: function (cb) {
                AnswerComment.findOne({_id: commentID})
                    .populate('create_user_id')
                    .exec(cb);
            },
            answer: function (cb) {
                QuestionAnswer.findOne({_id: answerID})
                    .populate('create_user_id')
                    .exec(cb);
            },
        }, function (err, results) {

            if (err) {
                return;
            }

            let comment = results.comment;
            let answer = results.answer;

            if (!comment) {
                return callback(null, channel);
            }

            if (!answer) {
                return callback(null, channel);
            }

            let commentUserID = comment.create_user_id ? comment.create_user_id._id : null;
            let commentUserName = comment.create_user_id ? comment.create_user_id.user_name : null;
            let commentContent = comment.content;

            let answerUserID = answer.create_user_id ? answer.create_user_id._id : null;
            let answerUserGetuiCID = answer.create_user_id ? answer.create_user_id.getui_cid : null;
            let answerContent = answer.content;

            if (!(commentUserID && answerUserID && answerUserGetuiCID)) {
                return callback(null, channel);
            }

            let message = commentUserName + ' 评论了您的回答';

            const content = {
                func: 'notification',
                type: UserNotification.CATEGORY.BUSINESS
            };

            async.parallel({
                push: function (cb) {
                    //推送通知给问题的所有者
                    getui.notifyTransmissionMsg([answerUserGetuiCID], message, content, cb);
                },
                save: function (cb) {
                    UserNotification.create({
                        status: UserNotification.STATUS.UNREAD,      //通知状态
                        category: UserNotification.CATEGORY.SYSTEM,      //通知类别
                        type: UserNotification.TYPE.USER_ANSWER_BEEN_COMMEND,      //通知类型
                        push_title: message,      //通知标题
                        push_content: answerContent,      //通知内容
                        push_content_id: answerID,        //通知内容ID
                        push_client_id: answerUserGetuiCID,     //客户端ID，详见个推文档
                        push_task_id: null,     //任务ID，详见个推文档
                        push_time: new Date(),   //推送时间
                        create_time: new Date(),    //创建时间
                        update_time: new Date(),    //更新时间
                        user_id: answerUserID,    //用户ID
                    }, cb);
                },
            }, function (err) {
                callback(err, channel);
            });

        });

    });
};


/**
 * @desc 用户发布了新的问题
 * */
exports.produceForUserPublishNewQuestionMQS = function (questionID, callback) {

    const QUEUE = rabbit.queues.notifications.ATTENTION_USER_PUBLISH_NEW_QUESTION;

    let message = questionID.toString();

    rabbit.client.produceMessage(QUEUE, message, callback);
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

        Question.findOne({_id: questionID, status: Question.STATUS.NORMAL})
            .populate('create_user_id')
            .exec(function (err, question) {
                if (err) {
                    return callback(err, channel);
                }

                let questionCreateUserID = question.create_user_id ? question.create_user_id._id : null;
                let questionCreateUserName = question.create_user_id ? question.create_user_id.user_name : null;
                
                let questionTitle = question.title;

                if (!questionCreateUserID){
                    return callback(null, channel);
                }

                let attentionQuestionCondition = {
                    question_id: questionID,        //关注用户ID
                    status: AttentionQuestion.STATUS.ATTENTION
                };

                let message = questionCreateUserName + ' 发布了新的问题';

                const content = {
                    func: 'notification',
                    type: UserNotification.CATEGORY.BUSINESS
                };

                let stream = AttentionUser
                    .find(attentionQuestionCondition)
                    .populate({
                        path: 'user_id',
                        select: '_id getui_cid',
                        match: {
                            getui_cid: {$exists: true}
                        }
                    })
                    .stream();

                let clientIDS = [];
                let notifications = [];

                //推送函数
                let pushAndSaveFunction = function (clientIDS, notifications, callback) {
                    async.parallel({
                        save: function (cb) {
                            UserNotification.create(notifications, cb);
                        },
                        push: function (cb) {
                            getui.notifyTransmissionMsg(true, clientIDS, message, content, cb);
                        },
                    }, function (err) {

                        clientIDS = [];
                        notifications = [];

                        callback(err);
                    });
                };

                //流的方式处理
                stream
                    .on('data', function (doc) {

                        let getuiCID = doc.user_id ? doc.user_id.getui_cid : null;
                        let userID = doc.user_id ? doc.user_id._id : null;

                        if (!getuiCID) {
                            return;
                        }

                        if (!userID) {
                            return;
                        }

                        clientIDS.push(getuiCID);
                        notifications.push({
                            status: UserNotification.STATUS.UNREAD,      //通知状态
                            category: UserNotification.CATEGORY.SYSTEM,      //通知类别
                            type: UserNotification.TYPE.USER_QUESTION_BEEN_STICKIED,      //通知类型
                            push_title: message,      //通知标题
                            push_content: questionTitle,      //通知内容
                            push_content_id: questionID,     //通知内容ID
                            push_client_id: getuiCID,     //客户端ID，详见个推文档
                            push_task_id: null,     //任务ID，详见个推文档
                            push_time: new Date(),   //推送时间
                            create_time: new Date(),    //创建时间
                            update_time: new Date(),    //更新时间
                            user_id: userID,    //用户ID
                        });

                        if (clientIDS.length > 19) {

                            stream.pause();

                            pushAndSaveFunction(clientIDS, notifications, function (err) {
                                if (err) {
                                    console.error(err.stack);
                                }

                                stream.resume();
                            });
                        }
                    })
                    .on('error', function (err) {

                        if (clientIDS.length > 0) {
                            pushAndSaveFunction(clientIDS, notifications, function (err) {
                                if (err) {
                                    console.error(err.stack);
                                }
                            });
                        }

                        callback(err);

                    })
                    .on('close', function () {

                        if (clientIDS.length > 0) {
                            pushAndSaveFunction(clientIDS, notifications, function (err) {
                                if (err) {
                                    console.error(err.stack);
                                }
                            });
                        }

                        callback();
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

        if (!content) {
            return callback(null, channel);
        }

        content = content.split(':');

        let userID = content[0];
        let toUserID = content[1];
        
        async.parallel({
            user: function(cb) { 
                User.findOne({_id: userID}, cb);
            },
            toUser: function(cb) {
                User.findOne({_id: toUserID}, cb);
            },
        }, function (err, results) {
        
            if(err){
                 return ;
            }
            
            let user = results.user;
            let toUser = results.toUser;
            
            if(!(user && toUser)){
                return callback(null, channel);
            }
            
            let userName = user.user_name;
            let toUserGetuiCID = toUser.getui_cid;

            let message = userName + ' 关注了您';

            const content = {
                func: 'notification',
                type: UserNotification.CATEGORY.BUSINESS
            };

            async.parallel({
                push: function (cb) {
                    //推送通知给问题的所有者
                    getui.notifyTransmissionMsg([toUserGetuiCID], message, content, cb);
                },
                save: function (cb) {
                    UserNotification.create({
                        status: UserNotification.STATUS.UNREAD,      //通知状态
                        category: UserNotification.CATEGORY.SYSTEM,      //通知类别
                        type: UserNotification.TYPE.USER_ANSWER_BEEN_COMMEND,      //通知类型
                        push_title: message,      //通知标题
                        push_content: '',      //通知内容
                        push_content_id: userID,        //通知内容ID
                        push_client_id: toUserGetuiCID,     //客户端ID，详见个推文档
                        push_task_id: null,     //任务ID，详见个推文档
                        push_time: new Date(),   //推送时间
                        create_time: new Date(),    //创建时间
                        update_time: new Date(),    //更新时间
                        user_id: toUserID,    //用户ID
                    }, cb);
                },
            }, function (err) {
                callback(err, channel);
            });
        });

    });
};


//系统推送=======================================================================