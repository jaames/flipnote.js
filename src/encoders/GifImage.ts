import { DataStream, ByteArray } from '../utils/index';
import { LzwCompressor } from './LwzCompressor';
import { Flipnote } from '../parsers/index';

/**
 * GIF RGBA palette color definition
 */
type GifPaletteColor = [
   /** Red (0 to 255) */
   number,
   /** Green (0 to 255) */
   number,
   /** Blue (0 to 255) */
   number,
   /** Alpha (0 to 255) */
   number
];

/**
 * Optional GIF encoder settings
 */
export interface GifEncoderSettings {
  /** Use transparency */
  transparentBg: boolean;
  /** Delay between animated GIF frames, measured in milliseconds */
  delay: number;
  /** Color depth as bits per pixel. Defaults to 8 */
  colorDepth: number;
  /** -1 = no repeat, 0 = repeat forever. Anything else is repeat count */
  repeat: number;
};

/** 
 * GIF image encoder
 * 
 * Supports static single-frame GIF export as well as animated GIF
 * @category File Encoder
 */
export class GifImage {

  /**
   * Default GIF encoder settings
   */
  static defaultSettings: GifEncoderSettings = {
    transparentBg: false,
    delay: 100,
    repeat: -1,
    colorDepth: 8
  };

  /** Image width */
  public width: number;
  /** Image height */
  public height: number;
  /** GIF global RGBA color palette. Max 256 colors, alpha channel is ignored */
  public palette: GifPaletteColor[];
  /** GIF image settings, such as whether it should loop, the delay between frames, etc */
  public settings: GifEncoderSettings;

  private data: ByteArray;

  /**
   * Create a new GIF image object
   * @param width image width
   * @param height image height
   * @param settings image settings, such as whether it should loop, the delay between frames, etc
   */
  constructor(width: number, height: number, settings: Partial<GifEncoderSettings> = {}) {
    this.width = width;
    this.height = height;
    this.data = new ByteArray();
    this.settings = { ...GifImage.defaultSettings, ...settings };
  }

  /**
   * Create an animated GIF image from a Flipnote
   * 
   * This will encode the entire animation, so depending on the number of frames it could take a while to return.
   * @param flipnote {@link PpmParser} or {@link KwzParser} instance
   * @param settings image settings, such as whether it should loop, the delay between frames, etc
   */
  static fromFlipnote(flipnote: Flipnote, settings: Partial<GifEncoderSettings> = {}) {
    const gif = new GifImage(flipnote.width, flipnote.height, {
      delay: 100 / flipnote.framerate,
      repeat: flipnote.meta.loop ? -1 : 0,
      ...settings
    });
    gif.palette = flipnote.globalPalette;
    gif.init();
    for (let frameIndex = 0; frameIndex < flipnote.frameCount; frameIndex++) {
      gif.writeFrame(flipnote.getFramePixels(frameIndex));
    }
    return gif;
  }

  /**
   * Create an GIF image from a single Flipnote frame
   * @param flipnote {@link PpmParser} or {@link KwzParser} instance
   * @param frameIndex animation frame index to encode
   * @param settings image settings, such as whether it should loop, the delay between frames, etc
   */
  static fromFlipnoteFrame(flipnote: Flipnote, frameIndex: number, settings: Partial<GifEncoderSettings> = {}) {
    const gif = new GifImage(flipnote.width, flipnote.height, {
      // TODO: look at ideal delay and repeat settings for single frame GIF
      delay: 100 / flipnote.framerate,
      repeat: -1,
      ...settings,
    });
    gif.palette = flipnote.globalPalette;
    gif.init();
    gif.writeFrame(flipnote.getFramePixels(frameIndex));
    return gif;
  }

  private init() {
    const paletteSize = this.palette.length;
    // calc colorDepth
    for (var p = 1; 1 << p < paletteSize; p += 1)
      continue;
    this.settings.colorDepth = p;
    this.writeHeader();
    this.writeColorTable();
    this.writeNetscapeExt();
  }

  private writeHeader() {
    const header = new DataStream(new ArrayBuffer(13));
    header.writeChars('GIF89a');
    // Logical Screen Descriptor
    header.writeUint16(this.width);
    header.writeUint16(this.height);
    header.writeUint8(
      0x80 | // 1 : global color table flag = 1 (gct used)
      (this.settings.colorDepth - 1) // 6-8 : gct size
    );
    header.writeBytes([
      0x0,
      0x0
    ]);
    this.data.writeBytes(new Uint8Array(header.buffer));
  }

  private writeColorTable() {
    const palette = new Uint8Array(3 * Math.pow(2, this.settings.colorDepth));
    let offset = 0;
    for(let index = 0; index < this.palette.length; index += 1) {
      const [r, g, b, a] = this.palette[index];
      palette[offset++] = r;
      palette[offset++] = g;
      palette[offset++] = b;
    }
    this.data.writeBytes(palette);
  }

  private writeNetscapeExt() {
    const netscapeExt = new DataStream(new ArrayBuffer(19));
    netscapeExt.writeBytes([
      0x21, // extension introducer
      0xFF, // app extension label
      11, // block size
    ]);
    netscapeExt.writeChars('NETSCAPE2.0');
    netscapeExt.writeUint8(3); // subblock size
    netscapeExt.writeUint8(1); // loop subblock id
    netscapeExt.writeUint16(this.settings.repeat); // loop flag
    this.data.writeBytes(new Uint8Array(netscapeExt.buffer));
  }

  private writeFrameHeader() {
    const fHeader = new DataStream(new ArrayBuffer(18));
    // graphics control ext block
    const transparentFlag = this.settings.transparentBg ? 0x1 : 0x0;
    fHeader.writeBytes([
      0x21, // extension introducer
      0xF9, // graphic control label
      0x4, // block size
      0x0 | transparentFlag // bitflags
    ]);
    fHeader.writeUint16(this.settings.delay); // loop flag
    fHeader.writeBytes([
      0x0,
      0x0
    ]);
    // image desc block
    fHeader.writeUint8(0x2C);
    fHeader.writeUint16(0); // image left
    fHeader.writeUint16(0); // image top
    fHeader.writeUint16(this.width);
    fHeader.writeUint16(this.height);
    fHeader.writeUint8(0);
    this.data.writeBytes(new Uint8Array(fHeader.buffer));
  }

  private writePixels(pixels: Uint8Array) {
    const lzw = new LzwCompressor(this.width, this.height, pixels, this.settings.colorDepth);
    lzw.encode(this.data);
  }

  /**
   * Add a frame to the GIF image
   * @param pixels Raw pixels to encode, must be an uncompressed 8bit array of palette indices with a size matching image width * image height
   */
  public writeFrame(pixels: Uint8Array) {
    this.writeFrameHeader();
    this.writePixels(pixels);
  }

  /**
   * Returns the GIF image data as an ArrayBuffer
   */
  public getBuffer() {
    return this.data.getBuffer();
  }

  /**
   * Returns the GIF image data as a file blob
   * 
   * Blob API: https://developer.mozilla.org/en-US/docs/Web/API/Blob
   */
  public getBlob() {
    return new Blob([this.getBuffer()], {type: 'image/gif'});
  }

  /**
   * Returns the GIF image data as an object URL
   * 
   * Object URL API: https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
   */
  public getUrl() {
    return window.URL.createObjectURL(this.getBlob());
  }

  /**
   * Returns the GIF image data as an Image object
   * 
   * Image API: https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image
   */
  public getImage() {
    const img = new Image(this.width, this.height);
    img.src = this.getUrl();
    return img;
  }
}