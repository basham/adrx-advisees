var restify = require('restify');
var uuid = require('node-uuid');

var data = require('./data.json');
var addMemberJson = require('./addMember.json');

var server = restify.createServer();

// Improves how the server responds to `curl` requests.
server.pre(restify.pre.userAgentConnection());

// Parse query string for use in `req.query`.
server.use(restify.queryParser({ mapParams: false }));

// Parse HTTP request body for use in `req.body`.
server.use(restify.bodyParser({ mapParams: false }));

// Print each request.
server.use(function(req, res, next) {
  console.log(req.method, req.url);
  console.log('  [Params]:', req.params);
  console.log('  [Query]: ', req.query);
  console.log('  [Body]:  ', req.body);
  next();
});

// Delay each response to simulate lag.
server.use(function(req, res, next) {
  var delay = 1000;
  console.log('Delaying by', delay + 'ms');
  setTimeout(function() {
    next();
  }, delay);
});

// Redirect production-style API calls to more ideal routes.
server.post('/sisaarex-dev/adrx/portal.do', function(req, res, next) {
  switch(req.query.action) {
    case 'getGroupsAndMembers':
      req.method = 'GET';
      next('getGroups');
      break;
    case 'createGroup':
      var name = req.query.groupName;
      req.body = {
        data: {
          type: 'groups',
          attributes: {
            name: name
          }
        }
      };
      next('postGroups');
      break;
    case 'renameGroup':
      var id = req.query.groupId;
      var name = req.query.groupName;
      // Restify resets `req.params` whenever it forwards to the next handler
      // via `next('route')`. Manually save the params for later use.
      req._params = { id: id };
      req.method = 'PUT';
      req.body = {
        data: {
          type: 'groups',
          id: id,
          attributes: {
            name: name
          }
        }
      };
      next('putGroups');
      break;
    case 'deleteGroup':
      var id = req.query.groupId;
      req._params = { id: id };
      req.method = 'DELETE';
      next('deleteGroups');
      break;
    case 'removeMember':
      var id = req.query.groupId;
      var peopleId = req.query.emplids;
      req._params = { id: id };
      req.method = 'DELETE';
      req.body = {
        data: [
          {
            type: "people",
            id: peopleId
          }
        ]
      };
      next('deleteGroupsPeople');
      break;
    case 'removeAllMembersFromGroup':
      var id = req.query.groupId;
      req._params = { id: id };
      req.method = 'PUT';
      req.body = {
        data: []
      };
      next('putGroupsPeople');
      break;
    case 'addMember':
      var id = req.query.groupId;
      req._params = { id: id };
      req.method = 'POST';
      req.body = {
        data: []
      };
      next('postGroupsPeople');
      break;
    default:
      next();
  }
});

//
// Get group collection.
//
// curl -isX POST "http://localhost:8000/sisaarex-dev/adrx/portal.do?action=getGroupsAndMembers" | json
// curl -is "http://localhost:8000/groups" | json
server.get(
  {
    name: 'getGroups',
    path: '/groups'
  },
  function(req, res, next) {
    //res.send(500);
    res.send(data);
    next();
  });

//
// Create group resource.
//
// curl -isX POST "http://localhost:8000/sisaarex-dev/adrx/portal.do?action=createGroup&groupName=Group" | json
// curl -isX POST "http://localhost:8000/groups" -H "Content-Type: application/json" -d '{"data":{"type":"groups","attributes":{"name":"Group"}}}' | json
server.post(
  {
    name: 'postGroups',
    path: '/groups'
  },
  function(req, res, next) {
    // Build response.
    var _data = {
      groupMap: {}
    };
    var id = uuid.v4();
    var name = req.body.data.attributes.name;
    var group = {
      groupId: id,
      groupName: name,
      isEditable: true,
      memberList: []
    };

    // Save the group to both the response and in-server-memory data.
    _data.groupMap[id] = group;
    data.groupMap[id] = group;

    //res.send(403);
    res.send(201, _data);
    next();
  });

