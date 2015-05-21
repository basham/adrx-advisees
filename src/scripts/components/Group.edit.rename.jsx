'use strict';

var React = require('react');
var Reflux = require('reflux');

var actions = require('../actions');

var Alert = require('./Alert');

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
      isDisabled: true,
      groupName: this.props.data.groupName
    }
  },
  //
  // Render methods
  //
  render: function() {
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
            disabled={this.state.isDisabled}
            type="submit">
            Save
          </button>
        </div>
      </form>
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
  handleGroupNameInputChange: function(event) {
    var value = event.target.value;
    this.setState({
      isDisabled: value.trim() === this.props.data.groupName,
      groupName: value
    });
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var groupId = this.props.data.groupId;
    var value = this.state.groupName;
    actions.renameGroup(groupId, value);
  },
  //
  // Action methods
  //
  onRenameGroupFailed: function(message) {
    this.setState({
      errorMessage: message,
      requesting: false
    });
  }
});

module.exports = GroupEdit;
