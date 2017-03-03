/**
 * @author synder on 2017/3/3
 * @copyright
 * @desc 验证码
 */
const async = require('async');
const mongodb = require('../service/mongodb').db;
const sms = require('../service/sms').client;

const SecurityCode = mongodb.model('SecurityCode');

exports.sendSmsSecurityCode = function (phoneNumber, callback) {
    
};