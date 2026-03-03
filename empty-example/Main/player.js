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
    if (keyIsDown(LEFT_ARROW)) this.x -= this.speed;
    else if (keyIsDown(RIGHT_ARROW)) this.x += this.speed;
    else this.rotation = 0;

    if (keyIsDown(UP_ARROW)) this.speed = 8;
    else this.speed = 5;

    let leftLimit = 150 + this.w / 2;
    let rightLimit = 450 - this.w / 2;
    this.x = constrain(this.x, leftLimit, rightLimit);
  }

  display() {
    imageMode(CENTER);
    image(playerImg, this.x, this.y, this.w, this.h);
  }
}
