var socket;

var blob;
var id;

var players = [];
var blobs = [];

var zoom = 1;

function setup() {
	socket = io.connect('http://localhost:8080');

	createCanvas(1280,720);

	blob = new Blob(1280,720, 10);

	var data = {
		x: blob.pos.x,
		y: blob.pos.y,
		r: blob.r,
	}

	socket.emit('start', data);
	socket.on('blobsIncoming', blobsIncomingMsg);
	socket.on('playersIncoming', playersIncomingMsg);
	socket.on('message', heartBeatMsg);

	function heartBeatMsg(data) {
		//console.log('heartBeatMsg');
	}

	function blobsIncomingMsg(data) {
		console.log('blobsIncomingMsg');
		blobs = data;
		//console.log(blobs);
	}

	function playersIncomingMsg(data) {
		console.log('playersIncomingMsg');
		players[data.id] = data;
		console.log(players);
	}
}

function draw() {
	background(0);

	translate(width/2, height/2);

	var newZoom = 64/blob.r;
	zoom = lerp(zoom, newZoom, 0.2);

	scale(zoom);
	translate(-blob.pos.x, -blob.pos.y);

	console.log(players.length);
	for(var i = 0; i < players.length; i++){
		console.log('Drawing player.');
		if(players[i].id != socket.id) {
			fill(0, 0, 255);
			ellipse(players[i].x, players[i].y, players[i].r*2, players[i].r*2);
		}
	}

	drawBlobs();

	//console.log('(' + blob.pos.x + ', ' + blob.pos.y + ')');

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

function drawBlobs() {
	//console.log('Drawing blobs.');
	fill(255, 0, 0);
	for(var i = 0; i < blobs.length; i++) {
		if(Math.sqrt(Math.pow((blob.pos.x-blobs[i].x),2) + Math.pow((blob.pos.y-blobs[i].y),2)) > (blobs[i].r + blob.r)) {
			ellipse(blobs[i].x, blobs[i].y, blobs[i].r*2, blobs[i].r*2);
		} else {
			blob.eats(3);
			socket.emit('updateBlob', i);
		}
	}
}
