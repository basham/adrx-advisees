'use strict';

var Reflux = require('reflux');

var actions = Reflux.createActions([
  'getData',
  'getDataFailed',
  'getGroup',
  'sortBy'
]);

module.exports = actions;
