/**
 *  Redmind Convention Tool
 *  @2016/11/11
 */

'use strict';

// dependencies
var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var minicss = require('gulp-clean-css');
var minijson = require('gulp-jsonminify');
var htmlmin = require('gulp-htmlmin');
var del = require('del');
var runSequence = require('run-sequence');

var srcFolder = './src/';
var buildFolder = './build/';

// 清空Dist
gulp.task('clean', function() {
    return del([buildFolder + '*'], {
        force: true
    });
});

// 複製
gulp.task('copy', function() {
    return gulp.src([srcFolder + '*.png', srcFolder + '*.jpeg'])
        .pipe(gulp.dest(buildFolder))
        .on('error', gutil.log);
});

// 壓縮 HTML
gulp.task('minify-html', function() {
    return gulp.src(srcFolder + 'popup.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(buildFolder))
        .on('error', gutil.log);
});

// 壓縮 JS
gulp.task('minify-js', function() {
    return gulp.src(srcFolder + '*.js')
        .pipe(uglify())
        .pipe(gulp.dest(buildFolder))
        .on('error', gutil.log);
});

// 壓縮 CSS
gulp.task('minify-css', function() {
    return gulp.src(srcFolder + '*.css')
        .pipe(minicss())
        .pipe(gulp.dest(buildFolder))
        .on('error', gutil.log);
});

// 壓縮 JSON
gulp.task('minify-json', function() {
    return gulp.src(srcFolder + 'manifest.json')
        .pipe(minijson())
        .pipe(gulp.dest(buildFolder))
        .on('error', gutil.log);
});

// 監控 JS
gulp.task('watch', function(file) {
    gulp.watch(srcFolder + '*.js', ['minify-js']);
    gulp.watch(srcFolder + '*.css', ['minify-css']);
    gulp.watch(srcFolder + '*.html', ['minify-html']);
});

// 佈署
gulp.task('deploy', function() {
    runSequence(
        'clean',
        'copy',
        'minify-html',
        'minify-js',
        'minify-css',
        'minify-json',
        function() {
            gutil.log('build completed!');
        }
    );
});
