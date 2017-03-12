/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */
const uuid = require('uuid/v4');
const async = require('async');

const userModel = require('../../../public/model/user');
const captchaModel = require('../../../public/model/captcha');
const attentionModel = require('../../../public/model/attention');
const deviceModel = require('../../../public/model/device');



/**
 * @desc 获取用户信息
 * */
exports.getUserInfo = function (req, res, next) {
    let userID = req.query.user_id;
    let myID = req.session.id;

    async.parallel({
        attention: function(cb){
            if(userID == myID){
                return cb(null,null);
            }

            attentionModel.findUserAttentionByUserID(myID, userID, cb)
        },
        userInfo: function(cb){
            userModel.getUserInfoByID(userID, cb)
        }
    },function (err, result) {
        if (err) {
            return next(err);
        }

        if(!result.userInfo){
            return next(new BadRequestError('without the user data'))
        }

        let userInfo = {
            user_id: userID,
            user_avatar: result.userInfo.user_avatar,
            user_name: result.userInfo.user_name,
            user_profile: result.userInfo.user_profile,
            user_gender: result.userInfo.user_gender == null ? null : (result.userInfo.user_gender ? 1 : 0),
            user_mobile: result.userInfo.user_mobile ? result.userInfo.user_mobile : null,
            work_info: result.userInfo.work_info ? result.userInfo.work_info : null,
            edu_info: result.userInfo.edu_info ? result.userInfo.edu_info : null,
            user_province: result.userInfo.user_province ? result.userInfo.user_province : null,
            user_city: result.userInfo.user_city ? result.userInfo.user_city : null,
            user_area: result.userInfo.user_area ? result.userInfo.user_area : null,
        };

        if(myID != userID){
            userInfo.whether_attention = !!result.attention
        }

        res.json({
            flag: '0000',
            msg: '',
            result: userInfo
        })

    });
};


/**
 * @desc 修改用户信息
 * */
exports.updateUserInfo = function (req, res, next) {
    let gender = req.body.user_gender == undefined || req.body.user_gender == null ? 0 : req.body.user_gender.toString();

    let userId = req.session.id;

    let userInfo = {
        userName: req.body.user_name,
        userProfile: req.body.user_profile,
        userAvatar: req.body.user_avatar,
        userGender: gender ? gender == 1 : null,
        userMobile: req.body.user_mobile,
        workInfo: req.body.work_info,
        eduInfo: req.body.edu_info,
        province: req.body.user_province,
        city: req.body.user_city,
        area: req.body.user_area,
    };

    userModel.updateUserInfo(userId, userInfo, function (err, success) {
        if (err) {
            return next(err)
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: !!success
            }
        });
    })
};


/**
 * @desc 验证手机是否注册接口
 * */
exports.checkPhoneRegistered = function (req, res, next) {

    let phone = req.query.phone;

    if (!phone) {
        return next(new BadRequestError('phone is need'));
    }

    let regex = /^1[0-9]\d{9}$/;

    if (!regex.test(phone.toString())) {
        return next(new BadRequestError('phone is illegal'));
    }

    userModel.getUserByMobile(phone, function (err, user) {
        if (err) {
            return next(err)
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: !!user
            }
        })
    });
};

/*
 * @desc 验证第三方账号是否存在
 * */
exports.checkThirdParty = function (req, res, next) {
    let openID = req.body.open_id;
    let loginType = req.body.login_type; //1：微信 2: qq 3: 新浪微博 （0:手机账号密码）
    let userID = req.session.id;

    if (loginType != 1 && loginType != 2 && loginType != 3) {
        return next(new BadRequestError('login_type is not in [1,2,3]'));
    }

    let checkFunction;

    if(loginType == 1){
        checkFunction = userModel.getUserByWechat;
    }

    if(loginType == 2){
        checkFunction = userModel.getUserByQQ;
    }

    if(loginType == 3){
        checkFunction = userModel.getUserByWeibo();
    }

    checkFunction(openID, function (err, userInfo) {
        if(err){
            return next(err)
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                is_bound: !!userInfo,
                user_name: userInfo ? userInfo.user_name : null,
            }
        });
    })

};

/**
 * @desc 用户注册接口
 * */
