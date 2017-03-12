const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;


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

                question_id = res.body.result.question_id;

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
            .get('/questions/find/attr_with_answer')
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
                    chai.expect(list[0]).to.have.ownProperty('question_id');
                    chai.expect(list[0]).to.have.ownProperty('question_title');
                    chai.expect(list[0]).to.have.ownProperty('question_describe');
                    chai.expect(list[0]).to.have.ownProperty('question_tags');
                    chai.expect(list[0]).to.have.ownProperty('question_answer_count');
                    chai.expect(list[0]).to.have.ownProperty('question_favour_count');
                    chai.expect(list[0]).to.have.ownProperty('create_user_id');
                    chai.expect(list[0]).to.have.ownProperty('create_user_name');
                    chai.expect(list[0]).to.have.ownProperty('create_user_avatar');
                }

                done();
            });
            
    });
});


describe('根据问题标题、描述搜索问题', function () {

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
            .get('/questions/find/attr')
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
                    chai.expect(list[0]).to.have.ownProperty('question_id');
                    chai.expect(list[0]).to.have.ownProperty('question_title');
                    chai.expect(list[0]).to.have.ownProperty('question_describe');
                    chai.expect(list[0]).to.have.ownProperty('question_tags');
                    chai.expect(list[0]).to.have.ownProperty('question_answer_count');
                    chai.expect(list[0]).to.have.ownProperty('question_favour_count');
                    chai.expect(list[0]).to.have.ownProperty('create_user_id');
                    chai.expect(list[0]).to.have.ownProperty('create_user_name');
                    chai.expect(list[0]).to.have.ownProperty('create_user_avatar');
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