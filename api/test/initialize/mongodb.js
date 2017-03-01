/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */

const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const mongodb = require('../../../public/service/mongodb').db;
const elasticsearch = require('../../../public/service/elasticsearch').client;

const QuestionTag = mongodb.model('QuestionTag');
const Question = mongodb.model('Question');
const QuestionAnswer = mongodb.model('QuestionAnswer');
const User = mongodb.model('User');

const USER_ID = "58aa50177ddbf5507c51f082";
const USER_ID_OTHER = "58aa50177ddbf5507c51f083";
const QUESTION_ID = "58ae5da34171fd177d387656";

const initQuestion = function (callback) {
    let questions = [];
    
    questions.push({
        "_id": QUESTION_ID,
        "status" : 1,
        "title" : Mock.Random.ctitle(5, 20),
        "describe" : Mock.Random.ctitle(50, 100),
        "answer_count" : 0,
        "favour_count" : 0,
        "attention_count" : 1,
        "collect_count" : 0,
        "create_user_id" : USER_ID,
        "create_time" : new Date(),
        "update_time" : new Date(),
        "tags" : [],
    });
    
    for(let i = 0; i < 100; i++){
        questions.push({
            "status" : 1,
            "title" : Mock.Random.ctitle(5, 20),
            "describe" : Mock.Random.ctitle(50, 100),
            "answer_count" : 0,
            "favour_count" : 0,
            "attention_count" : 1,
            "collect_count" : 0,
            "create_user_id" : USER_ID,
            "create_time" : new Date(),
            "update_time" : new Date(),
            "tags" : [],
        });
    }
    
    Question.create(questions, callback);
};

const initQuestionAnswer = function (callback) {
    
    let answers = [];
    
    for(let i = 0; i < 100; i++){
        answers.push({
            "status" : 1,
            "content" : Mock.Random.ctitle(20, 50),
            "comment_count" : 0,
            "favour_count" : 0,
            "collect_count" : 0,
            "question_id" : QUESTION_ID,
            "create_user_id" : USER_ID,
            "create_time" : new Date(),
            "update_time" : new Date(),
        });
    }

    QuestionAnswer.create(answers, callback);
};


/**
 * @desc 初始化用户数据
 * */
const initMongodbUserCollection = function (callback) {
    
    let avatar = 'http://www.jkinst.com/zy-api/a/db/mongod/picture/58ad029de4b015ad71990518';

    let userDoc = [
        {
            _id: USER_ID,
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
        },
        {
            _id: USER_ID_OTHER,
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

initQuestionAnswer(function () {
    
})

exports.init = function (callback) {
    async.parallel([
        
        function (cb) {
            initQuestion(cb);  
        },
        
        function (cb) {
            initQuestionAnswer(cb);
        },
        
        function (cb) {
            initMongodbUserCollection(cb);
        },

        function (cb) {
            initMongodbQuestionTagsCollection(cb);
        }
        
    ], callback);
};

