import {
  FlipnoteMeta,
  FlipnoteFormat,
  FlipnoteThumbImageFormat,
  FlipnotePaletteDefinition,
  FlipnoteAudioTrack,
  FlipnoteSoundEffectTrack,
  FlipnoteSoundEffectFlags,
} from './types';

import {
  BaseParser,
} from './BaseParser';

import {
  getPpmFsidRegion,
} from './flipnoteStudioId/ppm';

import {
  // audio
  ADPCM_INDEX_TABLE_4BIT,
  ADPCM_STEP_TABLE,
  pcmResampleNearestNeighbour,
  pcmGetClippingRatio,
  // datetime
  dateFromNintendoTimestamp,
  timeGetNoteDuration,
  // rsa
  rsaLoadPublicKey,
  rsaVerify
} from './common';

import {
  assert,
  assertRange,
  clamp,
} from '../utils';

/** 
 * PPM framerates in frames per second, indexed by the in-app frame speed.
 * Frame speed 0 is never normally used
 */
const PPM_FRAMERATES = [0.5, 0.5, 1, 2, 4, 6, 12, 20, 30];

/** 
 * PPM frame color defines (red, green, blue, alpha)
 */
const PPM_PALETTE: FlipnotePaletteDefinition = {
  WHITE: [0xff, 0xff, 0xff, 0xff],
  BLACK: [0x0e, 0x0e, 0x0e, 0xff],
  RED:   [0xff, 0x2a, 0x2a, 0xff],
  BLUE:  [0x0a, 0x39, 0xff, 0xff]
};

/** 
 * @internal
 * PPM thumbnail color defines (in ABGR order)
 */
const PPM_THUMB_PALETTE = [
  0xFFFFFFFF,
  0xFF525252,
  0xFFFFFFFF,
  0xFF9C9C9C,
  0xFF4448FF,
  0xFF4F51C8,
  0xFFACADFF,
  0xFF00FF00,
  0xFFFF4048,
  0xFFB84F51,
  0xFFFFABAD,
  0xFF00FF00,
  0xFFB757B6,
  0xFF00FF00,
  0xFF00FF00,
  0xFF00FF00,
];

/**
 * RSA public key used to verify that the PPM file signature is genuine.
 * 
 * This **cannot** be used to resign Flipnotes, it can only verify that they are valid
 */
