var of; // particle wrapper

function setup() {
	// create canvas, 100%, fixed, in the back
	var cnv = createCanvas(windowWidth, windowHeight);
	cnv.position(0,0);
  	cnv.style('position', 'fixed');
  	cnv.style('display', 'block');
	cnv.style('z-index','-1'); // thanks Shiffman: https://www.youtube.com/watch?v=OIfEHD3KqCg


    var t =
    {
        name: "test",
        colors: ["blue"],
        lifetime: 300,
        angle: [225,315],
        size: [2,8],
        speedx: 0.7,
        x: 0.2,
        y: 0.1
    };
    of = new Fountain(null, t);
}

function draw() {
	background(0,0,34);
	fill(255);
	stroke(255);
	ellipse(mouseX,mouseY,5,5);
  	line(mouseX, 0, mouseX, height);

	of.Draw();
	// of.Create();
	of.Create(mouseX,mouseY);
	of.Step();
	noStroke();
	text(of.length, width/2, 20);
	stroke(0);
}

function fpoint(fountain, particle) {
  stroke(fountain.colors[Math.floor(particle.life*fountain.colors.length)]);
  noFill();
  point(particle.location.x, particle.location.y);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}