/*var http = require('http')
var port = process.env.PORT || 1337;
http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello Azure, mi nombre es Papos\n');
}).listen(port);
*/
var io = require('socket.io').listen(80);
//io.set('log level', 1); // reduce logging
var pg = require ('pg');
var pgConString = "postgres://postgres:2eh6q5xz@tmserver01.cloudapp.net/navego_pacifico"

// Conexion socket io con clientes
io.sockets.on('connection', function(client) {
  console.log('conectado:'+client);
    client.emit('usr_conectado', client.id);
    client.on('usr_conectado', function(pNombre) {
      console.log('usr_conectado:'+pNombre);
        client.emit('usr_conectado', pNombre);
    });
    client.on('usr_desconectado', function(pNombre, pCallback) {
      console.log('usr_desconectado:'+pNombre);
        client.broadcast.emit('usr_desconectado', pNombre);
        pCallback();
    });
});

//------------------------------------------------
// Inicio ::Escucha Notificaciones de PostgreSQL
//------------------------------------------------
var pgListenClient = new pg.Client(pgConString);
pgListenClient.connect();

pgListenClient.query('LISTEN watchers');

pgListenClient.on('notification', function(msg) {
    console.log('LISTEN ID:'+msg.payload);
	enviaNotificacionTodos(msg.payload);
});

pgListenClient.on('error', function(e){
  console.log(e);
  setTimeout((function() {
    pgListenClient.connect();
  }), 1000);
});
//------------------------------------------------
// Fin :: Escucha Notificaciones de PostgreSQL
//------------------------------------------------



var pgclient = new pg.Client(pgConString);
pgclient.connect();
pgclient.on('error', function(e){
  console.log(e);
  setTimeout((function() {
    pgclient.connect();
  }), 1000);
});

function enviaNotificacionTodos(id){
	var qry = pgclient.query("select * from funcion_navego.fn_servicio_getnotification_by_id("+id+");");
	//Se dispara al terminar de ejecutar el query
	qry.on('row', function(row) {
      console.log(row);
      io.sockets.emit('updategrid', id,JSON.stringify(row));
	});
}
