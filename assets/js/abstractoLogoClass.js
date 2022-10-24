// Raycasting example: https://p5js.org/examples/3d-ray-casting.html
// change js import in templates/about.html.twig

const objects = [];
var eyeZ;

var intersect;
var tween;

var abstracto;
var logo;
var material;


let abstracto = class AbstractoLogo{
  constructor(){
    this.pos = createVector(0,0,650);
    this.xoff = createVector(0.01,0.01,0.01);
    this.noise = createVector(0,0,0);
  }

  get updatePosition(){
    return this.pos.x + noise(xoff.x,xoff.y,xoff.z);
  }

  function display() {
    push();
    translate(this.pos);
    rotateX(radians(180));
    rotateX(radians(-15));
    rotateY(radians(55));
    rotate(radians(map(mouseX,0,width,10,-10)),[0,1,1]);
    rotate(radians(map(mouseY,0,height,10,-10)),[1,1,1]);
    smooth();
    texture(material);
    scale(0.5);
    model(logo);
    pop();
    return;
  }

  run(){
    display();
    updatePosition();
  }

}



function preload() {
  // Load model with normalise parameter set to true
  logo = loadModel("user/themes/abstracto-theme/js/assets/AbstractoLogo.obj", true);
  material = loadImage('user/themes/abstracto-theme/js/assets/material.png');
}

function setup() {
  // create canvas, 100%, fixed, in the back
  var cnv = createCanvas(windowWidth, windowHeight, WEBGL);
  cnv.position(0,0);
  cnv.style('position', 'fixed');
  cnv.style('display', 'block');
  cnv.style('z-index','-1'); // thanks Shiffman: https://www.youtube.com/watch?v=OIfEHD3KqCg
  
  eyeZ = height / 2 / tan((30 * PI) / 180); // The default distance the camera is away from the origin.

  objects.push(new IntersectPlane(1, 0, 0, -170, 0, 0)); // Left wall
  objects.push(new IntersectPlane(1, 0, 0, 170, 0, 0)); // Right wall
  objects.push(new IntersectPlane(0, 1, 0, 0, -100, 0)); // Bottom wall
  objects.push(new IntersectPlane(0, 1, 0, 0, 100, 0)); // Top wall
  objects.push(new IntersectPlane(0, 0, 1, 0, 0, -10)); // Back wall

  // initialize vectors
  mouse_intersect = createVector(0, 0, 400);
  intersect = createVector(0, 0, 400);

  // bind tween to object
  tween = p5.tween.manager
            .addTween(mouse_intersect);
  
  // abstracto
  // abstracto = new AbstractoLogo();

  noStroke();
  ambientMaterial(205,0,204);
}

function draw() {
	background(0);

  // Lights
  // Point light follows mouse/intsersection
  pointLight(255, 0, 0, mouse_intersect);
  ambientLight(94, 0, 255);

  renderWalls();
  calculateIntersections();

  renderObjects();
  
}


function mouseMoved() {
  updateTween();

}

function updateTween() {
  // Removes all motions from tween
  tween.resetMotions();
  // Second motion: Change x and y to mouse position in 500ms at the same time
  tween.addMotions([
              { key: 'x', target: intersect.x },
              { key: 'y', target: intersect.y },
              { key: 'z', target: intersect.z }
          ], 1000, 'easeOutQuint')
  // Start the tween
  .startTween();// function mouseClicked() { // Clicked interaction also possibl
}

function renderObjects() {

  abstracto.run();

}


function renderWalls() {
  // Left wall
  push();
  translate(-175, 0, 200);
  rotateY((90 * PI) / 180);
  plane(1500, 200);
  pop();

  // Right wall
  push();
  translate(175, 0, 200);
  rotateY((-90 * PI) / 180);
  plane(1500, 200);
  pop();

  // Bottom wall
  push();
  translate(0, 105, 200);
  rotateX((90 * PI) / 180);
  plane(400, 1500);
  pop();

  // Top wall
  push();
  translate(0, -105, 200);
  rotateX((-90 * PI) / 180);
  plane(400, 1500);
  pop();

  plane(400, 200); // Back wall
}






// Class for a plane that extends to infinity.
class IntersectPlane {
  constructor(n1, n2, n3, p1, p2, p3) {
    this.normal = createVector(n1, n2, n3); // The normal vector of the plane
    this.point = createVector(p1, p2, p3); // A point on the plane
    this.d = this.point.dot(this.normal);
  }

  getLambda(Q, v) {
    return (-this.d - this.normal.dot(Q)) / this.normal.dot(v);
  }
}

function calculateIntersections() {
  const x = mouseX - width / 2;
  const y = mouseY - height / 2;

  const Q = createVector(0, 0, eyeZ); // A point on the ray and the default position of the camera.
  const v = createVector(x, y, -eyeZ); // The direction vector of the ray.

  intersect; // The point of intersection between the ray and a plane.
  let closestLambda = eyeZ * 10; // The draw distance.

  for (let x = 0; x < objects.length; x += 1) {
    let object = objects[x];
    let lambda = object.getLambda(Q, v); // The value of lambda where the ray intersects the object

    if (lambda < closestLambda && lambda > 0) {
      // Find the position of the intersection of the ray and the object.
      intersect = p5.Vector.add(Q, p5.Vector.mult(v, lambda));
      closestLambda = lambda;
    }
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}