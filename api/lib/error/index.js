/**
 * @author synder on 2017/2/23
 * @copyright
 * @desc
 */

const util = require('util');

class HttpError extends Error {
    constructor(msg, code) {
        super(msg);
        this.code = code;
    }
    
    toString() {
        return 'http error: ' + this.message + ', status code is' + this.code;
    }
}

/**
 * @desc 错误请求错误
 * */
class BadRequestError extends HttpError {
    constructor(msg) {
        super(msg, 400);
        this.message = msg || 'bad request';
    }
}

/**
 * @desc 请求未授权
 * */
class UnauthorizedError extends HttpError {
    constructor(msg) {
        super(msg, 401);
        this.message = msg || 'unauthorized';
    }
}

/**
 * @desc 请求被拒绝
 * */
class ForbiddenError extends HttpError {
    constructor(msg) {
        super(msg, 403);
        this.message = msg || 'request forbidden';
    }
}

/**
 * @desc 资源未找到
 * */
class NotFoundError extends HttpError {
    constructor(msg) {
        super(msg, 404);
        this.message = 'resource "' + msg + '" not found';
    }
}


/**
 * @desc 服务器内部错误
 * */
class InternalServerError extends HttpError {
    constructor(msg) {
        super(msg, 500);
        this.message = msg || 'internal server';
    }
}


exports.HttpError = global.HttpError = HttpError;
exports.BadRequestError = global.BadRequestError = BadRequestError;
exports.UnauthorizedError = global.UnauthorizedError = UnauthorizedError;
exports.NotFoundError = global.NotFoundError = NotFoundError;
exports.InternalServerError = global.InternalServerError = InternalServerError;