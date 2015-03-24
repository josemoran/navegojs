var http = require('http')
var port = process.env.PORT || 1337;
http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello Azure, mi nombre es Papos\n');
}).listen(port);