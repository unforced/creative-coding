function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

let grid;
let cols;
let rows;
let resolution = 10;

function setup() {
    createCanvas(600, 400);
    cols = width / resolution;
    rows = height / resolution;

    // Create and initialize the grid
    grid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = floor(random(2)); // Randomly assign 0 or 1
        }
    }
}

function draw() {
    background(0);

    // Draw current state
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * resolution;
            let y = j * resolution;

            if (grid[i][j] == 1) {
                fill(255);
                stroke(0);
                rect(x, y, resolution - 1, resolution - 1);
            }
        }
    }

    // Compute next generation
    let next = make2DArray(cols, rows);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let state = grid[i][j];

            // Count live neighbors
            let neighbors = countNeighbors(grid, i, j);

            // Apply rules
            if (state == 0 && neighbors == 3) {
                next[i][j] = 1; // Reproduction
            } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
                next[i][j] = 0; // Underpopulation or overpopulation
            } else {
                next[i][j] = state; // Stasis
            }
        }
    }

    // Update grid
    grid = next;
}

function countNeighbors(grid, x, y) {
    let sum = 0;

    // Loop over all neighbors
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let col = (x + i + cols) % cols; // Wrap around edges
            let row = (y + j + rows) % rows;
            sum += grid[col][row];
        }
    }

    sum -= grid[x][y]; // Subtract the cell's own state
    return sum;
}