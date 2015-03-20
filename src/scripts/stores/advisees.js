'use strict';

var Reflux = require('reflux');

var actions = require('../actions');

var adviseesStore = Reflux.createStore({
  listenables: actions,
  //
  // Action methods
  //
  onGetData: function() {
    var data = require('./data.json');

    var output = data.advisees.map(function(advisee) {
      var programPlanList = advisee.acadProgPlanList.split('-');
      var plans = programPlanList[1].split('/');

      return {
        name: advisee.studentName,
        universityId: advisee.emplid,
        details: [
          {
            title: advisee.acadProgDescr,
            items: plans
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
            items: [advisee.hours]
          },
          {
            title: 'Program GPA',
            items: [advisee.programGpa]
          },
          {
            title: 'IU GPA',
            items: [advisee.iuGpa]
          }
        ]
      };
    });

    this.trigger(output);
  }
});

module.exports = adviseesStore;
