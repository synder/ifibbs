/**
 * @author synder on 2017/3/13
 * @copyright
 * @desc
 */

const url = require('url');
const path = require('path');
const formidable = require('formidable');

const imageFileModel = require('../../../public/file/image');

const hosts = global.config.hosts;

if (!(hosts && hosts.image)) {
    throw new Error('please provide image host config');
}

/**
 * @desc 测试页面
 * */
exports.page = function (req, res, next) {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
        '<form action="/upload/images" enctype="multipart/form-data" method="post">' +
        '<input type="file" name="upload" multiple="multiple"><br>' +
        '<input type="submit" value="Upload">' +
        '</form>'
    );
};

/**
 * @desc 批量上传接口
 * */
exports.batch = function (req, res, next) {

    const form = new formidable.IncomingForm();

    form.keepExtensions = true;
    form.maxFieldsSize = 1024;
    form.multiples = true;

    let result = {};

    form.onPart = function (part) {

        let fileName = part.filename;

        if (!fileName) {
            return;
        }

        result[fileName] = {
            url: null,
            msg: null
        };

        let mime = part.mime;
        let ext = path.extname(fileName).toLowerCase();

        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            return part.emit('close');
        }

        imageFileModel.saveUserUploadImages(ext, mime, part, function (err, image) {
            if (err) {
                result[fileName].msg = err.message;
                return logger.error(err);
            }

            result[fileName].url = url.format({
                protocol: hosts.image.protocol,
                hostname: hosts.image.host,
                port: hosts.image.port,
                pathname: hosts.image.pathname + image.file_name,
            });
        });
    };

    form
        .on()
        .on('error', function (err) {
            return next(err);
        })
        .on('end', function () {
            res.json({
                flag: '0000',
                msg: '',
                result: result
            });
        })
        .parse(req);
};