#!/usr/bin/env node
var projectDir="../src";
var targetDir="../dist";

//引入模块
var gulp=require('gulp'),
    browserify = require('gulp-browserify'),//模块编译JS文件
    uglify=require('gulp-uglify'),//压缩js文件
    sass=require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    minicss = require('gulp-minify-css'),
    gulpCopy=require('gulp-copy'),
    gulpClean=require('gulp-clean'),
    logger=require('gulp-logger'),
    plumber = require('gulp-plumber');//任务错误中断自动重传
    

//定义任务：编译js
gulp.task('browserify',function(){
	gulp.src(projectDir+'/js/*.js')
        .pipe(plumber())
        .pipe(logger({
            before: 'Starting browserify...',
            after: 'browserify complete!',
            extname: '.js',
            showChange: true
        }))
	    .pipe(browserify({debug:false}))
	    .pipe(uglify())
	    .pipe(gulp.dest(targetDir+'/js'));
})

//定义任务：编译Sass文件
gulp.task('sass',function(){
	gulp.src(projectDir+'/scss/page/*.scss')
	    .pipe(plumber())
	    .pipe(sourcemaps.init())
        .pipe(logger({
            before: 'Starting Compile sass...',
            after: 'Compile sass complete!',
            extname: '.css',
            showChange: true
        }))
	    .pipe(sass())
        .pipe(minicss())
	    .pipe(sourcemaps.write())
	    .pipe(gulp.dest(targetDir+'/css'));
});


//定义任务：复制图片
gulp.task('img',function(){
	gulp.src(projectDir+'/img/**/*')
	    .pipe(gulp.dest(targetDir+'/img'))
});

//定义任务：复制html
gulp.task('html',function(){
	gulp.src(projectDir+'/html/*.html')
	    .pipe(gulp.dest(targetDir+'/html'))
});

//定义任务：监控js文件改变
gulp.task('watch-js',function(){
	gulp.watch(projectDir+'/js/*/*.js',['browserify']);
});

//定义任务：监控sass文件改变
gulp.task('watch-sass',function(){
	gulp.watch(projectDir+'/scss/*/*.scss',['sass']);
});

//定义任务：监控图片改变
gulp.task('watch-img',function(){
	gulp.watch(projectDir+'/img/**/*.{jpg,png,gif}',['img']);
});

//定义任务：监控html文件改变
gulp.task('watch-html',function(){
	gulp.watch(projectDir+'/html/*.html',['html']);
});

gulp.task('default',['browserify','sass','img','html','watch-js','watch-sass','watch-img','watch-html']);
