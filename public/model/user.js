/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */

const async = require('async');
const crypto = require('crypto');

const mongodb = require('../service/mongodb');
const ifibbs = mongodb.ifibbs;
const redis = require('../service/redis').client;

const User = ifibbs.model('User');
const AttentionUser = ifibbs.model('AttentionUser');
const QuestionAnswer = ifibbs.model('QuestionAnswer');
const AnswerComment = ifibbs.model('AnswerComment');

const self = this;

/**
 * @desc 密码加密
 * */
const hashUserPassword = function (salt, password) {
    salt = salt.trim();
    password = password.trim();
    return crypto.createHash('md5').update(`${salt}&${password}`).digest('hex');
};

const genTokenCacheKey = function (token) {
    return 'LT:' + token;  
};

/**
 * @desc 创建新的用户
 * */
exports.createNewUser = function (mobile, password, cid, userName, callback) {

    let salt = Math.random().toString();
    let now = new Date();

    let userDoc = {
        status: User.STATUS.NORMAL,
        user_name: userName,
        user_profile: '',
        user_avatar: '',
        user_mobile: mobile,
        user_password: hashUserPassword(salt, password),
        create_time: now,
        update_time: now,
        getui_cid: cid,
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
        _id: userID,
    };

    User.findOne(condition, callback)
};

/**
 * @desc 根据手机号获取信息
 * */
exports.getUserByMobile = function (phone, callback) {

    let condition = {
        user_mobile: {
            $exists: true, 
            $eq: phone}
    };

    User.findOne(condition, callback);
};

/**
 * @desc 根据qq获取信息
 * */
exports.getUserByQQ = function (openID, callback) {

    let condition ={
        bind_tencent_qq: {$exists: true},
        'bind_tencent_qq.uid': openID,
    };

    User.findOne(condition, callback);
};

/**
 * @desc 根据微信获取信息
 * */
exports.getUserByWechat = function (openID, callback) {

    let condition ={
        bind_tencent_wechat: {$exists: true},
        'bind_tencent_wechat.uid': uid,
    };

    User.findOne(condition, callback);
};

/**
 * @desc 根据微博获取信息
 * */
exports.getUserByWeibo = function (openID, callback) {

    let condition ={
        bind_sina_weibo: {$exists: true},
        'bind_sina_weibo.uid': uid,
    };

    User.findOne(condition, callback);
};


/**
 * @desc 根据用户手机和密码登录
 * */
exports.getUserByMobileAndPassword = function (phone, pass, cid, callback) {

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
        user.getui_cid = cid;

        user.save();
        callback(null, user);
    });
};

/*
 * @desc QQ第三方登录
 * uid
 * unionID
 * */
