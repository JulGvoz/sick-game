class Slime {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isMoving = false;
    this.animationFrame = 1;
    this.type = "slime";
    this.animationTime = 0;
    this.maxAnimationTime = [0, 5, 5, 4, 7, 4, 5];
    this.width = 0.4;
    this.height = 0.4;
    this.jumpCooldown = 10;
    this.currentJumpTimer = 0;
    this.speed = 6 / fps;
    this.death = false;
  }

  control() {
    if (distance(player.x, player.y, this.x, this.y) < 0.35) {
      this.death = true;
      return [0, 0];
    }
    if (this.currentJumpTimer < this.jumpCooldown) {
      this.currentJumpTimer += 30/fps;
      return [0, 0];
    } else {
      this.isMoving = true
      this.currentJumpTimer = 0;
      var movementVector = [player.x - this.x, player.y - this.y];
      // normalize movement
      if (this.animationFrame >= 3 && this.animationFrame <= 5) {
        return vectorMult(movementVector, 1 / vectorLength(movementVector));
      } else {
        return [0, 0];
      }
      
    }
  }

  draw() {
    if (this.death) {
      addDrawable(
        textures.slime[0].img,
        size.offset_x + this.x * size.tilesize - 0.5*(size.tilesize - this.width * size.tilesize),
        size.offset_y + this.y * size.tilesize - (size.tilesize - this.height * size.tilesize),
        size.tilesize,
        size.tilesize,
        this.y + size.y + this.height,
        4
      );
      return;
    }
    addDrawable(
      textures.slime[this.animationFrame].img,
      size.offset_x + this.x * size.tilesize - 0.5*(size.tilesize - this.width * size.tilesize),
      size.offset_y + this.y * size.tilesize - (size.tilesize - this.height * size.tilesize),
      size.tilesize,
      size.tilesize,
      this.y + size.y + this.height
    );
    if (this.isMoving || this.animationFrame > 1 || this.animationTime > 0) {
      this.isMoving = false;
      this.animationTime += 30/fps;
      if (this.animationTime >= this.maxAnimationTime[this.animationFrame]) {
        this.animationFrame++;
        this.animationTime = 0;
      }
      
      if (this.animationFrame > 6) {
        this.animationFrame = 1;
        this.animationTime = 0;
        this.currentJumpTimer = 0;
      }
    }
  }
}

function drawSlimes() {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].type == "slime") {
      enemies[i].draw();
    }
  }
}