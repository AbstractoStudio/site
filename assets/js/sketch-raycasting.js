// Raycasting example: https://p5js.org/examples/3d-ray-casting.html
// change js import in templates/about.html.twig

const objects = [];
let eyeZ;

let intersect;
let tween;


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
  
  // Cursor
  // push();
  // translate(intersect);
  // fill(255, 255, 255);
  // specularMaterial(250);
  // sphere(1);
  // pop();
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

function renderObjects() {

  // Cylinder Circle
  push();
  translate(0,0,450);
  let radius = 55;
  let amount = 30;
  for (var a = 0; a < TWO_PI; a+=PI/amount) {
    push();
    translate(cos(a)*radius,sin(a)*radius,0);
    rotate(radians(frameCount)/25*(a+10),[1,1,1]);
    cylinder(2,tan(map(mouseX,0,width,-HALF_PI,HALF_PI)+a)*50);
    pop();
  }
  pop();

  // Infinity Circle of Cubes
  // push();
  // translate(0,0,450);
  // let radius = 75;
  // let amount = 10;
  // for (var a = 0; a < TWO_PI; a+=PI/amount) {
  //   push();
  //   translate(cos(a)*radius,sin(a)*radius,tan(map(mouseX,0,width,-HALF_PI,HALF_PI)+a)*50);
  //   rotate(radians(frameCount)/10*(a+10),[1,1,1]);
  //   box(15);
  //   pop();
  // }
  // pop();
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
  plane(1000, 200);
  pop();

  // Right wall
  push();
  translate(175, 0, 200);
  rotateY((-90 * PI) / 180);
  plane(1000, 200);
  pop();

  // Bottom wall
  push();
  translate(0, 105, 200);
  rotateX((90 * PI) / 180);
  plane(400, 1000);
  pop();

  // Top wall
  push();
  translate(0, -105, 200);
  rotateX((-90 * PI) / 180);
  plane(400, 1000);
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
  resizeCanvas(windowWidth, windowHeight);
}