'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var Link = Router.Link;

var actions = require('../actions');

var Alert = require('./Alert');
var Dialog = require('./Dialog');

var GroupEdit = React.createClass({
  mixins: [
    Reflux.listenToMany(actions)
  ],
  //
  // Lifecycle methods
  //
  getInitialState: function() {
    return {
      groupName: this.props.data.groupName,
      showRemoveMembersDialog: false
    }
  },
  //
  // Render methods
  //
  render: function() {
    return (
      <div className="adv-App-editGroup">
        <header className="adv-App-header">
          <h1 className="adv-App-heading">
            Edit <em>{this.props.data.groupName}</em>
          </h1>
          <Link
            className="adv-Button"
            params={{ id: this.props.params.id }}
            to="group.membership">
            Cancel
          </Link>
        </header>
        {this.renderRenameGroup()}
        {this.renderRemoveGroupMembers()}
        {this.renderDeleteGroup()}
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
  renderRenameGroup: function() {
    return (
      <form
        className="adv-EditGroup"
        onSubmit={this.handleSubmit}>
        <h2 className="adv-EditGroup-heading">
          Rename
        </h2>
        <input
          aria-label="Group name"
          className="adv-Input"
          maxLength="50"
          onChange={this.handleGroupNameInputChange}
          type="text"
          value={this.state.groupName}/>
        <div className="adv-EditGroup-controls">
          <button
            className="adv-Button"
            type="submit">
            Save
          </button>
        </div>
      </form>
    );
  },
  renderRemoveGroupMembers: function() {
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
            onClick={this.handleRemoveMembersDialog}>
            Remove all members
          </button>
        </div>
        <Dialog
         confirmationButtonLabel="Yes, remove members"
         message={dialogMessage}
         show={this.state.showRemoveMembersDialog}
         onCancel={this.handleRemoveMembersDialogCancel}
         onConfirm={this.handleRemoveMembersDialogConfirm}
         title="Remove members"/>
      </div>
    );
  },
  renderDeleteGroup: function() {
    return (
      <div className="adv-EditGroup">
        <h2 className="adv-EditGroup-heading">
          Delete group
        </h2>
        <p>
          Remove all members and delete the group.
        </p>
        <div className="adv-EditGroup-controls">
          <button
            className="adv-Button"
            onClick={this.handleDeleteGroupButtonClick}>
            Delete group
          </button>
        </div>
      </div>
    );
  },
  //
  // Handler methods
  //
  handleGroupNameInputChange: function(event) {
    this.setState({
      groupName: event.target.value
    });
  },
  handleDeleteGroupButtonClick: function() {
    actions.deleteGroup(this.props.data.groupId);
  },
  handleRemoveMembersDialog: function(event) {
    event.preventDefault();
    this.setState({
      showRemoveMembersDialog: true
    });
  },
  handleRemoveMembersDialogCancel: function() {
    this.setState({
      showRemoveMembersDialog: false
    });
  },
  handleRemoveMembersDialogConfirm: function() {
    this.handleRemoveMembersDialogCancel();
    actions.removeAllMembers(this.props.data.groupId);
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var groupId = this.state.data.groupId;
    var value = this.state.groupName;
    actions.renameGroup(groupId, value);
  },
  //
  // Action methods
  //
  onDeleteGroupFailed: function(message) {
    this.setState({
      errorMessage: message,
      requesting: false
    });
  },
  onRemoveAllMembersFailed: function(message) {
    this.setState({
      errorMessage: message,
      requesting: false
    });
  },
  onRenameGroupFailed: function(message) {
    this.setState({
      errorMessage: message,
      requesting: false
    });
  }
});

module.exports = GroupEdit;
