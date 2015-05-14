var restify = require('restify');

function respond(req, res, next) {
  res.send({ hello: req.params.name });
  next();
}

var server = restify.createServer();

server.pre(restify.pre.userAgentConnection());

// curl -is http://localhost:8080/hello/mark | json
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
