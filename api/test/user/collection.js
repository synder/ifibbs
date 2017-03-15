const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;

describe('用户添加收藏答案', function() {
    
    let questionID = "58ae5da34171fd177d387656";
    let answerID;
    
    before(function(done) {
        request(app)
            .put('/user/question/answer')
            .send({
                question_id: questionID,
                answer_content: encodeURIComponent(Mock.Random.cparagraph(5, 10)),
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
    
    it('#返回用户添加收藏答案状态', function (done) {

        request(app)
            .put('/user/collection/answer')
            .send({
                question_id: questionID,
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

describe('用户添加收藏文章', function() {
    it('#返回用户添加收藏文章状态', function (done) {

        request(app)
            .put('/user/collection/article')
            .send({
                subject_id: "58ae5da34171fd177d387637",
                article_id: '58ae5da34171fd177d387638'
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

describe('用户取消收藏答案', function() {
    it('#返回用户取消收藏答案状态', function (done) {

        request(app)
            .delete('/user/collection/answer')
            .query({
                answer_id: '58ae5da34171fd177d387638'
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

describe('用户取消收藏文章', function() {
    it('#返回用户取消收藏文章状态', function (done) {

        request(app)
            .delete('/user/collection/article')
            .query({
                article_id: '58ae5da34171fd177d387638'
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

describe('用户收藏列表', function() {
    it('#返回用户文章收藏列表', function (done) {

        request(app)
            .get('/user/collections/article')
            .query({
                page_size: 20,
                page_index: 1,
                user_id: '58aa50177ddbf5507c51f082'
            })
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.property('flag', '0000');
                chai.expect(res.body).to.have.property('msg', '');

                chai.expect(res.body).to.have.ownProperty('result');
                chai.expect(res.body.result).to.have.ownProperty('count');
                chai.expect(res.body.result).to.have.ownProperty('list');
                
                let list = res.body.result.list;
                
                if(list.length > 0){
                    chai.expect(list[0]).to.have.ownProperty('collection_id');
                    chai.expect(list[0]).to.have.ownProperty('article_id');
                    chai.expect(list[0]).to.have.ownProperty('article_title');
                    chai.expect(list[0]).to.have.ownProperty('article_favour_count');
                    chai.expect(list[0]).to.have.ownProperty('article_comment_count');
                    chai.expect(list[0]).to.have.ownProperty('article_collect_count');
                    chai.expect(list[0]).to.have.ownProperty('article_browse_count');
                }

                done();
            });
    });

    it('#返回用户回答收藏列表', function (done) {

        request(app)
            .get('/user/collections/answer')
            .query({
                page_size: 20,
                page_index: 1,
                user_id: '58aa50177ddbf5507c51f082'
            })
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.property('flag', '0000');
                chai.expect(res.body).to.have.property('msg', '');

                chai.expect(res.body).to.have.ownProperty('result');
                chai.expect(res.body.result).to.have.ownProperty('count');
                chai.expect(res.body.result).to.have.ownProperty('list');

                let list = res.body.result.list;

                if(list.length > 0){
                    chai.expect(list[0]).to.have.ownProperty('collection_id');
                    chai.expect(list[0]).to.have.ownProperty('question_id');
                    chai.expect(list[0]).to.have.ownProperty('question_title');
                    chai.expect(list[0]).to.have.ownProperty('answer_id');
                    chai.expect(list[0]).to.have.ownProperty('answer_content');
                    chai.expect(list[0]).to.have.ownProperty('answer_comment_count');
                    chai.expect(list[0]).to.have.ownProperty('answer_favour_count');
                    chai.expect(list[0]).to.have.ownProperty('answer_collect_count');
                }

                done();
            });
    });
});