exports.userLoginWithQQAccount = function (uid, unionID, username, avatar, cid, callback) {
    
    let now = new Date();
    
    let condition ={
        bind_tencent_qq: {$exists: true},
        'bind_tencent_qq.uid': uid,
    };

    let userDoc = {
        status: User.STATUS.NORMAL,
        user_name: username,
        user_profile: null,
        user_avatar: avatar,
        user_mobile: null,
        user_password: null,
        create_time: now,
        update_time: now,
        pass_salt_str: null,
        getui_cid: cid,
        bind_tencent_qq:{
            uid: uid,
            union_id: unionID,
            name: username,
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
exports.userLoginWithWechatAccount = function (uid, unionID, username, avatar, cid, callback) {
    let now = new Date();

    let condition ={
        bind_tencent_wechat: {$exists: true},
        'bind_tencent_wechat.uid': uid,
    };

    let userDoc = {
        status: User.STATUS.NORMAL,
        user_name: username,
        user_profile: null,
        user_avatar: avatar,
        user_mobile: null,
        user_password: null,
        create_time: now,
        update_time: now,
        pass_salt_str: null,
        getui_cid: cid,
        bind_tencent_wechat:{
            uid: uid,
            union_id: unionID,
            name: username,
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
exports.userLoginWithWeiBoAccount = function (uid, unionID, username, avatar, cid, callback) {
    let now = new Date();
    let condition ={
        bind_sina_weibo: {$exists: true},
        'bind_sina_weibo.uid': uid,
    };

    let userDoc = {
        status: User.STATUS.NORMAL,
        user_name: username,
        user_profile: null,
        user_avatar: avatar,
        user_mobile: null,
        user_password: null,
        create_time: now,
        update_time: now,
        pass_salt_str: null,
        getui_cid: cid,
        bind_sina_weibo:{
            uid: uid,
            union_id: unionID,
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


//用户token==================================================================
/**
 * @desc 更新用户的登录token信息
 * */
exports.updateUserLoginToken = function (userID, token, expire, callback) {
    let sessionExpire = Math.round( (expire - Date.now()) / 1000 );

    if(sessionExpire < 0){
        return callback(new Error('expire lower current timestamp'));
    }

    let session = {
        id: userID,
        token: token,
        expire: expire,
    };
    
    let sessionString = JSON.stringify(session);
    
    let cacheTokenKey = genTokenCacheKey(token);

    redis.setex(cacheTokenKey, sessionExpire, sessionString, function (err, result) {
        if (err) {
            return callback(err)
        }

        let condition = {
            _id: userID
        };
        
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
    //过期时间30天
    let sessionExpire = Date.now() + 1000 * 3600 * 24 * 30;

    let cacheTokenKey = genTokenCacheKey(token);

    redis.get(cacheTokenKey, function (err, session) {
        if (err) {
            return callback(err)
        }

        async.waterfall([
            function(cb) {
                if(session){
                    
                    let sessionObject;
                    
                    try{
                        sessionObject = JSON.parse(session);
                    }catch (ex){
                        return cb(ex);
                    }
                    return cb(null,sessionObject);
                    
                }else{
                    let condition = {
                        'login_token.token': token,
                        'login_token.expire': {$gt: new Date()},
                    };

                    User.findOne(condition, function (err, doc) {
                        if(err){
                            return cb(err);
                        }
                        
                        if(!doc){
                            return cb(null, null);
                        }
                        
                        cb(null, {
                            id: doc._id,
                            token: token,
                            expire: doc.login_token.expire,
                        });
                    });
                }
            },
            function(session, cb) {
                if(!session){
                    return cb(null, null);
                }

                if (session.expire - Date.now() < 1000 * 3600 * 24 * 5) {
                    let userID = session.id;
                    self.updateUserLoginToken(userID, token, sessionExpire);
                }
                
                cb(null, session);
                
            },
        ], function (err, session) {
            if(err){
                return callback(err);
            }
            
            callback(null, session);
        });
        
    })
};

//更新密码==================================================================
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

//绑定账号==================================================================

/**
 * @desc 验证该账号是否满足绑定条件(此处不验证手机号)
 * */
exports.checkBoundMeetTheCondition = function (openID, bound_type, callback) {
    let type = bound_type;  //需要绑定的平台

    let condition;

    if(type == 1){
        condition ={
            bind_tencent_wechat: {$exists: true},
            'bind_tencent_wechat.uid': openID,
        };
    }

    if(type == 2){
        condition ={
            bind_tencent_qq: {$exists: true},
            'bind_tencent_qq.uid': openID,
        };
    }

    if(type == 3){
        condition ={
            bind_sina_weibo: {$exists: true},
            'bind_sina_weibo.uid': openID,
        };
    }
};
/**
 * @desc 绑定手机号
 * */
exports.updateUserPhone = function (userID, phone) {

};


/**
 * @desc 绑定微信
 * */
exports.updateUserTencentWechat = function (uid, unionID, username, userID, callback) {
    let condition ={
        bind_tencent_wechat: {$exists: true},
        'bind_tencent_wechat.uid': uid,
    };

    let userCondition = {
        _id: userID,
    };

    let update = {
        $unset:{
            bind_tencent_wechat: true
        }
    };

    let boundInfo = {
            uid: uid,
            union_id: unionID,
            name: username,
    };

    User.findOne(condition, function (err, result) {
        if(err){
            return callback(err)
        }

        let num = 0;

        if(!result){
            num = 3;
        }

        if(result && result.bind_tencent_wechat.uid){
            num +=1;
        }

        if(result && result.bind_sina_weibo.uid){
            num +=1;
        }

        if(result && result.bind_tencent_qq.uid){
            num +=1;
        }

        if(result && result.user_mobile){
            num +=1;
        }

        if(num < 2){ //判断是否满足换绑条件
            return callback(null, false)
        }



        User.findOne(userCondition,function (err, userInfo) {//查询当前用户信息
            if(err){
                return callback(err)
            }

            userInfo.bind_tencent_wechat = boundInfo;//添加新的绑定信息

            if(result){
                User.update(condition,update,function (err, result) {
                    if(err){
                        return callback(err)
                    }

                    userInfo.save(function (err, userInfo) { //保存当前用户信息
                        if(err){
                            return callback(err)
                        }

                        callback(null, true)
                    })
                });
            }else{
                userInfo.save(function (err, userInfo) { //保存当前用户信息
                    if(err){
                        return callback(err)
                    }

                    callback(null, true)
                })
            }



        })
    });
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
                .match({ create_user_id: mongodb.ObjectId(userID)})
                .project({favour: '$favour_count'})
                .group({
                    _id: null,
                    count: { $sum: "$favour" }
                })
                .exec(cb);
        },
        
        commentBeenFavouredCount: function(cb) {

            AnswerComment.aggregate()
                .match({ create_user_id: mongodb.ObjectId(userID)})
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
