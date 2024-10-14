function setup() {
  createCanvas(800, 1200);
  scale(0.5);
  background(255); // White background

  // Draw background elements first
  drawHoneycombPattern();
  drawTopoLines();

  // Draw foreground elements
  drawLogo();
  drawTitle();
  drawEventDates();
  drawCallToAction();
  
  // Add the big blue text before the description hexagons
  drawIntroductionText();
  
  drawDescriptionHexagons();
}

// Function to draw the logo inspired by Logo #4
function drawLogo() {
  push();
  translate(width / 2, 100); // Positioning the logo at the top center

  // Define colors for the triangles
  let colors = [
    color(255, 87, 34, 180),   // Red-orange (with transparency)
    color(76, 175, 80, 180),   // Green
    color(255, 235, 59, 180)   // Yellow
  ];

  // Draw the left triangle (orange-red)
  fill(colors[0]);
  noStroke();
  triangle(-40, 0, -100, 100, 0, 100);
  
  // Draw the middle triangle (yellow)
  fill(colors[2]);
  triangle(0, -50, -40, 0, 40, 0);

  // Draw the right triangle (green)
  fill(colors[1]);
  triangle(40, 0, 0, 100, 100, 100);

  pop();
}

// Title and Tagline
function drawTitle() {
  fill(0); // Black text
  textSize(60);
  textAlign(CENTER);
  text("[CO]here", width / 2, 200); // Centered title
  
  textSize(20);
  textStyle(ITALIC);
  text("A 10-day collaborative game about people, place, and our collective story", width / 2, 240); // Centered tagline
  textStyle(NORMAL); // Reset text style
}

// Event Dates
function drawEventDates() {
  fill(0);
  textSize(40);
  textStyle(BOLD);
  text("October 10 - 20", width / 2, 280); // Centered event dates
  textStyle(NORMAL); // Reset text style
}

// Call to Action
function drawCallToAction() {
  fill(0);
  textSize(24);
  textAlign(LEFT);
  textStyle(BOLD);
  text("Join in to:", 100, 330); // Left aligned heading, adjusted y position
  
  textSize(20);
  textStyle(NORMAL);
  text("• Attend events on our co-curated calendar", 120, 360); // Bullet point 1
  text("• Step into a 'community weaver' mindset", 120, 390); // Bullet point 2
  text("• Put yourself and things you care about 'on the map'", 120, 420); // Bullet point 3
}

// Introduction Text
function drawIntroductionText() {
  fill(33, 150, 243); // Blue text
  textSize(32); // Big text
  textStyle(BOLD);
  textAlign(CENTER);
  text("[CO]here is a...", width / 2, 470); // Position it above the hexagons
  textStyle(NORMAL); // Reset text style
}

// Function to draw description hexagons in a triangular layout with colored titles
function drawDescriptionHexagons() {
  let hexRadius = 100;
  
  // Define colors for the titles
  let titleColors = [
    color(255, 87, 34),   // Red-orange for "Event Series"
    color(76, 175, 80),   // Green for "Game"
    color(33, 150, 243)   // Blue for "Invitation to Co-vision"
  ];
  
  // Calculate positions for the three hexagons in a triangular layout
  let topX = width / 2;               // Centered for the top hexagon
  let topY = 620;                     // Y position of the top hexagon, adjusted down
  
  let leftX = width / 2 - 130;        // Left hexagon, offset horizontally
  let leftY = topY + hexRadius * 1.5; // Positioned below the top hexagon
  
  let rightX = width / 2 + 130;       // Right hexagon, offset horizontally
  let rightY = topY + hexRadius * 1.5; // Positioned below the top hexagon

  // Draw the top hexagon (Event Series)
  drawHexagonWithText(
    topX,
    topY,
    hexRadius,
    "Event Series",
    titleColors[0], // Red-orange title color
    "Featuring community-generated events hosted around town"
  );

  // Draw the bottom-left hexagon (Game)
  drawHexagonWithText(
    leftX,
    leftY,
    hexRadius,
    "Game",
    titleColors[1], // Green title color
    "Includes missions, a game board, and customizable 'rules' you can play anywhere"
  );

  // Draw the bottom-right hexagon (Invitation to Co-vision)
  drawHexagonWithText(
    rightX,
    rightY,
    hexRadius,
    "Invitation to \nCo-vision",
    titleColors[2], // Blue title color
    "Our future together"
  );
}

// Function to draw a hexagon with a colored title and description inside it
function drawHexagonWithText(x, y, radius, title, titleColor, description) {
  // Draw hexagon
  fill(255); // White fill for hexagons
  stroke(0); // Black border
  strokeWeight(2);
  drawHexagon(x, y, radius); // Use the drawHexagon function
  
  // Adjust the text inside the hexagon
  noStroke();
  
  // Title text (bold and centered near the top of the hexagon)
  textSize(18); // Increased text size for the title
  textStyle(BOLD);
  fill(titleColor); // Set the title color
  textAlign(CENTER, CENTER);
  text(title, x, y - radius * 0.3); // Adjusted position
  
  // Description text (normal and centered inside the hexagon)
  textSize(14); // Increased text size for the description
  textStyle(NORMAL);
  fill(0); // Black text for description
  textAlign(CENTER, TOP);
  // Set the text box to fit within the hexagon boundaries
  let descriptionWidth = radius * 1.5;
  let descriptionX = x - descriptionWidth / 2;
  let descriptionY = y - radius * 0.1;
  text(description, descriptionX, descriptionY, descriptionWidth, radius); // Multi-line description
}

// Function to draw a hexagon at a given position and radius
function drawHexagon(x, y, radius) {
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i + PI / 6; // Rotate so the flat side is at the top
    let xOffset = cos(angle) * radius;
    let yOffset = sin(angle) * radius;
    vertex(x + xOffset, y + yOffset);
  }
  endShape(CLOSE);
}

// Honeycomb Pattern
function drawHoneycombPattern() {
  stroke(255, 204, 0, 50); // Light yellow, more transparent
  fill(255, 204, 0, 30);   // Adjusted transparency
  let hexRadius = 30;
  
  let row = 0;
  for (let y = -hexRadius; y < height + hexRadius; y += hexRadius * 1.5) {
    let xOffset = (row % 2 === 0) ? hexRadius : 0;
    for (let x = -hexRadius; x < width + hexRadius; x += hexRadius * 2) {
      drawHexagon(x, y, hexRadius);
    }
    row++;
  }
}

// Topographic Lines
function drawTopoLines() {
  stroke(180, 180, 180, 50); // Light grey with more transparency
  noFill();
  
  let noiseScaleX = 0.005;
  let noiseScaleY = 0.05;
  
  for (let i = 0; i < 20; i++) {
    beginShape();
    let yOffset = i * (height / 25); // Space out lines evenly
    for (let x = 0; x <= width; x += 20) {
      let y = noise(x * noiseScaleX, i * noiseScaleY) * (height / 3);
      curveVertex(x, y + yOffset);
    }
    endShape();
  }
}
