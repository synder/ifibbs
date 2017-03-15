/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */


const async = require('async');
const ifibbsMongodb = require('../../service/mongodb/ifibbs').client;
const ifibbsElasticsearch = require('../../service/elasticsearch/ifibbs').client;

const Subject = ifibbsMongodb.model('Subject');

/**
 * @desc 获取首页推荐文章列表
 * */
exports.getFirstPageRecommendSubjects = function (callback) {

    let end = new Date();
    let temp = new Date();
    let start = temp.setHours(temp.getHours() - 1);

    let condition = {
        recommend: true,
        status: Subject.STATUS.ENABLE,
        update_time : { $gt: start, $lt: end}
    };

    Subject.find(condition, callback);
};


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