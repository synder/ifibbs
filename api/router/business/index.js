/**
 * @author synder
 * @date 16/1/10
 * @desc
 */

const recommend = require('../../controller/business/recommend');
const question = require('../../controller/business/question');
const answer = require('../../controller/business/answer');
const comment = require('../../controller/business/comment');


exports.map = function (app) {
    //首页推荐
    app.get('/recommends', recommend.getRecommendList);      //获取首页推荐
    
    
    //问题
    app.get('/question', question.getQuestionDetail);                     //获取问题详情
    app.get('/questions/find/attr_with_answer', question.searchQuestionsByAttrAndAnswer);      //搜索问题
    app.get('/questions/find/attr', question.searchQuestionsByQuestionTitleAndDesc);           //根据问题
    
    
    //问题标签
    app.get('/question/tags/default', question.getDefaultQuestionTags);  //获取默认问题标签
    app.get('/question/tags/find', question.findQuestionTags);  //查找问题标签

   
    //问题回答
    app.get('/question/answer', answer.getAnswerDetail);
    app.get('/question/answer/ids', answer.getAnswerNextAndPrevIDS);
    app.get('/question/answers', answer.getQuestionAnswerList);
    app.get('/question/answers/hottest', answer.getHottestAnswer);
    app.get('/question/answers/latest', answer.getLatestAnswer);
    
    
    //回答评论
    app.get('/question/answer/comments', comment.getAnswerCommentList);
};