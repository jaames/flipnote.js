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
    this.fileHeader = new DataView(new ArrayBuffer(14));
    this.fileHeader.setUint16(0, 0x424D); // "BM" file magic
    // using BITMAPV4HEADER dib header variant:
    this.dibHeader = new DataView(new ArrayBuffer(108));
    this.dibHeader.setUint32(0, 108, true); // DIB header length
    this.dibHeader.setInt32(4, width, true); // width
    this.dibHeader.setInt32(8, height, true); // height
    this.dibHeader.setUint16(12, 1, true); // color panes (always 1)
    this.dibHeader.setUint16(14, bpp, true); // bits per pixel
    this.dibHeader.setUint32(16, 3, true); // compression method (3 = BI_BITFIELDS for rgba, 0 = no compression for 8 bit)
    this.dibHeader.setUint32(20, (this.vWidth * this.height) / (bpp / 8), true); // image data size, (width * height) / bits per pixel
    this.dibHeader.setUint32(24, 3780, true); // x res, pixel per meter
    this.dibHeader.setUint32(28, 3780, true); // y res, pixel per meter
    this.dibHeader.setUint32(32, 0, true); // the number of colors in the color palette, set by setPalette() method
    this.dibHeader.setUint32(36, 0, true); // the number of important colors used, or 0 when every color is important; generally ignored
    this.dibHeader.setUint32(40, 0x00FF0000, true); // red channel bitmask
    this.dibHeader.setUint32(44, 0x0000FF00, true); // green channel bitmask
    this.dibHeader.setUint32(48, 0x000000FF, true); // blue channel bitmask
    this.dibHeader.setUint32(52, 0xFF000000, true); // alpha channel bitmask
    this.dibHeader.setUint32(56, 0x206E6957, true); // LCS_WINDOWS_COLOR_SPACE, little-endian "Win "
    /// rest can be left as nulls
  }

  setFilelength(value) {
    this.fileHeader.setUint32(2, value, true);
  }

  setPixelOffset(value) {
    this.fileHeader.setUint32(10, value, true);
  }

  setCompression(value) {
    this.dibHeader.setUint32(16, value, true);
  }

  setPaletteCount(value) {
    this.dibHeader.setUint32(32, value, true);
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
