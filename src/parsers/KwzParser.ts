import { 
  FlipnoteFormat,
  FlipnotePaletteDefinition,
  FlipnoteAudioTrack,
  FlipnoteSoundEffectTrack,
  FlipnoteSoundEffectFlags,
  FlipnoteMeta,
  FlipnoteParserBase,
  FlipnoteThumbImageFormat
} from './FlipnoteParserBase';

import {
  ADPCM_STEP_TABLE,
  ADPCM_INDEX_TABLE_2BIT,
  ADPCM_INDEX_TABLE_4BIT,
  clamp,
  assert,
  assertRange,
  pcmResampleLinear,
  pcmGetClippingRatio,
  pcmGetRms,
  dateFromNintendoTimestamp,
  timeGetNoteDuration,
  getKwzFsidRegion,
  isKwzDsiLibraryFsid,
  rsaLoadPublicKey,
  rsaVerify,
} from '../utils';

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
 * RSA public key used to verify that the KWZ file signature is genuine.
 * 
 * This **cannot** be used to resign Flipnotes, it can only verify that they are valid
 */
const KWZ_PUBLIC_KEY: string = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuv+zHAXXvbbtRqxADDeJ
ArX2b9RMxj3T+qpRg3FnIE/jeU3tj7eoDzsMduY+D/UT9CSnP+QHYY/vf0n5lqX9
s6ljoZAmyUuruyj1e5Bg+fkDEu/yPEPQjqhbyywCyYL4TEAOJveopUBx9fdQxUJ6
J4J5oCE/Im1kFrlGW+puARiHmt3mmUyNzO8bI/Jx3cGSfoOHJG1foEaQsI5aaKqA
pBqxtzvwqMhudcZtAWSyRMBMlndvkRnVTDNTfTXLOYdHShCIgnKULCTH87uLBIP/
nsmr4/bnQz8q2rp/HyVO+0yjR6mVr0NX5APJQ+6riJmGg3t3VOldhKP7aTHDUW+h
kQIDAQAB
-----END PUBLIC KEY-----`;

/** 
 * Pre computed bitmasks for readBits; done as a slight optimisation
 * @internal
 */
const BITMASKS = new Uint16Array(16);
for (let i = 0; i < 16; i++) {
  BITMASKS[i] = (1 << i) - 1;
}

/** 
 * Every possible sequence of pixels for each 8-pixel line
 * @internal 
 */
const KWZ_LINE_TABLE = new Uint8Array(6561 * 8);
/** 
 * Same lines as KWZ_LINE_TABLE, but the pixels are shift-rotated to the left by one place
 * @internal
 */
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

/**
 * Commonly used lines - represents lines where all the pixels are empty, full, 
 * or include a pattern produced by the paint tool, etc
 * @internal
 */
const KWZ_LINE_TABLE_COMMON = new Uint8Array(32 * 8);
/** 
 * Same lines as common line table, but shift-rotates one place to the left
 * @internal
 */
const KWZ_LINE_TABLE_COMMON_SHIFT = new Uint8Array(32 * 8);

[
  0x0000, 0x0CD0, 0x19A0, 0x02D9, 0x088B, 0x0051, 0x00F3, 0x0009,
  0x001B, 0x0001, 0x0003, 0x05B2, 0x1116, 0x00A2, 0x01E6, 0x0012,
  0x0036, 0x0002, 0x0006, 0x0B64, 0x08DC, 0x0144, 0x00FC, 0x0024,
  0x001C, 0x0004, 0x0334, 0x099C, 0x0668, 0x1338, 0x1004, 0x166C
].forEach((value, i) => {
  const lineTablePtr = value * 8;
  const pixels = KWZ_LINE_TABLE.subarray(lineTablePtr, lineTablePtr + 8);
  const shiftPixels = KWZ_LINE_TABLE_SHIFT.subarray(lineTablePtr, lineTablePtr + 8);
  KWZ_LINE_TABLE_COMMON.set(pixels, i * 8);
  KWZ_LINE_TABLE_COMMON_SHIFT.set(shiftPixels, i * 8);
});

/** 
 * KWZ section types
 * @internal
 */
export type KwzSectionMagic = 'KFH' | 'KTN' | 'KMC' | 'KMI' | 'KSN' | 'KIC';

/** 
 * KWZ section map, tracking their offset and length
 * @internal
 */
export type KwzSectionMap = Map<KwzSectionMagic, {
  ptr: number, 
  length: number
}>;

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
 * KWZ parser options for enabling optimizations and other extra features
 */
export type KwzParserSettings = {
  /** 
   * Skip full metadata parsing for quickness
   */
  quickMeta: boolean;
  /** 
   * Apply special cases for DSi library notes
   */ 
  dsiLibraryNote: boolean;
  /** 
   * Automatically crop out the border around any frames
   */ 
  borderCrop: boolean;
  /**
   * Nintendo messed up the initial adpcm state for a bunch of the PPM to KWZ conversions on DSi Library. They are effectively random.
   * By default flipnote.js will try to make a best guess, but you can disable this and provide your own state values
   * 
   * This is only enabled if `dsiLibraryNote` is also set to `true`
   */
  guessInitialBgmState: boolean;
  /**
   * Manually provide the initial adpcm step index for the BGM track.
   * 
   * This is only enabled if `dsiLibraryNote` is also set to `true`
   */
  initialBgmStepIndex: number | null;
  /**
   * Manually provide the initial adpcm predictor for the BGM track.
   * 
   * This is only enabled if `dsiLibraryNote` is also set to `true`
   */
  initialBgmPredictor: number | null;
  /**
   * Manually provide an initial adpcm step index for each sound effect track.
   * 
   * This is only enabled if `dsiLibraryNote` is also set to `true`
   */
  initialSeStepIndices: number[] | null;
  /**
   * Manually provide an initial adpcm predictor for each sound effect track.
   * 
   * This is only enabled if `dsiLibraryNote` is also set to `true`
   */
  initialSePredictors: number[] | null;
};

/** 
 * Parser class for Flipnote Studio 3D's KWZ animation format
 * 
 * KWZ format docs: https://github.com/Flipnote-Collective/flipnote-studio-3d-docs/wiki/KWZ-Format
 * @category File Parser
 */
export class KwzParser extends FlipnoteParserBase {

  /** Default KWZ parser settings */
  static defaultSettings: KwzParserSettings = {
    quickMeta: false,
    dsiLibraryNote: false,
    borderCrop: false,
    guessInitialBgmState: true,
    initialBgmPredictor: null,
    initialBgmStepIndex: null,
    initialSePredictors: null,
    initialSeStepIndices: null,
  };
  /** File format type */
  static format = FlipnoteFormat.KWZ;
  /** Animation frame width */
  static width = 320;
  /** Animation frame height */
  static height = 240;
  /** Animation frame aspect ratio */
  static aspect = 3 / 4;
  /** Number of animation frame layers */
  static numLayers = 3;
  /** Number of colors per layer (aside from transparent) */
  static numLayerColors = 2;
  /** Audio track base sample rate */
  static rawSampleRate = 16364;
  /** Audio output sample rate  */
  static sampleRate = 32768;
  /** Which audio tracks are available in this format */
  static audioTracks = [
    FlipnoteAudioTrack.BGM,
    FlipnoteAudioTrack.SE1,
    FlipnoteAudioTrack.SE2,
    FlipnoteAudioTrack.SE3,
    FlipnoteAudioTrack.SE4,
  ];
  /** Which sound effect tracks are available in this format */
  static soundEffectTracks = [
    FlipnoteSoundEffectTrack.SE1,
    FlipnoteSoundEffectTrack.SE2,
    FlipnoteSoundEffectTrack.SE3,
    FlipnoteSoundEffectTrack.SE4,
  ];
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
  /** Public key used for Flipnote verification, in PEM format */
  static publicKey = KWZ_PUBLIC_KEY;
  
  /** File format type, reflects {@link KwzParser.format} */
  format = FlipnoteFormat.KWZ;
  /** Custom object tag */
  [Symbol.toStringTag] = 'Flipnote Studio 3D KWZ animation file';
  /** Animation frame width, reflects {@link KwzParser.width} */
  imageWidth = KwzParser.width;
  /** Animation frame height, reflects {@link KwzParser.height} */
  imageHeight = KwzParser.height;
  /** Animation frame aspect ratio, reflects {@link KwzParser.aspect} */
  aspect = KwzParser.aspect;
  /** X offset for the top-left corner of the animation frame */
  imageOffsetX = 0;
  /** Y offset for the top-left corner of the animation frame */
  imageOffsetY = 0;
  /** Number of animation frame layers, reflects {@link KwzParser.numLayers} */
  numLayers = KwzParser.numLayers;
  /** Number of colors per layer (aside from transparent), reflects {@link KwzParser.numLayerColors} */
  numLayerColors = KwzParser.numLayerColors;
  /** key used for Flipnote verification, in PEM format */
  publicKey = KwzParser.publicKey;
  /** @internal */
  srcWidth = KwzParser.width;
  /** Which audio tracks are available in this format, reflects {@link KwzParser.audioTracks} */
  audioTracks = KwzParser.audioTracks;
  /** Which sound effect tracks are available in this format, reflects {@link KwzParser.soundEffectTracks} */
  soundEffectTracks = KwzParser.soundEffectTracks;
  /** Audio track base sample rate, reflects {@link KwzParser.rawSampleRate} */
  rawSampleRate = KwzParser.rawSampleRate;
  /** Audio output sample rate, reflects {@link KwzParser.sampleRate} */
  sampleRate = KwzParser.sampleRate;
  /** Global animation frame color palette, reflects {@link KwzParser.globalPalette} */
  globalPalette = KwzParser.globalPalette;
  /** File metadata, see {@link KwzMeta} for structure */
  meta: KwzMeta;

  private settings: KwzParserSettings;
  private sectionMap: KwzSectionMap;
  private bodyEndOffset: number;
  private layerBuffers: [Uint8Array, Uint8Array, Uint8Array];
  private soundFlags: boolean[][]; // sound effect flag cache
  private prevDecodedFrame: number = null;
  // private frameMeta: Map<number, KwzFrameMeta>;
  private frameMetaOffsets: Uint32Array;
  private frameDataOffsets: Uint32Array;
  private frameLayerSizes: [number, number, number][];
  private bitIndex = 0;
  private bitValue = 0;
  
  /**
   * Create a new KWZ file parser instance
   * @param arrayBuffer an ArrayBuffer containing file data
   * @param settings parser settings
   */
  constructor(arrayBuffer: ArrayBuffer, settings: Partial<KwzParserSettings> = {}) {
    super(arrayBuffer);
    this.settings = {...KwzParser.defaultSettings, ...settings};
    this.layerBuffers = [
      new Uint8Array(KwzParser.width * KwzParser.height),
      new Uint8Array(KwzParser.width * KwzParser.height),
      new Uint8Array(KwzParser.width * KwzParser.height),
    ];
    // skip through the file and read all of the section headers so we can locate them
    this.buildSectionMap();
    // if the KIC section is present, we're dealing with a folder icon
    // these are single-frame KWZs without a KFH section for metadata, or a KSN section for sound
    // while the data for a full frame (320*240) is present, only the top-left 24*24 pixels are used
    if (this.sectionMap.has('KIC')) {
      this.isFolderIcon = true;
      // icons still use the full 320 * 240 frame size, so we just set up our image crop to deal with that
      this.imageWidth = 24;
      this.imageHeight = 24;
      this.frameCount = 1;
      this.frameSpeed = 0;
      this.framerate = KWZ_FRAMERATES[0];
      this.thumbFrameIndex = 0;
      this.getFrameOffsets();
    }
    // if the KSN section is not present, then this is a handwritten comment from the Flipnote Gallery World online service
    // these are single-frame KWZs, just with no sound
    else if (!this.sectionMap.has('KSN')) {
      this.isComment = true; 
      this.decodeMeta();
      this.getFrameOffsets();
    }
    // else let's assume this is a regular note
    else {
      this.decodeMeta();
      this.getFrameOffsets();
      this.decodeSoundHeader();
    }

    // apply special optimizations for converted DSi library notes
    if (this.settings.dsiLibraryNote) {
      this.isDsiLibraryNote = true;
    }
    
    // automatically crop out the border around every frame
    if (this.settings.borderCrop) {
      // dsi library notes can be cropped to their original resolution
      if (this.isDsiLibraryNote) {
        this.imageOffsetX = 32;
        this.imageOffsetY = 24;
        this.imageWidth = 256;
        this.imageHeight = 192;
      }
      // even standard notes have a bit of a border...
      else if (!this.isFolderIcon) {
        this.imageOffsetX = 5;
        this.imageOffsetY = 5;
        this.imageWidth = 310;
        this.imageHeight = 230;
      }
    }
  }
  
  private buildSectionMap() {
    const fileSize = this.byteLength - 256;
    const sectionMap = new Map();
    let sectionCount = 0;
    let ptr = 0;
    // counting sections should mitigate against one of mrnbayoh's notehax exploits
    while (ptr < fileSize && sectionCount < 6) {
      this.seek(ptr);
      const magic = this.readChars(4).substring(0, 3) as KwzSectionMagic;
      const length = this.readUint32();
      sectionMap.set(magic, { ptr, length });
      ptr += length + 8;
      sectionCount += 1;
    }
    this.bodyEndOffset = ptr;
    this.sectionMap = sectionMap;
    assert(sectionMap.has('KMC') && sectionMap.has('KMI'));
  }

  private readBits(num: number) {
    // assert(num < 16);
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

  private readFsid() {
    if (this.settings.dsiLibraryNote) { // format as DSi PPM FSID
      const hex = this.readHex(10, true);
      return hex.slice(2, 18);
    }
    const hex = this.readHex(10);
    return `${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 18)}`.toLowerCase();
  }

  private readFilename() {
    const ptr = this.pointer;
    const chars = this.readChars(28);
    if (chars.length === 28)
      return chars;
    // Otherwise, this is likely a DSi Library note, 
    // where sometimes Nintendo's buggy PPM converter includes the original packed PPM filename
    this.seek(ptr);
    const mac = this.readHex(3);
    const random = this.readChars(13);
    const edits = this.readUint16().toString().padStart(3, '0');
    this.seek(ptr + 28);
    return `${ mac }_${ random }_${ edits }`;
  }

  private decodeMeta() {
    if (this.settings.quickMeta)
      return this.decodeMetaQuick();
    assert(this.sectionMap.has('KFH'));
    this.seek(this.sectionMap.get('KFH').ptr + 12);
    const creationTime = dateFromNintendoTimestamp(this.readUint32());
    const modifiedTime = dateFromNintendoTimestamp(this.readUint32());
    // const simonTime = 
    const appVersion = this.readUint32();
    const rootAuthorId = this.readFsid();
    const parentAuthorId = this.readFsid();
    const currentAuthorId = this.readFsid();
    const rootAuthorName = this.readWideChars(11);
    const parentAuthorName = this.readWideChars(11);
    const currentAuthorName = this.readWideChars(11);
    const rootFilename = this.readFilename();
    const parentFilename = this.readFilename();
    const currentFilename = this.readFilename();
    const frameCount = this.readUint16();
    const thumbIndex = this.readUint16();
    const flags = this.readUint16();
    const frameSpeed = this.readUint8();
    const layerFlags = this.readUint8();
    this.isSpinoff = (currentAuthorId !== parentAuthorId) || (currentAuthorId !== rootAuthorId);
    this.frameCount = frameCount;
    this.frameSpeed = frameSpeed;
    this.framerate = KWZ_FRAMERATES[frameSpeed];
    this.duration = timeGetNoteDuration(this.frameCount, this.framerate);
    this.thumbFrameIndex = thumbIndex;
    this.layerVisibility = {
      1: (layerFlags & 0x1) === 0,
      2: (layerFlags & 0x2) === 0,
      3: (layerFlags & 0x3) === 0,
    };
    // Try to auto-detect whether the current author ID matches a converted PPM ID
    // if (isKwzDsiLibraryFsid(currentAuthorId)) {
    //   this.isDsiLibraryNote = true;
    // }
    this.meta = {
      lock: (flags & 0x1) !== 0,
      loop: (flags & 0x2) !== 0,
      isSpinoff: this.isSpinoff,
      frameCount: frameCount,
      frameSpeed: frameSpeed,
      duration: this.duration,
      thumbIndex: thumbIndex,
      timestamp: modifiedTime,
      creationTimestamp: creationTime,
      root: {
        username: rootAuthorName,
        fsid: rootAuthorId,
        region: getKwzFsidRegion(rootAuthorId),
        filename: rootFilename,
        isDsiFilename: rootFilename.length !== 28
      },
      parent: {
        username: parentAuthorName,
        fsid: parentAuthorId,
        region: getKwzFsidRegion(parentAuthorId),
        filename: parentFilename,
        isDsiFilename: parentFilename.length !== 28
      },
      current: {
        username: currentAuthorName,
        fsid: currentAuthorId,
        region: getKwzFsidRegion(currentAuthorId),
        filename: currentFilename,
        isDsiFilename: currentFilename.length !== 28
      },
    };
  }

  private decodeMetaQuick() {
    assert(this.sectionMap.has('KFH'));
    this.seek(this.sectionMap.get('KFH').ptr + 0x8 + 0xC4);
    const frameCount = this.readUint16();
    const thumbFrameIndex = this.readUint16();
    const flags = this.readUint16();
    const frameSpeed = this.readUint8();
    const layerFlags = this.readUint8();
    this.frameCount = frameCount;
    this.thumbFrameIndex = thumbFrameIndex;
    this.frameSpeed = frameSpeed;
    this.framerate = KWZ_FRAMERATES[frameSpeed];
    this.duration = timeGetNoteDuration(this.frameCount, this.framerate);
    this.layerVisibility = {
      1: (layerFlags & 0x1) === 0,
      2: (layerFlags & 0x2) === 0,
      3: (layerFlags & 0x3) === 0,
    };
  }

  private getFrameOffsets() {
    assert(this.sectionMap.has('KMI') && this.sectionMap.has('KMC'));
    const numFrames = this.frameCount;
    const kmiSection = this.sectionMap.get('KMI');
    const kmcSection = this.sectionMap.get('KMC');
    assert(kmiSection.length / 28 >= numFrames);
    const frameMetaOffsets = new Uint32Array(numFrames);
    const frameDataOffsets = new Uint32Array(numFrames);
    const frameLayerSizes: [number, number, number][] = [];
    let frameMetaPtr = kmiSection.ptr + 8;
    let frameDataPtr = kmcSection.ptr + 12;
    for (let frameIndex = 0; frameIndex < numFrames; frameIndex++) {
      this.seek(frameMetaPtr + 4);
      const layerASize = this.readUint16();
      const layerBSize = this.readUint16();
      const layerCSize = this.readUint16();
      frameMetaOffsets[frameIndex] = frameMetaPtr
      frameDataOffsets[frameIndex] = frameDataPtr;
      frameMetaPtr += 28;
      frameDataPtr += layerASize + layerBSize + layerCSize;
      assert(frameMetaPtr < this.byteLength, `frame${ frameIndex } meta pointer out of bounds`);
      assert(frameDataPtr < this.byteLength, `frame${ frameIndex } data pointer out of bounds`);
      frameLayerSizes.push([layerASize, layerBSize, layerCSize]);
    }
    this.frameMetaOffsets = frameMetaOffsets;
    this.frameDataOffsets = frameDataOffsets;
    this.frameLayerSizes = frameLayerSizes;
  }

  private decodeSoundHeader() {
    assert(this.sectionMap.has('KSN'));
    let ptr = this.sectionMap.get('KSN').ptr + 8;
    this.seek(ptr);
    this.bgmSpeed = this.readUint32();
    assert(this.bgmSpeed <= 10);
    this.bgmrate = KWZ_FRAMERATES[this.bgmSpeed];
    const trackSizes = new Uint32Array(this.buffer, ptr + 4, 20);
    const soundMeta = new Map();
    soundMeta.set(FlipnoteAudioTrack.BGM, {ptr: ptr += 28,            length: trackSizes[0]});
    soundMeta.set(FlipnoteAudioTrack.SE1, {ptr: ptr += trackSizes[0], length: trackSizes[1]});
    soundMeta.set(FlipnoteAudioTrack.SE2, {ptr: ptr += trackSizes[1], length: trackSizes[2]});
    soundMeta.set(FlipnoteAudioTrack.SE3, {ptr: ptr += trackSizes[2], length: trackSizes[3]});
    soundMeta.set(FlipnoteAudioTrack.SE4, {ptr: ptr += trackSizes[3], length: trackSizes[4]});
    this.soundMeta = soundMeta;
  }

  /**
   * Decodes the thumbnail image embedded in the Flipnote. Will return a {@link FlipnoteThumbImage} containing JPEG data.
   * 
   * Note: For most purposes, you should probably just decode the thumbnail fraa to get a higher resolution image.
   * @category Meta
   */
  getThumbnailImage() {
    assert(this.sectionMap.has('KTN'), 'KTN section missing - Note that folder icons and comments do not contain thumbnail data');
    const ktn = this.sectionMap.get('KTN');
    this.seek(ktn.ptr + 12);
    const bytes = this.readBytes(ktn.length - 12);
    return {
      format: FlipnoteThumbImageFormat.Jpeg,
      width: 80,
      height: 64,
      data: bytes.buffer
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
  getFramePaletteIndices(frameIndex: number) {
    assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
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
  getFramePalette(frameIndex: number) {
    assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
    const indices = this.getFramePaletteIndices(frameIndex);
    return indices.map(colorIndex => this.globalPalette[colorIndex]);
  }

  private getFrameDiffingFlag(frameIndex: number) {
    assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
    this.seek(this.frameMetaOffsets[frameIndex]);
    return (this.readUint32() >> 4) & 0x07;
  }

  /**
   * Determines if a given frame is a video key frame or not. This returns an array of booleans for each layer, since keyframe encoding is done on a per-layer basis.
   * @param frameIndex
   * @category Image
  */
  getIsKeyFrame(frameIndex: number) {
    const flag = this.getFrameDiffingFlag(frameIndex);
    return [
      (flag & 0x1) === 0,
      (flag & 0x2) === 0,
      (flag & 0x4) === 0,
    ];
  }

  /**
   * Get the 3D depths for each layer in a given frame.
   * @param frameIndex
   * @category Image
  */
  getFrameLayerDepths(frameIndex: number) {
    assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
    this.seek(this.frameMetaOffsets[frameIndex] + 0x14);
    return [
      this.readUint8(),
      this.readUint8(),
      this.readUint8()
    ];
  }

  /**
   * Get the FSID for a given frame's original author.
   * @param frameIndex
   * @category Meta
  */
  getFrameAuthor(frameIndex: number) {
    assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
    this.seek(this.frameMetaOffsets[frameIndex] + 0xA);
    return this.readFsid();
  }

  /** 
   * Get the camera flags for a given frame
   * @category Image
   * @returns Array of booleans, indicating whether each layer uses a photo or not
  */
  getFrameCameraFlags(frameIndex: number) {
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
  */
  getFrameLayerOrder(frameIndex: number) {
    assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
    const depths = this.getFrameLayerDepths(frameIndex);
    return [2, 1, 0].sort((a, b) => depths[b] - depths[a]);
  }

  /** 
   * Decode a frame, returning the raw pixel buffers for each layer
   * @category Image
  */
  decodeFrame(frameIndex: number, diffingFlag = 0x7, isPrevFrame = false) {
    assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
    // return existing layer buffers if no new frame has been decoded since the last call
    if (this.prevDecodedFrame === frameIndex)
      return this.layerBuffers;
    // the prevDecodedFrame check is an optimization for decoding frames in full sequence
    if (this.prevDecodedFrame !== frameIndex - 1 && frameIndex !== 0) {
      // if this frame is being decoded as a prev frame, then we only want to decode the layers necessary
      // diffingFlag is negated with ~ so if no layers are diff-based, diffingFlag is 0
      if (isPrevFrame)
        diffingFlag = diffingFlag & ~this.getFrameDiffingFlag(frameIndex + 1);
      // if diffing flag isn't 0, decode the previous frame before this one
      if (diffingFlag !== 0)
        this.decodeFrame(frameIndex - 1, diffingFlag, true);
    }
    
    let framePtr = this.frameDataOffsets[frameIndex];
    const layerSizes = this.frameLayerSizes[frameIndex];

    for (let layerIndex = 0; layerIndex < 3; layerIndex++) {
      // dsi gallery conversions don't use the third layer, so it can be skipped if this is set
      if (this.settings.dsiLibraryNote && layerIndex === 3)
        break;

      this.seek(framePtr);
      let layerSize = layerSizes[layerIndex];
      framePtr += layerSize;
      const pixelBuffer = this.layerBuffers[layerIndex];

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
      let skipTileCounter = 0;

      for (let tileOffsetY = 0; tileOffsetY < 240; tileOffsetY += 128) {
        for (let tileOffsetX = 0; tileOffsetX < 320; tileOffsetX += 128) {
          // loop small tiles
          for (let subTileOffsetY = 0; subTileOffsetY < 128; subTileOffsetY += 8) {
            const y = tileOffsetY + subTileOffsetY;
            if (y >= 240)
              break;

            for (let subTileOffsetX = 0; subTileOffsetX < 128; subTileOffsetX += 8) {
              const x = tileOffsetX + subTileOffsetX;
              if (x >= 320)
                break;

              // continue to next tile loop if skipTileCounter is > 0
              if (skipTileCounter > 0) {
                skipTileCounter -= 1;
                continue;
              }

              let pixelBufferPtr = y * KwzParser.width + x;
              const tileType = this.readBits(3);

              if (tileType === 0) {
                const linePtr = this.readBits(5) * 8;
                const pixels = KWZ_LINE_TABLE_COMMON.subarray(linePtr, linePtr + 8);
                pixelBuffer.set(pixels, pixelBufferPtr);
                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                pixelBuffer.set(pixels, pixelBufferPtr += 320);
              } 

              else if (tileType === 1) {
                const linePtr = this.readBits(13) * 8;
                const pixels = KWZ_LINE_TABLE.subarray(linePtr, linePtr + 8);
                pixelBuffer.set(pixels, pixelBufferPtr);
                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                pixelBuffer.set(pixels, pixelBufferPtr += 320);
              } 
              
              else if (tileType === 2) {
                const linePtr = this.readBits(5) * 8;
                const a = KWZ_LINE_TABLE_COMMON.subarray(linePtr, linePtr + 8);
                const b = KWZ_LINE_TABLE_COMMON_SHIFT.subarray(linePtr, linePtr + 8);
                pixelBuffer.set(a, pixelBufferPtr);
                pixelBuffer.set(b, pixelBufferPtr += 320);
                pixelBuffer.set(a, pixelBufferPtr += 320);
                pixelBuffer.set(b, pixelBufferPtr += 320);
                pixelBuffer.set(a, pixelBufferPtr += 320);
                pixelBuffer.set(b, pixelBufferPtr += 320);
                pixelBuffer.set(a, pixelBufferPtr += 320);
                pixelBuffer.set(b, pixelBufferPtr += 320);
              } 
              
              else if (tileType === 3) {
                const linePtr = this.readBits(13) * 8;
                const a = KWZ_LINE_TABLE.subarray(linePtr, linePtr + 8);
                const b = KWZ_LINE_TABLE_SHIFT.subarray(linePtr, linePtr + 8);
                pixelBuffer.set(a, pixelBufferPtr);
                pixelBuffer.set(b, pixelBufferPtr += 320);
                pixelBuffer.set(a, pixelBufferPtr += 320);
                pixelBuffer.set(b, pixelBufferPtr += 320);
                pixelBuffer.set(a, pixelBufferPtr += 320);
                pixelBuffer.set(b, pixelBufferPtr += 320);
                pixelBuffer.set(a, pixelBufferPtr += 320);
                pixelBuffer.set(b, pixelBufferPtr += 320);
              }

              // most common tile type
              else if (tileType === 4) {
                const flags = this.readBits(8);
                for (let mask = 1; mask < 0xFF; mask <<= 1) {
                  if (flags & mask) {
                    const linePtr = this.readBits(5) * 8;
                    const pixels = KWZ_LINE_TABLE_COMMON.subarray(linePtr, linePtr + 8);
                    pixelBuffer.set(pixels, pixelBufferPtr);
                  }
                  else {
                    const linePtr = this.readBits(13) * 8;
                    const pixels = KWZ_LINE_TABLE.subarray(linePtr, linePtr + 8);
                    pixelBuffer.set(pixels, pixelBufferPtr);
                  }
                  pixelBufferPtr += 320;
                }
              }

              else if (tileType === 5) {
                skipTileCounter = this.readBits(5);
                continue;
              }

              // type 6 doesnt exist

              else if (tileType === 7) {
                let pattern = this.readBits(2);
                let useCommonLines = this.readBits(1);
                let a, b;

                if (useCommonLines !== 0) {
                  const linePtrA = this.readBits(5) * 8;
                  const linePtrB = this.readBits(5) * 8;
                  a = KWZ_LINE_TABLE_COMMON.subarray(linePtrA, linePtrA + 8);
                  b = KWZ_LINE_TABLE_COMMON.subarray(linePtrB, linePtrB + 8);
                  pattern += 1;
                } 
                else {
                  const linePtrA = this.readBits(13) * 8;
                  const linePtrB = this.readBits(13) * 8;
                  a = KWZ_LINE_TABLE.subarray(linePtrA, linePtrA + 8);
                  b = KWZ_LINE_TABLE.subarray(linePtrB, linePtrB + 8);
                }

                switch (pattern % 4) {
                  case 0:
                    pixelBuffer.set(a, pixelBufferPtr);
                    pixelBuffer.set(b, pixelBufferPtr += 320);
                    pixelBuffer.set(a, pixelBufferPtr += 320);
                    pixelBuffer.set(b, pixelBufferPtr += 320);
                    pixelBuffer.set(a, pixelBufferPtr += 320);
                    pixelBuffer.set(b, pixelBufferPtr += 320);
                    pixelBuffer.set(a, pixelBufferPtr += 320);
                    pixelBuffer.set(b, pixelBufferPtr += 320);
                    break;
                  case 1:
                    pixelBuffer.set(a, pixelBufferPtr);
                    pixelBuffer.set(a, pixelBufferPtr += 320);
                    pixelBuffer.set(b, pixelBufferPtr += 320);
                    pixelBuffer.set(a, pixelBufferPtr += 320);
                    pixelBuffer.set(a, pixelBufferPtr += 320);
                    pixelBuffer.set(b, pixelBufferPtr += 320);
                    pixelBuffer.set(a, pixelBufferPtr += 320);
                    pixelBuffer.set(a, pixelBufferPtr += 320);
                    break;
                  case 2:
                    pixelBuffer.set(a, pixelBufferPtr);
                    pixelBuffer.set(b, pixelBufferPtr += 320);
                    pixelBuffer.set(a, pixelBufferPtr += 320);
                    pixelBuffer.set(a, pixelBufferPtr += 320);
                    pixelBuffer.set(b, pixelBufferPtr += 320);
                    pixelBuffer.set(a, pixelBufferPtr += 320);
                    pixelBuffer.set(a, pixelBufferPtr += 320);
                    pixelBuffer.set(b, pixelBufferPtr += 320);
                    break;
                  case 3:
                    pixelBuffer.set(a, pixelBufferPtr);
                    pixelBuffer.set(b, pixelBufferPtr += 320);
                    pixelBuffer.set(b, pixelBufferPtr += 320);
                    pixelBuffer.set(a, pixelBufferPtr += 320);
                    pixelBuffer.set(b, pixelBufferPtr += 320);
                    pixelBuffer.set(b, pixelBufferPtr += 320);
                    pixelBuffer.set(a, pixelBufferPtr += 320);
                    pixelBuffer.set(b, pixelBufferPtr += 320);
                    break;
                }
              }
            }
          }
        }
      }
    }
    this.prevDecodedFrame = frameIndex;
    return this.layerBuffers;
  }

  private decodeFrameSoundFlags(frameIndex: number) {
    assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
    this.seek(this.frameMetaOffsets[frameIndex] + 0x17);
    const soundFlags = this.readUint8();
    return [
      (soundFlags & 0x1) !== 0,
      (soundFlags & 0x2) !== 0,
      (soundFlags & 0x4) !== 0,
      (soundFlags & 0x8) !== 0,
    ];
  }

  /** 
   * Get the sound effect flags for every frame in the Flipnote
   * @category Audio
  */
  decodeSoundFlags() {
    if (this.soundFlags !== undefined)
      return this.soundFlags;
    this.soundFlags = new Array(this.frameCount)
      .fill(false)
      .map((_, i) => this.decodeFrameSoundFlags(i))
    return this.soundFlags;
  }

  /**
   * Get the sound effect usage flags for every frame
   * @category Audio
   */
  getSoundEffectFlags(): FlipnoteSoundEffectFlags[] {
    return this.decodeSoundFlags().map((frameFlags) => ({
      [FlipnoteSoundEffectTrack.SE1]: frameFlags[0],
      [FlipnoteSoundEffectTrack.SE2]: frameFlags[1],
      [FlipnoteSoundEffectTrack.SE3]: frameFlags[2],
      [FlipnoteSoundEffectTrack.SE4]: frameFlags[3],
    }));  
  }

  /**
   * Get the sound effect usage for a given frame
   * @param frameIndex
   * @category Audio
   */
  getFrameSoundEffectFlags(frameIndex: number): FlipnoteSoundEffectFlags {
    const frameFlags = this.decodeFrameSoundFlags(frameIndex);
    return {
      [FlipnoteSoundEffectTrack.SE1]: frameFlags[0],
      [FlipnoteSoundEffectTrack.SE2]: frameFlags[1],
      [FlipnoteSoundEffectTrack.SE3]: frameFlags[2],
      [FlipnoteSoundEffectTrack.SE4]: frameFlags[3],
    };
  }

  /** 
   * Get the raw compressed audio data for a given track
   * @returns Byte array
   * @category Audio
  */
  getAudioTrackRaw(trackId: FlipnoteAudioTrack) {
    const trackMeta = this.soundMeta.get(trackId);
    assert(trackMeta.ptr + trackMeta.length < this.byteLength);
    return new Uint8Array(this.buffer, trackMeta.ptr, trackMeta.length);
  }

  private decodeAdpcm(src: Uint8Array, dst: Int16Array, predictor = 0, stepIndex = 0) {
    const srcSize = src.length;
    let dstPtr = 0;
    let sample = 0;
    let step = 0;
    let diff = 0;
    // loop through each byte in the raw adpcm data
    for (let srcPtr = 0; srcPtr < srcSize; srcPtr++) {
      let currByte = src[srcPtr];
      let currBit = 0;
      while (currBit < 8) {
        // 2 bit sample
        if (stepIndex < 18 || currBit > 4) {
          sample = currByte & 0x3;
          step = ADPCM_STEP_TABLE[stepIndex];
          diff = step >> 3;
          if (sample & 1)
            diff += step;
          if (sample & 2)
            diff = -diff;
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
          if (sample & 1) 
            diff += step >> 2;
          if (sample & 2) 
            diff += step >> 1;
          if (sample & 4)
            diff += step;
          if (sample & 8)
            diff = -diff;
          predictor += diff;
          stepIndex += ADPCM_INDEX_TABLE_4BIT[sample];
          currByte >>= 4;
          currBit += 4;
        }
        stepIndex = clamp(stepIndex, 0, 79);
        // clamp as 12 bit then scale to 16
        predictor = clamp(predictor, -2048, 2047);
        dst[dstPtr] = predictor * 16;
        dstPtr += 1;
      }
    }
    return dstPtr;
  }

  /** 
   * Get the decoded audio data for a given track, using the track's native samplerate
   * @returns Signed 16-bit PCM audio
   * @category Audio
  */
  decodeAudioTrack(trackId: FlipnoteAudioTrack) {
    const settings = this.settings;
    const src = this.getAudioTrackRaw(trackId);
    const dstSize = this.rawSampleRate * 60; // enough for 60 seconds, the max bgm size
    const dst = new Int16Array(dstSize);
    // initial decoder state
    let predictor = 0;
    let stepIndex = 40;
    // Nintendo messed up the initial adpcm state for a bunch of the PPM conversions on DSi Library
    // they are effectively random, so you can optionally provide your own state values, or let the lib make a best guess
    if (this.isDsiLibraryNote) {
      if (trackId === FlipnoteAudioTrack.BGM) {
        // passing an initial index or predictor value should disable bruteforcing
        let doGuess = true;
        // allow manual overrides for default predictor
        if (settings.initialBgmPredictor !== null) {
          predictor = settings.initialBgmPredictor;
          doGuess = false;
        }

        // allow manual overrides for default step index
        if (settings.initialBgmStepIndex !== null) {
          stepIndex = settings.initialBgmStepIndex;
          doGuess = false
        }

        // bruteforce step index by finding the lowest track root mean square 
        if (doGuess && settings.guessInitialBgmState) {
          let bestRms = 0xFFFFFFFF; // arbitrarily large
          let bestStepIndex = 0;
          for (stepIndex = 0; stepIndex <= 40; stepIndex++) {
            const dstPtr = this.decodeAdpcm(src, dst, predictor, stepIndex);
            const rms = pcmGetRms(dst.subarray(0, dstPtr)); // uses same underlying memory as dst
            if (rms < bestRms) {
              bestRms = rms;
              bestStepIndex = stepIndex;
            }
          }
          stepIndex = bestStepIndex;
        }
      }
      else {
        const trackIndex = this.soundEffectTracks.indexOf(trackId as any);
        // allow manual overrides for default predictor
        if (Array.isArray(settings.initialSePredictors) && settings.initialSePredictors[trackIndex] !== undefined)
          predictor = settings.initialSePredictors[trackIndex];
        // allow manual overrides for default step index
        if (Array.isArray(settings.initialSeStepIndices) && settings.initialSeStepIndices[trackIndex] !== undefined)
          stepIndex = settings.initialSeStepIndices[trackIndex];
      }
    }
    // decode track
    const dstPtr = this.decodeAdpcm(src, dst, predictor, stepIndex);
    // copy part of dst with slice() so dst buffer can be garbage collected
    return dst.slice(0, dstPtr);
  }

  /** 
   * Get the decoded audio data for a given track, using the specified samplerate
   * @returns Signed 16-bit PCM audio
   * @category Audio
  */
  getAudioTrackPcm(trackId: FlipnoteAudioTrack, dstFreq = this.sampleRate) {
    const srcPcm = this.decodeAudioTrack(trackId);
    let srcFreq = this.rawSampleRate;
    if (trackId === FlipnoteAudioTrack.BGM) {
      const bgmAdjust = (1 / this.bgmrate) / (1 / this.framerate);
      srcFreq = this.rawSampleRate * bgmAdjust;
    }
    if (srcFreq !== dstFreq)
      return pcmResampleLinear(srcPcm, srcFreq, dstFreq);

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
  getAudioMasterPcm(dstFreq = this.sampleRate) {
    const dstSize = Math.ceil(this.duration * dstFreq);
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
    if (hasSe1 || hasSe2 || hasSe3 || hasSe4) {
      const samplesPerFrame = dstFreq / this.framerate;
      const se1Pcm = hasSe1 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE1, dstFreq) : null;
      const se2Pcm = hasSe2 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE2, dstFreq) : null;
      const se3Pcm = hasSe3 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE3, dstFreq) : null;
      const se4Pcm = hasSe4 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE4, dstFreq) : null;
      const soundEffectFlags = this.decodeSoundFlags();
      for (let i = 0; i < this.frameCount; i++) {
        const seFlags = soundEffectFlags[i];
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

  /**
   * Get the body of the Flipnote - the data that is digested for the signature
   * @category Verification
   */
  getBody() {
    const bodyEnd = this.bodyEndOffset;
    return this.bytes.subarray(0, bodyEnd);
  }

  /**
   * Get the Flipnote's signature data
   * @category Verification
   */
  getSignature() {
    const bodyEnd = this.bodyEndOffset;
    return this.bytes.subarray(bodyEnd, bodyEnd + 256);
  }

  /**
   * Verify whether this Flipnote's signature is valid
   * @category Verification
   */
  async verify() {
    const key = await rsaLoadPublicKey(KWZ_PUBLIC_KEY, 'SHA-256');
    return await rsaVerify(key, this.getSignature(), this.getBody());
  }
}