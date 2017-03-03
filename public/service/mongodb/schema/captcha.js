/**
 * Created by qingpingli on 2017/3/2.
 */


const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;



//用户===================================================
const CodeSchema = new Schema({
    status       : {type: Number,  required: true},   //验证码状态
    mobile       : {type: String,  required: true},   //手机号码
    code         : {type: String,  required: true},   //验证码
    use_count    : {type: Number,  required: true},   //已验证次数
    success_count: {type: Number,  required: true},   //成功验证次数
    create_time  : {type: Date,    required: true},   //创建时间
    expire_time  : {type: Date,    required: true},   //过期时间
    type         : {type: Number,  required: true},   //验证码用途
});

CodeSchema.virtual('id').get(function () {
    return this._id.toString();
});


//验证码状态
CodeSchema.statics.STATUS = {
    OVERDUE : 0,   //不可使用
    NORMAL : 1  //正常
};

//验证码用途
CodeSchema.statics.TYPE = {
    LOGIN : 1,
    REGISTER : 2,
    FORGET : 3,
};

exports.CodeSchema = CodeSchema;