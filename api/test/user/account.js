const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;


let token;
describe('用户未登录相关接口测试', function() {
    it('#用户注册', function (done) {

        request(app)
            .put('/account/register')
            .send({
                user_mobile: '13550501565',
                user_password: '12345678',
                code_id: '58bce997fc71500981a75187',
                code: '903488',
                register_platform: 1,
                register_deviceno: 'zhuce',
                device_resolution: [1080,1024],
                device_version: '7.0',
                getui_cid: '12345678'
            })
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.property('flag', '0000');
                chai.expect(res.body).to.have.property('msg', '');

                chai.expect(res.body).to.have.ownProperty('result');
                chai.expect(res.body.result).to.have.ownProperty('user_id');
                chai.expect(res.body.result).to.have.ownProperty('login_token');
                chai.expect(res.body.result).to.have.ownProperty('login_fashion');
                chai.expect(res.body.result).to.have.ownProperty('bind_wechat');
                chai.expect(res.body.result).to.have.ownProperty('bind_qq');
                chai.expect(res.body.result).to.have.ownProperty('bind_weibo');



                done();
            });
    });



    it('#用户第三方登录', function (done) {

        request(app)
            .post('/account/login/third')
            .send({
                open_id: '58aa50177ddbf5507c51f083',
                user_name: 'logoli',
                register_platform: 2,
                register_deviceno: 'disanfang',
                device_resolution: [100,1024],
                device_version: '7.0',
                login_type: 1,
                user_avatar: 'user_avatar',
                getui_cid: '12345678'
            })
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.property('flag', '0000');
                chai.expect(res.body).to.have.property('msg', '');

                chai.expect(res.body).to.have.ownProperty('result');
                chai.expect(res.body.result).to.have.ownProperty('user_id');
                chai.expect(res.body.result).to.have.ownProperty('login_token');
                chai.expect(res.body.result).to.have.ownProperty('login_fashion');
                chai.expect(res.body.result).to.have.ownProperty('bind_wechat');
                chai.expect(res.body.result).to.have.ownProperty('bind_qq');
                chai.expect(res.body.result).to.have.ownProperty('bind_weibo');
                chai.expect(res.body.result).to.have.ownProperty('bind_phone');
                token = res.body.result.login_token;


                done();
            });
    });
});

describe('用户已登陆接口测试', function() {
    it('#获取用户信息', function (done) {
        request(app)
            .get('/user/account/info')
            .query({
                user_id: '58aa50177ddbf5507c51f083',
            })
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.property('flag', '0000');
                chai.expect(res.body).to.have.property('msg', '');

                chai.expect(res.body).to.have.ownProperty('result');

                chai.expect(res.body.result).to.have.ownProperty('user_id');
                chai.expect(res.body.result).to.have.ownProperty('user_avatar');
                chai.expect(res.body.result).to.have.ownProperty('user_name');
                chai.expect(res.body.result).to.have.ownProperty('user_profile');
                chai.expect(res.body.result).to.have.ownProperty('user_gender');
                chai.expect(res.body.result).to.have.ownProperty('user_mobile');
                chai.expect(res.body.result).to.have.ownProperty('work_info');
                chai.expect(res.body.result).to.have.ownProperty('edu_info');
                chai.expect(res.body.result).to.have.ownProperty('user_province');
                chai.expect(res.body.result).to.have.ownProperty('user_city');
                chai.expect(res.body.result).to.have.ownProperty('user_area');

                done();
            });

    });

    it('#更新用户信息', function (done) {
        request(app)
            .post('/user/account/info')
            .send({
                token: token,
                user_name: 'liqp',
                // user_profile,
                // user_avatar,
                // user_gender,
                // user_mobile,
                // work_info,
                // edu_info,
                // user_province,
                // user_city,
                // user_area,
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

    it('#第三方账号检测', function (done) {
        request(app)
            .post('/user/account/check/third')
            .send({
                open_id: '58aa50177ddbf5507c51f083',
                login_type: 2,
            })
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.property('flag', '0000');
                chai.expect(res.body).to.have.property('msg', '');

                chai.expect(res.body).to.have.ownProperty('result');

                chai.expect(res.body.result).to.have.ownProperty('is_bound');
                chai.expect(res.body.result).to.have.ownProperty('user_name');


                done();
            });

    });

    it('#第三方账号绑定', function (done) {
        request(app)
            .post('/user/account/third')
            .send({
                open_id: '58aa50177ddbf5507c51f083',
                user_name: 'liqp',
                login_type: 2,
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

    it('#第三方账号解绑', function (done) {
        request(app)
            .delete('/user/account/third')
            .send({
                login_type: 1,
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

    it('#绑定手机号', function (done) {
        request(app)
            .post('/user/account/bind/phone')
            .send({
                user_mobile: '13550501566',
                user_password: '12345678',
                code_id: '58bce997fc71500981a75188',
                code: '903487'
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

    it('#用户账号登录', function (done) {

        request(app)
            .post('/account/login')
            .send({
                user_mobile: '13550501566',
                user_password: '12345678',
                register_platform: 2,
                register_deviceno: 'zhanghao',
                device_resolution: [100,1024],
                device_version: '7.0',
                getui_cid: '12345678'
            })
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.property('flag', '0000');
                chai.expect(res.body).to.have.property('msg', '');

                chai.expect(res.body).to.have.ownProperty('result');
                chai.expect(res.body.result).to.have.ownProperty('user_id');
                chai.expect(res.body.result).to.have.ownProperty('login_token');
                chai.expect(res.body.result).to.have.ownProperty('login_fashion');
                chai.expect(res.body.result).to.have.ownProperty('bind_wechat');
                chai.expect(res.body.result).to.have.ownProperty('bind_qq');
                chai.expect(res.body.result).to.have.ownProperty('bind_weibo');

                done();
            });
    });
});