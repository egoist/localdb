'use strict';

var gulp = require('gulp')
var babel = require('gulp-babel')
var serve = require('gulp-serve')
var sourcemaps = require('gulp-sourcemaps')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var qunit = require('gulp-qunit')

gulp.task('serve', serve({
  root: ['.'],
  port: 3001
}))

gulp.task('babel', function() {
  var stream = gulp.src('./src/js/localdb.js')
    .pipe(babel())
    .pipe(gulp.dest(__dirname));
  return stream;
})

gulp.task('js', ['babel'], function() {
  var stream = gulp.src('./localdb.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('.'));
  return stream;
})

gulp.task('test', function() {
  gulp.src('./test/index.html')
    .pipe(qunit({
      timeout: 20
    }))
})

gulp.task('watch', function() {
  return gulp.watch('./src/js/*.js', ['js'])
})

gulp.task('build', ['js'])

gulp.task('default', ['build', 'serve', 'watch'])
