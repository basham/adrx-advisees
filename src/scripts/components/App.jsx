'use strict';

var React = require('react');
var Reflux = require('reflux');

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
        <div className="adv-App-content">
          {this.renderList()}
        </div>
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
      <div className="adv-Advisee">
        <header className="adv-Advisee-header">
          <h2 className="adv-Advisee-heading">{advisee.name}</h2>
          <p className="adv-Advisee-id">{advisee.universityId}</p>
        </header>
        <div className="adv-Advisee-details">
          {this.renderAdviseeDetails(advisee.details)}
        </div>
      </div>
    );
  },
  renderAdviseeDetails: function(details) {
    return details.map(function(detail) {
      return (
        <dl className="adv-Advisee-detail">
          <dt className="adv-Advisee-detailTitle">{detail.title}</dt>
          {this.renderAdviseeDetailItems(detail.items)}
        </dl>
      );
    }.bind(this));
  },
  renderAdviseeDetailItems: function(items) {
    return items.map(function(item) {
      return (
        <dd className="adv-Advisee-detailItem">{item}</dd>
      );
    });
  }
});

module.exports = App;
