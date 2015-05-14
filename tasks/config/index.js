var argv = require('yargs').argv;

exports.isProduction = argv.p || argv.production;

var defaultProxy = 'localhost:8000';
var defaultRemoteProxy = '156.56.176.66:8080';
var proxy = argv.proxy === 'remote' ? defaultRemoteProxy : argv.proxy;
exports.proxy = 'http://' + (proxy || defaultProxy);
