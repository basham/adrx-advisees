'use strict';

var Reflux = require('reflux');

var dataStore = require('./data');

var groupListStore = Reflux.createStore({
  init: function() {
    this.listenTo(dataStore, this.onStoreChange);
  },
  //
  // Store methods
  //
  onStoreChange: function(data) {
    var groupList = Object.keys(data.groupMap).map(function(key) {
      return data.groupMap[key];
    });
    this.trigger({
      defaultId: data.defaultGroupId,
      items: groupList
    });
  }
});

module.exports = groupListStore;
