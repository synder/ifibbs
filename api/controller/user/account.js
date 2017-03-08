/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */
const uuid = require('uuid/v4');
const async = require('async');

const userModel = require('../../../public/model/user');
const captchaModel = require('../../../public/model/captcha');
const deviceModel = require('../../../public/model/device');



/**
 * @desc 获取用户信息
 * */
exports.getUserInfo = function (req, res, next) {
    let userID = req.session.id;

    userModel.getUserInfoByID(userID, function (err, result) {
        if (err) {
            return next(err);
        }

        if(!result){
            return next(new BadRequestError('without the user data'))
        }

        let userInfo = {
            user_id: userID,
            user_avatar: result.user_avatar,
            user_name: result.user_name,
            user_profile: result.user_profile,
            user_gender: result.user_gender == null ? null : (result.user_gender ? 1 : 0),
            user_mobile: result.user_mobile ? result.user_mobile : null,
            work_info: result.work_info ? result.work_info : null,
            edu_info: result.edu_info ? result.edu_info : null,
            user_province: result.user_province ? result.user_province : null,
            user_city: result.user_city ? result.user_city : null,
            user_area: result.user_area ? result.user_area : null,
        };

        res.json({
            flag: '0000',
            msg: '',
            result: userInfo
        })
    })

};


/**
 * @desc 修改用户信息
 * */
exports.updateUserInfo = function (req, res, next) {

    let userId = req.session.id;

    let userInfo = {
        userName: req.body.user_name,
        userProfile: req.body.user_profile,
        userAvatar: req.body.user_avatar,
        userGender: req.body.user_gender ? req.body.user_gender == 1 : null,
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


/**
 * @desc 用户注册接口
 * */
exports.userRegisterWithPhone = function (req, res, next) {
    
    let mobile = req.body.user_mobile;
    let password = req.body.user_password;
    let codeID = req.body.code_id;
    let code = req.body.code;
    let randomString = req.body.code_random;
    let registerPlatform = req.body.register_platform;

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

    //验证验证码信息
    captchaModel.verifySmsSecurityCode(codeID, mobile, code, randomString, 5, true, function (err, result) {
        if (err) {
            return next(err);
        }

        if (!result) {
            return next(new BadRequestError('this security code has been tampered with'));
        }

        //写入用户数据
        userModel.createNewUser(mobile, password, function (err, user) {
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

    userModel.getUserByMobileAndPassword(mobile, password, function (err, user) {
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
                    login_fashion: 0,
                    bind_wechat: !!user.bind_tencent_wechat ,
                    bind_qq: !!user.bind_tencent_qq,
                    bind_weibo: !!user.bind_sina_weibo,
                    bind_phone: !!user.user_mobile,
                }
            })
        });
    });
};


/**
 * @desc 用户使用第三方账户登录
 * */
exports.userLoginWithThirdPartyAccount = function (req, res, next) {
    let uid = req.body.open_id;
    let union_id = req.body.union_id;
    let userName = req.body.user_name;
    let registerPlatform = req.body.register_platform;  //1: ANDROID 2: IOS 3: PC 4: H5 5: OTHER
    let loginType = req.body.login_type; //1：微信 2: qq 3: 新浪微博 （0:手机账号密码）
    let userAvatar = req.body.user_avatar;

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
    loginFunction(uid, union_id, userName, userAvatar, function (err, user) {
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
                    bind_wechat: !!user.bind_tencent_wechat ,
                    bind_qq: !!user.bind_tencent_qq,
                    bind_weibo: !!user.bind_sina_weibo,
                    bind_phone: !!user.user_mobile,
                }
            });
        });
    })
};


/**
 * @desc 修改密码接口，根据老密码修改或者找回密码
 * */
exports.modifyUserPassword = function (req, res, next) {
    let oldPassword = req.body.old_password;
    let newPassword = req.body.new_password;

    let userID = req.session.id;

    if (!newPassword) {
        return next(new BadRequestError('new_password is need'));
    }

    if (!oldPassword) {
        return next(new BadRequestError('old_password is need'));
    }

    if (oldPassword === newPassword){
        return next(new BadRequestError('old_password  and new_password cannot be the same'));
    }

    userModel.updateUserPasswordWithOldPassword(userID, oldPassword, newPassword, function (err, success) {
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

};


/**
 * @desc 重置密码
 * */
exports.resetUserPassword = function (req, res, next) {

    let mobileNumber = req.body.mobile_number;
    let newPassword = req.body.new_password;
    let securityCode = req.body.security_code;
    let codeID = req.body.code_id;
    let randomString = req.body.code_random;

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

    if (!randomString) {
        return next(new BadRequestError('code_random is need'));
    }

    //验证验证码
    captchaModel.verifySmsSecurityCode(codeID, mobileNumber, securityCode, randomString, 5, true, function (err, result) {
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
