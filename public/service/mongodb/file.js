/**
 * @author synder
 * @date 16/1/10
 * @desc
 */

const mongoose = require('mongoose');

const config = require('../config');

mongoose.Promise = global.Promise;

if(!config && !config.mongodb && !config.mongodb.file){
    throw new Error('please provide mongodb config');
}

const FILE_CONFIG = config.mongodb.file;

const client = mongoose.createConnection(FILE_CONFIG.url, {
    user: FILE_CONFIG.user,
    pass: FILE_CONFIG.password
});

client.on('error', function(err){
    console.error(err.stack);
});


//define file model===========================================
const image = require('./file_schema/image');

client.model('ImageFile', image.ImageFileSchema, 'image_file');

exports.client = client;
exports.mongoose = mongoose;
exports.ObjectId = mongoose.Types.ObjectId;