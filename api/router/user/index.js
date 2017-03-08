/**
 * @author synder
 * @date 16/1/10
 * @desc
 */

const authority = require('../../controller/user/authority');
const account = require('../../controller/user/account');
const answer = require('../../controller/user/answer');
const comment = require('../../controller/user/comment');
const attention = require('../../controller/user/attention');
const collection = require('../../controller/user/collection');
const favour = require('../../controller/user/favour');
const history = require('../../controller/user/history');
const notification = require('../../controller/user/notification');
const question = require('../../controller/user/question');
const statistics = require('../../controller/user/statistics');
const dynamic = require('../../controller/user/dynamic');
const share = require('../../controller/user/share');


exports.map = function(app){
    
    //用户账户非登录下接口
    app.get('/account/phone', account.checkPhoneRegistered);                  //检测手机是否登录
    app.put('/account/register', account.userRegisterWithPhone);              //注册账户
    
    app.post('/account/login', account.userLoginWithSystemAccount);            //账户密码登录
    app.post('/account/login/third', account.userLoginWithThirdPartyAccount);  //第三方账户登录
    
    app.post('/account/password', account.modifyUserPassword);                //修改密码
    app.put('/account/password', account.resetUserPassword);                  //找回密码
    
    
    //其他用户的相关接口
    app.get('/other/questions', question.getUserQuestions);                        //获取用户所有提问
    app.get('/other/question/answers', answer.getUserAnswers);                     //其他用户的回答列表
    app.get('/other/question/answer/comments', comment.getUserCommentsList);       //获取其他用户评论列表
    app.get('/other/collections/answer', collection.getUserAnswerCollections);     //获取其他用户的所有回答收藏
    app.get('/other/collections/article', collection.getUserArticleCollections);   //获取其他用户的所有文章收藏
    app.get('/other/attention/questions', attention.getAttentionQuestionList);     //获取其他用户关注的问题列表
    app.get('/other/attention/users', attention.getUserAttentionUserList);         //获取其他用户关注的用户列表 
    app.get('/other/attention/subjects', attention.getUserAttentionSubjectList);   //获取其他用户关注的专题列表
    app.get('/other/statistics', statistics.getUserStatisticsData);                //获取其他用户统计数据(关注人数，收藏数，被赞数)
    app.get('/other/dynamic', dynamic.getUserDynamics);  //获取其他用户动态
    

    //用户登录后操作
    app.get('/user/account/info', authority.check, account.getUserInfo);             //获取用户信息
    app.post('/user/account/info',authority.check, account.updateUserInfo);          //更新用户信息
    app.post('/user/account/password',authority.check, account.modifyUserPassword);  //修改密码
    
    
    //用户的提问
    app.put('/user/question', authority.check, question.addNewUserQuestion);    //用户创建新的问题
    app.delete('/user/question', authority.check, question.removeUserQuestion); //删除用户的提问
    app.get('/user/questions', authority.check, question.getUserQuestions);     //获取用户所有提问
   
    
    //用户的回答
    app.get('/user/question/answers', authority.check, answer.getUserAnswers);      //获取用户的回答列表
    app.put('/user/question/answer', authority.check, answer.createNewAnswer);      //创建用户提问
    app.delete('/user/question/answer', authority.check, answer.removeUserAnswer);  //删除用户回答
    
    
    //用户回答的评论
    app.put('/user/question/answer/comment', authority.check, comment.addNewCommentToAnswer);   //新增回答评论
    app.delete('/user/question/answer/comment', authority.check, comment.removeUserComments);   //新增回答评论
    app.get('/user/question/answer/comments', authority.check, comment.getUserCommentsList);    //获取用户评论列表
    
    
    //用户的收藏
    app.get('/user/collections/answer', authority.check, collection.getUserAnswerCollections);        //获取用户的所有答案收藏
    app.get('/user/collections/article', authority.check, collection.getUserArticleCollections);      //获取用户的所有文章收藏
    app.put('/user/collection/answer', authority.check, collection.addAnswerToCollection);        //收藏回答
    app.put('/user/collection/article', authority.check, collection.addArticleToCollection);      //收藏文章
    app.delete('/user/collection/answer', authority.check, collection.removeAnswerFromCollection);    //取消收藏回答
    app.delete('/user/collection/article', authority.check, collection.removeArticleFromCollection);  //取消收藏文章
    
    
    //用户点赞
    app.put('/user/favour/answer', authority.check, favour.addAnswerToFavour);          //点赞回答
    app.put('/user/favour/article', authority.check, favour.addArticleToFavour);        //点赞文章
    app.put('/user/favour/comment', authority.check, favour.addAnswerCommentToFavour);  //点赞回答评论
    app.delete('/user/favour/answer', authority.check, favour.removeAnswerFromFavour);          //取消点赞回答
    app.delete('/user/favour/article', authority.check, favour.removeArticleFromFavour);        //取消点赞文章
    app.delete('/user/favour/comment', authority.check, favour.removeAnswerCommentFromFavour);  //取消点赞回答评论
    
    
    //用户关注
    app.get('/user/attention/questions', authority.check, attention.getAttentionQuestionList);     //获取用户关注的问题列表
    app.get('/user/attention/users', authority.check, attention.getUserAttentionUserList);         //获取用户关注的用户列表 
    app.get('/user/attention/subjects', authority.check, attention.getUserAttentionSubjectList);   //获取用户关注的专题列表
    app.put('/user/attention/question', authority.check, attention.addQuestionToAttention);  //对问题添加关注
    app.put('/user/attention/user', authority.check, attention.addUserToAttention);          //对用户添加关注
    app.put('/user/attention/subject', authority.check, attention.addSubjectToAttention);    //对专题添加关注
    app.delete('/user/attention/question', authority.check, attention.removeQuestionFromAttention);  //取消对问题添加关注
    app.delete('/user/attention/user', authority.check, attention.removeUserFromAttention);          //取消对用户添加关注
    app.delete('/user/attention/subject', authority.check, attention.removeSubjectFromAttention);    //取消对专题添加关注
    
    
    //用户历史
    app.get('/user/history/browses', authority.check, history.getUserBrowseHistory);  //获取用户浏览历史记录
    
    //用户通知
    app.put('/user/notification/status',authority.check,notification.changeNotificationToRead);           //修改通知阅读状态
    app.get('/user/notification/systems', authority.check, notification.getUserSystemNotification);       //获取系统通知
    app.get('/user/notification/businesses', authority.check, notification.getUserBusinessNotification);  //获取业务通知
    app.get('/user/notifications/unread/count', authority.check, notification.checkUserHasNewNotification);     //获取业务通知
    
    //获取用户统计数据
    app.get('/user/statistics', authority.check, statistics.getUserStatisticsData);  //获取用户统计数据(关注人数，收藏数，被赞数)
    
    //分享
    app.put('/user/share', authority.check, share.createUserShare); //记录分享
};