'use strict';

exports.defaultSortByKey = 'studentName';
exports.defaultIsAscending = true;

var types = {
  BOOLEAN: 0,
  DATE: 1,
  NUMBER: 2,
  STRING: 3
};

var order = {};

order[types.DATE] = [
  'Oldest to Newest',
  'Newest to Oldest'
];

order[types.NUMBER] = [
  'Lowest to Highest',
  'Highest to Lowest'
];

order[types.STRING] = [
  'A to Z',
  'Z to A'
];

var sortMap = {
  /*
  acadPlanList: {
    key: 'acadPlanList',
    label: 'Academic Plan',
    type: types.STRING
  },
  */
  acadProgDescr: {
    key: 'acadProgDescr',
    label: 'Academic Program',
    order: order[types.STRING],
    type: types.STRING
  },
  advisorRoleDescr: {
    key: 'advisorRoleDescr',
    label: 'Advisor Role',
    order: order[types.STRING],
    type: types.STRING
  },
  /*
  flags: {
    key: 'flags',
    label: 'Flags',
    type: types.BOOLEAN
  },
  */
  iuGpa: {
    key: 'iuGpa',
    label: 'GPA - IU',
    order: order[types.NUMBER],
    type: types.NUMBER
  },
  programGpa: {
    key: 'programGpa',
    label: 'GPA - Program',
    order: order[types.NUMBER],
    type: types.NUMBER
  },
  hours: {
    key: 'hours',
    label: 'Hours',
    order: order[types.NUMBER],
    type: types.NUMBER
  },
  lastEnrolledStrm: {
    key: 'lastEnrolledStrm',
    label: 'Last Enrolled',
    order: order[types.DATE],
    type: types.DATE
  },
  studentName: {
    key: 'studentName',
    label: 'Name',
    order: order[types.STRING],
    type: types.STRING
  }/*,
  nsi: {
    key: 'nsi',
    label: 'Negative Service Indicators',
    type: types.BOOLEAN
  },
  psi: {
    key: 'psi',
    label: 'Positive Service Indicators',
    type: types.BOOLEAN
  },
  sg: {
    key: 'sg',
    label: 'Student Groups',
    type: types.BOOLEAN
  }
  */
};

exports.sortMap = sortMap;

exports.sortList = [
  sortMap.acadProgDescr,
  sortMap.advisorRoleDescr,
  sortMap.iuGpa,
  sortMap.programGpa,
  sortMap.hours,
  sortMap.lastEnrolledStrm,
  sortMap.studentName
];
