'use strict';

var request = require('superagent');

var actions = require('./');
var helpers = require('../helpers');

actions.addMember.listen(function(groupId, value) {
  var query = helpers.getQueryParams();
  query.action = 'addMember';
  query.groupId = groupId;
  //
  // TO DO:
  // Remove `query.emplids` once backend accepts `send` parameters.
  //
  query.emplids = value;

  request
    .post(helpers.api('handleAdHocGroup'))
    .query(query)
    .send({
      emplids: value
    })
    .end(helpers.requestCallback(completed(groupId), failed));
});

function completed(groupId) {
  return function(data) {
    actions.addMember.completed(groupId, data);
  }
}

function failed() {
  actions.addMember.failed('Could not add member. Please try again.');
}
