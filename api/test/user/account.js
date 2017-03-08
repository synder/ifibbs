const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;



describe('用户未登录相关接口测试', function() {
    it('#用户注册', function (done) {

        request(app)
            .put('/account/register')
            .send({
                user_mobile: '13550501566',
                user_password: '12345678',
                code_id: '58bce997fc71500981a75187',
                code: '903488',
                code_random: '0.8504996783854122',
                register_platform: 1,
                register_deviceno: 'zhuce',
                device_resolution: [1080,1024],
                device_version: '7.0'
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

    it('#用户账号登录', function (done) {

        request(app)
            .put('/account/login')
            .send({
                user_mobile: '13550501566',
                user_password: '12345678',
                register_platform: 2,
                register_deviceno: 'zhanghao',
                device_resolution: [100,1024],
                device_version: '7.0',
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
            .put('/account/login/third')
            .send({
                open_id: '58aa50177ddbf5507c51f083',
                user_name: 'logoli',
                register_platform: 2,
                register_deviceno: 'disanfang',
                device_resolution: [100,1024],
                device_version: '7.0',
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
                chai.expect(res.body.result).to.have.ownProperty('user_id');
                chai.expect(res.body.result).to.have.ownProperty('login_token');
                chai.expect(res.body.result).to.have.ownProperty('login_fashion');
                chai.expect(res.body.result).to.have.ownProperty('bind_wechat');
                chai.expect(res.body.result).to.have.ownProperty('bind_qq');
                chai.expect(res.body.result).to.have.ownProperty('bind_weibo');
                chai.expect(res.body.result).to.have.ownProperty('bind_phone');


                done();
            });
    });
});
