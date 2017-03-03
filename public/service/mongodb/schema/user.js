/**
 * @author synder
 * @date 16/1/10
 * @desc
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ThirdBindSchema = {
    uid      : {type: String, sparse: true, unique: true},
    union_id : {type: String, sparse: true, unique: true},
    name     : {type: String, trim: true}
};

const LoginSchema = {
    token      : {type: String, sparse: true, unique: true},
    expire     : {type: Date}
};

//用户===================================================
const UserSchema = new Schema({
    status       : {type: Number,  required: true},   //用户状态
    create_time  : {type: Date,    required: true},   //创建时间
    update_time  : {type: Date,    required: true},   //更新时间
    user_name    : {type: String,  required: false},   //用户名
    user_profile : {type: String,  required: false},   //用户简介
    user_avatar  : {type: String,  required: false,},  //用户头像
    user_password: {type: String,  required: false,},  //用户密码
    pass_salt_str: {type: String,  required: false,},  //密码盐
    user_gender  : {type: Boolean, required: false},  //用户性别
    user_mobile  : {type: String,  required: false},  //用户手机
    work_info    : {type: String,  required: false},  //用户性别
    edu_info     : {type: String,  required: false},  //用户性别
    bind_tencent_qq      : ThirdBindSchema,                  //qq绑定
    bind_tencent_wechat  : ThirdBindSchema,                  //微信绑定
    bind_sina_weibo      : ThirdBindSchema,                  //微博绑定
    login_token          : LoginSchema                       //登录信息
});

UserSchema.virtual('id').get(function () {
    return this._id.toString();
});


//账户状态
UserSchema.statics.STATUS = {
    LOCK : 0,   //账户被锁定
    NORMAL : 1  //账户正常
};

//用户性别
UserSchema.statics.GENDER = {
    MALE : true,
    FEMALE : false
};


exports.UserSchema = UserSchema;