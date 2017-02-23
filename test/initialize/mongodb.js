/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */

const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const mongodb = require('../../service/mongodb').db;
const elasticsearch = require('../../service/elasticsearch').client;

const QuestionTag = mongodb.model('QuestionTag');
const User = mongodb.model('User');


/**
 * @desc 初始化用户数据
 * */
const initMongodbUserCollection = function (callback) {
    
    let avatar = 'http://www.jkinst.com/zy-api/a/db/mongod/picture/58ad029de4b015ad71990518';

    let userDoc = [
        {
            _id: '58aa50177ddbf5507c51f082',
            status: User.STATUS.NORMAL, //用户状态
            user_name: 'synder',   //用户名
            user_profile: Mock.Random.ctitle(10, 20),   //用户简介
            user_avatar: avatar,   //用户头像
            create_time: new Date(),     //创建时间
            update_time: new Date(),     //更新时间
            user_gender: false, //用户性别
            user_mobile: '13120975917',  //用户手机
            work_info: Mock.Random.ctitle(10, 20),  //用户性别
            edu_info: Mock.Random.ctitle(10, 20),  //用户性别
            device_token: Mock.Random.guid(),  //设备Token
        },
        {
            _id: '58aa50177ddbf5507c51f083',
            status: User.STATUS.NORMAL,   //用户状态
            user_name: 'sam',   //用户名
            user_profile: Mock.Random.ctitle(10, 20),   //用户简介
            user_avatar: avatar,   //用户头像
            create_time: new Date(),     //创建时间
            update_time: new Date(),     //更新时间
            user_gender: false, //用户性别
            user_mobile: '13120975916',  //用户手机
            work_info: Mock.Random.ctitle(10, 20),  //用户性别
            edu_info: Mock.Random.ctitle(10, 20),  //用户性别
            device_token: Mock.Random.guid(),  //设备Token
        }
    ];
    
    User.remove({}, function () {
        User.create(userDoc, callback);
    });
    
};

/**
 * @desc 初始化标签数据库
 * */
const initMongodbQuestionTagsCollection = function (callback) {

    let icon = 'http://www.jkinst.com/zy-api/a/db/mongod/picture/58ad029de4b015ad71990518';
    
    let tags = [{
        status: QuestionTag.STATUS.RECOMMEND,
        title: '基金',
        icon: icon,
        describe: '基金（Fund）从广义上说，基金是指为了某种目的而设立的具有一定数量的资金。主要包括信托投资基金、公积金、保险基金、退休基金，各种基金会的基金。人们平常所说的基金主要是指证券投资基金',
        create_time: new Date(),
        update_time: new Date()
    }];

    for (let i = 0; i < 12; i++) {
        tags.push({
            status: QuestionTag.STATUS.RECOMMEND,
            title: Mock.Random.ctitle(2, 4),
            icon: icon,
            describe: Mock.Random.ctitle(20, 30),
            create_time: new Date(),
            update_time: new Date()
        });
    }

    for (let i = 0; i < 12; i++) {
        tags.push({
            status: QuestionTag.STATUS.ENABLE,
            title: Mock.Random.ctitle(2, 4),
            icon: icon,
            describe: Mock.Random.ctitle(20, 30),
            create_time: new Date(),
            update_time: new Date()
        });
    }

    QuestionTag.remove({}, function () {

        elasticsearch.deleteByQuery({
            index: elasticsearch.indices.tags,
            body: {
                query: {
                    match_all: ''
                }
            }
        }, function (error, response) {

            
            
            QuestionTag.create(tags, function (err, tags) {
                if (err) {
                    return callback(err);
                }
                
                let elasticTagsDocuments = [];
                
                tags.forEach(function (tag) {
                    elasticTagsDocuments.push({ 
                        "index" : { 
                            "_index" : elasticsearch.indices.tags,
                            "_type" : elasticsearch.indices.tags, 
                            "_id" : tag._id.toString() 
                        } 
                    });
                    elasticTagsDocuments.push({
                        icon: tag.icon,
                        title: tag.title,
                        describe: tag.describe,
                    });
                });

                elasticsearch.bulk({
                    body: elasticTagsDocuments
                }, callback);
            });
        });
    });
};

exports.init = function (callback) {
    async.parallel([
        function (cb) {
            initMongodbUserCollection(cb);
        },

        function (cb) {
            initMongodbQuestionTagsCollection(cb);
        }
        
    ], callback);
};

