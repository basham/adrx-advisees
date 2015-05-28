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
        <p>
          {description}
        </p>
        <div className="adv-EditGroup-controls">
          <button
            className="adv-Button"
            onClick={this.handleDialog}>
            Delete group
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
    actions.deleteGroup(this.props.data.groupId);
  },
  //
  // Action methods
  //
  onFailed: function(message) {
    this.setState({
      errorMessage: message,
      requesting: false
    });
  }
});

module.exports = GroupEdit;
