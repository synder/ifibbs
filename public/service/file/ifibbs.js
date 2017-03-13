/**
 * @author synder on 2017/3/13
 * @copyright
 * @desc 文件服务
 */

const config = require('../config');
const LocalFileService = require('./lib/index').LocalFileService;

if(!config && !config.file && !config.file.ifibbs){
    throw new Error('please provide file.ifibbs config');
}

const IFIBBS_CONFIG = config.file.ifibbs;

const client = new LocalFileService(IFIBBS_CONFIG.image);

exports.client = client;
