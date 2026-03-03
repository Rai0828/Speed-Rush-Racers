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
    image(this.img, this.x, this.y, this.w, this.h);
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
