var gulp = require('gulp');
var runSequence = require('run-sequence').use(gulp);

gulp.task('build', function(callback) {
  runSequence('clean', ['html', 'styles', 'vendor', 'scripts'], callback);
});
