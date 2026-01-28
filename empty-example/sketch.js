let player;
let obstacles = [];
let roadSpeed = 4;
let spawnRate = 90;
let timer = 0;
let gameOver = false;

function setup() {
  createCanvas(600, 800);
  player = new Player();
}

function draw() {
  background(50);

  if (!gameOver) {
    timer += 1 / 60;

    drawRoad();
    handleDifficulty();

    player.update();
    player.display();

    if (frameCount % spawnRate === 0) {
      obstacles.push(new Obstacle());
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].update();
      obstacles[i].display();

      if (obstacles[i].hits(player)) {
        gameOver = true;
      }

      if (obstacles[i].y > height + 50) {
        obstacles.splice(i, 1);
      }
    }

    displayUI();
  } else {
    displayGameOver();
  }
}

function drawRoad() {
  fill(100);
  rect(150, 0, 300, height);

  stroke(255);
  strokeWeight(4);
  for (let y = 0; y < height; y += 40) {
    line(width / 2, y + ((frameCount * roadSpeed) % 40), width / 2, y + 20);
  }
  noStroke();
}

function handleDifficulty() {
  roadSpeed = 4 + timer * 0.1;
  spawnRate = max(30, 90 - timer * 2);
}

function displayUI() {
  fill(255);
  textSize(20);
  text("Time: " + timer.toFixed(1), 20, 30);
}

function displayGameOver() {
  fill(255, 0, 0);
  textSize(40);
  textAlign(CENTER);
  text("GAME OVER", width / 2, height / 2);
  textSize(20);
  text(
    "Time Survived: " + timer.toFixed(1) + " seconds",
    width / 2,
    height / 2 + 40,
  );
  text("Refresh to Restart", width / 2, height / 2 + 80);
}

// ---------------- PLAYER ----------------
class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 100;
    this.w = 40;
    this.h = 60;
    this.speed = 5;
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) this.x -= this.speed;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.speed;
    if (keyIsDown(UP_ARROW)) this.speed = 8;
    else this.speed = 5;

    this.x = constrain(this.x, 170, 430);
  }

  display() {
    fill(0, 150, 255);
    rect(this.x, this.y, this.w, this.h, 5);
  }
}

// ---------------- OBSTACLE ----------------
class Obstacle {
  constructor() {
    this.w = random(30, 50);
    this.h = random(40, 70);
    this.x = random(170, 430);
    this.y = -50;
    this.speed = roadSpeed + random(1, 3);
  }

  update() {
    this.y += this.speed;
  }

  display() {
    fill(255, 100, 100);
    rect(this.x, this.y, this.w, this.h);
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
