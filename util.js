function normalizeVector(vec) {
  if (vectorLength(vec) > 0) {
    return vectorMult(vec, 1/vectorLength(vec));
}
  return [0, 0];
}

function vectorLength(vec = []) {
  var sum = 0;
  vec.forEach(function(val) {
    sum += val*val;
  });
  return Math.sqrt(sum);
}

function vectorMult(vec = [], scalar) {
  return vec.map(function(val) {
    return val*scalar;
  })
}

function loopWorld(size, fnInner, fnOuter = function(x) {return;}) {
  for (var i = 0; i < size.x; i++) {
    fnOuter(i);
    for (var j = 0; j < size.y; j++) {
      fnInner(i, j);
    }
  }
}

function rectCollides(x1, y1, w1, h1, x2, y2, w2, h2) {
  return (x1 < x2 + w2 && x1 + w1 > x2 &&
    y1 < y2 + h2 && y1 + h1 > y2) 
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(
    (x2 - x1)*(x2 - x1) +
    (y2 - y1)*(y2 - y1)
  );
}

function moveEntity(entity, movementDirection, force, it = 5) {
  if (it == 0) {
    return;
  }
  if (it > 1) {
    force = force * 0.5;
  }
  function checkCollisionEntity() {
    if (entity.x + entity.width > size.x || entity.x < 0 || entity.y + entity.height > size.y || entity.y < 0) {
      return true;
    }
    for (var i = Math.max(0, Math.floor(entity.x) - 1); i < Math.min(size.x, Math.ceil(entity.x) + 1); i++) {
      for (var j = Math.max(0, Math.floor(entity.y) - 1); j < Math.min(size.y, Math.ceil(entity.y) + 1); j++) {
        if (rectCollides(entity.x, entity.y, entity.width, entity.height, i, j, 1, 1) && (isSolid(world[i][j].tile) || isSolid(world[i][j].ground))) {
          return true;
        }
      }
    }
    return false;
  }
  entity.x += movementDirection[0]*force;
  if (checkCollisionEntity()) {
    entity.x -= movementDirection[0]*force;
  }
  entity.y += movementDirection[1]*force;
  if (checkCollisionEntity()) {
    entity.y -= movementDirection[1]*force;
  }
  moveEntity(entity, movementDirection, force, it - 1)
}

function waitUntil(fnPredicate, fnBody) {
  console.log("waiting")
  if (fnPredicate()) {
    fnBody();
  } else {
    setTimeout(waitUntil, 0, fnPredicate, fnBody);
  }
} 

function randomInt(min, max) {
  return Math.floor(random(min, max));
}

function random(min, max) {
  return min + Math.random()*(max - min);
}

function chance(percentage) {
  return Math.random() < percentage/100;
}