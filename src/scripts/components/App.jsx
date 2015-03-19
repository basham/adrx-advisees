'use strict';

var React = require('react');
var Reflux = require('reflux');

var actions = require('../actions');
var dataStore = require('../stores/data');

var App = React.createClass({
  mixins: [
    Reflux.connect(dataStore, 'dataStore')
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
      <section className="qn-App">
        <header className="qn-Header">
          <h1 className="qn-Header-heading">
            Advisees
          </h1>
        </header>
        <div className="qn-App-content">
          {this.renderList()}
        </div>
      </section>
    );
  },
  renderList: function() {
    var data = this.state.dataStore;
    // Check for data.
    if(!data) {
      return null;
    }
    // Render items.
    return data.advisees.map(this.renderAdvisee);
  },
  renderAdvisee: function(advisee) {
    return (
      <div>
        <h2>{advisee.studentName}</h2>
        <span>{advisee.emplid}</span>
      </div>
    );
  }
});

module.exports = App;
