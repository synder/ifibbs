/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

const attentionModel = require('../../../public/model/attention');
const notificationModel = require('../../../public/model/notification');

/**
 * @desc 获取用户关注的问题列表
 * */
exports.getAttentionQuestionList = function (req, res, next) {
    
    let pageSkip = req.query.page_skip;
    let pageSize = req.query.page_size;
    let userID = req.query.user_id;

    if(!userID){
        return next(new BadRequestError('user_id is need'));
    }

    attentionModel.getUserAttentionQuestionList(userID, pageSkip, pageSize, function (err, results) {
        if(err){
            return next(err);
        }
        
        let count= results.count;
        let questions = [];

        results.questions.map(function (question) {
            if(question.question_user_id && question.question_id){
                questions.push({
                    user_id: question.question_user_id._id,
                    user_avatar: question.question_user_id.user_avatar,
                    user_name: question.question_user_id.user_name,
                    question_id: question.question_id._id,
                    question_title: question.question_id.title,
                    question_tags: question.question_id.tags,
                    question_attention_count: question.question_id.attention_count,
                    question_answer_count: question.question_id.answer_count,
                });
            }
        });
        
        res.json({
            flag: '0000',
            msg: '',
            result: {
                count: count,
                list: questions
            }
        });
    });   
};

/**
 * @desc 获取关注的用户列表
 * */
exports.getUserAttentionUserList = function (req, res, next) {

    let pageSkip = req.query.page_skip;
    let pageSize = req.query.page_size;
    let userID = req.query.user_id;

    if(!userID){
        return next(new BadRequestError('user_id is need'));
    }

    attentionModel.getUserAttentionUserList(userID, pageSkip, pageSize, function (err, results) {
        if(err){
            return next(err);
        }

        let count= results.count;
        let users = [];

        results.users.forEach(function (user) {
            if(user.to_user_id){
                users.push({
                    user_id: user.to_user_id._id,
                    user_avatar: user.to_user_id.user_avatar,
                    user_name: user.to_user_id.user_name,
                    user_profile: user.to_user_id.user_profile,
                });
            }
        });

        res.json({
            flag: '0000',
            msg: '',
            result: {
                count: count,
                list: users
            }
        });
    });
};

/**
 * @desc 获取关注的专题列表
 * */
exports.getUserAttentionSubjectList = function (req, res, next) {

    let pageSkip = req.query.page_skip;
    let pageSize = req.query.page_size;
    let userID = req.query.user_id;

    if(!userID){
        return next(new BadRequestError('user_id is need'));
    }

    attentionModel.getUserAttentionSubjectList(userID, pageSkip, pageSize, function (err, results) {
        if(err){
            return next(err);
        }

        let count= results.count;
        let subjects = [];
        
        results.subjects.map(function (subject) {
            if(subject.subject_id){
                subjects.push({
                    subject_id: subject.subject_id._id,
                    subject_icon: subject.subject_id.icon || '',
                    subject_title: subject.subject_id.title || '',
                    subject_describe: subject.subject_id.describe || '',
                    subject_article_count: subject.subject_id.article_count || 0,
                });
            }
        });

        res.json({
            flag: '0000',
            msg: '',
            result: {
                count: count,
                list: subjects
            }
        });
    });
};


/**
 * @desc 关注问题
 * */
exports.addQuestionToAttention = function (req, res, next) {
    let questionID = req.body.question_id;
    let userID = req.session.id;

    if(!questionID){
        return next(new BadRequestError('question_id is needed'));
    }

    attentionModel.addAttentionToQuestion(userID, questionID, function (err, success) {
        
        if(err){
            return next(err);
        }
        
        notificationModel.produceForQuestionBeenAttentionMQS(userID, questionID, function (err) {
            if(err){
                logger.error(err);
            } 
        });
        
        
        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: success
            }
        });
    });
};


/**
 * @desc 取消关注问题
 * */
exports.removeQuestionFromAttention = function (req, res, next) {
    let questionID = req.query.question_id;
    let userID = req.session.id;

    if(!questionID){
        return next(new BadRequestError('question_id is needed'));
    }
    
    attentionModel.cancelAttentionToQuestion(userID, questionID, function (err, success) {
        if(err){
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: success
            }
        });
    });
};




/**
 * @desc 关注专题
 * */
exports.addSubjectToAttention = function (req, res, next) {
    let subjectID = req.body.subject_id;
    let userID = req.session.id;

    if(!subjectID){
        return next(new BadRequestError('subject_id is needed'));
    }
    
    attentionModel.addAttentionToSubject(userID, subjectID, function (err, success) {
        if(err){
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: success
            }
        });
    });
};

/**
 * @desc 取消关注专题
 * */
exports.removeSubjectFromAttention = function (req, res, next) {
    let subjectID = req.query.subject_id;
    let userID = req.session.id;

    if(!subjectID){
        return next(new BadRequestError('subject_id is needed'));
    }

    attentionModel.cancelAttentionToSubject(userID, subjectID, function (err, success) {
        if(err){
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: success
            }
        });
    });
};




/**
 * @desc 关注用户
 * */
exports.addUserToAttention = function (req, res, next) {
    let toUserID = req.body.user_id;
    let userID = req.session.id;

    if(!toUserID){
        return next(new BadRequestError('user_id is needed'));
    }

    attentionModel.addAttentionToUser(userID, toUserID, function (err, success) {
        if(err){
            return next(err);
        }
        
        notificationModel.produceForUserBeenAttentionMQS(userID, toUserID, function (err) {
            if(err){
                logger.error(err);
            }
        }); 

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: success
            }
        });
    });
};

/**
 * @desc 取消关注用户
 * */
exports.removeUserFromAttention = function (req, res, next) {
    let toUserID = req.query.user_id;
    let userID = req.session.id;

    if(!toUserID){
        return next(new BadRequestError('user_id is needed'));
    }

    attentionModel.cancelAttentionToUser(userID, toUserID, function (err, success) {
        if(err){
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: success
            }
        });
    });
};