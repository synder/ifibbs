/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

const async = require('async');

const questionModel = require('../../model/question');
const attentionModel = require('../../model/attention');
const tagsModel = require('../../model/tags');
const historyModel = require('../../model/history');

/**
 * @desc 首页获取推荐问题列表，会加入一些活动
 * */
exports.getRecommendQuestions = function (req, res, next) {

    let pageSize = req.query.page_size;
    let pageSkip = req.query.page_skip;
    
    questionModel.getRecommenedQuestionList(pageSkip, pageSize, function (err, results) {
        if(err){
            return next(err);
        }
        
        let count = results.count;
        let questions = results.questions;

        questions = questions.map(function (question) {
            return {
                id : question.id,
                title: question.title,
                describe: question.describe,
                tags: question.tags,
                answer_count: question.answer_count,
                favour_count: question.favour_count,
                attention_count: question.attention_count,
                collect_count: question.collect_count,
                create_time: question.create_time,
                type: 1
            };
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
 * @desc 获取问题详情
 * */
exports.getQuestionDetail = function(req, res, next){
    
    let questionID = req.query.question_id;
    let userID = req.session.id;

    if(!questionID){
        return next(new BadRequestError('question_id is needed'));
    }

    questionModel.getQuestionDetail(questionID, function (err, question) {
        
        if(err){
            return next(err);
        }
        
        if(!question){
            return res.json({
                flag: '0000',
                msg: '',
                result: {}
            });
        }

        let isAttented = false;
        
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
            create_time: question.create_time,
        };
        
        if(!userID){
            return res.json({
                flag: '0000',
                msg: '',
                result: result
            });
        }

        //创建浏览历史
        async.parallel({
            createHistory: function(cb){
                historyModel.createBrowseQuestionHistory(userID, questionID, cb);
            },
            
            hasAttention: function (cb) {
                attentionModel.findUserAttentionByQuestionID(userID, questionID, cb);
            }
        }, function (err, results) {
            if(err){
                return next(err);
            }

            result.is_attented = !!results.hasAttention;

            res.json({
                flag: '0000',
                msg: '',
                result: result
            });
        });
    });
};

/**
 * @desc 主页搜索
 * */
exports.searchQuestions = function (req, res, next) {
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
    
    async.parallel({
        searchByQuestions: function (cb) {
            questionModel.searchQuestionByAttribute(content, pageSkip, pageSize, cb);
        },
        
        searchByAnswers: function (cb) {
            questionModel.searchQuestionByAnswer(content, pageSkip, pageSize, cb);
        }
    }, function (err, results) {
        
        if(err){
            return next(err);
        }
        
        let searchByQuestions = results.searchByQuestions;
        let searchByAnswers = results.searchByAnswers;
        
        let questions = [];
        
        searchByQuestions.questions.forEach(function (question) {
            questions.push({
                id: question._id,
                title: question.title,
                tags: question.tags || [],
                describe: question.describe,
                answer_count: question.answer_count || 0,
                favour_count: question.favour_count || 0,
                type: 1,
            });
        });

        searchByAnswers.questions.forEach(function (question) {
            questions.push({
                id: question._id,
                title: question.title,
                tags: question.tags || [],
                describe: question.describe,
                answer_count: question.answer_count || 0,
                favour_count: question.favour_count || 0,
                type: 2,
            });
        });
        
        res.json({
            flag: '0000',
            msg: '',
            result: {
                count: searchByQuestions.count + searchByAnswers.count,
                list: questions
            }
        });
        
    });
};


/**
 * @desc 搜索回答
 * */
exports.searchQuestionsByAnswer = function(req, res, next){
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

    questionModel.searchQuestionByAnswer(content, pageSkip, pageSize, function (err, question) {
        //todo
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