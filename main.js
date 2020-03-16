// initial set up for the canvas and context
var canvas = document.getElementById("my_canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.focus();
var ctx = canvas.getContext("2d");
const fps = 30;
var frames = 0;

var lastFrame = (new Date()).getTime();

// initializing basic game parameters

var textures = {
  stone: new Texture("resources/ground/stone.png"),
  player: new Texture("resources/player/player01.png"),
  box: new Texture("resources/tile/box.png"),
  void: new Texture("resources/ground/void.png"),
  slime: [new Texture("resources/enemy/slime/explode.png")],
  main_back: new Texture("resources/gui/main_back.png"),
  coin: new Texture("resources/tile/coin.png"),
  valley_vertical: new Texture("resources/ground/valley/valley_vertical.png"),
  valley_horizontal: new Texture("resources/ground/valley/valley_horizontal.png")
};

var audios = {
  coin_sound: new Audio("resources/sound/coin.wav")
};

var size = { // important sizes
  // tile count in each direction
  x: 20,
  y: 10,
  tilesize: undefined,
  // top left tile offset from top left corner
  offset_x: undefined,
  offset_y: undefined
};

var player = {
  x: size.x/2,
  y: size.y/2,
  width: 0.4,
  height: 0.1,
  moveSpeed: 3 / fps,
  coins: 0
};
var enemies = [];
var drawables = [];
var world = [];

// is run when page finishes loading
function setup() {
  // load animated textures
  for (var i = 1; i <= 6; i++) {
    textures.slime[i] = new Texture("resources/enemy/slime/0" + i + ".png");
  }

  setUpInputTracking(canvas); // tracks key and mouse inputs.
  /*
    mouseButtons = [left, middle, right], all boolean
    keys[key], example usage: if (keys["w"]) {...}
    mousex, mousey - mouse positions relative to the CANVAS, if mouse is outside canvas, it will still show valid coordinates
  */

  // initialize world
  setupWorld(size);

  waitUntil(function() {
    return Texture.total_to_load == Texture.total_loaded
  }, function() {
    size.tilesize = Math.min(1534 * canvas.width / textures.main_back.img.width / size.x, 692 * canvas.height / textures.main_back.img.height / size.y);
    size.offset_x = 32 * canvas.width / textures.main_back.img.width + 0.5 * (1534 * canvas.width / textures.main_back.img.width - size.tilesize * size.x);
    size.offset_y = 32 * canvas.height / textures.main_back.img.height;
    console.log(canvas.height, textures.main_back.img.width, size.x);

    setInterval(loop, 1000/fps);
  });
}

function loop() {
  var input = getInputVector("w", "a", "s", "d"); // get player movements based on wasd, a normalized vector

  movePlayer(input, player.moveSpeed);
  for (var i = 0; i < enemies.length; i++) {
    moveEntity(enemies[i], enemies[i].control(), enemies[i].speed);
  }
  loopWorld(size, function(i, j) {
    if (isEntity(world[i][j].ground)) {
      world[i][j].ground.control(i, j);
    }
    if (isEntity(world[i][j].tile)) {
      world[i][j].tile.control(i, j);
    }
  });

  drawWorld(size);
  drawPlayer();
  drawSlimes();
  addDrawable(textures.main_back.img, 0, 0, canvas.width, canvas.height, 5*size.y);
  
  drawables.sort(function(a, b) {
    return a.z_offset - b.z_offset; 
  });

  ctx.beginPath();
  ctx.rect(32 * canvas.width / textures.main_back.img.width, size.offset_y, 1534 * canvas.width / textures.main_back.img.width, 692 * canvas.height / textures.main_back.img.height);
  ctx.fillStyle = "#282828";
  ctx.fill(); 

  drawables.forEach(function(val) {
    val.draw();
  });

  drawables = drawables.filter(function(val) {
    return val.time > 0;
  });
  
  enemies = enemies.filter(function(val) {
    return !val.death;
  });
  
  lastFrame = (new Date()).getTime();
  frames++;
}

function drawPlayer() {
  addDrawable(textures.player.img, 
    size.offset_x + player.x*size.tilesize - 0.5*(size.tilesize - player.width * size.tilesize),
    size.offset_y + player.y*size.tilesize - (size.tilesize * textures.player.img.height / textures.player.img.width - player.height * size.tilesize),
    size.tilesize,
    size.tilesize * textures.player.img.height / textures.player.img.width,
    player.y + size.y + player.height
    );
}

function movePlayer(movementDirection, force) {
  moveEntity(player, movementDirection, force);
}

function setupWorld(size) {
  loopWorld(size, function(i, j) {
    world[i][j] = {
      ground: new Stone(),
      tile: undefined
    };

    if (distance(player.x, player.y, i, j) > 2 && getProperty(world[i][j].ground, "name") === "stone") {
      if (chance(15)) {
        world[i][j].tile = new Coin();
      }
      if (j == 0 || i % 2 == 0 && j % 2 == 0 || i % 2 == 0 && j % 2 == 1 && chance(25) || i % 2 == 1 && j % 2 == 0 && chance(25)) {
        world[i][j].ground = new Valley();
      }
    }
  }, function(i) {
    world[i] = [];
  });

  world[0][0].ground.filled = true;
  world[0][0].ground.depth = 0;

  var generateEnemyCount = 5;
  while (generateEnemyCount > 0) {
    var i = randomInt(0, size.x);
    var j = randomInt(0, size.y);
    if (!isSolid(world[i][j].tile) && !isSolid(world[i][j].ground) && distance(player.x, player.y, i, j) > 2) {
      enemies.push(new Slime(i + 0.5, j + 0.5));
      generateEnemyCount--
    }
  }
}