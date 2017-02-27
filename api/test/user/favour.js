const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;

describe('用户对回答点赞', function() {
    it('#返回用户对回答点赞状态', function (done) {

        request(app)
            .put('/user/favour/answer')
            .send({
                answer_id: '58aaae950e95c9205f3db5db',
                question_id: '58aaae950e95c9205f3db5dc'
            })
            .expect(200)
            .end(function(err, res) {
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

describe('用户对回答评论点赞', function() {
    it('#返回用户对回答评论点赞状态', function (done) {

        request(app)
            .put('/user/favour/comment')
            .send({
                comment_id: '58aaae950e95c9205f3db5db',
                answer_id: '58aaae950e95c9205f3db5dc',
            })
            .expect(200)
            .end(function(err, res) {
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

describe('用户对文章点赞', function() {
    it('#返回用户对文章点赞状态', function (done) {

        request(app)
            .put('/user/favour/article')
            .send({
                article_id: '58aaae950e95c9205f3db5db'
            })
            .expect(200)
            .end(function(err, res) {
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

describe('用户取消对回答点赞', function() {
    
    let answerID = '58aaae950e95c9205f3db5db';
    let questionID = '58aaae950e95c9205f3db5dc';
    
    before(function(done) {
        request(app)
            .put('/user/favour/answer')
            .send({
                answer_id: answerID,
                question_id: questionID
            })
            .expect(200)
            .end(function(err, res) {
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
    
    it('#返回用户取消对回答点赞状态', function (done) {

        request(app)
            .delete('/user/favour/answer')
            .send({
                answer_id: answerID
            })
            .expect(200)
            .end(function(err, res) {
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

describe('用户取消对回答评论点赞', function() {
    
    let comment_id = '58aaae950e95c9205f3db5db';
    let answer_id = '58aaae950e95c9205f3db5dc';

    before(function(done) {
        request(app)
            .put('/user/favour/comment')
            .send({
                comment_id: comment_id,
                answer_id: answer_id
            })
            .expect(200)
            .end(function(err, res) {
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
    
    it('#返回用户取消对回答评论点赞状态', function (done) {

        request(app)
            .delete('/user/favour/comment')
            .send({
                comment_id: comment_id
            })
            .expect(200)
            .end(function(err, res) {
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

describe('用户取消对文章点赞', function() {
    
    let article_id = '58aaae950e95c9205f3db5db';
    
    before(function(done) {
        request(app)
            .put('/user/favour/article')
            .send({
                article_id: article_id
            })
            .expect(200)
            .end(function(err, res) {
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
    
    it('#返回用户取消对文章点赞状态', function (done) {

        request(app)
            .delete('/user/favour/article')
            .send({
                article_id: article_id
            })
            .expect(200)
            .end(function(err, res) {
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