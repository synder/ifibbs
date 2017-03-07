const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;



describe('用户相关接口测试', function() {
    it('#用户注册', function (done) {

        request(app)
            .put('/account/register')
            .send({
                user_mobile: '13550501566',
                user_password: '12345678',
                code_id: '58bce997fc71500981a75187',
                code: '903488',
                code_random: '0.8504996783854122',
                registerPlatform: 1,
                registerDeviceNo: '123456789',
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
                chai.expect(res.body.result).to.have.ownProperty('ok');
                chai.expect(res.body.result).to.have.ownProperty('juid');
                chai.expect(res.body.result).to.have.ownProperty('login_token');
                chai.expect(res.body.result).to.have.ownProperty('loginFashion');
                chai.expect(res.body.result).to.have.ownProperty('bindWeChat');
                chai.expect(res.body.result).to.have.ownProperty('bindQQ');
                chai.expect(res.body.result).to.have.ownProperty('bindWeibo');



                done();
            });
    });

    it('#用户账号登录', function (done) {

        request(app)
            .put('/account/login')
            .send({
                user_mobile: '13550501566',
                user_password: '12345678',
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
                chai.expect(res.body.result).to.have.ownProperty('juid');
                chai.expect(res.body.result).to.have.ownProperty('login_token');
                chai.expect(res.body.result).to.have.ownProperty('loginFashion');
                chai.expect(res.body.result).to.have.ownProperty('bindWeChat');
                chai.expect(res.body.result).to.have.ownProperty('bindQQ');
                chai.expect(res.body.result).to.have.ownProperty('bindWeibo');


                done();
            });
    });

    it('#用户第三方登录', function (done) {

        request(app)
            .put('/account/login/third')
            .send({
                openid: '58aa50177ddbf5507c51f083',
                name: 'logoli',
                registerPlatform: 2,
                registerDeviceNo: '12345678912121',
                device_resolution: [100,1024],
                device_version: '7.0',
                socialType: 2,
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
                chai.expect(res.body.result).to.have.ownProperty('juid');
                chai.expect(res.body.result).to.have.ownProperty('login_token');
                chai.expect(res.body.result).to.have.ownProperty('loginFashion');
                chai.expect(res.body.result).to.have.ownProperty('bindWeChat');
                chai.expect(res.body.result).to.have.ownProperty('bindQQ');
                chai.expect(res.body.result).to.have.ownProperty('bindWeibo');
                chai.expect(res.body.result).to.have.ownProperty('bindPhone');


                done();
            });
    });
});