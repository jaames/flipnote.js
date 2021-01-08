/**
 * PPM decoder
 * Reads frames, audio, and metadata from Flipnote Studio PPM files 
 * Based on my Python PPM decoder implementation (https://github.com/jaames/flipnote-tools)
 *  
 * Credits:
 *  PPM format reverse-engineering and documentation:
 *   - bricklife (http://ugomemo.g.hatena.ne.jp/bricklife/20090307/1236391313)
 *   - mirai-iro (http://mirai-iro.hatenablog.jp/entry/20090116/ugomemo_ppm)
 *   - harimau_tigris (http://ugomemo.g.hatena.ne.jp/harimau_tigris)
 *   - steven (http://www.dsibrew.org/wiki/User:Steven)
 *   - yellows8 (http://www.dsibrew.org/wiki/User:Yellows8)
 *   - PBSDS (https://github.com/pbsds)
 *   - jaames (https://github.com/jaames)
 *  Identifying the PPM sound codec:
 *   - Midmad from Hatena Haiku
 *   - WDLMaster from hcs64.com
 *  Helping me to identify issues with the Python decoder that this is based on:
 *   - Austin Burk (https://sudomemo.net)
 * 
 *  Lastly, a huge thanks goes to Nintendo for creating Flipnote Studio, 
 *  and to Hatena for providing the Flipnote Hatena online service, both of which inspired so many c:
*/

import { 
  FlipnoteFormat,
  FlipnotePaletteDefinition,
  FlipnoteAudioTrack,
  FlipnoteMeta,
  FlipnoteParser
} from './FlipnoteParserTypes';

import {
  ADPCM_INDEX_TABLE_4BIT,
  ADPCM_STEP_TABLE,
  clamp,
  pcmResampleNearestNeighbour,
  pcmGetClippingRatio,
  assert,
  dateFromNintendoTimestamp,
  timeGetNoteDuration,
  getPpmFsidRegion
} from '../utils';

/** 
 * PPM framerates in frames per second, indexed by the in-app frame speed.
 * Frame speed 0 is never noramally used
 */
const PPM_FRAMERATES = [0.5, 0.5, 1, 2, 4, 6, 12, 20, 30];
/** 
 * PPM color defines (red, green, blue, alpha)
 */
const PPM_PALETTE: FlipnotePaletteDefinition = {
  WHITE: [0xff, 0xff, 0xff, 0xff],
  BLACK: [0x0e, 0x0e, 0x0e, 0xff],
  RED:   [0xff, 0x2a, 0x2a, 0xff],
  BLUE:  [0x0a, 0x39, 0xff, 0xff]
};

/** 
 * PPM file metadata, stores information about its playback, author details, etc
 */
export interface PpmMeta extends FlipnoteMeta {
  /** In-app frame playback speed when the BGM audio track was recorded */
  bgmSpeed: number;
};

/**
 * PPM parser options for enabling optimisations and other extra features.
 * None are currently implemented
 */
export type PpmParserSettings = {};

/**
 * Parser class for (DSiWare) Flipnote Studio's PPM animation format.
 * 
 * Format docs: https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format
 * @category File Parser
 */
export class PpmParser extends FlipnoteParser {

  /** Default PPM parser settings */
  static defaultSettings: PpmParserSettings = {};
  /** File format type */
  static format = FlipnoteFormat.PPM;
  /** Animation frame width */
  static width = 256;
  /** Animation frame height */
  static height = 192;
  /** Number of animation frame layers */
  static numLayers = 2;
  /** Audio track base sample rate */
  static rawSampleRate = 8192;
  /** Nintendo DSi audio output rate */
  static sampleRate = 32768; 
  /** Global animation frame color palette */
  static globalPalette = [
    PPM_PALETTE.WHITE,
    PPM_PALETTE.BLACK,
    PPM_PALETTE.RED,
    PPM_PALETTE.BLUE
  ];

