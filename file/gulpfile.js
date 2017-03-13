
const async = require('async');
const gulp = require('gulp');

const git = require('gulp-git');
const clean = require('gulp-clean');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');
const plumber = require("gulp-plumber");

/**
 * @desc 运行测试
 * */
gulp.task('test', function (done) {
    
    let stream = gulp.src('./test/**/*.js')
        .pipe(mocha());

    stream.on('end', function () {
        done();
        process.exit(0);
    });

    stream.on('error', function (err) {
        if(err){
            console.error(err.stack);
        }
        
        done();
        process.exit(1);
    });
});
