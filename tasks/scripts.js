var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var shim = require('browserify-shim');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');

var config = require('./config');

var bundler = browserify({
  entries: ['./src/scripts/main.jsx'],
  transform: [
    reactify,
    shim
  ],
  extensions: ['.jsx'],
  debug: true
});

gulp.task('scripts', function() {
  var src = bundler.bundle()
    .pipe(source('scripts.js'));

  if(config.isProduction) {
    return src
      .pipe(buffer())
      .pipe(uglify())
      .pipe(rename('scripts.min.js'))
      .pipe(gulp.dest('./release'))
      .pipe(gzip())
      .pipe(gulp.dest('./release'));
  }

  return src
    .pipe(gulp.dest('./build'));
});
