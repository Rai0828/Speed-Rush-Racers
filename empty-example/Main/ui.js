function drawStartScreen() {
  background(0);
  fill(255);
  textSize(60);
  text("Speed Rush Racers", width / 2, height / 2 - 100);

  textSize(24);
  text("Click START to begin!", width / 2, height / 2 - 50);

  fill(0, 200, 0);
  rect(width / 2, height / 2 + 50, 200, 60, 10);
  fill(255);
  textSize(32);
  text("START", width / 2, height / 2 + 50);

  fill(0, 0, 200);
  rect(width / 2, height / 2 + 130, 200, 60, 10);
  fill(255);
  text("LEADERBOARD", width / 2, height / 2 + 130);
}

function displayUI() {
  fill(255);
  textSize(20);
  textAlign(LEFT);
  text("Stage: " + stage, 50, 30);
  text("Distance: " + floor(distance) + " m", 50, 60);

  textAlign(RIGHT);
  text("Time: " + timer.toFixed(1) + " s", width - 50, 30);

  textAlign(LEFT);

  let start = stageGoals[stage - 1];
  let end = stageGoals[stage] || stageGoals[stage - 1];
  let progress = map(distance, start, end, 0, 200);

  fill(80);
  rectMode(CORNER);
  rect(50, 80, 200, 20);

  fill(0, 255, 0);
  rect(50, 80, constrain(progress, 0, 200), 20);

  rectMode(CENTER);

  if (stageMessageTimer > 0) {
    fill(255, 255, 0);
    textSize(36);
    textAlign(CENTER);
    text("STAGE " + stage, width / 2, height / 2 - 200);
    textAlign(LEFT);
  }
}

function drawEnterNameScreen() {
  background(0);
  fill(255);
  textSize(36);
  textAlign(CENTER, CENTER);
  text("Enter Your Name", width / 2, height / 2 - 50);

  if (!nameInput) {
    nameInput = createInput();
    nameInput.size(200);
    nameInput.position(width / 2 - 100, height / 2);

    playButton = createButton("PLAY");
    playButton.size(80, 40);
    playButton.position(width / 2 - 40, height / 2 + 60);

    playButton.mousePressed(() => {
      playerName = nameInput.value().trim() || "Player";
      nameInput.remove();
      playButton.remove();
      nameInput = playButton = null;
      gameState = "playing";

      if (!themeSound.isPlaying()) themeSound.loop();
    });
  }
}

function displayGameOver() {
  if (themeSound.isPlaying()) themeSound.stop();

  fill(255, 0, 0);
  textSize(40);
  textAlign(CENTER);
  text("GAME OVER", width / 2, height / 2 - 50);

  textSize(20);
  text("Distance Reached: " + floor(distance) + " m", width / 2, height / 2);
  text("Time Survived: " + timer.toFixed(1) + " s", width / 2, height / 2 + 30);

  let buttonY = height / 2 + 100;
  fill(0, 200, 0);
  rect(width / 2, buttonY, 200, 60, 10);
  fill(255);
  textSize(32);
  text("RESTART", width / 2, buttonY);
}
