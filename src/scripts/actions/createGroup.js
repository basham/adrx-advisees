'use strict';

var request = require('superagent');

var actions = require('./');
var helpers = require('../helpers');

actions.createGroup.listen(function(name) {
  var params = helpers.getQueryParams();
  request
    .post(helpers.api('handleAdHocGroup'))
    .query({
      sr: params.sr,
      action: 'createGroup',
      groupName: name
    })
    .send({
      groupName: name
    })
    .end(helpers.requestCallback(completed, failed(name)));
});

function completed(json) {
  // Prepare group object.
  var key = Object.keys(json.groupMap)[0];
  var group = json.groupMap[key];
  group.memberList = [];
  if(group.isEditable != false && group.isEditable != true) {
    group.isEditable = true;
  }

  actions.createGroup.completed(group);
}

function failed(name) {
  return function() {
    actions.createGroup.failed('Could not create group. Please try again.', name);
  }
}
