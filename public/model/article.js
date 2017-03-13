/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */


const async = require('async');
const ifibbs = require('../service/mongodb').ifibbs;
const elasticsearch = require('../service/elasticsearch').client;

const Article = ifibbs.model('Article');
const ArticleComment = ifibbs.model('ArticleComment');
const Subject = ifibbs.model('Subject');
const User = ifibbs.model('User');

/**
 * @desc 创建新的文章
 * */
exports.createOrUpdateNewArticle = function (createUserID, subjectID, article, callback) {
    
    let articleID = article.id;
    
    let condition = {
        _id: articleID
    };
    
    let update = {
        status          : Article.STATUS.PUBLISHED,    //文章状态
        top             : article.top || false,    //是否置顶
        title           : article.title,    //文章标题
        summary         : article.summary,    //文章摘要
        icon            : article.icon,    //文章图标
        cover           : article.cover,    //封面图片
        tags            : article.tags,    //文章标签
        content         : article.content,    //文章内容
        browse_count    : 0,    //浏览次数
        favour_count    : 0,    //被赞次数
        comment_count   : 0,    //被评论次数
        collect_count   : 0,    //被收藏次数
        create_time     : new Date(),    //创建时间
        update_time     : new Date(),    //更新时间
        subject_id      : subjectID,  //文章所属主题
        create_user_id  : createUserID      //创建人
    };
    
    let options = {
        new: true,
        upsert: true
    };
    
    Article.findOneAndUpdate(condition, update, options, function (err, article) {
        if(err){
            return callback(err);
        }
        
        if(!article){
            return callback(null, null);
        }
        
        if(!subjectID){
            return callback(null, article);
        }

        //更新专题文章数
        Subject.update({_id: subjectID}, {$inc: {article_count: 1}}, function (err) {
            callback(err, article);
        });
    });
    
};


/**
 * @desc 创建新的文章评论
 * */
exports.createNewComment = function (userID, articleID, comment, callback) {

    let commentDoc = {
        status          : ArticleComment.STATUS.ENABLE,    //文章状态
        content         : comment,       //评论内容
        favour_count    : 0,             //评论点赞数
        create_time     : new Date(),    //创建时间
        update_time     : new Date(),    //更新时间
        article_id      : articleID,  //文章ID
        create_user_id  : userID      //创建人
    };
    
    ArticleComment.create(commentDoc, function (err, comment) {
        
        if(err){
            return callback(err);
        }
        
        //更新评论数
        
        let condition = {
            _id: articleID
        };
        
        let update = {$inc: {comment_count: 1}};
        
        Article.update(condition, update, function (err) {
            callback(err, comment);
        });
        
    });
};


/**
 * @desc 删除文章
 * */
exports.removeArticle = function (articleID, callback) {

    let condition = {
        _id: articleID,
        status: {$ne: Article.STATUS.DELETED}
    };

    let update = {
        status          : Article.STATUS.DELETED,    //文章状态
        update_time     : new Date(),    //更新时间
    };

    Article.findOneAndUpdate(condition, update, function (err, article) {
        if(err){
            return callback(err);
        }

        if(!article){
            return callback(null, false);
        }
        
        if(!article.subject_id){
            return callback(null, false);
        }

        //更新专题文章数
        let subjectCondition = {_id: article.subject_id, article_count:{$gte: 1}};
        Subject.update(subjectCondition, {$inc: {article_count: -1}}, function (err) {
            callback(err, true);
        });
    });
};


/**
 * @desc 获取文章列表
 * */
exports.getRecommendArticleList = function (pageSkip, pageSize, callback) {

    let condition = {
        status: Article.STATUS.PUBLISHED
    };

    async.parallel({
        count: function (cb) {
            Article.count(condition, cb);
        },

        articles: function (cb) {
            Article.find(condition)
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

    let condition = {
        status: Article.STATUS.PUBLISHED,
        subject_id: subjectID
    };

    async.parallel({
        count: function (cb) {
            Article.count(condition, cb);
        },

        articles: function (cb) {
            Article.find(condition)
                .sort('top browse_count create_time')
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
    let condition = {
        article_id: articleID,
        status: ArticleComment.STATUS.ENABLE
    };
    
    async.parallel({
        count: function(cb) { 
            ArticleComment.count(condition, cb);
        },
        comments: function(cb) { 
            ArticleComment.find(condition)
                .populate({
                    path: 'create_user_id',
                    match: {
                        _id: {$exists : true},
                        status: User.STATUS.NORMAL
                    }
                })
                .sort('-create_time -_id')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        },
    }, callback);
};

/**
 * @desc 获取文章最热评论列表
 * */
exports.getArticleHottestCommentsList = function (articleID, count, callback) {
    let condition = {
        article_id: articleID,
        status: ArticleComment.STATUS.ENABLE
    };

    ArticleComment.find(condition)
        .populate({
            path: 'create_user_id',
            match: {
                _id: {$exists : true},
                status: User.STATUS.NORMAL
            }
        })
        .sort('-favour_count -create_time')
        .limit(count)
        .exec(callback);
};

/**
 * @desc 获取文章最新评论列表
 * */
exports.getArticleLatestCommentsList = function (articleID, count, callback) {
    let condition = {
        article_id: articleID,
        status: ArticleComment.STATUS.ENABLE
    };

    ArticleComment.find(condition)
        .populate({
            path: 'create_user_id',
            match: {
                _id: {$exists : true},
                status: User.STATUS.NORMAL
            }
        })
        .sort('-create_time -_id')
        .limit(count)
        .exec(callback);
};