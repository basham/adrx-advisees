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

var dataStore = require('../stores/data');

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
      requestingAdd: false,
      requestingRemove: false,
      successMessage: null
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
        {this.renderSuccess()}
        {this.renderError()}
        {this.state.isBulkUpload ? this.renderBulkAddMemberForm() : this.renderSingleAddMemberForm()}
        {this.renderList()}
      </div>
    );
  },
  renderSuccess: function() {
    if(!this.state.successMessage) {
      return null;
    }

    return (
      <Alert
        message={this.state.successMessage}
        type="success"/>
    );
  },
  renderError: function() {
    if(!this.state.errorMessage) {
      return null;
    }

    return (
      <Alert
        message={this.state.errorMessage}
        type="error"/>
    );
  },
  renderSingleAddMemberForm: function() {
    return (
      <form
        className="adv-AddMemberForm"
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
            disabled={this.state.requestingAdd || this.state.requestingRemove}
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
            disabled={this.state.requestingAdd || this.state.requestingRemove}
            type="submit">
            {this.renderButtonLabel()}
          </button>
        </div>
      </form>
    );
  },
  renderButtonLabel: function() {
    if(!this.state.requestingAdd) {
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
            disabled={this.state.requestingAdd || this.state.requestingRemove}
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
        errorMessage: null,
        requestingRemove: true,
        successMessage: null
      });
    }.bind(this);
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var groupId = this.props.data.groupId;
    var value = this.state.inputValue;
    actions.addMember(groupId, value);
    this.setState({
      requestingAdd: true
    });
  },
  //
  // Action methods
  //
  onAddMemberCompleted: function(groupId, json) {

    var messageMap = {
      // Added.
      '200': {
        count: 0,
        queryList: [],
        names: [],
        singular: '{name} added.',
        plural: '{count} students added.'
      },
      // Already in the group.
      '204': {
        count: 0,
        queryList: [],
        names: [],
        partOfMessage: ' is/are already in the group.',
        singular: '{name} is already in the group.',
        plural: '{count} students are already in the group.'
      },
      // Not found.
      '404': {
        count: 0,
        queryList: [],
        names: [],
        singular: '1 student could not be found.',
        plural: '{count} students could not be found.'
      }
    };

    function formatMessage(options) {
      switch(options.count) {
        case 0:
          return null;
        case 1:
          var name = options.names[0];
          return options.singular.format({ name: name });
        default:
          return options.plural.format({ count: options.count });
      }
    }

    Object.keys(json.emplidsResultMap).forEach(function(key) {
      var result = json.emplidsResultMap[key];
      var status = result[2]; // 200/204/404

      messageMap[status].count += 1;
      messageMap[status].queryList.push(key);

      var memberStore = null;
      switch(status) {
        case '200':
          memberStore = json.memberMap;
          break;
        case '204':
          memberStore = dataStore.data.memberMap;
          break;
      }

      if(memberStore) {
        var id = result[0];
        var name = memberStore[id].studentName;
        messageMap[status].names.push(name);
      }
    });

    Object.keys(messageMap).forEach(function(key) {
      messageMap[key].message = formatMessage(messageMap[key]);
    });

    var successMessage = messageMap[200].message;

    var errorMessage = null;
    if(!!messageMap[204].message && !!messageMap[404].message) {
      errorMessage = (
        <div>
          <div>{messageMap[404].message}</div>
          <div>{messageMap[204].message}</div>
        </div>
      );
    }
    else if(!!messageMap[204].message) {
      errorMessage = messageMap[204].message;
    }
    else if(!!messageMap[404].message) {
      errorMessage = messageMap[404].message;
    }

    var notFoundQueries = messageMap[404].queryList;
    var isBulkUpload = this.state.isBulkUpload ? true : notFoundQueries.length > 1;
    var inputValue = notFoundQueries.join('\n');

    this.setState({
      errorMessage: errorMessage,
      inputValue: inputValue,
      isBulkUpload: isBulkUpload,
      requestingAdd: false,
      successMessage: successMessage
    });
  },
  onRemoveMemberCompleted: function() {
    this.setState({
      errorMessage: null,
      requestingRemove: false
    });
  },
  onRemoveMemberFailed: function(message) {
    this.setState({
      errorMessage: message,
      requestingRemove: false,
      successMessage: null
    });
  }
});

module.exports = GroupMembership;
