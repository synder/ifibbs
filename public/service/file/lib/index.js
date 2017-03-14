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
        
        this.dirs = {};
        
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
    
    mkdir(domain, callback) {
        
        const self = this;
        
        let dirPath = path.join(this.dir, domain);

        if (this.dirs[dirPath] === true) {
            return callback(null, dirPath);
        }

        mkdirp(dirPath, function (err) {
            if(err){
                return callback(err);
            }

            self.dirs[dirPath] = true;
            
            callback(null, dirPath);
        });
    }
    
    
    persistence(domain, filename, readStream, callback){
        
        this.mkdir(domain, function (err, dirPath) {
            if(err){
                return callback(err);
            }
            
            console.log(dirPath);

            let filePath = path.join(dirPath, filename);

            console.log(filePath);

            let writeStream = fs.createWriteStream(filePath);

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