'use strict';

var Reflux = require('reflux');

// More explicit, but equivalent to:
// `{ asyncResult: true }`
var async = {
  children: [
    'completed',
    'failed'
  ]
};

module.exports = Reflux.createActions({
  getData: async,
  sortBy: {},
  // Group actions
  getGroup: async,
  createGroup: async,
  renameGroup: async,
  deleteGroup: async,
  // Member actions
  addMember: async,
  removeMember: async,
  removeAllMembers: async,
  // Helper actions
  redirect: {},
  redirectToDefaultGroup: {}
});

require('./getData');
require('./getGroup');
require('./createGroup');
require('./renameGroup');
require('./deleteGroup');
require('./addMember');
require('./removeMember');
require('./removeAllMembers');
