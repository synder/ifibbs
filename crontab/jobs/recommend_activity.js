/**
 * @author synder on 2017/3/15
 * @copyright
 * @desc @desc 
 */


const async = require('async');
const cron = require('cron');
const schedule = require('../lib/schedule');
const config = global.config = require('../config');

const CONFIG = config.jobs.ifibbs.recommend_activity;

const CRON_NAME = 'recommend_activity';

const cronLogModel = require('../../public/model/cron/log');
const ifibbsRecommendModel = require('../../public/model/ifibbs/recommend');
const ifibbsActivityModel = require('../../public/model/ifibbs/activity');

const JOB_NAME = 'recommend_activity';

/***
 * @desc 推荐任务，推荐问答
 * */
const recommendActivityJobs = new cron.CronJob(schedule(CONFIG), function () {
    
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

    ifibbsActivityModel.getFirstPageRecommendActivity(function (err, activities) {
        if(err){
            return saveLog(err);
        }

        if(!activities){
            return saveLog(null);
        }

        async.eachLimit(activities, 2, function(activity, cb){

            let order = 10;

            ifibbsRecommendModel.createActivityRecommend(null, activity._id, ~~order, cb);

        }, function(err, result){
            saveLog(err);
        });
    });
});

recommendActivityJobs.start();