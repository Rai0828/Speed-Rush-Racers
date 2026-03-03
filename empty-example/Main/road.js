function drawRoad() {
  fill(100);
  rect(width / 2, height / 2, 300, height);

  stroke(255);
  strokeWeight(4);
  let dashLength = 20;
  let gap = 20;
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
