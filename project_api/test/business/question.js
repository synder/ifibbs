const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;


describe('首页获取推荐问题列表', function () {
    it('#返回推荐问题列表', function (done) {

        let pageSize = Mock.Random.natural(10, 20);
        let pageIndex = Mock.Random.natural(1, 2);

        request(app)
            .get('/questions/recommend')
            .query({
                page_size: pageSize,
                page_index: pageIndex
            })
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.property('flag', '0000');
                chai.expect(res.body).to.have.property('msg', '');
                chai.expect(res.body).to.have.ownProperty('result');

                chai.expect(res.body.result).to.have.ownProperty('count');
                chai.expect(res.body.result).to.have.ownProperty('list');

                let list = res.body.result.list;

                if (list.length > 0) {
                    chai.expect(list[0]).to.have.ownProperty('id');
                    chai.expect(list[0]).to.have.ownProperty('title');
                    chai.expect(list[0]).to.have.ownProperty('tags');
                    chai.expect(list[0]).to.have.ownProperty('describe');
                    chai.expect(list[0]).to.have.ownProperty('answer_count');
                    chai.expect(list[0]).to.have.ownProperty('favour_count');
                    chai.expect(list[0]).to.have.ownProperty('attention_count');
                    chai.expect(list[0]).to.have.ownProperty('collect_count');
                    chai.expect(list[0]).to.have.ownProperty('create_time');
                }

                done();
            });
    });
});


describe('获取问题详情', function () {

    let question_id;

    before(function (done) {
        request(app)
            .put('/user/question')
            .send({
                title: Mock.Random.ctitle(3, 20),
                describe: Mock.Random.cparagraph(10, 50),
                tags: []
            })
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.property('flag', '0000');
                chai.expect(res.body).to.have.property('msg', '');
                chai.expect(res.body).to.have.ownProperty('result');

                chai.expect(res.body.result).to.have.ownProperty('question_id');

                question_id = res.body.result.question_id

                done();
            });
    });

    it('#返回问题详情', function (done) {
        request(app)
            .get('/question')
            .query({
                question_id: question_id
            })
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.property('flag', '0000');
                chai.expect(res.body).to.have.property('msg', '');
                chai.expect(res.body).to.have.ownProperty('result');

                chai.expect(res.body.result).to.have.ownProperty('id');
                chai.expect(res.body.result).to.have.ownProperty('title');
                chai.expect(res.body.result).to.have.ownProperty('describe');
                chai.expect(res.body.result).to.have.ownProperty('tags');
                chai.expect(res.body.result).to.have.ownProperty('is_attented');
                chai.expect(res.body.result).to.have.ownProperty('answer_count');
                chai.expect(res.body.result).to.have.ownProperty('favour_count');
                chai.expect(res.body.result).to.have.ownProperty('attention_count');
                chai.expect(res.body.result).to.have.ownProperty('collect_count');
                chai.expect(res.body.result).to.have.ownProperty('create_user_id');
                chai.expect(res.body.result).to.have.ownProperty('create_time');

                done();
            });

    });
});


describe('根据问题标题、描述和问题回答搜索问题', function () {

    let searchTitle = Mock.Random.ctitle(5, 10);
    let searchDescribe = Mock.Random.ctitle(5, 10);

    let title = Mock.Random.ctitle(3, 10) + searchTitle;
    let describe = Mock.Random.cparagraph(2, 5) + searchDescribe;

    before(function (done) {
        request(app)
            .put('/user/question')
            .send({
                title: title,
                describe: describe,
                tags: []
            })
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.property('flag', '0000');
                chai.expect(res.body).to.have.property('msg', '');
                chai.expect(res.body).to.have.ownProperty('result');

                chai.expect(res.body.result).to.have.ownProperty('question_id');

                done();
            });
    });

    it('#根据标题搜索问题', function (done) {
        
        request(app)
            .get('/questions/find')
            .query({
                content: searchTitle,
                page_size: 20,
                page_index: 1
            })
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.property('flag', '0000');
                chai.expect(res.body).to.have.property('msg', '');
                chai.expect(res.body).to.have.ownProperty('result');


                chai.expect(res.body.result).to.have.ownProperty('count');
                chai.expect(res.body.result).to.have.ownProperty('list');

                let list = res.body.result.list;

                if (list.length > 0) {
                    chai.expect(list[0]).to.have.ownProperty('id');
                    chai.expect(list[0]).to.have.ownProperty('title');
                    chai.expect(list[0]).to.have.ownProperty('describe');
                    chai.expect(list[0]).to.have.ownProperty('tags');
                    chai.expect(list[0]).to.have.ownProperty('answer_count');
                    chai.expect(list[0]).to.have.ownProperty('favour_count');
                    chai.expect(list[0]).to.have.ownProperty('type');
                }

                done();
            });
            
    });
});


