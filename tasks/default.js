var gulp = require('gulp');
var runSequence = require('run-sequence').use(gulp);

var config = require('./config');

gulp.task('default', function(callback) {
  if(config.isProduction) {
    runSequence('build', callback);
  }
  else {
    runSequence('build', 'browser-sync', 'watch', callback);
  }
});
