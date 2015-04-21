'use strict';

var Reflux = require('reflux');
var request = require('superagent');

var actions = require('../actions');
var helpers = require('../helpers');
var sortStore = require('./sort');

var adviseesStore = Reflux.createStore({
  listenables: actions,
  //
  // Action methods
  //
  onGetData: function() {
    /*
    setTimeout(function() {
      this.handleSuccess(require('./data.json'));
    }.bind(this), 0);
    return;
    */
    var params = helpers.getQueryParams();

    request
      .get(helpers.api('myAdvisees_JSON'))
      .query({
        sr: params.sr,
        backdoorId: params.backdoorId
      })
      .end(helpers.requestCallback(this.handleSuccess, this.handleFail));
  },
  onSortBy: function(key, isAscending) {
    this.sortByKey = key;
    this.isAscending = isAscending;
    this.handleSuccess(this.data);
  },
  //
  // Handler methods
  //
  handleSuccess: function(data) {
    var adviseeList = data.adviseeList;
    var adviseeFlagLink = data.adviseeFlagLink;

    this.data = data;
    this.sortByKey = !!this.sortByKey ? this.sortByKey : sortStore.defaultSortByKey;
    this.isAscending = this.isAscending !== undefined ? this.isAscending : sortStore.defaultIsAscending;

    // URL on name to the student's detail
    var params = helpers.getQueryParams();
    var url = helpers.api('search', {
      sr: params.sr
    });

    var output = adviseeList
      .map(function(advisee) {
        advisee.hours = parseFloat(helpers.round(advisee.hours, 1));
        advisee.programGpa = parseFloat(helpers.round(advisee.programGpa, 2));
        advisee.iuGpa = parseFloat(helpers.round(advisee.iuGpa, 2));
        return advisee;
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

        //
        // Round numerical values.
        //
        var hours = helpers.round(advisee.hours, 1);
        var programGPA = helpers.round(advisee.programGpa, 2);
        var universityGPA = helpers.round(advisee.iuGpa, 2);

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
              //console.log('item', item);
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

        // Failed to replace null to '&mdash;' by Eunmee Yi on 2015/04/09
        //var stringForEmptyValue = '&mdash;';
        //var stringForEmptyValue = '-----';
        // Chris Basham find the way to pass mdash on 2015/04/18
        var stringForEmptyValue = '\u2014';

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

    this.trigger(output);
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

module.exports = adviseesStore;
