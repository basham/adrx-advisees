var gulp = require('gulp');
var less = require('gulp-less');
var prefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var gzip = require('gulp-gzip');
var browserSync = require('browser-sync');

var config = require('./config');

gulp.task('styles', function() {
  var src = gulp.src([
      './bower_components/normalize.css/normalize.css',
      './src/styles/main.less'
    ])
    .pipe(less({
      compress: config.isProduction
    }))
    .on('error', console.error)
    .pipe(prefix())
    .pipe(concat('styles.css'));

  if(config.isProduction) {
    return src
      .pipe(rename('styles.min.css'))
      .pipe(gulp.dest('./release'))
      .pipe(gzip())
      .pipe(gulp.dest('./release'));
  }

  return src
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.reload({
      stream: true
    }));
});
