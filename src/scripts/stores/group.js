'use strict';

var Reflux = require('reflux');
var Router = require('react-router');

var actions = require('../actions');
var helpers = require('../helpers');
var dataStore = require('./data');
var sortStore = require('./sort');

module.exports = Reflux.createStore({
  contextTypes: {
    router: React.PropTypes.func
  },
  listenables: actions,
  init: function() {
    this.listenTo(dataStore, this.onStoreChange);
    this.group = {
      membershipList: []
    };
  },
  //
  // Store methods
  //
  onStoreChange: function(data) {
    this.data = data;
    this.output();
  },
  //
  // Action methods
  //
  onGetGroupCompleted: function(data, id) {
console.log('~~~', data);
    this.data = data;
    this.groupId = id;
    this.output();
  },
  onSortBy: function(key, isAscending) {
    this.sortByKey = key;
    this.isAscending = isAscending;
    this.output();
  },
  //
  // Handler methods
  //
  output: function() {
    if(!this.data || this.groupId === undefined) {
      return;
    }

    var adviseeFlagLink = this.data.adviseeFlagLink;

    this.sortByKey = !!this.sortByKey ? this.sortByKey : sortStore.defaultSortByKey;
    this.isAscending = this.isAscending !== undefined ? this.isAscending : sortStore.defaultIsAscending;

    // URL on name to the student's detail
    var params = helpers.getQueryParams();
    var url = helpers.api('search', {
      sr: params.sr
    });

    var group = this.data.groupMap[this.groupId];
    // Ignore triggering store if group was deleted.
    if(!group) {
      return;
    }
    group.memberDetailList = group.memberList
      .map(function(id) {
        var member = this.data.memberMap[id];
        member.hours = helpers.round(member.hours, 1);
        member.programGpa = helpers.round(member.programGpa, 2);
        member.iuGpa = helpers.round(member.iuGpa, 2);
        return member;
      }, this)
      .sort(helpers.sortBy(this.sortByKey, this.isAscending, sortStore.defaultSortByKey))
      .map(this.formatMemberDetail, this);

    this.trigger(group);
  },
  formatMemberDetail: function(advisee) {
    // URLs
    var url_onFlag = this.adviseeFlagLink + '&EMPLID=' + advisee.emplid;
    var url_onName = this.url + '&searchEmplid=' + advisee.emplid;

    //
    // Handle Program and Plan
    //
    var program = advisee.acadProgDescr;
    var planList = advisee.acadPlanList;

    var hasProgram = !!program && !!program.trim();
    var hasPlanList = Array.isArray(planList) && !!planList.length;

    var programPlanTitle = null;
    var programPlanItems = null;

    // Program & Plan
    if (hasProgram && hasPlanList) {
      programPlanTitle = program;
      programPlanItems = planList;
    }
    // Program & No Plan
    else if (hasProgram && !hasPlanList) {
      programPlanTitle = 'Academic Program';
      programPlanItems = [program];
    }
    // No Program & Plan
    else if (!hasProgram && hasPlanList) {
      programPlanTitle = helpers.pluralize(planList.length, 'Academic Plan');
      programPlanItems = planList;
    }
    // No Program & No Plan
    else {
      programPlanTitle = 'Academic Program & Plan';
      programPlanItems = ['None'];
    }

    // Failed to replace null to '&mdash;' by Eunmee Yi on 2015/04/09
    //var stringForEmptyValue = '&mdash;';
    //var stringForEmptyValue = '-----';
    // Chris Basham find the way to pass mdash on 2015/04/18
    var stringForEmptyValue = '\u2014';

    //
    // Round numerical values.
    //
    var hours = helpers.roundToString(advisee.hours, 1);
    var programGPA = helpers.roundToString(advisee.programGpa, 2);
    var universityGPA = helpers.roundToString(advisee.iuGpa, 2);
    hours = helpers.formatNullValue(hours, stringForEmptyValue);
    programGPA = helpers.formatNullValue(programGPA, stringForEmptyValue);
    universityGPA = helpers.formatNullValue(universityGPA, stringForEmptyValue);

    //
    // Handle Student Groups
    //
    var hasGroupList = Array.isArray(advisee.sisStudentGroupList) && !!advisee.sisStudentGroupList.length;
    var sortedStudentGroupList = null;
    if (hasGroupList) {
      sortedStudentGroupList = advisee.sisStudentGroupList
        .map(function(item) {
          item.activeStatus = !!item.effectiveStatusBoolean ? 'Active as of' : 'Inactive as of';
          item.effectiveDate = !!item.effectiveDateFormatted ? item.effectiveDateFormatted : null;
          return item;
        })
        .sort(helpers.sortBy('effectiveStatusBoolean', false, 'stdntGroup'));
    }

    //--------------------------------------------------//
    //
    // Manipulate the data to get 5 proper arrays
    // with map()/filter()/sort()
    // and send them to render
    //
    //--------------------------------------------------//
    //-- Added by Eunmee Yi on 2015/04/08
    //--------------------------------------------------//
    var positiveServiceIndicators_Impact = [];
    var positiveServiceIndicators_NoImpact = [];
    var negativeServiceIndicators_Impact = [];
    var negativeServiceIndicators_NoImpact = [];

    //--------------------------------------------------//
    // Positive Service Indicators
    //--------------------------------------------------//
    var psList = advisee.positiveSisServiceIndicatorList;
    if(!!psList) {
      psList =
        psList
        .map(function(item) {
          item.startTermDescr = helpers.formatNullValue(item.startTermDescr, stringForEmptyValue);
          item.endTermDescr = helpers.formatNullValue(item.endTermDescr, stringForEmptyValue);
          item.startDate = helpers.formatNullValue(item.startDateFormatted, stringForEmptyValue);
          item.endDate = helpers.formatNullValue(item.endDateFormatted, stringForEmptyValue);
          return item;
        })
        ;

      positiveServiceIndicators_Impact =
        helpers.filterBy(psList, {impactBoolean: true})
        .sort(helpers.sortBy('serviceIndicatorDescr', true, 'startDate'))
        ;
      positiveServiceIndicators_NoImpact =
        helpers.filterBy(psList, {impactBoolean: false})
        .sort(helpers.sortBy('serviceIndicatorDescr', true, 'startDate'))
        ;
    }

    //--------------------------------------------------//
    // Negative Service Indicators
    //--------------------------------------------------//
    var nsList = advisee.negativeSisServiceIndicatorList;
    if(!!nsList) {
      nsList =
      nsList
      .map(function(item) {
        item.startTermDescr = helpers.formatNullValue(item.startTermDescr, stringForEmptyValue);
        item.endTermDescr = helpers.formatNullValue(item.endTermDescr, stringForEmptyValue);
        item.startDate = helpers.formatNullValue(item.startDateFormatted, stringForEmptyValue);
        item.endDate = helpers.formatNullValue(item.endDateFormatted, stringForEmptyValue);
        return item;
      })
      ;

      negativeServiceIndicators_Impact =
        helpers.filterBy(nsList, {impactBoolean: true})
        .sort(helpers.sortBy('serviceIndicatorDescr', true, 'startDate'))
        ;
      negativeServiceIndicators_NoImpact =
        helpers.filterBy(nsList, {impactBoolean: false})
        .sort(helpers.sortBy('serviceIndicatorDescr', true, 'startDate'))
        ;
    }
    //--------------------------------------------------//

    return {
      name: advisee.studentName,
      universityId: advisee.emplid,
      flag: advisee.flagsStatus,
      url_onFlag: url_onFlag,
      url_onName: url_onName,
      studentGroupList: sortedStudentGroupList,
      //studentGroups: studentGroups,
      positiveServiceIndicators_Impact: positiveServiceIndicators_Impact,
      positiveServiceIndicators_NoImpact: positiveServiceIndicators_NoImpact,
      negativeServiceIndicators_Impact: negativeServiceIndicators_Impact,
      negativeServiceIndicators_NoImpact: negativeServiceIndicators_NoImpact,
      details: [
        {
          title: programPlanTitle,
          items: programPlanItems,
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
  }
});
