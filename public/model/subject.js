/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */


const async = require('async');
const mongodb = require('../service/mongodb').db;
const elasticsearch = require('../service/elasticsearch').client;

const Subject = mongodb.model('Subject');

/**
 * @desc 获取专题列表
 * */
exports.getSubjectList = function (callback) {
    
    let conditoin = {
        status: Subject.STATUS.ENABLE
    };
    
    async.parallel({
        count: function (cb) {
            Subject.count(conditoin, cb);
        },
        
        subjects: function (cb) {
            Subject.find(conditoin)
                .sort('-display_order -create_time')
                .exec(cb);
        }
    }, callback);
};


/**
 * @desc 获取专题详情
 * */
exports.getSubjectDetail = function (subjectID, callback) {
    
    let condition = {
        _id: subjectID,
        status: Subject.STATUS.ENABLE
    };
    
    Subject.findOne(condition, callback);
};