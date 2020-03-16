class Tile {
  constructor(textureName, name, solid = false) {
    this.textureName = textureName
    this.name = name;
    this.entity = false;
    this.drawable = true;
    this.solid = solid;
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
  constructor(drawFn, tickFn, name, solid = false) {
    this.tickFn = tickFn;
    this.drawFn = drawFn;
    this.entity = true;
    this.drawable = true;
    this.solid = solid;
    this.name = name;
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
      size.offset_y + j*size.tilesize - textures[this.drawFn(i, j)].img.height * size.tilesize / textures[this.drawFn(i, j)].img.width + size.tilesize,
      size.tilesize,
      size.tilesize * textures[this.drawFn(i, j)].img.height / textures[this.drawFn(i, j)].img.width,
      j + size.y + 1
    );
  }
}

class Ground {
  constructor(textureName, name, solid = false) {
    this.textureName = textureName;
    this.entity = false;
    this.drawable = true;
    this.solid = solid;
    this.name = name;
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
  constructor(drawFn, tickFn, name, solid = false) {
    this.tickFn = tickFn;
    this.drawFn = drawFn;
    this.entity = true;
    this.drawable = true;
    this.solid = solid;
    this.name = name;
  }

  control(i, j) {
    this.tickFn(i, j);
    return [0, 0]; // Tile entities should NEVER move
  }

  draw(i, j) {
    addDrawable(
      textures[
        this.drawFn(i, j)
      ].img,
      size.offset_x + i*size.tilesize,
      size.offset_y + j*size.tilesize,
      size.tilesize,
      size.tilesize * textures[this.drawFn(i, j)].img.height / textures[this.drawFn(i, j)].img.width,
      j + 1
    );
  }
}

function drawWorld(size) {
  loopWorld(size, function(i, j) {
    if (world[i][j].ground !== undefined) {
      world[i][j].ground.draw(i, j);
    }
    if (world[i][j].tile !== undefined) {
      world[i][j].tile.draw(i, j);
    }
  });
}

function isSolid(world_object) {
  if (world_object === undefined) {
    return false;
  }
  return world_object.solid;
}

function isEntity(world_object) {
  if (world_object === undefined) {
    return false;
  }
  return world_object.entity;
}