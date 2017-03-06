/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

const collectionModel = require('../../../public/model/collection');

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
            collections.push({
                collection_id: collection._id,
                article_id: collection.article_id ? collection.article_id._id : null,
                article_title: collection.article_id ? collection.article_id.title : null,
                article_favour_count: collection.article_id ? collection.article_id.favour_count : null,
                article_comment_count: collection.article_id ? collection.article_id.comment_count : null,
                article_collect_count: collection.article_id ? collection.article_id.collect_count : null,
                article_browse_count: collection.article_id ? collection.article_id.browse_count : null,
            });
        });
       
       res.json({
           flag: '0000',
           msg: '',
           result: {
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
            collections.push({
                collection_id: collection._id,
                question_id: collection.question_id ? collection.question_id._id : null,
                question_title: collection.question_id ? collection.question_id.title : null,
                question_tags: collection.question_id ? collection.question_id.tags : null,
                answer_id: collection.answer_id ? collection.answer_id._id : null,
                answer_content: collection.answer_id ? collection.answer_id.content : null,
                answer_comment_count: collection.answer_id ? collection.answer_id.comment_count : null,
                answer_favour_count: collection.answer_id ? collection.answer_id.favour_count : null,
                answer_collect_count: collection.answer_id ? collection.answer_id.collect_count : null,
            });
        });

        res.json({
            flag: '0000',
            msg: '',
            result: {
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
                ok: success
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
                ok: success
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
                ok: success
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
                ok: success
            }
        });
    });
};

