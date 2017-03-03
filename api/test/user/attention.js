
const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;


describe('用户关注问题', function() {
    
    let questionID = null;
    
    before(function(done) {
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
                
                questionID = res.body.result.question_id;

                done();
            });
    });
    
    it('#返回用户关注问题结果', function (done) {

        request(app)
            .put('/user/attention/question')
            .send({
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
                chai.expect(res.body.result).to.have.property('ok', true);
                
                done();
            });
    });
});

describe('用户取消关注问题', function() {

    let questionID = null;

    before(function(done) {

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

                questionID = res.body.result.question_id;

                request(app)
                    .put('/user/attention/question')
                    .send({
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
                        chai.expect(res.body.result).to.have.property('ok', true);

                        done();
                    });
            });
    });

    it('#用户取消关注问题', function (done) {

        request(app)
            .delete('/user/attention/question')
            .query({
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
                chai.expect(res.body.result).to.have.property('ok', true);

                done();
            });
    });
});

describe('用户关注专题', function() {
    it('#用户关注专题状态', function (done) {

        request(app)
            .put('/user/attention/subject')
            .send({
                subject_id: '58aaae950e95c9205f3db5de'
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

describe('用户取消关注专题', function() {

    let subjectID = '58aaae950e95c9205f3db5de';

    before(function(done) {
        request(app)
            .put('/user/attention/subject')
            .send({
                subject_id: subjectID
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

    it('#用户取消关注专题状态', function (done) {

        request(app)
            .delete('/user/attention/subject')
            .query({
                subject_id: subjectID
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

describe('用户关注用户', function() {
    it('#用户关注用户状态', function (done) {

        request(app)
            .put('/user/attention/user')
            .send({
                user_id: '58aa50177ddbf5507c51f083'
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

describe('用户取消关注用户', function() {

    before(function(done) {
        request(app)
            .put('/user/attention/user')
            .send({
                user_id: '58aa50177ddbf5507c51f083'
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

    it('#用户取消关注用户状态', function (done) {

        request(app)
            .delete('/user/attention/user')
            .query({
                user_id: '58aaae950e95c9205f3db5de'
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

describe('用户关注的问题列表', function(){

    before(function(done) {
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

                questionID = res.body.result.question_id;

                request(app)
                    .put('/user/attention/question')
                    .send({
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
                        chai.expect(res.body.result).to.have.property('ok', true);

                        done();
                    });
            });
    });

    it('#返回用户关注的问题列表', function(done) {

        request(app)
            .get('/user/attention/questions')
            .query({
                page_size: Mock.Random.natural(3, 20),
                page_index: 1,
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
                    chai.expect(list[0]).to.have.ownProperty('user_id');
                    chai.expect(list[0]).to.have.ownProperty('user_avatar');
                    chai.expect(list[0]).to.have.ownProperty('user_name');
                    chai.expect(list[0]).to.have.ownProperty('question_id');
                    chai.expect(list[0]).to.have.ownProperty('question_title');
                    chai.expect(list[0]).to.have.ownProperty('question_tags');
                    chai.expect(list[0]).to.have.ownProperty('question_attention_count');
                    chai.expect(list[0]).to.have.ownProperty('question_answer_count');
                }

                done();
            });
    });
});

describe('用户关注的用户列表', function(){

    before(function(done) {
        request(app)
            .put('/user/attention/user')
            .send({
                user_id: '58aa50177ddbf5507c51f083'
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

    it('#返回用户关注问的用户列表', function(done) {

        request(app)
            .get('/user/attention/users')
            .query({
                page_size: Mock.Random.natural(3, 20),
                page_index: 1,
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
                    chai.expect(list[0]).to.have.ownProperty('user_id');
                    chai.expect(list[0]).to.have.ownProperty('user_avatar');
                    chai.expect(list[0]).to.have.ownProperty('user_name');
                    chai.expect(list[0]).to.have.ownProperty('user_profile');
                }

                done();
            });
    });
});

describe('用户关注问的专题列表', function(){

    before(function(done) {
        request(app)
            .put('/user/attention/subject')
            .send({
                subject_id: '58aaae950e95c9205f3db5de'
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

    it('#返回用户关注问的专题列表', function(done) {

        request(app)
            .get('/user/attention/subjects')
            .query({
                page_size: Mock.Random.natural(3, 20),
                page_index: 1,
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
                    chai.expect(list[0]).to.have.ownProperty('subject_id');
                    chai.expect(list[0]).to.have.ownProperty('subject_icon');
                    chai.expect(list[0]).to.have.ownProperty('subject_title');
                    chai.expect(list[0]).to.have.ownProperty('subject_describle');
                }

                done();
            });
    });
});