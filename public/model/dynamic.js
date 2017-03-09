/**
 * @author synder on 2017/3/4
 * @copyright
 * @desc
 */

const async = require('async');
const ifibbs = require('../service/mongodb').ifibbs;

const UserDynamic = ifibbs.model('UserDynamic');
const User = ifibbs.model('User');
const Question = ifibbs.model('Question');
const QuestionAnswer = ifibbs.model('QuestionAnswer');
const AnswerComment = ifibbs.model('AnswerComment');
const Subject = ifibbs.model('Subject');
const Article = ifibbs.model('Article');


/**
 * @desc 获取用户动态列表
 * */
exports.getUserDynamicList = function (userID, pageSkip, pageSize, callback) {
    
    let condition = {
        user_id: userID,
        status: UserDynamic.STATUS.ENABLE,
        type: {$in: [
            UserDynamic.TYPES.PUBLISH_QUESTION,
            UserDynamic.TYPES.ANSWER_QUESTION,
            UserDynamic.TYPES.ATTENTION_QUESTION,
            UserDynamic.TYPES.ATTENTION_SUBJECT,
            UserDynamic.TYPES.COLLECT_ANSWER,
        ]}
    };
    
    async.parallel({
        count: function(cb) { 
            UserDynamic.count(condition, cb);
        },
        dynamics: function(cb) {
            UserDynamic.find(condition)
                .populate({
                    path: 'user_id',
                    match: {
                        _id: {$exists : true},
                        status: User.STATUS.NORMAL
                    }
                })
                .populate({
                    path: 'question',
                    match: {
                        _id: {$exists : true},
                        status: Question.STATUS.NORMAL
                    }
                })
                .populate({
                    path: 'answer',
                    match: {
                        _id: {$exists : true},
                        status: QuestionAnswer.STATUS.NORMAL
                    }
                })
                .populate({
                    path: 'subject',
                    match: {
                        _id: {$exists : true},
                        status: Subject.STATUS.ENABLE
                    }
                })
                .sort('-create_time -_id')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        },
    }, callback);
};