import { 
  FlipnoteFormat,
  FlipnotePaletteDefinition,
  FlipnoteAudioTrack,
  FlipnoteMeta,
  FlipnoteParser
} from './FlipnoteParserTypes';

import {
  clamp,
  pcmDsAudioResample,
  pcmGetClippingRatio,
  ADPCM_STEP_TABLE,
  ADPCM_INDEX_TABLE_2BIT,
  ADPCM_INDEX_TABLE_4BIT
} from './audioUtils';

/** 
 * KWZ framerates in frames per second, indexed by the in-app frame speed
 */
const KWZ_FRAMERATES = [.2, .5, 1, 2, 4, 6, 8, 12, 20, 24, 30];
/** 
 * KWZ color defines (red, green, blue, alpha)
 */
const KWZ_PALETTE: FlipnotePaletteDefinition = {
  WHITE:  [0xff, 0xff, 0xff, 0xff],
  BLACK:  [0x10, 0x10, 0x10, 0xff],
  RED:    [0xff, 0x10, 0x10, 0xff],
  YELLOW: [0xff, 0xe7, 0x00, 0xff],
  GREEN:  [0x00, 0x86, 0x31, 0xff],
  BLUE:   [0x00, 0x38, 0xce, 0xff],
  NONE:   [0xff, 0xff, 0xff, 0x00]
};

/** 
 * Pre computed bitmasks for readBits; done as a slight optimisation
 * @internal
 */
const BITMASKS = new Uint16Array(16);
for (let i = 0; i < 16; i++) {
  BITMASKS[i] = (1 << i) - 1;
}

// Every possible sequence of pixels for each tile line
/** @internal */
const KWZ_LINE_TABLE = new Uint8Array(6561 * 8);
// Same lines as KWZ_LINE_TABLE, but the pixels are rotated to the left by one place
/** @internal */
const KWZ_LINE_TABLE_SHIFT = new Uint8Array(6561 * 8);

/** @internal */
var offset = 0;
for (let a = 0; a < 3; a++)
for (let b = 0; b < 3; b++)
for (let c = 0; c < 3; c++)
for (let d = 0; d < 3; d++)
for (let e = 0; e < 3; e++)
for (let f = 0; f < 3; f++)
for (let g = 0; g < 3; g++)
for (let h = 0; h < 3; h++)
{
  KWZ_LINE_TABLE.set([b, a, d, c, f, e, h, g], offset);
  KWZ_LINE_TABLE_SHIFT.set([a, d, c, f, e, h, g, b], offset);
  offset += 8;
}

// Commonly occuring line offsets
/** @internal */
const KWZ_LINE_TABLE_COMMON = new Uint8Array(32 * 8);
[
  0x0000, 0x0CD0, 0x19A0, 0x02D9, 0x088B, 0x0051, 0x00F3, 0x0009,
  0x001B, 0x0001, 0x0003, 0x05B2, 0x1116, 0x00A2, 0x01E6, 0x0012,
  0x0036, 0x0002, 0x0006, 0x0B64, 0x08DC, 0x0144, 0x00FC, 0x0024,
  0x001C, 0x0004, 0x0334, 0x099C, 0x0668, 0x1338, 0x1004, 0x166C
].forEach((lineTableIndex, index) => {
  const pixels = KWZ_LINE_TABLE.subarray(lineTableIndex * 8, lineTableIndex * 8 + 8);
  KWZ_LINE_TABLE_COMMON.set(pixels, index * 8);
});

// Commonly occuring line offsets, but the lines are shifted to the left by one pixel
/** @internal */
const KWZ_LINE_TABLE_COMMON_SHIFT = new Uint8Array(32 * 8);
[
  0x0000, 0x0CD0, 0x19A0, 0x0003, 0x02D9, 0x088B, 0x0051, 0x00F3, 
  0x0009, 0x001B, 0x0001, 0x0006, 0x05B2, 0x1116, 0x00A2, 0x01E6, 
  0x0012, 0x0036, 0x0002, 0x02DC, 0x0B64, 0x08DC, 0x0144, 0x00FC, 
  0x0024, 0x001C, 0x099C, 0x0334, 0x1338, 0x0668, 0x166C, 0x1004
].forEach((lineTableIndex, index) => {
  const pixels = KWZ_LINE_TABLE.subarray(lineTableIndex * 8, lineTableIndex * 8 + 8);
  KWZ_LINE_TABLE_COMMON_SHIFT.set(pixels, index * 8);
});

/** 
 * KWZ section types
 * @internal
 */
export type KwzSectionMagic = 'KFH' | 'KTN' | 'KMC' | 'KMI' | 'KSN' | 'ICO';

/** 
 * KWZ section map, tracking their offset and length
 * @internal
 */
