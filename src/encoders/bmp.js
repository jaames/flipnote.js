import dataStream from "utils/dataStream";

// round number to nearest multiple of n
export function roundToNearest(value, n) {
  return Math.ceil(value / n) * n;
}

// simple bitmap class for rendering images
// https://en.wikipedia.org/wiki/BMP_file_format

export default class BitmapRenderer {

  constructor(width, height, bpp) {
    this.width = width;
    this.height = height;
    this.vWidth = roundToNearest(width, 4);
    this.vHeight = roundToNearest(height, 4);
    this.bpp = bpp;
    this.fileHeader = new dataStream(new ArrayBuffer(14));
    this.fileHeader.writeUtf8("BM"); // "BM" file magic
    // using BITMAPV4HEADER dib header variant:
    this.dibHeader = new dataStream(new ArrayBuffer(108))
    this.dibHeader.writeUint32(108); // DIB header length
    this.dibHeader.writeInt32(width); // width
    this.dibHeader.writeInt32(height); // height
    this.dibHeader.writeUint16(1); // color panes (always 1)
    this.dibHeader.writeUint16(bpp); // bits per pixel
    this.dibHeader.writeUint32(3); // compression method (3 = BI_BITFIELDS for rgba, 0 = no compression for 8 bit)
    this.dibHeader.writeUint32((this.vWidth * this.height) / (bpp / 8)); // image data size, (width * height) / bits per pixel
    this.dibHeader.writeUint32(3780); // x res, pixel per meter
    this.dibHeader.writeUint32(3780); // y res, pixel per meter
    this.dibHeader.writeUint32(0); // the number of colors in the color palette, set by setPalette() method
    this.dibHeader.writeUint32(0); // the number of important colors used, or 0 when every color is important; generally ignored
    this.dibHeader.writeUint32(0x00FF0000); // red channel bitmask
    this.dibHeader.writeUint32(0x0000FF00); // green channel bitmask
    this.dibHeader.writeUint32(0x000000FF); // blue channel bitmask
    this.dibHeader.writeUint32(0xFF000000); // alpha channel bitmask
    this.dibHeader.writeUtf8("Win "); // LCS_WINDOWS_COLOR_SPACE "Win "
    /// rest can be left as nulls
  }

  setFilelength(value) {
    this.fileHeader.seek(2);
    this.fileHeader.writeUint32(value);
  }

  setPixelOffset(value) {
    this.fileHeader.seek(10);
    this.fileHeader.writeUint32(value);
  }

  setCompression(value) {
    this.fileHeader.seek(16);
    this.dibHeader.writeUint32(value);
  }

  setPaletteCount(value) {
    this.fileHeader.seek(32);
    this.dibHeader.writeUint32(value);
  }

  setPalette(paletteData) {
    let paletteLength = Math.pow(2, this.bpp);
    let palette = new Uint32Array(paletteLength);
    for (let index = 0; index < palette.length; index++) {
      palette[index] = paletteData[index % paletteData.length];
    }
    this.setPaletteCount(paletteLength); // set number of colors in DIB header
    this.setCompression(0); // set compression to 0 so we're not using 32 bit
    this.palette = palette;
  }

  setPixels(pixelData) {
    let pixels;
    let pixelsLength = this.vWidth * this.height;
    switch (this.bpp) {
      case 8:
        pixels = new Uint8Array(pixelsLength);
        break;
      case 32:
        pixels = new Uint32Array(pixelsLength);
        break;
    }
    // pixel rows are stored "upside down" in bmps
    let w = this.width;
    for (let y = 0; y < this.height; y++) {
      let srcOffset = (w * this.height) - ((y + 1) * w);
      let destOffset = (y * this.width);
      pixels.set(pixelData.slice(srcOffset, srcOffset + this.width), destOffset);
    }
    this.pixels = pixels;
  }

  getBlob() {
    let sections = [this.fileHeader.buffer, this.dibHeader.buffer];
    let headerByteLength = this.fileHeader.byteLength + this.dibHeader.byteLength;
    switch (this.bpp) {
      case 1:
      case 4:
      case 8:
        this.setFilelength(headerByteLength + this.pixels.byteLength + this.palette.byteLength);
        this.setPixelOffset(headerByteLength + this.palette.byteLength);
        sections = sections.concat([this.palette.buffer, this.pixels.buffer]);
        break;
      case 16:
      case 32:
        this.setFilelength(headerByteLength + this.pixels.byteLength);
        this.setPixelOffset(headerByteLength);
        sections = sections.concat([this.pixels.buffer]);
        break;
    }
    return new Blob(sections, {type: "image/bitmap"})
  }

  getUrl() {
    return window.URL.createObjectURL(this.getBlob());
  }

  getImage() {
    var img = new Image(this.width, this.height);
    img.src = this.getUrl();
    return img;
  }

}
