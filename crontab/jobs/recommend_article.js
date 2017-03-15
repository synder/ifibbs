/**
 * @author synder on 2017/3/15
 * @copyright
 * @desc
 */


const cron = require('cron');

const schedule = require('../lib/schedule');
const config = global.config = require('../config');

const CONFIG = config.jobs.ifibbs.recommend_article;

const cronLogModel = require('../../public/model/cron/log');
const ifibbsRecommendModel = require('../../public/model/ifibbs/recommend');

/***
 * @desc 推荐任务，推荐问答
 * */
const recommendArticleJobs = new cron.CronJob(schedule(CONFIG), function () {


});


recommendArticleJobs.start();