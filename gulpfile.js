const { watch, gulp, series } = require('gulp');
const fs = require('fs');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const browserify = require('browserify');

function onStarted(cb) {
    console.log('spotted file changes, will do response now.');
    cb();
}

function buildTS() {
    console.log("start building backend codes...");

    return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('.'));
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
    .pipe(gulp.dest('frontend/dist')); // copy that bundle.js into frontend/dist/
}

function onComplete(cb) {
    console.log('all done.');
    cb();
}

function onFilesChanged() {
    return series(onStarted, buildTS, buildFrontEnd, onComplete);
}

exports.default = function() {
    watch("gitlog.txt", { events: 'all' }, onFilesChanged);
};
