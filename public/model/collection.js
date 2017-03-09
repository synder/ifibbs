/**
 * @author synder on 2017/2/19
 * @copyright
 * @desc
 */

const async = require('async');
const ifibbs = require('../service/mongodb').ifibbs;
const elasticsearch = require('../service/elasticsearch').client;

const UserAnswerCollection = ifibbs.model('UserAnswerCollection');
const UserArticleCollection = ifibbs.model('UserArticleCollection');
const QuestionAnswer = ifibbs.model('QuestionAnswer');
const Article = ifibbs.model('Article');
const Subject = ifibbs.model('Subject');
const User = ifibbs.model('User');
const UserDynamic = ifibbs.model('UserDynamic');

/**
 * @desc 获取用户收藏的回答列表
 * */
exports.getUserArticleCollectionList = function (userID, pageSkip, pageSize, callback) {
    
    let condition = {
        status: UserArticleCollection.STATUS.COLLECTED,
        user_id: userID,
    };
    
    async.parallel({
        count: function (cb) {
            UserArticleCollection.count(condition, cb);
        },

        collections: function (cb) {
            UserArticleCollection.find(condition)
                .populate({
                    path: 'article_id',
                    match: {
                        _id: {$exists : true},
                        status: Article.STATUS.PUBLISHED
                    }
                })
                .populate({
                    path: 'subject_id',
                    match: {
                        _id: {$exists : true},
                        status: Subject.STATUS.ENABLE
                    }
                })
                .sort('create_time _id')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback);
    
    
};


/**
 * @desc 获取用户收藏的回答列表
 * */
exports.getUserAnswerCollectionList = function (userID, pageSkip, pageSize, callback) {

    let condition = {
        status: UserAnswerCollection.STATUS.COLLECTED,
        user_id: userID,
    };

    async.parallel({
        count: function (cb) {
            UserAnswerCollection.count(condition, cb);
        },

        collections: function (cb) {
            UserAnswerCollection.find(condition)
                .populate({
                    path: 'answer_id',
                    match: {
                        _id: {$exists : true},
                        status: QuestionAnswer.STATUS.NORMAL
                    }
                })
                .populate({
                    path: 'question_id',
                    match: {
                        _id: {$exists : true},
                        status: QuestionAnswer.STATUS.NORMAL
                    }
                })
                .populate({
                    path: 'user_id',
                    match: {
                        _id: {$exists : true},
                        status: User.STATUS.NORMAL
                    }
                })
                .sort('create_time _id')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback);


};

/**
 * @desc 查询获取用户收藏的回答(根据用户ID和关注ID)
 * */
exports.findUserCollectionAnswerByCollectionID = function (userID, collectionID, callback) {
    
    let condition = {
        status: UserAnswerCollection.STATUS.COLLECTED,
        user_id: userID,
        target_id: collectionID,
    };
    
    UserAnswerCollection.findOne(condition)
        .populate({
            path: 'target_id',
            match: {
                _id: {$exists : true},
                status: QuestionAnswer.STATUS.NORMAL
            }
        })
        .exec(callback);
};


/**
 * @desc 查询获取用户收藏的文章(根据用户ID和关注ID)
 * */
exports.findUserCollectionArticleByCollectionID = function (userID, collectionID, callback) {
    let condition = {
        status: UserArticleCollection.STATUS.COLLECTED,
        user_id: userID,
        target_id: collectionID,
    };
    
    UserArticleCollection.findOne(condition)
        .populate({
            path: 'target_id',
            match: {
                _id: {$exists : true},
                status: Article.STATUS.PUBLISHED
            }
        })
        .exec(callback);
};


/**
 * @desc 创建对问题回答的收藏
 * */
exports.addAnswerToCollection = function (userID, questionID, answerID, callback) {

    let condition = {
        user_id: userID,
        answer_id: answerID,
    };

    let update = {
        status: UserAnswerCollection.STATUS.COLLECTED,
        user_id: userID,
        answer_id: answerID,
        question_id: questionID,
        create_time: new Date(),
        update_time: new Date(),
    };

    UserAnswerCollection.update(condition, update, {upsert: true}, function (err, result) {
        if(err){
            return callback(err);
        }

        if(result.upserted == null && result.nModified){
            return callback(null, false);
        }
        
        async.parallel({
            updateQuestionCollectCount: function(cb) {
                //更新收藏数
                QuestionAnswer.update({_id: answerID}, {$inc: {collect_count: 1}}, cb);
            },
            insertUserDynamic: function(cb) {
                //插入用户动态
                UserDynamic.create({
                    status: UserDynamic.STATUS.ENABLE,
                    type: UserDynamic.TYPES.COLLECT_ANSWER,
                    user_id: userID,
                    answer: answerID,
                    create_time: new Date(),
                    update_time: new Date(),
                }, cb);
            },
        }, function (err, results) {
            callback(err, true);
        });
    });
};


/**
 * @desc 取消对问题回答收藏
 * */
exports.removeAnswerFromCollection = function (userID, answerID, callback) {

    let condition = {
        status: UserAnswerCollection.STATUS.COLLECTED,
        user_id: userID,
        answer_id: answerID,
    };

    let update = {
        $set:{
            status: UserAnswerCollection.STATUS.UNCOLLECTED,
            update_time: new Date(),
        }
    };

    UserAnswerCollection.update(condition, update, function (err, result) {
        if(err){
            return callback(err);
        }

        if(result.nModified === 0){
            return callback(null, false);
        }

        //更新收藏数
        let answerCondition = {_id: answerID, collect_count: {$gte: 1}};
        QuestionAnswer.update(answerCondition, {$inc: {collect_count: -1}}, function (err) {
            callback(err, true);
        });
        
    });
};

/**
 * @desc 创建对文章的收藏
 * */
exports.addArticleToCollection = function (userID, subjectID, articleID, callback) {

    let condition = {
        user_id: userID,
        article_id: articleID,
    };

    let update = {
        status: UserArticleCollection.STATUS.COLLECTED,
        user_id: userID,
        article_id: articleID,
        subject_id: subjectID,
        create_time: new Date(),
        update_time: new Date(),
    };

    UserArticleCollection.update(condition, update, {upsert: true}, function (err, result) {
        if(err){
            return callback(err);
        }

        if(result.upserted == null && result.nModified){
            return callback(null, false);
        }

        async.parallel({
            updateQuestionCollectCount: function(cb) {
                //更新收藏数
                Article.update({_id: articleID}, {$inc: {collect_count: 1}}, cb);
            },
            insertUserDynamic: function(cb) {
                //插入用户动态
                UserDynamic.create({
                    status: UserDynamic.STATUS.ENABLE,
                    type: UserDynamic.TYPES.COLLECT_ARTICLE,
                    user_id: userID,
                    article: articleID,
                    create_time: new Date(),
                    update_time: new Date(),
                }, cb);
            },
        }, function (err, results) {
            callback(err, true);
        });
       
    });
};


/**
 * @desc 取消对文章收藏
 * */
exports.removeArticleFromCollection = function (userID, articleID, callback) {

    let condition = {
        status: UserArticleCollection.STATUS.COLLECTED,
        user_id: userID,
        article_id: articleID,
    };

    let update = {
        $set: {
            status: UserArticleCollection.STATUS.UNCOLLECTED,
            update_time: new Date(),
        }
    };


    UserArticleCollection.update(condition, update, function (err, result) {
        if(err){
            return callback(err);
        }

        if(result.nModified === 0){
            return callback(null, false);
        }

        //更新收藏数
        let articleCondition = {
            _id: articleID,
            collect_count: {$gte: 1}
        };
        Article.update(articleCondition, {$inc: {collect_count: -1}}, function (err) {
            callback(err, true);
        });
    });
};