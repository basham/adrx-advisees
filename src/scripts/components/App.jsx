'use strict';

var React = require('react');
var Reflux = require('reflux');
var classNames = require('classnames');

var ReactTabs = require('./Tabs');
//var ReactTabs = require('react-tabs');
var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;

var actions = require('../actions');
var adviseesStore = require('../stores/advisees');
var sortStore = require('../stores/sort');
var helpers = require('../helpers');

var Alert = require('./Alert');
var Icon = require('./Icon');

var App = React.createClass({
  mixins: [
    Reflux.listenTo(adviseesStore, 'onStoreChange'),
    Reflux.listenToMany(actions)
  ],
  //
  // Lifecycle methods
  //
  componentDidMount: function() {
    actions.getData();
  },
  getInitialState: function() {
    return {
      adviseesStore: [],
      isAscending: sortStore.defaultIsAscending,
      requesting: true,
      sortByKey: sortStore.defaultSortByKey
    }
  },
  //
  // Render methods
  //
  render: function() {
    var data = this.state.adviseesStore;
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
          Advisees
        </h1>
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
    var content_orderBySection = (this.state.sortByKey !== "flagsStatus") ? this.renderOrderBySection() : null;

    return (
      <div>
        <div className="adv-Controls">
          <p className="adv-Controls-count">
            {count} {helpers.pluralize(count, 'advisee')}
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
            {content_orderBySection}
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
    //
    // Handle dynamic flag/sections
    //
    var content_flag = !!advisee.flag ? this.renderAdviseeFlag(advisee) : null;

    var temp_List;
    var temp_Method;

    temp_List = advisee.studentGroups;
    temp_Method = this.renderAdviseeStudentGroupSection;
    temp_List = (!!temp_List && temp_List.length !== 0) ? temp_Method(temp_List) : 'No Student Groups';
    var content_studentGroupSection = temp_List;

    temp_List = advisee.positiveServiceIndicators_Impact;
    temp_Method = this.renderAdviseeServiceIndicatorSection;
    temp_List = (!!temp_List && temp_List.length !== 0) ? temp_Method(temp_List, "Impact") : '';
    var content_positiveServiceIndicator_Impact = temp_List;

    temp_List = advisee.positiveServiceIndicators_NoImpact;
    temp_Method = this.renderAdviseeServiceIndicatorSection;
    temp_List = (!!temp_List && temp_List.length !== 0) ? temp_Method(temp_List, "No impact") : '';
    var content_positiveServiceIndicator_NoImpact = temp_List;

    temp_List = advisee.negativeServiceIndicators_Impact;
    temp_Method = this.renderAdviseeServiceIndicatorSection;
    temp_List = (!!temp_List && temp_List.length !== 0) ? temp_Method(temp_List, "Impact") : '';
    var content_negativeServiceIndicator_Impact = temp_List;

    temp_List = advisee.negativeServiceIndicators_NoImpact;
    temp_Method = this.renderAdviseeServiceIndicatorSection;
    temp_List = (!!temp_List && temp_List.length !== 0) ? temp_Method(temp_List, "No impact") : '';
    var content_negativeServiceIndicator_NoImpact = temp_List;

    content_positiveServiceIndicator_Impact = (!!content_positiveServiceIndicator_Impact || !!content_positiveServiceIndicator_NoImpact) ? content_positiveServiceIndicator_Impact : 'No Positive Service Indicators';
    content_negativeServiceIndicator_Impact = (!!content_negativeServiceIndicator_Impact || !!content_negativeServiceIndicator_NoImpact) ? content_negativeServiceIndicator_Impact : 'No Negative Service Indicators';

    //
    // Handle dynamic Tab label
    //
    var TabLabel_Groups = "Groups";
    var TabLabel_Positive = "Positive";
    var TabLabel_Negative = "Negative";
    if (window.innerWidth > 800) {
      TabLabel_Groups = "Student Groups";
      TabLabel_Positive = "Positive Service Indicators";
      TabLabel_Negative = "Negative Service Indicators";
    }

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
          {content_flag}
        </header>
        <div className="adv-Advisee-details">
          {advisee.details.map(this.renderAdviseeDetail)}
        </div>
        <Tabs
          className="adv-Tabs"
          selectedIndex={0}>
          <TabList className="adv-Tabs-list">
            <Tab className="adv-Tabs-tab">{TabLabel_Groups}</Tab>
            <Tab className="adv-Tabs-tab">{TabLabel_Negative}</Tab>
            <Tab className="adv-Tabs-tab">{TabLabel_Positive}</Tab>
          </TabList>
          <TabPanel className="adv-Tabs-panel">
            {content_studentGroupSection}
          </TabPanel>
          <TabPanel className="adv-Tabs-panel">
            {content_negativeServiceIndicator_Impact}
            {content_negativeServiceIndicator_NoImpact}
          </TabPanel>
          <TabPanel className="adv-Tabs-panel">
            {content_positiveServiceIndicator_Impact}
            {content_positiveServiceIndicator_NoImpact}
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
  renderAdviseeStudentGroupSection: function(list) {
    return (
      <div className="adv-Advisee-studentGroups">
        {list.map(this.renderAdviseeStudentGroup)}
      </div>
    );
  },
  renderAdviseeStudentGroup: function(list) {
    var cn = classNames({
      'adv-Advisee-studentGroup--inactive': !list.active
    });
    return (
      <p className={cn}>
        <span className="adv-Advisee-studentGroupHeader">
          <span className="adv-Advisee-code">
            {list.stdntGroup}:
          </span>
          {list.stdntGroupDescr}
        </span>
        <span className="adv-Advisee-studentGroupDetail">
          {list.activeDescription} {list.effectiveDateDescription}
        </span>
      </p>
    );
  },
  renderAdviseeServiceIndicatorSection: function(list, impactDescription) {
    return (
      <div className="adv-Advisee-ServiceIndicators">
        <span className="adv-Advisee-serviceIndicatorType">
          {impactDescription}
        </span>
        {list.map(this.renderAdviseeServiceIndicator)}
      </div>
    );
  },
  renderAdviseeServiceIndicator: function(list) {
    return (
      <p className="adv-Advisee-serviceIndicator">
        <span className="adv-Advisee-serviceIndicatorHeader">
          <span className="adv-Advisee-code">
            {list.serviceIndicatorCode}:
          </span>
          {list.serviceIndicatorDescr} - {list.reasonDescr}
        </span>
        <div className="adv-Advisee-serviceIndicatorDetails">
          {this.renderAdviseeServiceIndicatorDetail({title: "Start Term" , item: list.startTermDescr})}
          {this.renderAdviseeServiceIndicatorDetail({title: "End Term" , item: list.endTermDescr})}
          {this.renderAdviseeServiceIndicatorDetail({title: "Start Date" , item: list.startDate})}
          {this.renderAdviseeServiceIndicatorDetail({title: "End Date" , item: list.endDate})}
        </div>
      </p>
    );
  },
  renderAdviseeServiceIndicatorDetail: function(detail) {
    return (
      <dl className="adv-Advisee-serviceIndicatorDetail">
        <dt className="adv-Advisee-serviceIndicatorDetailTitle">
          {detail.title}
        </dt>
        <dd className="adv-Advisee-serviceIndicatorDetailItem">
          {detail.item}
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
    var isAscending = (key !== "flagsStatus") ? true : false;
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
     adviseesStore: data,
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

module.exports = App;
