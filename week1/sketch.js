let t = 0; // Animation progress (0 to 1)
let direction = 1; // 1 for forward, -1 for backward
let isPaused = false; // Pause state
let pauseTimer = 0; // Timer for pause duration
const PAUSE_DURATION = 30; // 30 frames = 0.5 seconds at 60 FPS

// Color variables for interpolation
let startColor, endColor;

// p5.js setup function, runs once at the beginning
function setup() {
  createCanvas(400, 400); // Create a 400x400 pixel canvas
  frameRate(60); // Set the frame rate to 60 FPS
  startColor = color(0, 0, 255);  // Blue
  endColor = color(255, 0, 0);    // Red
}

// p5.js draw function, runs continuously
function draw() {
  background(220); // Set a light gray background

  // Create a gradient background
  let c1 = color(220, 220, 255);  // Light blue
  let c2 = color(255, 220, 220);  // Light pink
  setGradient(0, 0, width, height, c1, c2, Y_AXIS);

  // Interpolate color based on animation progress
  let currentColor = lerpColor(startColor, endColor, t);
  fill(currentColor);
  noStroke(); // Add this line to remove the stroke

  // Draw the morphing A
  push(); // Save the current drawing state
  translate(width / 2, height / 2); // Move the origin to the center
  scale(3); // Scale up the drawing
  drawMorphingA(t);
  pop(); // Restore the previous drawing state

  // Update animation progress
  if (!isPaused) {
    t += 0.01 * direction;
    if (t > 1 || t < 0) {
      t = constrain(t, 0, 1); // Keep t between 0 and 1
      isPaused = true;
      pauseTimer = PAUSE_DURATION;
    }
  } else {
    pauseTimer--;
    if (pauseTimer <= 0) {
      isPaused = false;
      direction *= -1; // Reverse direction
    }
  }
}

// Function to create a gradient background
function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  if (axis === Y_AXIS) {
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  }
}

const Y_AXIS = 1;

// Function to draw the morphing A
function drawMorphingA(t) {
  if (t < 0.5) {
    // First half of animation: morph circles to triangle
    let normalizedT = map(t, 0, 0.5, 0, 1);
    drawMorphingCircles(normalizedT);
  } else {
    // Second half of animation: reveal the circle of the second A
    let normalizedT = map(t, 0.5, 1, 0, 1);
    drawSecondA();
    drawRevealingCircle(normalizedT);
  }
}

function drawMorphingCircles(t) {
  // Define the positions of the circles and triangle points
  let circlePositions = [
    {x: 20.78, y: 5.17}, {x: 5.17, y: 31.7}, {x: 20.78, y: 31.7},
    {x: 36.41, y: 31.7}, {x: 13, y: 18.43}, {x: 28.59, y: 18.43}
  ];
  let trianglePoints = [{x: 15.17, y: 0.65}, {x: 26.4, y: 0.65}, {x: 35.95, y: 36}];

  // Draw morphing shapes
  noStroke(); // Add this line to ensure no stroke for the circles
  for (let i = 0; i < circlePositions.length; i++) {
    let x = lerp(circlePositions[i].x, trianglePoints[i % 3].x, t);
    let y = lerp(circlePositions[i].y, trianglePoints[i % 3].y, t);
    let size = lerp(10.34, 0, t);
    circle(x, y, size);
  }

  // Draw emerging triangle
  fill(0, t * 255);
  noStroke(); // Add this line to ensure no stroke for the triangle
  triangle(15.17, 0.65, 26.4, 0.65, 35.95, 36);
}

function drawSecondA() {
  noStroke(); // Add this line to ensure no stroke for the second A
  triangle(15.17, 0.65, 26.4, 0.65, 35.95, 36);
}

function drawRevealingCircle(t) {
  noStroke(); // Add this line to ensure no stroke for the revealing circle
  let size = 17.68 * t;
  circle(8.84, 27.15, size);
}
