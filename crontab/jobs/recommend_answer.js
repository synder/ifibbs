/**
 * @author synder on 2017/3/15
 * @copyright
 * @desc 推荐问答或者文章给用户
 */

const cron = require('cron');
const schedule = require('../lib/schedule');
const config = global.config = require('../config');

const CONFIG = config.jobs.ifibbs.recommend_answer;

/***
 * @desc 推荐任务，推荐问答
 * */
const recommendQuestionAnswerJobs = new cron.CronJob(schedule(CONFIG), function (err) {
    if(err){
        console.error(err);
    }

});


recommendQuestionAnswerJobs.start();