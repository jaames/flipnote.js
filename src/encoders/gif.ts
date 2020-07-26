import { DataStream, ByteArray } from '../utils/index';
import { LZWEncoder } from './lzw';
import { Flipnote } from '../parsers/index';

export interface GifEncoderMeta {
  transparentBg: boolean;
  delay: number;
  colorDepth: number;
  // -1 = no repeat, 0 = forever. anything else is repeat count
  repeat: number;
};

export type GifEncoderPartialMeta = Partial<GifEncoderMeta>;

export class GifEncoder {

  static defaultMeta: GifEncoderMeta = {
    transparentBg: false,
    delay: 100,
    repeat: -1,
    colorDepth: 8
  };

  public width: number;
  public height: number;
  public palette: number[][] = [];
  public data: ByteArray;
  public meta: GifEncoderMeta;

  constructor(width: number, height: number, meta: GifEncoderPartialMeta = {}) {
    this.width = width;
    this.height = height;
    this.data = new ByteArray();
    this.meta = { ...GifEncoder.defaultMeta, ...meta };
  }

  static fromFlipnote(flipnote: Flipnote, gifMeta: GifEncoderPartialMeta = {}) {
    const gif = new GifEncoder(flipnote.width, flipnote.height, {
      delay: 100 / flipnote.framerate,
      repeat: flipnote.meta.loop ? -1 : 0,
      ...gifMeta
    });
    gif.palette = flipnote.globalPalette;
    gif.init();
    for (let frameIndex = 0; frameIndex < flipnote.frameCount; frameIndex++) {
      gif.writeFrame(flipnote.getFramePixels(frameIndex));
    }
    return gif;
  }

  static fromFlipnoteFrame(flipnote: Flipnote, frameIndex: number, gifMeta: GifEncoderPartialMeta = {}) {
    const gif = new GifEncoder(flipnote.width, flipnote.height, {
      // TODO: look at ideal delay and repeat settings for single frame GIF
      delay: 100 / flipnote.framerate,
      repeat: -1,
      ...gifMeta,
    });
    gif.palette = flipnote.globalPalette;
    gif.init();
    gif.writeFrame(flipnote.getFramePixels(frameIndex));
    return gif;
  }

  init() {
    const paletteSize = this.palette.length;
    // calc colorDepth
    for (var p = 1; 1 << p < paletteSize; p += 1)
      continue;
    this.meta.colorDepth = p;
    this.writeHeader();
    this.writeColorTable();
    this.writeNetscapeExt();
  }

  writeHeader() {
    const header = new DataStream(new ArrayBuffer(13));
    header.writeChars('GIF89a');
    // Logical Screen Descriptor
    header.writeUint16(this.width);
    header.writeUint16(this.height);
    header.writeUint8(
      0x80 | // 1 : global color table flag = 1 (gct used)
      (this.meta.colorDepth - 1) // 6-8 : gct size
    );
    header.writeBytes([
      0x0,
      0x0
    ]);
    this.data.writeBytes(new Uint8Array(header.buffer));
  }

  writeColorTable() {
    const palette = new Uint8Array(3 * Math.pow(2, this.meta.colorDepth));
    let offset = 0;
    for(let index = 0; index < this.palette.length; index += 1) {
      const [r, g, b, a] = this.palette[index];
      palette[offset++] = r;
      palette[offset++] = g;
      palette[offset++] = b;
    }
    this.data.writeBytes(palette);
  }

  writeGraphicsControlExt() {
    const graphicsControlExt = new DataStream(new ArrayBuffer(8));
    const transparentFlag = this.meta.transparentBg ? 0x1 : 0x0;
    graphicsControlExt.writeBytes([
      0x21, // extension introducer
      0xF9, // graphic control label
      0x4, // block size
      0x0 | transparentFlag // bitflags
    ]);
    graphicsControlExt.writeUint16(this.meta.delay); // loop flag
    graphicsControlExt.writeBytes([
      0x0,
      0x0
    ]);
    this.data.writeBytes(new Uint8Array(graphicsControlExt.buffer));
  }

  writeNetscapeExt() {
    const netscapeExt = new DataStream(new ArrayBuffer(19));
    netscapeExt.writeBytes([
      0x21, // extension introducer
      0xFF, // app extension label
      11, // block size
    ]);
    netscapeExt.writeChars('NETSCAPE2.0');
    netscapeExt.writeUint8(3); // subblock size
    netscapeExt.writeUint8(1); // loop subblock id
    netscapeExt.writeUint16(this.meta.repeat); // loop flag
    this.data.writeBytes(new Uint8Array(netscapeExt.buffer));
  }

  writeImageDesc() {
    const desc = new DataStream(new ArrayBuffer(10));
    desc.writeUint8(0x2C);
    desc.writeUint16(0); // image left
    desc.writeUint16(0); // image top
    desc.writeUint16(this.width);
    desc.writeUint16(this.height);
    desc.writeUint8(0);
    this.data.writeBytes(new Uint8Array(desc.buffer));
  }

  writePixels(pixels: Uint8Array) {
    const lzw = new LZWEncoder(this.width, this.height, pixels, this.meta.colorDepth);
    lzw.encode(this.data);
  }

  writeFrame(pixels: Uint8Array) {
    this.writeGraphicsControlExt();
    this.writeImageDesc();
    this.writePixels(pixels);
  }

  getBuffer() {
    return this.data.getBuffer();
  }

  getBlob() {
    return new Blob([this.getBuffer()], {type: 'image/gif'})
  }

  getUrl() {
    return window.URL.createObjectURL(this.getBlob());
  }

  getImage() {
    const img = new Image(this.width, this.height);
    img.src = this.getUrl();
    return img;
  }
}