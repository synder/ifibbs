/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */

const async = require('async');
const crypto = require('crypto');

const mongodb = require('../service/mongodb').db;
const mysql = require('../service/mysql').db;

const User = mongodb.model('User');

/**
 * @desc 密码加密
 * */
const hashUserPassword = function (salt, password) {
    salt = salt.trim();
    password = password.trim();
    return crypto.createHash('md5').update(`${salt}&${password}`).digest('hex');
};

/**
 * @desc 创建新的用户
 * */
exports.createNewUser = function (mobile, password, callback) {

    let salt = Math.random().toString();
    let now = new Date();

    let userDoc = {
        status: User.STATUS.NORMAL,
        user_name: '',
        user_profile: '',
        user_avatar: '',
        user_mobile: mobile,
        user_password: hashUserPassword(salt, password),
        create_time: now,
        update_time: now,
        pass_salt_str: salt,
    };

    User.create(userDoc, callback);
};

/**
 * @desc 获取用户信息
 * */
exports.getUserInfoByID = function (userID, callback) {
    let condition = {
        status: User.STATUS.NORMAL,
        id: userID,
    };

    User.findOne(condition, callback)
};

/**
 * @desc 根据手机号获取
 * */
exports.getUserByMobile = function (phone, callback) {

    let condition = {
        user_mobile: {$exists: true, $eq: phone}
    };

    User.findOne(condition, callback);
};


/**
 * @desc 根据用户手机和密码查找用户
 * */
exports.getUserByMobileAndPassword = function (phone, pass, callback) {
    
    let condition = {
        user_mobile: {$exists: true, $eq: phone}
    };
    
    User.findOne(condition, function (err, user) {
        if(err){
            return callback(err);
        }
        
        if(!user){
            return callback(null, null);
        }
        
        let salt = user.pass_salt_str;
        let realPassword = user.user_password;
        let enPassword = hashUserPassword(salt, pass);
        
        if(realPassword !== enPassword){
            return callback(null, null);
        }
        
        callback(null, user);
    });
};

/**
 * @desc 更新用户信息
 * */
exports.updateUserInfo = function (userID, userInfo, callback) {
    
    let condition = {
        _id: userID
    };
    
    let updateSets = {update_time: new Date()};
    
    if(userInfo.userName){
        updateSets.user_name = userInfo.userName;
    }

    if(userInfo.userProfile){
        updateSets.user_profile = userInfo.userProfile;
    }

    if(userInfo.userAvatar){
        updateSets.user_avatar = userInfo.userAvatar;
    }

    if(userInfo.userGender){
        //不能用'==='，传入sex可能为字符串;
        updateSets.user_gender = userInfo.userGender ? userInfo.userGender == 1 : null;
    }

    if(userInfo.userMobile){
        updateSets.user_mobile = userInfo.userMobile;
    }

    if(userInfo.workInfo){
        updateSets.work_info = userInfo.workInfo;
    }

    if(userInfo.eduInfo){
        updateSets.edu_info = userInfo.eduInfo;
    }

    let update = {
        $set: updateSets
    };

    User.update(condition, update, function (err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result.nModified === 1);
    })
};


/**
 * @desc 更新用户的登录token信息
 * */
exports.updateUserLoginToken = function (userID, token, expire, callback) {
    
    let condition = {
        _id: userID
    };

    let update = {
        $set: {
            update_time: new Date(),
            'login_token.token': token,
            'login_token.expire': expire,
        }
    };

    User.update(condition, update, function (err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result.nModified === 1);
    })
};

/**
 * @desc 更新用户密码
 * */
exports.updateUserPasswordWithOldPassword = function (userID, oldPassword, newPassword, callback) {
    let condition = {
        _id: userID
    };
    
    User.findOne(condition, function (err, user) {
        if(err){
            return callback(err);
        }
        
        if(!user){
            return callback(null, false);
        }
        
        let salt = user.pass_salt_str;
        
        let dbMd5Pass = hashUserPassword(salt, user.user_password);
        let oldMd5Pass = hashUserPassword(salt, oldPassword);
        
        if(dbMd5Pass !== oldMd5Pass){
            return callback(null, false);
        }

        user.user_password = hashUserPassword(salt, newPassword);

        user.save(function (err, result) {
            if(err){
                return callback(err);
            }

            callback(null, !!result)
        });
    });
};


/**
 * @desc 更新用户的密码
 * */
exports.updateUserPasswordWithMobile = function (phone, newPassword, callback) {
    let condition = {
        user_mobile: {$exists:true, $eq: phone}
    };

    User.findOne(condition, function (err, user) {
        if(err){
            return callback(err);
        }

        if(!user){
            return callback(null, false);
        }

        let salt = user.pass_salt_str;

        user.user_password = hashUserPassword(salt, newPassword);

        user.save(function (err, result) {
            if(err){
                return callback(err);
            }

            callback(null, !!result)
        });
    });
};



/**
 * @desc 绑定手机号
 * */
exports.updateUserPhone = function (userID, phone) {
    
};


/**
 * @desc 绑定微信
 * */
exports.updateUserTencentWechat= function (userID) {
    
};


/**
 * @desc 绑定QQ
 * */
exports.updateUserTencentQQ = function (userID) {

};


/**
 * @desc 绑定新浪微博
 * */
exports.updateUserSinaWeibo = function (userID) {

};