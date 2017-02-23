/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

//问题===================================================
const QuestionSchema = new Schema({
    status     : {type: Number, required: true},   //状态
    tags       : {type: Array, required: false},    //标签
    title      : {type: String, required: true},   //问题
    describe   : {type: String, required: true},   //问题描述
    answer_count    : {type: Number, required: true},  //回答数量
    favour_count    : {type: Number, required: true},  //点赞数量
    attention_count : {type: Number, required: true},  //关注数量
    collect_count   : {type: Number, required: true},  //收藏数量
    create_time     : {type: Date,   required: true},    //创建时间
    update_time     : {type: Date,   required: true},    //更新时间
    create_user_id  : {type: ObjectId, required: true, ref: 'User'} //发表用户
});


QuestionSchema.virtual('id').get(function () {
    return this._id.toString();
});

QuestionSchema.index({create_time : 1});

//账户状态
QuestionSchema.statics.STATUS = {
    LOCK : -1,
    REMOVED: 0,
    NORMAL : 1
};

exports.QuestionSchema = QuestionSchema;