export type KwzSectionMap = {
  [k in KwzSectionMagic]?: {
    offset: number, 
    length: number
  }
};

/** 
 * KWZ file metadata, stores information about its playback, author details, etc
 */
export interface KwzMeta extends FlipnoteMeta {
  /** Date representing when the file was created */
  creationTimestamp: Date;
};

/** 
 * KWZ frame metadata, stores information about each frame, like layer depths sound effect usage
 */
export interface KwzFrameMeta {
  /** Frame flags */
  flags: number[];
  /** Frame layer sizes */
  layerSize: number[];
  /** Frame author's Flipnote Studio ID */
  frameAuthor: string;
  /** Frame layer 3D depths */
  layerDepth: number[];
  /** Frame sound */
  soundFlags: number;
  /** Whether this frame contains photos taken with the console's camera */
  cameraFlag: number;
};

/** 
 * KWZ parser options for enabling optimisations and other extra features
 */
export interface KwzParserSettings {
  /** Skip full metadata parsing for quickness */ 
  quickMeta: boolean;
  /** Apply special cases for dsi gallery notes */ 
  dsiGalleryNote: boolean;
  /** A minor audio fix is applied by default, since Flipnote 3D's own implementation is wrong. Enable this to use the "original" audio decoding setup */
  originalAudioSettings: boolean;
};

/** 
 * Parser class for Flipnote Studio 3D's KWZ animation format
 * 
 * Format docs: https://github.com/Flipnote-Collective/flipnote-studio-3d-docs/wiki/KWZ-Format
 * @category File Parser
 */
export class KwzParser extends FlipnoteParser {

  /** Default KWZ parser settings */
  static defaultSettings: KwzParserSettings = {
    quickMeta: false,
    dsiGalleryNote: false,
    originalAudioSettings: false
  };
  /** File format type */
  static format = FlipnoteFormat.KWZ;
  /** Animation frame width */
  static width = 320;
  /** Animation frame height */
  static height = 240;
  /** Number of animation frame layers */
  static numLayers = 3;
  /** Audio track base sample rate */
  static rawSampleRate = 16364;
  /** Audio output sample rate. NOTE: probably isn't accurate, full KWZ audio stack is still on the todo */
  static sampleRate = 16364;
  /** Global animation frame color palette */
  static globalPalette = [
    KWZ_PALETTE.WHITE,
    KWZ_PALETTE.BLACK,
    KWZ_PALETTE.RED,
    KWZ_PALETTE.YELLOW,
    KWZ_PALETTE.GREEN,
    KWZ_PALETTE.BLUE,
    KWZ_PALETTE.NONE,
  ];
  
  /** File format type, reflects {@link KwzParser.format} */
  public format = FlipnoteFormat.KWZ;
  public formatString = 'KWZ';
  /** Animation frame width, reflects {@link KwzParser.width} */
  public width = KwzParser.width;
  /** Animation frame height, reflects {@link KwzParser.height} */
  public height = KwzParser.height;
  /** Number of animation frame layers, reflects {@link KwzParser.numLayers} */
  public numLayers = KwzParser.numLayers;
  /** Audio track base sample rate, reflects {@link KwzParser.rawSampleRate} */
  public rawSampleRate = KwzParser.rawSampleRate;
  /** Audio output sample rate, reflects {@link KwzParser.sampleRate} */
  public sampleRate = KwzParser.sampleRate;
  /** Global animation frame color palette, reflects {@link KwzParser.globalPalette} */
  public globalPalette = KwzParser.globalPalette;
  /** File metadata, see {@link KwzMeta} for structure */
  public meta: KwzMeta;

  private settings: KwzParserSettings;
  private sections: KwzSectionMap;
  private layers: [Uint8Array, Uint8Array, Uint8Array];
  private prevFrameIndex: number = null;
  private frameMeta: Map<number, KwzFrameMeta>;
  private frameMetaOffsets: Uint32Array;
  private frameDataOffsets: Uint32Array;
  private frameLayerSizes: [number, number, number][];
  private bitIndex: number = 0;
  private bitValue: number = 0;

  /**
   * Create a new KWZ file parser instance
   * @param arrayBuffer an ArrayBuffer containing file data
   * @param settings parser settings
   */
  constructor(arrayBuffer: ArrayBuffer, settings: Partial<KwzParserSettings> = {}) {
    super(arrayBuffer);
    this.settings = {...KwzParser.defaultSettings, ...settings};
    this.layers = [
      new Uint8Array(KwzParser.width * KwzParser.height),
      new Uint8Array(KwzParser.width * KwzParser.height),
      new Uint8Array(KwzParser.width * KwzParser.height),
    ];
    this.bitIndex = 0;
    this.bitValue = 0;
    this.buildSectionMap();
    if (!this.settings.quickMeta)
      this.decodeMeta();
    else
      this.decodeMetaQuick();
    this.getFrameOffsets();
    this.decodeSoundHeader();
  }
  
