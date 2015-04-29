'use strict';

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var App = require('./components/App');
var GroupView = require('./components/Group.view');

var routes = (
  <Route handler={App} ignoreScrollBehavior>
    <Route name="group.view" handler={GroupView} path=":id" />
  </Route>
);

Router.run(routes, function(Handler, state) {
  React.render(
    <Handler
      params={state.params}
      query={state.query} />,
    document.getElementById('adrx-advisees-app')
  );
});

// Eliminate 300ms click delay on mobile.
var FastClick = require('fastclick');
FastClick.attach(document.body);
