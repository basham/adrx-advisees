var argv = require('yargs').argv;

exports.isProduction = argv.p || argv.production;
