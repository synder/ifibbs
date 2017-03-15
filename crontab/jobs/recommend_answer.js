/**
 * @author synder on 2017/3/15
 * @copyright
 * @desc 推荐问答或者文章给用户
 */

const async = require('async');
const cron = require('cron');
const schedule = require('../lib/schedule');
const config = global.config = require('../config');

const CONFIG = config.jobs.ifibbs.recommend_answer;

const cronLogModel = require('../../public/model/cron/log');
const ifibbsRecommendModel = require('../../public/model/ifibbs/recommend');
const ifibbsAnswerModel = require('../../public/model/ifibbs/answer');

const JOB_NAME = 'recommend_question_answer';

/***
 * @desc 推荐任务，推荐问答
 * */
const recommendQuestionAnswerJobs = new cron.CronJob(schedule(CONFIG), function () {

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

    ifibbsAnswerModel.getFirstPageRecommendAnswers(function (err, answers) {
        if(err){
            return saveLog(err);
        }

        if(!answers){
            return saveLog(null);
        }

        async.eachLimit(answers, 2, function(answer, cb){

            let  order = 10;

            ifibbsRecommendModel.createAnswerRecommend(null, answer.question_id, answer._id, ~~order, cb);

        }, function(err, result){
            saveLog(err);
        });
    });

});


recommendQuestionAnswerJobs.start();