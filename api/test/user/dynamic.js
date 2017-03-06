/**
 * @author synder on 2017/3/5
 * @copyright
 * @desc
 */

const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;

describe('用户动态', function() {
    it('#获取用户动态列表', function (done) {

        request(app)
            .get('/other/dynamic')
            .query({
                user_id: '58aa50177ddbf5507c51f082',
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

                done();
            });
    });
});