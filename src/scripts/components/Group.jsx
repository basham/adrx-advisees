'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var actions = require('../actions');
var groupStore = require('../stores/group');
var notifyStore = require('../stores/notify');

var Group = React.createClass({
  mixins: [
    Reflux.listenTo(groupStore, 'onGroupStoreChange'),
    Reflux.listenTo(notifyStore, 'onNotifyStoreChange')
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
      notifyData: null
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
        notifyData={this.state.notifyData} />
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
 onNotifyStoreChange: function(data) {
  this.setState({
    notifyData: data
  });
 }
});

module.exports = Group;
