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
        membershipStudentList: []
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
    var data = this.state.data.membershipStudentList;
    var content = null;

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
  renderAddMember: function() {
    var addMemberInput;
    if(this.state.isBulkUpload == true)
      addMemberInput = (<p>
                          <textarea
                            className="adv-Input"
                            onChange={this.handleTitleInputChange}
                            rows="5"
                            cols="50" />
                          Separate student usernames or University IDs with a space, a return, or a comma.
                        </p>);

    else
      addMemberInput = (<p>
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
                        </p>);
    return (
      <div className="adv-Advisee-nameGroup adv-Advisee-nameGroup--fixed">
        <h2 className="adv-Advisee-heading">
          Student
        </h2>
          {addMemberInput}
          <button
            className="qn-ActionBar-item qn-Button"
            onClick={this.handleAddMemberButtonClick}>
            Add
          </button>
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
        <ol className="adv-AdviseeList">
          {data.map(this.renderAdvisee)}
        </ol>
      </div>
    );
  },
  renderAdvisee: function(advisee, index) {
    return (
      <li className="adv-AdviseeList-item adv-Advisee">
        <header className="adv-Advisee-header">
          <div className="adv-Advisee-nameGroup adv-Advisee-nameGroup--fixed">
            <h2 className="adv-Advisee-heading">
              {advisee.name}
            </h2>
            <p className="adv-Advisee-id">
              {advisee.universityId}
            </p>
          </div>
          <span
            data-index={index}
            className="adv-Advisee-controls-remove"
            onClick={this.handleRemoveButtonClick}>
            {"\u2716"}
          </span>
        </header>
      </li>
    );
  },
  //
  // Handler methods
  //
  handleRemoveButtonClick: function(event) {
    var index = event.target.getAttribute("data-index");
    actions.removeMember(index);
  },
  handleTitleInputChange: function(e) {
    this.setState({
      memberId: e.target.value
    });
  },
  handleAddMemberButtonClick: function(event) {
    var value = event.target.value;
console.log('---add member', this.state.memberId);
    actions.addMember(value);
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

module.exports = GroupMembership;
