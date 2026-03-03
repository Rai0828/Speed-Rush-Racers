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
let nameInput, playButton;
let playerName = "";
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
  let cnv = createCanvas(600, 800);
  cnv.parent(document.body); // attach canvas to body
  cnv.style("display", "block");
  cnv.style("margin", "0 auto"); // center horizontally
  player = new Player();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  // Store a reference to the canvas
  canvasEl = cnv.elt; // .elt gives the raw HTML element
}
function draw() {
  background(50);

  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "enterName") {
    drawEnterNameScreen();
  } else if (gameState === "playing") {
    playGame();
  } else if (gameState === "gameOver") {
    displayGameOver();
  } else if (gameState === "showLeaderboard") {
    drawLeaderboardScreen();
  }
}

function drawEnterNameScreen() {
  background(0);
  fill(255);
  textSize(36);
  textAlign(CENTER, CENTER);
  text("Enter Your Name", width / 2, height / 2 - 50);

  // Create input and button only once
  if (!nameInput) {
    nameInput = createInput();
    nameInput.size(200);
    nameInput.position(
      canvasEl.offsetLeft + width / 2 - 100,
      canvasEl.offsetTop + height / 2,
    );

    playButton = createButton("PLAY");
    playButton.size(80, 40);
    playButton.position(
      canvasEl.offsetLeft + width / 2 - 40,
      canvasEl.offsetTop + height / 2 + 60,
    );

    playButton.mousePressed(() => {
      playerName = nameInput.value().trim();
      if (playerName === "") playerName = "Player"; // default name if empty
      nameInput.remove();
      playButton.remove();
      nameInput = null;
      playButton = null;

      gameState = "playing";

      // Start theme music
      if (!themeSound.isPlaying()) themeSound.loop();
    });
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

  // Leaderboard button
  fill(0, 0, 200);
  rect(width / 2, height / 2 + 130, 200, 60, 10);
  fill(255);
  textSize(32);
  text("LEADERBOARD", width / 2, height / 2 + 130);
}

// Detect click for the START button
function mousePressed() {
  if (gameState === "start") {
    // START button
    if (
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > height / 2 + 20 &&
      mouseY < height / 2 + 80
    ) {
      gameState = "enterName"; // move to name input screen
      return; // stop further checks
    }

    // LEADERBOARD button
    if (
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > height / 2 + 100 &&
      mouseY < height / 2 + 160
    ) {
      gameState = "showLeaderboard";
      return;
    }
  }

  if (gameState === "gameOver") {
    // RESTART button
    if (
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > height / 2 + 70 &&
      mouseY < height / 2 + 130
    ) {
      restartGame();
      return;
    }
  }

  if (gameState === "showLeaderboard") {
    // Back button on leaderboard
    if (
      mouseX > width / 2 - 75 &&
      mouseX < width / 2 + 75 &&
      mouseY > height - 105 &&
      mouseY < height - 55
    ) {
      gameState = "start";
      return;
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
  text("GAME OVER", width / 2, height / 2 - 50);

  textSize(20);
  // Show distance reached
  text("Distance Reached: " + floor(distance) + " m", width / 2, height / 2);

  // Show time survived
  text("Time Survived: " + timer.toFixed(1) + " s", width / 2, height / 2 + 30);

  // ---------------- RESTART BUTTON ----------------
  let buttonY = height / 2 + 100; // move it lower to avoid overlapping

  // Hover effect
  if (
    mouseX > width / 2 - 100 &&
    mouseX < width / 2 + 100 &&
    mouseY > buttonY - 30 &&
    mouseY < buttonY + 30
  ) {
    fill(0, 255, 0); // brighter on hover
  } else {
    fill(0, 200, 0);
  }

  rect(width / 2, buttonY, 200, 60, 10);

  fill(255);
  textSize(32);
  text("RESTART", width / 2, buttonY);
}
function restartGame() {
  gameState = "playing";
  gameOver = false;
  timer = 0;
  distance = 0;
  stage = 1;
  stageMessageTimer = 0;
  obstacles = [];
  roadSpeed = 4;
  spawnRate = 90;

  player.x = width / 2;
  player.y = height - 100;

  if (nameInput) {
    nameInput.remove();
    nameInput = null;
  }
  if (playButton) {
    playButton.remove();
    playButton = null;
  }

  if (!themeSound.isPlaying()) themeSound.loop();
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
    stroke(255, 0, 0);
    noFill();
    rect(this.x, this.y, this.w * 0.4, this.h * 0.4);
    noStroke();
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
    image(this.img, this.x, this.y, this.w, this.h); // remove +this.w/2, +this.h/2

    // Optional: draw hitbox for debugging
    stroke(255, 0, 0);
    noFill();
    rect(this.x, this.y, this.w * 0.6, this.h * 0.6); // match hits()
    noStroke();
  }

  hits(player) {
    let playerHitW = player.w * 0.6;
    let playerHitH = player.h * 0.6;

    let obstacleHitW = this.w * 0.6;
    let obstacleHitH = this.h * 0.6;

    return (
      abs(this.x - player.x) < (playerHitW + obstacleHitW) / 2 &&
      abs(this.y - player.y) < (playerHitH + obstacleHitH) / 2
    );
  }
}
