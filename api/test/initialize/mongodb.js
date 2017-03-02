/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */

const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');


const mongodb = require('../../../public/service/mongodb');
const elasticsearch = require('../../../public/service/elasticsearch').client;

const db = mongodb.db;

const QuestionTag = db.model('QuestionTag');
const Question = db.model('Question');
const QuestionAnswer = db.model('QuestionAnswer');
const User = db.model('User');
const Recommend = db.model('Recommend');

const USER_ID = "58aa50177ddbf5507c51f082";
const USER_ID_OTHER = "58aa50177ddbf5507c51f083";
const QUESTION_ID = "58ae5da34171fd177d387656";

const emptyCollection = function (callback) {
    async.parallel([
        function (cb) {
            QuestionTag.remove({}, cb);
        },

        function (cb) {
            Question.remove({}, cb);
        },

        function (cb) {
            QuestionAnswer.remove({}, cb);
        },

        function (cb) {
            User.remove({}, cb);
        },

        function (cb) {
            Recommend.remove({}, cb);
        },
    ], callback);
};

/**
 * @desc 初始化问题数据
 * */
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


/**
 * @desc 初始化问题回答数据
 * */
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
 * @desc 初始化推荐数据
 * */
const initRecommend = function (callback) {
    let recommends = [];

    let avatar = 'http://www.jkinst.com/zy-api/a/db/mongod/picture/58ad029de4b015ad71990518';
    
    for(let i = 0; i < 100; i++){
        
        let userID = new mongodb.ObjectId();
        let questionID = new mongodb.ObjectId();
        let answerID = new mongodb.ObjectId();
        
        let user = {
            _id: userID,
            status: User.STATUS.NORMAL, //用户状态
            user_name: Mock.Random.ctitle(4, 6),   //用户名
            user_profile: Mock.Random.ctitle(10, 20),   //用户简介
            user_avatar: avatar,   //用户头像
            create_time: new Date(),     //创建时间
            update_time: new Date(),     //更新时间
            user_gender: false, //用户性别
            user_mobile: '13120975917',  //用户手机
            work_info: Mock.Random.ctitle(10, 20),  //用户性别
            edu_info: Mock.Random.ctitle(10, 20),  //用户性别
        };
        
        let question = {
            "_id": questionID,
            "status" : 1,
            "title" : Mock.Random.ctitle(5, 20),
            "describe" : Mock.Random.ctitle(50, 100),
            "answer_count" : 0,
            "favour_count" : 0,
            "attention_count" : 1,
            "collect_count" : 0,
            "create_user_id" : userID,
            "create_time" : new Date(),
            "update_time" : new Date(),
            "tags" : [],
        };
        
        let answer = {
            "_id": answerID,
            "status" : 1,
            "content" : Mock.Random.ctitle(20, 50),
            "comment_count" : 0,
            "favour_count" : 0,
            "collect_count" : 0,
            "question_id" : questionID,
            "create_user_id" : userID,
            "create_time" : new Date(),
            "update_time" : new Date(),
        };
        
        let recommend = {
            status      : Recommend.STATUS.NORMAL,   //状态
            order       : Mock.Random.natural(1, 100),   //排序方式
            type        : Recommend.TYPE.QUESTION,   //排序方式
            create_time : new Date(),     //排序方式
            update_time : new Date(),     //排序方式
            question    : {
                question_id: questionID,
                answer_id: answerID,
                answer_user_id: userID,
            },  //推荐问题
            activity    : null,  //推荐活动
            article     : null,  //推荐文章
        };

        let temp = {
            user: user,
            question: question,
            answer: answer,
            recommend: recommend
        };

        recommends.push(temp);
    }
    
    async.eachLimit(recommends, 10, function(recommend, cb){
        
        
        async.series([
            function(cb) {
                User.create(recommend.user, cb);
            },
            
            function(cb) { 
                Question.create(recommend.question, cb);
            },

            function(cb) {
                QuestionAnswer.create(recommend.answer, cb);
            },

            function(cb) {
                Recommend.create(recommend.recommend, cb);
            },
        ], cb);
        
    }, callback);
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

    User.create(userDoc, callback);
    
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
};

exports.init = function (callback) {
    
    emptyCollection(function () {
        
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
                initRecommend(cb);
            },

            function (cb) {
                initMongodbQuestionTagsCollection(cb);
            }

        ], callback);
        
    });
};

