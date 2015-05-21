'use strict';

var request = require('superagent');

var actions = require('./');
var helpers = require('../helpers');

actions.deleteGroup.listen(function(groupId) {
  var query = helpers.getQueryParams();
  query.action = 'deleteGroup';
  query.groupId = groupId;
  //
  // TO DO:
  // Remove `query.emplids` once backend accepts `send` parameters.
  //
  query.groupId = groupId;

  request
    .post(helpers.api('handleAdHocGroup'))
    .query(query)
    .send()
    .end(helpers.requestCallback(completed(groupId), failed));
});

function completed(groupId) {
  return function() {
    actions.deleteGroup.completed(groupId);
  }
}

function failed() {
  actions.deleteGroup.failed('Could not delete group. Please try again.');
}
