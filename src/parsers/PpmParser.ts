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
  FlipnoteParserBase
} from './FlipnoteParserBase';

import {
  clamp,
  pcmDsAudioResample,
  pcmAudioMix,
  ADPCM_INDEX_TABLE_4BIT,
  ADPCM_STEP_TABLE
} from './audioUtils';

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
/** @internal */
const PPM_OUTPUT_SAMPLE_RATE = 32768;

/** 
 * PPM file metadata, stores information about its playback, author details, etc
 */
export interface PpmMeta {
  /** File lock state. Locked Flipnotes cannot be edited by anyone other than the current author */
  lock: boolean;
  /** Playback loop state. If `true`, playback will loop once the end is reached */
  loop: boolean;
  /** Total number of animation frames */
  frame_count: number;
  /** In-app frame playback speed, range 1 to 8 */
  frame_speed: number;
  /** In-app frame playback speed when the BGM audio track was recorded */
  bgm_speed: number;
  /** Index of the animation frame used as the Flipnote's thumbnail image */
  thumb_index: number;
  /** Date representing when the file was last edited */
  timestamp: Date;
  /** Spinoffs are remixes of another user's Flipnote */
  spinoff: boolean;
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
 * PPM parser options for enabling optimisations and other extra features.
 * None are currently implemented
 */
export interface PpmParserSettings {};

/**
 * Parser class for (DSiWare) Flipnote Studio's PPM animation format.
 * 
 * Format docs: https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format
 * @category File Parser
 */
export class PpmParser extends FlipnoteParserBase<PpmMeta> {

  /** Default PPM parser settings */
  static defaultSettings: PpmParserSettings = {};
  /** File format type */
  static format: FlipnoteFormat.PPM;
  /** Animation frame width */
  static width: number = 256;
  /** Animation frame height */
  static height: number = 192;
  /** Audio track base sample rate */
  static rawSampleRate: number = 8192;
  /** Nintendo DSi audui output rate */
  static sampleRate: number = PPM_OUTPUT_SAMPLE_RATE; 
  /** Global animation frame color palette */
  static globalPalette = [
    PPM_PALETTE.WHITE,
    PPM_PALETTE.BLACK,
    PPM_PALETTE.RED,
    PPM_PALETTE.BLUE
  ];

  /** File format type, reflects {@link PpmParser.format} */
  public format: FlipnoteFormat.PPM;
  /** Animation frame width, reflects {@link PpmParser.width} */
  public width: number = PpmParser.width;
  /** Animation frame height, reflects {@link PpmParser.height} */
  public height: number = PpmParser.height;
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

  private layers: [Uint8Array, Uint8Array];
  private prevLayers: [Uint8Array, Uint8Array];
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
    this.layers = [
      new Uint8Array(PpmParser.width * PpmParser.height),
      new Uint8Array(PpmParser.width * PpmParser.height)
    ];
    this.prevLayers = [
      new Uint8Array(PpmParser.width * PpmParser.height),
      new Uint8Array(PpmParser.width * PpmParser.height)
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
    this.seek(0);
    // decode header
    // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#header
    let magic = this.readUint32();
    this.frameDataLength = this.readUint32();
    this.soundDataLength = this.readUint32();
    this.frameCount = this.readUint16() + 1;
    this.version = this.readUint16();
  }

  private readFilename() {
    return [
      this.readHex(3),
      this.readChars(13),
      this.readUint16().toString().padStart(3, '0')
    ].join('_');
  }

