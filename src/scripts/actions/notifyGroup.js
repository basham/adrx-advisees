'use strict';

var request = require('superagent');

var actions = require('./');
var helpers = require('../helpers');

actions.notifyGroup.listen(function(groupId) {
  var query = helpers.getQueryParams();
  query.action = 'notifyGroup';
  query.groupId = groupId;

  request
    .post(helpers.api('sendStudentListNote'))
    .query(query)
    .send()
    .end(helpers.requestCallback(completed(groupId), failed));
});

function completed(groupId) {
  return function() {
    actions.notify.completed(groupId);
  }
}

function failed() {
  actions.notify.failed('Could not send emails. Please try again.');
}
