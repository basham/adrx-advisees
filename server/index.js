var restify = require('restify');
var uuid = require('node-uuid');

var data = require('./data.json');

var server = restify.createServer();

// Improves how the server responds to `curl` requests.
server.pre(restify.pre.userAgentConnection());

// Parse query string for use in `req.query`.
server.use(restify.queryParser());

// Parse HTTP request body.
server.use(restify.bodyParser({ mapParams: false }));

// Print each request.
server.use(function(req, res, next) {
  console.log(req.method, req.url, req.query);
  next();
});

// Redirect production-style API calls to more ideal routes.
server.post('/sisaarex-dev/adrx/portal.do', function(req, res, next) {
  switch(req.query.action) {
    case 'getGroupsAndMembers':
      req.method = 'GET';
      next('getGroups');
      break;
    case 'createGroup':
      next('postGroups');
      break;
  }
  next();
});

// curl -isX POST http://localhost:8000/sisaarex-dev/adrx/portal.do?action=getGroupsAndMembers | json
// curl -is http://localhost:8000/groups | json
server.get(
  {
    name: 'getGroups',
    path: '/groups'
  },
  function(req, res, next) {
    setTimeout(function() {
      //res.send(500);
      res.send(data);
    }, 1000);
    next();
  });

// curl -isX POST http://localhost:8000/sisaarex-dev/adrx/portal.do?action=createGroup&groupName=Group | json
// curl -isX POST http://localhost:8000/groups -d "groupName=Group" | json
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
    var name = req.body.groupName;
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

server.listen(8000, function() {
  console.log('%s listening at %s', server.name, server.url);
});
