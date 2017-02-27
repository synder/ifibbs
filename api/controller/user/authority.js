/**
 * @author synder on 2017/2/18
 * @copyright
 * @desc
 */

/**
 * @desc 检测用户是否登录
 * */
exports.check = function (req, res, next) {
    
    if(!req.session.id){
        return next(new UnauthorizedError('not login, please login and then try again'));
    }
    
    next();
    
};  