  /** File format type, reflects {@link PpmParser.format} */
  public format = FlipnoteFormat.PPM;
  /** Animation frame width, reflects {@link PpmParser.width} */
  public imageWidth = PpmParser.width;
  /** Animation frame height, reflects {@link PpmParser.height} */
  public imageHeight = PpmParser.height;
  /** X offset for the top-left corner of the animation frame */
  public imageOffsetX = 0;
  /** Y offset for the top-left corner of the animation frame */
  public imageOffsetY = 0;
  /** Number of animation frame layers, reflects {@link PpmParser.numLayers} */
  public numLayers = PpmParser.numLayers;
  /** Audio track base sample rate, reflects {@link PpmParser.rawSampleRate} */
  public rawSampleRate = PpmParser.rawSampleRate;
  /** Audio output sample rate, reflects {@link PpmParser.sampleRate} */
  public sampleRate = PpmParser.sampleRate;
  /** Global animation frame color palette, reflects {@link PpmParser.globalPalette} */
  public globalPalette = PpmParser.globalPalette;
  /** File metadata, see {@link PpmMeta} for structure */
  public meta: PpmMeta;
  /** File format version; always the same as far as we know */
  public version: number;

  private layerBuffers: [Uint8Array, Uint8Array];
  private prevLayerBuffers: [Uint8Array, Uint8Array];
  private lineEncodingBuffers: [Uint8Array, Uint8Array];
  private prevDecodedFrame: number = null;
  private frameDataLength: number;
  private soundDataLength: number;
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

  static validateFSID(fsid: string) {
    return /[0159]{1}[0-9A-F]{6}0[0-9A-F]{8}/.test(fsid);
  }

