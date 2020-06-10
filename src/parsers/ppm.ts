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
  PaletteDefinition,
  FlipnoteAudioTrack,
  FlipnoteParserBase
} from './parserBase';

import {
  ADPCM_INDEX_TABLE_4,
  ADPCM_SAMPLE_TABLE_4
} from './adpcm';

// internal frame speed value -> FPS table
const FRAMERATES = [
  null,
  0.5,
  1,
  2,
  4,
  6,
  12,
  20,
  30,
];

const PALETTE: PaletteDefinition = {
  WHITE: [0xff, 0xff, 0xff],
  BLACK: [0x0e, 0x0e, 0x0e],
  RED:   [0xff, 0x2a, 0x2a],
  BLUE:  [0x0a, 0x39, 0xff],
};

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
    this.decodeMeta();
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

  private readFilename() {
    return [
      this.readHex(3),
      this.readUtf8(13),
      this.readUint16().toString().padStart(3, '0')
    ].join('_');
  }

  private readLineEncoding() {
    const unpacked = new Uint8Array(PpmParser.height);
    for (var byteIndex = 0; byteIndex < 48; byteIndex ++) {
      const byte = this.readUint8();
      // each line's encoding type is stored as a 2-bit value
      for (var bitOffset = 0; bitOffset < 8; bitOffset += 2) {
        unpacked[byteIndex * 4 + bitOffset / 2] = (byte >> bitOffset) & 0x03;
      }
    }
    return unpacked;
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

  private decodeMeta() {
    // https://github.com/pbsds/hatena-server/wiki/PPM-format#file-header
    this.seek(0x10);
    const lock = this.readUint16(),
          thumbIndex = this.readInt16(),
          rootAuthorName = this.readUtf16(11),
          parentAuthorName = this.readUtf16(11),
          currentAuthorName = this.readUtf16(11),
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
    // skip padding + flags
    this.seek(0x06A8);
    // read frame offsets and build them into a table
    this.frameOffsets = new Uint32Array(offsetTableLength / 4).map(value => {
      return 0x06A8 + offsetTableLength + this.readUint32();
    });
  }

  private decodeSoundHeader() {
    // https://github.com/pbsds/hatena-server/wiki/PPM-format#sound-data-section
    // offset = frame data offset + frame data length + sound effect flags
    let offset = 0x06A0 + this.frameDataLength + this.frameCount;
    // account for multiple-of-4 padding
    if (offset % 4 != 0) offset += 4 - (offset % 4);
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

  public decodeFrame(frameIndex: number) {
    if ((frameIndex !== 0) && (this.prevDecodedFrame !== frameIndex - 1) && (!this.isNewFrame(frameIndex)))
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
            if (lineType == 2) layerBitmap.fill(0xFF, chunkOffset, chunkOffset + PpmParser.width);
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
    if (!isNewFrame) {
      let dest: number, src: number;
      // loop through each line
      for (let y = 0; y < PpmParser.height; y++) {
        // skip to next line if this one falls off the top edge of the screen
        if (y - translateY < 0) continue;
        // stop once the bottom screen edge has been reached
        if (y - translateY >= PpmParser.height) break;
        // loop through each pixel in the line
        for (let x = 0; x < PpmParser.width; x++) {
          // skip to the next pixel if this one falls off the left edge of the screen
          if (x - translateX < 0) continue;
          // stop diffing this line once the right screen edge has been reached
          if (x - translateX >= PpmParser.width) break;
          dest = x + y * PpmParser.width;
          src = dest - (translateX + translateY * PpmParser.width);
          // diff pixels with a binary XOR
          this.layers[0][dest] ^= this.prevLayers[0][src];
          this.layers[1][dest] ^= this.prevLayers[1][src];
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
      if (layer[pixel] !== 0) {
        image[pixel] = layerColor;
      }
    }
    return image;
  }

  // retuns an uint8 array where each item is a pixel's palette index
  public getFramePixels(frameIndex: number) {
    const palette = this.getFramePaletteIndices(frameIndex);
    const layers = this.decodeFrame(frameIndex);
    const image = new Uint8Array(PpmParser.width * PpmParser.height);
    image.fill(palette[0]); // fill with paper color first
    for (let pixel = 0; pixel < image.length; pixel++) {
      const a = layers[0][pixel];
      const b = layers[1][pixel];
      if (a !== 0)
        image[pixel] = palette[1];
      else if (b !== 0)
        image[pixel] = palette[2];
    }
    return image;
  }

  public decodeAudio(trackId: FlipnoteAudioTrack) {
    const trackMeta = this.soundMeta[trackId];
    const adpcm = new Uint8Array(this.buffer, trackMeta.offset, trackMeta.length);
    const output = new Int16Array(adpcm.length * 2);
    let outputOffset = 0;
    // initial decoder state
    let prevDiff = 0;
    let prevStepIndex = 0;
    let sample: number;
    let diff: number;
    let stepIndex: number;
    // loop through each byte in the raw adpcm data
    for (let adpcmOffset = 0; adpcmOffset < adpcm.length; adpcmOffset++) {
      const byte = adpcm[adpcmOffset];
      let bitPos = 0;
      while (bitPos < 8) {
        // isolate 4-bit sample
        sample = (byte >> bitPos) & 0xF;
        // get diff
        diff = prevDiff + ADPCM_SAMPLE_TABLE_4[sample + 16 * prevStepIndex];
        // get step index
        stepIndex = prevStepIndex + ADPCM_INDEX_TABLE_4[sample];
        // clamp step index and diff
        stepIndex = Math.max(0, Math.min(stepIndex, 79));
        diff = Math.max(-32767, Math.min(diff, 32767));
        // add result to output buffer
        output[outputOffset] = diff;
        outputOffset += 1;
        // set prev decoder state
        prevStepIndex = stepIndex;
        prevDiff = diff;
        // move to next sample
        bitPos += 4;
      }
    }
    return output;
  }

  public decodeSoundFlags() {
    this.seek(0x06A0 + this.frameDataLength);
    // per msdn docs - the array map callback is only invoked for array indicies that have assigned values
    // so when we create an array, we need to fill it with something before we can map over it
    const arr = new Array(this.frameCount).fill([]);
    return arr.map(value => {
      const byte = this.readUint8();
      return [byte & 0x1, (byte >> 1) & 0x1, (byte >> 2) & 0x1];
    });
  }
}