'use strict';

var Reflux = require('reflux');

var actions = Reflux.createActions([
  'getData',
  'getDataFailed',
  'getGroup',
  'sortBy',
  // Group actions
  'createGroup',
  'createGroupCompleted',
  'createGroupFailed',
  // Member actions
  'removeMember',
  'addMember',
  'addMemberFailed'
]);

module.exports = actions;
