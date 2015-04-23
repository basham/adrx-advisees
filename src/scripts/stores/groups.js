'use strict';

var Reflux = require('reflux');
var request = require('superagent');

var actions = require('../actions');
var helpers = require('../helpers');
var sortStore = require('./sort');

var groupListStore = Reflux.createStore({
  listenables: actions,
  //
  // Action methods
  //
  onGetData: function() {
    setTimeout(function() {
      this.handleSuccess(require('./data.json'));
    }.bind(this), 0);
  },
  //
  // Handler methods
  //
  handleSuccess: function(data) {
    var output = data.groupList;
    this.trigger(output);
  }
});

module.exports = groupListStore;
