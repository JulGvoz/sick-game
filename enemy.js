class Slime {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isMoving = false;
    this.animationFrame = 1;
    this.type = "slime";
    this.animationTime = 0;
    this.maxAnimationTime = [0, 3, 3, 3, 3, 3, 3];
    this.width = 0.4;
    this.height = 0.4;
    this.jumpCooldown = random(8, 16);
    this.currentJumpTimer = 0;
    this.speed = random(1.5, 4) / fps;
    this.death = false;

    this.jumpDir = [0, 0];

    this.isJumping = false;
  }

  control() {
    // explosion control
    if (distance(player.x, player.y, this.x, this.y) < 0.35) {
      this.death = true;
      return [0, 0];
    }


    if (!this.isJumping) {
      this.currentJumpTimer += 30/fps;
      if (this.currentJumpTimer >= this.jumpCooldown) {
        this.isJumping = true;
        this.isMoving = true
        var movementVector = [player.x - this.x, player.y - this.y];
        this.jumpDir = normalizeVector(movementVector);
      }
    }
    
    // normalize movement
    if (this.isJumping && this.animationFrame >= 3 && this.animationFrame <= 5) {
      return this.jumpDir;
    } else {
      return [0, 0];
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
        this.isJumping = false;
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