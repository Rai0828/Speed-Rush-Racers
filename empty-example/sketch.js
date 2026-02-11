let player;
let obstacles = [];
let roadSpeed = 4;
let spawnRate = 90;
let timer = 0;
let gameOver = false;
let distance = 0;
let stage = 1;
let stageMessageTimer = 0;
let themeSound;
let playerImg;
let carImgs = [];
let stageGoals = [0, 500, 1000, 2000]; // meters

// Game state: "start" = start screen, "playing" = game, "gameOver" = game over
let gameState = "start";

function preload() {
  playerImg = loadImage("assets/motorcycle.png");

  carImgs[0] = loadImage("assets/car1.png");
  carImgs[1] = loadImage("assets/car2.png");
  themeSound = loadSound("assets/theme.mp3");
}

function setup() {
  createCanvas(600, 800);
  player = new Player();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(50);

  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "playing") {
    playGame();
  } else if (gameState === "gameOver") {
    displayGameOver();
  }
}

// ---------------- START SCREEN ----------------
function drawStartScreen() {
  background(0);
  fill(255);

  // Title
  textSize(60);
  text("Speed Rush Racers", width / 2, height / 2 - 100);

  // Instruction
  textSize(24);
  text("Click START to begin!", width / 2, height / 2 - 50);

  // Start button
  fill(0, 200, 0);
  rect(width / 2, height / 2 + 50, 200, 60, 10);

  fill(255);
  textSize(32);
  text("START", width / 2, height / 2 + 50);
}

// Detect click for the START button
function mousePressed() {
  if (gameState === "start") {
    // Check if mouse is inside the start button
    if (
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > height / 2 + 20 &&
      mouseY < height / 2 + 80
    ) {
      gameState = "playing";

      // Play the theme sound if not already playing
      if (!themeSound.isPlaying()) {
        themeSound.loop(); // loop the music
      }
    }
  }
}

// ---------------- GAMEPLAY ----------------
function playGame() {
  timer += 1 / 60;
  distance += roadSpeed * 0.05;
  updateStage();

  drawRoad();
  handleDifficulty();

  player.update();
  player.display();

  let stageSpawnModifier = stage === 1 ? 2 : 1;
  let finalSpawnRate = floor(spawnRate * stageSpawnModifier);

  if (frameCount % finalSpawnRate === 0) {
    obstacles.push(new Obstacle());
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].display();

    if (obstacles[i].hits(player)) {
      gameOver = true;
      gameState = "gameOver";
    }

    if (obstacles[i].y > height + 50) {
      obstacles.splice(i, 1);
    }
  }

  displayUI();
}

// ---------------- ROAD ----------------
// ---------------- ROAD ----------------
function drawRoad() {
  // Gray road
  fill(100);
  rect(width / 2, height / 2, 300, height);

  // Center dashed line
  stroke(255);
  strokeWeight(4);
  let dashLength = 20; // length of each dash
  let gap = 20; // gap between dashes
  for (let y = -dashLength; y < height; y += dashLength + gap) {
    line(
      width / 2,
      y + ((frameCount * roadSpeed) % (dashLength + gap)),
      width / 2,
      y + dashLength + ((frameCount * roadSpeed) % (dashLength + gap)),
    );
  }
  noStroke();
}

function handleDifficulty() {
  roadSpeed = 4 + timer * 0.1 + stage * 1.5;
  spawnRate = max(25, 90 - timer * 2 - stage * 10);
}

// ---------------- UI ----------------
function displayUI() {
  fill(255);
  textSize(20);

  // Stage + Distance — move a bit to the right (e.g., x = 50)
  textAlign(LEFT); // align text from the left edge
  text("Stage: " + stage, 50, 30);
  text("Distance: " + floor(distance) + " m", 50, 60);

  // Timer at top-right
  textAlign(RIGHT);
  text("Time: " + timer.toFixed(1) + " s", width - 50, 30);
  textAlign(LEFT);

  // Progress Bar — keep at same position
  let start = stageGoals[stage - 1];
  let end = stageGoals[stage] || stageGoals[stage - 1];
  let progress = map(distance, start, end, 0, 200);

  fill(80);
  rectMode(CORNER); // switch to corner mode for progress bar
  rect(50, 80, 200, 20); // background of bar

  fill(0, 255, 0);
  rect(50, 80, constrain(progress, 0, 200), 20); // green bar grows from left

  rectMode(CENTER); // reset to center mode for everything else

  // Stage transition message
  if (stageMessageTimer > 0) {
    fill(255, 255, 0);
    textSize(36);
    textAlign(CENTER);
    text("STAGE " + stage, width / 2, height / 2 - 200);
    textAlign(LEFT);
  }
}

// ---------------- GAME OVER ----------------
function displayGameOver() {
  if (themeSound.isPlaying()) {
    themeSound.stop();
  }
  fill(255, 0, 0);
  textSize(40);
  textAlign(CENTER);
  text("GAME OVER", width / 2, height / 2);

  textSize(20);
  // Show distance reached
  text(
    "Distance Reached: " + floor(distance) + " m",
    width / 2,
    height / 2 + 40,
  );

  // Optional: you can also still show time if you want
  text("Time Survived: " + timer.toFixed(1) + " s", width / 2, height / 2 + 70);

  text("Refresh to Restart", width / 2, height / 2 + 100);
}

// ---------------- STAGE ----------------
function updateStage() {
  if (stage < stageGoals.length - 1 && distance >= stageGoals[stage]) {
    stage++;
    stageMessageTimer = 120; // show message for 2 seconds
  }

  if (stageMessageTimer > 0) {
    stageMessageTimer--;
  }
}

// ---------------- PLAYER ----------------
class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 100;
    this.w = 50;
    this.h = 80;
    this.speed = 5;
    this.rotation = 0;
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
      this.rotation = -10;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
      this.rotation = 10;
    } else {
      this.rotation = 0;
    }

    if (keyIsDown(UP_ARROW)) this.speed = 8;
    else this.speed = 5;

    // inside Player.update()
    let leftLimit = 150 + this.w / 2; // left road edge + half player width
    let rightLimit = 450 - this.w / 2; // right road edge - half player width
    this.x = constrain(this.x, leftLimit, rightLimit);
  }

  display() {
    imageMode(CENTER);
    image(playerImg, this.x, this.y, this.w, this.h);
  }
}

// ---------------- OBSTACLE ----------------
class Obstacle {
  constructor() {
    this.w = 60;
    this.h = 90;

    this.x = random(170, 430);
    this.y = -50;
    this.speed = roadSpeed + random(1, 3);
    this.img = random(carImgs);
  }

  update() {
    this.y += this.speed;
  }

  display() {
    imageMode(CENTER);
    image(this.img, this.x + this.w / 2, this.y + this.h / 2, this.w, this.h);
  }

  hits(player) {
    return (
      this.x < player.x + player.w &&
      this.x + this.w > player.x &&
      this.y < player.y + player.h &&
      this.y + this.h > player.y
    );
  }
}