  private buildSectionMap() {
    this.seek(0);
    this.sections = {};
    const fileSize = this.byteLength - 256;
    let offset = 0;
    let sectionCount = 0;
    // counting sections should mitigate against one of mrnbayoh's notehax exploits
    while ((offset < fileSize) && (sectionCount < 6)) {
      this.seek(offset);
      const sectionMagic = <KwzSectionMagic>this.readChars(4).substring(0, 3);
      const sectionLength = this.readUint32();
      this.sections[sectionMagic] = {
        offset: offset,
        length: sectionLength
      };
      offset += sectionLength + 8;
      sectionCount += 1;
    }
  }

  private readBits(num: number) {
    if (this.bitIndex + num > 16) {
      const nextBits = this.readUint16();
      this.bitValue |= nextBits << (16 - this.bitIndex);
      this.bitIndex -= 16;
    }
    const result = this.bitValue & BITMASKS[num];
    this.bitValue >>= num;
    this.bitIndex += num;
    return result;
  }

  private decodeMeta() {
    this.seek(this.sections['KFH'].offset + 12);
    const creationTimestamp = new Date((this.readUint32() + 946684800) * 1000),
          modifiedTimestamp = new Date((this.readUint32() + 946684800) * 1000),
          appVersion = this.readUint32(),
          rootAuthorId = this.readHex(10),
          parentAuthorId = this.readHex(10),
          currentAuthorId = this.readHex(10),
          rootAuthorName = this.readWideChars(11),
          parentAuthorName = this.readWideChars(11),
          currentAuthorName = this.readWideChars(11),
          rootFilename = this.readChars(28),
          parentFilename = this.readChars(28),
          currentFilename = this.readChars(28),
          frameCount = this.readUint16(),
          thumbIndex = this.readUint16(),
          flags = this.readUint16(),
          frameSpeed = this.readUint8(),
          layerFlags = this.readUint8();
    this.isSpinoff = (currentAuthorId !== parentAuthorId) || (currentAuthorId !== rootAuthorId);
    this.frameCount = frameCount;
    this.thumbFrameIndex = thumbIndex;
    this.frameSpeed = frameSpeed;
    this.framerate = KWZ_FRAMERATES[frameSpeed];
    this.layerVisibility = {
      1: (layerFlags & 0x1) === 0,
      2: (layerFlags & 0x2) === 0,
      3: (layerFlags & 0x3) === 0,
    };
    this.meta = {
      lock: (flags & 0x1) !== 0,
      loop: (flags & 0x2) !== 0,
      frameCount: frameCount,
      frameSpeed: frameSpeed,
      thumbIndex: thumbIndex,
      timestamp: modifiedTimestamp,
      creationTimestamp: creationTimestamp,
      root: {
        username: rootAuthorName,
        fsid: rootAuthorId,
        filename: rootFilename,
      },
      parent: {
        username: parentAuthorName,
        fsid: parentAuthorId,
        filename: parentFilename,
      },
      current: {
        username: currentAuthorName,
        fsid: currentAuthorId,
        filename: currentFilename,
      },
    };
  }

  private decodeMetaQuick() {
    this.seek(this.sections['KFH'].offset + 0x8 + 0xC4);
    const frameCount = this.readUint16();
    const thumbFrameIndex = this.readUint16();
    const flags = this.readUint16();
    const frameSpeed = this.readUint8();
    const layerFlags = this.readUint8();
    this.frameCount = frameCount;
    this.thumbFrameIndex = thumbFrameIndex;
    this.frameSpeed = frameSpeed;
    this.framerate = KWZ_FRAMERATES[frameSpeed];
  }

  private getFrameOffsets() {
    const numFrames = this.frameCount;
    const kmiSection = this.sections['KMI'];
    const kmcSection = this.sections['KMC'];
    const frameMetaOffsets = new Uint32Array(numFrames);
    const frameDataOffsets = new Uint32Array(numFrames);
    const frameLayerSizes = [];
    let frameMetaOffset = kmiSection.offset + 8;
    let frameDataOffset = kmcSection.offset + 12;
    for (let frameIndex = 0; frameIndex < numFrames; frameIndex++) {
      this.seek(frameMetaOffset + 4);
      const layerASize = this.readUint16();
      const layerBSize = this.readUint16();
      const layerCSize = this.readUint16();
      frameMetaOffsets[frameIndex] = frameMetaOffset
      frameDataOffsets[frameIndex] = frameDataOffset;
      frameMetaOffset += 28;
      frameDataOffset += layerASize + layerBSize + layerCSize;
      frameLayerSizes.push([layerASize, layerBSize, layerCSize]);
    }
    this.frameMetaOffsets = frameMetaOffsets;
    this.frameDataOffsets = frameDataOffsets;
    this.frameLayerSizes = frameLayerSizes as [number, number, number][];
  }

