'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var copy = require('gulp-copy');
var Builder = require('systemjs-builder');

gulp.task('javascript', function (done) {
    var builder = new Builder();
    builder
        .config({
            baseUrl: './',
            transpiler: 'typescript',
            typescriptOptions: {
                'module': 'commonjs',
                resolveTypings: true,
                emitDecoratorMetadata: true,
                sourceMap: true,
                inlineSourceMap: false
            },
            packages: {
                ts: {
                    main: 'app',
                    defaultExtension: 'ts'
                }
            },
            paths: {
                'angular2/*': 'node_modules/angular2/*.js',
                'rxjs/operator/*': 'node_modules/rxjs/add/operator/*.js',
                'rxjs/*': 'node_modules/rxjs/*.js',
                'app': 'ts'
            },
            map: {
                'typescript': 'node_modules/typescript/lib/typescript.js'
            },
            defaultJSExtensions: true
        });
    builder.buildStatic('app/boot', 'dist/app.js', {minify: true, sourceMaps: true})
        .then(function () {
            done();
        });
});

gulp.task('copy', function () {
    return gulp.src(['./index.html', './css/*'])
        .pipe(copy('./dist/'));
});

gulp.task('default', ['javascript', 'copy']);
