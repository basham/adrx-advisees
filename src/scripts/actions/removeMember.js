'use strict';

var request = require('superagent');

var actions = require('./');
var helpers = require('../helpers');

actions.removeMember.listen(function(groupId, memberId) {
  var query = helpers.getQueryParams();
  query.action = 'removeMember';
  query.groupId = groupId;
  //
  // TO DO:
  // Remove `query.emplids` once backend accepts `send` parameters.
  //
  query.emplids = memberId;

  request
    .post(helpers.api('handleAdHocGroup'))
    .query(query)
    .send({
      emplids: memberId
    })
    .end(helpers.requestCallback(completed(groupId, memberId), failed));
});

function completed(groupId, memberId) {
  return function() {
    actions.removeMember.completed(groupId, memberId);
  }
}

function failed() {
  actions.removeMember.failed('Could not remove member. Please try again.');
}
