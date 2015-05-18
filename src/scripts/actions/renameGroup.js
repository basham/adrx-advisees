'use strict';

var request = require('superagent');

var actions = require('./');
var helpers = require('../helpers');

actions.renameGroup.listen(function(groupId, value) {
  var query = helpers.getQueryParams();
  query.action = 'updateGroup';
  query.groupId = groupId;
  //
  // TO DO:
  // Remove `query.emplids` once backend accepts `send` parameters.
  //
  query.groupName = value;

  request
    .post(helpers.api('handleAdHocGroup'))
    .query(query)
    .send({
      emplids: value
    })
    .end(helpers.requestCallback(completed(groupId, value), failed));
});

function completed(groupId, value) {
  return function() {
    actions.renameGroup.completed(groupId, value);
  }
}

function failed() {
  actions.renameGroup.failed('Could not rename group. Please try again.');
}