exports.userRegisterWithPhone = function (req, res, next) {
    let string = Math.random().toString().substr(2, 12);
    let mobile = req.body.user_mobile;
    let password = req.body.user_password;
    let codeID = req.body.code_id;
    let code = req.body.code;
    let registerPlatform = req.body.register_platform;
    let getuiCID = req.body.getui_cid;
    let userName = req.body.user_name || `游客：${string}`;

    let  deviceInfo = null;

    if (registerPlatform == 1 || registerPlatform == 2) {//写入设备信息
        deviceInfo = {
            deviceToken: req.body.register_deviceno,
            devicePlatform: registerPlatform,
            deviceResolution : req.body.device_resolution,
            deviceBrand : req.body.device_brand,
            deviceVersion : req.body.device_version
        }
    }

    if (!mobile) {
        return next(new BadRequestError('mobile_number is need'));
    }

    if (!password) {
        return next(new BadRequestError('user_password is need'));
    }

    if (!codeID) {
        return next(new BadRequestError('code_id is need'));
    }

    if (!code) {
        return next(new BadRequestError('code is need'));
    }

    if (!getuiCID) {
        return next(new BadRequestError('getui_cid is need'));
    }

    //验证验证码信息
    captchaModel.verifySmsSecurityCode(codeID, mobile, code, 6, true, function (err, result) {
        if (err) {
            return next(err);
        }

        if (!result) {
            return next(new BadRequestError('this security code has been tampered with'));
        }

        //写入用户数据
        userModel.createNewUser(mobile, password, getuiCID, userName, function (err, user) {
            if (err) {
                return next(err);
            }

            if (!user) {
                return next(new BadRequestError('the mobile has been used'));
            }

            let userId = user._id;
            let token = uuid();
            let expire = Date.now() + 1000 * 3600 * 24 * 30;
            async.parallel({
                updateDeviceInfo: function(cb) {
                    if(deviceInfo){
                        deviceModel.createNewDevice(userId, deviceInfo, cb);
                    }else{
                        cb();
                    }
                },
                updateLoginToken: function(cb) {
                    userModel.updateUserLoginToken(userId, token, expire, cb);
                },
            }, function (err, results) {
                if(err){
                     return next(err);
                }

                res.json({
                    flag: '0000',
                    msg: '',
                    result: {
                        user_id: userId,
                        login_token: token,
                        user_mobile: user.user_mobile,
                        login_fashion: 0,
                        bind_wechat: false,
                        bind_qq: false,
                        bind_weibo: false,
                    }
                })
            });
        })
    });
};

/**
 * @desc 用户系统手机账户登录接口
 * */
exports.userLoginWithSystemAccount = function (req, res, next) {
    let mobile = req.body.user_mobile;
    let password = req.body.user_password;
    let registerPlatform = req.body.register_platform;  //1: ANDROID 2: IOS 3: PC 4: H5 5: OTHER
    let getuiCID = req.body.getui_cid;
    
    let deviceInfo;

    if (registerPlatform == 1 || registerPlatform == 2) {//写入设备信息
        deviceInfo = {
            deviceToken: req.body.register_deviceno,
            devicePlatform: registerPlatform,
            deviceResolution : req.body.device_resolution,
            deviceBrand : req.body.device_brand,
            deviceVersion : req.body.device_version
        };
    }

    if (!mobile) {
        return next(new BadRequestError('mobile_number is need'));
    }

    if (!password) {
        return next(new BadRequestError('password is need'));
    }

    if (!getuiCID) {
        return next(new BadRequestError('getui_cid is need'));
    }

    userModel.getUserByMobileAndPassword(mobile, password, getuiCID, function (err, user) {
        if (err) {
            return next(err)
        }

        if (!user) {
            return next(new BadRequestError('mobile or password error'));
        }

        let userId = user._id;
        let token = uuid();
        let expire = Date.now() + 1000 * 3600 * 24 * 30;

        async.parallel({
            updateDeviceInfo: function(cb) {
                if(deviceInfo){
                    deviceModel.createNewDevice(userId, deviceInfo, cb);
                }else{
                    cb();
                }
            },
            updateLoginToken: function(cb) {
                userModel.updateUserLoginToken(userId, token, expire, cb);
            },
        }, function (err, results) {

            if(err){
                return next(err);
            }

            res.json({
                flag: '0000',
                msg: '',
                result: {
                    user_id: userId,
                    login_token: token,
                    user_mobile: user.user_mobile,
                    login_fashion: 0,
                    bind_wechat: !!user.bind_tencent_wechat.uid ,
                    bind_qq: !!user.bind_tencent_qq.uid,
                    bind_weibo: !!user.bind_sina_weibo.uid,
                }
            })
        });
    });
};

