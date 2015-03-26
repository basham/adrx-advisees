var gulp = require('gulp');
var inject = require('gulp-inject');
var htmlmin = require('gulp-htmlmin');

var config = require('./config');
var iconsTask = require('./icons');

function fileContents(filePath, file) {
  return file.contents.toString();
}

gulp.task('html', function() {
  // Grab result stream from `icons` task.
  var icons = iconsTask();

  if(config.isProduction) {
    return;
  }

  return gulp.src('./src/index.html')
    // Inject `icons.svg` contents into source file.
    .pipe(inject(icons, { transform: fileContents }))
    .pipe(htmlmin({
      removeComments: true
    }))
    .pipe(gulp.dest('./build'));
});
