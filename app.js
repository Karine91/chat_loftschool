var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(3000, function() {
    console.log('Server running in port 3000');
});

//статические ресурсы
app.use(express.static(__dirname + '/public'));

let users = {};

io.sockets.on('connection', function (client) {
    users[client.id] = 'Anonim';
    broadcast('user', users);
    
    client.on('message', function (message) {

    });

    function broadcast(event, data) {
        client.emit(event, data);
        client.broadcast.emit.apply(event, data);
    }
});