  private decodeSoundHeader() {
    if (this.sections.hasOwnProperty('KSN')) {
      let offset = this.sections['KSN'].offset + 8;
      this.seek(offset);
      const bgmSpeed = this.readUint32();
      this.bgmSpeed = bgmSpeed;
      this.bgmrate = KWZ_FRAMERATES[bgmSpeed];
      const trackSizes = new Uint32Array(this.buffer, offset + 4, 20);
      this.soundMeta = {
        [FlipnoteAudioTrack.BGM]: {offset: offset += 28,            length: trackSizes[0]},
        [FlipnoteAudioTrack.SE1]: {offset: offset += trackSizes[0], length: trackSizes[1]},
        [FlipnoteAudioTrack.SE2]: {offset: offset += trackSizes[1], length: trackSizes[2]},
        [FlipnoteAudioTrack.SE3]: {offset: offset += trackSizes[2], length: trackSizes[3]},
        [FlipnoteAudioTrack.SE4]: {offset: offset += trackSizes[3], length: trackSizes[4]},
      };
    }
  }

  /** 
   * Get the color palette indices for a given frame. RGBA colors for these values can be indexed from {@link KwzParser.globalPalette}
   * 
   * Returns an array where:
   *  - index 0 is the paper color index
   *  - index 1 is the layer A color 1 index
   *  - index 2 is the layer A color 2 index
   *  - index 3 is the layer B color 1 index
   *  - index 4 is the layer B color 2 index
   *  - index 5 is the layer C color 1 index
   *  - index 6 is the layer C color 2 index
   * @category Image
  */
  public getFramePaletteIndices(frameIndex: number) {
    this.seek(this.frameMetaOffsets[frameIndex]);
    const flags = this.readUint32();
    return [
      flags & 0xF,
      (flags >> 8) & 0xF,
      (flags >> 12) & 0xF,
      (flags >> 16) & 0xF,
      (flags >> 20) & 0xF,
      (flags >> 24) & 0xF,
      (flags >> 28) & 0xF,
    ];
  }

  /**
   * Get the RGBA colors for a given frame
   * 
   * Returns an array where:
   *  - index 0 is the paper color
   *  - index 1 is the layer A color 1
   *  - index 2 is the layer A color 2
   *  - index 3 is the layer B color 1
   *  - index 4 is the layer B color 2
   *  - index 5 is the layer C color 1
   *  - index 6 is the layer C color 2
   * @category Image
  */
  public getFramePalette(frameIndex: number) {
    const indices = this.getFramePaletteIndices(frameIndex);
    return indices.map(colorIndex => this.globalPalette[colorIndex]);
  }

  private getFrameDiffingFlag(frameIndex: number) {
    this.seek(this.frameMetaOffsets[frameIndex]);
    const flags = this.readUint32();
    return (flags >> 4) & 0x07;
  }

  private getFrameLayerSizes(frameIndex: number) {
    this.seek(this.frameMetaOffsets[frameIndex] + 0x4);
    return [
      this.readUint16(),
      this.readUint16(),
      this.readUint16()
    ];
  }

  private getFrameLayerDepths(frameIndex: number) {
    this.seek(this.frameMetaOffsets[frameIndex] + 0x14);
    return [
      this.readUint8(),
      this.readUint8(),
      this.readUint8()
    ];
  }

  private getFrameAuthor(frameIndex: number) {
    this.seek(this.frameMetaOffsets[frameIndex] + 0xA);
    return this.readHex(10);
  }

  private getFrameSoundFlags(frameIndex: number) {
    this.seek(this.frameMetaOffsets[frameIndex] + 0x17);
    const soundFlags = this.readUint8();
    return [
      (soundFlags & 0x1) !== 0,
      (soundFlags & 0x2) !== 0,
      (soundFlags & 0x4) !== 0,
      (soundFlags & 0x8) !== 0,
    ];
  }

  private getFrameCameraFlags(frameIndex: number) {
    this.seek(this.frameMetaOffsets[frameIndex] + 0x1A);
    const cameraFlags = this.readUint8();
    return [
      (cameraFlags & 0x1) !== 0,
      (cameraFlags & 0x2) !== 0,
      (cameraFlags & 0x4) !== 0,
    ];
  }

  /** 
   * Get the layer draw order for a given frame
   * @category Image
   * @returns Array of layer indexes, in the order they should be drawn
  */
  public getFrameLayerOrder(frameIndex: number) {
    const depths = this.getFrameLayerDepths(frameIndex);
    return [2, 1, 0].sort((a, b) => depths[b] - depths[a]);
  }

