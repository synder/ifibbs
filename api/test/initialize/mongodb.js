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

const Activity = db.model('Activity');
const QuestionAnswer = db.model('QuestionAnswer');
const Article = db.model('Article');
const AttentionQuestion = db.model('AttentionQuestion');
const AttentionSubject = db.model('AttentionSubject');
const AttentionUser = db.model('AttentionUser');
const SecurityCode = db.model('SecurityCode');
const UserAnswerCollection = db.model('UserAnswerCollection');
const UserArticleCollection = db.model('UserArticleCollection');
const AnswerComment = db.model('AnswerComment');
const UserDevice = db.model('UserDevice');
const UserFavourAnswer = db.model('UserFavourAnswer');
const UserFavourArticle = db.model('UserFavourArticle');
const UserFavourAnswerComment = db.model('UserFavourAnswerComment');
const UserHistory = db.model('UserHistory');
const UserNotification = db.model('UserNotification');
const Question = db.model('Question');
const Recommend = db.model('Recommend');
const QuestionTag = db.model('QuestionTag');
const Subject = db.model('Subject');
const User = db.model('User');
const UserDynamic = db.model('UserDynamic');
const UserShare = db.model('UserShare');

const USER_ID = "58aa50177ddbf5507c51f082";
const USER_ID_OTHER = "58aa50177ddbf5507c51f083";
const QUESTION_ID = "58ae5da34171fd177d387656";
const SUBJECT_ID = "58ae5da34171fd177d387637";
const ARTICLE_ID = "58ae5da34171fd177d387638";

const emptyCollection = function (callback) {
    async.parallel([
        function (cb) {Activity.remove({}, cb);},
        function (cb) {QuestionAnswer.remove({}, cb);},
        function (cb) {Article.remove({}, cb);},
        function (cb) {AttentionQuestion.remove({}, cb);},
        function (cb) {AttentionSubject.remove({}, cb);},
        function (cb) {AttentionUser.remove({}, cb);},
        function (cb) {SecurityCode.remove({}, cb);},
        function (cb) {UserAnswerCollection.remove({}, cb);},
        function (cb) {UserArticleCollection.remove({}, cb);},
        function (cb) {AnswerComment.remove({}, cb);},
        function (cb) {UserDevice.remove({}, cb);},
        function (cb) {UserFavourAnswer.remove({}, cb);},
        function (cb) {UserFavourArticle.remove({}, cb);},
        function (cb) {UserFavourAnswerComment.remove({}, cb);},
        function (cb) {UserHistory.remove({}, cb);},
        function (cb) {UserNotification.remove({}, cb);},
        function (cb) {Question.remove({}, cb);},
        function (cb) {Recommend.remove({}, cb);},
        function (cb) {QuestionTag.remove({}, cb);},
        function (cb) {Subject.remove({}, cb);},
        function (cb) {User.remove({}, cb);},
        function (cb) {UserDynamic.remove({}, cb);},
        function (cb) {UserShare.remove({}, cb);},
    ], callback);
};

/**
 * @desc 初始化专题数据
 * */
const initSubject = function (callback) {
    
    let icon = 'http://www.jkinst.com/zy-api/a/db/mongod/picture/58ad029de4b015ad71990518';
    let cover = 'http://www.jkinst.com/zy-api/a/db/mongod/picture/58ad029de4b015ad71990518';
    
    let docs = [];

    docs.push({
        _id            : SUBJECT_ID,
        status         : Subject.STATUS.ENABLE,
        title          : Mock.Random.ctitle(10,20),
        describe       : Mock.Random.ctitle(50,100),
        icon           : icon,
        cover          : cover,
        article_count  : 0,
        attention_count: 0,
        display_order  : Mock.Random.natural(1, 10),
        create_time    : new Date(),
        update_time    : new Date(),
    });
    
    for(let i = 0; i< 10; i++){
        docs.push({
            status         : Subject.STATUS.ENABLE,
            title          : Mock.Random.ctitle(10,20),
            describe       : Mock.Random.ctitle(50,100),
            icon           : icon,
            cover          : cover,
            article_count  : 0,
            attention_count: 0,
            display_order  : Mock.Random.natural(1, 10),
            create_time    : new Date(),
            update_time    : new Date(),
        });
    }
    
    Subject.create(docs, callback);
};


/**
 * @desc 初始化文章数据
 * */
