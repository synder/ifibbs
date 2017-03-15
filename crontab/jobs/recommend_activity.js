/**
 * @author synder on 2017/3/15
 * @copyright
 * @desc @desc 
 */


const cron = require('cron');
const schedule = require('../lib/schedule');
const config = global.config = require('../config');

const CONFIG = config.jobs.ifibbs.recommend_activity;

const CRON_NAME = 'recommend_activity';

const cronLogModel = require('../../public/model/cron/log');
const ifibbsRecommendModel = require('../../public/model/ifibbs/recommend');

/***
 * @desc 推荐任务，推荐问答
 * */
const recommendActivityJobs = new cron.CronJob(schedule(CONFIG), function () {
    
    let startTime = new Date();
    
    
    
});


recommendActivityJobs.start();