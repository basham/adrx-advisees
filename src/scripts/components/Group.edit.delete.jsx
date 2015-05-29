'use strict';

var React = require('react');
var Reflux = require('reflux');

var actions = require('../actions');

var Alert = require('./Alert');
var Dialog = require('./Dialog');

var GroupEdit = React.createClass({
  mixins: [
    Reflux.listenToMany(actions)
  ],
  propTypes: {
    data: React.PropTypes.object
  },
  //
  // Lifecycle methods
  //
  getInitialState: function() {
    return {
      errorMessage: null,
      requesting: false,
      showDialog: false
    }
  },
  //
  // Render methods
  //
  render: function() {
    var hasMembers = !!this.props.data.memberList.length;

    var description = hasMembers ?
      'Remove all members and delete the group.' :
      'There are no members in this group.';

    var dialogMessage = (
      <span>Delete <em>{this.props.data.groupName}</em> group?</span>
    );

    return (
      <div className="adv-EditGroup">
        <h2 className="adv-EditGroup-heading">
          Delete group
        </h2>
        {this.renderError()}
        <p>
          {description}
        </p>
        <div className="adv-EditGroup-controls">
          <button
            className="adv-Button"
            disabled={this.state.requesting}
            onClick={this.handleDialog}
            ref="button">
            {this.renderButtonLabel()}
          </button>
        </div>
        <Dialog
          confirmationButtonLabel="Yes, delete"
          message={dialogMessage}
          show={this.state.showDialog}
          onCancel={this.handleDialogCancel}
          onConfirm={this.handleDialogConfirm}
          title="Delete group"/>
      </div>
    );
  },
  renderError: function() {
    if(!this.state.errorMessage) {
      return null;
    }

    return (
      <Alert
        message={this.state.errorMessage}
        ref="error"
        type="error"/>
    );
  },
  renderButtonLabel: function() {
    if(!this.state.requesting) {
      return 'Delete group';
    }

    return (
      <span>
        Deleting group
        <span className="adv-ProcessIndicator"/>
      </span>
    )
  },
  //
  // Handler methods
  //
  handleDialog: function(event) {
    event.preventDefault();
    this.setState({
      showDialog: true
    });
  },
  handleDialogCancel: function() {
    this.setState({
      showDialog: false
    }, this.focus);
  },
  handleDialogConfirm: function() {
    this.handleDialogCancel();
    actions.deleteGroup(this.props.data.groupId);
    this.setState({
      requesting: true
    });
  },
  //
  // Action methods
  //
  onDeleteGroupFailed: function(message) {
    this.setState({
      errorMessage: message,
      requesting: false
    }, this.focus);
  },
  //
  // Helper methods
  //
  focus: function() {
    this.refs.button.getDOMNode().focus();
  }
});

module.exports = GroupEdit;
