import { DataStream } from '../utils/dataStream';
import { Flipnote } from '../parsers/index';

// round number to nearest multiple of n
export function roundToNearest(value: number, n: number) {
  return Math.ceil(value / n) * n;
}

// simple bitmap class for rendering images
// https://en.wikipedia.org/wiki/BMP_file_format

export class BitmapEncoder {

  public width: number;
  public height: number;
  public bpp: number;

  private vWidth: number;
  private vHeight: number;
  private fileHeader: DataStream;
  private dibHeader: DataStream;
  private palette: Uint32Array;
  private pixels: Uint8Array | Uint32Array;

  constructor(width: number, height: number, bpp: number) {
    this.width = width;
    this.height = height;
    this.vWidth = roundToNearest(width, 4);
    this.vHeight = roundToNearest(height, 4);
    this.bpp = bpp;
    this.fileHeader = new DataStream(new ArrayBuffer(14));
    this.fileHeader.writeChars('BM'); // 'BM' file magic
    // using BITMAPV4HEADER dib header variant:
    this.dibHeader = new DataStream(new ArrayBuffer(108))
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
    this.dibHeader.writeChars('Win '); // LCS_WINDOWS_COLOR_SPACE 'Win '
    /// rest can be left as nulls
  }

  static fromFlipnoteFrame(flipnote: Flipnote, frameIndex: number) {
    const bmp = new BitmapEncoder(flipnote.width, flipnote.height, 8);
    bmp.setPixels(flipnote.getFramePixels(frameIndex));
    bmp.setPalette(flipnote.getFramePalette(frameIndex));
    return bmp;
  }

  setFilelength(value: number) {
    this.fileHeader.seek(2);
    this.fileHeader.writeUint32(value);
  }

  setPixelOffset(value: number) {
    this.fileHeader.seek(10);
    this.fileHeader.writeUint32(value);
  }

  setCompression(value: number) {
    this.dibHeader.seek(16);
    this.dibHeader.writeUint32(value);
  }

  setPaletteCount(value: number) {
    this.dibHeader.seek(32);
    this.dibHeader.writeUint32(value);
  }

  setPalette(colors: number[][]) {
    let palette = new Uint32Array(Math.pow(2, this.bpp));
    for (let index = 0; index < colors.length; index++) {
      let color = colors[index % colors.length];
      // bmp color order is ARGB
      palette[index] = 0xFF000000 | (color[0] << 16) | (color[1] << 8) | (color[2]);
    }
    this.setPaletteCount(palette.length); // set number of colors in DIB header
    this.setCompression(0); // set compression to 0 so we're not using 32 bit
    this.palette = palette;
  }

  setPixels(pixelData: Uint8Array) {
    let pixels: Uint8Array | Uint32Array;
    let pixelsLength = this.vWidth * this.height;
    switch (this.bpp) {
      case 8:
        pixels = new Uint8Array(pixelsLength);
        break;
      case 32:
        pixels = new Uint32Array(pixelsLength);
        break;
    }
    // pixel rows are stored 'upside down' in bmps
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
    return new Blob(sections, {type: 'image/bitmap'});
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
