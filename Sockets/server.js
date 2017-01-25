
var players = [];
var blobs = [];

function Blob(id, x, y, r) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
}

var express = require('express');

var app = express();
var server = app.listen(8080);

app.use(express.static('public'));

console.log("My socket server is running");

var socket = require('socket.io');
var io = socket(server);

for(var i = 0; i < 2000; i++) {
  blobs.push(new Blob(1, Math.random(1280*2)-1280, Math.random(1280*2)-1280, 3));
}

setInterval(heartBeat, 1000/60);

function heartBeat() {
  io.sockets.emit('message', players);
  io.sockets.emit('blobsIncomming', blobs);
}

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('New connection: ' + socket.id);

  socket.on('start', startMsg);
  socket.on('update', updateMsg);
  socket.on('disconnect', disconnectMsg);

  function startMsg(data) {
    console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);

    var blob = new Blob(socket.id, data.x, data.y, data.r);
    players.push(blob);
    //socket.broadcast.emit('mouse', data);
    //io.sockets.emit('mouse', data);
  }

  function updateMsg(data) {
    //console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);

    var blob;
    for(var i = 0; i < players.length; i++) {
      if(socket.id == players[i].id) {
        blob = players[i];
      }
    }

    blob.x = data.x;
    blob.y = data.y;
    blob.r = data.r;
  }

  function disconnectMsg(socket) {
    console.log("Client has disconnected");
    for(var i = 0; i < players.length; i++) {
      if(socket.id == players[i].id) {
        players.slice(i, 1);
      }
    }
  }

}

function eatable() {

}
