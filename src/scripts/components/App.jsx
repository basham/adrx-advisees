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
    var id = data.defautGroupId;

console.log('```id=', data);
    this.context.router.transitionTo('group.view', { id: id });
  }
});

module.exports = App;
