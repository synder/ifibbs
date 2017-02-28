/**
 * @author synder
 * @date 16/1/10
 * @desc
 */

const question = require('../../controller/business/question');
const answer = require('../../controller/business/answer');
const comment = require('../../controller/business/comment');

exports.map = function (app) {
    //问题
    app.get('/question', question.getQuestionDetail);                     //获取问题详情
    app.get('/questions/find', question.searchQuestions);                 //搜索问题
    app.get('/questions/recommend', question.getRecommendQuestions);      //获取问题推荐列表
    app.get('/questions/answer/find', question.searchQuestionsByAnswer);  //根据回答搜索
   
    
    
    //问题标签
    app.get('/question/tags/default', question.getDefaultQuestionTags);
    app.get('/question/tags/find', question.findQuestionTags);

   
    //问题回答
    app.get('/question/answer', answer.getAnswerDetail);
    app.get('/question/answer/ids', answer.getAnswerNextAndPrevIDS);
    app.get('/question/answers', answer.getQuestionAnswerList);
    app.get('/question/answers/hottest', answer.getHottestAnswer);
    app.get('/question/answers/latest', answer.getLatestAnswer);
    
    
    //回答评论
    app.get('/question/answer/comments', comment.getAnswerCommentList);
};