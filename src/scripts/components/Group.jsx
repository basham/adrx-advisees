'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var actions = require('../actions');
var groupStore = require('../stores/group');

var Alert = require('./Alert');

var Group = React.createClass({
  mixins: [
    Reflux.listenTo(groupStore, 'onStoreChange'),
    Reflux.listenToMany(actions)
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
      data: {},
      requesting: true
    }
  },
  //
  // Render methods
  //
  render: function() {
    var content = null;

    if(this.state.requesting) {
      content = this.renderLoading();
    }
    else if(this.state.errorMessage) {
      content = this.renderError();
    }
    else {
      content = this.renderView();
    }

    return (
      <section className="adv-App">
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
  renderView: function() {
    return (
      <RouteHandler
        {...this.props}
        data={this.state.data} />
    );
  },
  //
  // Store methods
  //
  onStoreChange: function(data) {
   this.setState({
     data: data,
     requesting: false
   });
  },
  //
  // Action methods
  //
  onGetData: function() {
    this.setState({
      errorMessage: null,
      requesting: true
    });
  },
  onGetDataFailed: function(message) {
    this.setState({
      errorMessage: message,
      requesting: false
    }, function() {
      this.refs.error.getDOMNode().focus();
    });
  }
});

module.exports = Group;
