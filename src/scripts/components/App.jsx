'use strict';

var React = require('react');
var Reflux = require('reflux');
var classNames = require('classnames');

var actions = require('../actions');
var adviseesStore = require('../stores/advisees');
var sortStore = require('../stores/sort');
var helpers = require('../helpers');

var Alert = require('./Alert');

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
      content = data.length ? this.renderList(data) : this.renderEmpty()
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
              {sortStore.sortOptions.map(this.renderSortOptions)}
            </select>
          </form>
        </div>
        <ol className="adv-AdviseeList">
          {data.map(this.renderAdvisee)}
        </ol>
      </div>
    );
  },
  renderSortOptions: function(option, index) {
    return (
      <option value={option.key}>
        {option.label}
      </option>
    );
  },
  renderAdvisee: function(advisee) {
    var params = helpers.getQueryParams();
    var url = helpers.api('search', {
      searchEmplid: advisee.universityId,
      sr: params.sr
    });

    return (
      <li className="adv-AdviseeList-item adv-Advisee">
        <header className="adv-Advisee-header">
          <h2 className="adv-Advisee-heading">
            <a
              className="adv-Link"
              href={url}>
              {advisee.name}
            </a>
          </h2>
          <p className="adv-Advisee-id">
            {advisee.universityId}
          </p>
        </header>
        <div className="adv-Advisee-details">
          {advisee.details.map(this.renderAdviseeDetail)}
        </div>
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
  //
  // Handler methods
  //
  handleSortByChange: function(event) {
    var key = event.target.value;
    this.setState({
      sortByKey: key
    });
    actions.sortBy(key);
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
