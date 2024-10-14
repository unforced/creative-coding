let hr, min, sec;
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES); // Use degrees for easier calculations
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  noCursor(); // Hide the cursor for a cleaner look
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // Create a dynamic background
  background(lerpColor(color('#1a2a6c'), color('#b21f1f'), abs(sin(frameCount * 0.005))));

  translate(width / 2, height / 2);

  // Get current time
  hr = hour() % 12;
  min = minute();
  sec = second();

  // Calculate angles for hands
  let secondAngle = map(sec, 0, 60, 0, 360);
  let minuteAngle = map(min + sec / 60, 0, 60, 0, 360);
  let hourAngle = map(hr + min / 60, 0, 12, 0, 360);

  // Draw clock face
  drawClockFace();

  // Draw hands
  drawHand(hourAngle, width * 0.15, 8, color(200, 100, 100), 'hour');
  drawHand(minuteAngle, width * 0.25, 6, color(100, 200, 100), 'minute');
  drawHand(secondAngle, width * 0.35, 4, color(100, 100, 200), 'second');

  // Update and display particles
  updateAndDisplayParticles();

  // Draw digital time
  drawDigitalTime();
}

function drawClockFace() {
  noFill();
  stroke(255, 50);
  strokeWeight(2);
  ellipse(0, 0, width * 0.8, width * 0.8);

  // Draw hour markers
  for (let angle = 0; angle < 360; angle += 30) {
    let x = (width * 0.4) * cos(angle - 90);
    let y = (width * 0.4) * sin(angle - 90);
    strokeWeight(4);
    point(x, y);
  }
}

function drawHand(angle, length, weight, col, type) {
  push();
  rotate(angle - 90); // Adjust so that 0 degrees is at the top
  stroke(col);
  strokeWeight(weight);
  line(0, 0, length, 0);
  pop();

  // Add particles along the hand
  let x = length * cos(radians(angle - 90));
  let y = length * sin(radians(angle - 90));
  particles.push(new Particle(createVector(x, y), col, type));
}

class Particle {
  constructor(position, col, type) {
    this.pos = position.copy();
    this.vel = p5.Vector.random2D().mult(random(1, 3));
    this.acc = createVector(0, 0);
    this.lifespan = 255;
    this.color = col;
    this.size = type === 'hour' ? 8 : type === 'minute' ? 6 : 4;
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifespan -= 5;
  }

  display() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.lifespan);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  isFinished() {
    return this.lifespan <= 0;
  }
}

function updateAndDisplayParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }
}

function drawDigitalTime() {
  fill(255);
  textSize(32);
  let hrDisplay = hr === 0 ? 12 : hr;
  let timeString = nf(hrDisplay, 2) + ':' + nf(min, 2) + ':' + nf(sec, 2);
  text(timeString, 0, height * 0.35 - height / 2);
}

function mousePressed() {
  // Create an explosion of particles at the mouse position
  let pos = createVector(mouseX - width / 2, mouseY - height / 2);
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(pos, color(random(100, 255), random(100, 255), random(100, 255)), 'explosion'));
  }
}
