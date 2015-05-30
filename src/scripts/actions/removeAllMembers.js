'use strict';

var request = require('superagent');

var actions = require('./');
var helpers = require('../helpers');

actions.removeAllMembers.listen(function(groupId, memberId) {
  var query = helpers.getQueryParams();
  query.action = 'removeAllMembersFromGroup';
  query.groupId = groupId;

  request
    .post(helpers.api('handleAdHocGroup'))
    .query(query)
    .send()
    .end(helpers.requestCallback(completed(groupId), failed));
});

function completed(groupId) {
  return function() {
    actions.removeAllMembers.completed(groupId);
  }
}

function failed() {
  actions.removeAllMembers.failed('Could not remove all members. Please try again.');
}
