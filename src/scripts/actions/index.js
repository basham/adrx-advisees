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
  // Member actions
  addMember: async,
  removeMember: async
});

require('./getData');
require('./getGroup');
require('./createGroup');
require('./addMember');
require('./removeMember');
