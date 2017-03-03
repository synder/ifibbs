const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;

const mongodb = require('../../../public/service/mongodb');



describe('专题相关接口', function () {
    it('#返回专题获取详情', function (done) {
        request(app)
            .get('/subject')
            .query({
                subject_id: "58ae5da34171fd177d387637",
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
                    chai.expect(result).to.have.ownProperty('describe');
                    chai.expect(result).to.have.ownProperty('icon');
                    chai.expect(result).to.have.ownProperty('cover');
                    chai.expect(result).to.have.ownProperty('is_attention');
                }

                done();
            });
    });

    it('#返回专题列表', function (done) {
        request(app)
            .get('/subjects')
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
                    chai.expect(list[0]).to.have.ownProperty('describe');
                    chai.expect(list[0]).to.have.ownProperty('icon');
                    chai.expect(list[0]).to.have.ownProperty('cover');
                }

                done();
            });
    });
});