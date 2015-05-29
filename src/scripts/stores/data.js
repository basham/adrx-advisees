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
  onRenameGroupCompleted: function(groupId, value) {
    this.data.groupMap[groupId].groupName = value;
    this.output();
    actions.redirect('group', { id: groupId });
  },
  onDeleteGroupCompleted: function(groupId) {
    delete this.data.groupMap[groupId];
    this.output();
    actions.redirectToDefaultGroup();
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
  onRemoveAllMembersCompleted: function(groupId) {
    this.data.groupMap[groupId].memberList = [];
    this.output();
    actions.redirect('group', { id: groupId });
  },
  onRedirectToDefaultGroup: function() {
    if(this.data) {
      actions.redirect('group', { id: this.data.defaultGroupId });
    }
  },
  //
  // Helper methods
  //
  output: function() {
    this.trigger(this.data);
  }
});