  /** 
   * Decode a frame, returning the raw pixel buffers for each layer
   * @category Image
  */
  public decodeFrame(frameIndex: number, diffingFlag = 0x7, isPrevFrame = false) {
    // the prevDecodedFrame check is an optimisation for decoding frames in full sequence
    if (this.prevFrameIndex !== frameIndex - 1 && frameIndex !== 0) {
      // if this frame is being decoded as a prev frame, then we only want to decode the layers necessary
      // diffingFlag is negated with ~ so if no layers are diff-based, diffingFlag is 0
      if (isPrevFrame)
        diffingFlag = diffingFlag & ~this.getFrameDiffingFlag(frameIndex + 1);
      // if diffing flag isn't 0, decode the previous frame before this one
      if (diffingFlag !== 0)
        this.decodeFrame(frameIndex - 1, diffingFlag, true);
    }
    let ptr = this.frameDataOffsets[frameIndex];
    const layerSizes = this.frameLayerSizes[frameIndex];

    for (let layerIndex = 0; layerIndex < 3; layerIndex++) {
      // dsi gallery conversions don't use the third layer, so it can be skipped if this is set
      if (this.settings.dsiGalleryNote && layerIndex === 3)
        break;

      this.seek(ptr);
      const layerSize = layerSizes[layerIndex];
      ptr += layerSize;

      // if the layer is 38 bytes then it hasn't changed at all since the previous frame, so we can skip it
      if (layerSize === 38)
        continue;

      // if this layer doesn't need to be decoded for diffing
      if (((diffingFlag >> layerIndex) & 0x1) === 0)
        continue;

      // reset readbits state
      this.bitIndex = 16;
      this.bitValue = 0;

      // tile skip counter
      let skip = 0;

      for (let tileOffsetY = 0; tileOffsetY < KwzParser.height; tileOffsetY += 128) {
        for (let tileOffsetX = 0; tileOffsetX < KwzParser.width; tileOffsetX += 128) {
          // loop small tiles
          for (let subTileOffsetY = 0; subTileOffsetY < 128; subTileOffsetY += 8) {
            const y = tileOffsetY + subTileOffsetY;
            if (y >= KwzParser.height)
              break;

            for (let subTileOffsetX = 0; subTileOffsetX < 128; subTileOffsetX += 8) {
              const x = tileOffsetX + subTileOffsetX;
              if (x >= KwzParser.width)
                break;

              if (skip > 0) {
                skip -= 1;
                continue;
              }

              const pixelOffset = y * KwzParser.width + x;
              const pixelBuffer = this.layers[layerIndex];

              const type = this.readBits(3);

              if (type == 0) {
                const lineIndex = this.readBits(5);
                const pixels = KWZ_LINE_TABLE_COMMON.subarray(lineIndex * 8, lineIndex * 8 + 8);
                pixelBuffer.set(pixels, pixelOffset);
                pixelBuffer.set(pixels, pixelOffset + 320);
                pixelBuffer.set(pixels, pixelOffset + 640);
                pixelBuffer.set(pixels, pixelOffset + 960);
                pixelBuffer.set(pixels, pixelOffset + 1280);
                pixelBuffer.set(pixels, pixelOffset + 1600);
                pixelBuffer.set(pixels, pixelOffset + 1920);
                pixelBuffer.set(pixels, pixelOffset + 2240);
              } 

              else if (type == 1) {
                const lineIndex = this.readBits(13);
                const pixels = KWZ_LINE_TABLE.subarray(lineIndex * 8, lineIndex * 8 + 8);
                pixelBuffer.set(pixels, pixelOffset);
                pixelBuffer.set(pixels, pixelOffset + 320);
                pixelBuffer.set(pixels, pixelOffset + 640);
                pixelBuffer.set(pixels, pixelOffset + 960);
                pixelBuffer.set(pixels, pixelOffset + 1280);
                pixelBuffer.set(pixels, pixelOffset + 1600);
                pixelBuffer.set(pixels, pixelOffset + 1920);
                pixelBuffer.set(pixels, pixelOffset + 2240);
              } 
              
              else if (type == 2) {
                const lineValue = this.readBits(5);
                const a = KWZ_LINE_TABLE_COMMON.subarray(lineValue * 8, lineValue * 8 + 8);
                const b = KWZ_LINE_TABLE_COMMON_SHIFT.subarray(lineValue * 8, lineValue * 8 + 8);
                pixelBuffer.set(a, pixelOffset);
                pixelBuffer.set(b, pixelOffset + 320);
                pixelBuffer.set(a, pixelOffset + 640);
                pixelBuffer.set(b, pixelOffset + 960);
                pixelBuffer.set(a, pixelOffset + 1280);
                pixelBuffer.set(b, pixelOffset + 1600);
                pixelBuffer.set(a, pixelOffset + 1920);
                pixelBuffer.set(b, pixelOffset + 2240);
              } 
              
              else if (type == 3) {
                const lineValue = this.readBits(13);
                const a = KWZ_LINE_TABLE.subarray(lineValue * 8, lineValue * 8 + 8);
                const b = KWZ_LINE_TABLE_SHIFT.subarray(lineValue * 8, lineValue * 8 + 8);
                pixelBuffer.set(a, pixelOffset);
                pixelBuffer.set(b, pixelOffset + 320);
                pixelBuffer.set(a, pixelOffset + 640);
                pixelBuffer.set(b, pixelOffset + 960);
                pixelBuffer.set(a, pixelOffset + 1280);
                pixelBuffer.set(b, pixelOffset + 1600);
                pixelBuffer.set(a, pixelOffset + 1920);
                pixelBuffer.set(b, pixelOffset + 2240);
              }

              // most common tile type
              else if (type == 4) {
                let mask = this.readBits(8);
                let ptr = pixelOffset;
                for (let line = 0; line < 8; line++) {
                  if ((mask & 0x1) !== 0) {
                    const lineIndex = this.readBits(5);
                    const pixels = KWZ_LINE_TABLE_COMMON.subarray(lineIndex * 8, lineIndex * 8 + 8);
                    pixelBuffer.set(pixels, ptr);
                  } 
                  else {
                    const lineIndex = this.readBits(13);
                    const pixels = KWZ_LINE_TABLE.subarray(lineIndex * 8, lineIndex * 8 + 8);
                    pixelBuffer.set(pixels, ptr);
                  }
                  mask >>= 1;
                  ptr += 320;
                }
              }

              else if (type == 5) {
                skip = this.readBits(5);
                continue;
              }

              // type 6 doesnt exist

              else if (type == 7) {
                let pattern = this.readBits(2);
                let useCommonLines = this.readBits(1);

                let a;
                let b;

                if (useCommonLines !== 0) {
                  const lineIndexA = this.readBits(5);
                  const lineIndexB = this.readBits(5);
                  a = KWZ_LINE_TABLE_COMMON.subarray(lineIndexA * 8, lineIndexA * 8 + 8);
                  b = KWZ_LINE_TABLE_COMMON.subarray(lineIndexB * 8, lineIndexB * 8 + 8);
                  pattern = (pattern + 1) % 4;
                } else {
                  const lineIndexA = this.readBits(13);
                  const lineIndexB = this.readBits(13);
                  a = KWZ_LINE_TABLE.subarray(lineIndexA * 8, lineIndexA * 8 + 8);
                  b = KWZ_LINE_TABLE.subarray(lineIndexB * 8, lineIndexB * 8 + 8);
                }

                if (pattern == 0) {
                  pixelBuffer.set(a, pixelOffset);
                  pixelBuffer.set(b, pixelOffset + 320);
                  pixelBuffer.set(a, pixelOffset + 640);
                  pixelBuffer.set(b, pixelOffset + 960);
                  pixelBuffer.set(a, pixelOffset + 1280);
                  pixelBuffer.set(b, pixelOffset + 1600);
                  pixelBuffer.set(a, pixelOffset + 1920);
                  pixelBuffer.set(b, pixelOffset + 2240);
                } else if (pattern == 1) {
                  pixelBuffer.set(a, pixelOffset);
                  pixelBuffer.set(a, pixelOffset + 320);
                  pixelBuffer.set(b, pixelOffset + 640);
                  pixelBuffer.set(a, pixelOffset + 960);
                  pixelBuffer.set(a, pixelOffset + 1280);
                  pixelBuffer.set(b, pixelOffset + 1600);
                  pixelBuffer.set(a, pixelOffset + 1920);
                  pixelBuffer.set(a, pixelOffset + 2240);
                } else if (pattern == 2) {
                  pixelBuffer.set(a, pixelOffset);
                  pixelBuffer.set(b, pixelOffset + 320);
                  pixelBuffer.set(a, pixelOffset + 640);
                  pixelBuffer.set(a, pixelOffset + 960);
                  pixelBuffer.set(b, pixelOffset + 1280);
                  pixelBuffer.set(a, pixelOffset + 1600);
                  pixelBuffer.set(a, pixelOffset + 1920);
                  pixelBuffer.set(b, pixelOffset + 2240);
                } else if (pattern == 3) {
                  pixelBuffer.set(a, pixelOffset);
                  pixelBuffer.set(b, pixelOffset + 320);
                  pixelBuffer.set(b, pixelOffset + 640);
                  pixelBuffer.set(a, pixelOffset + 960);
                  pixelBuffer.set(b, pixelOffset + 1280);
                  pixelBuffer.set(b, pixelOffset + 1600);
                  pixelBuffer.set(a, pixelOffset + 1920);
                  pixelBuffer.set(b, pixelOffset + 2240);
                }
              }
            }
          }
        }
      }
    }
    this.prevFrameIndex = frameIndex;
    return this.layers;
  }

