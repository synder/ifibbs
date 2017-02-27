/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

const async = require('async');

const questionModel = require('../../../public_model/question');
const tagsModel = require('../../../public_model/tags');

/**
 * @desc 获取用户提问信息
 * */
exports.getUserQuestions = function(req, res, next){
    let pageSize = req.query.page_size;
    let pageSkip = req.query.page_skip;
    
    let userID = req.session.id;
    
    questionModel.getQuestionList(userID, pageSkip, pageSize, function (err, results) {
        if(err){
            return next(err);
        }
        
        let count = results.count;
        let questions = results.questions;
        
        questions = questions.map(function (question) {
            return {
                id : question.id,
                title: question.title,
                tags: question.tags,
                describe: question.describe,
                answer_count: question.answer_count,
                favour_count: question.favour_count,
                attention_count: question.attention_count,
                collect_count: question.collect_count,
                create_time: question.create_time,
            }
        });
        
        return res.json({
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
 * @desc 删除用户提问
 * */
exports.removeUserQuestion = function(req, res, next){
    let questionID = req.body.question_id;
    let userID = req.session.id;

    if(!questionID){
        return next(new BadRequestError('question_id is needed'));
    }

    questionModel.removeUserQuestion(userID, questionID, function (err, success) {
        
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
 * @desc 新增提问
 * */
exports.addNewUserQuestion = function(req, res, next){
    let title = req.body.title;
    let describe = req.body.describe;
    let tags = req.body.tags;
    
    let createUserId = req.session.id;

    if(!title){
        return next(new BadRequestError('title is needed'));
    }

    if(!describe){
        return next(new BadRequestError('describe is needed'));
    }
    
    if(!Array.isArray(tags)){
        return next(new BadRequestError('tags should be array'));
    }
    
    
    let questionDoc = {
        title: title,
        describe: describe,
        tags: [],
    };
    
    async.waterfall([
        function (cb) {
        
            if(tags.length === 0){
                return cb(null, []);
            }
            
            tagsModel.getQuestionTagsByIDS(tags, function (err, tags) {
                if(err){
                    return cb(err);
                }
                
                let temp = [];
                
                tags.forEach(function (tag) {
                    temp.push(tag.title);
                });
                
                return cb(null, temp);
            });
        },
        
        function (tags, cb) {
            questionDoc.tags = tags;
            questionModel.createNewQuestion(createUserId, questionDoc, cb);
        }
    ], function (err, questionID) {
        
        if(err){
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                question_id: questionID
            }
        });
    });
};