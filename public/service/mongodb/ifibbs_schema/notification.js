/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc 用户通知，该系统在未来会被迁出，作为独立的系统
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

//用户===================================================
const UserNotificationSchema = new Schema({
    status       : {type: Number, required: true},      //通知状态
    category     : {type: Number, required: true},      //通知类别
    type         : {type: Number, required: true},      //通知类型
    push_title        : {type: String, required: true},      //通知标题
    notify_content    : {type: String, required: false},      //通知内容
    push_content      : {type: String, required: true},      //通知内容
    push_content_id   : {type: String, required: false},     //通知内容ID
    push_client_id    : {type: String, required: false},     //客户端ID，详见个推文档
    push_task_id      : {type: String, required: false},     //任务ID，详见个推文档
    push_time         : {type: Date,     required: false},   //推送时间
    create_time       : {type: Date,     required: true},    //创建时间
    update_time       : {type: Date,     required: true},    //更新时间
    user_id           : {type: ObjectId, required: true, ref: 'User'},    //用户ID
});

UserNotificationSchema.virtual('id', function () {
    return this._id.toString();
});

UserNotificationSchema.index({user_id : 1, create_time: 1});


//通知状态
UserNotificationSchema.statics.STATUS = {
    DELETED : 0,     //删除
    UNREAD : 1,      //未读
    READ : 2,        //已读
};

//业务类型
UserNotificationSchema.statics.CATEGORY = {
    SYSTEM   : 0,   //系统通知
    BUSINESS : 1,   //业务通知
};

//通知分类
UserNotificationSchema.statics.TYPE = {
    SYSTEM_NOTIFICATION              : 101,    //系统通知
    SYSTEM_ACTIVITY                  : 102,    //系统活动通知
    
    USER_PUBLISH_QUESTION            : 200,    //用户发布了问题
    
    USER_QUESTION_BEEN_STICKIED      : 201,    //用户发布的问题被管理员加精
    USER_QUESTION_BEEN_DELETED       : 202,    //用户发布的问题被管理员删除
    USER_QUESTION_BEEN_ATTENTION     : 203,    //用户发布的问题被关注
    USER_QUESTION_BEEN_ANSWERED      : 204,    //用户发布的问题被回答
    USER_QUESTION_BEEN_COLLECTED     : 205,    //用户发布的问题被收藏
    USER_QUESTION_BEEN_SHARED        : 206,    //用户发布的问题被分享
    
    USER_ANSWER_BEEN_FAVOURED        : 300,    //用户发表的回答被赞
    USER_ANSWER_BEEN_COMMEND         : 301,    //用户发表的回答被评论
    
    ATTENTION_USER_PUBLISH_NEW_QUESTION: 400,  //关注的用户发布了新的问题
    ATTENTION_QUESTION_BEEN_ANSWER: 401,       //关注的问题有了新的回答
    ATTENTION_SUBJECT_HAS_NEW_ARTICLE: 402,    //关注的专题有了新的文章
    
    USER_BEEN_ATTENTION: 500                   //用户被关注
};

exports.UserNotificationSchema = UserNotificationSchema;