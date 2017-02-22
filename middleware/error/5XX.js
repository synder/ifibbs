/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */


module.exports = function(){
    return function(err, req, res, next){

        logger.error(err.stack);
        
        let code = err.code || 500;
        let msg = err.message || 'server error, please try again later';

        res.status(500).json({
            flag :code,
            msg: msg,
            result: {}
        });
    }
};