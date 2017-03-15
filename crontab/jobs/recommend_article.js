/**
 * @author synder on 2017/3/15
 * @copyright
 * @desc
 */


const cron = require('cron');
const async = require('async');

const schedule = require('../lib/schedule');
const config = global.config = require('../config');

const CONFIG = config.jobs.ifibbs.recommend_article;

const cronLogModel = require('../../public/model/cron/log');
const ifibbsRecommendModel = require('../../public/model/ifibbs/recommend');
const ifibbsArticleModel = require('../../public/model/ifibbs/article');

const JOB_NAME = 'recommend_article';

/***
 * @desc 推荐任务，推荐问答
 * */
const recommendArticleJobs = new cron.CronJob(schedule(CONFIG), function () {
    
    let start = new Date();
    
    let saveLog = function (err) {
        cronLogModel.createCronTaskLogs(JOB_NAME, {
            startTime: start,
            endTime: new Date(),
            error: err
        }, function (err) {
            if(err){
                console.error(err.stack);
            }
        });
    };

    ifibbsArticleModel.getFirstPageRecommendArticles(function (err, articles) {
        if(err){
            return saveLog(err);
        }
        
        if(!articles){
            return saveLog(null);
        }

        async.eachLimit(articles, 2, function(article, cb){
            
            let order = article.order || 10;
            
            if(article.top === true){
                order = order * 10;
            }

            ifibbsRecommendModel.createArticleRecommend(null, article._id, ~~order, cb);
            
        }, function(err, result){
            saveLog(err);
        }); 
    });

});


recommendArticleJobs.start();