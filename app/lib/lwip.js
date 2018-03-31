const ImageJS = require("imagejs");
const Stream = require("stream");

function Image() {
  this.bitmap = new ImageJS.Bitmap();
}
Image.prototype.resize = function(width, height, _, cb) {
  let img = new Image();
  img.bitmap = this.bitmap.resize({
    width: width,
    height: height,
    algorithm: "nearestNeighbor"
  });
  cb(null, img);
};
Image.prototype.crop = function(x, y, x2, y2, cb) {
  let img = new Image();
  img.bitmap = this.bitmap.crop({
    top: y,
    left: x,
    width: x2 - x + 1,
    height: y2 - y + 1
  });
  cb(null, img);
};
Image.prototype.width = () => this.bitmap.width();
Image.prototype.height = () => this.bitmap.height();
Image.prototype.toBuffer = function(_, __, cb) {
  let converter = new Stream.Writable();
  converter.data = [];
  converter._write = function(chunk, _, cb) {
    this.data.push(chunk);
    cb();
  };
  converter.on("finish", function() {
    cb(null, Buffer.concat(this.data));
  });
  this.bitmap.write(converter, {
    type: ImageJS.ImageType.PNG
  });
};
module.exports = {
  open: function(path, _, callback) {
    let img = new Image();
    img.bitmap
      .readFile(path)
      .then(() => callback(null, img), e => callback(e, null));
  }
};
