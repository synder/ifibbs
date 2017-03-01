/**
 * @desc 用户问题
 * */

const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;


describe('获取用户的提问列表', function () {
    it('#返回用户的提问列表', function (done) {
        
        let pageSize = Mock.Random.natural(10, 20);
        let pageIndex = Mock.Random.natural(1, 2);
        
        request(app)
            .get('/user/questions')
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
                    chai.expect(list[0]).to.have.ownProperty('id');
                    chai.expect(list[0]).to.have.ownProperty('title');
                    chai.expect(list[0]).to.have.ownProperty('tags');
                    chai.expect(list[0]).to.have.ownProperty('describe');
                    chai.expect(list[0]).to.have.ownProperty('answer_count');
                    chai.expect(list[0]).to.have.ownProperty('favour_count');
                    chai.expect(list[0]).to.have.ownProperty('attention_count');
                    chai.expect(list[0]).to.have.ownProperty('collect_count');
                    chai.expect(list[0]).to.have.ownProperty('create_time');
                }
                
                done();
            });
    });
});

describe('用户删除提问', function () {
    it('#返回删除状态', function (done) {

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

                request(app)
                    .delete('/user/question')
                    .query({
                        question_id: res.body.result.question_id
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

describe('用户新增提问', function(){
    it('#用户新增提问返回提问ID', function(done) {
        request(app)
            .put('/user/question')
            .send({
                title: Mock.Random.ctitle(3, 20),
                describe: Mock.Random.cparagraph(10, 50),
                tags: ['58aa50177ddbf5507c51f082', '58aa50177ddbf5507c51f083']
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

                done();
            });
    });
});


