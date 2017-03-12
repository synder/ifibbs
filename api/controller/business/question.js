/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

const async = require('async');

const questionModel = require('../../../public/model/question');
const attentionModel = require('../../../public/model/attention');
const tagsModel = require('../../../public/model/tags');
const historyModel = require('../../../public/model/history');


/**
 * @desc 获取问题详情
 * */
exports.getQuestionDetail = function(req, res, next){
    
    let questionID = req.query.question_id;
    let userID = req.session.id;

    if(!questionID){
        return next(new BadRequestError('question_id is needed'));
    }
    
    async.parallel({
        questionDetail: function(cb) {
            questionModel.getQuestionDetail(questionID, cb);
        },
        isAttented: function(cb) { 
            if(!userID){
                return cb(null, false);
            }

            attentionModel.findUserAttentionByQuestionID(userID, questionID, function (err, doc) {
                if(err){
                    return cb(err);
                }
                
                cb(null, !!doc);
            });
        },
        createHistory: function (cb) {
            historyModel.createBrowseQuestionHistory(userID, questionID, cb);
        }
    }, function (err, results) {
    
        if(err){
             return next(err);
        }
        
        let question = results.questionDetail;
        let isAttented = results.isAttented;
        
        if(!question){
            return res.json({
                flag: '0000',
                msg: '',
                result: null
            });
        }

        let result = {
            id: question._id,
            title: question.title,
            describe: question.describe,
            tags: question.tags,
            is_attented: isAttented, //是否已经关注
            answer_count: question.answer_count,
            favour_count: question.favour_count,
            attention_count: question.attention_count,
            collect_count: question.collect_count,
            create_user_id: question.create_user_id,
            create_time: question.create_time.valueOf(),
        };

        res.json({
            flag: '0000',
            msg: '',
            result: result
        });
    });
};

/**
 * @desc 主页搜索
 * */
exports.searchQuestionsByAnswer = function (req, res, next) {
    let pageSize = req.query.page_size;
    let pageSkip = req.query.page_skip;
    
    let content = req.query.content;

    if(!content){
        return res.json({
            flag: '0000',
            msg: '',
            result: {
                count: 0,
                list: []
            }
        });
    }

    questionModel.searchQuestionByAnswer(content, pageSkip, pageSize, function (err, results) {
        if(err){
            return next(err);
        }
        
        let questions = [];
        let count = results.count;

        results.questions.forEach(function (question) {
            questions.push({
                question_id: question.question_id,
                question_title: question.question_title,
                question_tags: question.question_tags || [],
                answer_id: question.answer_id,
                answer_content: question.answer_content,
                answer_comment_count: question.comment_count || 0,
                answer_favour_count: question.favour_count || 0,
                answer_collect_count: question.collect_count || 0,
            });
        });

        res.json({
            flag: '0000',
            msg: '',
            result: {
                count: count,
                list: questions
            }
        });
    });
};


/**
 * @desc 回答问题搜索
 * */
exports.searchQuestionsByAttr = function(req, res, next){
    let pageSize = req.query.page_size;
    let pageSkip = req.query.page_skip;
    let content = req.query.content;
    
    if(!content){
        return next(BadRequestError('content is need'));
    }

    questionModel.searchQuestionByAttribute(content, pageSkip, pageSize, function (err, results) {
        
        if(err){
            return next();
        }
        
        let count = results.count;
        let questions = [];

        results.questions.forEach(function (question) {
            questions.push({
                question_id: question.question_id,
                question_title: question.question_title,
                question_tags: question.question_tags || [],
                question_describe: question.question_describe,
                question_answer_count: question.answer_count || 0,
                question_favour_count: question.favour_count || 0,
                question_collect_count: question.collect_count || 0,
                create_user_id: question.create_user_id,
                create_user_name: question.create_user_name,
                create_user_avatar: question.create_user_avatar,
            });
        });

        res.json({
            flag: '0000',
            msg: '',
            result: {
                count: count,
                list: questions
            }
        });
    });
    
};

/**
 * @desc 预置话题
 * */
exports.getDefaultQuestionTags = function(req, res, next){
    
    let count = 12;

    tagsModel.getRecommenedQuestionTags(count, function (err, tags) {
        if(err){
            return next(err);
        }

        tags = tags.map(function (tag) {
            return {
                id: tag.id,
                title: tag.title,
                describe: tag.describe,
                icon: tag.icon,
            };
        });
        
        res.json({
            flag: '0000',
            msg: '',
            result: {
                count: tags.length,
                list: tags
            }
        });
    });
};


/**
 * @desc 查询话题
 * */
exports.findQuestionTags = function(req, res, next){
    let content = req.query.content;
    
    if(!content){
        return res.json({
            flag: '0000',
            msg: '',
            result: {
                count: 0,
                list: []
            }
        });
    }
    
    tagsModel.searchQuestionTags(content, function (err, result) {
        if(err){
            return next(err);
        }
        
        let count = result.count;
        let tags = result.tags;
        
        tags = tags.map(function (tag) {
           return {
               id: tag.id,
               title: tag.title,
               describe: tag.describe,
               icon: tag.icon,
           }; 
        });
        
        res.json({
            flag: '0000',
            msg: '',
            result: {
                count : count,
                list: tags
            }
        });
    });
};