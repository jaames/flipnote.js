import type { Flipnote } from '../parsers';
import { EncoderBase } from './EncoderBase';
import { LzwCompressor } from './LwzCompressor';
import { ByteArray, assertBrowserEnv } from '../utils';

/**
 * GIF RGBA palette color definition.
 */
export type GifPaletteColor = [
  /**
   * Red (0 to 255)
   */
  number,
  /**
   * Green (0 to 255)
   */
  number,
  /**
   * Blue (0 to 255)
   */
  number,
  /**
   * Alpha (0 to 255)
   */
  number
];

/**
 * Optional GIF encoder settings.
 */
export interface GifImageSettings {
  /**
   * Delay between animated GIF frames, measured in milliseconds.
   */
  delay: number;
  /**
   * Color depth as bits per pixel.
   * @default 8
   */
  colorDepth: number;
  /**
   * Repeat count. `-1` = no repeat, `0` = repeat forever.
   */
  repeat: number;
};

/** 
 * GIF image encoder, supports static single-frame GIF export as well as animated GIF.
 * 
 * @group File Encoder
 */
export class GifImage extends EncoderBase {

  /**
   * Default GIF encoder settings
   */
  static defaultSettings: GifImageSettings = {
    delay: 100,
    repeat: -1,
    colorDepth: 8
  };

  readonly mimeType = 'gif/image';
  /**
   * Image width (in pixels).
   */
  width: number;
  /**
   * Image height (in pixels).
   */
  height: number;
  /**
   * GIF global RGBA color palette. Max 256 colors, alpha channel is ignored.
   */
  palette: GifPaletteColor[];
  /**
   * GIF image settings, such as whether it should loop, the delay between frames, etc.
   */
  settings: GifImageSettings;
  /**
   * Number of current GIF frames.
   */
  frameCount: number = 0;

  #data: ByteArray;
  #compressor: LzwCompressor;

  /**
   * Create a new GIF image object.
   * 
   * @param width Image width
   * @param height Image height
   * @param settings Whether the gif should loop, the delay between frames, etc. See {@link GifEncoderSettings}
   */
  constructor(width: number, height: number, settings: Partial<GifImageSettings> = {}) {
    super();
    this.width = width;
    this.height = height;
    this.#data = new ByteArray();
    this.settings = { ...GifImage.defaultSettings, ...settings };
    this.#compressor = new LzwCompressor(width, height, settings.colorDepth);
  }

  /**
   * Create an animated GIF image from a Flipnote.
   * 
   * This will encode the entire animation, so depending on the number of frames it could take a while to return.
   * @param flipnote {@link Flipnote} object ({@link PpmParser} or {@link KwzParser} instance)
   * @param settings Whether the gif should loop, the delay between frames, etc. See {@link GifEncoderSettings}
   */
  static fromFlipnote(flipnote: Flipnote, settings: Partial<GifImageSettings> = {}) {
    const gif = new GifImage(flipnote.imageWidth, flipnote.imageHeight, {
      delay: 100 / flipnote.framerate,
      repeat: flipnote.meta?.loop ? -1 : 0,
      ...settings
    });

    gif.palette = flipnote.globalPalette;

    for (let frameIndex = 0; frameIndex < flipnote.frameCount; frameIndex++)
      gif.writeFrame(flipnote.getFramePixels(frameIndex));

    gif.finish();
    return gif;
  }

  /**
   * Create an GIF image from a single Flipnote frame.
   * @param flipnote
   * @param frameIndex animation frame index to encode
   * @param settings whether the gif should loop, the delay between frames, etc. See {@link GifEncoderSettings}
   */
  static fromFlipnoteFrame(flipnote: Flipnote, frameIndex: number, settings: Partial<GifImageSettings> = {}) {
    const gif = new GifImage(flipnote.imageWidth, flipnote.imageHeight, {
      delay: 0,
      repeat: 0,
      ...settings,
    });
    gif.palette = flipnote.globalPalette;
    gif.writeFrame(flipnote.getFramePixels(frameIndex));
    gif.finish();
    return gif;
  }

