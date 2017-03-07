/**
 * @author synder on 2017/3/4
 * @copyright
 * @desc
 */

const async = require('async');
const mongodb = require('../service/mongodb').db;

const UserDynamic = mongodb.model('UserDynamic');
const User = mongodb.model('User');
const Question = mongodb.model('Question');
const QuestionAnswer = mongodb.model('QuestionAnswer');
const AnswerComment = mongodb.model('AnswerComment');
const Subject = mongodb.model('Subject');
const Article = mongodb.model('Article');


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
                    path: 'user',
                    match: {
                        _id: {$exists : true},
                        status: User.STATUS.NORMAL
                    }
                })
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
                    path: 'comment',
                    match: {
                        _id: {$exists : true},
                        status: AnswerComment.STATUS.NORMAL
                    }
                })
                .populate({
                    path: 'subject',
                    match: {
                        _id: {$exists : true},
                        status: Subject.STATUS.ENABLE
                    }
                })
                .populate({
                    path: 'article',
                    match: {
                        _id: {$exists : true},
                        status: Article.STATUS.PUBLISHED
                    }
                })
                .sort('-create_time -_id')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        },
    }, callback);
};