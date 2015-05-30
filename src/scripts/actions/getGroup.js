'use strict';

var actions = require('./');
var dataStore = require('../stores/data');

var actionQueue = [];

dataStore.listen(function(data) {
  // Execute and remove all queued actions.
  while(actionQueue.length) {
    var action = actionQueue.pop();
    action();
  }
});

actions.getGroup.listen(function(id) {
  var data = dataStore.data;

  // If there's no data, then queue the action to be called later,
  // once there's data.
  if(!data) {
    actionQueue.push(function() {
      this(id);
    }.bind(this));
    return;
  }

  id = id ? id : data.defaultGroupId;
  var hasGroup = !!data.groupMap[id];
  if(!hasGroup) {
    failed(id);
    return;
  }

  completed(data, id);
});

function completed(data, id) {
  actions.getGroup.completed(data, id);
}

function failed(id) {
  var message = ['ERROR: Group not found (id:', id, ')'].join(' ');
  actions.getGroup.failed(message);
}
