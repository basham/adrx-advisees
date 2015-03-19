'use strict';

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

var App = require('./components/App');

var routes = (
  <Route handler={App} ignoreScrollBehavior />
);

Router.run(routes, function(Handler, state) {
  React.render(<Handler params={state.params} />, document.getElementById('adrx-advisees-app'));
});

// Eliminate 300ms click delay on mobile.
var FastClick = require('fastclick');
FastClick.attach(document.body);
