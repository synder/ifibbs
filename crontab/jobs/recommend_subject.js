/**
 * @author synder on 2017/3/15
 * @copyright
 * @desc
 */


const async = require('async');
const cron = require('cron');

const schedule = require('../lib/schedule');
const config = global.config = require('../config');

const CONFIG = config.jobs.ifibbs.recommend_article;

const cronLogModel = require('../../public/model/cron/log');
const ifibbsRecommendModel = require('../../public/model/ifibbs/recommend');
const ifibbsSubjectModel = require('../../public/model/ifibbs/subject');

const JOB_NAME = 'recommend_subject';

/***
 * @desc 推荐任务，推荐问答
 * */
const recommendSubjectJobs = new cron.CronJob(schedule(CONFIG), function () {
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

    ifibbsSubjectModel.getFirstPageRecommendSubjects(function (err, subjects) {
        if(err){
            return saveLog(err);
        }

        if(!subjects){
            return saveLog(null);
        }

        async.eachLimit(subjects, 2, function(subject, cb){

            let order = subject.order || 10;

            ifibbsRecommendModel.createSubjectRecommend(null, subject._id, ~~order, cb);

        }, function(err, result){
            saveLog(err);
        });
    });

});


recommendSubjectJobs.start();