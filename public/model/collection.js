/**
 * @author synder on 2017/2/19
 * @copyright
 * @desc
 */

const async = require('async');
const mongodb = require('../service/mongodb').db;
const elasticsearch = require('../service/elasticsearch').client;

const UserCollection = mongodb.model('UserAnswerCollection');
const UserArticleCollectionSchema = mongodb.model('UserArticleCollection');
const QuestionAnswer = mongodb.model('QuestionAnswer');
const Article = mongodb.model('Article');
const User = mongodb.model('User');

/**
 * @desc 获取用户收藏的回答列表
 * */
exports.getUserCollectionList = function (userID, pageSkip, pageSize, callback) {
    
    let condition = {
        status: UserCollection.STATUS.COLLECTED,
        user_id: userID,
    };
    
    async.parallel({
        count: function (cb) {
            UserCollection.count(condition, cb);
        },

        collections: function (cb) {
            UserCollection.find(condition)
                .populate({
                    path: 'article_id',
                    match: {
                        _id: {$exists : true},
                        status: Article.STATUS.PUBLISHED
                    }
                })
                .populate({
                    path: 'answer_id',
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
        status: UserCollection.STATUS.COLLECTED,
        user_id: userID,
        target_id: collectionID,
    };
    UserCollection.findOne(condition)
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
        status: UserCollection.STATUS.COLLECTED,
        user_id: userID,
        target_id: collectionID,
    };
    UserCollection.findOne(condition)
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
        status: UserCollection.STATUS.COLLECTED,
        type: UserCollection.TYPES.ANSWER,
        user_id: userID,
        answer_id: answerID,
        question_id: questionID,
        create_time: new Date(),
        update_time: new Date(),
    };

    UserCollection.update(condition, update, {upsert: true}, function (err, result) {
        if(err){
            return callback(err);
        }

        if(result.upserted == null && result.nModified){
            return callback(null, false);
        }

        //更新收藏数
        QuestionAnswer.update({_id: answerID}, {$inc: {collect_count: 1}}, function (err) {
            callback(err, true);
        });
    });
};


/**
 * @desc 取消对问题回答收藏
 * */
exports.removeAnswerFromCollection = function (userID, answerID, callback) {

    let condition = {
        status: UserCollection.STATUS.COLLECTED,
        user_id: userID,
        answer_id: answerID,
    };

    let update = {
        $set:{
            status: UserCollection.STATUS.UNCOLLECTED,
            update_time: new Date(),
        }
    };

    UserCollection.update(condition, update, function (err, result) {
        if(err){
            return callback(err);
        }

        if(result.nModified === 0){
            return callback(null, false);
        }

        //更新收藏数
        QuestionAnswer.update({_id: answerID}, {$inc: {collect_count: -1}}, function (err) {
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
        status: UserCollection.STATUS.COLLECTED,
        type: UserCollection.TYPES.ANSWER,
        user_id: userID,
        article_id: articleID,
        subject_id: subjectID,
        create_time: new Date(),
        update_time: new Date(),
    };

    UserCollection.update(condition, update, {upsert: true}, function (err, result) {
        if(err){
            return callback(err);
        }

        if(result.upserted == null && result.nModified){
            return callback(null, false);
        }

        //更新收藏数
        Article.update({_id: articleID}, {$inc: {collect_count: 1}}, function (err) {
            callback(err, true);
        });
    });
};


/**
 * @desc 取消对文章收藏
 * */
exports.removeArticleFromCollection = function (userID, articleID, callback) {

    let condition = {
        status: UserCollection.STATUS.COLLECTED,
        user_id: userID,
        article_id: articleID,
    };

    let update = {
        $set: {
            status: UserCollection.STATUS.UNCOLLECTED,
            update_time: new Date(),
        }
    };
    

    UserCollection.update(condition, update, function (err, result) {
        if(err){
            return callback(err);
        }

        if(result.nModified === 0){
            return callback(null, false);
        }

        //更新收藏数
        Article.update({_id: articleID}, {$inc: {collect_count: -1}}, function (err) {
            callback(err, true);
        });
    });
};