//
// Update (rename) group resource.
//
// curl -isX POST "http://localhost:8000/sisaarex-dev/adrx/portal.do?action=renameGroup&groupId=0&groupName=Group" | json
// curl -isX PUT "http://localhost:8000/groups/0" -H "Content-Type: application/json" -d '{"data":{"type":"groups","id":"0","attributes":{"name":"Group"}}}' | json
server.put(
  {
    name: 'putGroups',
    path: '/groups/:id'
  },
  function(req, res, next) {
    var id = req._params ? req._params.id : req.params.id;
    var name = req.body.data.attributes.name;
    var group = data.groupMap[id];

    // Group not found.
    if(!group) {
      res.send(404);
      return next();
    }

    // Group is not editable, so it can't be deleted.
    // Send `403 Forbidden`.
    if(!group.isEditable) {
      res.send(403);
      return next();
    }

    // Update the group name.
    data.groupMap[id].groupName = name;

    // Update successful.
    res.send(204);
    next();
  });

//
// Delete group resource.
//
// curl -isX POST "http://localhost:8000/sisaarex-dev/adrx/portal.do?action=deleteGroup&groupId=1b4aeed1-abed-4980-bfb9-8f12918f5b5b" | json
// curl -isX DELETE "http://localhost:8000/groups/1b4aeed1-abed-4980-bfb9-8f12918f5b5b" | json
server.del(
  {
    name: 'deleteGroups',
    path: '/groups/:id'
  },
  function(req, res, next) {
    var id = req._params ? req._params.id : req.params.id;
    var group = data.groupMap[id];

    // Group not found.
    if(!group) {
      res.send(404);
      return next();
    }

    // Group is not editable, so it can't be deleted.
    // Send `403 Forbidden`.
    if(!group.isEditable) {
      res.send(403);
      return next();
    }

    delete data.groupMap[id];

    // Delete successful.
    res.send(204);
    next();
  });

//
// Delete group-people relationship.
//
// curl -isX POST "http://localhost:8000/sisaarex-dev/adrx/portal.do?action=removeMember&groupId=1b4aeed1-abed-4980-bfb9-8f12918f5b5b&emplids=3594629652" | json
// curl -isX DELETE "http://localhost:8000/groups/1b4aeed1-abed-4980-bfb9-8f12918f5b5b/relationships/people" -H "Content-Type: application/json" -d '{"data":[{"type":"people","id":"3594629652"}]}' | json
server.del(
  {
    name: 'deleteGroupsPeople',
    path: '/groups/:id/relationships/people'
  },
  function(req, res, next) {
    var id = req._params ? req._params.id : req.params.id;
    var group = data.groupMap[id];

    // Group not found.
    if(!group) {
      res.send(404);
      return next();
    }

    // Group is not editable, so it can't be modified.
    // Send `403 Forbidden`.
    if(!group.isEditable) {
      res.send(403);
      return next();
    }

    // Remove indicated people relationships.
    req.body.data.forEach(function(peopleReference) {
      var index = data.groupMap[id].memberList.indexOf(peopleReference.id);
      if(index >= 0) {
        data.groupMap[id].memberList.splice(index, 1);
      }
    });

    // Delete successful.
    res.send(204);
    next();
  });

//
// Update (remove all) group-people relationship.
//
// curl -isX POST "http://localhost:8000/sisaarex-dev/adrx/portal.do?action=removeAllMembersFromGroup&groupId=0" | json
// curl -isX PUT "http://localhost:8000/groups/0/relationships/people" -H "Content-Type: application/json" -d '{"data":[]}' | json
server.put(
  {
    name: 'putGroupsPeople',
    path: '/groups/:id/relationships/people'
  },
  function(req, res, next) {
    var id = req._params ? req._params.id : req.params.id;
    var group = data.groupMap[id];

    // Group not found.
    if(!group) {
      res.send(404);
      return next();
    }

    var members = req.body.data.map(function(peopleReference) {
      return peopleReference.id;
    });

    // Update the relationship.
    group.memberList = members;

    // Update successful.
    res.send(204);
    next();
  });

//
// Create group-people relationship.
//
// curl -isX POST "http://localhost:8000/sisaarex-dev/adrx/portal.do?action=addMember&groupId=0" | json
// curl -isX POST "http://localhost:8000/groups/0/relationships/people" -H "Content-Type: application/json" -d '{"data":[{"type":"people","id":"7496827183"}]}' | json
server.post(
  {
    name: 'postGroupsPeople',
    path: '/groups/:id/relationships/people'
  },
  function(req, res, next) {
    // Update successful.
    res.send(201, addMemberJson);
    next();
  });

server.listen(8000, function() {
  console.log('%s listening at %s', server.name, server.url);
});
