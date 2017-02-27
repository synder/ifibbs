const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;


describe('获取回答评论列表', function () {

    let questionID;
    let answerID;

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

                        request(app)
                            .put('/user/question/answer/comment')
                            .send({
                                to_user_id: null,
                                to_comment_id: null,
                                question_id: questionID,
                                answer_id: answerID,
                                content: Mock.Random.ctitle(10, 20)
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
                                chai.expect(res.body.result).to.have.ownProperty('comment_id');

                                done();
                            });
                    });
            });
    });

    it('#返回回答评论列表', function (done) {
        
        request(app)
            .get('/question/answer/comments')
            .query({
                page_size: 20,
                page_index: 1,
                question_id: questionID,
                answer_id: answerID
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
                    chai.expect(list[0]).to.have.ownProperty('answer_id');
                    chai.expect(list[0]).to.have.ownProperty('user_id');
                    chai.expect(list[0]).to.have.ownProperty('user_avatar');
                    chai.expect(list[0]).to.have.ownProperty('user_name');
                    chai.expect(list[0]).to.have.ownProperty('to_user_id');
                    chai.expect(list[0]).to.have.ownProperty('to_user_name');
                    chai.expect(list[0]).to.have.ownProperty('comment_id');
                    chai.expect(list[0]).to.have.ownProperty('content');
                }

                done();
            });
    });
});