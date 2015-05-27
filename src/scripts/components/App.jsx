'use strict';

var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var actions = require('../actions');
var dataStore = require('../stores/data');

var Alert = require('./Alert');

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
  getInitialState: function() {
    return {
      errorMessage: null,
      isLoading: true
    };
  },
  //
  // Render methods
  //
  render: function() {
    var content = this.renderContent();
    return content ? content : this.renderRoutes();
  },
  renderContent: function() {
    var content = null;

    if(this.state.isLoading) {
      content = this.renderLoading();
    }
    else if(this.state.errorMessage) {
      content = this.renderError();
    }

    if(!content) {
      return null;
    }

    return (
      <section className="adv-App">
        <h1 className="adv-App-heading">
          Caseload
        </h1>
        {content}
      </section>
    );
  },
  renderLoading: function() {
    return (
      <p className="adv-App-loading">
        Loading
        <span className="adv-ProcessIndicator"/>
      </p>
    );
  },
  renderError: function() {
    return (
      <Alert
        message={this.state.errorMessage}
        ref="error"
        type="error"/>
    );
  },
  renderRoutes: function() {
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
    actions.redirect('group', { id: data.defaultGroupId });
  },
  //
  // Action methods
  //
  onGetData: function() {
    this.setState({
      errorMessage: null,
      isLoading: true
    });
  },
  onGetDataCompleted: function() {
    this.setState({
      errorMessage: null,
      isLoading: false
    });
  },
  onGetDataFailed: function(message) {
    this.setState({
      errorMessage: message,
      isLoading: false
    });
  },
  onRedirect: function(routeName, params, query) {
    this.context.router.transitionTo(routeName, params, query);
  }
});

module.exports = App;
