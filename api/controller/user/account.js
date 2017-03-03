/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */
const userModel = require('../../../public/model/user');


/**
 * @desc 获取用户信息
 * */
exports.getUserInfo = function (req, res, next) {
    let userID = req.session.id;

    userModel.getUserInfo(userID, function (err, result) {
        if (err) {
            return next(err);
        }

        let userInfo = {
            headPic: result.user_avatar,
            username: result.user_name,
            signature: result.user_profile,
            sex: result.user_gender == null ? null : (result.user_gender ? 1 : 0),
            user_mobile: result.user_mobile ? result.user_mobile : null,
            work_info: result.work_info ? result.work_info : null,
            edu_info: result.edu_info ? result.edu_info : null
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
   
    let userInfo = {
        userName: req.body.user_name,
        userProfile: req.body.user_profile,
        userAvatar: req.body.user_avatar,
        userGender: req.body.user_gender,
        userMobile: req.body.user_mobile,
        workInfo: req.body.work_info,
        eduInfo: req.body.edu_info,
    };

    let userId = req.session.id;

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
exports.verifyPhoneHasRegistered = function (req, res, next) {
    
    let phone = req.query.phone;
    
    if(!phone){
        return next(new BadRequestError('phone is need'));
    }

    let regex = /^1[34578]\d{9}$/;

    if (!regex.test(phone.toString())) {
        return next(new BadRequestError('phone is illegal'));
    }

    userModel.findUserByMobile(phone, function (err, user) {
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
    let userInfo = req.body;
    
    
};


/**
 * @desc 用户登录接口
 * */
exports.userLoginWithPhone = function (req, res, next) {

};


/**
 * @desc 修改密码接口
 * */
exports.modifyUserPassword = function (req, res, next) {
    
};

