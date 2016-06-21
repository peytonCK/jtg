#!/usr/bin/env node

if (!process.argv[2]) {
    console.log('node deploy.js <project dir>');
    return;
}
var fs = require('fs');
var path = require('path');
var fsTool = require('fs-tools');
var projectDir = process.argv[2];
var targetDir=process.argv[3];
projectDir = path.dirname(projectDir) + path.sep + path.basename(projectDir);
if (!fs.existsSync(projectDir)) {
    console.log(process.argv[2] + 'is not exists');
    return;
}
if (!fs.existsSync(targetDir)) {
    fsTool.mkdirSync(targetDir, '755');
}

var cmd = require('child_process').exec;
var gulp = require('gulp');
var replace = require('gulp-replace');
var minicss = require('gulp-minify-css');
var fileLog = require('gulp-filelog');
var UglifyJS = require("uglify-js");
var dateFormat = require('dateformat');

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {

    // projectDir = path.join(__dirname, '../../tmp' + Date.now());
    // fsTool.move(targetDir, projectDir, afterFsMove);

    // function afterFsMove() {
        console.log('node ' + path.join(__dirname, 'make') + ' ' + projectDir + ' ' + targetDir);
        cmd('node ' + path.join(__dirname, 'make') + ' ' + projectDir + ' ' + targetDir, afterMake);
    // }

    function afterMake(err, out) {
        if(out){
            console.log(out);
            return;
        }
        // fsTool.remove(projectDir, function(){});
        var jsDir = path.join(targetDir, 'js/page');
        var cssDir = path.join(targetDir, 'css/page');
        gulp.src(cssDir + '/**/*.css')
            .pipe(minicss())
            .pipe(fileLog())
            .pipe(gulp.dest(cssDir));

        var count = numCPUs;
        var jsFileList = [];
        fsTool.walkSync(jsDir, function (file) {
            jsFileList.push(file);
        });
        for (var i = 0; i < Math.min(numCPUs, jsFileList.length); i++) {
            cluster.fork();
        }
        Object.keys(cluster.workers).forEach(function (id) {
            cluster.workers[id].send(jsFileList.shift());
            if (count > 0)count--;
            cluster.workers[id].on('message', function () {
                if (jsFileList.length > 0) {
                    cluster.workers[id].send(jsFileList.shift());
                } else {
                    if (++count === numCPUs) {
                        Object.keys(cluster.workers).forEach(function (id) {
                            cluster.workers[id].disconnect();
                        });
                        fs.writeFileSync(path.join(targetDir, 'ver'), dateFormat(new Date, "yyyymmdd-HHMMss"));
                    }
                }

            });
        });
    }
    afterMake();


} else if (cluster.isWorker) {

    process.on('message', function (file) {
        var result = UglifyJS.minify(file);
        var code = result.code.replace(/dev\.com/g, 'zhuqu.com');
        fs.writeFileSync(file, code, {encoding: 'utf8'});
        console.log("UglifyJS====>" + file);
        process.send('ok');
    });

}