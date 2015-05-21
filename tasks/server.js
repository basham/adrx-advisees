var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

var config = require('./config');

gulp.task('server', function() {
  // Ignore this task if not configured for local API calls.
  if(!config.isLocalProxy) {
    return;
  }

  nodemon({
    script: './server',
    ignore: [
      './src',
      './tasks'
    ]
  });
});
