/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */
const url = require('url');
const hosts = global.config.hosts;

if(!(hosts && hosts.h5 && hosts.h5.pages && hosts.h5.pages.article)){
    throw new Error('please provide h5 host config');
}

//文章详情H5页面
const ARTICLE_H5_PAGE_NAME = hosts.h5.pages.article;

const collectionModel = require('../../../public/model/ifibbs/collection');

/**
 * @desc 用户收藏文章列表
 * */
exports.getUserArticleCollections = function(req, res, next){
    let pageSkip = req.query.page_skip;
    let pageSize = req.query.page_size;
    let userID = req.query.user_id;

    if(!userID){
        return next(new BadRequestError('user_id is need'));
    }
    
    collectionModel.getUserArticleCollectionList(userID, pageSkip, pageSize, function (err, results) {
        if(err){
            return next(err);
        }
        
        let count = results.count;
        let collections = [];

        results.collections.forEach(function (collection) {
            if(collection.subject_id && collection.article_id){

                let articleUrl = url.format({
                    protocol : hosts.h5.protocol,
                    hostname: hosts.h5.host,
                    port : hosts.h5.port,
                    pathname : ARTICLE_H5_PAGE_NAME,
                    query : {
                        article_id: collection.article_id._id.toString()
                    }
                });
                
                collections.push({
                    collection_id: collection._id,
                    subject_id: collection.subject_id._id,
                    subject_title: collection.subject_id.title,
                    subject_icon: collection.subject_id.icon,
                    article_id: collection.article_id._id,
                    article_url: articleUrl,
                    article_title: collection.article_id.title,
                    article_favour_count: collection.article_id.favour_count,
                    article_comment_count: collection.article_id.comment_count,
                    article_collect_count: collection.article_id.collect_count,
                    article_browse_count: collection.article_id.browse_count,
                });
            }
            
        });
       
       res.json({
           flag: '0000',
           msg: '',
           result: {
               ok: true,
               failed_message: null,
               success_message: null,
               count : count,
               list : collections
           }
       });
    });
};

/**
 * @desc 用户收藏回答列表
 * */
exports.getUserAnswerCollections = function(req, res, next){
    let pageSkip = req.query.page_skip;
    let pageSize = req.query.page_size;
    let userID = req.query.user_id;

    if(!userID){
        return next(new BadRequestError('user_id is need'));
    }

    collectionModel.getUserAnswerCollectionList(userID, pageSkip, pageSize, function (err, results) {
        if(err){
            return next(err);
        }

        let count = results.count;
        let collections = [];

        results.collections.forEach(function (collection) {
            
            if(collection.question_id && collection.user_id && collection.answer_id){
                collections.push({
                    collection_id: collection._id,
                    question_id: collection.question_id._id,
                    question_title: collection.question_id.title,
                    question_tags: collection.question_id.tags,
                    answer_user_id: collection.user_id._id,
                    answer_user_name: collection.user_id.user_name,
                    answer_user_avatar: collection.user_id.user_avatar,
                    answer_id: collection.answer_id._id,
                    answer_content: collection.answer_id.content,
                    answer_comment_count: collection.answer_id.comment_count,
                    answer_favour_count: collection.answer_id.favour_count,
                    answer_collect_count: collection.answer_id.collect_count,
                });
            }
        });

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: true,
                failed_message: null,
                success_message: null,
                count : count,
                list : collections
            }
        });
    });
};

/**
 * @desc 用户收藏回答
 * */
exports.addAnswerToCollection = function(req, res, next){
    let questionID = req.body.question_id;
    let answerID = req.body.answer_id;
    let userID = req.session.id;

    if(!questionID){
        return next(new BadRequestError('question_id is needed'));
    }

    if(!answerID){
        return next(new BadRequestError('answer_id is needed'));
    }

    collectionModel.addAnswerToCollection(userID, questionID, answerID, function (err, success) {
        if(err){
            return next(err);
        }
        
        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: !!success,
                failed_message: !!success ? null : '收藏失败',
                success_message: null,
            }
        });
    });
};

/**
 * @desc 用户取消收藏回答
 * */
exports.removeAnswerFromCollection = function(req, res, next){
    let answerID = req.query.answer_id;
    let userID = req.session.id;

    if(!answerID){
        return next(new BadRequestError('answer_id is needed'));
    }

    collectionModel.removeAnswerFromCollection(userID, answerID, function (err, success) {
        if(err){
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: !!success,
                failed_message: !!success ? null : '取消收藏失败',
                success_message: null,
            }
        });
    });
};

/**
 * @desc 用户收藏回答
 * */
exports.addArticleToCollection = function(req, res, next){
    let articleID = req.body.article_id;
    let subjectID = req.body.subject_id; //可为空
    let userID = req.session.id;

    if(!articleID){
        return next(new BadRequestError('article_id is needed'));
    }

    collectionModel.addArticleToCollection(userID, subjectID, articleID, function (err, success) {
        if(err){
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: !!success,
                failed_message: !!success ? null : '收藏失败',
                success_message: null,
            }
        });
    });
};

/**
 * @desc 用户取消收藏回答
 * */
exports.removeArticleFromCollection = function(req, res, next){
    let articleID = req.query.article_id;
    let userID = req.session.id;

    if(!articleID){
        return next(new BadRequestError('article_id is needed'));
    }

    collectionModel.removeArticleFromCollection(userID, articleID, function (err, success) {
        if(err){
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: !!success,
                failed_message: !!success ? null : '取消收藏失败',
                success_message: null,
            }
        });
    });
};

