const { watch, gulp, series, src, dest } = require('gulp');
const fs = require('fs');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const { spawn } = require('child_process');

var serviceProcess;

function onStarted(cb) {
    console.log('spotted file changes, will do response now.');
    cb();
}

function stopRunningService(cb) {
    if (serviceProcess === undefined) {
        cb();
    }
    else {
        console.log('found that service process is running, try to kill it');
        let result = serviceProcess.kill();
        console.log(`killed process ${serviceProcess.pid}: ${result}`);
        cb();
    }
}

function buildTS() {
    console.log("start building backend codes...");

    return tsProject.src()
    .pipe(tsProject())
    .pipe(dest('.'));
}

function buildFrontEnd() {
    console.log("start building frontend codes...");

    return browserify({
        basedir: 'frontend',
        debug: true,
        entries: ['src/main.ts']
    })
    .plugin(tsify) // tsify is a browserify plugin to complile *.ts
    .bundle() // bundle the javascript files into a single file
    .pipe(source('bundle.js')) // copy the bundled file as 'bundle.js'
    .pipe(dest('frontend/dist')); // copy that bundle.js into frontend/dist/
}

function onComplete(cb) {
    console.log('all built.');
    cb();
}

function tryToStartService(cb) {
    console.log("try to start service...");

    serviceProcess = spawn('node', ['main.js']);

    serviceProcess.stdout.on('data', (data) => {
        console.log(`service stdout: ${data}`);
    });

    serviceProcess.stderr.on('data', (data) => {
        console.log(`service stderr: ${data}`);
    });

    serviceProcess.on('close', (code) => {
        console.log(`service process exited with code ${code}`);
    });

    cb();
}

function onFilesChanged() {
    return series(
        onStarted, 
        buildTS, 
        buildFrontEnd, 
        stopRunningService,
        tryToStartService,
        onComplete
    );
}

exports.default = function() {
    watch(["*.ts", "*/*.ts"], { events: 'all' }, onFilesChanged());
};

exports.build = series(buildTS, buildFrontEnd);