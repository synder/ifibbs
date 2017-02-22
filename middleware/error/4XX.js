/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */


module.exports = function(){
    return function(req, res, next){

        logger.error(req.path, 'not found');

        res.status(404).json({
            flag : '404',
            msg: 'resource not found',
            result: {}
        });
    }
};