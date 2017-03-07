/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */

const async = require('async');
const crypto = require('crypto');

const mongodb = require('../service/mongodb').db;
const mysql = require('../service/mysql').db;
const redis = require('../service/redis').client;

const User = mongodb.model('User');

const _self = this;

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

    let condition = {
        user_mobile: {$exists: true, $eq: mobile},
    };

    User.findOne(condition, function (err, user) {
        if (user) {
            return callback(null, false)
        }
        User.create(userDoc, callback);
    });


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
 * @desc 根据用户手机和密码登录
 * */
exports.getUserByMobileAndPassword = function (phone, pass, callback) {

    let condition = {
        user_mobile: {$exists: true, $eq: phone}
    };

    User.findOne(condition, function (err, user) {
        if (err) {
            return callback(err);
        }

        if (!user) {
            return callback(null, null);
        }

        let salt = user.pass_salt_str;
        let realPassword = user.user_password;
        let enPassword = hashUserPassword(salt, pass);

        if (realPassword !== enPassword) {
            return callback(null, null);
        }

        callback(null, user);
    });
};

/*
 * @desc 第三方登录
 * */
exports.userLoginWithThirdPartyAccount = function (uid, socialType, name, union_id, callback) {
    let condition = {};
    let userDoc = {};
    let now = new Date();
    if(socialType == 1){
        condition ={
            bind_tencent_wechat: {$exists: true},
            'bind_tencent_wechat.uid': uid,
        };

        userDoc = {
            status: User.STATUS.NORMAL,
            user_name: '',
            user_profile: '',
            user_avatar: '',
            user_mobile: '',
            user_password: '',
            create_time: now,
            update_time: now,
            pass_salt_str: '',
            bind_tencent_wechat:{
                uid: uid,
                union_id: union_id,
                name: name,
            }
        };
    }

    if(socialType == 2){
        condition ={
            bind_tencent_qq: {$exists: true},
            'bind_tencent_qq.uid': uid,
        };

        userDoc = {
            status: User.STATUS.NORMAL,
            user_name: '',
            user_profile: '',
            user_avatar: '',
            user_mobile: '',
            user_password: '',
            create_time: now,
            update_time: now,
            pass_salt_str: '',
            bind_tencent_qq:{
                uid: uid,
                union_id: union_id,
                name: name,
            }
        };
    }

    if(socialType == 3){
        condition ={
            bind_sina_weibo: {$exists: true},
            'bind_sina_weibo.uid': uid,
        };

        userDoc = {
            status: User.STATUS.NORMAL,
            user_name: '',
            user_profile: '',
            user_avatar: '',
            user_mobile: '',
            user_password: '',
            create_time: now,
            update_time: now,
            pass_salt_str: '',
            bind_sina_weibo:{
                uid: uid,
                union_id: union_id,
                name: name,
            }
        };
    }
    User.findOne(condition, function (err, user) {
        if(err){
            return callback(err)
        }

        if(user){
           return callback(null, user, true)
        }

        User.create(userDoc, function (err, userInfo) {
            callback(null, userInfo, false)
        })
    })
};

/**
 * @desc 更新用户信息
 * */
exports.updateUserInfo = function (userID, userInfo, callback) {

    let condition = {
        _id: userID
    };

    let updateSets = {update_time: new Date()};

    if (userInfo.userName) {
        updateSets.user_name = userInfo.userName;
    }

    if (userInfo.userProfile) {
        updateSets.user_profile = userInfo.userProfile;
    }

    if (userInfo.userAvatar) {
        updateSets.user_avatar = userInfo.userAvatar;
    }

    if (userInfo.userGender) {
        //不能用'==='，传入sex可能为字符串;
        updateSets.user_gender = userInfo.userGender ? userInfo.userGender == 1 : null;
    }

    if (userInfo.userMobile) {
        updateSets.user_mobile = userInfo.userMobile;
    }

    if (userInfo.workInfo) {
        updateSets.work_info = userInfo.workInfo;
    }

    if (userInfo.eduInfo) {
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

    let session = {
        id: userID,
        token: token,
        expire: expire,
    };

    let sessionExpire = parseInt((expire - Date.now())/1000);

    redis.setex(token, sessionExpire, JSON.stringify(session), function (err, result) {
        if (err) {
            return callback(err)
        }

        User.findOne(condition, function (err, result) {
            if (err) {
                return callback(err);
            }

            result.update_time = new Date();
            result.login_token.token = token;
            result.login_token.expire = expire;

            result.save(function (err, doc) {
                callback(null, !!doc);
            })

        })
    });
};

/*
 * @desc 获取用户session信息
 * */
exports.getUserLoginToken = function (token, callback) {
    let sessionExpire = Date.now() + 1000 * 3600 * 24 * 30;

    redis.get(token, function (err, session) {
        if (err) {
            return callback(err)
        }

        if (session) {
            let session = JSON.parse(session);


            if (session.expire - Date.now() < 1000 * 3600 * 24 * 5) {
                _self.updateUserLoginToken(session.id, token, sessionExpire);
            }

            return callback(null, session)
        }

        let condition = {
            'login_token.token': token,
            'login_token.expire': {$gt: new Date()},
        };

        User.findOne(condition, function (err, doc) {
            if (err) {
                return callback(err)
            }

            if (doc) {
                let session = {
                    id: doc._id,
                    token: token,
                    expire: doc.login_token.expire,
                };

                if (new Date(session.expire).getTime() - Date.now() < 1000 * 3600 * 24 * 5) {
                    _self.updateUserLoginToken(session.id, token, sessionExpire);
                }

                return callback(null, session)
            }

            callback(null, null)
        })
    })
};

/**
 * @desc 更新用户密码(修改)
 * */
exports.updateUserPasswordWithOldPassword = function (userID, oldPassword, newPassword, callback) {
    let condition = {
        _id: userID
    };

    User.findOne(condition, function (err, user) {
        if (err) {
            return callback(err);
        }

        if (!user) {
            return callback(null, false);
        }

        let salt = user.pass_salt_str;

        let dbMd5Pass = hashUserPassword(salt, user.user_password);
        let oldMd5Pass = hashUserPassword(salt, oldPassword);

        if (dbMd5Pass !== oldMd5Pass) {
            return callback(null, false);
        }

        user.user_password = hashUserPassword(salt, newPassword);

        user.save(function (err, result) {
            if (err) {
                return callback(err);
            }

            callback(null, !!result)
        });
    });
};


/**
 * @desc 更新用户的密码（找回）
 * */
exports.updateUserPasswordWithMobile = function (phone, newPassword, callback) {
    let condition = {
        user_mobile: {$exists: true, $eq: phone}
    };

    User.findOne(condition, function (err, user) {
        if (err) {
            return callback(err);
        }

        if (!user) {
            return callback(null, false);
        }

        let salt = user.pass_salt_str;

        user.user_password = hashUserPassword(salt, newPassword);

        user.save(function (err, result) {
            if (err) {
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
exports.updateUserTencentWechat = function (userID) {

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