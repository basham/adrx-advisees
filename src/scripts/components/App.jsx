'use strict';

var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var actions = require('../actions');
var dataStore = require('../stores/data');

var App = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  mixins: [
    Reflux.listenTo(dataStore, 'onStoreChange'),
    Reflux.listenToMany(actions)
  ],
  //
  // Lifecycle methods
  //
  componentDidMount: function() {
    actions.getData();
  },
  //
  // Render methods
  //
  render: function() {
    return (
      <RouteHandler {...this.props} />
    );
  },
  //
  // Store methods
  //
  onStoreChange: function(data) {
    if(this.props.params.id) {
      return;
    }

    // Transition to the default group if there is none selected.
    actions.redirectToGroup(data.defaultGroupId);
  },
  //
  // Action methods
  //
  onRedirectToGroup: function(groupId) {
    this.context.router.transitionTo('group', { id: groupId });
  },
  onRemoveAllMembersCompleted: function(groupId) {
    this.context.router.transitionTo('group.membership', { id: groupId });
  }
});

module.exports = App;
