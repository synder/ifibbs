/**
 * @author synder on 2017/2/23
 * @copyright
 * @desc
 */


exports.notFoundHandler = function () {
    return function (req, res, next) {
        next(new NotFoundError());
    }
};

exports.serverErrorHandler = function () {
    return function (err, req, res, next) {

        logger.error(err.stack);

        if (!err.code) {
            err.code = 500;
        }

        if (!err.message) {
            err.message = 'server error, please try again later';
        }

        res.status(err.code).json({
            flag: '0' + err.code,
            msg: err.message,
            result: null
        });
    }
};