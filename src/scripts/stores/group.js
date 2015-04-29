'use strict';

var Reflux = require('reflux');
var request = require('superagent');

var actions = require('../actions');
var helpers = require('../helpers');
var dataStore = require('./data');
var sortStore = require('./sort');

var actionQueue = [];

var groupStore = Reflux.createStore({
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
  onStoreChange: function(status) {
    // Execute and remove all queued actions.
    while(actionQueue.length) {
      var action = actionQueue.pop();
      action();
    }
  },
  //
  // Action methods
  //
  onGetGroup: function(id) {
    var data = dataStore.data;
    // If there's no data, then queue the action to be called later,
    // once there's data.
    if(!data) {
      actionQueue.push(function() {
        this.onGetGroup(id);
      }.bind(this));
      return;
    }

    id = id ? id : data.defaultGroupId;
    var hasGroup = !!data.groupMap[id];
    if(!hasGroup) {
      console.log('ERROR: Group not found (id:', id + ')');
      return;
    }

    this.handleSuccess(data, id);
  },
  onSortBy: function(key, isAscending) {
    this.sortByKey = key;
    this.isAscending = isAscending;
    this.handleSuccess(this.data);
  },
  onRemoveMember: function(index) {
    var selectedGroup = this.group;
    selectedGroup.membershipList.splice(index, 1);
    selectedGroup.membershipStudentList.splice(index, 1);
    this.trigger(this.group);
  },
  //
  // Handler methods
  //
  handleSuccess: function(data, groupId) {
    //var adviseeList = data.membershipStudentList;
    var adviseeFlagLink = data.adviseeFlagLink;

    this.data = data;
    this.sortByKey = !!this.sortByKey ? this.sortByKey : sortStore.defaultSortByKey;
    this.isAscending = this.isAscending !== undefined ? this.isAscending : sortStore.defaultIsAscending;

    // URL on name to the student's detail
    var params = helpers.getQueryParams();
    var url = helpers.api('search', {
      sr: params.sr
    });

    var group = data.groupMap[groupId];
    group.membershipStudentList = group.membershipList
    //var output = adviseeList
      .map(function(id) {
        var member = data.memberMap[id];
        member.hours = helpers.round(member.hours, 1);
        member.programGpa = helpers.round(member.programGpa, 2);
        member.iuGpa = helpers.round(member.iuGpa, 2);
        return member;
      })
      .sort(helpers.sortBy(this.sortByKey, this.isAscending, sortStore.defaultSortByKey))
      .map(function(advisee) {

        // URLs
        var url_onFlag = adviseeFlagLink + '&EMPLID=' + advisee.emplid;
        var url_onName = url + '&searchEmplid=' + advisee.emplid;

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
      });

    this.group = group;
    this.trigger(group);
  },
  handleFail: function() {
    var message = (
      <span>
        Advisees could not load.
        Please <button className='adv-Alert-link adv-Link' onClick={actions.getData}>try again</button>.
      </span>
    );
    actions.getDataFailed(message);
  }
});

module.exports = groupStore;
