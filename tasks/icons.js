var gulp = require('gulp');
var svg = require('gulp-svg-symbols');
var rename = require('gulp-rename');

var config = require('./config');

function task() {
  var src = gulp.src('./src/assets/**/*.svg')
    .pipe(svg({
      id: 'adv-Icon--%f',
      templates: ['default-svg']
    }));

  if(config.isProduction) {
    return src
      .pipe(rename('icons.svg'))
      .pipe(gulp.dest('./release'));
  }

  return src;
}

gulp.task('icons', task);

module.exports = task;
