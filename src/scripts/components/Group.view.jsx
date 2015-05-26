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
var sortStore = require('../stores/sort');
var helpers = require('../helpers');

var Alert = require('./Alert');
var Icon = require('./Icon');
var GroupSelector = require('./GroupSelector');

var GroupView = React.createClass({
  mixins: [
    Reflux.listenToMany(actions)
  ],
  propTypes: {
    data: React.PropTypes.object
  },
  statics: {
    willTransitionFrom: function(transition, component) {
      // Remove error message when transitioning away.
      component.setState({
        errorMessage: null
      });
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
      errorMessage: null,
      isAscending: sortStore.defaultIsAscending,
      isLongerTabLabel: true,
      sortByKey: sortStore.defaultSortByKey,
      windowInnerWidth_borderForTabLabelChange: 700
    }
  },
  //
  // Render methods
  //
  render: function() {
    return (
      <div>
        <h1 className="adv-App-heading">
          Caseload
        </h1>
        {this.renderError()}
        <div className="adv-GroupSelectorControls">
          <GroupSelector
            className="adv-GroupSelectorControls-selector"
            selectedId={this.props.params.id}/>
          {this.renderEditLinks()}
        </div>
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
  renderEditLinks: function() {
    if(!this.props.data.isEditable) {
      return null;
    }

    return (
      <div className="adv-GroupSelectorControls-list">
        <Link
          className="adv-Link adv-GroupSelectorControls-item"
          params={{ id: this.props.params.id}}
          to="group.membership">
          Edit Membership
        </Link>
        <Link
          className="adv-Link adv-GroupSelectorControls-item"
          params={{ id: this.props.params.id}}
          to="group.edit">
          Edit Group
        </Link>
      </div>
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
          <form className="adv-Controls-form">
            <label
              className="adv-Controls-label"
              htmlFor="sortByInput">
              Sort by
            </label>
            <select
              className="adv-Controls-select"
              id="sortByInput"
              onChange={this.handleSortByChange}
              value={this.state.sortByKey}>
              {sortStore.sortList.map(this.renderSortOption)}
            </select>
            {this.renderOrderBySection()}
          </form>
        </div>
        <ol className="adv-MemberList">
          {data.map(this.renderMember)}
        </ol>
      </div>
    );
  },
  renderEmpty: function() {
    return (
      <p className="adv-App-empty">
        You currently have no students assigned to this group.
      </p>
    );
  },
  renderSortOption: function(option, index) {
    return (
      <option value={option.key}>
        {option.label}
      </option>
    );
  },
  renderOrderOption: function(label, index) {
    var isAscending = index === 0;
    return (
      <option value={isAscending}>
        {label}
      </option>
    );
  },
  renderOrderBySection: function() {
    if(this.state.sortByKey === 'flagsStatus') {
      return null;
    }

    var orderOptions = sortStore.sortMap[this.state.sortByKey].order;
    return (
      <span>
        <label
          className="adv-Controls-label"
          htmlFor="orderByInput">
          Order by
        </label>
        <select
          className="adv-Controls-select"
          id="orderByInput"
          onChange={this.handleOrderByChange}
          value={this.state.isAscending}>
          {orderOptions.map(this.renderOrderOption)}
        </select>
      </span>
    );
  },
  renderMember: function(member) {
    var studentGroups = Array.isArray(member.studentGroupList) ? member.studentGroupList : [];

    //--------------------------------------------------//
    //
    // Handle dynamic Tab label
    //
    //--------------------------------------------------//
    //-- Added by Eunmee Yi on 2015/04/08
    //--------------------------------------------------//
    var TabLabel_Groups = 'Groups';
    var TabLabel_Positive = 'Positive';
    var TabLabel_Negative = 'Negative';
    if(this.state.isLongerTabLabel) {
      TabLabel_Groups = 'Student Groups';
      TabLabel_Positive = 'Positive Service Indicators';
      TabLabel_Negative = 'Negative Service Indicators';
    }
    //--------------------------------------------------//

    var hasStudentGroups = !!studentGroups.length;
    var hasPSI = member.positiveServiceIndicators_Impact.length || member.positiveServiceIndicators_NoImpact.length;
    var hasNSI = member.negativeServiceIndicators_Impact.length || member.negativeServiceIndicators_NoImpact.length;

    return (
      <li className="adv-MemberList-item adv-Member">
        <header className="adv-Member-header">
          <div className="adv-Member-nameGroup">
            <h2 className="adv-Member-heading">
              <a
                className="adv-Link"
                href={member.url_onName}>
                {member.name}
              </a>
            </h2>
            <p className="adv-Member-id">
              {member.universityId}
            </p>
          </div>
          {this.renderMemberFlag(member)}
        </header>
        <div className="adv-Member-details">
          {member.details.map(this.renderMemberDetail)}
        </div>
        <Tabs className="adv-Tabs">
          <TabList>
            <Tab disabled={!hasStudentGroups}>
              {TabLabel_Groups}
            </Tab>
            <Tab disabled={!hasNSI}>
              {TabLabel_Negative}
            </Tab>
            <Tab disabled={!hasPSI}>
              {TabLabel_Positive}
            </Tab>
          </TabList>
          <TabPanel>
            {studentGroups.map(this.renderMemberStudentGroup)}
          </TabPanel>
          <TabPanel>
            {this.renderMemberServiceIndicatorSection(member.negativeServiceIndicators_Impact, 'Impact')}
            {this.renderMemberServiceIndicatorSection(member.negativeServiceIndicators_NoImpact, 'No impact')}
          </TabPanel>
          <TabPanel>
            {this.renderMemberServiceIndicatorSection(member.positiveServiceIndicators_Impact, 'Impact')}
            {this.renderMemberServiceIndicatorSection(member.positiveServiceIndicators_NoImpact, 'No impact')}
          </TabPanel>
        </Tabs>
      </li>
    );
  },
  renderMemberDetail: function(detail) {
    var cn = classNames({
      'adv-Member-detail': true,
      'adv-Member-detail--fixed': detail.fixed,
      'adv-Member-detail--right': detail.rightAlign
    });

    return (
      <dl className={cn}>
        <dt className="adv-Member-detailTitle">
          {detail.title}
        </dt>
        {detail.items.map(this.renderMemberDetailItem)}
      </dl>
    );
  },
  renderMemberDetailItem: function(item) {
    return (
      <dd className="adv-Member-detailItem">
        {item}
      </dd>
    );
  },
  renderMemberFlag: function(member) {
    if(!member.flag) {
      return null;
    }

    return (
      <a
        className="adv-Member-flag"
        href={member.url_onFlag}
        target="sisStudent">
        <Icon
          className="adv-Member-flagIcon"
          name="flag"/>
      </a>
    );
  },
  renderMemberStudentGroup: function(item) {
    var cn = classNames({
      'adv-StudentGroup': true,
      'adv-StudentGroup--inactive': !item.effectiveStatusBoolean
    });
    return (
      <dl className={cn}>
        <dt className="adv-StudentGroup-title">
          <dfn className="adv-Member-code">
            {item.stdntGroup}
          </dfn>
          {item.stdntGroupDescr} ({item.institutionDescr})
        </dt>
        <dd className="adv-StudentGroup-description">
          {item.activeStatus} {item.effectiveDate}
        </dd>
      </dl>
    );
  },
  renderMemberServiceIndicatorSection: function(list, impactDescription) {
    var hasContent = Array.isArray(list) && list.length;
    if(!hasContent) {
      return null;
    }

    return (
      <div>
        <h3 className="adv-Member-sectionHeading">
          {impactDescription}
        </h3>
        {list.map(this.renderMemberServiceIndicator)}
      </div>
    );
  },
  renderMemberServiceIndicator: function(item) {
    return (
      <dl>
        <dt className="adv-Member-indicatorTitle">
          <dfn className="adv-Member-code">
            {item.serviceIndicatorCode}
          </dfn>
          {item.serviceIndicatorDescr} ({item.institutionDescr}) &middot; {item.reasonDescr}
        </dt>
        <dd className="adv-Member-details">
          {this.renderMemberServiceIndicatorDetail('Start Term', item.startTermDescr)}
          {this.renderMemberServiceIndicatorDetail('End Term', item.endTermDescr)}
          {this.renderMemberServiceIndicatorDetail('Start Date', item.startDate)}
          {this.renderMemberServiceIndicatorDetail('End Date', item.endDate)}
        </dd>
      </dl>
    );
  },
  renderMemberServiceIndicatorDetail: function(title, item) {
    return (
      <dl className="adv-Member-detail">
        <dt className="adv-Member-detailTitle">
          {title}
        </dt>
        <dd className="adv-Member-detailItem">
          {item}
        </dd>
      </dl>
    );
  },
  //
  // Handler methods
  //
  handleSortByChange: function(event) {
    var key = event.target.value;
    // Reset order whenever sort field changes.
    var isAscending = key !== 'flagsStatus';
    this.setState({
      sortByKey: key,
      isAscending: isAscending
    });
    actions.sortBy(key, isAscending);
  },
  handleOrderByChange: function(event) {
    var isAscending = event.target.value === 'true';
    this.setState({
      isAscending: isAscending
    });
    actions.sortBy(this.state.sortByKey, isAscending);
  },
  //
  // Action methods
  //
  onCreateGroupCompleted: function() {
    this.setState({
      errorMessage: null
    });
  },
  onCreateGroupFailed: function(message) {
    this.setState({
      errorMessage: message
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
    //console.log('----- onWindowResized: window.innerWidth = ', window.innerWidth, ', this.state.isLongerTabLabel = ', this.state.isLongerTabLabel);
    if((isLongerTabLabel && isViewportSmall) || (!isLongerTabLabel && !isViewportSmall)) {
      this.setState({
        isLongerTabLabel: !this.state.isLongerTabLabel
      });
    }
  }
});

module.exports = GroupView;
