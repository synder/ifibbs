/**
 * @author synder
 * @date 16/1/10
 * @desc
 */

const article = require('../../controller/information/article');
const subject = require('../../controller/information/subject');

exports.map = function(app){
    //专题
    app.get('/subject', subject.getSubjectDetail);                          //获取专题详情
    app.get('/subjects', subject.getSubjectList);                           //获取专题列表
    
    //文章
    app.get('/subject/article', article.getSubjectArticleDetail);              //获取单个文章详情
    app.get('/subject/articles', article.getSubjectArticleList);               //获取专题下的文章列表
    app.get('/subject/articles/recommend', article.getRecommendArticleList);   //获取推荐的文章列表
    
    //文章评论
    app.get('/subject/article/comments', article.getArticleCommentList);     //获取文章评论列表
    
    //获取文章其他信息，最新与最热评论，是否关注
    app.get('/subject/article/social/info', article.getArticleSocialInfo);   //获取文章的其他社交信息
};