'use strict';

var Reflux = require('reflux');

var actions = require('../actions');
var dataStore = require('./data');

module.exports = Reflux.createStore({
  listenables: actions,
  init: function() {
    this.listenTo(dataStore, this.onStoreChange);
    this.allIds = [];
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
  onGetAllIdsForNotify: function(groupId) {
    this.allIds = [];
    this.allIds.push(groupId);
    console.log('++ from onGetAllIdsForNotify in notify.js ++ ', groupId, this.allIds);
    this.output();
  },
  onGetSelectedIdsForNotify: function(id, isSelected) {
    var index = this.selectedIds.indexOf(id);
    var containsId = index >= 0;
    if(isSelected && !containsId) {
      this.selectedIds.push(id);
    }
    else if(!isSelected && containsId) {
      this.selectedIds.splice(index, 1);
    }
    console.log('++ from onGetSelectedIdsForNotify in notify.js ++ ', id, isSelected, this.selectedIds);
    this.output();
  },
  //
  // Handler methods
  //
  output: function() {
    if(!this.source) {
      return;
    }

    this.trigger(this.data);
  }
});
