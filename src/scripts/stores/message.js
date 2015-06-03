'use strict';

var Reflux = require('reflux');

var groupStore = require('./group');

module.exports = Reflux.createStore({
  init: function() {
    this.listenTo(groupStore, this.onStoreChange);
    this.data = [];
  },
  //
  // Store methods
  //
  onStoreChange: function(data) {
    this.data = data.memberDetailList
      .filter(function(member) {
        return member.isSelected;
      })
      .map(function(member) {
        return {
          id: member.universityId,
          name: member.name
        };
      });
    this.output();
  },
  //
  // Helper methods
  //
  output: function() {
    this.trigger(this.data);
  }
});
