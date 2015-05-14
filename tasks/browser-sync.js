var gulp = require('gulp');
var browserSync = require('browser-sync');
var url = require('url');
var proxy = require('proxy-middleware');

gulp.task('browser-sync', function() {
  // Forward all requests at `localhost:3000/api` to the dev server root.
  var path = 'http://156.56.176.66:8080';
  var proxyOptions = url.parse(path);
  proxyOptions.route = '/api';

  browserSync({
    server: {
      baseDir: './build',
      middleware: [proxy(proxyOptions)]
    },
    notify: false
  });
});
