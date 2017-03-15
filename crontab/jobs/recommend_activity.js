/**
 * @author synder on 2017/3/15
 * @copyright
 * @desc @desc 
 */


const cron = require('cron');
const schedule = require('../lib/schedule');
const config = global.config = require('../config');

const CONFIG = config.jobs.ifibbs.recommend_activity;

/***
 * @desc 推荐任务，推荐问答
 * */
const recommendActivityJobs = new cron.CronJob(schedule(CONFIG), function () {
    
});


recommendActivityJobs.start();