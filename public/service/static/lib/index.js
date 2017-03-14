/**
 * @author synder on 2017/3/13
 * @copyright
 * @desc
 */


const fs = require('fs');
const path = require('path');

class DefaultFileService {
    
    constructor(base){
        this.base = base;
    }

    persistence(filename, stream, callback){
        
    }
}

class LocalFileService extends DefaultFileService {
    
    constructor(base, domains){
        super(base);
        
        const self = this;

        self.domains = {};

        self.mode = fs.constants.R_OK | fs.constants.W_OK | fs.constants.X_OK;
        
        if(!Array.isArray(domains)){
            throw new Error('domains must be array type');
        }
        
        if(!self.base){
            throw new Error('base dir should not be null');
        }

        fs.accessSync(self.base, self.mode);

        domains.forEach(function (domain) {
            self.domains[domain] = true;
            fs.accessSync(path.join(self.base, domain), self.mode);
        });
    }
    
    
    persistence(domain, filename, readStream, callback){
        
        if(!this.domains[domain]){
            return callback(new Error(domain + 'is not allow to update'));
        }
        
        let filePath = path.join(this.base, domain, filename);

        let writeStream = fs.createWriteStream(filePath);

        readStream.on('error', function (err) {
            console.error(err.stack);
            fs.unlink(filePath);
        });
        
        writeStream.on('error', function (err) {
            console.error(err.stack);
            fs.unlink(filePath);
        });

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