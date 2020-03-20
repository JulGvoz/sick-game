class Texture {
  constructor(file_name, solid = false) {
      this.file_name = file_name;
      this.img = new Image();
      Texture.total_to_load++;
      this.img.onload = function (event) {
          Texture.total_loaded++;
      }
      this.img.src = this.file_name;
      this.solid = solid;
  }
}

class DrawObject {
  constructor(img, x, y, sx, sy, z_offset, time) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.sx = sx;
    this.sy = sy;
    this.z_offset = z_offset;
    this.time = time;
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.sx, this.sy);
    this.time--;
  }
}

class TextDrawObject extends DrawObject {
  constructor(text, color, x, y, sx, sy, z_offset, time = 1) {
    super(undefined, x, y, sx, sy, z_offset, time);
    // debugger;
    this.color = color;

    this.text = text;
  }

  draw() {
    // console.log(this.text)
    
    ctx.font = Math.floor(this.sy) + "px Arial";
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y, this.sx);
  }
}

function addDrawable(img, x, y, sx, sy, z_offset, time = 1) {
  drawables.push(new DrawObject(img, x, y, sx, sy, z_offset, time));
}

function addCustomDrawable(drawable) {
  drawables.push(drawable);
}

Texture.total_loaded = 0;
Texture.total_to_load = 0;