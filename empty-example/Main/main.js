function preload() {
  preloadAssets(); // from assets.js
}

function setup() {
  createCanvas(600, 800);
  player = new Player();
}

function draw() {
  background(50);

  if (gameState === "start") drawStartScreen();
  else if (gameState === "enterName") drawEnterNameScreen();
  else if (gameState === "playing") playGame();
  else if (gameState === "gameOver") displayGameOver();
}

function playGame() {
  timer += 1 / 60;
  distance += roadSpeed * 0.05;
  updateStage();
  drawRoad();
  handleDifficulty();

  player.update();
  player.display();

  if (frameCount % floor(spawnRate) === 0) obstacles.push(new Obstacle());

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].display();
    if (obstacles[i].hits(player)) {
      gameOver = true;
      gameState = "gameOver";
    }
    if (obstacles[i].y > height + 50) obstacles.splice(i, 1);
  }

  displayUI();
}

function mousePressed() {
  // Implement START/LEADERBOARD/RESTART buttons here if needed
}
