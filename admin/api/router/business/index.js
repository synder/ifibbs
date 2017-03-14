/**
 * @author synder
 * @date 16/1/10
 * @desc
 */

const test = require('../../controller/business/test')



exports.map = function (app) {
    app.get('/test',test.test)
};