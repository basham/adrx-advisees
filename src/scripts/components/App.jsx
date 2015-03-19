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
    var data = this.state.dataStore;
    // Check for data.
    if(!data) {
      return null;
    }
    // Render items.
    return data.advisees.map(this.renderAdvisee);
  },
  renderAdvisee: function(advisee) {
    var programPlan = advisee.acadProgPlanList.split('-');
    var program = programPlan[0];
    var plans = programPlan[1].split('/').join(' \u00b7 ');

    return (
      <div className="adv-Advisee">
        <header className="adv-Advisee-header">
          <h2 className="adv-Advisee-heading">{advisee.studentName}</h2>
          <p className="adv-Advisee-id">{advisee.emplid}</p>
        </header>
        <div className="adv-Advisee-groups">
          <div className="adv-Advisee-group">
            <dl className="adv-Advisee-list">
              <dt className="adv-Advisee-listTitle">Academic Program and Plan</dt>
              <dd className="adv-Advisee-listItem">{program}</dd>
              <dd className="adv-Advisee-listItem">{plans}</dd>
            </dl>
          </div>
          <div className="adv-Advisee-group">
            <dl className="adv-Advisee-list">
              <dt className="adv-Advisee-listTitle">Advisor Role</dt>
              <dd className="adv-Advisee-listItem">{advisee.advisorRoleDescr}</dd>
            </dl>
            <dl className="adv-Advisee-list">
              <dt className="adv-Advisee-listTitle">Last Enrolled</dt>
              <dd className="adv-Advisee-listItem">{advisee.lastEnrolled}</dd>
            </dl>
          </div>
          <div className="adv-Advisee-group">
            <dl className="adv-Advisee-list">
              <dt className="adv-Advisee-listTitle">Hours</dt>
              <dd className="adv-Advisee-listItem">{advisee.hours}</dd>
            </dl>
            <dl className="adv-Advisee-list">
              <dt className="adv-Advisee-listTitle">Program GPA</dt>
              <dd className="adv-Advisee-listItem">{advisee.programGpa}</dd>
            </dl>
            <dl className="adv-Advisee-list">
              <dt className="adv-Advisee-listTitle">IU GPA</dt>
              <dd className="adv-Advisee-listItem">{advisee.iuGpa}</dd>
            </dl>
          </div>
        </div>
      </div>
    );
  }
});

/*
{
  "emplid": "7496827183",
  "studentName": "Blanda, Angelina Fannie",
  "institution": "IUBLA",
  "advisorRole": "ADVR",
  "advisorRoleDescr": "Academic Advisor",
  "acadProg": "BUS1",
  "acadProgDescr": "Business Undergraduate",
  "acadCareer": "UGRD",
  "acadCareerDescr": "Undergraduate",
  "acadProgPlanList": "Business Undergraduate-Supply Chain Management BSB",
  "committeeId": " ",
  "lastEnrolled": "Spring 2015",
  "lastEnrolledStrm": "4152",
  "hours": "111.5",
  "programGpa": "2.188",
  "iuGpa": "2.318"
},
*/

module.exports = App;
