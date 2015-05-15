var restify = require('restify');

var data = require('./data.json');

var server = restify.createServer();

// Improves how the server responds to `curl` requests.
server.pre(restify.pre.userAgentConnection());

// Parse query string for use in `req.query`.
server.use(restify.queryParser());

// Print each request.
server.use(function(req, res, next) {
  console.log(req.method, req.url, req.query);
  next();
});

// Redirect production-style API calls to more ideal routes.
server.post('/sisaarex-dev/adrx/portal.do', function(req, res, next) {
  switch(req.query.action) {
    // curl -isX POST http://localhost:8000/sisaarex-dev/adrx/portal.do?action=getGroupsAndMembers | json
    case 'getGroupsAndMembers':
      req.method = 'GET';
      next('data');
      break;
  }
  next();
});

// curl -is http://localhost:8000/data | json
server.get(
  {
    name: 'data',
    path: '/data'
  },
  function(req, res, next) {
    res.send(data);
    next();
  });

server.listen(8000, function() {
  console.log('%s listening at %s', server.name, server.url);
});
