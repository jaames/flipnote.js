import { dataStream } from "../flipnote";
import { ByteArray } from "../utils/byteArray";
import { LZWEncoder } from "./lzw";

export default class GifEncoder {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.delay = 100;
    // -1 = no repeat, 0 = forever. anything else is repeat count
    this.repeat = -1;
    this.colorDepth = 8;
    this.palette = [];
    this.data = new ByteArray();
  }

  static fromFlipnote(flipnote) {
    const format = flipnote.constructor;
    const gif = new GifEncoder(format.width, format.height);
    gif.palette = format.globalPalette.flat();
    gif.delay = 100 / flipnote.framerate
    gif.repeat = flipnote.meta.loop ? -1 : 0;
    gif.init();
    for (let frameIndex = 0; frameIndex < flipnote.frameCount; frameIndex++) {
      gif.writeFrame(flipnote.getFramePixels(frameIndex, true));
    }
    return gif;
  }

  static fromFlipnoteFrame(flipnote, frameIndex) {
    const format = flipnote.constructor;
    const gif = new GifEncoder(format.width, format.height);
    gif.palette = format.globalPalette.flat();
    gif.delay = 100 / flipnote.framerate
    gif.repeat = flipnote.meta.loop ? -1 : 0;
    gif.init();
    gif.writeFrame(flipnote.getFramePixels(frameIndex, true));
    return gif;
  }

  init() {
    let paletteSize = this.palette.length / 3;
    for (var p = 1; 1 << p < paletteSize; p += 1) {
      continue;
    }
    this.colorDepth = p;
    this.writeHeader();
    this.writeColorTable();
    this.writeNetscapeExt();
  }

  writeHeader() {
    const header = new dataStream(new ArrayBuffer(13));
    header.writeUtf8("GIF89a");
    // Logical Screen Descriptor
    header.writeUint16(this.width);
    header.writeUint16(this.height);
    header.writeUint8(
      0x80 | // 1 : global color table flag = 1 (gct used)
      (this.colorDepth - 1) // 6-8 : gct size
    );
    header.writeUint8(0);
    header.writeUint8(0);
    this.data.writeBytes(new Uint8Array(header.buffer));
  }

  writeColorTable() {
    const palette = new Uint8Array(3 * Math.pow(2, this.colorDepth));
    palette.set(this.palette, 0);
    this.data.writeBytes(palette);
  }

  writeGraphicsControlExt() {
    const graphicsControlExt = new dataStream(new ArrayBuffer(8));
    graphicsControlExt.writeBytes([
      0x21, // extension introducer
      0xF9, // graphic control label
      4, // block size
      0 // bitfield
    ]);
    graphicsControlExt.writeUint16(this.delay); // loop flag
    graphicsControlExt.writeBytes([
      0,
      0
    ]);
    this.data.writeBytes(new Uint8Array(graphicsControlExt.buffer));
  }

  writeNetscapeExt() {
    const netscapeExt = new dataStream(new ArrayBuffer(19));
    netscapeExt.writeBytes([
      0x21, // extension introducer
      0xFF, // app extension label
      11, // block size
    ]);
    netscapeExt.writeUtf8('NETSCAPE2.0');
    netscapeExt.writeUint8(3); // subblock size
    netscapeExt.writeUint8(1); // loop subblock id
    netscapeExt.writeUint16(this.repeat); // loop flag
    this.data.writeBytes(new Uint8Array(netscapeExt.buffer));
  }

  writeImageDesc() {
    const desc = new dataStream(new ArrayBuffer(10));
    desc.writeUint8(0x2C);
    desc.writeUint16(0); // image left
    desc.writeUint16(0); // image top
    desc.writeUint16(this.width);
    desc.writeUint16(this.height);
    desc.writeUint8(0);
    this.data.writeBytes(new Uint8Array(desc.buffer));
  }

  writePixels(pixels) {
    const lzw = new LZWEncoder(this.width, this.height, pixels, this.colorDepth);
    lzw.encode(this.data);
  }

  writeFrame(pixels) {
    this.writeGraphicsControlExt();
    this.writeImageDesc();
    this.writePixels(pixels);
  }

  getBuffer() {
    return this.data.getBuffer();
  }

  getBlob() {
    return new Blob([this.getBuffer()], {type: "image/gif"})
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