  static validateFilename(filename: string) {
    return /[0-9A-F]{6}_[0-9A-F]{13}_[0-9]{3}/.test(filename);
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
    // offset = frame data offset + frame data length + sound effect flags
    let ptr = 0x06A0 + this.frameDataLength + this.frameCount;
    assert(ptr < this.byteLength);
    // align offset
    if (ptr % 4 != 0)
      ptr += 4 - (ptr % 4);
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

  private isNewFrame(frameIndex: number) {
    this.seek(this.frameOffsets[frameIndex]);
    const header = this.readUint8();
    return (header >> 7) & 0x1;
  }
  
  /** 
   * Decode a frame, returning the raw pixel buffers for each layer
   * @category Image
  */
  public decodeFrame(frameIndex: number) {
    assert(frameIndex > -1 && frameIndex < this.frameCount, `Frame index ${ frameIndex } out of bounds`);
    if (this.prevDecodedFrame !== frameIndex - 1 && (!this.isNewFrame(frameIndex)) && frameIndex !== 0)
      this.decodeFrame(frameIndex - 1);
    this.prevDecodedFrame = frameIndex;
    // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#animation-data
    this.seek(this.frameOffsets[frameIndex]);
    const header = this.readUint8();
    const isNewFrame = (header >> 7) & 0x1;
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
    // if the current frame is based on changes from the preivous one, merge them by XORing their values
    const layer1 = this.layerBuffers[0];
    const layer2 = this.layerBuffers[1];
    const layer1Prev = this.prevLayerBuffers[0];
    const layer2Prev = this.prevLayerBuffers[1];
    if (!isNewFrame) {
      let dest: number, src: number;
      // loop through each line
      for (let y = 0; y < PpmParser.height; y++) {
        // skip to next line if this one falls off the top edge of the screen
        if (y - translateY < 0)
          continue;
        // stop once the bottom screen edge has been reached
        if (y - translateY >= PpmParser.height)
          break;
        // loop through each pixel in the line
        for (let x = 0; x < PpmParser.width; x++) {
          // skip to the next pixel if this one falls off the left edge of the screen
          if (x - translateX < 0)
            continue;
          // stop diffing this line once the right screen edge has been reached
          if (x - translateX >= PpmParser.width)
            break;
          dest = x + y * PpmParser.width;
          src = dest - (translateX + translateY * PpmParser.width);
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
   * Get the layer draw order for a given frame
   * @category Image
   * @returns Array of layer indexes, in the order they should be drawn
  */
  public getFrameLayerOrder(frameIndex?: number) {
    return [0, 1];
  }

  /** 
   * Get the color palette indices for a given frame. RGBA colors for these values can be indexed from {@link PpmParser.globalPalette}
   *
   * Returns an array where:
   *  - index 0 is the paper color index
   *  - index 1 is the layer 1 color index
   *  - index 2 is the layer 2 color index
   * @category Image
  */
  public getFramePaletteIndices(frameIndex: number) {
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
   * @category Image
   */
  public getFramePalette(frameIndex: number) {
    const indices = this.getFramePaletteIndices(frameIndex);
    return indices.map(colorIndex => this.globalPalette[colorIndex]);
  }

  /** 
   * Get the pixels for a given frame layer
   * @category Image
  */
  public getLayerPixels(frameIndex: number, layerIndex: number) {
    if (this.prevDecodedFrame !== frameIndex) {
      this.decodeFrame(frameIndex);
    }
    const palette = this.getFramePaletteIndices(frameIndex);
    const layer = this.layerBuffers[layerIndex];
    const image = new Uint8Array(PpmParser.width * PpmParser.height);
    const layerColor = palette[layerIndex + 1];
    for (let pixel = 0; pixel < image.length; pixel++) {
      if (layer[pixel] === 1)
        image[pixel] = layerColor;
    }
    return image;
  }

  /** 
   * Get the pixels for a given frame
   * @category Image
  */
  public getFramePixels(frameIndex: number) {
    const palette = this.getFramePaletteIndices(frameIndex);
    const layers = this.decodeFrame(frameIndex);
    const image = new Uint8Array(PpmParser.width * PpmParser.height);
    const layer1 = layers[0];
    const layer2 = layers[1];
    const paperColor = palette[0];
    const layer1Color = palette[1];
    const layer2Color = palette[2];
    image.fill(paperColor);
    for (let pixel = 0; pixel < image.length; pixel++) {
      const a = layer1[pixel];
      const b = layer2[pixel];
      if (a === 1)
        image[pixel] = layer1Color;
      else if (b === 1)
        image[pixel] = layer2Color;
    }
    return image;
  }

  /** 
   * Get the sound effect flags for every frame in the Flipnote
   * @category Audio
  */
  public decodeSoundFlags() {
    assert(0x06A0 + this.frameDataLength < this.byteLength);
    // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#sound-effect-flags
    this.seek(0x06A0 + this.frameDataLength);
    const numFlags = this.frameCount;
    const flags = this.readBytes(numFlags);
    const unpacked = new Array(numFlags);
    for (let i = 0; i < numFlags; i++) {
      const byte = flags[i];
      unpacked[i] = [
        (byte & 0x1) !== 0, // SE1 bitflag
        (byte & 0x2) !== 0, // SE2 bitflag
        (byte & 0x4) !== 0, // SE3 bitflag
      ];
    }
    return unpacked;
  }

  /** 
   * Get the raw compressed audio data for a given track
   * @returns byte array
   * @category Audio
  */
  public getAudioTrackRaw(trackId: FlipnoteAudioTrack) {
    const trackMeta = this.soundMeta.get(trackId);
    assert(trackMeta.ptr + trackMeta.length < this.byteLength);
    this.seek(trackMeta.ptr);
    return this.readBytes(trackMeta.length);
  }
  
  /** 
   * Get the decoded audio data for a given track, using the track's native samplerate
   * @returns Signed 16-bit PCM audio
   * @category Audio
  */
  public decodeAudioTrack(trackId: FlipnoteAudioTrack) {
    // note this doesn't resample
    // TODO: kinda slow, maybe use sample lookup table
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
   * @category Audio
  */
  public getAudioTrackPcm(trackId: FlipnoteAudioTrack, dstFreq = this.sampleRate) {
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
   * @category Audio
  */
  public getAudioMasterPcm(dstFreq = this.sampleRate) {
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
}