'use strict';

var React = require('react');
var Reflux = require('reflux');
var classNames = require('classnames');

var actions = require('../actions');
var adviseesStore = require('../stores/advisees');
var helpers = require('../helpers');

var App = React.createClass({
  mixins: [
    Reflux.connect(adviseesStore, 'adviseesStore')
  ],
  //
  // Lifecycle methods
  //
  componentDidMount: function() {
    actions.getData();
  },
  //
  // Render methods
  //
  render: function() {
    var data = this.state.adviseesStore;
    return (
      <section className="adv-App">
        <h1 className="adv-App-heading">
          Advisees
        </h1>
        {data && data.length ? this.renderList(data) : this.renderEmpty()}
      </section>
    );
  },
  renderEmpty: function() {
    return (
      <p className="adv-App-empty">
        No advisees
      </p>
    );
  },
  renderList: function(data) {
    var count = data.length;
    return (
      <div>
        <p>{count} {helpers.pluralize(count, 'advisee')}</p>
        <ol className="adv-AdviseeList">
          {data.map(this.renderAdvisee)}
        </ol>
      </div>
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
              className="adv-Advisee-link"
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
  }
});

module.exports = App;
