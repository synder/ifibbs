/**
 * @author synder on 2017/3/4
 * @copyright
 * @desc
 */

const async = require('async');
const mongodb = require('../service/mongodb').db;

const UserDynamic = mongodb.model('UserDynamic');


/**
 * @desc 获取用户动态列表
 * */
exports.getUserDynamicList = function (userID, pageSkip, pageSize) {
    
    let condition = {
        
    };
    
};