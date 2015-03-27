'use strict';

var Reflux = require('reflux');
var request = require('superagent');

var actions = require('../actions');
var helpers = require('../helpers');

var adviseesStore = Reflux.createStore({
  listenables: actions,
  //
  // Action methods
  //
  onGetData: function() {
    setTimeout(function() {
      //this.handleFail();
      this.handleSuccess(require('./data.json'));
    }.bind(this), 0);
    return;

    var params = helpers.getQueryParams();

    request
      .get(helpers.api('myAdvisees_JSON'))
      .query({
        sr: params.sr
      })
      .end(helpers.requestCallback(this.handleSuccess, this.handleFail));
  },
  handleSuccess: function(data) {
    var adviseeList = data.myAdvisees ? data.myAdvisees : data.adviseeList;
    adviseeList = Array.isArray(adviseeList) ? adviseeList : [];

    var output = adviseeList
      .sort(helpers.sortBy('studentName'))
      .map(function(advisee) {
        // Extract plans.
        var programPlanList = advisee.acadProgPlanList.split('-');
        var plans = programPlanList[1].split('/');
        // Round numerical values,
        var hours = helpers.round(advisee.hours, 1);
        var programGPA = helpers.round(advisee.programGpa, 2);
        var universityGPA = helpers.round(advisee.iuGpa, 2);

        return {
          name: advisee.studentName,
          universityId: advisee.emplid,
          details: [
            {
              title: advisee.acadProgDescr,
              items: plans,
              fixed: true
            },
            {
              title: 'Advisor Role',
              items: [advisee.advisorRoleDescr]
            },
            {
              title: 'Last Enrolled',
              items: [advisee.lastEnrolled]
            },
            {
              title: 'Hours',
              items: [hours],
              rightAlign: true
            },
            {
              title: 'Program GPA',
              items: [programGPA],
              rightAlign: true
            },
            {
              title: 'IU GPA',
              items: [universityGPA],
              rightAlign: true
            }
          ]
        };
      });

    this.trigger(output);
  },
  handleFail: function() {
    var message = (
      <span>
        Advisees could not load.
        Please <button className="adv-Alert-link adv-Link" onClick={actions.getData}>try again</button>.
      </span>
    );
    actions.getDataFailed(message);
  }
});

module.exports = adviseesStore;
