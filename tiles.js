class Coin extends TileEntity {
  constructor() {
    super(
      function(i, j) {
        return "coin";
      },
      function(i, j) {
        if (distance(player.x, player.y, i + 0.5, j + 0.5) < 0.5) {
          player.coins++;
          console.log(player.coins);
          world[i][j].tile = undefined;
          var coinSoundCopy = audios.coin_sound.cloneNode(true);
          coinSoundCopy.volume = 0.3;
          coinSoundCopy.play();
        }
      },
      "coin",
      false
    );
  }
}

class Box extends Tile {
  constructor() {
    super("box", "box", true);
  }
}

class Stone extends Ground {
  constructor() {
    super("stone", "stone", false);
  }
}

class Valley extends GroundEntity {
  constructor() {
    super(
      function(i, j) {
        var s = "";
        if (this.depth > -1) {
          s = "_water";
        }
        if (j == 0 || getProperty(world[i][j - 1].ground, "name") == "stone") {
          return "valley_horizontal" + s;
        } else {
          return "valley_vertical" + s;
        }
      },
      function(i, j) {
        var self = this;
        var hasSource = self.depth == 0;
        loopCardinalNeighbours(i, j, function(x, y) { // check neighbours if water flows into this valley
          if (getProperty(world[x][y].ground, "name") == "valley") {
            hasSource = hasSource || (world[x][y].ground.depth + 1 == self.depth);
          }
        });

        if (hasSource) { // can only spread water if water is coming in
          this.solid = true;
          //console.log(this);
          //debugger;
          loopCardinalNeighbours(i, j, 
            function(x, y) { 
              if (getProperty(world[x][y].ground, "name") == "valley") {
                if (world[x][y].ground.depth == -1 || (world[x][y].ground.depth > self.depth + 1)) {
                  world[x][y].ground.depth = self.depth + 1;
                  world[x][y].ground.tickFn(x, y);
                }
              }
            });
        } else {
          this.depth = -1;
          this.solid = false;
        }

        return; // todo?
      },
      "valley",
      false
    );
    this.depth = -1;
  }
}