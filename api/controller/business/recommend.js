/**
 * @author synder on 2017/3/2
 * @copyright
 * @desc
 */


const async = require('async');
const url = require('url');

const config = global.config.hosts;

//文章详情H5页面
const ARTICLE_H5_PAGE_NAME = 'article.html';

if(!(config && config.h5)){
    throw new Error('please provide h5 host config');
}

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
                
                if(recommend.question && recommend.answer && recommend.user){

                    let temp = {
                        id : recommend.question._id,
                        type: recommend.type,
                        title: recommend.question.title,
                        tags: recommend.question.tags || [],
                        cover: null,
                        favour_count: recommend.question.favour_count,
                        attention_count: recommend.question.attention_count,
                        collect_count: recommend.question.collect_count,
                        answer_count: recommend.question.answer_count,
                        comment_count: 0,
                        create_time: recommend.question.create_time,
                        eg_answer_id: recommend.answer._id,
                        eg_answer_time: recommend.answer.create_time,
                        eg_answer_content: recommend.answer.content,
                        eg_answer_user_id: recommend.user._id,
                        eg_answer_user_name: recommend.user.user_name,
                    };
                    
                    recommends.push(temp);
                }
            }else if(recommend.type === 2){

                if(recommend.activity){

                    let temp = {
                        id : recommend.activity._id,
                        type: recommend.type,
                        title: recommend.activity.title,
                        tags: null,
                        cover: recommend.activity.cover,
                        favour_count: recommend.activity.favour_count,
                        attention_count: 0,
                        comment_count: recommend.activity.comment_count,
                        collect_count: recommend.activity.collect_count, 
                        answer_count: 0,
                        create_time: recommend.activity.create_time,
                        url: recommend.activity.url,
                        eg_answer_id: null,
                        eg_answer_time: null,
                        eg_answer_content: null,
                        eg_answer_user_id: null,
                        eg_answer_user_name: null,
                    };

                    recommends.push(temp);
                }
                
            }else if(recommend.type === 3){
                if(recommend.article){
                    
                    let articleUrl = url.format({
                        protocol : config.h5.protocol,
                        hostname: config.h5.host,
                        port : config.h5.port,
                        pathname : ARTICLE_H5_PAGE_NAME,
                        query : {
                            article_id: recommend.article._id
                        }
                    });

                    let temp = {
                        id : recommend.article._id,
                        type: recommend.type,
                        title: recommend.article.title,
                        tags: null,
                        cover: recommend.article.cover,
                        favour_count: recommend.article.favour_count,
                        attention_count: 0,
                        comment_count: recommend.article.comment_count,
                        collect_count: recommend.article.collect_count,
                        answer_count: 0,
                        create_time: recommend.article.create_time,
                        url: articleUrl,
                        eg_answer_id: null,
                        eg_answer_time: null,
                        eg_answer_content: null,
                        eg_answer_user_id: null,
                        eg_answer_user_name: null,
                    };

                    recommends.push(temp);
                }
            }else if(recommend.type === 4){
                if(recommend.subject){

                    let temp = {
                        id : recommend.subject._id,
                        type: recommend.type,
                        title: recommend.subject.title,
                        tags: null,
                        cover: recommend.subject.cover,
                        favour_count: 0,
                        attention_count: 0,
                        comment_count: 0,
                        collect_count: 0,
                        answer_count: 0,
                        create_time: recommend.subject.create_time,
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