const PPM_PUBLIC_KEY: string = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDCPLwTL6oSflv+gjywi/sM0TUB
90xqOvuCpjduETjPoN2FwMebxNjdKIqHUyDu4AvrQ6BDJc6gKUbZ1E27BGZoCPH4
9zQRb+zAM6M9EjHwQ6BABr0u2TcF7xGg2uQ9MBWz9AfbVQ91NjfrNWo0f7UPmffv
1VvixmTk1BCtavZxBwIDAQAB
-----END PUBLIC KEY-----`;

/** 
 * PPM file metadata, stores information about its playback, author details, etc
 */
export interface PpmMeta extends FlipnoteMeta {
  /** In-app frame playback speed when the BGM audio track was recorded */
  bgmSpeed: number;
};

/**
 * PPM parser options for enabling optimizations and other extra features.
 * None are currently implemented
 */
export type PpmParserSettings = {};

/**
 * Parser class for (DSiWare) Flipnote Studio's PPM animation format.
 * 
 * Format docs: https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format
 * @group File Parser
 */
export class PpmParser extends BaseParser {

  /** Default PPM parser settings */
  static defaultSettings: PpmParserSettings = {};
  /** File format type */
  static format = FlipnoteFormat.PPM;
  /** Animation frame width */
  static width = 256;
  /** Animation frame height */
  static height = 192;
  /** Animation frame aspect ratio */
  static aspect = 3 / 4;
  /** Number of animation frame layers */
  static numLayers = 2;
  /** Number of colors per layer (aside from transparent) */
  static numLayerColors = 1;
  /** Audio track base sample rate */
  static rawSampleRate = 8192;
  /** Nintendo DSi audio output rate */
  static sampleRate = 32768;
  /** Which audio tracks are available in this format */
  static audioTracks = [
    FlipnoteAudioTrack.BGM,
    FlipnoteAudioTrack.SE1,
    FlipnoteAudioTrack.SE2,
    FlipnoteAudioTrack.SE3
  ];
  /** Which sound effect tracks are available in this format */
  static soundEffectTracks = [
    FlipnoteSoundEffectTrack.SE1,
    FlipnoteSoundEffectTrack.SE2,
    FlipnoteSoundEffectTrack.SE3,
  ];
  /** Global animation frame color palette */
  static globalPalette = [
    PPM_PALETTE.WHITE,
    PPM_PALETTE.BLACK,
    PPM_PALETTE.RED,
    PPM_PALETTE.BLUE
  ];
  /** Public key used for Flipnote verification, in PEM format */
  static publicKey = PPM_PUBLIC_KEY;

  static matchBuffer(buffer: ArrayBuffer) {
    // check the buffer's magic to identify which format it uses
    const magicBytes = new Uint8Array(buffer.slice(0, 4));
    const magic = (magicBytes[0] << 24) | (magicBytes[1] << 16) | (magicBytes[2] << 8) | magicBytes[3];
    // check if magic is PARA (ppm magic)
    return magic === 0x50415241;
  }

  /** File format type, reflects {@link PpmParser.format} */
  format = FlipnoteFormat.PPM;
  /** Custom object tag */
  [Symbol.toStringTag] = 'Flipnote Studio PPM animation file';
  /** Animation frame width, reflects {@link PpmParser.width} */
  imageWidth = PpmParser.width;
  /** Animation frame height, reflects {@link PpmParser.height} */
  imageHeight = PpmParser.height;
  /** Animation frame aspect ratio, reflects {@link PpmParser.aspect} */
  aspect = PpmParser.aspect;
  /** X offset for the top-left corner of the animation frame */
  imageOffsetX = 0;
  /** Y offset for the top-left corner of the animation frame */
  imageOffsetY = 0;
  /** Number of animation frame layers, reflects {@link PpmParser.numLayers} */
  numLayers = PpmParser.numLayers;
  /** Number of colors per layer (aside from transparent), reflects {@link PpmParser.numLayerColors} */
  numLayerColors = PpmParser.numLayerColors;
  /** key used for Flipnote verification, in PEM format */
  publicKey = PpmParser.publicKey;
  /** @internal */
  srcWidth = PpmParser.width;
  /** Which audio tracks are available in this format, reflects {@link PpmParser.audioTracks} */
  audioTracks = PpmParser.audioTracks;
  /** Which sound effect tracks are available in this format, reflects {@link PpmParser.soundEffectTracks} */
  soundEffectTracks = PpmParser.soundEffectTracks;
  /** Audio track base sample rate, reflects {@link PpmParser.rawSampleRate} */
  rawSampleRate = PpmParser.rawSampleRate;
  /** Audio output sample rate, reflects {@link PpmParser.sampleRate} */
  sampleRate = PpmParser.sampleRate;
  /** Global animation frame color palette, reflects {@link PpmParser.globalPalette} */
  globalPalette = PpmParser.globalPalette;
  /** File metadata, see {@link PpmMeta} for structure */
  meta: PpmMeta;
  /** File format version; always the same as far as we know */
  version: number;

  private layerBuffers: [Uint8Array, Uint8Array];
  private soundFlags: boolean[][];
  private prevLayerBuffers: [Uint8Array, Uint8Array];
  private lineEncodingBuffers: [Uint8Array, Uint8Array];
  private prevDecodedFrame: number = null;
  private frameDataLength: number;
  private soundDataLength: number;
  private soundDataOffset: number;
  private frameOffsets: Uint32Array;

  /**
   * Create a new PPM file parser instance
   * @param arrayBuffer an ArrayBuffer containing file data
   * @param settings parser settings (none currently implemented)
   */
  constructor(arrayBuffer: ArrayBuffer, settings: Partial<PpmParserSettings> = {}) {
    super(arrayBuffer);
    this.decodeHeader();
    this.decodeAnimationHeader();
    this.decodeSoundHeader();
    // this is always true afaik, it's likely just a remnant from development
    // doesn't hurt to be accurate though...
    if (((this.version >> 4) & 0xf) !== 0) {
      this.decodeMeta();
    }
    // create image buffers
    this.layerBuffers = [
      new Uint8Array(PpmParser.width * PpmParser.height),
      new Uint8Array(PpmParser.width * PpmParser.height)
    ];
    this.prevLayerBuffers = [
      new Uint8Array(PpmParser.width * PpmParser.height),
      new Uint8Array(PpmParser.width * PpmParser.height)
    ];
    this.lineEncodingBuffers = [
      new Uint8Array(PpmParser.height),
      new Uint8Array(PpmParser.height)
    ];
    this.prevDecodedFrame = null;
  }

  private decodeHeader() {
    assert(16 < this.byteLength);
    this.seek(4);
    // decode header
    // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#header
    this.frameDataLength = this.readUint32();
    this.soundDataLength = this.readUint32();
    this.frameCount = this.readUint16() + 1;
    this.version = this.readUint16();
    // sound data offset = frame data offset + frame data length + sound effect flags
    let soundDataOffset = 0x06A0 + this.frameDataLength + this.frameCount;
    if (soundDataOffset % 4 !== 0) soundDataOffset += 4 - (soundDataOffset % 4);
    assert(soundDataOffset < this.byteLength);
    this.soundDataOffset = soundDataOffset;
  }

  private readFilename() {
    const mac = this.readHex(3);
    const random = this.readChars(13);
    const edits = this.readUint16().toString().padStart(3, '0');
    return `${ mac }_${ random }_${ edits }`;
  }

  private decodeMeta() {
    // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#metadata
    assert(0x06A8 < this.byteLength);
    this.seek(0x10);
    const lock = this.readUint16();
    const thumbIndex = this.readInt16();
    const rootAuthorName = this.readWideChars(11);
    const parentAuthorName = this.readWideChars(11);
    const currentAuthorName = this.readWideChars(11);
    const parentAuthorId = this.readHex(8, true);
    const currentAuthorId = this.readHex(8, true);
    const parentFilename = this.readFilename();
    const currentFilename = this.readFilename();
    const rootAuthorId = this.readHex(8, true);
    this.seek(0x9A);
    const timestamp = dateFromNintendoTimestamp(this.readInt32());
    this.seek(0x06A6);
    const flags = this.readUint16();
    this.thumbFrameIndex = thumbIndex;
    this.layerVisibility = {
      1: (flags & 0x10) === 0,
      2: (flags & 0x20) === 0,
      3: false
    };
    this.isSpinoff = (currentAuthorId !== parentAuthorId) || (currentAuthorId !== rootAuthorId);
    this.meta = {
      lock: lock === 1,
      loop: (flags >> 1 & 0x1) === 1,
      isSpinoff: this.isSpinoff,
      frameCount: this.frameCount,
      frameSpeed: this.frameSpeed,
      bgmSpeed: this.bgmSpeed,
      duration: this.duration,
      thumbIndex: thumbIndex,
      timestamp: timestamp,
      root: {
        username: rootAuthorName,
        fsid: rootAuthorId,
        region: getPpmFsidRegion(rootAuthorId),
        filename: null
      },
      parent: {
        username: parentAuthorName,
        fsid: parentAuthorId,
        region: getPpmFsidRegion(parentAuthorId),
        filename: parentFilename
      },
      current: {
        username: currentAuthorName,
        fsid: currentAuthorId,
        region: getPpmFsidRegion(currentAuthorId),
        filename: currentFilename
      },
    };
  }

  private decodeAnimationHeader() {
    // jump to the start of the animation data section
    // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#animation-header
    this.seek(0x06A0);
    const offsetTableLength = this.readUint16();
    const numOffsets = offsetTableLength / 4;
    assert(numOffsets <= this.frameCount);
    // skip padding + flags
    this.seek(0x06A8);
    // read frame offsets and build them into a table
    const frameOffsets = new Uint32Array(numOffsets);
    for (let n = 0; n < numOffsets; n++) {
      const ptr = 0x06A8 + offsetTableLength + this.readUint32();
      assert(ptr < this.byteLength, `Frame ${ n } pointer is out of bounds`);
      frameOffsets[n] = ptr;
    }
    this.frameOffsets = frameOffsets;
  }

  private decodeSoundHeader() {
    // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#sound-header
    let ptr = this.soundDataOffset;
    this.seek(ptr);
    const bgmLen = this.readUint32();
    const se1Len = this.readUint32();
    const se2Len = this.readUint32();
    const se3Len = this.readUint32();
    this.frameSpeed = 8 - this.readUint8();
    this.bgmSpeed = 8 - this.readUint8();
    assert(this.frameSpeed <= 8 && this.bgmSpeed <= 8);
    ptr += 32;
    this.framerate = PPM_FRAMERATES[this.frameSpeed];
    this.duration = timeGetNoteDuration(this.frameCount, this.framerate);
    this.bgmrate = PPM_FRAMERATES[this.bgmSpeed];
    const soundMeta = new Map();
    soundMeta.set(FlipnoteAudioTrack.BGM, {ptr: ptr,           length: bgmLen});
    soundMeta.set(FlipnoteAudioTrack.SE1, {ptr: ptr += bgmLen, length: se1Len});
    soundMeta.set(FlipnoteAudioTrack.SE2, {ptr: ptr += se1Len, length: se2Len});
    soundMeta.set(FlipnoteAudioTrack.SE3, {ptr: ptr += se2Len, length: se3Len});
    this.soundMeta = soundMeta;
  }

  private isKeyFrame(frameIndex: number) {
    assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
    this.seek(this.frameOffsets[frameIndex]);
    const header = this.readUint8();
    return (header >> 7) & 0x1;
  }

  /**
   * Decodes the thumbnail image embedded in the Flipnote. Will return a {@link FlipnoteThumbImage} containing raw RGBA data.
   * 
   * Note: For most purposes, you should probably just decode the thumbnail frame to get a higher resolution image.
   * @group Meta
   */
  getThumbnailImage() {
    this.seek(0xA0);
    const data = this.readBytes(1536);
    const pixels = new Uint32Array(64 * 48);
    let ptr = 0;
    for (let tileY = 0; tileY < 48; tileY += 8) {
      for (let tileX = 0; tileX < 64; tileX += 8) {
        for (let line = 0; line < 8; line += 1) {
          for (let pixel = 0; pixel < 8; pixel += 2) {
            const x = tileX + pixel;
            const y = tileY + line;
            pixels[y * 64 + x] = PPM_THUMB_PALETTE[data[ptr] & 0xF];
            pixels[y * 64 + x + 1] = PPM_THUMB_PALETTE[(data[ptr] << 4) & 0xF];
          }
        }
      }
    }
    return {
      format: FlipnoteThumbImageFormat.Rgba,
      width: 64,
      height: 48,
      data: pixels.buffer
    }
  }
  
  /** 
   * Decode a frame, returning the raw pixel buffers for each layer
   * @group Image
  */
  decodeFrame(frameIndex: number) {
    assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
    // return existing layer buffers if no new frame has been decoded since the last call
    if (this.prevDecodedFrame === frameIndex)
      return this.layerBuffers;
    // if necessary, decode previous frames until a keyframe is reached
    if (this.prevDecodedFrame !== frameIndex - 1 && (!this.isKeyFrame(frameIndex)) && frameIndex !== 0)
      this.decodeFrame(frameIndex - 1);
    this.prevDecodedFrame = frameIndex;
    // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#animation-data
    this.seek(this.frameOffsets[frameIndex]);
    const header = this.readUint8();
    const isKeyFrame = (header >> 7) & 0x1;
    const isTranslated = (header >> 5) & 0x3;
    // reset current layer buffers
    this.layerBuffers[0].fill(0);
    this.layerBuffers[1].fill(0);

    let translateX = 0;
    let translateY = 0;
    if (isTranslated) {
      translateX = this.readInt8();
      translateY = this.readInt8();
    }

    // unpack line encodings for each layer
    for (let layerIndex = 0; layerIndex < 2; layerIndex++) {
      const lineEncodingBuffer = this.lineEncodingBuffers[layerIndex];
      lineEncodingBuffer.fill(0);
      for (let ptr = 0; ptr < lineEncodingBuffer.length;) {
        let byte = this.readUint8();
        // the 4 lines in this byte are all empty (type 0) - skip
        if (byte === 0) {
          ptr += 4;
          continue;
        }
        // unpack 4 line types from the current byte
        lineEncodingBuffer[ptr++] = byte & 0x03;
        lineEncodingBuffer[ptr++] = (byte >> 2) & 0x03;
        lineEncodingBuffer[ptr++] = (byte >> 4) & 0x03;
        lineEncodingBuffer[ptr++] = (byte >> 6) & 0x03;
      }
    }

    // unpack layer bitmaps
    for (let layerIndex = 0; layerIndex < 2; layerIndex++) {
      const pixelBuffer = this.layerBuffers[layerIndex];
      const lineEncodingBuffer = this.lineEncodingBuffers[layerIndex];
      for (let y = 0; y < PpmParser.height; y++) {
        let pixelBufferPtr = y * PpmParser.width;
        const lineType = lineEncodingBuffer[y];
        switch(lineType) {
          // line type 0 = blank line, decode nothing
          case 0:
            break;
          // line type 1 = compressed bitmap line
          case 1:
            // read lineHeader as a big-endian int
            var lineHeader = this.readUint32(false);
            // loop through each bit in the line header
            // shift lineheader to the left by 1 bit every interation, 
            // so on the next loop cycle the next bit will be checked
            // and if the line header equals 0, no more bits are set, 
            // the rest of the line is empty and can be skipped
            for (; lineHeader !== 0; lineHeader <<= 1, pixelBufferPtr += 8) {
              // if the bit is set, this 8-pix wide chunk is stored
              // else we can just leave it blank and move on to the next chunk
              if (lineHeader & 0x80000000) {
                let chunk = this.readUint8();
                // unpack chunk bits
                // the chunk if shifted right 1 bit on every loop
                // if the chunk equals 0, no more bits are set, 
                // so the rest of the chunk is empty and can be skipped
                for (let pixel = 0; chunk !== 0; pixel++, chunk >>= 1)
                  pixelBuffer[pixelBufferPtr + pixel] = chunk & 0x1;
              }
            }
            break;
          // line type 2 = compressed bitmap line like type 1, but all pixels are set to 1 first
          case 2:
            // line type 2 starts as an inverted line
            pixelBuffer.fill(1, pixelBufferPtr, pixelBufferPtr + PpmParser.width);
            // read lineHeader as a big-endian int
            var lineHeader = this.readUint32(false);
            // loop through each bit in the line header
            // shift lineheader to the left by 1 bit every iteration, 
            // so on the next loop cycle the next bit will be checked
            // and if the line header equals 0, no more bits are set, 
            // the rest of the line is empty and can be skipped
            for (; lineHeader !== 0; lineHeader <<= 1, pixelBufferPtr += 8) {
              // if the bit is set, this 8-pix wide chunk is stored
              // else we can just leave it blank and move on to the next chunk
              if (lineHeader & 0x80000000) {
                let chunk = this.readUint8();
                // unpack chunk bits
                for (let pixel = 0; pixel < 8; pixel++, chunk >>= 1)
                  pixelBuffer[pixelBufferPtr + pixel] = chunk & 0x1;
              }
            }
            break;
          // line type 3 = raw bitmap line
          case 3:
            for (let chunk = 0, i = 0; i < PpmParser.width; i++) {
              if (i % 8 === 0)
                chunk = this.readUint8();
              pixelBuffer[pixelBufferPtr++] = chunk & 0x1;
              chunk >>= 1;
            }
            break;
        }
      }
    }
    // if the current frame is based on changes from the previous one, merge them by XORing their values
    const layer1 = this.layerBuffers[0];
    const layer2 = this.layerBuffers[1];
    const layer1Prev = this.prevLayerBuffers[0];
    const layer2Prev = this.prevLayerBuffers[1];
    // fast diffing if the frame isn't translated
    if (!isKeyFrame && translateX === 0 && translateY === 0) {
      const size =  PpmParser.height * PpmParser.width;
      for (let i = 0; i < size; i++) {
        layer1[i] ^= layer1Prev[i];
        layer2[i] ^= layer2Prev[i];
      }
    }
    // slower diffing if the frame is translated
    else if (!isKeyFrame) {
      const w = PpmParser.width;
      const h = PpmParser.height;
      const startX = Math.max(translateX, 0);
      const startY = Math.max(translateY, 0);
      const endX = Math.min(w + translateX, w);
      const endY = Math.min(h + translateY, h);
      const shift = translateY * w + translateX;
      let dest: number, src: number;
      // loop through each line
      for (let y = startY; y < endY; y++) {
        // loop through each pixel in the line
        for (let x = startX; x < endX; x++) {
          dest = y * w + x;
          src = dest - shift;
          // diff pixels with a binary XOR
          layer1[dest] ^= layer1Prev[src];
          layer2[dest] ^= layer2Prev[src];
        }
      }
    }
    // copy the current layer buffers to the previous ones
    this.prevLayerBuffers[0].set(this.layerBuffers[0]);
    this.prevLayerBuffers[1].set(this.layerBuffers[1]);
    return this.layerBuffers;
  }

  /** 
   * Get the color palette indices for a given frame. RGBA colors for these values can be indexed from {@link PpmParser.globalPalette}
   *
   * Returns an array where:
   *  - index 0 is the paper color index
   *  - index 1 is the layer 1 color index
   *  - index 2 is the layer 2 color index
   * @group Image
  */
  getFramePaletteIndices(frameIndex: number) {
    assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
    this.seek(this.frameOffsets[frameIndex]);
    const header = this.readUint8();
    const isInverted = (header & 0x1) !== 1;
    const penMap = [
      isInverted ? 0 : 1, // pen index 0 isn't used in normal cases
      isInverted ? 0 : 1,
      2,
      3,
    ];
    return [
      isInverted ? 1 : 0, // paper
      penMap[(header >> 1) & 0x3], // layer 1 color
      penMap[(header >> 3) & 0x3], // layer 2 color
    ];
  }

  /**
   * Get the RGBA colors for a given frame
   * 
   * Returns an array where:
   *  - index 0 is the paper color
   *  - index 1 is the layer 1 color
   *  - index 2 is the layer 2 color
   * @group Image
   */
  getFramePalette(frameIndex: number) {
    assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
    const indices = this.getFramePaletteIndices(frameIndex);
    return indices.map(colorIndex => this.globalPalette[colorIndex]);
  }

  /**
   * Determines if a given frame is a video key frame or not. This returns an array of booleans for each layer, since in the KWZ format, keyframe encoding is done on a per-layer basis.
   * @param frameIndex
   * @group Image
  */
  getIsKeyFrame(frameIndex: number) {
    const flag = this.isKeyFrame(frameIndex) === 1;
    return [flag, flag];
  }

  /**
   * Get the 3D depths for each layer in a given frame. The PPM format doesn't actually store this information, so `0` is returned for both layers. This method is only here for consistency with KWZ.
   * @param frameIndex
   * @group Image
  */
  getFrameLayerDepths(frameIndex: number) {
    return [0, 0];
  }

  /**
   * Get the FSID for a given frame's original author. The PPM format doesn't actually store this information, so the current author FSID is returned. This method is only here for consistency with KWZ.
   * @param frameIndex
   * @group Meta
  */
  getFrameAuthor(frameIndex: number) {
    return this.meta.current.fsid;
  }

  /** 
   * Get the camera flags for a given frame. The PPM format doesn't actually store this information so `false` will be returned for both layers. This method is only here for consistency with KWZ.
   * @group Image
   * @returns Array of booleans, indicating whether each layer uses a photo or not
  */
  getFrameCameraFlags(frameIndex: number) {
    return [false, false];
  }

  /** 
   * Get the layer draw order for a given frame
   * @group Image
   * @returns Array of layer indices, in the order they should be drawn
  */
  getFrameLayerOrder(frameIndex: number) {
    return [1, 0];
  }

  /** 
   * Get the sound effect flags for every frame in the Flipnote
   * @group Audio
  */
  decodeSoundFlags() {
    if (this.soundFlags !== undefined)
      return this.soundFlags;
    assert(0x06A0 + this.frameDataLength < this.byteLength);
    // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#sound-effect-flags
    this.seek(0x06A0 + this.frameDataLength);
    const numFlags = this.frameCount;
    const flags = this.readBytes(numFlags);
    this.soundFlags = new Array(numFlags);
    for (let i = 0; i < numFlags; i++) {
      const byte = flags[i];
      this.soundFlags[i] = [
        (byte & 0x1) !== 0, // SE1 bitflag
        (byte & 0x2) !== 0, // SE2 bitflag
        (byte & 0x4) !== 0, // SE3 bitflag
      ];
    }
    return this.soundFlags;
  }

  /**
   * Get the sound effect usage flags for every frame
   * @group Audio
   */
  getSoundEffectFlags(): FlipnoteSoundEffectFlags[] {
    return this.decodeSoundFlags().map(frameFlags => ({
      [FlipnoteSoundEffectTrack.SE1]: frameFlags[0],
      [FlipnoteSoundEffectTrack.SE2]: frameFlags[1],
      [FlipnoteSoundEffectTrack.SE3]: frameFlags[2],
      [FlipnoteSoundEffectTrack.SE4]: false
    }));
  }

  /**
   * Get the sound effect usage flags for a given frame
   * @group Audio
   */
  getFrameSoundEffectFlags(frameIndex: number): FlipnoteSoundEffectFlags {
    assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
    this.seek(0x06A0 + this.frameDataLength + frameIndex);
    const byte = this.readUint8();
    return {
      [FlipnoteSoundEffectTrack.SE1]: (byte & 0x1) !== 0,
      [FlipnoteSoundEffectTrack.SE2]: (byte & 0x2) !== 0,
      [FlipnoteSoundEffectTrack.SE3]: (byte & 0x4) !== 0,
      [FlipnoteSoundEffectTrack.SE4]: false
    };
  }

  /** 
   * Get the raw compressed audio data for a given track
   * @returns byte array
   * @group Audio
  */
  getAudioTrackRaw(trackId: FlipnoteAudioTrack) {
    const trackMeta = this.soundMeta.get(trackId);
    assert(trackMeta.ptr + trackMeta.length < this.byteLength);
    this.seek(trackMeta.ptr);
    return this.readBytes(trackMeta.length);
  }
  
  /** 
   * Get the decoded audio data for a given track, using the track's native samplerate
   * @returns Signed 16-bit PCM audio
   * @group Audio
  */
  decodeAudioTrack(trackId: FlipnoteAudioTrack) {
    // note this doesn't resample
    // decode a 4 bit IMA adpcm audio track
    // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#sound-data
    const src = this.getAudioTrackRaw(trackId);
    const srcSize = src.length;
    const dst = new Int16Array(srcSize * 2);
    let srcPtr = 0;
    let dstPtr = 0;
    let sample = 0;
    let stepIndex = 0;
    let predictor = 0;
    let lowNibble = true;
    while (srcPtr < srcSize) {
      // switch between high and low nibble each loop iteration
      // increments srcPtr after every high nibble
      if (lowNibble)
        sample = src[srcPtr] & 0xF;
      else
        sample = src[srcPtr++] >> 4;
      lowNibble = !lowNibble;
      const step = ADPCM_STEP_TABLE[stepIndex];
      let diff = step >> 3;
      if (sample & 1)
        diff += step >> 2;
      if (sample & 2)
        diff += step >> 1;
      if (sample & 4)
        diff += step;
      if (sample & 8)
        diff = -diff;
      predictor += diff;
      predictor = clamp(predictor, -32768, 32767);
      stepIndex += ADPCM_INDEX_TABLE_4BIT[sample];
      stepIndex = clamp(stepIndex, 0, 88);
      dst[dstPtr++] = predictor;
    }
    return dst;
  }

  /** 
   * Get the decoded audio data for a given track, using the specified samplerate
   * @returns Signed 16-bit PCM audio
   * @group Audio
  */
  getAudioTrackPcm(trackId: FlipnoteAudioTrack, dstFreq = this.sampleRate) {
    const srcPcm = this.decodeAudioTrack(trackId);
    let srcFreq = this.rawSampleRate;
    if (trackId === FlipnoteAudioTrack.BGM) {
      const bgmAdjust = (1 / this.bgmrate) / (1 / this.framerate);
      srcFreq = this.rawSampleRate * bgmAdjust;
    }
    if (srcFreq !== dstFreq)
      return pcmResampleNearestNeighbour(srcPcm, srcFreq, dstFreq);
    return srcPcm;
  }

  private pcmAudioMix(src: Int16Array, dst: Int16Array, dstOffset: number = 0) {
    const srcSize = src.length;
    const dstSize = dst.length;
    for (let n = 0; n < srcSize; n++) {
      if (dstOffset + n > dstSize)
        break;
      // half src volume
      const samp = dst[dstOffset + n] + (src[n] / 2);
      dst[dstOffset + n] = clamp(samp, -32768, 32767);
    }
  }

  /** 
   * Get the full mixed audio for the Flipnote, using the specified samplerate
   * @returns Signed 16-bit PCM audio
   * @group Audio
  */
  getAudioMasterPcm(dstFreq = this.sampleRate) {
    const dstSize = Math.ceil(this.duration * dstFreq);
    const master = new Int16Array(dstSize);
    const hasBgm = this.hasAudioTrack(FlipnoteAudioTrack.BGM);
    const hasSe1 = this.hasAudioTrack(FlipnoteAudioTrack.SE1);
    const hasSe2 = this.hasAudioTrack(FlipnoteAudioTrack.SE2);
    const hasSe3 = this.hasAudioTrack(FlipnoteAudioTrack.SE3);
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
      const seFlags = this.decodeSoundFlags();
      for (let frame = 0; frame < this.frameCount; frame++) {
        const seOffset = Math.ceil(frame * samplesPerFrame);
        const flag = seFlags[frame];
        if (hasSe1 && flag[0])
          this.pcmAudioMix(se1Pcm, master, seOffset);
        if (hasSe2 && flag[1])
          this.pcmAudioMix(se2Pcm, master, seOffset);
        if (hasSe3 && flag[2])
          this.pcmAudioMix(se3Pcm, master, seOffset);
      }
    }
    this.audioClipRatio = pcmGetClippingRatio(master);
    return master;
  }

  /**
   * @groupDescription Verification
   * ahsjkhaskjdhaslkhalsdhasldj
   */

  /**
   * Get the body of the Flipnote - the data that is digested for the signature
   * @group Verification
   */
  getBody() {
    const bodyEnd = this.soundDataOffset + this.soundDataLength + 32;
    return this.bytes.subarray(0, bodyEnd);
  }

  /**
  * Get the Flipnote's signature data
  * @group Verification
  */
  getSignature() {
    const bodyEnd = this.soundDataOffset + this.soundDataLength + 32;
    return this.bytes.subarray(bodyEnd, bodyEnd + 128);
  }
  
  /**
   * Verify whether this Flipnote's signature is valid
   * @group Verification
   */
  async verify() {
    const key = await rsaLoadPublicKey(PPM_PUBLIC_KEY, 'SHA-1');
    return await rsaVerify(key, this.getSignature(), this.getBody());
  }
}