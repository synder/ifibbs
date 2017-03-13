/**
 * @author synder on 2017/3/13
 * @copyright
 * @desc
 */

const path = require('path');
const formidable = require('formidable');

/**
 * @desc 测试页面
 * */
exports.page = function (req, res, next) {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
        '<form action="/upload/images" enctype="multipart/form-data" method="post">'+
        '<input type="file" name="upload" multiple="multiple"><br>'+
        '<input type="submit" value="Upload">'+
        '</form>'
    );
};

/**
 * @desc 批量上传接口
 * */
exports.batch = function (req, res, next) {

    const form = new formidable.IncomingForm();

    form.uploadDir = '/Users/synder/Downloads';
    form.keepExtensions = true;
    form.maxFieldsSize = 1024 * 1024;
    form.multiples = true;

    form.parse(req, function (err, fields, files) {

        if (err) {
            return next(err);
        }

        console.log(fields, files);

        res.json({
            flag: '0000',
            msg: '',
            result: {
                file_id: "586f4ceee4b04fdfe6fd2fca"
            }
        });
    });
};