  /** 
   * Get the pixels for a given frame layer
   * @category Image
  */
  public getLayerPixels(frameIndex: number, layerIndex: number) {
    if (this.prevFrameIndex !== frameIndex)
      this.decodeFrame(frameIndex);
    const palette = this.getFramePaletteIndices(frameIndex);
    const layers = this.layers[layerIndex];
    const image = new Uint8Array(KwzParser.width * KwzParser.height);
    const paletteOffset = layerIndex * 2 + 1;
    for (let pixelIndex = 0; pixelIndex < layers.length; pixelIndex++) {
      let pixel = layers[pixelIndex];
      if (pixel === 1)
        image[pixelIndex] = palette[paletteOffset];
      else if (pixel === 2)
        image[pixelIndex] = palette[paletteOffset + 1];
    }
    return image;
  }

  /** 
   * Get the pixels for a given frame
   * @category Image
  */
  public getFramePixels(frameIndex: number) {
    if (this.prevFrameIndex !== frameIndex)
      this.decodeFrame(frameIndex);
    const palette = this.getFramePaletteIndices(frameIndex);
    const layerOrder = this.getFrameLayerOrder(frameIndex);
    const layerA = this.layers[layerOrder[2]]; // top
    const layerB = this.layers[layerOrder[1]]; // middle
    const layerC = this.layers[layerOrder[0]]; // bottom
    const layerAOffset = layerOrder[2] * 2;
    const layerBOffset = layerOrder[1] * 2;
    const layerCOffset = layerOrder[0] * 2;
    if (!this.settings.dsiGalleryNote) {
      const image = new Uint8Array(KwzParser.width * KwzParser.height);
      image.fill(palette[0]); // fill with paper color first
      for (let pixel = 0; pixel < image.length; pixel++) {
        const a = layerA[pixel];
        const b = layerB[pixel];
        const c = layerC[pixel];
        if (a !== 0)
          image[pixel] = palette[layerAOffset + a];
        else if (b !== 0)
          image[pixel] = palette[layerBOffset + b];
        else if (c !== 0)
          image[pixel] = palette[layerCOffset + c];
      }
      return image;
    } 
    // for dsi gallery notes, bottom layer is ignored and edge is cropped
    else {
      const image = new Uint8Array(KwzParser.width * KwzParser.height);
      image.fill(palette[0]); // fill with paper color first
      const cropStartY = 32;
      const cropStartX = 24;
      const cropWidth = KwzParser.width - 64;
      const cropHeight = KwzParser.height - 48;
      const srcStride = KwzParser.width;
      for (let y = cropStartY; y < cropHeight; y++) {
        let srcPtr = y * srcStride;
        for (let x = cropStartX; x < cropWidth; x++) {
          const a = layerA[srcPtr];
          const b = layerB[srcPtr];
          if (a !== 0)
            image[srcPtr] = palette[layerAOffset + a];
          else if (b !== 0)
            image[srcPtr] = palette[layerBOffset + b];
          srcPtr += 1;
        }
      }
      return image;
    }  
  }
  
