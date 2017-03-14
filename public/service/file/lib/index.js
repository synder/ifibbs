/**
 * @author synder on 2017/3/13
 * @copyright
 * @desc
 */


const fs = require('fs');
const path = require('path');

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
        
        this.dirs = {};
        
        this.mode = fs.constants.R_OK | fs.constants.W_OK | fs.constants.X_OK;
        
        if(!this.dir){
            throw new Error('base dir should not be null');
        }

        fs.accessSync(this.dir, this.mode);
    }
    
    mkdir(domain, callback) {
        
        const self = this;
        
        let dirPath = path.join(this.dir, domain);

        if (this.dirs[dirPath] === true) {
            return callback(null, dirPath);
        }

        fs.access(dirPath, this.mode, function(err) {
            
            if(!err){
                return callback(null, dirPath);
            }

            fs.mkdir(dirPath, 0o755, function (err) {
                if(err){
                    return callback(err);
                }

                self.dirs[dirPath] = true;

                callback(null, dirPath);
            });
        });
    }
    
    
    persistence(domain, filename, readStream, callback){
        
        this.mkdir(domain, function (err, dirPath) {
            if(err){
                return callback(err);
            }

            let filePath = path.join(dirPath, filename);

            let writeStream = fs.createWriteStream(filePath, {
                flags: 'w',
                fd: null,
                mode: 0o644,
                autoClose: true
            });

            readStream.on('error', callback);

            writeStream.on('finish', function () {
                callback(null, filePath);
            });

            readStream.pipe(writeStream);
        });
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