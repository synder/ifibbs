const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;


describe('获取最热回答列表', function () {
    it('#返回最热回答列表', function (done) {

        let pageSize = Mock.Random.natural(10, 20);
        let pageIndex = Mock.Random.natural(1, 2);

        request(app)
            .get('/question/answers/hottest')
            .query({
                page_size: pageSize,
                page_index: pageIndex
            })
            .expect(200)
            .end(function (err, res) {
                if(err) {
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
                    chai.expect(list[0]).to.have.ownProperty('user_id');
                    chai.expect(list[0]).to.have.ownProperty('user_avatar');
                    chai.expect(list[0]).to.have.ownProperty('user_name');
                    chai.expect(list[0]).to.have.ownProperty('question_id');
                    chai.expect(list[0]).to.have.ownProperty('question_title');
                    chai.expect(list[0]).to.have.ownProperty('question_collect_count');
                }

                done();
            });
    });
});


describe('获取最新回答列表', function () {
    it('#返回最新回答列表', function (done) {

        let pageSize = Mock.Random.natural(10, 20);
        let pageIndex = Mock.Random.natural(1, 2);

        request(app)
            .get('/question/answers/latest')
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
                    chai.expect(list[0]).to.have.ownProperty('user_id');
                    chai.expect(list[0]).to.have.ownProperty('user_avatar');
                    chai.expect(list[0]).to.have.ownProperty('user_name');
                    chai.expect(list[0]).to.have.ownProperty('question_id');
                    chai.expect(list[0]).to.have.ownProperty('question_title');
                    chai.expect(list[0]).to.have.ownProperty('question_collect_count');
                }

                done();
            });
    });
});


describe('获取问题回答列表', function () {
    it('#返回问题回答列表', function (done) {

        let pageSize = Mock.Random.natural(10, 20);
        let pageIndex = Mock.Random.natural(1, 2);

        request(app)
            .get('/question/answers')
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
                    chai.expect(list[0]).to.have.ownProperty('user_id');
                    chai.expect(list[0]).to.have.ownProperty('user_avatar');
                    chai.expect(list[0]).to.have.ownProperty('user_name');
                    chai.expect(list[0]).to.have.ownProperty('answer_id');
                    chai.expect(list[0]).to.have.ownProperty('answer_content');
                    chai.expect(list[0]).to.have.ownProperty('answer_comment_count');
                    chai.expect(list[0]).to.have.ownProperty('answer_favour_count');
                }

                done();
            });
    });
});


describe('获取问题回答详情', function () {

    let questionID = '58aaae950e95c9205f3db5de';
    let answerID = '';
    
    before(function(done) {
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

                questionID = res.body.result.question_id;
                answerID = res.body.result.answer_id;
                
                done();
            });
    });
    
    it('#返回问题回答详情', function (done) {
        
        request(app)
            .get('/question/answer')
            .query({
                question_id: questionID,
                answer_id: answerID
            })
            .expect(200)
            .end(function (err, res) {
                if(err){
                    throw err;
                }

                chai.expect(res.body).to.have.property('flag', '0000');
                chai.expect(res.body).to.have.property('msg', '');
                chai.expect(res.body).to.have.ownProperty('result');

                chai.expect(res.body.result).to.have.ownProperty('answer_id');
                chai.expect(res.body.result).to.have.ownProperty('answer_content');
                chai.expect(res.body.result).to.have.ownProperty('answer_time');
                chai.expect(res.body.result).to.have.ownProperty('user_id');
                chai.expect(res.body.result).to.have.ownProperty('user_avatar');
                chai.expect(res.body.result).to.have.ownProperty('user_name');
                chai.expect(res.body.result).to.have.ownProperty('user_profile');
                chai.expect(res.body.result).to.have.ownProperty('is_favour');
                chai.expect(res.body.result).to.have.ownProperty('is_collected');

                done();
            });
            
    });
});