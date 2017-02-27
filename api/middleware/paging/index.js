/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

/**
 * 对分页参数进行修正, 防止被攻击
 * */
module.exports = function () {
    return function (req, res, next) {
        
        if(req.method.toLowerCase() === 'get'){
            req.query.page_size = req.query.page_size ? ~~req.query.page_size : 20;
            req.query.page_index = req.query.page_index ? ~~req.query.page_index : 1;

            if(req.query.page_index < 1){
                req.query.page_index = 1;
            }

            if(req.query.page_size < 1){
                req.query.page_size = 1;
            }

            if(req.query.page_size > 50){
                req.query.page_size = 50;
            }

            req.query.page_skip = req.query.page_size * (req.query.page_index - 1);
        }
        
        return next();
    }
};