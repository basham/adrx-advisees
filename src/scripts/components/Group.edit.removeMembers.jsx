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
      showDialog: false
    }
  },
  //
  // Render methods
  //
  render: function() {
    var dialogMessage = (
      <span>Remove all members from <em>{this.props.data.groupName}</em> group?</span>
    );

    return (
      <div className="adv-EditGroup">
        <h2 className="adv-EditGroup-heading">
          Remove all members
        </h2>
        <p>
          Remove all members. The group will not be deleted.
        </p>
        <div className="adv-EditGroup-controls">
          <button
            className="adv-Button"
            onClick={this.handleDialog}>
            Remove all members
          </button>
        </div>
        <Dialog
         confirmationButtonLabel="Yes, remove members"
         message={dialogMessage}
         show={this.state.showDialog}
         onCancel={this.handleDialogCancel}
         onConfirm={this.handleDialogConfirm}
         title="Remove members"/>
      </div>
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
    });
  },
  handleDialogConfirm: function() {
    this.handleDialogCancel();
    actions.removeAllMembers(this.props.data.groupId);
  },
  //
  // Action methods
  //
  onRemoveAllMembersFailed: function(message) {
    this.setState({
      errorMessage: message,
      requesting: false
    });
  }
});

module.exports = GroupEdit;
