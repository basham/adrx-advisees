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

var GroupEdit = React.createClass({
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
  componentDidMount: function() {
    window.addEventListener('resize', this.onWindowResized);
  },
  componentWillUnmount: function() {
    window.removeEventListener('resize', this.onWindowResized);
  },
  componentWillMount: function(){
    this.setState({
      isLongerTabLabel: window.innerWidth >= this.state.windowInnerWidth_borderForTabLabelChange
    });
  },
  getInitialState: function() {
    return {
      data: {
        memberDetailList: []
      },
      isAscending: sortStore.defaultIsAscending,
      isLongerTabLabel: true,
      requesting: true,
      sortByKey: sortStore.defaultSortByKey,
      windowInnerWidth_borderForTabLabelChange: 700,
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

    return (
      <section className="adv-App">
        <h1 className="adv-App-heading">
        Edit Group
        </h1>
        <Link to="group.membership" className="adv-Link--underlined" params={{ id: this.props.params.id}}>Cancel</Link>
        <div>
          {this.renderRenameGroup()}
          {this.renderRemoveGroupMembers(data.groupId)}
          {this.renderDeleteGroup()}
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
        You currently have no advisees assigned to you.
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
          onChange={this.handleGroupNameInputChange}
          maxLength="50"
          type="text"/>
        <button
          className="qn-ActionBar-item qn-Button"
          type="submit">
          Save
        </button>
      </form>
    );
  },
  renderRemoveGroupMembers: function() {
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
          onClick={this.handleRemoveAllMembersButtonClick()}>
          Remove all members
        </button>
      </div>
    );
  },
  renderDeleteGroup: function() {
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
          onClick={this.handleDeleteGroupButtonClick()}>
          Delete group
        </button>
      </div>
    );
  },
  //
  // Handler methods
  //
  handleGroupNameInputChange: function(e) {
    this.setState({
      groupName: e.target.value
    });
  },
  handleRemoveAllMembersButtonClick: function() {
    return function(event) {
      actions.removeAllMembers(this.state.data.groupId);
    }.bind(this);
  },
  handleDeleteGroupButtonClick: function() {
    return function(event) {
      actions.deleteGroup(this.state.data.groupId);
    }.bind(this);
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var groupId = this.state.data.groupId;
    var value = this.state.groupName;
    actions.renameGroup(groupId, value);
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
  },
  //
  // Window event listener
  //
  //--------------------------------------------------//
  //-- Created by Eunmee Yi on 2015/04/09
  //--------------------------------------------------//
  onWindowResized: function() {
    var isLongerTabLabel = this.state.isLongerTabLabel;
    var isViewportSmall = window.innerWidth < this.state.windowInnerWidth_borderForTabLabelChange;
    if((isLongerTabLabel && isViewportSmall) || (!isLongerTabLabel && !isViewportSmall)) {
      this.setState({
        isLongerTabLabel: !this.state.isLongerTabLabel
      });
    }
  }
});

module.exports = GroupEdit;
