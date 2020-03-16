class Coin extends TileEntity {
  constructor() {
    super(
      function(i, j) {
        return "coin";
      },
      function(i, j) {
        if (distance(player.x, player.y, i, j) < 1) {
          player.coins++;
          console.log(player.coins);
          world[i][j].tile = undefined;
        }
      },
      false
    );
  }
}