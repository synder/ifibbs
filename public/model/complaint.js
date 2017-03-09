/**
 * @author synder on 2017/3/9
 * @copyright
 * @desc
 */


const async = require('async');
const ifibbs = require('../service/mongodb').ifibbs;
const elasticsearch = require('../service/elasticsearch').client;

const UserComplaint = ifibbs.model('UserComplaint');


exports.createNewComplaint = function (userID, type, reason, complaintID, callback) {
    
    let doc = {
        status          : UserComplaint.STATUS.UNPROCESSED,   //回答状态
        type            : type,   //回答状态
        reason          : reason,   //回答内容
        complaint_id    : complaintID,   //举报对象
        create_time     : new Date(),     //更新时间
        update_time     : new Date(),     //更新时间
        report_user_id  : userID,     //举报人
    };
    
    UserComplaint.create(doc, callback);
    
};
