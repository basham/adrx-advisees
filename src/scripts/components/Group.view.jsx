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

var GroupView = React.createClass({
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
      windowInnerWidth_borderForTabLabelChange: 700
    }
  },
  //
  // Render methods
  //
  render: function() {
    var data = this.state.data.memberDetailList;
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
          Caseload
        </h1>
        <div className="adv-GroupSelectorControls">
          <GroupSelector
            className="adv-GroupSelectorControls-selector"
            selectedId={this.props.params.id}/>
          <Link
            className="adv-GroupSelectorControls-link"
            params={{ id: this.props.params.id}}
            to="group.membership">
            Edit membership
          </Link>
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
        You currently have no students assigned to this group.
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
  renderList: function(data) {
    var count = data.length;
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
    //console.log('----- onWindowResized: window.innerWidth = ', window.innerWidth, ', this.state.isLongerTabLabel = ', this.state.isLongerTabLabel);
    if((isLongerTabLabel && isViewportSmall) || (!isLongerTabLabel && !isViewportSmall)) {
      this.setState({
        isLongerTabLabel: !this.state.isLongerTabLabel
      });
    }
  }
});

module.exports = GroupView;