  private decodeMeta() {
    // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#metadata
    this.seek(0x10);
    const lock = this.readUint16(),
          thumbIndex = this.readInt16(),
          rootAuthorName = this.readWideChars(11),
          parentAuthorName = this.readWideChars(11),
          currentAuthorName = this.readWideChars(11),
          parentAuthorId = this.readHex(8, true),
          currentAuthorId = this.readHex(8, true),
          parentFilename = this.readFilename(),
          currentFilename = this.readFilename(),
          rootAuthorId = this.readHex(8, true);
    this.seek(0x9A);
    const timestamp = new Date((this.readUint32() + 946684800) * 1000);
    this.seek(0x06A6);
    const flags = this.readUint16();
    this.thumbFrameIndex = thumbIndex;
    this.meta = {
      lock: lock === 1,
      loop: (flags >> 1 & 0x01) === 1,
      frame_count: this.frameCount,
      frame_speed: this.frameSpeed,
      bgm_speed: this.bgmSpeed,
      thumb_index: thumbIndex,
      timestamp: timestamp,
      spinoff: (currentAuthorId !== parentAuthorId) || (currentAuthorId !== rootAuthorId),
      root: {
        filename: null,
        username: rootAuthorName,
        fsid: rootAuthorId,
      },
      parent: {
        username: parentAuthorName,
        fsid: parentAuthorId,
        filename: parentFilename
      },
      current: {
        username: currentAuthorName,
        fsid: currentAuthorId,
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
    // skip padding + flags
    this.seek(0x06A8);
    // read frame offsets and build them into a table
    const frameOffsets = new Uint32Array(numOffsets);
    for (let n = 0; n < numOffsets; n++) {
      frameOffsets[n] = 0x06A8 + offsetTableLength + this.readUint32();
    }
    this.frameOffsets = frameOffsets;
  }

  private decodeSoundHeader() {
    // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#sound-header
    // offset = frame data offset + frame data length + sound effect flags
    let offset = 0x06A0 + this.frameDataLength + this.frameCount;
    // account for multiple-of-4 padding
    if (offset % 4 != 0)
      offset += 4 - (offset % 4);
    this.seek(offset);
    const bgmLen = this.readUint32();
    const se1Len = this.readUint32();
    const se2Len = this.readUint32();
    const se3Len = this.readUint32();
    this.frameSpeed = 8 - this.readUint8();
    this.bgmSpeed = 8 - this.readUint8();
    offset += 32;
    this.framerate = PPM_FRAMERATES[this.frameSpeed];
    this.bgmrate = PPM_FRAMERATES[this.bgmSpeed];
    this.soundMeta = {
      [FlipnoteAudioTrack.BGM]: {offset: offset,           length: bgmLen},
      [FlipnoteAudioTrack.SE1]: {offset: offset += bgmLen, length: se1Len},
      [FlipnoteAudioTrack.SE2]: {offset: offset += se1Len, length: se2Len},
      [FlipnoteAudioTrack.SE3]: {offset: offset += se2Len, length: se3Len},
    };
  }

  private isNewFrame(frameIndex: number) {
    this.seek(this.frameOffsets[frameIndex]);
    const header = this.readUint8();
    return (header >> 7) & 0x1;
  }

  private readLineEncoding() {
    const unpacked = new Uint8Array(PpmParser.height);
    let unpackedPtr = 0;
    for (var byteIndex = 0; byteIndex < 48; byteIndex ++) {
      const byte = this.readUint8();
      // each line's encoding type is stored as a 2-bit value
      for (var bitOffset = 0; bitOffset < 8; bitOffset += 2) {
        unpacked[unpackedPtr++] = (byte >> bitOffset) & 0x03;
      }
    }
    return unpacked;
  }
  
  /** 
   * Decode a frame, returning the raw pixel buffers for each layer
   * @category Image
  */
  public decodeFrame(frameIndex: number) {
    if ((this.prevDecodedFrame !== frameIndex - 1) && (!this.isNewFrame(frameIndex) && (frameIndex !== 0)))
      this.decodeFrame(frameIndex - 1);
    // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#animation-data
    this.seek(this.frameOffsets[frameIndex]);
    const header = this.readUint8();
    const isNewFrame = (header >> 7) & 0x1;
    const isTranslated = (header >> 5) & 0x3;
    let translateX = 0;
    let translateY = 0;
    this.prevDecodedFrame = frameIndex;
    // reset current layer buffers
    this.layers[0].fill(0);
    this.layers[1].fill(0);

    if (isTranslated) {
      translateX = this.readInt8();
      translateY = this.readInt8();
    }

    const layerEncoding = [
      this.readLineEncoding(),
      this.readLineEncoding(),
    ];
     // start decoding layer bitmaps
    for (let layer = 0; layer < 2; layer++) {
      const layerBitmap = this.layers[layer];
      for (let line = 0; line < PpmParser.height; line++) {
        const lineType = layerEncoding[layer][line];
        let lineOffset = line * PpmParser.width;
        switch(lineType) {
          // line type 0 = blank line, decode nothing
          case 0:
            break;
          // line types 1 + 2 = compressed bitmap line
          case 1:
          case 2:
            let lineHeader = this.readUint32(false);
            // line type 2 starts as an inverted line
            if (lineType == 2)
              layerBitmap.fill(1, lineOffset, lineOffset + PpmParser.width);
            // loop through each bit in the line header
            while (lineHeader & 0xFFFFFFFF) {
              // if the bit is set, this 8-pix wide chunk is stored
              // else we can just leave it blank and move on to the next chunk
              if (lineHeader & 0x80000000) {
                const chunk = this.readUint8();
                // unpack chunk bits
                for (let pixel = 0; pixel < 8; pixel++) {
                  layerBitmap[lineOffset + pixel] = chunk >> pixel & 0x1;
                }
              }
              lineOffset += 8;
              // shift lineheader to the left by 1 bit, now on the next loop cycle the next bit will be checked
              lineHeader <<= 1;
            }
            break;
          // line type 3 = raw bitmap line
          case 3:
            while(lineOffset < (line + 1) * PpmParser.width) {
              const chunk = this.readUint8();
              for (let pixel = 0; pixel < 8; pixel++) {
                layerBitmap[lineOffset + pixel] = chunk >> pixel & 0x1;
              }
              lineOffset += 8;
            }
            break;
        }
      }
    }
    // if the current frame is based on changes from the preivous one, merge them by XORing their values
    const layer1 = this.layers[0];
    const layer2 = this.layers[1];
    const layer1Prev = this.prevLayers[0];
    const layer2Prev = this.prevLayers[1];
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
    this.prevLayers[0].set(this.layers[0]);
    this.prevLayers[1].set(this.layers[1]);
    return this.layers;
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
    const layer = this.layers[layerIndex];
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
    const trackMeta = this.soundMeta[trackId];
    this.seek(trackMeta.offset);
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
      // switch between hi and lo nibble each loop iteration
      // increments srcPtr after every hi nibble
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
  public getAudioTrackPcm(trackId: FlipnoteAudioTrack, dstFreq: number = PPM_OUTPUT_SAMPLE_RATE) {
    const srcPcm = this.decodeAudioTrack(trackId);
    let srcFreq = this.rawSampleRate;
    if (trackId === FlipnoteAudioTrack.BGM) {
      const bgmAdjust = Math.round(this.framerate / this.bgmrate);
      srcFreq = this.rawSampleRate * bgmAdjust;
    }
    if (srcFreq !== dstFreq)
      return pcmDsAudioResample(srcPcm, srcFreq, dstFreq);
    return srcPcm;
  }

  /** 
   * Get the full mixed audio for the Flipnote, using the specified samplerate
   * @returns Signed 16-bit PCM audio
   * @category Audio
  */
  public getAudioMasterPcm(dstFreq: number = PPM_OUTPUT_SAMPLE_RATE) {
    const duration = this.frameCount * (1 / this.framerate);
    const dstSize = Math.ceil(duration * dstFreq);
    const master = new Int16Array(dstSize);
    const hasBgm = this.hasAudioTrack(FlipnoteAudioTrack.BGM);
    const hasSe1 = this.hasAudioTrack(FlipnoteAudioTrack.SE1);
    const hasSe2 = this.hasAudioTrack(FlipnoteAudioTrack.SE2);
    const hasSe3 = this.hasAudioTrack(FlipnoteAudioTrack.SE3);
    // Mix background music
    if (hasBgm) {
      const bgmPcm = this.getAudioTrackPcm(FlipnoteAudioTrack.BGM, dstFreq);
      pcmAudioMix(bgmPcm, master, 0);
    }
    // Mix sound effects
    if (hasSe1 || hasSe2 || hasSe3) {
      const seFlags = this.decodeSoundFlags();
      const se1Pcm = hasSe1 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE1, dstFreq) : null;
      const se2Pcm = hasSe2 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE2, dstFreq) : null;
      const se3Pcm = hasSe3 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE3, dstFreq) : null;
      const adjFreq = dstFreq / this.rawSampleRate;
      const samplesPerFrame = Math.round(this.rawSampleRate / this.framerate) * adjFreq;
      for (let frame = 0; frame < this.frameCount; frame++) {
        // places sound effect halfway through frame
        const seOffset = (frame + .5) * samplesPerFrame;
        const flag = seFlags[frame];
        if (hasSe1 && flag[0])
          pcmAudioMix(se1Pcm, master, seOffset);
        if (hasSe2 && flag[1])
          pcmAudioMix(se2Pcm, master, seOffset);
        if (hasSe3 && flag[2])
          pcmAudioMix(se3Pcm, master, seOffset);
      }
    }
    return master;
  }
}