describe('根据问题回答搜索问题', function () {

    let searchTitle = Mock.Random.ctitle(5, 10);
    let searchDescribe = Mock.Random.ctitle(5, 10);

    let title = Mock.Random.ctitle(3, 10) + searchTitle;
    let describe = Mock.Random.cparagraph(2, 5) + searchDescribe;

    before(function (done) {
        
        return done();
        
        async.waterfall([
            function(cb) {
                request(app)
                    .put('/user/question')
                    .send({
                        title: title,
                        describe: describe,
                        tags: []
                    })
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return cb(err);
                        }
                        
                        cb(null, res.body.result.question_id);
                    });
            },
            
            function(questionID, cb) {
                request(app)
                    .put('/user/question')
                    .send({})
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return cb(err);
                        }

                        cb(null, res.body.result.question_id);
                    });
            },
        ], function (err, result) {
            if(err){
                throw err;
            }
            
            done();
        });
    });

    it('#根据标题搜索问题', function (done) {

        request(app)
            .get('/questions/find')
            .query({
                content: searchTitle,
                page_size: 20,
                page_index: 1
            })
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.property('flag', '0000');
                chai.expect(res.body).to.have.property('msg', '');
                chai.expect(res.body).to.have.ownProperty('result');


                chai.expect(res.body.result).to.have.ownProperty('count');
                chai.expect(res.body.result).to.have.ownProperty('list');

                let list = res.body.result.list;

                if (list.length > 0) {
                    chai.expect(list[0]).to.have.ownProperty('id');
                    chai.expect(list[0]).to.have.ownProperty('title');
                    chai.expect(list[0]).to.have.ownProperty('describe');
                    chai.expect(list[0]).to.have.ownProperty('tags');
                    chai.expect(list[0]).to.have.ownProperty('answer_count');
                    chai.expect(list[0]).to.have.ownProperty('favour_count');
                    chai.expect(list[0]).to.have.ownProperty('type');
                }

                done();
            });

    });
});


describe('获取问题默认TAGS列表', function () {
    
    it('#返回TAG列表', function (done) {
        request(app)
            .get('/question/tags/default')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.property('flag', '0000');
                chai.expect(res.body).to.have.property('msg', '');
                chai.expect(res.body).to.have.ownProperty('result');

                chai.expect(res.body.result).to.have.ownProperty('count');
                chai.expect(res.body.result).to.have.ownProperty('list');

                let list = res.body.result.list;

                if (list.length > 0) {
                    chai.expect(list[0]).to.have.ownProperty('id');
                    chai.expect(list[0]).to.have.ownProperty('title');
                    chai.expect(list[0]).to.have.ownProperty('describe');
                    chai.expect(list[0]).to.have.ownProperty('icon');
                }

                done();
            });
    });
});


describe('根据关键词搜索TAG', function () {
    it('#返回TAG列表', function (done) {
        request(app)
            .get('/question/tags/find')
            .query({
                content: '投资基金'
            })
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.property('flag', '0000');
                chai.expect(res.body).to.have.property('msg', '');
                chai.expect(res.body).to.have.ownProperty('result');

                chai.expect(res.body.result).to.have.ownProperty('list');
                chai.expect(res.body.result).to.have.ownProperty('count');

                let list = res.body.result.list;

                if (list.length > 0) {
                    chai.expect(list[0]).to.have.ownProperty('id');
                    chai.expect(list[0]).to.have.ownProperty('title');
                    chai.expect(list[0]).to.have.ownProperty('describe');
                    chai.expect(list[0]).to.have.ownProperty('icon');
                }


                done();
            });
    });
});