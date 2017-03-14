/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */
const async = require('async');
const ifibbsMongodb = require('../../service/mongodb/ifibbs').client;

const User = ifibbsMongodb.model('User');
const UserDynamic = ifibbsMongodb.model('UserDynamic');
const Subject = ifibbsMongodb.model('Subject');
const Question = ifibbsMongodb.model('Question');
const AttentionQuestion = ifibbsMongodb.model('AttentionQuestion');
const AttentionSubject = ifibbsMongodb.model('AttentionSubject');
const AttentionUser = ifibbsMongodb.model('AttentionUser');

/**
 * @desc 获取用户关注的问题列表
 * */
exports.getUserAttentionQuestionList = function (userID, pageSkip, pageSize, callback) {
    let condition = {
        user_id: userID,
        status: AttentionQuestion.STATUS.ATTENTION,
    };

    async.parallel({
        count: function (cb) {
            AttentionQuestion.count(condition, cb);
        },

        questions: function (cb) {
            AttentionQuestion.find(condition)
                .populate({
                    path: 'question_user_id',
                    match: {
                        _id: {$exists : true},
                        status: User.STATUS.NORMAL
                    }
                })
                .populate({
                    path: 'question_id',
                    match: {
                        _id: {$exists : true},
                        status: Question.STATUS.NORMAL
                    }
                })
                .sort('create_time _id')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback);
};


/**
 * @desc 获取用户关注用户列表
 * */
exports.getUserAttentionUserList = function (userID, pageSkip, pageSize, callback) {
    let condition = {
        user_id: userID,
        to_user_id : { $exists: true}
    };

    async.parallel({
        count: function (cb) {
            AttentionUser.count(condition, cb);
        },

        users: function (cb) {
            AttentionUser.find(condition)
                .populate({
                    path: 'to_user_id',
                    match: {
                        _id: {$exists : true},
                        status: User.STATUS.NORMAL
                    }
                })
                .sort('create_time _id')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback);
};


/**
 * @desc 获取用户关注专题列表
 * */
exports.getUserAttentionSubjectList = function (userID, pageSkip, pageSize, callback) {
    let condition = {
        user_id: userID,
        subject_id : { $exists: true }
    };

    async.parallel({
        count: function (cb) {
            AttentionSubject.count(condition, cb);
        },

        subjects: function (cb) {
            AttentionSubject.find(condition)
                .populate({
                    path: 'subject_id',
                    match: {
                        _id: {$exists : true},
                        status: Subject.STATUS.ENABLE
                    }
                })
                .sort('create_time _id')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback);
};



/**
 * @desc 查询获取用户关注的问题(根据用户ID和questionID)
 * */
exports.findUserAttentionByQuestionID = function (userID, questionID, callback) {
    let condition = {
        status: AttentionQuestion.STATUS.ATTENTION,
        user_id: userID,
        question_id: questionID
    };
    
    AttentionQuestion.findOne(condition, callback);
};


/**
 * @desc 查询获取用户关注的主题(根据用户ID和otherUserID)
 * */
exports.findUserAttentionBySubjectID = function (userID, subjectID, callback) {
    let condition = {
        status: AttentionSubject.STATUS.ATTENTION,
        user_id: userID,
        subject_id: subjectID
    };

    AttentionSubject.findOne(condition, callback);
};


/**
 * @desc 查询获取用户关注的用户(根据用户ID和otherUserID)
 * */
exports.findUserAttentionByUserID = function (userID, otherUserID, callback) {
    
    if(!otherUserID){
        return callback(null, null);
    }
    
    let condition = {
        user_id: userID,
        to_user_id: otherUserID,
        status: AttentionUser.STATUS.ATTENTION,
    };

    AttentionUser.findOne(condition, callback);
};


/**
 * @desc 添加关注用户
 * */
exports.addAttentionToUser = function (userID, toUserID, callback) {
    let condition = {
        user_id: userID,
        to_user_id: toUserID,
    };

    let update = {
        status: AttentionUser.STATUS.ATTENTION,
        user_id: userID,
        to_user_id: toUserID,
        create_time: new Date(),
        update_time: new Date(),
    };

    AttentionUser.update(condition, update, {upsert: true}, function (err, result) {
        if(err){
            return callback(err);
        }
        
        if(result.nModified === 0 && !result.upserted){
            return callback(null, false);
        }

        //插入用户动态
        UserDynamic.create({
            status: UserDynamic.STATUS.ENABLE,
            type: UserDynamic.TYPES.ATTENTION_USER,
            user_id: userID,
            user: toUserID,
            create_time: new Date(),
            update_time: new Date(),
        }, function (err) {
            callback(err, true);
        });
    });
};

/**
 * @desc 取消关注用户
 * */
exports.cancelAttentionToUser = function (userID, toUserID, callback) {
    let condition = {
        user_id: userID,
        to_user_id: toUserID,
        status: AttentionUser.STATUS.ATTENTION,
    };

    let update = {
        $set: {
            status: AttentionUser.STATUS.NO_ATTENTION,
            update_time: new Date(),
        }
    };

    AttentionUser.update(condition, update, function (err, result) {
        if(err){
            return callback(err);
        }
        
        callback(null, result.nModified === 1);
    });
};


/**
 * @desc 添加关注问题
 * */
exports.addAttentionToQuestion = function (userID, toQuestionID, callback) {
    
    Question.findOne({_id: toQuestionID}, function (err, question) {
        if(err){
            return callback(err);
        }
        
        if(!question){
            return callback(null, false);
        }

        let condition = {
            user_id: userID,
            question_id: toQuestionID,
        };

        let update = {
            status: AttentionQuestion.STATUS.ATTENTION,
            user_id: userID,
            question_id: toQuestionID,
            question_user_id: question.create_user_id,
            create_time: new Date(),
            update_time: new Date(),
        };
        
        let options = {
            upsert: true
        };
        

        AttentionQuestion.update(condition, update, options, function (err, result) {
            if(err){
                return callback(err);
            }
            
            if(!result.upserted && result.nModified === 0){
                return callback(null, true);
            }
            
            async.parallel({
                
                updateQuestionAttentionCount: function(cb) {
                    //更新问题关注数
                    Question.update({_id: toQuestionID}, {$inc: {attention_count: 1}}, cb);
                },
                
                insertUserDynamic: function(cb) {
                    UserDynamic.create({
                        status: UserDynamic.STATUS.ENABLE,
                        type: UserDynamic.TYPES.ATTENTION_QUESTION,
                        user_id: userID,
                        question: toQuestionID,
                        create_time: new Date(),
                        update_time: new Date(),
                    }, cb);
                },
            }, function (err, results) {
                callback(err, true);
            });
        });
    });
};

/**
 * @desc 取消关注问题
 * */
exports.cancelAttentionToQuestion = function (userID, toQuestionID, callback) {
    let condition = {
        user_id: userID,
        question_id: toQuestionID,
        status: AttentionQuestion.STATUS.ATTENTION,
    };

    let update = {
        $set: {
            status: AttentionQuestion.STATUS.NO_ATTENTION,
            update_time: new Date(),
        }
    };

    AttentionQuestion.update(condition, update, function (err, result) {
        if(err){
            return callback(err);
        }
        
        if(result.nModified === 0){
            return callback(null, false);
        }

        //更新问题关注数
        let questionCondition = {
            _id: toQuestionID, 
            attention_count: {$gte: 1}
        };
        Question.update(questionCondition, {$inc: {attention_count: -1}}, function (err) {
            callback(err, true);
        });
    });
};


/**
 * @desc 添加关注专题
 * */
exports.addAttentionToSubject = function (userID, toSubjectID, callback) {
    
    let condition = {
        user_id: userID,
        subject_id: toSubjectID,
    };

    let update = {
        status: AttentionSubject.STATUS.ATTENTION,
        user_id: userID,
        subject_id: toSubjectID,
        create_time: new Date(),
        update_time: new Date(),
    };
    
    let options = {
        upsert: true
    };

    AttentionSubject.update(condition, update, options, function (err, result) {
        if(err){
            return callback(err);
        }

        if(result.nModified === 0 && !result.upserted){
            return callback(null, false);
        }

        async.parallel({

            updateQuestionAttentionCount: function(cb) {
                //更新专题关注数
                Subject.update({_id: toSubjectID}, {$inc: {attention_count: 1}}, cb);
            },

            insertUserDynamic: function(cb) {
                //创建用户动态
                UserDynamic.create({
                    status: UserDynamic.STATUS.ENABLE,
                    type: UserDynamic.TYPES.ATTENTION_SUBJECT,
                    user_id: userID,
                    subject: toSubjectID,
                    create_time: new Date(),
                    update_time: new Date(),
                }, cb);
            },
        }, function (err, results) {
            callback(err, true);
        });
    });
};

/**
 * @desc 取消关注问题
 * */
exports.cancelAttentionToSubject = function (userID, toSubjectID, callback) {
    let condition = {
        user_id: userID,
        subject_id: toSubjectID,
        status: AttentionSubject.STATUS.ATTENTION,
    };

    let update = {
        $set: {
            status: AttentionSubject.STATUS.NO_ATTENTION,
            update_time: new Date(),
        }
    };

    AttentionSubject.update(condition, update, function (err, result) {
        if(err){
            return callback(err);
        }
        
        if(result.nModified === 0){
            return callback(null, false);
        }

        //更新专题关注数
        let subjectCondition = {
            _id: toSubjectID, 
            attention_count: {$gte: 1}
        };
        
        Subject.update(subjectCondition, {$inc: {attention_count: -1}}, function (err) {
            callback(err, true);
        });
    });
};