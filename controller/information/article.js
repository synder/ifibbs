/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */
const async = require('async');

const articleModel = require('../../model/article');
const collectionModel = require('../../model/collection');
const favourModel = require('../../model/favour');
const historyModel = require('../../model/history');

/**
 * @desc 获取推荐文章列表
 * */
exports.getRecommendArticleList = function (req, res, next) {
    let pageSkip = req.query.page_skip;
    let pageSize = req.query.page_size;
    
    articleModel.getRecommendArticleList(pageSkip, pageSize, function (err, results) {
        
        let count = results.count;
        let articles = results.articles;

        articles = articles.map(function (article) {
            return {
                id : article._id,
                title : article.title,
                summary : article.summary,
                icon : article.icon,
                cover : article.cover,
            };
        });

        res.json({
            flag: '0000',
            msg: '',
            result: {
                count: count,
                list: articles
            }
        });
    });
};

/**
 * @desc 获取专题文章列表
 * */
exports.getSubjectArticleList = function (req, res, next) {
    let subjectID = req.query.subject_id;
    let pageSkip = req.query.page_skip;
    let pageSize = req.query.page_size;

    if(!subjectID){
        return next(new BadRequestError('subject_id is needed'));
    }

    articleModel.getSubjectArticleList(subjectID, pageSkip, pageSize, function (err, results) {
        if(err){
            return next(err);
        }
        
        let count = results.count;
        let articles = results.articles;

        articles = articles.map(function (article) {
            return {
                id : article._id,
                title : article.title,
                summary : article.summary,
                icon : article.icon,
                cover : article.cover,
            };
        });
        
        res.json({
            flag: '0000',
            msg: '',
            result: {
                count: count,
                list: articles
            }
        });
    });
};

/**
 * @desc 获取文章详情
 * */
exports.getSubjectArticleDetail = function (req, res, next) {
    let articleID = req.query.article_id;
    let userID = req.session.id;

    if(!articleID){
        return next(new BadRequestError('subject_id is needed'));
    }
    
    articleModel.getArticleDetail(articleID, function (err, article) {
        if(err){
            return next(err);
        }
        
        if(!article){
            return res.json({
                flag: '0000',
                msg: '',
                result: null,
            });
        }
        
        let result = {
            id : article._id,
            title : article.title,
            icon : article.icon,
            cover : article.cover,
            summary : article.summary,
            content : article.content,
            is_favour: false,
            is_collect: false,
        };
        
        if(!userID){
            return res.json({
                flag: '0000',
                msg: '',
                result: result,
            });
        }

        async.parallel({
            createHistory: function(cb){
                historyModel.createBrowseArticleHistory(userID, articleID, cb);
            },
            
            hasFavour: function (cb) {
                favourModel.findUserFavourArticleByFavourID(userID, articleID, cb);
            },
            
            hasCollect: function (cb) {
                collectionModel.findUserCollectionArticleByCollectionID(userID, articleID, cb);
            }
            
        }, function (err, results) {
            if(err){
                return next(err);
            }
            
            result.is_favour = !!results.hasFavour;
            result.is_collect = !!results.hasCollect;

            res.json({
                flag: '0000',
                msg: '',
                result: result,
            });
        });
        
    });
    
};


/**
 * @desc 获取文章的评论列表
 * */
exports.getArticleCommentList = function (req, res, next) {
    
};