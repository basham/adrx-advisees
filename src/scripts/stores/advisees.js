'use strict';

var Reflux = require('reflux');

var actions = require('../actions');
var helpers = require('../helpers');

var adviseesStore = Reflux.createStore({
  listenables: actions,
  //
  // Action methods
  //
  onGetData: function() {
    var data = require('./data.json');

    var output = data.advisees.map(function(advisee) {
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
  }
});

module.exports = adviseesStore;
