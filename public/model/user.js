/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */

const async = require('async');
const crypto = require('crypto');
const UUID = require('uuid/v4');

const mongodb = require('../service/mongodb').db;


const User = mongodb.model('User');

/**
 * @desc 获取用户信息
 * */
exports.getUserInfo = function (userID, callback) {
    let condition = {
        status: User.STATUS.NORMAL,
        id: userID,
    };

    User.findOne(condition, callback)
};

/**
 * @desc 更新用户信息
 * */
exports.updateUserInfo = function (userID, userInfo, callback) {
    let condition = {
        id: userID
    };

    let sex = userInfo.sex ? userInfo.sex == 1 : null;  //不能用'==='，传入sex不能为字符串
    let now = new Date();

    let update = {
        $set: {
            user_name: userInfo.username,
            user_profile: userInfo.signature,
            user_avatar: userInfo.headPic,
            user_gender: sex,
            user_mobile: userInfo.user_mobile ? userInfo.user_mobile : null,
            work_info: userInfo.work_info ? userInfo.work_info : null,
            edu_info: userInfo.edu_info ? userInfo.edu_info : null,
            update_time: now,
        }
    };

    User.update(condition, update, function (err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, true);
    })
};


/**
 * @desc 更新用户的登录token信息
 * */
exports.updateUserLoginToken = function (userID, token, callback) {
    let condition = {
        id: userID
    };

    let now = new Date();

    let update = {
        $set: {
            login_token: token,
            update_time: now,
        }
    };

    User.update(condition, update, function (err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, true);
    })
};

/**
 * @desc 验证手机号是否使用
 * */
exports.verifyPhoneHasRegistered = function (phoneNumber, callback) {
    let condition = {
        user_mobile: phoneNumber
    };


    User.findOne(condition, function (err, result) {
        if (err) {
            return callbackhasRegistered(err);
        }
        let hasRegistered = result.length > 0;

        callback(null, hasRegistered) //todo 如果没有使用应该调取发送验证码接口
    })
};

/**
 * @desc 用户注册
 * */
exports.userRegisterWithPhone = function (userInfo, callback) {
    let mobile = userInfo.user_mobile;
    let code = userInfo.code;
    let password = userInfo.user_password;
    let verification = Math.random();
    let now = new Date();
    let uuid = UUID();
    //首先校验手机和验证码

    let md5 = crypto.createHash('md5');

    let condition = {
        status: User.STATUS.NORMAL,
        user_name: ' ',
        user_profile: ' ',
        user_avatar: ' ',
        user_mobile: mobile,
        user_password: md5.update(`${verification}${password}`).digest('hex'),
        create_time: now,
        update_time: now,
        verification: verification,
        login_token: uuid,
    };

    User.create(condition, function (err, result) {
        if (err) {
            return callback(err)
        }

        let session = {
            userId: result._id,
            sessionID: uuid,
        };

        callback(null, session)
    });
};

/*
 * @desc 用户登录
 * */