  /**
   * Add a frame to the GIF image.
   * @param pixels Raw pixels to encode, must be an uncompressed 8bit array of palette indices with a size matching image width * image height
   */
  writeFrame(pixels: Uint8Array) {
    if (this.frameCount === 0)
      this.#writeFirstFrame(pixels);
    else
      this.#writeAdditionalFrame(pixels);
    this.frameCount += 1;
  }

  /**
   * Call once all frames have been written to finish the GIF image.
   */
  finish() {
    this.#data.writeByte(0x3B);
  }

  /**
   * Returns the GIF image data as an {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}.
   */
  getArrayBuffer() {
    return this.#data.getBuffer();
  }

  /**
    * Returns the GIF image data as an {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image | Image} object.
    * 
    * Note: This method does not work outside of browser environments
    */
  getImage(): HTMLImageElement {
    assertBrowserEnv();
    const img = new Image(this.width, this.height);
    img.src = this.getUrl();
    return img;
  }

  #writeFirstFrame(pixels: Uint8Array) {
    this.#writeHeader();
    this.#writeLogicalScreenDescriptor();
    this.#writeColorTable();
    this.#writeNetscapeExt();
    this.#writeGraphicControlExt();
    this.#writeImageDescriptor();
    this.#writePixels(pixels);
  }

  #writeAdditionalFrame(pixels: Uint8Array) {
    this.#writeGraphicControlExt();
    this.#writeImageDescriptor();
    this.#writePixels(pixels);
  }

  #writeHeader() {
    this.#data.writeChars('GIF89a');
  }

  #writeGraphicControlExt() {
    this.#data.writeByte(0x21); // extension introducer
    this.#data.writeByte(0xf9); // GCE label
    this.#data.writeByte(4); // data block size
    // packed fields
    this.#data.writeByte(0);
    this.#data.writeU16(this.settings.delay); // delay x 1/100 sec
    this.#data.writeByte(0); // transparent color index
    this.#data.writeByte(0); // block terminator
  }

  #writeLogicalScreenDescriptor() {
    const palette = this.palette;
    const colorDepth = this.settings.colorDepth;
    const globalColorTableFlag = 1;
    const sortFlag = 0;
    const globalColorTableSize = this.#colorTableSize(palette.length) - 1;
    const fields =
      (globalColorTableFlag << 7) |
      ((colorDepth - 1) << 4) |
      (sortFlag << 3) |
      globalColorTableSize;
    const backgroundColorIndex = 0;
    const pixelAspectRatio = 0;
    this.#data.writeU16(this.width);
    this.#data.writeU16(this.height);
    this.#data.writeBytes([fields, backgroundColorIndex, pixelAspectRatio]);
  }

  #writeNetscapeExt() {
    this.#data.writeByte(0x21); // extension introducer
    this.#data.writeByte(0xff); // app extension label
    this.#data.writeByte(11); // block size
    this.#data.writeChars('NETSCAPE2.0'); // app id + auth code
    this.#data.writeByte(3); // sub-block size
    this.#data.writeByte(1); // loop sub-block id
    this.#data.writeU16(this.settings.repeat); // loop count (extra iterations, 0=repeat forever)
    this.#data.writeByte(0); // block terminator
  }

  #writeColorTable() {
    const palette = this.palette;
    const colorTableLength = 1 << this.#colorTableSize(palette.length);
    for (let i = 0; i < colorTableLength; i++) {
      let color = [0, 0, 0];
      if (i < palette.length) {
        color = palette[i];
      }
      this.#data.writeByte(color[0]);
      this.#data.writeByte(color[1]);
      this.#data.writeByte(color[2]);
    }
  }

  #writeImageDescriptor() {
    this.#data.writeByte(0x2c); // image separator
    this.#data.writeU16(0); // x position
    this.#data.writeU16(0); // y position
    this.#data.writeU16(this.width); // image size
    this.#data.writeU16(this.height);
    this.#data.writeByte(0); // global palette
  }

  #colorTableSize(length: number) {
    return Math.max(Math.ceil(Math.log2(length)), 1);
  }

  #writePixels(pixels: Uint8Array) {
    this.#compressor.colorDepth = this.settings.colorDepth;
    this.#compressor.reset();
    this.#compressor.encode(pixels, this.#data);
  }
}