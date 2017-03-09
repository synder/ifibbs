/**
 * @author synder on 2017/3/2
 * @copyright
 * @desc
 */

const async = require('async');
const ifibbs = require('../service/mongodb').ifibbs;

const User = ifibbs.model('User');
const Question = ifibbs.model('Question');
const Activity = ifibbs.model('Activity');
const Article = ifibbs.model('Article');
const QuestionAnswer = ifibbs.model('QuestionAnswer');
const Recommend = ifibbs.model('Recommend');


/**
 * @desc 获取用户推荐
 * */
exports.getUserRecommend = function (userID, pageSkip, pageSize, callback) {
    let condition = {};
    
    async.parallel({
        count: function(cb) { 
            Recommend.count(condition, cb);
        },
        recommends: function(cb) { 
            Recommend.find(condition)
                .populate({
                    path: 'user',
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
                    path: 'activity',
                    match: {
                        _id: {$exists : true},
                        status: Activity.STATUS.DISPLAY
                    }
                })
                .populate({
                    path: 'article',
                    match: {
                        _id: {$exists : true},
                        status: Article.STATUS.PUBLISHED
                    }
                })
                .sort('-order -create_time')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        },
    }, callback);
};