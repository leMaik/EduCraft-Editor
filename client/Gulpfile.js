'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var copy = require('gulp-copy');

gulp.task('javascript', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    debug: true,
    entries: ['./js/client.js']
  });

  return b.bundle()
    .pipe(source('./js/client.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('copy', function() {
    return gulp.src(['./index.html', './css/*'])
      .pipe(copy('./dist/'));
});

gulp.task('default', ['javascript', 'copy']);
