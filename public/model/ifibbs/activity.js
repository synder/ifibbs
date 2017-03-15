/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */


const async = require('async');
const ifibbsMongodb = require('../../service/mongodb/ifibbs').client;
const ifibbsElastic = require('../../service/elasticsearch/ifibbs').client;

const Activity = ifibbsMongodb.model('Activity');

/**
 * @desc 获取首页推荐的活动
 * */
exports.getFirstPageRecommendActivity = function (callback) {
    
    
    let end = new Date();
    let temp = new Date();
    let start = temp.setHours(temp.getHours() - 1);
    
    let condition = {
        recommend: true,
        status: Activity.STATUS.DISPLAY,
        update_time : { $gt: start, $lt: end}
    };
    
    Activity.find(condition, callback);
};