const initArticle = function (callback) {

    let icon = 'http://www.jkinst.com/zy-api/a/db/mongod/picture/58ad029de4b015ad71990518';
    let cover = 'http://www.jkinst.com/zy-api/a/db/mongod/picture/58ad029de4b015ad71990518';
    
    let doc = {
        _id: ARTICLE_ID,
        status          : Article.STATUS.PUBLISHED,    //文章状态
        top             : true,    //是否置顶
        title           : Mock.Random.ctitle(10, 20),    //文章标题
        summary         : Mock.Random.ctitle(100, 200),    //文章摘要
        icon            : icon,    //文章图标
        cover           : cover,    //封面图片
        tags            : ['测试'],    //文章标签
        content         : Mock.Random.ctitle(100, 200),    //文章内容
        browse_count    : 6,    //浏览次数
        favour_count    : 7,    //被赞次数
        comment_count   : 8,    //被评论次数
        collect_count   : 9,    //被收藏次数
        create_time     : new Date(),    //创建时间
        update_time     : new Date(),    //更新时间
        subject_id      : SUBJECT_ID,  //文章所属主题
        create_user_id  : USER_ID      //创建人
    };
    
    Article.create(doc, callback);
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
        let activityID = new mongodb.ObjectId();
        let articleID = new mongodb.ObjectId();
        
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
        
        let activity = {
            _id             : activityID,
            status          : Activity.STATUS.DISPLAY,   //回答状态
            title           : Mock.Random.ctitle(10, 20),   //回答内容
            cover           : avatar,   //封面图片URL
            describe        : Mock.Random.ctitle(10, 20),   //封面图片URL
            url             : 'http://www.baidu.com',  //活动地址URL
            favour_count    : 0,   //点赞数量
            comment_count   : 0,   //评论数量
            collect_count   : 0,   //收藏数量
            create_time     : new Date(),   //创建时间
            update_time     : new Date(),   //更新时间
        };

        let article = {
            _id             : articleID,
            status          : Article.STATUS.PUBLISHED,    //文章状态
            top             : false,    //是否置顶
            title           : Mock.Random.ctitle(10, 20),    //文章标题
            summary         : Mock.Random.ctitle(10, 20),    //文章摘要
            icon            : avatar,    //文章图标
            cover           : avatar,    //封面图片
            tags            : ['基金'],    //文章标签
            content         : Mock.Random.ctitle(100, 200),    //文章内容
            browse_count    : 0,    //浏览次数
            favour_count    : 0,    //被赞次数
            comment_count   : 0,    //被评论次数
            collect_count   : 0,    //被收藏次数
            create_time     : new Date(),    //创建时间
            update_time     : new Date(),    //更新时间
            subject_id      : null,  //文章所属主题
            create_user_id  : null   //创建人
        };
        
        let tempRecommends = [];

        tempRecommends.push({
            status      : Recommend.STATUS.NORMAL,   //状态
            order       : Mock.Random.natural(1, 100),   //排序方式
            type        : Recommend.TYPE.QUESTION,   //排序方式
            create_time : new Date(),     //排序方式
            update_time : new Date(),     //排序方式
            question: questionID,
            answer: answerID,
            user: userID,
            activity    : null,  //推荐活动
            article     : null,  //推荐文章
        });

        tempRecommends.push({
            status      : Recommend.STATUS.NORMAL,   //状态
            order       : Mock.Random.natural(1, 100),   //排序方式
            type        : Recommend.TYPE.ACTIVITY,   //排序方式
            create_time : new Date(),     //排序方式
            update_time : new Date(),     //排序方式
            question    : null,  //推荐问题
            activity    : activityID,  //推荐活动
            article     : null,  //推荐文章
        });

        tempRecommends.push({
                status      : Recommend.STATUS.NORMAL,   //状态
                order       : Mock.Random.natural(1, 100),   //排序方式
                type        : Recommend.TYPE.ARTICLE,   //排序方式
                create_time : new Date(),     //排序方式
                update_time : new Date(),     //排序方式
                question    : null,  //推荐问题
                activity    : null,  //推荐活动
                article     : articleID,  //推荐文章
        });
        

        let temp = {
            user: user,
            question: question,
            answer: answer,
            activity: activity,
            article: article,
            recommends: tempRecommends
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
                Activity.create(recommend.activity, cb);
            },

            function(cb) {
                Article.create(recommend.article, cb);
            },

            function(cb) {
                Recommend.create(recommend.recommends, cb);
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

/*
 * @desc 初始化验证码
 * */

const initMongodbSecurityCode = function (callback) {

    let now = new Date();
    let expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 30);

    let securityCodeDoc = {
        _id          : '58bce997fc71500981a75187',
        status       : SecurityCode.STATUS.ENABLE,   //验证码状态
        random       : '0.8504996783854122',       //随机串
        mobile       : '13550501566',        //手机号码
        code         : '903488',         //验证码
        use_count    : 0,            //已验证次数
        expire_time  : expireTime,   //过期时间
        create_time  : now,          //创建时间
        update_time  : now,          //更新次数
    };

    SecurityCode.create(securityCodeDoc, callback);
};

exports.init = function (callback) {
    
    emptyCollection(function () {
        
        async.parallel([

            function (cb) {
                initSubject(cb);
            },

            function (cb) {
                initArticle(cb);
            },

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
            },

            function (cb) {
                initMongodbSecurityCode(cb);
            }

        ], callback);
        
    });
};



