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
    .end(helpers.requestCallback(completed, failed));
});

function completed(json) {
  // Prepare group object.
  var key = Object.keys(json.groupMap)[0];
  var group = json.groupMap[key];
  group.memberList = [];

  actions.createGroup.completed(group);
}

function failed() {
  actions.createGroup.failed('Could create group. Please try again.');
}
