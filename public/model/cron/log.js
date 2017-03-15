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

    let condition = {};

    callback();
};

exports.updateCronTaskLogs = function (name, logs, callback) {

    let condition = {};

    callback();
};