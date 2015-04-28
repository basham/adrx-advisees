'use strict';

var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var actions = require('../actions');

var App = React.createClass({
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
  }
});

module.exports = App;
