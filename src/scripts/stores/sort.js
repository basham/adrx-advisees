'use strict';

exports.defaultSortByKey = 'studentName';

var types = {
  BOOLEAN: Boolean,
  DATE: String,
  NUMBER: Number,
  STRING: String
};

exports.types = types;

exports.sortOptions = [
  /*
  {
    key: 'acadPlanList',
    label: 'Academic Plan',
    type: types.STRING
  },
  */
  {
    key: 'acadProgDescr',
    label: 'Academic Program',
    type: types.STRING
  },
  {
    key: 'advisorRoleDescr',
    label: 'Advisor Role',
    type: types.STRING
  },
  /*
  {
    key: 'flags',
    label: 'Flags',
    type: types.BOOLEAN
  },
  */
  {
    key: 'iuGpa',
    label: 'GPA - IU',
    type: types.NUMBER
  },
  {
    key: 'programGpa',
    label: 'GPA - Program',
    type: types.NUMBER
  },
  {
    key: 'hours',
    label: 'Hours',
    type: types.NUMBER
  },
  {
    key: 'lastEnrolledStrm',
    label: 'Last Enrolled',
    type: types.DATE
  },
  {
    key: 'studentName',
    label: 'Name',
    type: types.STRING
  }/*,
  {
    key: 'nsi',
    label: 'Negative Service Indicators',
    type: types.BOOLEAN
  },
  {
    key: 'psi',
    label: 'Positive Service Indicators',
    type: types.BOOLEAN
  },
  {
    key: 'sg',
    label: 'Student Groups',
    type: types.BOOLEAN
  }
  */
];
