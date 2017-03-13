/**
 * @author synder on 2017/3/3
 * @copyright
 * @desc
 */

const Sequelize = require('sequelize');

const config = require('../config');

if(!config && !config.mysql && config.mysql.user && config.mysql.ifibbs){
    throw new Error('please provide mongodb config');
}

const IFIBBS_CONFIG = config.mysql.ifibbs;

const IFIBBS_CLIENT = new Sequelize(IFIBBS_CONFIG.database, IFIBBS_CONFIG.username, IFIBBS_CONFIG.password, {
    host: IFIBBS_CONFIG.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});

const user = require('./ifibbs/user');

exports.client = user.define(IFIBBS_CLIENT);

exports.init = function () {
    if(process.env.INIT_MYSQL === 'yes'){
        IFIBBS_CLIENT.sync({force: true}).then(function (err) {
            if(err){
                return console.error(err);
            }

            console.log('init mysql success');
        });
    }
};