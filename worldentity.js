class Tile {
  constructor(textureName) {
    this.textureName = textureName
    this.entity = false;
    this.drawable = true;
  }

  draw(i, j) {
    addDrawable(
      textures[
        this.textureName
      ].img,
      size.offset_x + i*size.tilesize,
      size.offset_y + j*size.tilesize - textures[this.textureName].img.height * size.tilesize / textures[this.textureName].img.width + size.tilesize,
      size.tilesize,
      size.tilesize * textures[this.textureName].img.height / textures[this.textureName].img.width,
      j + size.y + 1
    );
  }
}

class TileEntity {
  constructor(drawFn, tickFn) {
    this.tickFn = tickFn;
    this.drawFn = drawFn;
    this.entity = true;
    this.drawable = true;
  }

  control(i, j) {
    this.tickFn(i, j);
    return [0, 0]; // Tile entities should NEVER move
  }

  draw(i, j) {
    addDrawable(
      textures[
        this.drawFn()
      ].img,
      size.offset_x + i*size.tilesize,
      size.offset_y + j*size.tilesize - textures[this.drawFn()].img.height * size.tilesize / textures[this.drawFn()].img.width + size.tilesize,
      size.tilesize,
      size.tilesize * textures[this.drawFn()].img.height / textures[this.drawFn()].img.width,
      j + size.y + 1
    );
  }
}

class Ground {
  constructor(textureName) {
    this.textureName = textureName;
    this.entity = false;
    this.drawable = true;
  }

  draw(i, j) {
    addDrawable(
      textures[
        this.textureName
      ].img,
      size.offset_x + i*size.tilesize,
      size.offset_y + j*size.tilesize,
      size.tilesize,
      size.tilesize * textures[this.textureName].img.height / textures[this.textureName].img.width,
      j + 1
    );
  }
}

class GroundEntity {
  constructor(drawFn, tickFn) {
    this.tickFn = tickFn;
    this.drawFn = drawFn;
    this.entity = true;
    this.drawable = true;
  }

  control(i, j) {
    this.tickFn(i, j);
    return [0, 0]; // Tile entities should NEVER move
  }

  draw(i, j) {
    addDrawable(
      textures[
        this.drawFn()
      ].img,
      size.offset_x + i*size.tilesize,
      size.offset_y + j*size.tilesize,
      size.tilesize,
      size.tilesize * textures[this.drawFn()].img.height / textures[this.drawFn()].img.width,
      j + 1
    );
  }
}