  /** 
   * Get the sound effect flags for every frame in the Flipnote
   * @category Audio
  */
  public decodeSoundFlags() {
    const result = [];
    for (let i = 0; i < this.frameCount; i++) {
      result.push(this.getFrameSoundFlags(i));
    }
    return result;
  }

  /** 
   * Get the raw compressed audio data for a given track
   * @returns Byte array
   * @category Audio
  */
  public getAudioTrackRaw(trackId: FlipnoteAudioTrack) {
    const trackMeta = this.soundMeta[trackId];
    return new Uint8Array(this.buffer, trackMeta.offset, trackMeta.length);
  }

  /** 
   * Get the decoded audio data for a given track, using the track's native samplerate
   * @returns Signed 16-bit PCM audio
   * @category Audio
  */
  public decodeAudioTrack(trackId: FlipnoteAudioTrack) {
    const adpcm = this.getAudioTrackRaw(trackId);
    const output = new Int16Array(16364 * 60);
    let outputPtr = 0;
    // initial decoder state
    // Flipnote 3D's initial values are actually buggy, so these aren't 1:1
    let predictor = 0;
    let stepIndex = 0;
    let sample = 0;
    let step = 0;
    let diff = 0;
    // we can still optionally enable the in-app values here
    if (this.settings.originalAudioSettings)
      stepIndex = 40;
    // loop through each byte in the raw adpcm data
    for (let adpcmPtr = 0; adpcmPtr < adpcm.length; adpcmPtr++) {
      let currByte = adpcm[adpcmPtr];
      let currBit = 0;
      while (currBit < 8) {
        // 2 bit sample
        if (stepIndex < 18 || currBit > 4) {
          sample = currByte & 0x3;

          step = ADPCM_STEP_TABLE[stepIndex];
          diff = step >> 3;

          if (sample & 1) diff += step;
          if (sample & 2) diff = -diff;

          predictor += diff;
          stepIndex += ADPCM_INDEX_TABLE_2BIT[sample];

          currByte >>= 2;
          currBit += 2;
        }
        // 4 bit sample
        else {
          sample = currByte & 0xf;

          step = ADPCM_STEP_TABLE[stepIndex];
          diff = step >> 3;

          if (sample & 1) diff += step >> 2;
          if (sample & 2) diff += step >> 1;
          if (sample & 4) diff += step;
          if (sample & 8) diff = -diff;

          predictor += diff;
          stepIndex += ADPCM_INDEX_TABLE_4BIT[sample];

          currByte >>= 4;
          currBit += 4;
        }
        stepIndex = clamp(stepIndex, 0, 79);
        // clamp as 12 bit then scale to 16
        predictor = clamp(predictor, -2048, 2047);
        output[outputPtr] = predictor * 16;
        outputPtr += 1;
      }
    }
    return output.slice(0, outputPtr);
  }

