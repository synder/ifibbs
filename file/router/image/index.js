/**
 * @author synder
 * @date 16/1/10
 * @desc
 */

const upload = require('../../controller/image/upload');

exports.map = function(app){
    app.post('/upload/images', upload.batch);  //批量上传图片
};