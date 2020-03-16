var mouseButtons = [false, false, false];
var mousex = 0;
var mousey = 0;
var keys = [];

function mouseDown(event) {
  mouseButtons[event.button] = true;
}

function mouseUp(event) {
  mouseButtons[event.button] = false;
}


function keyDown(event) {
  keys[event.key] = true;
}

function keyUp(event) {
  keys[event.key] = false;
}

function setUpInputTracking(canvas) {
  canvas.addEventListener("keydown", keyDown);
  canvas.addEventListener("keyup", keyUp);

  canvas.addEventListener("mousedown", mouseDown);
  canvas.addEventListener("mouseup", mouseUp);

  canvas.addEventListener("mousemove", function() {
    if (event.pageX == null && event.clientX != null) {
      eventDoc = (event.target && event.target.ownerDocument) || document;
      doc = eventDoc.documentElement;
      body = eventDoc.body;

      event.pageX = event.clientX +
        (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
        (doc && doc.clientLeft || body && body.clientLeft || 0);
      event.pageY = event.clientY +
        (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
        (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }

    mousex = event.pageX - canvas.offsetLeft;
    mousey = event.pageY - canvas.offsetTop;
  });
}

function getInputVector(up, left, down, right) {
  var vector = [0, 0];
  vector[1] -= 1 ? keys[up] == true: 0;
  vector[0] -= 1 ? keys[left] == true: 0;
  vector[1] += 1 ? keys[down] == true: 0;
  vector[0] += 1 ? keys[right] == true: 0;

  return normalizeVector(vector);
}