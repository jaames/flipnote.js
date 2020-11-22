import { 
  FlipnoteFormat,
  FlipnotePaletteDefinition,
  FlipnoteAudioTrack,
  FlipnoteParserBase
} from './FlipnoteParserBase';

import {
  KWZ_LINE_TABLE,
  KWZ_LINE_TABLE_SHIFT,
  KWZ_LINE_TABLE_COMMON,
  KWZ_LINE_TABLE_COMMON_SHIFT
} from './kwzTables';

import {
  clamp,
  pcmDsAudioResample,
  pcmAudioMix,
  ADPCM_INDEX_TABLE_2BIT,
  ADPCM_INDEX_TABLE_4BIT,
  ADPCM_SAMPLE_TABLE_2BIT,
  ADPCM_SAMPLE_TABLE_4BIT
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
/** @internal */
const KWZ_OUTPUT_SAMPLE_RATE = 32768; // probably wronng

/** 
 * Pre computed bitmasks for readBits; done as a slight optimisation
 * @internal
 */
const BITMASKS = new Uint16Array(16);
for (let i = 0; i < 16; i++) {
  BITMASKS[i] = (1 << i) - 1;
}

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
export interface KwzMeta {
  /** Flipnote lock state. Locked Flipnotes cannot be edited by anyone other than the current author */
  lock: boolean;
  /** Playback loop state. If `true`, playback will loop once the end is reached */
  loop: boolean;
  /** Total number of animation frames */
  frame_count: number;
  /** In-app animation playback speed, range 0 to 10 */
  frame_speed: number;
  /** Index of the animation frame used as the Flipnote's thumbnail image */
  thumb_index: number;
  /** Date representing when the file was last edited */
  timestamp: Date;
  /** Date representing when the file was created */
  creation_timestamp: Date;
  /** Metadata about the author of the original Flipnote file */
  root: {
    filename: string;
    username: string;
    fsid: string;
  },
  /** Metadata about the previous author of the Flipnote file */
  parent: {
    filename: string;
    username: string;
    fsid: string;
  },
  /** Metadata about the current author of the Flipnote file */
  current: {
    filename: string;
    username: string;
    fsid: string;
  },
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
  quickMeta?: boolean;
  /** Apply special cases for dsi gallery notes */ 
  dsiGalleryNote?: boolean;
  /** Apply minor audio fix, which is technically more correct but not accurate to the app's own adpcm decoder */
  fixAdpcmStepIndex?: boolean;
};

/** 
 * Parser class for Flipnote Studio 3D's KWZ animation format
 * 
 * Format docs: https://github.com/Flipnote-Collective/flipnote-studio-3d-docs/wiki/KWZ-Format
 * @category File Parser
 */
export class KwzParser extends FlipnoteParserBase<KwzMeta> {

  /** Default KWZ parser settings */
  static defaultSettings: KwzParserSettings = {
    quickMeta: false,
    dsiGalleryNote: false,
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
  static sampleRate = KWZ_OUTPUT_SAMPLE_RATE;
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
      frame_count: frameCount,
      frame_speed: frameSpeed,
      thumb_index: thumbIndex,
      timestamp: modifiedTimestamp,
      creation_timestamp: creationTimestamp,
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
    let outputOffset = 0;
    // initial decoder state
    let prevDiff = 0;
    let prevStepIndex = 40;
    // Flipnote 3D's audio decoder is actually incorrect, so we can optionally trigger "correct" audio decoding here
    if (this.settings.fixAdpcmStepIndex)
      prevStepIndex = 0;
    let sample: number;
    let diff: number;
    let stepIndex: number;
    // loop through each byte in the raw adpcm data
    for (let adpcmOffset = 0; adpcmOffset < adpcm.length; adpcmOffset++) {
      const byte = adpcm[adpcmOffset];
      let bitPos = 0;
      while (bitPos < 8) {
        if (prevStepIndex < 18 || bitPos == 6) {
          // isolate 2-bit sample
          sample = (byte >> bitPos) & 0x3;
          // get diff
          diff = prevDiff + ADPCM_SAMPLE_TABLE_2BIT[sample + 4 * prevStepIndex];
          // get step index
          stepIndex = prevStepIndex + ADPCM_INDEX_TABLE_2BIT[sample];
          bitPos += 2;
        }
        else {
          // isolate 4-bit sample
          sample = (byte >> bitPos) & 0xF;
          // get diff
          diff = prevDiff + ADPCM_SAMPLE_TABLE_4BIT[sample + 16 * prevStepIndex];
          // get step index
          stepIndex = prevStepIndex + ADPCM_INDEX_TABLE_4BIT[sample];
          bitPos += 4;
        }
        // clamp step index and diff
        stepIndex = clamp(stepIndex, 0, 79);
        diff = clamp(diff, -2047, 2047);
        // add result to output buffer
        output[outputOffset] = (diff * 16);
        outputOffset += 1;
        // set prev decoder state
        prevStepIndex = stepIndex;
        prevDiff = diff;
      }
    }
    return output.slice(0, outputOffset);
  }

  /** 
   * Get the decoded audio data for a given track, using the specified samplerate
   * @returns Signed 16-bit PCM audio
   * @category Audio
  */
  public getAudioTrackPcm(trackId: FlipnoteAudioTrack, dstFreq: number = KWZ_OUTPUT_SAMPLE_RATE) {
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

  /** 
   * Get the full mixed audio for the Flipnote, using the specified samplerate
   * @returns Signed 16-bit PCM audio
   * @category Audio
  */
  public getAudioMasterPcm(dstFreq: number = KWZ_OUTPUT_SAMPLE_RATE) {
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
      pcmAudioMix(bgmPcm, master, 0);
    }
    // Mix sound effects
    if (hasSe1 || hasSe2 || hasSe3) {
      const samplesPerFrame = Math.floor(dstFreq / this.framerate);
      const se1Pcm = hasSe1 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE1, dstFreq) : null;
      const se2Pcm = hasSe2 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE2, dstFreq) : null;
      const se3Pcm = hasSe3 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE3, dstFreq) : null;
      const se4Pcm = hasSe4 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE4, dstFreq) : null;
      for (let i = 0; i < this.frameCount; i++) {
        const seFlags = this.getFrameSoundFlags(i);
        const seOffset = samplesPerFrame * i;
        if (hasSe1 && seFlags[0])
          pcmAudioMix(se1Pcm, master, seOffset);
        if (hasSe2 && seFlags[1])
          pcmAudioMix(se2Pcm, master, seOffset);
        if (hasSe3 && seFlags[2])
          pcmAudioMix(se3Pcm, master, seOffset);
        if (hasSe4 && seFlags[3])
          pcmAudioMix(se4Pcm, master, seOffset);
      }
    }
    return master;
  }
}