/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc 用户通知
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

//用户===================================================
const UserNotificationSchema = new Schema({
    status      : {type: Boolean, required: true}, //通知状态
    category    : {type: Number, required: true},  //通知类别
    type        : {type: Number, required: true},  //通知类型
    title       : {type: String, required: true},  //通知标题
    content     : {type: String, required: true},  //通知内容
    user_id     : {type: ObjectId, required: true},//用户ID
    create_time : {type: Date, required: true},    //创建时间
    update_time : {type: Date, required: true},    //更新时间
});

UserNotificationSchema.virtual('id', function () {
    return this._id.toString();
});

UserNotificationSchema.index({user_id : 1, target_id: 1});

UserNotificationSchema.pre('validate', function (next) {
    if(!this.create_time){
        this.create_time = new Date();
    }

    if(!this.update_time){
        this.update_time = new Date();
    }

    next();
});

//通知状态
UserNotificationSchema.statics.STATUS = {
    UNREAD : 1,     //未读
    READED : 2,     //已读
    DELETE : 0,     //删除
};

//业务类型
UserNotificationSchema.statics.CATEGORY = {
    SYSTEM   : 1,   //系统通知
    BUSINESS : 2,   //业务通知
};

//通知分类
UserNotificationSchema.statics.TYPE = {
    PROMOTIONAL_ACTIVITY        : 1,    //活动通知
    PUBLISH_QUESTION            : 2,    //发布了问题
    QUESTION_STICKIED_BY_ADMIN  : 3,    //问题被管理员加精
    QUESTION_DELETED_BY_ADMIN   : 4,    //问题被管理员删除
    QUESTION_BEEN_ANSWER        : 11,   //问题被回答
    QUESTION_BEEN_FAVOUR        : 12,   //问题被赞
    QUESTION_BEEN_COLLECTED     : 13,   //问题被收藏
    QUESTION_BEEN_SHARED        : 14,   //问题被分享
};

exports.UserNotificationSchema = UserNotificationSchema;