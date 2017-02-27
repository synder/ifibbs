/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

const answerModel = require('../../../public/model/answer');

/**
 * @desc 获取用户提问信息
 * */
exports.getUserAnswers = function(req, res, next){
    
    let pageSkip = req.query.page_skip;
    let pageSize = req.query.page_size;
    
    let userID = req.session.id;
    
    answerModel.getUserAnswerList(userID, pageSkip, pageSize, function (err, results) {
        if(err){
            return next(err);
        }
        
        let count = results.count;
        let answers = [];

        results.answers.forEach(function (answer) {
            if(answer.question_id){
                answers.push({
                    question_id: answer.question_id ? answer.question_id._id : null,
                    question_title: answer.question_id ? answer.question_id.title : null,
                    question_tags: answer.question_id ? answer.question_id.tags : null,
                    answer_id: answer._id,
                    answer_content: answer.content
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
 * @desc 新增回答
 * */
exports.createNewAnswer = function(req, res, next){
    let questionID = req.body.question_id;
    let answerContent = req.body.answer_content;
    let userID = req.session.id;

    if(!questionID){
        return next(new BadRequestError('question_id is needed'));
    }

    if(!answerContent){
        return next(new BadRequestError('answer_content is needed'));
    }
    
    answerModel.createNewQuestionAnswer(userID, questionID, answerContent, function (err, answerID) {
        if(err){
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                question_id: questionID,
                answer_id: answerID,
            }
        });
    });
};


/**
 * @desc 删除我的回答
 * */
exports.removeUserAnswer = function (req, res, next) {
    let answerID = req.body.answer_id;
    let userID = req.session.id;

    if(!answerID){
        return next(new BadRequestError('answer_id is needed'));
    }
    
    
    answerModel.removeQuestionAnswer(userID, answerID, function (err, success) {
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