/**
 * @desc 用户使用第三方账户登录
 * */
exports.userLoginWithThirdPartyAccount = function (req, res, next) {
    let gender = req.body.user_gender == undefined || req.body.user_gender == null ? 0 : req.body.user_gender.toString();

    let string = Math.random().toString().substr(2, 12);
    let uid = req.body.open_id;
    let union_id = req.body.union_id;
    let userName = req.body.user_name || `游客：${string}`;
    let userGender = gender ? gender == 1 : null;
    let registerPlatform = req.body.register_platform;  //1: ANDROID 2: IOS 3: PC 4: H5 5: OTHER
    let loginType = req.body.login_type; //1：微信 2: qq 3: 新浪微博 （0:手机账号密码）
    let userAvatar = req.body.user_avatar;
    let getuiCID = req.body.getui_cid;

    let deviceInfo;

    if (registerPlatform == 1 || registerPlatform == 2) {//写入设备信息
        deviceInfo = {
            deviceToken: req.body.register_deviceno,
            devicePlatform: registerPlatform,
            deviceResolution : req.body.device_resolution,
            deviceBrand : req.body.device_brand,
            deviceVersion : req.body.device_version
        };
    }

    if (loginType != 1 && loginType != 2 && loginType != 3) {
        return next(new BadRequestError('login_type is not in [1,2,3]'));
    }

    if (!uid) {
        return next(new BadRequestError('open_id is need'));
    }

    if (!userAvatar) {
        return next(new BadRequestError('user_avatar is need'));
    }

    if (!getuiCID) {
        return next(new BadRequestError('getui_cid is need'));
    }

    //登录方式
    let loginFunction;

    if (loginType == 1) {
        loginFunction = userModel.userLoginWithWechatAccount;
    }

    if (loginType == 2) {
        loginFunction = userModel.userLoginWithQQAccount;
    }

    if (loginType == 3) {
        loginFunction = userModel.userLoginWithWeiBoAccount;
    }
    loginFunction(uid, union_id, userName, userAvatar, getuiCID, userGender, function (err, user) {
        if (err) {
            return next(err)
        }

        let userId = user._id;
        let token = uuid();
        let expire = Date.now() + 1000 * 3600 * 24 * 30;

        async.parallel({
            updateDeviceInfo: function(cb) {
                if(deviceInfo){
                    deviceModel.createNewDevice(userId, deviceInfo, cb);
                }else{
                    cb();
                }
            },
            updateLoginToken: function(cb) {
                userModel.updateUserLoginToken(userId, token, expire, cb);
            },
        }, function (err, results) {
            if(err){
                return next(err);
            }

            res.json({
                flag: '0000',
                msg: '',
                result: {
                    user_id: userId,
                    login_token: token,
                    login_fashion: loginType,
                    user_mobile: user.user_mobile,
                    bind_wechat: !!user.bind_tencent_wechat.uid ,
                    bind_qq: !!user.bind_tencent_qq.uid,
                    bind_weibo: !!user.bind_sina_weibo.uid,
                    bind_phone: !!user.user_mobile,
                }
            });
        });
    })
};

/*
 * @desc 绑定手机
 * */
exports.userBindPhone = function (req, res, next) {
    let mobile = req.body.user_mobile;
    let password = req.body.user_password;
    let codeID = req.body.code_id;
    let code = req.body.code;
    let userID = req.session.id;

    if (!mobile) {
        return next(new BadRequestError('mobile_number is need'));
    }

    if (!password) {
        return next(new BadRequestError('user_password is need'));
    }

    if (!codeID) {
        return next(new BadRequestError('code_id is need'));
    }

    if (!code) {
        return next(new BadRequestError('code is need'));
    }

    captchaModel.verifySmsSecurityCode(codeID, mobile, code, 6, true, function (err, result) {
        if (err) {
            return next(err);
        }

        if (!result) {
            return next(new BadRequestError('this security code has been tampered with'));
        }

        userModel.updateUserPhone(userID, mobile, password, function (err, success) {
            if (err) {
                return next(err);
            }

            res.json({
                flag: '0000',
                msg: '',
                result: {
                    ok: !!success
                }
            })
        })
    });
};

