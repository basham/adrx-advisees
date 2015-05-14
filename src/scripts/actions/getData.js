'use strict';

var request = require('superagent');

var actions = require('./');
var helpers = require('../helpers');

actions.getData.listen(function() {
  //return local();

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

function local() {
  setTimeout(function() {
    completed(require('../stores/data.json'));
  }, 0);
}

function completed(json) {
  actions.getData.completed(json);
}

function failed() {
  var message = (
    <span>
      Advisees could not load.
      Please <button className='adv-Alert-link adv-Link' onClick={actions.getData}>try again</button>.
    </span>
  );
  actions.getData.failed(message);
}
