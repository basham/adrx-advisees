'use strict';

var request = require('superagent');

var actions = require('./');
var helpers = require('../helpers');

actions.getData.listen(function() {
  var params = helpers.getQueryParams();
  request
    .post(helpers.api('handleAdHocGroup'))
    .query({
      sr: params.sr,
      action: 'getGroupsAndMembers'
    })
    .send({
      sr: params.sr,
      action: 'getGroupsAndMembers',
      backdoorId: params.backdoorId
    })
    .end(helpers.requestCallback(completed, failed));
});

function completed(json) {
  actions.getData.completed(json);
}

function failed() {
  var message = (
    <span>
      Could not load.
      Please <button className='adv-Alert-link adv-Link' onClick={actions.getData}>try again</button>.
    </span>
  );
  actions.getData.failed(message);
}
