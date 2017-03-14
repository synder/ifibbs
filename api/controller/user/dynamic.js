/**
 * @author synder on 2017/3/4
 * @copyright
 * @desc 用户动态生成
 */

const dynamicModel = require('../../../public/model/ifibbs/dynamic');


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
               if(dynamic.question && dynamic.user_id){
                   dynamics.push({
                       type: dynamic.type,
                       user_id: dynamic.user_id._id,
                       user_name: dynamic.user_id.user_name,
                       user_avatar: dynamic.user_id.user_avatar,
                       question_id: dynamic.question._id,
                       question_title: dynamic.question.title,
                       question_tags: dynamic.question.tags,
                       question_attention_count: dynamic.question.attention_count,
                       question_answer_count: dynamic.question.answer_count,
                       create_time: dynamic.create_time,
                   });
               }
               
           }else if(dynamic.type === 101){
               //回答了问题
               if(dynamic.question && dynamic.answer && dynamic.user_id){
                   dynamics.push({
                       type: dynamic.type,
                       user_id: dynamic.user_id._id,
                       user_name: dynamic.user_id.user_name,
                       user_avatar: dynamic.user_id.user_avatar,
                       question_id: dynamic.question._id,
                       question_title: dynamic.question.title,
                       question_tags: dynamic.question.tags,
                       answer_id: dynamic.answer._id,
                       answer_content: dynamic.answer.content,
                       answer_favour_count: dynamic.answer.favour_count,
                       answer_comment_count: dynamic.answer.comment_count,
                       create_time: dynamic.create_time,
                   });
               }
           }else if(dynamic.type === 200){
               //关注了问题
               if(dynamic.question && dynamic.user){
                   dynamics.push({
                       type: dynamic.type,
                       user_id: dynamic.user._id,
                       user_name: dynamic.user.user_name,
                       user_avatar: dynamic.user.user_avatar,
                       question_id: dynamic.question._id,
                       question_title: dynamic.question.title,
                       question_tags: dynamic.question.tags,
                       question_attention_count: dynamic.question.attention_count,
                       question_answer_count: dynamic.question.answer_count,
                       create_time: dynamic.create_time,
                   });
               }
               
           }else if(dynamic.type === 201){
               //关注了专题
               if(dynamic.subject && dynamic.user_id){
                   dynamics.push({
                       type: dynamic.type,
                       user_id: dynamic.user_id._id,
                       user_name: dynamic.user_id.user_name,
                       user_avatar: dynamic.user_id.user_avatar,
                       subject_id: dynamic.subject._id,
                       subject_icon: dynamic.subject.icon,
                       subject_title: dynamic.subject.title,
                       subject_describe: dynamic.subject.describe,
                       subject_attention_count: dynamic.subject.attention_count,
                       subject_article_count: dynamic.subject.article_count,
                       create_time: dynamic.create_time,
                   });
               }
           }else if(dynamic.type === 500){
               //收藏了问题
               if(dynamic.subject && dynamic.user_id){
                   dynamics.push({
                       type: dynamic.type,
                       user_id: dynamic.user_id._id,
                       user_name: dynamic.user_id.user_name,
                       user_avatar: dynamic.user_id.user_avatar,
                       question_id: dynamic.question._id,
                       question_title: dynamic.question.title,
                       question_tags: dynamic.question.tags,
                       question_attention_count: dynamic.question.attention_count,
                       question_answer_count: dynamic.question.answer_count,
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
               ok: true,
               failed_message: null,
               success_message: null,
               count: count,
               list: dynamics
           }
       });
    });
};
