/**
 * Created by qingpingli on 2017/3/2.
 */


const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;



//用户===================================================
const SecurityCodeSchema = new Schema({
    uid          : {type: String,  required: true},   //验证码状态
    status       : {type: Number,  required: true},   //验证码状态
    mobile       : {type: String,  required: true},   //手机号码
    code         : {type: String,  required: true},   //验证码
    use_count    : {type: Number,  required: true},   //已验证次数
    expire_time  : {type: Date,    required: true},   //过期时间
    create_time  : {type: Date,    required: true},   //创建时间
    update_time  : {type: Date,    required: true},   //更新次数
    server_res   : {type: String,  required: false},  //服务器返回
});

SecurityCodeSchema.virtual('id').get(function () {
    return this._id.toString();
});


SecurityCodeSchema.index({uid: 1, mobile: 1, code:1});


//验证码状态
SecurityCodeSchema.statics.STATUS = {
    DISABLED : 0,   //不可用
    ENABLE : 1      //可用
};

exports.SecurityCodeSchema = SecurityCodeSchema;