'use strict';

var request = require('superagent');

var actions = require('./');
var helpers = require('../helpers');
var dataStore = require('../stores/data');

actions.renameGroup.shouldEmit = function(groupId, value) {
  // Error if there are existing groups with the same name.
  var groupMap = dataStore.data.groupMap;
  var groupsWithDuplicateNames = Object
    .keys(groupMap)
    .map(function(id) {
      return groupMap[id];
    })
    .filter(function(group) {
      var isNotItself = group.groupId !== groupId;
      var isDuplicate = group.groupName.toLowerCase() === value.toLowerCase();
      return isNotItself && isDuplicate;
    });
  var isDuplicateName = !!groupsWithDuplicateNames.length;
  if(isDuplicateName) {
    actions.renameGroup.failed('Group name already exists.');
    return false;
  }
  return true;
};

actions.renameGroup.listen(function(groupId, value) {
  var query = helpers.getQueryParams();
  query.action = 'renameGroup';
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
