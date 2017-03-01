const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;

describe('用户新增问题回答', function () {

    let questionID = null;

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

                questionID = res.body.result.question_id;

                done();
            });
    });

    it('#用户新增问题回答状态', function (done) {
        request(app)
            .put('/user/question/answer')
            .send({
                question_id: questionID,
                answer_content: Mock.Random.cparagraph(5, 10),
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
                chai.expect(res.body.result).to.have.ownProperty('answer_id');

                done();
            });
    });
});

describe('删除用户的问题回答', function () {
    
    let answerID = null;

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

                let questionID = res.body.result.question_id;

                request(app)
                    .put('/user/question/answer')
                    .send({
                        question_id: questionID,
                        answer_content: Mock.Random.cparagraph(5, 10),
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
                        chai.expect(res.body.result).to.have.ownProperty('answer_id');

                        answerID = res.body.result.answer_id;

                        done();

                    });
            });
    });

    it('#返回删除状态', function (done) {
        
        request(app)
            .delete('/user/question/answer')
            .query({
                answer_id: answerID,
            })
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.property('flag', '0000');
                chai.expect(res.body).to.have.property('msg', '');
                chai.expect(res.body).to.have.ownProperty('result');

                chai.expect(res.body.result).to.have.ownProperty('ok');

                done();
            });
    });
});

describe('获取用户问题回答列表', function () {
    it('#返回用户问题回答列表', function (done) {
        request(app)
            .get('/user/question/answers')
            .query({
                page_index: 1,
                page_size: 20
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
                    chai.expect(list[0]).to.have.ownProperty('answer_id');
                    chai.expect(list[0]).to.have.ownProperty('answer_content');
                    chai.expect(list[0]).to.have.ownProperty('question_id');
                    chai.expect(list[0]).to.have.ownProperty('question_title');
                    chai.expect(list[0]).to.have.ownProperty('question_tags');
                }

                done();
            });
    });
});