  /** 
   * Get the decoded audio data for a given track, using the specified samplerate
   * @returns Signed 16-bit PCM audio
   * @category Audio
  */
  public getAudioTrackPcm(trackId: FlipnoteAudioTrack, dstFreq = this.sampleRate) {
    const srcPcm = this.decodeAudioTrack(trackId);
    let srcFreq = this.rawSampleRate;
    if (trackId === FlipnoteAudioTrack.BGM) {
      const bgmAdjust = (1 / this.bgmrate) / (1 / this.framerate);
      srcFreq = this.rawSampleRate * bgmAdjust;
    }
    if (srcFreq !== dstFreq) {
      return pcmDsAudioResample(srcPcm, srcFreq, dstFreq);
    }
    return srcPcm;
  }

  private pcmAudioMix(src: Int16Array, dst: Int16Array, dstOffset: number = 0) {
    const srcSize = src.length;
    const dstSize = dst.length;
    for (let n = 0; n < srcSize; n++) {
      if (dstOffset + n > dstSize)
        break;
      // half src volume
      const samp = dst[dstOffset + n] + src[n];
      dst[dstOffset + n] = clamp(samp, -32768, 32767);
    }
  }

  /** 
   * Get the full mixed audio for the Flipnote, using the specified samplerate
   * @returns Signed 16-bit PCM audio
   * @category Audio
  */
  public getAudioMasterPcm(dstFreq = this.sampleRate) {
    const duration = this.frameCount * (1 / this.framerate);
    const dstSize = Math.ceil(duration * dstFreq);
    const master = new Int16Array(dstSize);
    const hasBgm = this.hasAudioTrack(FlipnoteAudioTrack.BGM);
    const hasSe1 = this.hasAudioTrack(FlipnoteAudioTrack.SE1);
    const hasSe2 = this.hasAudioTrack(FlipnoteAudioTrack.SE2);
    const hasSe3 = this.hasAudioTrack(FlipnoteAudioTrack.SE3);
    const hasSe4 = this.hasAudioTrack(FlipnoteAudioTrack.SE4);
    // Mix background music
    if (hasBgm) {
      const bgmPcm = this.getAudioTrackPcm(FlipnoteAudioTrack.BGM, dstFreq);
      this.pcmAudioMix(bgmPcm, master, 0);
    }
    // Mix sound effects
    if (hasSe1 || hasSe2 || hasSe3) {
      const samplesPerFrame = dstFreq / this.framerate;
      const se1Pcm = hasSe1 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE1, dstFreq) : null;
      const se2Pcm = hasSe2 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE2, dstFreq) : null;
      const se3Pcm = hasSe3 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE3, dstFreq) : null;
      const se4Pcm = hasSe4 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE4, dstFreq) : null;
      for (let i = 0; i < this.frameCount; i++) {
        const seFlags = this.getFrameSoundFlags(i);
        const seOffset = Math.ceil(i * samplesPerFrame);
        if (hasSe1 && seFlags[0])
          this.pcmAudioMix(se1Pcm, master, seOffset);
        if (hasSe2 && seFlags[1])
          this.pcmAudioMix(se2Pcm, master, seOffset);
        if (hasSe3 && seFlags[2])
          this.pcmAudioMix(se3Pcm, master, seOffset);
        if (hasSe4 && seFlags[3])
          this.pcmAudioMix(se4Pcm, master, seOffset);
      }
    }
    this.audioClipRatio = pcmGetClippingRatio(master);
    return master;
  }
}