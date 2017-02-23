const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;

describe('用户消息推送', function(){
    it('#返回用户系统消息通知',function (done) {
        let pageSize = Mock.Random.natural(10, 20);
        let pageIndex = Mock.Random.natural(1, 2);
        request(app)
            .get('/user/notification/systems')
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

                let list=res.body.result.list

                if(list.length>0){
                    chai.expect(list[0]).to.have.ownProperty('id');
                    chai.expect(list[0]).to.have.ownProperty('title');
                    chai.expect(list[0]).to.have.ownProperty('content');
                    chai.expect(list[0]).to.have.ownProperty('type');
                    chai.expect(list[0]).to.have.ownProperty('add_on');
                }
                done();
            })
    });


    it('#返回用户业务消息通知',function (done) {
        let pageSize = Mock.Random.natural(10, 20);
        let pageIndex = Mock.Random.natural(1, 2);
        request(app)
            .get('/user/notification/businesses')
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

                let list=res.body.result.list

                if(list.length>0){
                    chai.expect(list[0]).to.have.ownProperty('id');
                    chai.expect(list[0]).to.have.ownProperty('title');
                    chai.expect(list[0]).to.have.ownProperty('content');
                    chai.expect(list[0]).to.have.ownProperty('type');
                    chai.expect(list[0]).to.have.ownProperty('add_on');
                }
                done();
            })
    });


    it('#推送消息阅读状态修改', function(done) {
        let ids=['58ae4f5c3b5c9e08208541eb','58ae52b8e9ba180864cc283a'];
        request(app)
            .post('/user/notification/status')
            .send({
                notification_ids: ids,
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