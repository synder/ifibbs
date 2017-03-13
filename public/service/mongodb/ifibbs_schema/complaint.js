/**
 * @author synder on 2017/3/9
 * @copyright
 * @desc
 */


const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

//用户举报===================================================
const UserComplaintSchema = new Schema({
    status          : {type: Number, required: true},   //回答状态
    type            : {type: Number, required: true},   //回答状态
    reason          : {type: String, required: true},   //回答内容
    complaint_id    : {type: ObjectId, required: true},   //举报对象
    create_time     : {type: Date,   required: true},     //更新时间
    update_time     : {type: Date,   required: true},     //更新时间
    report_user_id  : {type: ObjectId, required: true, ref: 'User'},     //举报人
});

UserComplaintSchema.virtual('id', function () {
    return this._id.toString();
});

UserComplaintSchema.index({create_time : 1});
UserComplaintSchema.index({status : 1});

UserComplaintSchema.statics.STATUS = {
    UNPROCESSED : 0,
    PROCESSING : 1,
    PROCESSED: 2,
};

UserComplaintSchema.statics.TYPE = {
    QUESTION : 1, //举报问题
    ANSWER : 2,   //举报回答
    COMMENT: 3,   //举报评论
    USER: 4,      //举报用户
};

exports.UserComplaintSchema = UserComplaintSchema;