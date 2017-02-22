const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;

describe('用户添加收藏答案', function() {
    it('#返回用户添加收藏答案状态', function (done) {

        request(app)
            .put('/user/collection/answer')
            .send({
                question_id: '58aaae950e95c9205f3db5dc',
                answer_id: '58aaae950e95c9205f3db5db'
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

describe('用户添加收藏文章', function() {
    it('#返回用户添加收藏文章状态', function (done) {

        request(app)
            .put('/user/collection/article')
            .send({
                subject_id: '58aaae950e95c9205f3db5dc',
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
                chai.expect(res.body.result).to.have.property('ok', true);

                done();
            });
    });
});

describe('用户取消收藏答案', function() {
    it('#返回用户取消收藏答案状态', function (done) {

        request(app)
            .delete('/user/collection/answer')
            .send({
                answer_id: '58aaae950e95c9205f3db5db'
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

describe('用户取消收藏文章', function() {
    it('#返回用户取消收藏文章状态', function (done) {

        request(app)
            .delete('/user/collection/article')
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
                chai.expect(res.body.result).to.have.property('ok', true);

                done();
            });
    });
});

describe('用户收藏列表', function() {
    it('#返回用户收藏列表', function (done) {

        request(app)
            .get('/user/collections')
            .send({
                page_size: 20,
                page_index: 1
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
                    chai.expect(list[0]).to.have.ownProperty('id');
                    chai.expect(list[0]).to.have.ownProperty('title');
                    chai.expect(list[0]).to.have.ownProperty('tags');
                    chai.expect(list[0]).to.have.ownProperty('be_collect_count');
                    chai.expect(list[0]).to.have.ownProperty('user_id');
                    chai.expect(list[0]).to.have.ownProperty('user_name');
                    chai.expect(list[0]).to.have.ownProperty('collection_type');
                }

                done();
            });
    });
});