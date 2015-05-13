'use strict';

var Reflux = require('reflux');

var dataStore = require('./data');

module.exports = Reflux.createStore({
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
    //
    // Todo:
    // Sort groups alphabetically, ignoring case.
    // Place default group on top.
    //
    this.data = {
      defaultId: data.defaultGroupId,
      items: groupList
    };
    this.trigger(this.data);
  }
});
