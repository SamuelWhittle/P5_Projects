var socket;

var blob;
var blobs = [];
var zoom = 1;

function setup() {
	socket = io.connect('http://localhost:8080');
	socket.on('mouse', newDrawing);
	createCanvas(1280,720);
	blob = new Blob(0, 0, 64);
	for(var i = 0;i<2000;i++){
		var x = random(-width, width);
		var y = random(-height, height);
		blobs[i] = new Blob(x, y, 16);
	}
}

function newDrawing(data) {
	noStroke();
	fill(255, 0, 100);
	ellipse(data.x, data.y, 36, 36);
}

function mouseDragged() {
	console.log('Sending: ' + mouseX + ', ' + mouseY);

	var data = {
		x: mouseX,
		y: mouseY,
	}

	socket.emit('mouse', data);

}

function draw() {
	background(0);

	translate(width/2, height/2);

	var newZoom = 64/blob.r;
	zoom = lerp(zoom, newZoom, 0.2);

	scale(zoom);
	translate(-blob.pos.x, -blob.pos.y);

	for(var i = blobs.length-1; i >= 0; i--){
		blobs[i].show();
		if(blob.eats(blobs[i])) {
			blobs.splice(i,1);
			append(blobs, new Blob(random(-width, width), random(-height, height), 16));
		}
	}
	blob.show();
	blob.update();
}
