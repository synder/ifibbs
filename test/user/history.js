const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;

describe('获取用户历史记录', function() {
    
    before(function(done) {
        done()
    });
    
    it('#返回用户历史记录列表', function (done) {

        request(app)
            .get('/user/history/browses')
            .query({
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
                    chai.expect(list[0]).to.have.ownProperty('tags');
                    chai.expect(list[0]).to.have.ownProperty('title');
                    chai.expect(list[0]).to.have.ownProperty('describe');
                    chai.expect(list[0]).to.have.ownProperty('user_id');
                    chai.expect(list[0]).to.have.ownProperty('user_name');
                    chai.expect(list[0]).to.have.ownProperty('user_avatar');
                    chai.expect(list[0]).to.have.ownProperty('type');
                }

                done();
            });
    });
});