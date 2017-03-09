/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */


const async = require('async');
const ifibbs = require('../service/mongodb').ifibbs;
const elasticsearch = require('../service/elasticsearch').client;

const Subject = ifibbs.model('Subject');

/**
 * @desc 获取专题列表
 * */
exports.getSubjectList = function (callback) {
    
    let condition = {
        status: Subject.STATUS.ENABLE
    };
    
    async.parallel({
        count: function (cb) {
            Subject.count(condition, cb);
        },
        
        subjects: function (cb) {
            Subject.find(condition)
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