/**
 * @author synder on 2017/3/3
 * @copyright
 * @desc
 */

const config = require('../config');

const Sequelize = require('sequelize');

const user = require('./schema/user');

if(!config && !config.mysql && config.mysql.user && config.mysql.host){
    throw new Error('please provide mongodb config');
}

const mysql = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
    host: config.mysql.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});

exports.db = user.define(mysql);


if(process.env.INIT_MYSQL === 'yes'){
    mysql.sync({force: true}).then(function (err) {
        if(err){
            return console.error(err);
        }
        
        console.log('init mysql success');
    });
}