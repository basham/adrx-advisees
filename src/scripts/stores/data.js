'use strict';

var Reflux = require('reflux');

var actions = require('../actions');

module.exports = Reflux.createStore({
  listenables: actions,
  //
  // Action methods
  //
  onGetDataCompleted: function(json) {
    Object.keys(json.groupMap).forEach(function(groupId) {
      var memberList = json.groupMap[groupId].memberList;
      json.groupMap[groupId].memberList = memberList.map(function(memberId) {
        return {
          id: memberId,
          isSelected: false
        };
      });
    });
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
        this.data.groupMap[groupId].memberList.push({
          id: emplid,
          isSelected: false
        });
      }
    }.bind(this));
    this.output();
  },
  onRemoveMemberCompleted: function(groupId, personId) {
    var list = this.data.groupMap[groupId].memberList;
    var member = list.filter(function(person) {
      return person.id === personId;
    })[0];
    list = list.splice(list.indexOf(member), 1);
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
  onSelectMember: function(groupId, personId, isSelected) {
    var isSelected = isSelected === undefined ? true : !!isSelected;
    var list = this.data.groupMap[groupId].memberList;
    var member = list.filter(function(person) {
      return person.id === personId;
    })[0];
    member.isSelected = isSelected;
    this.output();
  },
  onUnselectMember: function(groupId, peopleId) {
    this.onSelectMember(groupId, peopleId, false);
  },
  onSelectAllMembers: function(groupId, isSelected) {
    var isSelected = isSelected === undefined ? true : !!isSelected;
    var memberList = this.data.groupMap[groupId].memberList;
    this.data.groupMap[groupId].memberList = memberList.map(function(member) {
      member.isSelected = isSelected;
      return member;
    });
    this.output();
  },
  onUnselectAllMembers: function(groupId) {
    this.onSelectAllMembers(groupId, false);
  },
  //
  // Helper methods
  //
  output: function() {
    this.trigger(this.data);
  }
});
