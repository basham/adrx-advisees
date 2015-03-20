'use strict';

var React = require('react');
var Reflux = require('reflux');
var classNames = require('classnames');

var actions = require('../actions');
var adviseesStore = require('../stores/advisees');

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
    return (
      <section className="adv-App">
        <h1 className="adv-App-heading">
          Advisees
        </h1>
        <ol className="adv-AdviseeList">
          {this.renderList()}
        </ol>
      </section>
    );
  },
  renderList: function() {
    var data = this.state.adviseesStore;
    // Check for data.
    if(!data) {
      return null;
    }
    // Render items.
    return data.map(this.renderAdvisee);
  },
  renderAdvisee: function(advisee) {
    return (
      <li className="adv-AdviseeList-item adv-Advisee">
        <header className="adv-Advisee-header">
          <h2 className="adv-Advisee-heading">
            {advisee.name}
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
