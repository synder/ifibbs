/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc 用户浏览历史记录
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

//用户===================================================
const UserHistorySchema = new Schema({
    status    : {type: Number, required: true},    //历史状态
    type      : {type: Number, required: true},    //历史类型
    create_time : {type: Date, default: Date.now},    //创建时间
    update_time : {type: Date, default: Date.now},    //更新时间
    user_id   : {type: ObjectId, required: true, ref: 'User'},         //浏览用户ID
    question_id : {type: ObjectId, required: false, ref: 'Question'},  //浏览问题ID
    article_id : {type: ObjectId, required: false, ref: 'Article'},    //浏览文章ID
});

UserHistorySchema.virtual('id', function () {
    return this._id.toString();
});

UserHistorySchema.index({user_id : 1});
UserHistorySchema.index({create_time : 1});


//点赞状态
UserHistorySchema.statics.STATUS = {
    NORMAL : 1,     //正常
    DELETED : 0     //删除
};

UserHistorySchema.statics.TYPE = {
    QUESTION : 1,  //浏览问题
    ARTICLE  : 2,  //浏览资讯
};

exports.UserHistorySchema = UserHistorySchema;
