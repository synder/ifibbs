/**
 * @author synder on 2017/3/4
 * @copyright
 * @desc 用户动态生成
 */

const dynamicModel = require('../../../public/model/dynamic');


/**
 * @desc 获取用户的动态
 * */
exports.getUserDynamics = function (req, res, next) {
    let pageSkip = req.query.page_skip;
    let pageSize = req.query.page_size;
    
    let userID = req.query.user_id;

    dynamicModel.getUserDynamicList(userID, pageSkip, pageSize, function (err, results) {
       if(err){
           return next(err);
       } 
       
       let count = results.count;
       let dynamics = [];
        
       results.dynamics.forEach(function (dynamic) {
           if(dynamic.type === 100){
               //发布问题
               if(dynamic.question){
                   dynamics.push({
                       type: dynamic.type,
                       user_id: dynamic.user_id,
                       question_id: dynamic.question._id,
                       question_title: dynamic.question.title,
                       create_time: dynamic.create_time,
                   });
               }
               
           }else if(dynamic.type === 101){
               //回答了问题
               if(dynamic.question && dynamic.answer){
                   dynamics.push({
                       type: dynamic.type,
                       user_id: dynamic.user_id,
                       question_id: dynamic.question._id,
                       question_title: dynamic.question.title,
                       answer_id: dynamic.answer._id,
                       answer_content: dynamic.answer.content,
                       create_time: dynamic.create_time,
                   });
               }
               
           }else if(dynamic.type === 102){
               //评论了回答
               if(dynamic.question && dynamic.answer && dynamic.comment){
                   dynamics.push({
                       type: dynamic.type,
                       user_id: dynamic.user_id,
                       question_id: dynamic.question._id,
                       question_title: dynamic.question.title,
                       answer_id: dynamic.answer._id,
                       answer_content: dynamic.answer.content,
                       comment_id: dynamic.comment._id,
                       comment_content: dynamic.comment.content,
                       create_time: dynamic.create_time,
                   });
               }
           }else if(dynamic.type === 200){
               //关注了问题
               dynamics.push({
                   type: dynamic.type,
                   user_id: dynamic.user_id,
                   question_id: dynamic.question._id,
                   question_title: dynamic.question.title,
                   create_time: dynamic.create_time,
               });
           }else if(dynamic.type === 201){
               if(dynamic.subject){
                   //关注了专题
                   dynamics.push({
                       type: dynamic.type,
                       user_id: dynamic.user_id,
                       subject_id: dynamic.subject._id,
                       subject_title: dynamic.subject.title,
                       create_time: dynamic.create_time,
                   });
               }
           }else if(dynamic.type === 202){
               //关注了用户
               if(dynamic.user){
                   dynamics.push({
                       type: dynamic.type,
                       user_id: dynamic.user_id,
                       attention_user_id: dynamic.user._id,
                       attention_user_name: dynamic.user.user_name,
                       create_time: dynamic.create_time,
                   });
               }
               
           }else if(dynamic.type === 300){
               //赞了回答
               if(dynamic.answer){
                   dynamics.push({
                       type: dynamic.type,
                       user_id: dynamic.user_id,
                       answer_id: dynamic.answer._id,
                       answer_content: dynamic.answer.content,
                       create_time: dynamic.create_time,
                   });
               }
           }else if(dynamic.type === 301){
                //赞了评论
               if(dynamic.answer && dynamic.comment){
                   dynamics.push({
                       type: dynamic.type,
                       user_id: dynamic.user_id,
                       answer_id: dynamic.answer._id,
                       answer_content: dynamic.answer.content,
                       comment_id: dynamic.comment._id,
                       comment_content: dynamic.comment.content,
                       create_time: dynamic.create_time,
                   });
               }
               
           }else if(dynamic.type === 302){
                //赞了文章
               if(dynamic.article){
                   dynamics.push({
                       type: dynamic.type,
                       user_id: dynamic.user_id,
                       article_id: dynamic.article._id,
                       article_title: dynamic.article.title,
                       create_time: dynamic.create_time,
                   });
               }
               
           }else if(dynamic.type === 400){
               //分享了问题
               if(dynamic.question){
                   dynamics.push({
                       type: dynamic.type,
                       user_id: dynamic.user_id,
                       question_id: dynamic.question._id,
                       question_title: dynamic.question.title,
                       create_time: dynamic.create_time,
                   });
               }
               
           }else if(dynamic.type === 401){
               //分享了文章
               if(dynamic.article){
                   dynamics.push({
                       type: dynamic.type,
                       user_id: dynamic.user_id,
                       article_id: dynamic.article._id,
                       article_title: dynamic.article.title,
                       create_time: dynamic.create_time,
                   });
               }
               
           }else{
               throw new Error('dynamic has not this type:' + dynamic.type);
           }
       });
        
       res.json({
           flag: '0000',
           msg: '',
           result: {
               count: count,
               list: dynamics
           }
       });
    });
};
