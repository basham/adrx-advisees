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

var GroupMembership = React.createClass({
  propTypes: {
    data: React.PropTypes.object
  },
  //
  // Lifecycle methods
  //
  getInitialState: function() {
    return {
      inputValue: '',
      isBulkUpload: false
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
      <div>
        <header className="adv-App-header">
          <h1 className="adv-App-heading">
            {this.props.data.groupName}
          </h1>
          <Link
            className="adv-App-editGroupLink adv-Link adv-Link--underlined"
            params={params}
            to="group.edit">
            Edit group
          </Link>
        </header>
        <Link
          className="adv-Link adv-Link--underlined"
          params={params}
          to="group.view">
          Return to Caseload
        </Link>
        {this.renderAddMember()}
        {this.renderList()}
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
  renderAddMember: function() {
    return (
      <form
        className="adv-AddMemberForm"
        onSubmit={this.handleSubmit}>
        {this.state.isBulkUpload ? this.renderTextareaField() : this.renderInputField()}
      </form>
    );
  },
  renderInputField: function() {
    return (
      <div>
        <label
          className="adv-Label"
          htmlFor="adv-AddMemberForm-input">
          Student
        </label>
        <div className="adv-AddMemberForm-field">
          <input
            className="adv-AddMemberForm-input adv-Input"
            id="adv-AddMemberForm-input"
            onChange={this.handleTitleInputChange}
            maxLength="10"
            placeholder="Username or University ID"
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
      </div>
    );
  },
  renderTextareaField: function() {
    return (
      <div>
        <label
          className="adv-Label"
          htmlFor="adv-AddMemberForm-textarea">
          Students
        </label>
        <textarea
          className="adv-AddMemberForm-textarea adv-Input"
          id="adv-AddMemberForm-textarea"
          placeholder="Usernames or University IDs"
          onChange={this.handleTitleInputChange}
          rows="5"
          cols="50" />
        <p className="adv-AddMemberForm-instructions">
          Separate student usernames or University IDs with a space, a return, or a comma.
        </p>
        <div className="adv-AddMemberForm-controls">
          <button
            className="adv-AddMemberForm-button adv-Button"
            type="submit">
            Add
          </button>
        </div>
      </div>
    );
  },
  renderEmpty: function() {
    return (
      <p className="adv-App-empty">
        No students in this group.
      </p>
    );
  },
  renderList: function() {
    var data = this.props.data.memberDetailList;
    var count = data.length;

    if(!count) {
      return this.renderEmpty();
    }

    return (
      <div>
        <div className="adv-Controls">
          <p className="adv-Controls-count">
            {count} {helpers.pluralize(count, 'student')}
          </p>
        </div>
        <ol className="adv-MemberList">
          {data.map(this.renderMember)}
        </ol>
      </div>
    );
  },
  renderMember: function(member, index) {
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
            className="adv-Membership-removeButton"
            onClick={this.handleRemoveButtonClick(member)}>
            <Icon
              className="adv-Membership-removeButtonIcon"
              name="x"/>
          </button>
        </div>
      </li>
    );
  },
  //
  // Handler methods
  //
  handleRemoveButtonClick: function(member) {
    return function(event) {
      actions.removeMember(this.props.data.groupId, member.universityId);
    }.bind(this);
  },
  handleTitleInputChange: function(e) {
    this.setState({
      memberId: e.target.value
    });
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var groupId = this.props.data.groupId;
    var value = this.state.memberId;

console.log('---add member', groupId, value);
    actions.addMember(groupId, value);
  },
  handleBulkButtonClick: function(event) {
    this.setState({
      isBulkUpload: true
    });
  }
});

module.exports = GroupMembership;
