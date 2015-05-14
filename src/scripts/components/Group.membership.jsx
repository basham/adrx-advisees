'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var classNames = require('classnames');
var Link = Router.Link;

var ReactTabs = require('./Tabs');
var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;

var actions = require('../actions');
var groupStore = require('../stores/group');
var sortStore = require('../stores/sort');
var helpers = require('../helpers');

var Alert = require('./Alert');
var Icon = require('./Icon');
var GroupSelector = require('./GroupSelector');

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
    var data = this.state.data.memberDetailList;
    var content = null;

console.log('###', this.state.data);

    if(this.state.requesting) {
      content = this.renderLoading();
    }
    else if(this.state.errorMessage) {
      content = this.renderError();
    }
    else {
      content = data.length ? this.renderList(data) : this.renderEmpty();
    }

    return (
      <section className="adv-App">
        <h1 className="adv-App-heading">
        Edit Membership
        </h1>
        <Link to="group.edit" className="adv-Link--underlined" params={{ id: this.props.params.id}}>Edit group</Link>
        <Link to="group.view" className="adv-Link--underlined" params={{ id: this.props.params.id}}>Return to Caseload</Link>
        <div>
          {this.renderAddMember()}
        </div>
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
        className="adv-Member-nameGroup adv-Member-nameGroup--fixed"
        onSubmit={this.handleSubmit}>
        {this.state.isBulkUpload ? this.renderTextareaField() : this.renderInputField()}
        <button
          className="qn-ActionBar-item qn-Button"
          type="submit">
          Add
        </button>
      </form>
    );
  },
  renderInputField: function() {
    return (
      <p>
        <label className="adv-Member-heading">
          Student
        </label>
        <input
          className="adv-Input"
          onChange={this.handleTitleInputChange}
          maxLength="10"
          type="text"/>
        <a
          className="adv-Link--underlined"
          onClick={this.handleBulkButtonClick}>
          Add students in bulk
        </a>
      </p>
    );
  },
  renderTextareaField: function() {
    return (
      <p>
        <label className="adv-Member-heading">
          Students
        </label>
        <textarea
          className="adv-Input"
          onChange={this.handleTitleInputChange}
          rows="5"
          cols="50" />
        Separate student usernames or University IDs with a space, a return, or a comma.
      </p>
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
      <li className="adv-MemberList-item adv-Member">
        <header className="adv-Member-header">
          <div className="adv-Member-nameGroup adv-Member-nameGroup--fixed">
            <h2 className="adv-Member-heading">
              {member.name}
            </h2>
            <p className="adv-Member-id">
              {member.universityId}
            </p>
          </div>
          <button
            className="adv-Member-controls-remove"
            onClick={this.handleRemoveButtonClick(member)}>
            {"\u2716"}
          </button>
        </header>
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
