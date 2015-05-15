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
    Reflux.listenTo(dataStore, 'onStoreChange')
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
    var id = data.defaultGroupId;
    this.context.router.transitionTo('group', { id: id });
  }
});

module.exports = App;
