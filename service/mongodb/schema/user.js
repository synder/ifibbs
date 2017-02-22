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

//用户===================================================
const UserSchema = new Schema({
    status       : {type: Number, required: true},   //用户状态
    user_name    : {type: String, required: true},   //用户名
    user_profile : {type: String, required: true},   //用户简介
    user_avatar  : {type: String, required: true,},   //用户头像
    create_time  : {type: Date, default: Date.now, required: true},     //创建时间
    update_time  : {type: Date, default: Date.now, required: true},     //更新时间
    user_gender  : {type: Boolean, required: false}, //用户性别
    user_mobile  : {type: String, required: false},  //用户手机
    work_info    : {type: String, required: false},  //用户性别
    edu_info     : {type: String, required: false},  //用户性别
    device_token : {type: String, required: false},  //设备Token
    bind_qq      : ThirdBindSchema,                         //qq绑定
    bind_wechat  : ThirdBindSchema,                         //微信绑定
    bind_weibo   : ThirdBindSchema,                         //微博绑定
    login_token         : {type: String, required: false},  //登录Token
    login_token_expire  : {type: Date, required: false},    //登录过期时间
}, {
    timestamps: {
        createdAt: 'create_time',
        updatedAt: 'update_time',
    }
});

UserSchema.virtual('id').get(function () {
    return this._id.toString();
});


//账户状态
UserSchema.statics.STATUS = {
    LOCK : 0,   //账户被锁定
    NORMAL : 1  //账户正常
};

exports.UserSchema = UserSchema;