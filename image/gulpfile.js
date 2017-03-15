
const async = require('async');
const gulp = require('gulp');

const git = require('gulp-git');
const clean = require('gulp-clean');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');
const plumber = require("gulp-plumber");

gulp.task('test_init_env', function (done) {
    if(process.env.NODE_ENV && process.env.NODE_ENV !== 'dev'){
        return done(new Error('can not run test on this ' + process.env.NODE_ENV));
    }

    process.env.NODE_ENV = 'dev';
    global.config = require('./config');
    done();
});


/**
 * @desc 运行测试
 * */
gulp.task('test', ['test_init_env'], function (done) {
    
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
