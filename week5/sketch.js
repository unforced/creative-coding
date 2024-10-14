let walkers;
let grid;
let gridSize = 250;
let unvisitedCells;
let filledCells;

function setup() {
  createCanvas(500, 500);
  squareSize = width / gridSize;
  walkers = [];
  grid = [];
  unvisitedCells = new Set();
  filledCells = [];

  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = undefined;
      unvisitedCells.add(`${i},${j}`);
    }
  }
  frameRate(60);
}

function randColor() {
  return [random(255), random(255), random(255)];
}

class Walker {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = randColor();
    grid[this.x][this.y] = this.color;
    filledCells.push([this.x, this.y]);
    removeUnvisitedCell(this.x, this.y);
  }
  
  walk() {
    let options = [];
    const directions = [
      [1, 0],  // Right
      [-1, 0], // Left
      [0, 1],  // Down
      [0, -1], // Up
    ];

    for (let [dx, dy] of directions) {
      let nx = this.x + dx;
      let ny = this.y + dy;
      if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
        if (unvisitedCells.has(`${nx},${ny}`)) {
          options.push([nx, ny]);
        }
      }
    }

    if (options.length === 0) {
      return true; // We're done
    }

    let r = floor(random(options.length));
    this.x = options[r][0];
    this.y = options[r][1];

    grid[this.x][this.y] = this.color;
    filledCells.push([this.x, this.y]);
    removeUnvisitedCell(this.x, this.y);
    return false; // Not done yet
  }
}

function spawnWalker() {
  const unvisitedArray = Array.from(unvisitedCells);
  if (unvisitedArray.length > 0) {
    let index = floor(random(unvisitedArray.length));
    let coord = unvisitedArray[index];
    unvisitedCells.delete(coord);
    let [x, y] = coord.split(',').map(Number);
    walkers.push(new Walker(x, y));
  }
}

function draw() {
  background(255);
  spawnWalker(); // Spawn a new walker each frame
  // Update all walkers
  for (let k = 0; k < walkers.length; k++) {
    const walker = walkers[k];
    let done = walker.walk();
    if (done) {
      // Remove the walker if it cannot move further
      walkers.splice(k, 1);
      k--;
    }
  }
  // Draw filled cells
  for (let i = 0; i < filledCells.length; i++) {
    let [x, y] = filledCells[i];
    stroke(0);
    fill(...grid[x][y]);
    square(x * squareSize, y * squareSize, squareSize);
  }
}

function removeUnvisitedCell(x, y) {
  unvisitedCells.delete(`${x},${y}`);
}