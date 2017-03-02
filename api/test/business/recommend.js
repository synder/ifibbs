const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;


describe('首页获取推荐列表', function () {
    it('#返回推荐推荐列表', function (done) {

        let pageSize = 20;
        let pageIndex = 1;

        request(app)
            .get('/recommends')
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
                
                if(list.length > 0){
                    chai.expect(list[0]).to.have.ownProperty('id');
                    chai.expect(list[0]).to.have.ownProperty('type');
                    chai.expect(list[0]).to.have.ownProperty('title');
                    chai.expect(list[0]).to.have.ownProperty('describe');
                    chai.expect(list[0]).to.have.ownProperty('tags');
                    chai.expect(list[0]).to.have.ownProperty('cover');
                    chai.expect(list[0]).to.have.ownProperty('answer_count');
                    chai.expect(list[0]).to.have.ownProperty('favour_count');
                    chai.expect(list[0]).to.have.ownProperty('attention_count');
                    chai.expect(list[0]).to.have.ownProperty('collect_count');
                    chai.expect(list[0]).to.have.ownProperty('comment_count');
                    chai.expect(list[0]).to.have.ownProperty('create_time');
                    chai.expect(list[0]).to.have.ownProperty('eg_answer_id');
                    chai.expect(list[0]).to.have.ownProperty('eg_answer_time');
                    chai.expect(list[0]).to.have.ownProperty('eg_answer_content');
                    chai.expect(list[0]).to.have.ownProperty('eg_answer_user_id');
                    chai.expect(list[0]).to.have.ownProperty('eg_answer_user_name');
                }

                done();
            });
    });
});