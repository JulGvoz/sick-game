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
      false
    );
  }
}

class Box extends Tile {
  constructor() {
    super("box", true);
  }
}