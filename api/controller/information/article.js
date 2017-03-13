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

const articleModel = require('../../../public/ifibbs/article');
const collectionModel = require('../../../public/ifibbs/collection');
const favourModel = require('../../../public/ifibbs/favour');
const historyModel = require('../../../public/ifibbs/history');

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
            content : article.content,
            create_time: article.create_time
        };

        res.json({
            flag: '0000',
            msg: '',
            result: result,
        });
        
        //创建浏览历史
        historyModel.createBrowseArticleHistory(userID, articleID, function (err) {
            if(err){
                logger.error(err);
            }
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


/**
 * @desc 获取文章最新和最热评论, 评论数，点赞数，是否收藏
 * */
exports.getArticleSocialInfo = function (req, res, next) {
    let articleID = req.query.article_id;
    let userID = req.session.id;
    
    
    async.parallel({
        //最热评论
        hottestComments: function(cb) { 
            articleModel.getArticleHottestCommentsList(articleID, 5, cb);
        },
        
        //最新评论
        latestComments: function(cb) { 
            articleModel.getArticleLatestCommentsList(articleID, 5, cb);
        },
        
        //获取文章信息
        articleInfo: function(cb) {
            articleModel.getArticleDetail(articleID, cb);
        },
        
        //是否收藏
        isCollected: function(cb) {
            collectionModel.findUserCollectionArticleByCollectionID(userID, articleID, cb)
        },

        //是否收藏
        isFavoured: function(cb) {
            favourModel.findUserFavourArticleByFavourID(userID, articleID, cb)
        },
    }, function (err, results) {
    
        if(err){
             return next(err);
        }
        
        let hottestComments = results.hottestComments;
        let latestComments = results.latestComments;
        let articleInfo = results.articleInfo;
        let isCollected = results.isCollected;
        let isFavoured = results.isFavoured;
        
        let result = {
            favour_count: articleInfo.favour_count,
            comment_count: articleInfo.comment_count,
            collect_count: articleInfo.collect_count,
            browse_count: articleInfo.browse_count,
            is_collected: !!isCollected,
            is_favoured: !!isFavoured,
            hottest_comment_list: [],
            latest_comment_list: []
        };

        hottestComments.forEach(function (comment) {
            if(comment.create_user_id){
                result.hottest_comment_list.push({
                    id: comment._id,
                    content: comment.comment,
                    favour_count: comment.favour_count,
                    user_name: comment.create_user_id.user_name,
                    user_avatar: comment.create_user_id.user_avatar,
                    create_time: comment.create_time,
                    article_id: articleID,
                });
            }
        });

        latestComments.forEach(function (comment) {
            if(comment.create_user_id){
                result.hottest_comment_list.push({
                    id: comment._id,
                    content: comment.comment,
                    favour_count: comment.favour_count,
                    user_name: comment.create_user_id.user_name,
                    user_avatar: comment.create_user_id.user_avatar,
                    create_time: comment.create_time,
                    article_id: articleID,
                });
            }
        });
        
        res.json({
            flag: '0000',
            msg: '',
            result: result
        });
    });
    
};