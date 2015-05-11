'use strict';

var request = require('superagent');

//var groupStore = require('../group');
var mixins = require('../mixins');
var actions = require('../../actions');

var _store = null;

module.exports = function(store) {
  _store = store;
  console.log('..', store);
  return handler;
};

function handler(groupId, value) {
  var query = this.getQueryParams();
  query.action = 'addMember';
  query.groupId = groupId;
  //
  // TO DO:
  // Remove `query.emplids` once backend accepts `send` parameters.
  //
  query.emplids = value;

  var req = request
    .post(this.api('handleAdHocGroup'))
    .query(query)
    .send({
      emplids: value
    })
    .end(mixins.requestCallback(handleSuccess, handleFailure));
}

function handleSuccess(json) {
  console.log('**', json, _store);
  //group.data...
}

function handleFailure(json) {
  actions.addMemberFailed('Could not add member. Please try again.');
}
