'use strict';

var Reflux = require('reflux');
var request = require('superagent');

var actions = require('../actions');
var helpers = require('../helpers');

var dataStore = Reflux.createStore({
  listenables: actions,
  //
  // Action methods
  //
  onGetData: function() {
    /*
    setTimeout(function() {
      this.handleSuccess(require('./data.json'));
    }.bind(this), 0);
    return;
    */
    var params = helpers.getQueryParams();

    request
      .post(helpers.api('handleAdHocGroup'))
      .query({
        sr: params.sr,
        action: 'getGroupsAndMembers'
      })
      .send({
        sr: params.sr,
        action: 'getGroupsAndMembers',
        backdoorId: params.backdoorId
      })
      .end(helpers.requestCallback(this.handleSuccess, this.handleFail));
  },
  onCreateGroup: function(name) {
    var params = helpers.getQueryParams();
    request
      .post(helpers.api('handleAdHocGroup'))
      .query({
        sr: params.sr,
        action: 'createGroup',
        groupName: name
      })
      .send({
        groupName: name
      })
      .end(helpers.requestCallback(
        function(data) {
          // Prepare group object.
          var key = Object.keys(data.groupMap)[0];
          var group = data.groupMap[key];
          group.memberList = [];
          // Store group.
          this.data.groupMap[group.groupId] = group;
          // Broadcast changes.
          this.trigger(this.data);
          actions.createGroupCompleted(group.groupId);
        }.bind(this),
        this.handleFail
      ));
  },
  //
  // Handler methods
  //
  handleSuccess: function(data) {
console.log('+++SUCCESS');

    this.data = data;
    this.trigger(data);
  },
  handleFail: function() {
    var message = (
      <span>
        Advisees could not load.
        Please <button className='adv-Alert-link adv-Link' onClick={actions.getData}>try again</button>.
      </span>
    );
    actions.getDataFailed(message);
  }
});

module.exports = dataStore;
