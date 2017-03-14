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
        '<input type="file" name="avatar" multiple="multiple"><br>' +
        '<input type="submit" value="Upload">' +
        '</form>'
    );
};

/**
 * @desc 批量上传接口
 * */
exports.batch = function (req, res, next) {
    
    let contentLength = req.headers['content-length'];
    
    if(contentLength > 10485760){
        return next(new Error('request entity too large'));
    }

    const form = new formidable.IncomingForm();

    form.keepExtensions = true;
    form.maxFieldsSize = 1024;
    form.multiples = true;
    form.maxFields = 10;

    let result = {};

    form.onPart = function (stream) {
        
        let self = this;

        let domain = stream.name;
        let fileName = stream.filename;
        
        if (!fileName) {
            return;
        }
        
        if(domain){
            domain = domain.replace(path.sep, '');
        }else {
            domain = 'other';
        }

        let mime = stream.mime;
        let ext = path.extname(fileName).toLowerCase();
        
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            return;
        }

        self._flushing++;

        result[fileName] = {
            url: null,
            msg: null
        };
        
        imageFileModel.saveUserUploadImages(ext, mime, domain, stream, function (err, image) {
            
            if (err) {
                result[fileName].msg = err.message;
                logger.error(err);
            }else{
                result[fileName].url = url.format({
                    protocol: hosts.image.protocol,
                    hostname: hosts.image.host,
                    port: hosts.image.port,
                    pathname: path.join(hosts.image.pathname, domain, image.file_name),
                });
            }
            
            self._flushing--;
            self._maybeEnd();
        });
    };
    
    form.on('error', function (err) {
        return next(err);
    }).on('end', function () {
        res.json({
            flag: '0000',
            msg: '',
            result: result
        });
    }).parse(req);
};