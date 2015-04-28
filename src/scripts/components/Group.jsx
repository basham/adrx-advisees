'use strict';

var React = require('react');

var actions = require('../actions');
var dataStore = require('../stores/data');

var Group = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  mixins: [
    Reflux.listenTo(dataStore, 'onStoreChange')
  ],
  //
  // Render methods
  //
  render: function() {
    return null;
  },
  //
  // Store methods
  //
  onStoreChange: function(data) {
    var id = data.defaultGroupId;
    this.context.router.transitionTo('group.view', { id: id });
  }
});

module.exports = Group;
