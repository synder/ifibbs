/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */

const async = require('async');
const crypto = require('crypto');

const mongodb = require('../../service/mongodb/ifibbs');
const ifibbsMongodb = mongodb.client;
const ifibbsRedis = require('../../service/redis/ifibbs').client;

const User = ifibbsMongodb.model('User');
const AttentionUser = ifibbsMongodb.model('AttentionUser');
const QuestionAnswer = ifibbsMongodb.model('QuestionAnswer');
const AnswerComment = ifibbsMongodb.model('AnswerComment');

const self = this;

/**
 * @desc 密码加密
 * */
const hashUserPassword = function (salt, password) {
    salt = salt ? salt.trim() : '@';
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

        user.save(function (err) {
            callback(err, user);
        });
    });
};

/*
 * @desc QQ第三方登录
 * uid
 * unionID
 * */
exports.userLoginWithQQAccount = function (uid, unionID, username, avatar, cid, userGender, callback) {
    
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
        user_gender: userGender,
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
exports.userLoginWithWechatAccount = function (uid, unionID, username, avatar, cid, userGender, callback) {
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
        user_gender: userGender,
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
exports.userLoginWithWeiBoAccount = function (uid, unionID, username, avatar, cid, userGender, callback) {
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
        user_gender: userGender,
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

    ifibbsRedis.setex(cacheTokenKey, sessionExpire, sessionString, function (err, result) {
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

    ifibbsRedis.get(cacheTokenKey, function (err, session) {
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
exports.updateUserPasswordWithOldPassword = function (userID, phone, newPassword, callback) {
    let condition = {
        _id: userID,
        user_mobile: phone,
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
 * @desc 绑定手机号
 * */
exports.updateUserPhone = function (userID, mobile, password, callback) {
    let salt = Math.random().toString();
    let now = new Date();

    let oldCondition = {
        status: User.STATUS.NORMAL,
        user_mobile: {$exists: true, $eq: mobile},
    };
    
    let userCondition = {
        _id: userID,
    };
    
    let userUpdate = {
        $set: {
            user_mobile: mobile,
            user_password: hashUserPassword(salt, password),
            pass_salt_str: salt,
            update_time: now,
        }
    };
    
    User.findOne(oldCondition, function (err, userInfo) {
        if (err){
            return callback(err);
        }
        
        if (userInfo){
            return callback(null, false);
        }
        
        User.update(userCondition, userUpdate, function (err, result) {
            callback(err, result.nModified === 1)
        })
    })
};


/**
 * @desc 绑定微信
 * */
exports.updateUserTencentWechat = function (uid, unionID, username, userID, callback) {
    let now = new Date();

    let oldCondition ={
        status: User.STATUS.NORMAL,
        bind_tencent_wechat: {$exists: true},
        'bind_tencent_wechat.uid': uid,
    };

    let userCondition = {
        _id: userID,
    };

    let oldUpdate = {
        $set:{
            update_time: now,
        },
        $unset:{
            bind_tencent_wechat: true,
        }
    };

    let userUpdate = {
        $set:{
            update_time: now,
            'bind_tencent_wechat.uid': uid,
            'bind_tencent_wechat.union_id': unionID,
            'bind_tencent_wechat.name': username,
        }
    };

    User.findOne(oldCondition, function (err, result) {
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

        async.waterfall([
            function(cb) {
                if (!result){
                    return cb(null, null)
                }

                User.update(oldCondition, oldUpdate, cb)
            },
            function(boo, cb) {
                User.update(userCondition, userUpdate, cb)
            }
        ], function (err, success) {
            if(err){
                return callback(err)
            }

            callback(null, success.nModified === 1)
        });
    });
};


/**
 * @desc 绑定QQ
 * */
exports.updateUserTencentQQ = function (uid, unionID, username, userID, callback) {
    let now = new Date();

    let oldCondition ={
        status: User.STATUS.NORMAL,
        bind_tencent_qq: {$exists: true},
        'bind_tencent_qq.uid': uid,
    };

    let userCondition = {
        _id: userID,
    };

    let oldUpdate = {
        $set:{
            update_time: now,
        },
        $unset:{
            bind_tencent_qq: true
        }
    };

    let userUpdate = {
        $set:{
            update_time: now,
            'bind_tencent_qq.uid': uid,
            'bind_tencent_qq.union_id': unionID,
            'bind_tencent_qq.name': username,
        }

    };

    User.findOne(oldCondition, function (err, result) {
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

        async.waterfall([
            function(cb) {
                if (!result){
                    return cb(null, null)
                }

                User.update(oldCondition, oldUpdate, cb)
            },
            function(boo, cb) {
                User.update(userCondition, userUpdate, cb)
            }
        ], function (err, success) {
            if(err){
                return callback(err)
            }

            callback(null, success.nModified === 1)
        });
    });
};


/**
 * @desc 绑定新浪微博
 * */
exports.updateUserSinaWeibo = function (uid, unionID, username, userID, callback) {
    let now = new Date();

    let oldCondition ={
        status: User.STATUS.NORMAL,
        bind_sina_weibo: {$exists: true},
        'bind_sina_weibo.uid': uid,
    };

    let userCondition = {
        _id: userID,
    };

    let oldUpdate = {
        $set:{
            update_time: now,
        },
        $unset:{
            bind_sina_weibo: true
        }
    };

    let userUpdate = {
        $set:{
            update_time: now,
            'bind_sina_weibo.uid': uid,
            'bind_sina_weibo.union_id': unionID,
            'bind_sina_weibo.name': username,
        }
    };

    User.findOne(oldCondition, function (err, result) {
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

        async.waterfall([
            function(cb) {
                if (!result){
                    return cb(null, null)
                }

                User.update(oldCondition, oldUpdate, cb)
            },
            function(boo, cb) {
                User.update(userCondition, userUpdate, cb)
            }
        ], function (err, success) {
            if(err){
                return callback(err)
            }

            callback(null, success.nModified === 1)
        });
    });
};

/*
 * @desc 解绑微信
 * */
exports.removeUserTencentWechat = function (userID, callback) {
    let now = new Date();

    let condition = {
        _id: userID,
    };

    let update = {
        $set:{
            update_time: now,
        },
        $unset:{
            bind_tencent_wechat: true,
        }
    };
    User.findOne(condition,function (err, result) {
        if (err){
            return callback(err)
        }

        let num = 0;

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

        if(num < 2){ //判断是否满足解绑条件
            return callback(null, false)
        }

        User.update(condition, update, callback)
    });

};

/*
 * @desc 解绑qq
 * */
exports.removeUserTencentQQ = function (userID, callback) {
    let now = new Date();

    let condition = {
        _id: userID,
    };

    let update = {
        $set:{
            update_time: now,
        },
        $unset:{
            bind_tencent_qq: true,
        }
    };

    User.findOne(condition,function (err, result) {
        if (err){
            return callback(err)
        }

        let num = 0;

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

        if(num < 2){ //判断是否满足解绑条件
            return callback(null, false)
        }

        User.update(condition, update, callback)
    });
};

/*
 * @desc 解绑新浪微博
 * */
exports.removeUserSinaWeibo = function (userID, callback) {
    let now = new Date();

    let condition = {
        _id: userID,
    };

    let update = {
        $set:{
            update_time: now,
        },
        $unset:{
            bind_sina_weibo: true,
        }
    };

    User.findOne(condition,function (err, result) {
        if (err){
            return callback(err)
        }

        let num = 0;

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

        if(num < 2){ //判断是否满足解绑条件
            return callback(null, false)
        }

        User.update(condition, update, callback)
    });
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
