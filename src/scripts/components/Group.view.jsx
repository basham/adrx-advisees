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
        <GroupSelector selectedId={this.props.params.id}/>
        <Link to="group.membership" className="qn-Header-headingLink" params={{ id: this.props.params.id}}>Edit membership</Link>
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
        <ol className="adv-AdviseeList">
          {data.map(this.renderAdvisee)}
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
  renderAdvisee: function(advisee) {
    var studentGroups = Array.isArray(advisee.studentGroupList) ? advisee.studentGroupList : [];

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
    var hasPSI = advisee.positiveServiceIndicators_Impact.length || advisee.positiveServiceIndicators_NoImpact.length;
    var hasNSI = advisee.negativeServiceIndicators_Impact.length || advisee.negativeServiceIndicators_NoImpact.length;

    return (
      <li className="adv-AdviseeList-item adv-Advisee">
        <header className="adv-Advisee-header">
          <div className="adv-Advisee-nameGroup">
            <h2 className="adv-Advisee-heading">
              <a
                className="adv-Link"
                href={advisee.url_onName}>
                {advisee.name}
              </a>
            </h2>
            <p className="adv-Advisee-id">
              {advisee.universityId}
            </p>
          </div>
          {this.renderAdviseeFlag(advisee)}
        </header>
        <div className="adv-Advisee-details">
          {advisee.details.map(this.renderAdviseeDetail)}
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
            {studentGroups.map(this.renderAdviseeStudentGroup)}
          </TabPanel>
          <TabPanel>
            {this.renderAdviseeServiceIndicatorSection(advisee.negativeServiceIndicators_Impact, 'Impact')}
            {this.renderAdviseeServiceIndicatorSection(advisee.negativeServiceIndicators_NoImpact, 'No impact')}
          </TabPanel>
          <TabPanel>
            {this.renderAdviseeServiceIndicatorSection(advisee.positiveServiceIndicators_Impact, 'Impact')}
            {this.renderAdviseeServiceIndicatorSection(advisee.positiveServiceIndicators_NoImpact, 'No impact')}
          </TabPanel>
        </Tabs>
      </li>
    );
  },
  renderAdviseeDetail: function(detail) {
    var cn = classNames({
      'adv-Advisee-detail': true,
      'adv-Advisee-detail--fixed': detail.fixed,
      'adv-Advisee-detail--right': detail.rightAlign
    });

    return (
      <dl className={cn}>
        <dt className="adv-Advisee-detailTitle">
          {detail.title}
        </dt>
        {detail.items.map(this.renderAdviseeDetailItem)}
      </dl>
    );
  },
  renderAdviseeDetailItem: function(item) {
    return (
      <dd className="adv-Advisee-detailItem">
        {item}
      </dd>
    );
  },
  renderAdviseeFlag: function(advisee) {
    if(!advisee.flag) {
      return null;
    }

    return (
      <a
        className="adv-Advisee-flag"
        href={advisee.url_onFlag}
        target="sisStudent">
        <Icon
          className="adv-Advisee-flagIcon"
          name="flag"/>
      </a>
    );
  },
  renderAdviseeStudentGroup: function(item) {
    var cn = classNames({
      'adv-StudentGroup': true,
      'adv-StudentGroup--inactive': !item.effectiveStatusBoolean
    });
    return (
      <dl className={cn}>
        <dt className="adv-StudentGroup-title">
          <dfn className="adv-Advisee-code">
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
  renderAdviseeServiceIndicatorSection: function(list, impactDescription) {
    var hasContent = Array.isArray(list) && list.length;
    if(!hasContent) {
      return null;
    }

    return (
      <div>
        <h3 className="adv-Advisee-sectionHeading">
          {impactDescription}
        </h3>
        {list.map(this.renderAdviseeServiceIndicator)}
      </div>
    );
  },
  renderAdviseeServiceIndicator: function(item) {
    return (
      <dl>
        <dt className="adv-Advisee-indicatorTitle">
          <dfn className="adv-Advisee-code">
            {item.serviceIndicatorCode}
          </dfn>
          {item.serviceIndicatorDescr} ({item.institutionDescr}) &middot; {item.reasonDescr}
        </dt>
        <dd className="adv-Advisee-details">
          {this.renderAdviseeServiceIndicatorDetail('Start Term', item.startTermDescr)}
          {this.renderAdviseeServiceIndicatorDetail('End Term', item.endTermDescr)}
          {this.renderAdviseeServiceIndicatorDetail('Start Date', item.startDate)}
          {this.renderAdviseeServiceIndicatorDetail('End Date', item.endDate)}
        </dd>
      </dl>
    );
  },
  renderAdviseeServiceIndicatorDetail: function(title, item) {
    return (
      <dl className="adv-Advisee-detail">
        <dt className="adv-Advisee-detailTitle">
          {title}
        </dt>
        <dd className="adv-Advisee-detailItem">
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
