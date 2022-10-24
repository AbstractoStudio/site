// Base sketch
// change js import in templates/about.html.twig

function setup() {
  // create canvas, 100%, fixed, in the back
  var cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0,0);
  cnv.style('position', 'fixed');
  cnv.style('display', 'block');
  cnv.style('z-index','-1'); // thanks Shiffman: https://www.youtube.com/watch?v=OIfEHD3KqCg
  
}

function draw() {
	background(0,0,34);
	fill(255);
	stroke(255);
	ellipse(mouseX,mouseY,50,50);
  line(mouseX, 0, mouseX, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}