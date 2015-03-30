'use strict';

var Reflux = require('reflux');

var actions = Reflux.createActions([
  'getData',
  'getDataFailed',
  'sortBy'
]);

module.exports = actions;
