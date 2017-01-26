
var players = [];
var blobs = [];

var express = require('express');

var app = express();
var server = app.listen(8080);

app.use(express.static('public'));

console.log("My socket server is running");

var socket = require('socket.io');
var io = socket(server);

blobs[10] = {
  x: 0,
  y: 0,
  r: 3
};

for(var i = 0; i < 200; i++){
  blobs[i] = {
    x: (Math.random()*1280*2)-1280,
    y: (Math.random()*720*2)-720,
    r: 3
  }
}

setInterval(heartBeat, 1000/60);

function heartBeat() {
}

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('New connection: ' + socket.id);

  io.sockets.emit('blobsIncoming', blobs);
  console.log('Blobs sent.');

  socket.on('start', startMsg);
  socket.on('update', updateMsg);
  socket.on('updateBlob', updateBlobMsg);
  socket.on('disconnect', disconnectMsg);

  function startMsg(data) {
    console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);

    var blob = {
      id:socket.id,
      x:data.x,
      y:data.y,
      r:data.r,
    };

    players[socket.id] = blob;

    console.log(players[socket.id]);
    io.sockets.emit('playersIncoming', players[socket.id]);
  }

  function updateMsg(data) {
    //console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);

    //console.log(socket.id);
    players[socket.id].x = data.x;
    players[socket.id].y = data.y;
    players[socket.id].r = data.r;
    io.sockets.emit('playersIncoming', players[socket.id]);
  }

  function updateBlobMsg(data) {
    blobs[data] = {
      x: (Math.random()*1280*2)-1280,
      y: (Math.random()*720*2)-720,
      r: 3
    }
    io.sockets.emit('blobsIncoming', blobs);
  }

  function disconnectMsg() {
    console.log("Client: " + socket.id + " has disconnected");
    delete players[socket.id];
    console.log(players[socket.id]);
  }
}
