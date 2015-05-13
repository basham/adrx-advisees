'use strict';

var Reflux = require('reflux');

var actions = require('../actions');

module.exports = Reflux.createStore({
  listenables: actions,
  //
  // Action methods
  //
  onGetDataCompleted: function(data) {
    this.data = data;
    this.output();
  },
  onCreateGroupCompleted: function(group) {
    this.data.groupMap[group.groupId] = group;
    this.output();
  },
  onAddMemberCompleted: function(groupId, json) {
    Object.keys(json.emplidsResultMap).forEach(function(key) {
      var status = json.emplidsResultMap[key];
      var isAdded = status[1] === 'Added';
      if(isAdded) {
        var member = json.memberMap[key];
        this.data.memberMap[key] = member;
        this.data.groupMap[groupId].memberList.push(key);
      }
    }.bind(this));
    this.output();
  },
  onRemoveMemberCompleted: function(groupId, memberId) {
    //var selectedGroup = this.group;
    //var member = selectedGroup.membershipList.splice(index, 1);
    //selectedGroup.memberDetailList.splice(index, 1);
    //this.output();
  },
  //
  // Helper methods
  //
  output: function() {
    this.trigger(this.data);
  }
});
