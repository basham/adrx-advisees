var gulp = require('gulp');
var browserSync = require('browser-sync');
var url = require('url');
var proxy = require('proxy-middleware');

var config = require('./config');

gulp.task('browser-sync', function() {
  // Forward all requests at `localhost:3000/api` to a remote server.
  var proxyOptions = url.parse(config.proxy);
  proxyOptions.route = '/api';

  browserSync({
    server: {
      baseDir: './build',
      middleware: [proxy(proxyOptions)]
    },
    notify: false
  });
});
