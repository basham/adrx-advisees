var gulp = require('gulp');
var del = require('del');

var config = require('./config');

gulp.task('clean', function(callback) {
  var dir = config.isProduction ? './release' : './build';
  del(dir, callback);
});
