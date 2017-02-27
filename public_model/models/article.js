/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */


const async = require('async');
const mongodb = require('../public_service/mongodb').db;
const elasticsearch = require('../public_service/elasticsearch').client;

const Article = mongodb.model('Article');


/**
 * @desc 获取文章列表
 * */
exports.getRecommendArticleList = function (pageSkip, pageSize, callback) {

    let conditoin = {
        status: Article.STATUS.PUBLISHED
    };

    async.parallel({
        count: function (cb) {
            Article.count(conditoin, cb);
        },

        articles: function (cb) {
            Article.find(conditoin)
                .sort('top browse_count comment_count collect_count favour_count create_time')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback);
};


/**
 * @desc 获取文章列表
 * */
exports.getSubjectArticleList = function (subjectID, pageSkip, pageSize, callback) {

    let conditoin = {
        status: Article.STATUS.PUBLISHED,
        subject_id: subjectID
    };

    async.parallel({
        count: function (cb) {
            Article.count(conditoin, cb);
        },

        articles: function (cb) {
            Article.find(conditoin)
                .sort('top browse_count comment_count collect_count favour_count create_time')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback);
};



/**
 * @desc 获取文章详情
 * */
exports.getArticleDetail = function (articleID, callback) {
    
    let condition = {
        _id: articleID,
        status: Article.STATUS.PUBLISHED
    };
    
    Article.findOne(condition, callback);
};


/**
 * @desc 获取文章评论列表
 * */
exports.getArticleCommentsList = function (articleID, pageSkip, pageSize, callback) {
    
};