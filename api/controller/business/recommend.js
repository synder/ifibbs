/**
 * @author synder on 2017/3/2
 * @copyright
 * @desc
 */


const async = require('async');

const recommendModel = require('../../../public/model/recommend');

exports.getRecommendList = function(req, res, next){
    let pageSize = req.query.page_size;
    let pageSkip = req.query.page_skip;
    
    let userID = req.session.id;

    recommendModel.getUserRecommend(userID, pageSkip, pageSize, function (err, results) {
        if(err){
            return next(err);
        }
        
        let count = results.count;
        let recommends = [];

        results.recommends.forEach(function (recommend) {
            
            if(recommend.type === 1){
                
                if(recommend.question && 
                    recommend.question.question_id && 
                    recommend.question.answer_id && 
                    recommend.question.answer_user_id){

                    let temp = {
                        id : recommend.question.question_id._id,
                        type: recommend.type,
                        title: recommend.question.question_id.title,
                        tags: recommend.question.question_id.tags || [],
                        cover: null,
                        favour_count: recommend.question.question_id.favour_count,
                        attention_count: recommend.question.question_id.attention_count,
                        collect_count: recommend.question.question_id.collect_count,
                        answer_count: recommend.question.question_id.answer_count,
                        comment_count: 0,
                        create_time: recommend.question.question_id.create_time,
                        eg_answer_id: recommend.question.answer_id._id,
                        eg_answer_time: recommend.question.answer_id.create_time,
                        eg_answer_content: recommend.question.answer_id.content,
                        eg_answer_user_id: recommend.question.answer_user_id._id,
                        eg_answer_user_name: recommend.question.answer_user_id.user_name,
                    };
                    
                    recommends.push(temp);
                }
            }else if(recommend.type === 2){

                if(recommend.activity &&
                    recommend.activity.activity_id){

                    let temp = {
                        id : recommend.activity.activity_id._id,
                        type: recommend.type,
                        title: recommend.activity.activity_id.title,
                        tags: null,
                        cover: recommend.activity.activity_id.cover,
                        favour_count: recommend.activity.activity_id.favour_count,
                        attention_count: recommend.activity.activity_id.attention_count,
                        comment_count: recommend.activity.activity_id.comment_count,
                        collect_count: recommend.activity.activity_id.collect_count, 
                        answer_count: 0,
                        create_time: recommend.activity.activity_id.create_time,
                        eg_answer_id: null,
                        eg_answer_time: null,
                        eg_answer_content: null,
                        eg_answer_user_id: null,
                        eg_answer_user_name: null,
                    };

                    recommends.push(temp);
                }
                
            }else if(recommend.type === 3){
                if(recommend.article &&
                    recommend.article.article_id){

                    let temp = {
                        id : recommend.article.article_id._id,
                        type: recommend.type,
                        title: recommend.article.article_id.title,
                        tags: null,
                        cover: recommend.article.article_id.cover,
                        favour_count: recommend.article.article_id.favour_count,
                        attention_count: 0,
                        comment_count: recommend.article.article_id.comment_count,
                        collect_count: recommend.article.article_id.collect_count,
                        answer_count: 0,
                        create_time: recommend.article.article_id.create_time,
                        eg_answer_id: null,
                        eg_answer_time: null,
                        eg_answer_content: null,
                        eg_answer_user_id: null,
                        eg_answer_user_name: null,
                    };

                    recommends.push(temp);
                }
            }else if(recommend.type === 4){
                if(recommend.subject &&
                    recommend.subject.subject_id){

                    let temp = {
                        id : recommend.subject.subject_id._id,
                        type: recommend.type,
                        title: recommend.subject.subject_id.title,
                        tags: null,
                        cover: recommend.subject.subject_id.cover,
                        favour_count: 0,
                        attention_count: 0,
                        comment_count: 0,
                        collect_count: 0,
                        answer_count: 0,
                        create_time: recommend.article.article_id.create_time,
                        eg_answer_id: null,
                        eg_answer_time: null,
                        eg_answer_content: null,
                        eg_answer_user_id: null,
                        eg_answer_user_name: null,
                    };

                    recommends.push(temp);
                }
            }
        });
        
        res.json({
            flag: '0000',
            msg: '',
            result: {
                count: count,
                list : recommends
            }
        });
    });
};