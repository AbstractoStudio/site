// Raycasting example: https://p5js.org/examples/3d-ray-casting.html
// change js import in templates/about.html.twig

const objects = [];
let eyeZ;

let intersect;
let tween;

let logo;
let material;

let logoPos;
let tweenPos;

let ambientColor;
let tweenAmbient;

let windowDimensions;
let tweenWindow;

function preload() {
  // Load model with normalise parameter set to true
  logo = loadModel("user/themes/abstracto-theme/js/assets/AbstractoLogo.obj", true);
  material = loadImage('user/themes/abstracto-theme/js/assets/material.png');
}

function setup() {
  // create canvas, 100%, fixed, in the back
  var cnv = createCanvas(displayWidth, displayHeight, WEBGL);
  cnv.position(0,0);
  cnv.parent("canvas");
  // cnv.style('position', 'fixed'); // this was inserted directly in the .css since there was some compatibility happening with Firefox
  // cnv.style('display', 'block');
  // cnv.style('overflow', 'auto');
  // cnv.style('z-index','-1'); // thanks Shiffman: https://www.youtube.com/watch?v=OIfEHD3KqCg
  
  eyeZ = height / 2 / tan((30 * PI) / 180); // The default distance the camera is away from the origin.

  objects.push(new IntersectPlane(1, 0, 0, -170, 0, 0)); // Left wall
  objects.push(new IntersectPlane(1, 0, 0, 170, 0, 0)); // Right wall
  objects.push(new IntersectPlane(0, 1, 0, 0, -100, 0)); // Bottom wall
  objects.push(new IntersectPlane(0, 1, 0, 0, 100, 0)); // Top wall
  objects.push(new IntersectPlane(0, 0, 1, 0, 0, -10)); // Back wall

  // Tween setups
  // Mouse position
  mouse_intersect = createVector(0, 0, 400);
  intersect = createVector(0, 0, 400);
  tween = p5.tween.manager
            .addTween(mouse_intersect);

  // Logo position
  logoPos = createVector(0,0,50);
  tweenPos = p5.tween.manager
            .addTween(logoPos);

  // Ambient color
  ambientColor = createVector(125,0,125);
  // bind tween to object
  tweenAmbient = p5.tween.manager
            .addTween(ambientColor);


  // Window
  windowDimensions = createVector(windowWidth,windowHeight);
  // bind tween to object
  tweenWindow = p5.tween.manager
            .addTween(windowDimensions);


  noStroke();
  ambientMaterial(ambientColor.x,ambientColor.y,ambientColor.z);
}

function draw() {
	background(0);
  ambientMaterial(ambientColor.x,ambientColor.y,ambientColor.z);

  // Lights
  // Point light follows mouse/intsersection
  pointLight(255, 0, 0, mouse_intersect);
  ambientLight(94, 0, 255);

  renderWalls();
  calculateIntersections();

  renderObjects();
  
}

// function mouseClicked() { // Clicked interaction also possible
function mouseMoved() {
  // Removes all motions from tween
  tween.resetMotions();
  // Second motion: Change x and y to mouse position in 500ms at the same time
  tween.addMotions([
              { key: 'x', target: intersect.x },
              { key: 'y', target: intersect.y },
              { key: 'z', target: intersect.z }
          ], 1000, 'easeOutQuint')
  // Start the tween
  .startTween();

}

function mouseWheel(event) {

  // Tween Logo Position
  newPosZ = constrain(logoPos.z+event.delta*2,50,650);
  tweenPos.resetMotions();
  tweenPos.addMotions([
              { key: 'z', target: newPosZ }
          ], 1000, 'easeOutQuint')
  .startTween();

  // Tween Ambient Color
  newColor = constrain(ambientColor.x+event.delta/2,125,205);
  tweenAmbient.resetMotions();
  tweenAmbient.addMotions([
              { key: 'x', target: newColor },
              { key: 'z', target: newColor },
          ], 1000, 'easeOutQuint')
  .startTween();


}

function renderObjects() {
  push();
  translate(logoPos);
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

function renderWalls() {
  // Left wall
  push();
  translate(-175, 0, 200);
  rotateY((90 * PI) / 180);
  plane(2000, 200);
  pop();

  // Right wall
  push();
  translate(175, 0, 200);
  rotateY((-90 * PI) / 180);
  plane(2000, 200);
  pop();

  // Bottom wall
  push();
  translate(0, 105, 200);
  rotateX((90 * PI) / 180);
  plane(400, 2000);
  pop();

  // Top wall
  push();
  translate(0, -105, 200);
  rotateX((-90 * PI) / 180);
  plane(400, 2000);
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


function windowResized() {
  resizeCanvas(displayWidth, displayHeight);
}