/**
 * @author synder on 2017/3/4
 * @copyright
 * @desc
 */

const async = require('async');
const ifibbsMongodb = require('../service/mongodb/ifibbs').client;

const UserDynamic = ifibbsMongodb.model('UserDynamic');
const User = ifibbsMongodb.model('User');
const Question = ifibbsMongodb.model('Question');
const QuestionAnswer = ifibbsMongodb.model('QuestionAnswer');
const AnswerComment = ifibbsMongodb.model('AnswerComment');
const Subject = ifibbsMongodb.model('Subject');
const Article = ifibbsMongodb.model('Article');


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