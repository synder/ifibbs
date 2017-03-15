/**
 * @author synder on 2017/3/15
 * @copyright
 * @desc
 */


const path = require('path');
const async = require('async');

const cronMongodb = require('../../service/mongodb/cron');

const cronMongodbClient = cronMongodb.client;

const CronTaskLog = cronMongodbClient.model('CronTaskLog');

exports.createCronTaskLogs = function (name, logs, callback) {
    let doc = {
        start_at        : logs.startTime,   //启动时间
        stop_at         : logs.endTime,   //停止时间
        job_name        : name,  //job名称
        run_error       : logs.error
    };
    
    CronTaskLog.create(doc, callback);
};