/**
 * @author synder on 2017/3/4
 * @copyright
 * @desc
 */

const sequelize = require('sequelize');


exports.define = function (mysql) {
    
    if(!mysql.models){
        mysql.models = {};
    }
    
    /**
     * @desc 用户表
     * */
    mysql.models.User = mysql.define('user', {
        object_id    : {type: sequelize.CHAR(32), allowNull: false, unique: true},
        status       : {type: sequelize.INTEGER(32), allowNull: false},
        user_name    : {type: sequelize.CHAR(20)},      //用户名
        user_profile : {type: sequelize.STRING(200)},   //用户简介
        user_avatar  : {type: sequelize.STRING(200)},   //用户头像
        user_gender  : {type: sequelize.BOOLEAN},       //用户性别
        user_mobile  : {type: sequelize.CHAR(11)},      //用户手机
        create_time  : {type: sequelize.DATE, allowNull: false},
        update_time  : {type: sequelize.DATE, allowNull: false}
    }, {
        timestamps: false
    });


    /**
     * @desc 用户账户表
     * */
    mysql.models.UserAccount = mysql.define('user_account', {
        object_id       : {type: sequelize.CHAR(32), allowNull: false, unique: true},
        ios_balance     : {type: sequelize.FLOAT, allowNull: false},
        android_balance : {type: sequelize.FLOAT, allowNull: false},
        spend_amount    : {type: sequelize.FLOAT, allowNull: false},
        create_time     : {type: sequelize.DATE, allowNull: false},
        update_time     : {type: sequelize.DATE, allowNull: false}
    }, {
        timestamps: false
    });
    
    return mysql;
};
