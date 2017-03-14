/**
 * @author synder on 2017/3/13
 * @copyright
 * @desc
 */


const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

class DefaultFileService {
    
    constructor(dir){
        this.dir = dir;
    }

    persistence(filename, stream, callback){
        
    }
}

class LocalFileService extends DefaultFileService {
    
    constructor(dir){
        super(dir);
        
        if(!this.dir){
            throw new Error('base dir should not be null');
        }

        if(!fs.existsSync(this.dir)){
            mkdirp(this.dir, function (err) {
                if(err){
                    console.error(err.stack);
                }
            });
        }
    }

    persistence(filename, readStream, callback){
        let filePath = path.join(this.dir, filename);
        let writeStream = fs.createWriteStream(filePath);
        writeStream.on('error', callback);
        readStream.on('error', callback);
        writeStream.on('finish', function () {
            callback(null, filePath);
        });
        readStream.pipe(writeStream);
    }
}


/**
 * @desc 保存数据到oss
 * */
class OssFileService extends DefaultFileService {

    persistence(filename, stream, callback){

    }
}

exports.LocalFileService = LocalFileService;
exports.OssFileService = OssFileService;