'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var actions = require('../actions');
var groupStore = require('../stores/group');
var messageStore = require('../stores/message');

var Group = React.createClass({
  mixins: [
    Reflux.listenTo(groupStore, 'onGroupStoreChange'),
    Reflux.listenTo(messageStore, 'onMessageStoreChange')
  ],
  statics: {
    // Get the group by its id when transitioning to this component.
    willTransitionTo: function(transition, params) {
      actions.getGroup(params.id);
    }
  },
  //
  // Lifecycle methods
  //
  getInitialState: function() {
    return {
      groupData: null,
      messageData: null
    }
  },
  //
  // Render methods
  //
  render: function() {
    return (
      <section className="adv-App">
        {this.state.groupData ? this.renderRoutes() : this.renderLoading()}
      </section>
    );
  },
  // Prevents a flash of no content in the milliseconds it takes to
  // transform dataStore data into groupStore data.
  renderLoading: function() {
    return (
      <h1 className="adv-App-heading">
        Caseload
      </h1>
    );
  },
  renderRoutes: function() {
    return (
      <RouteHandler
        {...this.props}
        data={this.state.groupData}
        messageData={this.state.messageData} />
    );
  },
  //
  // Store methods
  //
  onGroupStoreChange: function(data) {
    this.setState({
      groupData: data
    });
  },
  onMessageStoreChange: function(data) {
    this.setState({
      messageData: data
    });
  }
});

module.exports = Group;
