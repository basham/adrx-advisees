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
var Heading = require('./Group.heading');

var GroupMembership = React.createClass({
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
      inputValue: '',
      isBulkUpload: false,
      requesting: false
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
      <div className="adv-App-editView">
        <Heading
          groupId={this.props.params.id}
          groupName={this.props.data.groupName}
          label="Edit Membership" />
        {this.renderError()}
        {this.state.isBulkUpload ? this.renderBulkAddMemberForm() : this.renderSingleAddMemberForm()}
        {this.renderList()}
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
            placeholder="Username or University ID"
            value={this.state.inputValue}
            type="text"/>
          <button
            className="adv-AddMemberForm-button adv-Button"
            disabled={this.state.requesting}
            type="submit">
            {this.renderButtonLabel()}
          </button>
        </div>
        <button
          className="adv-Link"
          onClick={this.handleBulkButtonClick}>
          Add students in bulk
        </button>
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
            disabled={this.state.requesting}
            type="submit">
            {this.renderButtonLabel()}
          </button>
        </div>
      </form>
    );
  },
  renderButtonLabel: function() {
    if(!this.state.requesting) {
      return 'Add';
    }

    return (
      <span>
        Adding
        <span className="adv-ProcessIndicator"/>
      </span>
    )
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
            disabled={this.state.requesting}
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
      this.setState({
        requesting: true
      });
    }.bind(this);
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var groupId = this.props.data.groupId;
    var value = this.state.inputValue;
    actions.addMember(groupId, value);
    this.setState({
      requesting: true
    });
  },
  //
  // Action methods
  //
  onAddMemberCompleted: function(groupId, json) {
    //console.log('json = ', json );

    // Added - 200 - OK
    // Already in the group - 204 - No Content
    // Not Found - 404 - Not Found
    var message = '';
    var messageMap = {
      "200": { "status": "200", "count": 0, "queryList":"", partOfMessage: " added." },
      "204": { "status": "204", "count": 0, "queryList":"", partOfMessage: " is/are already in the group." },
      "404": { "status": "404", "count": 0, "queryList":"", partOfMessage: " could not be found." }
    };

    Object.keys(json.emplidsResultMap).forEach(function(key) {
      var result = json.emplidsResultMap[key];
      var query = key;
      //var emplid = result[0];
      //var text = result[1]; // Added/Already in the group/Not Found
      var status = result[2]; // 200/204/404
      //var title = result[3]; // OK/No Content/Not Found

      messageMap[status].count = messageMap[status].count + 1;
      messageMap[status].queryList = messageMap[status].queryList + ', ' + query;
    });
    //console.log('messageMap = ', messageMap );

    Object.keys(messageMap).forEach(function(key) {
      var status = key;
      var count = messageMap[status].count;
      if(count > 0) {
        var queryList = messageMap[status].queryList.substr(2);
        var partOfMessage = messageMap[status].partOfMessage;

        message = message + count + helpers.pluralize(count, ' student');
        message = message + partOfMessage;
        message = message + ' -- ' + queryList;
        message = message + '<hr />';
      }
    });
    message = message.substring(0, message.length - 6);

    this.setState({
      errorMessage: message,
      inputValue: '',
      requesting: false
    });
  },
  onRemoveMemberCompleted: function() {
    this.setState({
      errorMessage: null,
      requesting: false
    });
  },
  onRemoveMemberFailed: function(message) {
    this.setState({
      errorMessage: message,
      requesting: false
    });
  }
});

module.exports = GroupMembership;
