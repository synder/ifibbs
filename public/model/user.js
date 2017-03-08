/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */

const async = require('async');
const crypto = require('crypto');

const mongo = require('../service/mongodb');
const mongodb = mongo.db;
const mysql = require('../service/mysql').db;
const redis = require('../service/redis').client;

const User = mongodb.model('User');
const AttentionUser = mongodb.model('AttentionUser');
const QuestionAnswer = mongodb.model('QuestionAnswer');
const AnswerComment = mongodb.model('AnswerComment');

const self = this;

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
        user_mobile: {
            $exists: true, 
            $eq: phone
        }
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
 * @desc QQ第三方登录
 * */
exports.userLoginWithQQAccount = function (uid, socialType, name, union_id, callback) {
    let now = new Date();
    let condition ={
        bind_tencent_qq: {$exists: true},
        'bind_tencent_qq.uid': uid,
    };

    let userDoc = {
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
    User.findOne(condition, function (err, user) {
        if(err){
            return callback(err)
        }

        if(user){
           return callback(null, user)
        }

        User.create(userDoc, callback)
    })
};

/*
 * @desc wechat第三方登录
 * */
exports.userLoginWithWechatAccount = function (uid, socialType, name, union_id, callback) {
    let now = new Date();

    let condition ={
        bind_tencent_wechat: {$exists: true},
        'bind_tencent_wechat.uid': uid,
    };

    let userDoc = {
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
    User.findOne(condition, function (err, user) {
        if(err){
            return callback(err)
        }

        if(user){
           return callback(null, user)
        }

        User.create(userDoc, callback)
    })
};

/*
 * @desc weibo第三方登录
 * */
exports.userLoginWithWeiBoAccount = function (uid, socialType, name, union_id, callback) {
    let now = new Date();
    let condition ={
        bind_sina_weibo: {$exists: true},
        'bind_sina_weibo.uid': uid,
    };

    let userDoc = {
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
    User.findOne(condition, function (err, user) {
        if(err){
            return callback(err)
        }

        if(user){
            return callback(null, user)
        }

        User.create(userDoc, callback)
    })
};
/**
 * @desc 更新用户信息
 * */
exports.updateUserInfo = function (userID, userInfo, callback) {

    let condition = {
        _id: userID
    };

    let updateSets = {
        update_time: new Date()
    };

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
        updateSets.user_gender = userInfo.userGender;
    }

    if (userInfo.userMobile) {
        updateSets.user_mobile = userInfo.userMobile;
    }

    if (userInfo.workInfo) {
        updateSets.work_info = userInfo.workInfo;
    }

    if (userInfo.province) {
        updateSets.user_province = userInfo.province;
    }

    if (userInfo.city) {
        updateSets.user_city = userInfo.city;
    }

    if (userInfo.area) {
        updateSets.user_area = userInfo.area;
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
                self.updateUserLoginToken(session.id, token, sessionExpire);
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
                    self.updateUserLoginToken(session.id, token, sessionExpire);
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


//用户统计信息================================================================
/**
 * @desc 获取用户关注的用户数
 * */
exports.getUserAttentionOtherUserCount = function (userID, callback) {
    let condition = {
        user_id: userID,
        status: AttentionUser.STATUS.ATTENTION
    };
    
    AttentionUser.count(condition, callback);
};

/**
 * @desc 获取用户被关注数
 * */
exports.getUserBeenAttentionUserCount = function (userID, callback) {
    let condition = {
        to_user_id: userID,
        status: AttentionUser.STATUS.ATTENTION
    };

    AttentionUser.count(condition, callback);
};

/**
 * @desc 获取用户被点赞次数
 * */
exports.getUserBeenFavouredCount = function (userID, callback) {
    //统计回答收到的赞 + 评论收到的赞
    async.parallel({
        answerBeenFavouredCount: function(cb) {
            
            QuestionAnswer.aggregate()
                .match({ create_user_id: mongo.ObjectId(userID)})
                .project({favour: '$favour_count'})
                .group({
                    _id: null,
                    count: { $sum: "$favour" }
                })
                .exec(cb);
        },
        
        commentBeenFavouredCount: function(cb) {

            AnswerComment.aggregate()
                .match({ create_user_id: mongo.ObjectId(userID)})
                .project({favour: '$favour_count'})
                .group({
                    _id: null,
                    count: { $sum: "$favour" }
                })
                .exec(cb);
        },
    }, function (err, results) {
    
        if(err){
             return callback(err);
        }
        
        let answerBeenFavouredCount = results.answerBeenFavouredCount[0] ? (results.answerBeenFavouredCount[0].count || 0) : 0;
        let commentBeenFavouredCount = results.commentBeenFavouredCount[0] ? (results.commentBeenFavouredCount[0].count || 0) : 0;
        
        let total = answerBeenFavouredCount + commentBeenFavouredCount;
        
        callback(null, total);
        
    });
    
};
