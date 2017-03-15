/**
 * @author synder on 2017/3/15
 * @copyright
 * @desc
 */

const path = require('path');
const Naemon = require('./lib/naemon');
const Logger = require('./lib/logger');
const error = require('./lib/error');

const config = global.config = require('./config');
const logger = global.logger = new Logger(config.log);

const daemon = new Naemon();

daemon.start(path.join(config.project.path, './jobs/recommend_answer.js'), null, null, function (err) {
    if(err){
        logger.error(err);
    }
});

daemon.start(path.join(config.project.path, './jobs/recommend_article.js'), null, null, function (err) {
    if(err){
        logger.error(err);
    }
});

daemon.start(path.join(config.project.path, './jobs/recommend_answer.js'), null, null, function (err) {
    if(err){
        logger.error(err);
    }
});