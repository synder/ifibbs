/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */
const async = require('async');
const url = require('url');

const hosts = global.config.hosts;

if(!(hosts && hosts.h5)){
    throw new Error('please provide h5 host config');
}

//文章详情H5页面
const ARTICLE_H5_PAGE_NAME = 'article.html';

const articleModel = require('../../../public/model/article');
const collectionModel = require('../../../public/model/collection');
const favourModel = require('../../../public/model/favour');
const historyModel = require('../../../public/model/history');

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

            let articleUrl = url.format({
                protocol : hosts.h5.protocol,
                hostname: hosts.h5.host,
                port : hosts.h5.port,
                pathname : ARTICLE_H5_PAGE_NAME,
                query : {
                    article_id: article._id.toString()
                }
            });

            return {
                id : article._id,
                title : article.title,
                summary : article.summary,
                icon : article.icon,
                cover : article.cover,
                comment_count: article.comment_count,
                favour_count: article.favour_count,
                collect_count: article.collect_count,
                create_time: article.create_time,
                url: articleUrl,
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
            
            let articleUrl = url.format({
                protocol : hosts.h5.protocol,
                hostname: hosts.h5.host,
                port : hosts.h5.port,
                pathname : ARTICLE_H5_PAGE_NAME,
                query : {
                    article_id: article._id.toString()
                }
            });
            
            return {
                id : article._id,
                title : article.title,
                summary : article.summary,
                icon : article.icon,
                cover : article.cover,
                comment_count: article.comment_count,
                favour_count: article.favour_count,
                collect_count: article.collect_count,
                create_time: article.create_time,
                url: articleUrl,
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
            content : decodeURIComponent(article.content),
            is_favour: false,
            is_collect: false,
            create_time: article.create_time
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

    let pageSkip = req.query.page_skip;
    let pageSize = req.query.page_size;
    
    let articleID = req.query.article_id;
    
    
    articleModel.getArticleCommentsList(articleID, pageSkip, pageSize, function (err, results) {
        if(err){
            return next(err);
        }
        
        let count = results.count;
        let comments = [];
        
        results.comments.forEach(function (comment) {
            if(comment.create_user_id){
                comments.push({
                    article_id: articleID,
                    comment_id: comment._id,
                    comment_content: comment.content,
                    comment_time: comment.create_time,
                    create_user_id: comment.create_user_id._id,
                    create_user_name: comment.create_user_id.user_name,
                    create_user_avatar: comment.create_user_id.user_avatar,
                });
            }
        });
        
        res.json({
            flag: '0000',
            msg: '',
            result: {
                count: count,
                list: comments
            }
        });
    });
};