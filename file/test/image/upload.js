// const path = require('path');
// const async = require('async');
// const chai = require('chai');
// const request = require('supertest');
// const Mock = require('mockjs');
//
// const app = require('../../app').app;
//
// const DIR_NAME = __dirname;

// describe('上传接口测试', function() {
//     it('#图片上传接口', function (done) {
//
//         request
//             .post('/upload/images')
//             .attach('avatar', path.join(DIR_NAME, '../resource/3c9f2d55454e007bc0e43a193f37f9e1.jpg'))
//             .attach('avatar', path.join(DIR_NAME, '../resource/eac4644bdb3d24ba8feabfa860777622.jpg'))
//             .end(function (err, res) {
//                 if(err){
//                     return done(err);
//                 }
//                
//                 console.log(res);
//                
//                 done();
//             });
//        
//     });
// });