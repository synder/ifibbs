/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */
const async = require('async');
const mongodb = require('../service/mongodb').db;

const Question = mongodb.model('Question');
const AttentionQuestion = mongodb.model('AttentionQuestion');
const AttentionSubject = mongodb.model('AttentionSubject');
const AttentionUser = mongodb.model('AttentionUser');

/**
 * @desc 获取用户关注的问题列表
 * */
exports.getUserAttentionQuestionList = function (userID, pageSkip, pageSize, callback) {
    let conditoin = {
        user_id: userID,
        status: AttentionQuestion.STATUS.ATTENTION,
        question_id : { $exists: true }
    };

    async.parallel({
        count: function (cb) {
            AttentionQuestion.count(conditoin, cb);
        },

        questions: function (cb) {
            AttentionQuestion.find(conditoin)
                .populate('question_id question_user_id')
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
    let conditoin = {
        user_id: userID,
        to_user_id : { $exists: true}
    };

    async.parallel({
        count: function (cb) {
            AttentionUser.count(conditoin, cb);
        },

        users: function (cb) {
            AttentionUser.find(conditoin)
                .populate('to_user_id')
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
    let conditoin = {
        user_id: userID,
        subject_id : { $exists: true }
    };

    async.parallel({
        count: function (cb) {
            AttentionSubject.count(conditoin, cb);
        },

        subjects: function (cb) {
            AttentionSubject.find(conditoin)
                .populate('subject_id')
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
        status: AttentionUser.STATUS.ATTENTION,
        user_id: userID,
        to_user_id: otherUserID
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

        callback(null, result.ok === 1);
    });
};

/**
 * @desc 取消关注用户
 * */
exports.cancelAttentionToUser = function (userID, toUserID, callback) {
    let condition = {
        status: AttentionUser.STATUS.ATTENTION,
        user_id: userID,
        to_user_id: toUserID,
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

        callback(null, result.ok === 1);
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
            status: AttentionQuestion.STATUS.NO_ATTENTION,
        };

        let update = {
            status: AttentionQuestion.STATUS.ATTENTION,
            user_id: userID,
            question_id: toQuestionID,
            question_user_id: question.create_user_id,
            create_time: new Date(),
            update_time: new Date(),
        };
        

        AttentionQuestion.update(condition, update, {upsert: true}, function (err, result) {
            if(err){
                return callback(err);
            }
            
            if(result.upserted == null && result.nModified){
                return callback(null, false);
            }
            
            //更新问题关注数
            Question.update({_id: toQuestionID}, {$inc: {attention_count: 1}}, function (err) {
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
        status: AttentionQuestion.STATUS.ATTENTION,
        user_id: userID,
        question_id: toQuestionID,
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
        Question.update({_id: toQuestionID}, {$inc: {attention_count: -1}}, function (err) {
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

    AttentionSubject.update(condition, update, {upsert: true}, function (err, result) {
        if(err){
            return callback(err);
        }

        callback(null, result.ok === 1);
    });
};

/**
 * @desc 取消关注问题
 * */
exports.cancelAttentionToSubject = function (userID, toSubjectID, callback) {
    let condition = {
        status: AttentionSubject.STATUS.ATTENTION,
        user_id: userID,
        subject_id: toSubjectID,
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

        callback(null, result.ok === 1);
    });
};