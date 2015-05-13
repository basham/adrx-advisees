'use strict';

var Reflux = require('reflux');

var actions = require('../actions');

module.exports = Reflux.createStore({
  listenables: actions,
  //
  // Action methods
  //
  onGetDataCompleted: function(json) {
    this.data = json;
    this.output();
  },
  onCreateGroupCompleted: function(group) {
    this.data.groupMap[group.groupId] = group;
    this.output();
  },
  onAddMemberCompleted: function(groupId, json) {
    Object.keys(json.emplidsResultMap).forEach(function(key) {
      var status = json.emplidsResultMap[key];
      var emplid = status[0];
      var isAdded = status[1] === 'Added';
      if(isAdded) {
        var member = json.memberMap[emplid];
        this.data.memberMap[emplid] = member;
        this.data.groupMap[groupId].memberList.push(emplid);
      }
    }.bind(this));
    this.output();
  },
  onRemoveMemberCompleted: function(groupId, memberId) {
    var list = this.data.groupMap[groupId].memberList;
    list = list.splice(list.indexOf(memberId), 1);
    this.output();
  },
  //
  // Helper methods
  //
  output: function() {
    this.trigger(this.data);
  }
});
