'use strict';

var Reflux = require('reflux');

var actions = require('../actions');
var dataStore = require('./data');

module.exports = Reflux.createStore({
  listenables: actions,
  init: function() {
    this.listenTo(dataStore, this.onStoreChange);
    this.selectedIds = [];
  },
  //
  // Store methods
  //
  onStoreChange: function(data) {
    this.source = data;
    this.output();
  },
  //
  // Action methods
  //
  onSetMessageStoreWithAllIds: function(groupId) {
    var ids = dataStore.data.groupMap[groupId].memberList
    this.output(ids);
  },
  onSetMessageStoreWithSelectedIds: function() {
    this.output(this.selectedIds);
  },
  onSetSelectedIdsForMessage: function(id, isSelected) {
    var index = this.selectedIds.indexOf(id);
    var containsId = index >= 0;
    if(isSelected && !containsId) {
      this.selectedIds.push(id);
    }
    else if(!isSelected && containsId) {
      this.selectedIds.splice(index, 1);
    }
    this.output(this.selectedIds);
  },
  //
  // Handler methods
  //
  output: function(ids) {
    if(!this.source) {
      return;
    }

    this.trigger(ids);
  }
});
