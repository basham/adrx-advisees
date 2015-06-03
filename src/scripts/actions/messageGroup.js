'use strict';

var request = require('superagent');

var actions = require('./');
var helpers = require('../helpers');

var dataStore = require('../stores/data');

actions.messageGroup.listen(function(groupId, emplids, ccList, bccList, subject, message) {
  var query = helpers.getQueryParams();
  query.groupId = groupId;

  /*-- Test module --
  return setTimeout(function() {
    completed(groupId, emplids)();
    //failed();
  }, 5000);
  --*/

  request
    .post(helpers.api('sendStudentListNote'))
    .type('form')
    .query(query)
    .send({
      emplids: emplids.toString(),
      ccList: ccList,
      bccList: bccList,
      subject: subject,
      message: message
    })
    .end(helpers.requestCallback(completed(groupId, emplids), failed));
});

function completed(groupId, peopleIds) {
  var message = 'Message sent to';
  if(peopleIds.length > 1) {
    message = [message, peopleIds.length, 'students.'].join(' ');
  }
  else {
    var id = peopleIds[0];
    var name = dataStore.data.memberMap[id].studentName;;
    message = [message, name].join(' ') + '.';
  }
  return function() {
    var unsubscribe = actions.redirect.completed.listen(function(routeName, params) {
      if(routeName !== 'group' && params.id !== groupId) {
        return;
      }
      actions.messageGroup.completed(message);
      unsubscribe();
    });
    actions.redirect('group', { id: groupId });
  }
}

function failed() {
  actions.messageGroup.failed('Notification could not be sent. Please try again.');
}
