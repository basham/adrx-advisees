'use strict';

var request = require('superagent');

var actions = require('./');
var helpers = require('../helpers');

actions.notifyGroup.listen(function(groupId, emplids, ccList, bccList, subject, message) {
  var query = helpers.getQueryParams();
  //query.action = 'notifyGroup';
  query.groupId = groupId;

  request
    .post(helpers.api('sendStudentListNote'))
    .type('form')
    .query(query)
    .send({
      emplids: emplids,
      ccList: ccList,
      bccList: bccList,
      subject: subject,
      message: message
    })
    .end(helpers.requestCallback(completed(groupId), failed));
});

function completed(groupId) {
  return function() {
    actions.notifyGroup.completed(groupId);
    actions.redirect('group', { id: groupId });
  }
}

function failed() {
  actions.notifyGroup.failed('Notification could not be sent. Please try again.');
}
