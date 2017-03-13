/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */

const async = require('async');
const ifibbsMongodb = require('../service/mongodb').ifibbs;

const User = ifibbsMongodb.model('User');
const Question = ifibbsMongodb.model('Question');
const Article = ifibbsMongodb.model('Article');
const UserHistory = ifibbsMongodb.model('UserHistory');

/**
 * @desc 获取用户浏览历史记录
 * */
exports.getUserBrowseHistoryList = function (userID, pageSkip, pageSize, callback) {
    let condition = {
        user_id: userID,
        type: UserHistory.TYPE.QUESTION
    };

    async.parallel({
        count: function (cb) {
            UserHistory.count(condition, cb);
        },
        histories: function (cb) {
            UserHistory.find(condition)
                .populate({
                    path: 'user_id',
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
                .populate({
                    path: 'article_id',
                    match: {
                        _id: {$exists : true},
                        status: Article.STATUS.PUBLISHED
                    }
                })
                .sort('-create_time -_id')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback);
};


/**
 * @desc 创建浏览问题历史
 * */
exports.createBrowseQuestionHistory = function (userID, questionID, callback) {

    if (!userID) {
        return callback(null, null);
    }

    let doc = {
        status: UserHistory.STATUS.NORMAL,    //历史状态
        type: UserHistory.TYPE.QUESTION,    //历史类型
        create_time: new Date(),    //创建时间
        update_time: new Date(),    //更新时间
        user_id: userID,         //浏览用户ID
        question_id: questionID,  //浏览问题ID
        article_id: null,    //浏览文章ID
    };

    UserHistory.create(doc, callback);
};

/**
 * @desc 创建浏览文章历史
 * */
exports.createBrowseArticleHistory = function (userID, articleID, callback) {
    if (!userID) {
        return callback(null, null);
    }

    let doc = {
        status: UserHistory.STATUS.NORMAL,    //历史状态
        type: UserHistory.TYPE.ARTICLE,    //历史类型
        create_time: new Date(),    //创建时间
        update_time: new Date(),    //更新时间
        user_id: userID,         //浏览用户ID
        question_id: null,  //浏览问题ID
        article_id: articleID,    //浏览文章ID
    };

    UserHistory.create(doc, callback);
};