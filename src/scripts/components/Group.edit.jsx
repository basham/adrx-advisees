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
      showDeleteGroupDialog: false,
      showRemoveMembersDialog: false
    }
  },
  //
  // Render methods
  //
  render: function() {
    return (
      <section className="adv-App">
        <h1 className="adv-App-heading">
        Edit {this.props.data.groupName}
        </h1>
        <Link to="group.membership" className="adv-Link--underlined" params={{ id: this.props.params.id}}>Cancel</Link>
        <div>
          {this.renderRenameGroup()}
          {this.renderRemoveGroupMembers()}
          {this.renderDeleteGroup()}
        </div>
      </section>
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
        className="adv-Advisee-nameGroup adv-Advisee-nameGroup--fixed"
        onSubmit={this.handleSubmit}>
        <h2 className="adv-Advisee-heading">
          Rename
        </h2>
        <input
          className="adv-Input"
          maxLength="50"
          onChange={this.handleGroupNameInputChange}
          type="text"
          value={this.state.groupName}/>
        <button
          className="qn-ActionBar-item qn-Button"
          type="submit">
          Save
        </button>
      </form>
    );
  },
  renderRemoveGroupMembers: function() {
    var dialogMessage = (
      <span>Delete <em>{this.props.data.groupName}</em> group?</span>
    );

    return (
      <div>
        <h2 className="adv-Advisee-heading">
          Remove all members
        </h2>
        <div>
          Remove all members. The group will not be deleted.
        </div>
        <button
          className="adv-Advisee-controls-remove"
          onClick={this.handleRemoveMembersDialog}>
          Remove all members
        </button>
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
    var dialogMessage = (
      <span>Remove all members from <em>{this.props.data.groupName}</em> group?</span>
    );

    return (
      <div>
        <h2 className="adv-Advisee-heading">
          Delete group
        </h2>
        <div>
          Remove all members and delete the group.
        </div>
        <button
          className="adv-Advisee-controls-remove"
          onClick={this.handleDeleteGroupDialog}>
          Delete group
        </button>
        <Dialog
         confirmationButtonLabel="Yes, delete"
         message={dialogMessage}
         show={this.state.showDeleteGroupDialog}
         onCancel={this.handleDeleteGroupDialogCancel}
         onConfirm={this.handleDeleteGroupDialogConfirm}
         title="Delete group"/>
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
  handleDeleteGroupDialog: function(event) {
    event.preventDefault();
    this.setState({
      showDeleteGroupDialog: true
    });
  },
  handleDeleteGroupDialogCancel: function() {
    this.setState({
      showDeleteGroupDialog: false
    });
  },
  handleDeleteGroupDialogConfirm: function() {
    this.handleDeleteGroupDialogCancel();
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
