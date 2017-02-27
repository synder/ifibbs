const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');

const app = require('../../app').app;

const mongodb = require('../../service/mongodb');

describe('文章相关接口测试', function () {

    let articleID = new mongodb.ObjectId();
    let createUserID = new mongodb.ObjectId();

    before(function (done) {

        let Article = mongodb.db.model('Article');

        let mockData = [
            {
                _id: articleID,
                status: Article.STATUS.PUBLISHED,    //文章状态
                top: false,    //是否置顶
                title: Mock.Random.ctitle(5, 10),    //文章标题
                summary: Mock.Random.ctitle(20, 30),    //文章摘要
                icon: 'http://www.jkinst.com/zy-api/a/db/mongod/picture/58ad029de4b015ad71990518',    //封面图片
                cover: 'http://www.jkinst.com/zy-api/a/db/mongod/picture/58ac11cae4b04cd9925ad300',    //封面图片
                tags: ['基金'],    //封面图片
                content: Mock.Random.ctitle(200, 1000),    //文章内容
                browse_count: 0,    //浏览次数
                favour_count: 0,    //被赞次数
                comment_count: 0,    //被评论次数
                collect_count: 0,    //被收藏次数
                create_time: new Date(),    //创建时间
                update_time: new Date(),    //更新时间
                create_user_id: createUserID   //创建人
            }
        ];

        //初始化专题数据库
        Article.create(mockData, done);
    });

    it('#返回文章详情', function (done) {
        request(app)
            .get('/subject/article')
            .query({
                article_id: articleID.toString(),
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
                    chai.expect(result).to.have.ownProperty('summary');
                    chai.expect(result).to.have.ownProperty('icon');
                    chai.expect(result).to.have.ownProperty('cover');
                    chai.expect(result).to.have.ownProperty('content');
                    chai.expect(result).to.have.ownProperty('is_favour');
                    chai.expect(result).to.have.ownProperty('is_collect');
                }

                done();
            });
    });


    it('#返回专题下的文章列表', function (done) {
        request(app)
            .get('/subject/articles')
            .query({
                page_size: 20,
                page_index: 1,
                subject_id : '58ae562adebe8b145b4f58bb'
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

                let list = res.body.result.list;

                if (list.length > 0) {
                    chai.expect(list[0]).to.have.ownProperty('id');
                    chai.expect(list[0]).to.have.ownProperty('title');
                    chai.expect(list[0]).to.have.ownProperty('summary');
                    chai.expect(list[0]).to.have.ownProperty('icon');
                    chai.expect(list[0]).to.have.ownProperty('cover');
                }

                done();
            });
    });
    

    it('#返回推荐的文章列表', function (done) {
        request(app)
            .get('/subject/articles/recommend')
            .query({
                page_size: 20,
                page_index: 1
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

                let list = res.body.result.list;

                if (list.length > 0) {
                    chai.expect(list[0]).to.have.ownProperty('id');
                    chai.expect(list[0]).to.have.ownProperty('title');
                    chai.expect(list[0]).to.have.ownProperty('summary');
                    chai.expect(list[0]).to.have.ownProperty('icon');
                    chai.expect(list[0]).to.have.ownProperty('cover');
                }

                done();
            });
    });
});