var argv = require('yargs').argv;
var pjson = require('../../package.json');

exports.isProduction = argv.p || argv.production;

// Prefer supplied proxy name first.
// Otherwise, assume the proxy value is an address.
// But if nothing is supplied as an argument, then use the default address.
var defaultProxyName = 'default';
var proxyName = argv.proxy || defaultProxyName;
var address = pjson.proxy[proxyName] || argv.proxy || pjson.proxy[defaultProxyName];

exports.proxy = 'http://' + address;
