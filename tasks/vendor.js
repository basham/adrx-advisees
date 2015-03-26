var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');

var config = require('./config');

gulp.task('vendor', function() {
  var src = gulp.src([
      './bower_components/classnames/index.js',
      './bower_components/react/react.min.js',
      './bower_components/react-router/build/global/ReactRouter.min.js',
      './bower_components/reflux/dist/reflux.min.js',
      './bower_components/fastclick/lib/fastclick.js'
    ])
    .pipe(concat('vendor.js'));

  if(config.isProduction) {
    return src
      .pipe(rename('vendor.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./release'))
      .pipe(gzip())
      .pipe(gulp.dest('./release'));
  }

  return src
    .pipe(gulp.dest('./build'));
});
