/**
 * @author synder on 2017/3/2
 * @copyright
 * @desc
 */

const async = require('async');
const ifibbsMongodb = require('../../service/mongodb/ifibbs').client;

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


/**
 * @desc 保存文章推荐
 * */
exports.createArticleRecommend = function (userID, articleID, order, callback) {
    
    if(!articleID){
        return callback();
    }
    
    let condition = {
        article : {$exists: true, $eq: articleID}
    };

    order = order || 10;
    
    let doc = {
        status      : Recommend.STATUS.NORMAL,   //状态
        order       : order,   //排序方式
        type        : Recommend.TYPE.ARTICLE,   //推荐类型
        user        : userID,
        question    : null,          //推荐问题
        answer      : null,    //推荐回答
        activity    : null,          //推荐活动
        article     : articleID,           //推荐文章
        create_time : new Date(),     //排序方式
        update_time : new Date(),     //排序方式
    };
    
    Recommend.update(condition, doc, {upsert: true},  callback);
};

/**
 * @desc 保存回答推荐
 * */
exports.createAnswerRecommend = function (userID, questionID, answerID, order, callback) {

    if(!questionID){
        return callback();
    }

    if(!answerID){
        return callback();
    }

    order = order || 10;

    let condition = {
        answer : {$exists: true, $eq: answerID}
    };

    let doc = {
        status      : Recommend.STATUS.NORMAL,   //状态
        order       : order,   //排序方式
        type        : Recommend.TYPE.ANSWER,   //推荐类型
        user        : userID,
        question    : questionID,          //推荐问题
        answer      : answerID,    //推荐回答
        activity    : null,          //推荐活动
        article     : null,           //推荐文章
        create_time : new Date(),     //排序方式
        update_time : new Date(),     //排序方式
    };

    Recommend.update(condition, doc, {upsert: true},  callback);
};

/**
 * @desc 保存专题推荐
 * */
exports.createSubjectRecommend = function (userID, subjectID, order, callback) {

    if(!subjectID){
        return callback();
    }

    order = order || 10;

    let condition = {
        subject : {$exists: true, $eq: subjectID}
    };

    let doc = {
        status      : Recommend.STATUS.NORMAL,   //状态
        order       : order,   //排序方式
        type        : Recommend.TYPE.SUBJECT,   //推荐类型
        user        : userID,
        question    : null,          //推荐问题
        answer      : null,    //推荐回答
        activity    : null,          //推荐活动
        article     : null,           //推荐文章
        subject     : subjectID,           //推荐文章
        create_time : new Date(),     //排序方式
        update_time : new Date(),     //排序方式
    };

    Recommend.update(condition, doc, {upsert: true},  callback);
};

/**
 * @desc 保存活动推荐
 * */
exports.createActivityRecommend = function (userID, activityID, order, callback) {

    if(!activityID){
        return callback();
    }

    order = order || 10;

    let condition = {
        activity : {$exists: true, $eq: activityID}
    };

    let doc = {
        status      : Recommend.STATUS.NORMAL,   //状态
        order       : order,   //排序方式
        type        : Recommend.TYPE.ACTIVITY,   //推荐类型
        user        : userID,
        question    : null,          //推荐问题
        answer      : null,          //推荐回答
        activity    : activityID,    //推荐活动
        article     : null,           //推荐文章
        subject     : null,           //推荐文章
        create_time : new Date(),     //排序方式
        update_time : new Date(),     //排序方式
    };

    Recommend.update(condition, doc, {upsert: true},  callback);
};