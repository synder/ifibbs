/**
 * @author synder
 * @date 16/1/10
 * @desc
 */

const info = require('../../controller/device/info');

exports.map = function (app) {
    //设备信息
    app.put('/device/info', info.reportUserDeviceInfo);
};