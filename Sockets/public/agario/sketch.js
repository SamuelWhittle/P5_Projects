var socket;

var blob;
var id;

var players = [];
var blobs = [];

var zoom = 1;

function setup() {
	socket = io.connect('http://localhost:8080');

	createCanvas(1280,720);

	blob = new Blob(random(width), random(height), 10);

	var data = {
		x: blob.pos.x,
		y: blob.pos.y,
		r: blob.r,
	}

	socket.emit('start', data);

	socket.on('message', heartBeatMsg);
	socket.on('blobsIncoming', blobsIncomingMsg);

	function heartBeatMsg(data) {
		players = data;
		for(var i = 0; i < players.length; i++) {
			if(players[i].id == socket.id) {
				blob.r = players[i].r;
			}
		}
	}

	function blobsIncomingMsg(data) {
		console.log(data);
		blobs = data;
	}
}

function draw() {
	background(0);

	translate(width/2, height/2);

	var newZoom = 64/blob.r;
	zoom = lerp(zoom, newZoom, 0.2);

	scale(zoom);
	translate(-blob.pos.x, -blob.pos.y);

	for(var i = players.length-1; i >= 0; i--){
		var id = players[i].id;
		if(players[i].id != socket.id) {
			fill(0, 0, 255);
			ellipse(players[i].x, players[i].y, players[i].r*2, players[i].r*2);
		}
	}

	fill(255, 0, 0);
	for(var i = 0; i < blobs.length; i++) {
			ellipse(blobs[i].x, blobs[i].y, blobs[i].r*2, blobs[i].r*2);
	}

	blob.show();
	blob.update();
	blob.constrain();

	var data = {
		x: blob.pos.x,
		y: blob.pos.y,
		r: blob.r,
	}
	socket.emit('update', data);
}
