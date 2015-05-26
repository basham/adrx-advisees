'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var Link = Router.Link;
var classNames = require('classnames');

var actions = require('../actions');
var helpers = require('../helpers');

var Alert = require('./Alert');
var Icon = require('./Icon');

var GroupNotify = React.createClass({
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
      inputValue: ''
    }
  },
  //
  // Render methods
  //
  render: function() {
    var params = {
      id: this.props.params.id
    };

    return (
      <div className="adv-App-membership">
        <header className="adv-App-header">
          <h1 className="adv-App-heading">
            Notify for {this.props.data.groupName}
          </h1>
          <Link
            className="adv-Link adv-Link--underlined"
            params={params}
            to="group.edit">
            Edit group
          </Link>
        </header>
        <Link
          className="adv-Link adv-Link--underlined"
          params={params}
          to="group">
          Return to Caseload
        </Link>

        <form
          className="adv-AddMemberForm adv-AddMemberForm--small"
          onSubmit={this.handleSubmit}>
          <label
            className="adv-Label"
            htmlFor="adv-AddMemberForm-input">
            To
          </label>
          <div className="adv-AddMemberForm-field">
            <input
              className="adv-AddMemberForm-input adv-Input"
              id="adv-AddMemberForm-input"
              onChange={this.handleInputChange}
              maxLength="10"
              placeholder="Username or University ID"
              value={this.state.inputValue}
              type="text"/>
          </div>
          <button
            className="adv-AddMemberForm-button adv-Button"
            type="submit">
            Send
          </button>
        </form>

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
  renderSingleAddMemberForm: function() {
    return (
      <form
        className="adv-AddMemberForm adv-AddMemberForm--small"
        onSubmit={this.handleSubmit}>
        <label
          className="adv-Label"
          htmlFor="adv-AddMemberForm-input">
          Student
        </label>
        <div className="adv-AddMemberForm-field">
          <input
            className="adv-AddMemberForm-input adv-Input"
            id="adv-AddMemberForm-input"
            onChange={this.handleInputChange}
            maxLength="10"
            placeholder="Username or University ID"
            value={this.state.inputValue}
            type="text"/>
          <button
            className="adv-AddMemberForm-button adv-Button"
            type="submit">
            Add
          </button>
        </div>
        <p>
          <a
            className="adv-Link adv-Link--underlined"
            onClick={this.handleBulkButtonClick}>
            Add students in bulk
          </a>
        </p>
      </form>
    );
  },
  renderBulkAddMemberForm: function() {
    return (
      <form
        className="adv-AddMemberForm"
        onSubmit={this.handleSubmit}>
        <label
          className="adv-Label"
          htmlFor="adv-AddMemberForm-textarea">
          Students
        </label>
        <textarea
          className="adv-AddMemberForm-textarea adv-Input"
          id="adv-AddMemberForm-textarea"
          onChange={this.handleInputChange}
          placeholder="Usernames or University IDs"
          rows="5"
          value={this.state.inputValue}/>
        <p className="adv-AddMemberForm-instructions">
          Separate student usernames or University&nbsp;IDs with a space, a return, or a comma.
        </p>
        <div className="adv-AddMemberForm-controls">
          <button
            className="adv-AddMemberForm-button adv-Button"
            type="submit">
            Add
          </button>
        </div>
      </form>
    );
  },
  renderEmpty: function() {
    return (
      <p className="adv-App-empty">
        No students in this group.
      </p>
    );
  },
  renderMember: function(member) {
    var removeLabel = ['Remove', member.name, 'from group'].join(' ');
    return (
      <li className="adv-MemberList-item adv-Membership">
        <header className="adv-Membership-header">
          <h2 className="adv-Membership-name">
            {member.name}
          </h2>
          <span className="adv-Membership-id">
            {member.universityId}
          </span>
        </header>
        <div className="adv-Membership-controls">
          <button
            aria-label={removeLabel}
            className="adv-Membership-removeButton"
            onClick={this.handleRemoveButtonClick(member)}>
            <Icon
              className="adv-Membership-removeButtonIcon"
              name="remove"/>
          </button>
        </div>
      </li>
    );
  },
  //
  // Handler methods
  //
  handleBulkButtonClick: function(event) {
    this.setState({
      isBulkUpload: true
    });
  },
  handleInputChange: function(event) {
    this.setState({
      inputValue: event.target.value
    });
  },
  handleRemoveButtonClick: function(member) {
    return function(event) {
      actions.removeMember(this.props.data.groupId, member.universityId);
    }.bind(this);
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var groupId = this.props.data.groupId;
    var value = this.state.inputValue;
    actions.addMember(groupId, value);
  },
  //
  // Action methods
  //
  onAddMemberCompleted: function() {
    this.setState({
      inputValue: ''
    });
  }
});

module.exports = GroupNotify;
