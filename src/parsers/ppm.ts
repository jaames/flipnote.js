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
  FlipnotePaletteDefinition,
  FlipnoteAudioTrack,
  FlipnoteParserBase
} from './parserBase';

import {
  clamp,
  pcmDsAudioResample,
  pcmAudioMix,
  ADPCM_INDEX_TABLE_4BIT,
  ADPCM_STEP_TABLE
} from './adpcm';

// internal frame speed value -> FPS table
const FRAMERATES = [0.5, 0.5, 1, 2, 4, 6, 12, 20, 30];
const PALETTE: FlipnotePaletteDefinition = {
  WHITE: [0xff, 0xff, 0xff],
  BLACK: [0x0e, 0x0e, 0x0e],
  RED:   [0xff, 0x2a, 0x2a],
  BLUE:  [0x0a, 0x39, 0xff]
};
const DS_SAMPLE_RATE = 32768;

export interface PpmMeta {
  lock: boolean;
  loop: boolean;
  frame_count: number;
  frame_speed: number;
  bgm_speed: number;
  thumb_index: number;
  timestamp: Date;
  spinoff: boolean;
  root: {
    filename: string;
    username: string;
    fsid: string;
  },
  parent: {
    filename: string;
    username: string;
    fsid: string;
  },
  current: {
    filename: string;
    username: string;
    fsid: string;
  },
};

export class PpmParser extends FlipnoteParserBase {

  static type: string = 'PPM';
  static width: number = 256;
  static height: number = 192;
  static sampleRate: number = 8192;
  static outputSampleRate: number = 32768; 
  static globalPalette = [
    PALETTE.WHITE,
    PALETTE.BLACK,
    PALETTE.RED,
    PALETTE.BLUE
  ];

  public type: string = PpmParser.type;
  public width: number = PpmParser.width;
  public height: number = PpmParser.height;
  public globalPalette = PpmParser.globalPalette;
  public sampleRate = PpmParser.sampleRate;
  public meta: PpmMeta;
  public version: number;

  private layers: Uint8Array[];
  private prevLayers: Uint8Array[];
  private prevDecodedFrame: number = null;
  private frameDataLength: number;
  private soundDataLength: number;
  private frameOffsets: Uint32Array;

  constructor(arrayBuffer: ArrayBuffer) {
    super(arrayBuffer);
    this.decodeHeader();
    this.decodeAnimationHeader();
    this.decodeSoundHeader();
    // this is always true afaik, it's likely just a remnamt from development
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
    // https://github.com/pbsds/hatena-server/wiki/PPM-format#file-header
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
    // https://github.com/pbsds/hatena-server/wiki/PPM-format#file-header
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
    // https://github.com/pbsds/hatena-server/wiki/PPM-format#animation-data-section
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
    // https://github.com/pbsds/hatena-server/wiki/PPM-format#sound-data-section
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
    this.framerate = FRAMERATES[this.frameSpeed];
    this.bgmrate = FRAMERATES[this.bgmSpeed];
    this.soundMeta = {
      [FlipnoteAudioTrack.BGM]: {offset: offset,           length: bgmLen},
      [FlipnoteAudioTrack.SE1]: {offset: offset += bgmLen, length: se1Len},
      [FlipnoteAudioTrack.SE2]: {offset: offset += se1Len, length: se2Len},
      [FlipnoteAudioTrack.SE3]: {offset: offset += se2Len, length: se3Len},
    };
  }

  public isNewFrame(frameIndex: number) {
    this.seek(this.frameOffsets[frameIndex]);
    const header = this.readUint8();
    return (header >> 7) & 0x1;
  }