/*
 * @desc 第三方账户绑定
 * */
exports.userBindThirdParty = function (req, res, next) {
    let uid = req.body.open_id;
    let union_id = req.body.union_id;
    let userName = req.body.user_name;
    let userId = req.session.id;
    let loginType = req.body.login_type; //1：微信 2: qq 3: 新浪微博 （0:手机账号密码）

    if (loginType != 1 && loginType != 2 && loginType != 3) {
        return next(new BadRequestError('login_type is not in [1,2,3]'));
    }

    if (!uid) {
        return next(new BadRequestError('open_id is need'));
    }

    if (!userName) {
        return next(new BadRequestError('open_id is user_name'));
    }

    let bindFunction;

    if (loginType == 1) {
        bindFunction = userModel.updateUserTencentWechat;
    }

    if (loginType == 2) {
        bindFunction = userModel.updateUserTencentQQ;
    }

    if (loginType == 3) {
        bindFunction = userModel.updateUserSinaWeibo;
    }

    bindFunction(uid, union_id, userName, userId, function (err, success) {
        if (err) {
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: !!success
            }
        })
    })
};

/*
 * @desc 第三方账户解绑
 * */
exports.userRemoveThirdParty = function (req, res, next) {
    let userId = req.session.id;
    let loginType = ~~req.body.login_type; //1：微信 2: qq 3: 新浪微博 （0:手机账号密码）

    if (loginType != 1 && loginType != 2 && loginType != 3) {
        return next(new BadRequestError(`login_type is not in [1,2,3] ${loginType}`));
    }

    let removeFunction;

    if (loginType == 1) {
        removeFunction = userModel.removeUserTencentWechat;
    }

    if (loginType == 2) {
        removeFunction = userModel.removeUserTencentQQ;
    }

    if (loginType == 3) {
        removeFunction = userModel.removeUserSinaWeibo;
    }

    removeFunction(userId, function (err, success) {
        if (err) {
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: true
            }
        })
    })
};

/**
 * @desc 修改密码接口，根据老密码修改或者找回密码
 * */
exports.modifyUserPassword = function (req, res, next) {
    let mobile = req.body.user_mobile;
    let newPassword = req.body.new_password;
    let codeID = req.body.code_id;
    let code = req.body.code;

    let userID = req.session.id;

    if (!newPassword) {
        return next(new BadRequestError('new_password is need'));
    }

    if (!mobile) {
        return next(new BadRequestError('user_mobile is need'));
    }

    if (!codeID) {
        return next(new BadRequestError('code_id is need'));
    }

    if (!code) {
        return next(new BadRequestError('code is need'));
    }

    captchaModel.verifySmsSecurityCode(codeID, mobile, code, 6, true, function (err, result) {
        if (err) {
            return next(err);
        }

        if (!result) {
            return next(new BadRequestError('this security code has been tampered with'));
        }

        userModel.updateUserPasswordWithOldPassword(userID, mobile, newPassword, function (err, success) {
            if (err) {
                return next(err);
            }

            res.json({
                flag: '0000',
                msg: '',
                result: {
                    ok: !!success
                }
            });
        });
    });



};


/**
 * @desc 重置密码
 * */
exports.resetUserPassword = function (req, res, next) {

    let mobileNumber = req.body.user_mobile;
    let newPassword = req.body.new_password;
    let securityCode = req.body.code;
    let codeID = req.body.code_id;

    if (!mobileNumber) {
        return next(new BadRequestError('mobile_number is need'));
    }

    if (!newPassword) {
        return next(new BadRequestError('new_password is need'));
    }

    if (!securityCode) {
        return next(new BadRequestError('security_code is need'));
    }

    if (!codeID) {
        return next(new BadRequestError('code_id is need'));
    }

    //验证验证码
    captchaModel.verifySmsSecurityCode(codeID, mobileNumber, securityCode, 6, true, function (err, result) {
        if (err) {
            return next(err)
        }

        if (!result) {
            return next(new BadRequestError('this code security has been tampered with'));
        }

        userModel.updateUserPasswordWithMobile(mobileNumber, newPassword, function (err, success) {
            if (err) {
                return next(err);
            }

            res.json({
                flag: '0000',
                msg: '',
                result: {
                    ok: !!success
                }
            });
        });
    });
};


