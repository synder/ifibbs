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
                        type: recommend.type, //类型
                        title: recommend.question.question_id.title,          //问题或者资讯或者活动封面
                        describe: recommend.question.question_id.describe,       //描述
                        tags: recommend.question.question_id.tags || [],             //问题标签
                        cover: null,          //资讯或者活动封面
                        favour_count: recommend.question.question_id.favour_count,      //点赞数
                        attention_count: recommend.question.question_id.attention_count,   //关注数
                        collect_count: recommend.question.question_id.collect_count,     //收藏数
                        answer_count: recommend.question.question_id.answer_count,      //回答数
                        comment_count: 0,     //收藏数
                        create_time: recommend.question.question_id.create_time,    //创建时间
                        eg_answer_id: recommend.question.answer_id._id,        //问题的实例回答ID
                        eg_answer_time: recommend.question.answer_id.create_time,      //问题的实例回答ID
                        eg_answer_content: recommend.question.answer_id.content,   //问题的实例回答ID
                        eg_answer_user_id: recommend.question.answer_user_id._id,   //问题的实例回答ID
                        eg_answer_user_name: recommend.question.answer_user_id.user_name, //问题的实例回答ID
                    };
                    
                    recommends.push(temp);
                }
            }else if(recommend.type === 2){

                if(recommend.activity &&
                    recommend.activity.activity_id){

                    let temp = {
                        id : recommend.activity.activity_id._id,
                        type: recommend.type, //类型
                        title: recommend.activity.activity_id.title,          //问题或者资讯或者活动封面
                        describe: recommend.activity.activity_id.describe,       //描述
                        tags: null,             //问题标签
                        cover: recommend.activity.activity_id.cover,          //资讯或者活动封面
                        favour_count: recommend.activity.activity_id.favour_count,      //点赞数
                        attention_count: recommend.activity.activity_id.attention_count,   //关注数
                        comment_count: recommend.activity.activity_id.comment_count,   //关注数
                        collect_count: recommend.activity.activity_id.collect_count,     //收藏数 
                        answer_count: 0,      //回答数
                        create_time: recommend.activity.activity_id.create_time,    //创建时间
                        eg_answer_id: null,        //问题的实例回答ID
                        eg_answer_time: null,      //问题的实例回答ID
                        eg_answer_content: null,   //问题的实例回答ID
                        eg_answer_user_id: null,   //问题的实例回答ID
                        eg_answer_user_name: null, //问题的实例回答ID
                    };

                    recommends.push(temp);
                }
                
            }else if(recommend.type === 3){
                if(recommend.article &&
                    recommend.article.article_id){

                    let temp = {
                        id : recommend.article.article_id._id,
                        type: recommend.type, //类型
                        title: recommend.article.article_id.title,          //问题或者资讯或者活动封面
                        describe: recommend.article.article_id.summary,       //描述
                        tags: null,             //问题标签
                        cover: recommend.article.article_id.cover,          //资讯或者活动封面
                        favour_count: recommend.article.article_id.favour_count,      //点赞数
                        attention_count: 0,   //关注数
                        comment_count: recommend.article.article_id.comment_count,   //关注数
                        collect_count: recommend.article.article_id.collect_count,     //收藏数 
                        answer_count: 0,      //回答数
                        create_time: recommend.article.article_id.create_time,    //创建时间
                        eg_answer_id: null,        //问题的实例回答ID
                        eg_answer_time: null,      //问题的实例回答ID
                        eg_answer_content: null,   //问题的实例回答ID
                        eg_answer_user_id: null,   //问题的实例回答ID
                        eg_answer_user_name: null, //问题的实例回答ID
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