/**
 * @author synder on 2017/3/2
 * @copyright
 * @desc
 */

const async = require('async');
const ifibbsMongodb = require('../service/mongodb').ifibbs;

const User = ifibbsMongodb.model('User');
const Question = ifibbsMongodb.model('Question');
const Activity = ifibbsMongodb.model('Activity');
const Article = ifibbsMongodb.model('Article');
const QuestionAnswer = ifibbsMongodb.model('QuestionAnswer');
const Recommend = ifibbsMongodb.model('Recommend');


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