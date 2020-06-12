const gulp = require('gulp');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const browserify = require('browserify');

gulp.task('default', function() {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts']
    })
    .plugin(tsify) // tsify is a browserify plugin to complile *.ts
    .bundle() // bundle the javascript files into a single file
    .pipe(source('bundle.js')) // copy the bundled file as 'bundle.js'
    .pipe(gulp.dest('dist')); // copy that bundle.js into dist/
});

