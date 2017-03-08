const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;

const mongodb = require('../../../public/service/mongodb');

describe('文章相关接口测试', function () {
    
    it('#返回文章详情', function (done) {
        request(app)
            .get('/subject/article')
            .query({
                article_id: '58ae5da34171fd177d387638',
            })
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.property('flag', '0000');
                chai.expect(res.body).to.have.property('msg', '');

                chai.expect(res.body).to.have.ownProperty('result');

                let result = res.body.result;

                if (result) {
                    chai.expect(result).to.have.ownProperty('id');
                    chai.expect(result).to.have.ownProperty('title');
                    chai.expect(result).to.have.ownProperty('summary');
                    chai.expect(result).to.have.ownProperty('icon');
                    chai.expect(result).to.have.ownProperty('cover');
                    chai.expect(result).to.have.ownProperty('content');
                    chai.expect(result).to.have.ownProperty('is_favour');
                    chai.expect(result).to.have.ownProperty('is_collect');
                }

                done();
            });
    });


    it('#返回专题下的文章列表', function (done) {
        request(app)
            .get('/subject/articles')
            .query({
                page_size: 20,
                page_index: 1,
                subject_id : '58ae562adebe8b145b4f58bb'
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
                    chai.expect(list[0]).to.have.ownProperty('summary');
                    chai.expect(list[0]).to.have.ownProperty('icon');
                    chai.expect(list[0]).to.have.ownProperty('cover');
                }

                done();
            });
    });
    

    it('#返回推荐的文章列表', function (done) {
        request(app)
            .get('/subject/articles/recommend')
            .query({
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
                    chai.expect(list[0]).to.have.ownProperty('summary');
                    chai.expect(list[0]).to.have.ownProperty('icon');
                    chai.expect(list[0]).to.have.ownProperty('cover');
                }

                done();
            });
    });
});