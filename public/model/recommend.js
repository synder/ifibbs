/**
 * @author synder on 2017/3/2
 * @copyright
 * @desc
 */

const async = require('async');
const mongodb = require('../service/mongodb').db;

const Recommend = mongodb.model('Recommend');


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
                .populate(
                    'question.question_id ' +
                    'question.answer_id ' +
                    'question.answer_user_id ' +
                    'activity.activity_id ' +
                    'article.article_id'
                )
                .sort('-order -create_time')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        },
    }, callback);
};