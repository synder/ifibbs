const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;

describe('验证码相关', function() {
    it('#测试发送验证码', function (done) {
        
        request(app)
            .get('/common/sms/code')
            .query({
                user_mobile: '13550501566'
            })
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.property('flag', '0000');
                chai.expect(res.body).to.have.property('msg', '');
                chai.expect(res.body).to.have.ownProperty('result');
                
                if(res.body.result.msg){
                    chai.expect(res.body.result).to.have.property('security_code_id', null);
                }else{
                    chai.expect(res.body.result).to.have.ownProperty('security_code_id');
                }
                
        
                done();
            });
    });
});
