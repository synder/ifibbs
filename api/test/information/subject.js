const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;

const mongodb = require('../../service/mongodb');



describe('专题相关接口', function () {

    let subjectID = new mongodb.ObjectId();

    before(function (done) {
        
        //初始化专题数据库
        let Subject = mongodb.db.model('Subject');

        let mockData = [
            {
                _id: subjectID,
                title: Mock.Random.ctitle(5, 10),   //专题名称
                describe: Mock.Random.ctitle(20, 30),   //专题描述
                icon: 'http://www.jkinst.com/zy-api/a/db/mongod/picture/58ad029de4b015ad71990518',   //专题图标URL
                cover: 'http://www.jkinst.com/zy-api/a/db/mongod/picture/58ad029de4b015ad71990518',   //专题封面图URL
                status: Subject.STATUS.ENABLE,   //专题状态
                display_order: Mock.Random.natural(1, 20),     //专题显示顺序
                create_time: new Date(),     //创建时间
                update_time: new Date(),     //更新时间
            }
        ];

        //初始化专题数据库
        Subject.create(mockData, done);
    });

    it('#返回专题获取详情', function (done) {
        request(app)
            .get('/subject')
            .query({
                subject_id: subjectID.toString(),
            })
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.property('flag', '0000');
                chai.expect(res.body).to.have.property('msg', '');

                chai.expect(res.body).to.have.ownProperty('result');

                let result = res.body.result;

                if (result) {
                    chai.expect(result).to.have.ownProperty('id');
                    chai.expect(result).to.have.ownProperty('title');
                    chai.expect(result).to.have.ownProperty('describe');
                    chai.expect(result).to.have.ownProperty('icon');
                    chai.expect(result).to.have.ownProperty('cover');
                    chai.expect(result).to.have.ownProperty('is_attented');
                }

                done();
            });
    });

    it('#返回专题列表', function (done) {
        request(app)
            .get('/subjects')
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

                let list = res.body.result.list;

                if (list.length > 0) {
                    chai.expect(list[0]).to.have.ownProperty('id');
                    chai.expect(list[0]).to.have.ownProperty('describe');
                    chai.expect(list[0]).to.have.ownProperty('icon');
                    chai.expect(list[0]).to.have.ownProperty('cover');
                }

                done();
            });
    });
});