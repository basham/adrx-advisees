'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var Link = Router.Link;
var classNames = require('classnames');

var actions = require('../actions');
var groupStore = require('../stores/group');
var helpers = require('../helpers');

var Alert = require('./Alert');
var Icon = require('./Icon');

var GroupMembership = React.createClass({
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
      data: {
        memberDetailList: []
      },
      requesting: true,
      inputValue: '',
      isBulkUpload: false
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
      content = this.renderContent();
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
  renderContent: function() {
    var data = this.state.data.memberDetailList;
    var content = null;

    if(this.state.errorMessage) {
      content = this.renderError();
    }
    else {
      content = data.length ? this.renderList(data) : this.renderEmpty();
    }

    var params = {
      id: this.props.params.id
    };

    return (
      <div>
        <header className="adv-App-header">
          <h1 className="adv-App-heading">
            {this.state.data.groupName}
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
        {content}
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
  renderList: function(data) {
    var count = data.length;
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
      actions.removeMember(this.state.data.groupId, member.universityId);
    }.bind(this);
  },
  handleTitleInputChange: function(e) {
    this.setState({
      memberId: e.target.value
    });
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var groupId = this.state.data.groupId;
    var value = this.state.memberId;

console.log('---add member', groupId, value);
    actions.addMember(groupId, value);
  },
  handleBulkButtonClick: function(event) {
    this.setState({
      isBulkUpload: true
    });
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

module.exports = GroupMembership;
