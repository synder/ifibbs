/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

const async = require('async');

const answerModel = require('../../../public/model/answer');
const favourModel = require('../../../public/model/favour');
const attentionModel = require('../../../public/model/attention');
const collectionModel = require('../../../public/model/collection');

/**
 * @desc 热门回答
 * */
exports.getHottestAnswer = function(req, res, next){
    let pageSkip = req.query.page_skip;
    let pageSize = req.query.page_size;
    
    answerModel.getHottestAnswerList(pageSkip, pageSize, function (err, result) {
        if(err){
            return next(err);
        }
        
        let count = result.count;
        let answers = [];
        
        result.answers.forEach(function (answer) {
            
            if(answer.create_user_id && answer.question_id){
                answers.push({
                    id: answer.id,
                    user_id: answer.create_user_id.id,
                    user_avatar: answer.create_user_id.user_avatar,
                    user_name: answer.create_user_id.user_name,
                    question_id: answer.question_id.id,
                    question_title: answer.question_id.title,
                    question_tags: answer.question_id.tags,
                    question_collect_count: answer.question_id.collect_count,
                });
            }
        });
        
        res.json({
            flag: '0000',
            msg: '',
            result: {
                count: count,
                list: answers
            }
        });
    });
};


/**
 * @desc 最新回答
 * */
exports.getLatestAnswer = function(req, res, next){
    let pageSkip = req.query.page_skip;
    let pageSize = req.query.page_size;

    answerModel.getLatestAnswerList(pageSkip, pageSize, function (err, result) {
        if(err){
            return next(err);
        }

        let count = result.count;
        let answers = [];

        result.answers.forEach(function (answer) {
            if(answer.create_user_id && answer.question_id) {
                answers.push({
                    id: answer.id,
                    user_id: answer.create_user_id.id,
                    user_avatar: answer.create_user_id.user_avatar,
                    user_name: answer.create_user_id.user_name,
                    question_id: answer.question_id.id,
                    question_title: answer.question_id.title,
                    question_tags: answer.question_id.tags,
                    question_collect_count: answer.question_id.collect_count,
                });
            }
        });

        res.json({
            flag: '0000',
            msg: '',
            result: {
                count: count,
                list: answers
            }
        });
    });
};


/**
 * @desc 问题回答列表
 * */
exports.getQuestionAnswerList = function(req, res, next){
    let pageSkip = req.query.page_skip;
    let pageSize = req.query.page_size;
    
    let questionID = req.query.question_id;
    
    if(!questionID){
        return next(new BadRequestError('question_id is needed'));
    }
    
    answerModel.getQuestionAnswerList(questionID, pageSkip, pageSize, function (err, result) {
        if(err){
            return next(err);
        }
        
        let count = result.count;
        let answers = result.answers;

        answers = answers.map(function (answer) {
            return {
                user_id: answer.create_user_id.id,
                user_avatar: answer.create_user_id.user_avatar,
                user_name: answer.create_user_id.user_name,
                answer_id: answer.id,
                answer_content: answer.content,
                answer_comment_count: answer.comment_count,
                answer_favour_count: answer.favour_count,
            }
        });

        res.json({
            flag: '0000',
            msg: '',
            result: {
                count: count,
                list: answers
            }
        });
    });
};


/**
 * @desc 根据当前回答ID，获取前n个answerID和后n个answerID
 * */
exports.getAnswerNextAndPrevIDS = function (req, res, next) {

    let answerID = req.query.answer_id;
    
    answerModel.getPrevAndNextAnswerIDSByAnswerID(answerID, function (err, ids) {
        if(err){
            return next(err);
        }
        
        res.json({
            flag: '0000',
            msg: '',
            result: {
                count: ids.length,
                list: ids
            }
        });
    });
};

/**
 * @desc 回答详情
 * */
exports.getAnswerDetail = function(req, res, next){
    let questionID = req.query.question_id; //问题ID
    let answerID = req.query.answer_id;
    let userID = req.session.id;

    if(!answerID){
        return next(new BadRequestError('answer_id is needed'));
    }

    if(!questionID){
        return next(new BadRequestError('question_id is needed'));
    }

    answerModel.getQuestionAnswerDetail(answerID, function (err, answer) {
        
        if(!answer){
            return res.json({
                flag: '0000',
                msg: '',
                result: null
            });
        }
        
        let result = {
            question_id: answer.question_id ? answer.question_id._id : null,
            answer_id: answer.id,
            answer_content: answer.content,
            answer_time: answer.create_time.valueOf(),
            answer_comment_count: answer.comment_count,
            answer_favour_count: answer.favour_count,
            answer_collect_count: answer.collect_count,
            user_id: answer.create_user_id ? answer.create_user_id.id : null,
            user_avatar: answer.create_user_id ? answer.create_user_id.user_avatar : null,
            user_name: answer.create_user_id ? answer.create_user_id.user_name : null,
            user_profile: answer.create_user_id ? answer.create_user_id.user_profile : null,
            is_attention_user: false,
            is_favour: false,
            is_collected: false,
        };

        if(!userID){
            return res.json({
                flag: '0000',
                msg: '',
                result: result
            });
        }

        let toUserID =  answer.create_user_id ? answer.create_user_id.id : null;

        //用户已经登录，查看关注情况
        async.parallel({
            isFavour: function (cb) {
                favourModel.findUserFavourAnswerByFavourID(userID, answerID, cb);
            },
            isCollected: function (cb) {
                collectionModel.findUserCollectionAnswerByCollectionID(userID, answerID, cb);
            },
            isAttentionUser: function (cb) {
                attentionModel.findUserAttentionByUserID(userID, toUserID, cb);
            }
        }, function (err, results) {
            if(err){
                return next(err);
            }

            result.is_favour = !!results.isFavour;
            result.is_collected = !!results.isCollected;
            result.is_attention_user = !!results.isAttentionUser;

            return res.json({
                flag: '0000',
                msg: '',
                result: result
            });
        });
    });
};