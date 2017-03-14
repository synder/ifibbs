/**
 * @author synder on 2017/3/13
 * @copyright
 * @desc
 */

const path = require('path');
const async = require('async');

const fileMongodb = require('../service/mongodb/file');
const ifibbsFile = require('../service/file/ifibbs');

const fileMongodbClient = fileMongodb.client;
const ifibbsFileClient = ifibbsFile.client;

const ImageFile = fileMongodbClient.model('ImageFile');

exports.saveUserUploadImages = function (ext, mime, domain, readStream, callback) {
    
    let filename = fileMongodb.ObjectId().toString() + ext;
    
    ifibbsFileClient.persistence(domain, filename, readStream, function (err, filePath) {
        if(err){
            return callback(err);
        }

        ImageFile.create({
            status          : ImageFile.STATUS.ENABLE,       //图片状态
            belong_app      : ImageFile.APPS.IFIBBS_API,     //所属APP
            file_mime       : mime,                          //图片MIME
            file_path       : filePath,                      //回答内容
            file_name       : filename,                      //图片名称
            create_time     : new Date(),                    //创建时间
            update_time     : new Date(),                    //更新时间
        }, callback);
    });
    
};

exports.saveAdminUploadImages = function (ext, mime, domain, readStream, callback) {
    
    let filename = fileMongodb.ObjectId() + ext;

    ifibbsFileClient.persistence(domain, filename, readStream, function (err, filename, filePath) {
        if(err){
            return callback(err);
        }

        ImageFile.create({
            status          : ImageFile.STATUS.ENABLE,       //图片状态
            belong_app      : ImageFile.APPS.IFIBBS_ADMIN,   //所属APP
            file_mime       : mime,                          //图片MIME
            file_path       : filePath,                      //回答内容
            file_name       : filename,                      //图片名称
            create_time     : new Date(),                    //创建时间
            update_time     : new Date(),                    //更新时间
        }, callback);
    });

};