/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */

const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;

describe('用户新增回答评论', function(){
    it('#返回用户新增回答评论状态', function(done) {

        request(app)
            .put('/user/question')
            .send({
                title: Mock.Random.ctitle(3, 20),
                describe: Mock.Random.cparagraph(10, 50),
                tags: []
            })
            .expect(200)
            .end(function(err, res) {
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
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        chai.expect(res.body).to.have.property('flag', '0000');
                        chai.expect(res.body).to.have.property('msg', '');

                        chai.expect(res.body).to.have.ownProperty('result');
                        chai.expect(res.body.result).to.have.ownProperty('question_id');
                        chai.expect(res.body.result).to.have.ownProperty('answer_id');
                        
                        let answerID = res.body.result.answer_id;

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
                            .end(function(err, res) {
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
});


describe('用户删除回答评论', function(){
    it('#返回用户新增回答评论状态', function(done) {

        request(app)
            .put('/user/question')
            .send({
                title: Mock.Random.ctitle(3, 20),
                describe: Mock.Random.cparagraph(10, 50),
                tags: []
            })
            .expect(200)
            .end(function(err, res) {
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
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        chai.expect(res.body).to.have.property('flag', '0000');
                        chai.expect(res.body).to.have.property('msg', '');

                        chai.expect(res.body).to.have.ownProperty('result');
                        chai.expect(res.body.result).to.have.ownProperty('question_id');
                        chai.expect(res.body.result).to.have.ownProperty('answer_id');

                        let answerID = res.body.result.answer_id;

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
                            .end(function(err, res) {
                                if (err) {
                                    throw err;
                                }

                                chai.expect(res.body).to.have.property('flag', '0000');
                                chai.expect(res.body).to.have.property('msg', '');

                                chai.expect(res.body).to.have.ownProperty('result');
                                chai.expect(res.body.result).to.have.ownProperty('question_id');
                                chai.expect(res.body.result).to.have.ownProperty('answer_id');
                                chai.expect(res.body.result).to.have.ownProperty('comment_id');
                                
                                let commentID = res.body.result.comment_id;

                                request(app)
                                    .delete('/user/question/answer/comment')
                                    .send({
                                        comment_id: commentID,
                                    })
                                    .expect(200)
                                    .end(function(err, res) {
                                        if (err) {
                                            throw err;
                                        }

                                        chai.expect(res.body).to.have.property('flag', '0000');
                                        chai.expect(res.body).to.have.property('msg', '');

                                        chai.expect(res.body).to.have.ownProperty('result');
                                        chai.expect(res.body.result).to.have.property('ok', true);

                                        done();
                                    });
                            });
                    });
            });


    });
});


describe('用户获取自己的回答评论列表', function () {
    it('#返回用户获取自己的回答评论列表', function (done) {

        let pageSize = Mock.Random.natural(10, 20);
        let pageIndex = Mock.Random.natural(1, 2);

        request(app)
            .put('/user/question')
            .send({
                title: Mock.Random.ctitle(3, 20),
                describe: Mock.Random.cparagraph(10, 50),
                tags: []
            })
            .expect(200)
            .end(function(err, res) {
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
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        chai.expect(res.body).to.have.property('flag', '0000');
                        chai.expect(res.body).to.have.property('msg', '');

                        chai.expect(res.body).to.have.ownProperty('result');
                        chai.expect(res.body.result).to.have.ownProperty('question_id');
                        chai.expect(res.body.result).to.have.ownProperty('answer_id');

                        let answerID = res.body.result.answer_id;

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
                            .end(function(err, res) {
                                if (err) {
                                    throw err;
                                }

                                chai.expect(res.body).to.have.property('flag', '0000');
                                chai.expect(res.body).to.have.property('msg', '');

                                chai.expect(res.body).to.have.ownProperty('result');
                                chai.expect(res.body.result).to.have.ownProperty('question_id');
                                chai.expect(res.body.result).to.have.ownProperty('answer_id');
                                chai.expect(res.body.result).to.have.ownProperty('comment_id');

                                request(app)
                                    .get('/user/question/answer/comments')
                                    .query({
                                        page_size: pageSize,
                                        page_index: pageIndex
                                    })
                                    .expect(200)
                                    .end(function (err, res) {
                                        if(err){
                                            throw err;
                                        }

                                        chai.expect(res.body).to.have.property('flag', '0000');
                                        chai.expect(res.body).to.have.property('msg', '');
                                        chai.expect(res.body).to.have.ownProperty('result');

                                        chai.expect(res.body.result).to.have.ownProperty('count');
                                        chai.expect(res.body.result).to.have.ownProperty('list');

                                        let list = res.body.result.list;

                                        if(list.length > 0){
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
            });


    });
});
