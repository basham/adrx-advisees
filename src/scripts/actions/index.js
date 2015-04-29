'use strict';

var Reflux = require('reflux');

var actions = Reflux.createActions([
  'getData',
  'getDataFailed',
  'getGroup',
  'sortBy',
  'removeMember'
]);

module.exports = actions;