  public getLayerOrder(frameIndex?: number) {
    return [0, 1];
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

  public decodeFrame(frameIndex: number) {
    if ((this.prevDecodedFrame !== frameIndex - 1) && (!this.isNewFrame(frameIndex) && (frameIndex !== 0)))
      this.decodeFrame(frameIndex - 1);
    // https://github.com/pbsds/hatena-server/wiki/PPM-format#animation-frame
    this.seek(this.frameOffsets[frameIndex]);
    const header = this.readUint8();
    const isNewFrame = (header >> 7) & 0x1;
    const isTranslated = (header >> 5) & 0x3;
    let translateX = 0;
    let translateY = 0;
    // copy the current layer buffers to the previous ones
    this.prevLayers[0].set(this.layers[0]);
    this.prevLayers[1].set(this.layers[1]);
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
        let chunkOffset = line * PpmParser.width;
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
              layerBitmap.fill(0xFF, chunkOffset, chunkOffset + PpmParser.width);
            // loop through each bit in the line header
            while (lineHeader & 0xFFFFFFFF) {
              // if the bit is set, this 8-pix wide chunk is stored
              // else we can just leave it blank and move on to the next chunk
              if (lineHeader & 0x80000000) {
                const chunk = this.readUint8();
                // unpack chunk bits
                for (let pixel = 0; pixel < 8; pixel++) {
                  layerBitmap[chunkOffset + pixel] = (chunk >> pixel & 0x1) ? 0xFF : 0x00;
                }
              }
              chunkOffset += 8;
              // shift lineheader to the left by 1 bit, now on the next loop cycle the next bit will be checked
              lineHeader <<= 1;
            }
            break;
          // line type 3 = raw bitmap line
          case 3:
            while(chunkOffset < (line + 1) * PpmParser.width) {
              const chunk = this.readUint8();
              for (let pixel = 0; pixel < 8; pixel++) {
                layerBitmap[chunkOffset + pixel] = (chunk >> pixel & 0x1) ? 0xFF : 0x00;
              }
              chunkOffset += 8;
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
    return this.layers;
  }

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

  public getFramePalette(frameIndex: number) {
    const indices = this.getFramePaletteIndices(frameIndex);
    return indices.map(colorIndex => this.globalPalette[colorIndex]);
  }

  // retuns an uint8 array where each item is a pixel's palette index
  public getLayerPixels(frameIndex: number, layerIndex: number) {
    if (this.prevDecodedFrame !== frameIndex) {
      this.decodeFrame(frameIndex);
    }
    const palette = this.getFramePaletteIndices(frameIndex);
    const layer = this.layers[layerIndex];
    const image = new Uint8Array(PpmParser.width * PpmParser.height);
    const layerColor = palette[layerIndex + 1];
    for (let pixel = 0; pixel < image.length; pixel++) {
      if (layer[pixel] !== 0)
        image[pixel] = layerColor;
    }
    return image;
  }

  // retuns an uint8 array where each item is a pixel's palette index
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
      if (a !== 0)
        image[pixel] = layer1Color;
      else if (b !== 0)
        image[pixel] = layer2Color;
    }
    return image;
  }

  public decodeSoundFlags() {
    this.seek(0x06A0 + this.frameDataLength);
    const numFlags = this.frameCount;
    const flags = this.readBytes(numFlags);
    const unpacked = new Array(numFlags);
    for (let i = 0; i < numFlags; i++) {
      const byte = flags[i];
      unpacked[i] = [
        (byte & 0x1) !== 0,
        (byte & 0x2) !== 0,
        (byte & 0x4) !== 0,
      ];
    }
    return unpacked;
  }

  public getAudioTrackRaw(trackId: FlipnoteAudioTrack) {
    const trackMeta = this.soundMeta[trackId];
    const adpcm = new Uint8Array(this.buffer, trackMeta.offset, trackMeta.length);
    return adpcm;
  }

  // kinda slow, maybe use sample lookup table
  public decodeAudioTrack(trackId: FlipnoteAudioTrack) {
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

  public getAudioTrackPcm(trackId: FlipnoteAudioTrack, dstFreq: number = DS_SAMPLE_RATE) {
    const srcPcm = this.decodeAudioTrack(trackId);
    let srcFreq = this.sampleRate;
    if (trackId === FlipnoteAudioTrack.BGM) {
      const bgmAdjust = (1 / this.bgmrate) / (1 / this.framerate);
      srcFreq = this.sampleRate * bgmAdjust;
    }
    if (srcFreq !== dstFreq) {
      return pcmDsAudioResample(srcPcm, srcFreq, dstFreq);
    }
    return srcPcm;
  }

  public getAudioMasterPcm(dstFreq: number = DS_SAMPLE_RATE) {
    const duration = this.frameCount * (1 / this.framerate);
    const dstSize = Math.floor(duration * dstFreq);
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
      const samplesPerFrame = Math.floor(dstFreq / this.framerate);
      const seFlags = this.decodeSoundFlags();
      const se1Pcm = hasSe1 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE1, dstFreq) : null;
      const se2Pcm = hasSe2 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE2, dstFreq) : null;
      const se3Pcm = hasSe3 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE3, dstFreq) : null;
      for (let i = 0; i < this.frameCount; i++) {
        const seOffset = samplesPerFrame * i;
        const flag = seFlags[i];
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