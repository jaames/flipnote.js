import { DataStream } from '../utils/dataStream';

import {
  ADPCM_INDEX_TABLE_2,
  ADPCM_INDEX_TABLE_4,
  ADPCM_SAMPLE_TABLE_2,
  ADPCM_SAMPLE_TABLE_4
} from './adpcm';

import {
  KWZ_TABLE_1,
  KWZ_TABLE_2,
  KWZ_TABLE_3,
  KWZ_LINE_TABLE
} from './kwzTables';

const FRAMERATES = [
  0.2,
  0.5,
  1,
  2,
  4, 
  6,
  8,
  12, 
  20,
  24,
  30
];

const PALETTE = {
  WHITE:  [0xff, 0xff, 0xff],
  BLACK:  [0x10, 0x10, 0x10],
  RED:    [0xff, 0x10, 0x10],
  YELLOW: [0xff, 0xe7, 0x00],
  GREEN:  [0x00, 0x86, 0x31],
  BLUE:   [0x00, 0x38, 0xce],
  NONE:   [0xff, 0xff, 0xff]
};

export type KwzSectionMagic = 'KFH' | 'KTN' | 'KMC' | 'KMI' | 'KSN' | 'ICO';

export type KwzSectionMap = {
  [k in KwzSectionMagic]?: {
    offset: number, length: number
  }
};

export interface KwzMeta {
  lock: boolean;
  loop: boolean;
  frame_count: number;
  frame_speed: number;
  thumb_index: number;
  timestamp: Date;
  creation_timestamp: Date;
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

export interface KwzFrameMeta {
  flags: number;
  layerSize: number[];
  frameAuthor: string;
  layerDepth: number[];
  soundFlags: number;
  cameraFlag: number;
};

export type KwzSoundTrack = 'bgm' | 'se1' | 'se2' | 'se3' | 'se4';

export type KwzSoundMeta = {
  [k in KwzSoundTrack]?: {
    offset: number, length: number
  }
};

export class KwzParser extends DataStream {

  static type: string = 'KWZ';
  static sampleRate: number = 16364;
  static width: number = 320;
  static height: number = 240;
  static globalPalette = [
    PALETTE.BLACK,
    PALETTE.WHITE,
    PALETTE.RED,
    PALETTE.YELLOW,
    PALETTE.GREEN,
    PALETTE.BLUE,
    PALETTE.NONE,
  ];

  private sections: KwzSectionMap;
  private layers: Uint16Array[];
  private prevDecodedFrame: number = null;
  private frameMeta: KwzFrameMeta[];
  private frameOffsets: Uint32Array;
  private bitIndex: number = 0;
  private bitValue: number = 0;

  public palette = PALETTE;
  public meta: KwzMeta;
  public soundMeta: KwzSoundMeta;
  public frameCount: number;
  public frameSpeed: number;
  public bgmSpeed: number;
  public framerate: number;
  public bgmrate: number;
  public thumbFrameIndex: number;

  constructor(arrayBuffer: ArrayBuffer) {
    super(arrayBuffer);
    this.layers = [
      new Uint16Array(320 * 240),
      new Uint16Array(320 * 240),
      new Uint16Array(320 * 240),
    ];
    this.bitIndex = 0;
    this.bitValue = 0;
    this.load();
  }

  load() {
    this.seek(0);
    let size = this.byteLength - 256;
    let offset = 0;
    let sectionCount = 0;
    // counting sections should mitigate against one of mrnbayoh's notehax exploits
    while ((offset < size) && (sectionCount < 6)) {
      this.seek(offset);
      let sectionMagic = <KwzSectionMagic>this.readUtf8(4).substring(0, 3);
      let sectionLength = this.readUint32();
      this.sections[sectionMagic] = {
        offset: offset,
        length: sectionLength
      };
      offset += sectionLength + 8;
      sectionCount += 1;
    }

    this.decodeMeta();
    this.decodeFrameMeta();
    this.decodeSoundHeader();
  }

  private readBits(num: number) {
    if (this.bitIndex + num > 16) {
      let nextBits = this.readUint16();
      this.bitValue |= nextBits << (16 - this.bitIndex);
      this.bitIndex -= 16;
    }
    let mask = (1 << num) - 1;
    let result = this.bitValue & mask;
    this.bitValue >>= num;
    this.bitIndex += num;
    return result;
  }

  private decodeMeta() {
    this.seek(this.sections['KFH'].offset + 12);
    let creationTimestamp = new Date((this.readUint32() + 946684800) * 1000),
        modifiedTimestamp = new Date((this.readUint32() + 946684800) * 1000),
        appVersion = this.readUint32(),
        rootAuthorId = this.readHex(10),
        parentAuthorId = this.readHex(10),
        currentAuthorId = this.readHex(10),
        rootAuthorName = this.readUtf16(11),
        parentAuthorName = this.readUtf16(11),
        currentAuthorName = this.readUtf16(11),
        rootFilename = this.readUtf8(28),
        parentFilename = this.readUtf8(28),
        currentFilename = this.readUtf8(28),
        frameCount = this.readUint16(),
        thumbIndex = this.readUint16(),
        flags = this.readUint16(),
        frameSpeed = this.readUint8(),
        layerFlags = this.readUint8();
    this.frameCount = frameCount;
    this.thumbFrameIndex = thumbIndex;
    this.frameSpeed = frameSpeed;
    this.framerate = FRAMERATES[frameSpeed];
    this.meta = {
      lock: (flags & 0x1) === 1,
      loop: ((flags >> 1) & 0x01) === 1,
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

  private decodeFrameMeta() {
    this.frameOffsets = new Uint32Array(this.frameCount);
    this.seek(this.sections["KMI"].offset + 8);
    let offset = this.sections["KMC"].offset + 12;
    for (let i = 0; i < this.frameCount; i++) {
      let frame = {
        flags: this.readUint32(),
        layerSize: [
          this.readUint16(),
          this.readUint16(),
          this.readUint16()
        ],
        frameAuthor: this.readHex(10),
        layerDepth: [
          this.readUint8(),
          this.readUint8(),
          this.readUint8(),
        ],
        soundFlags: this.readUint8(),
        cameraFlag: this.readUint32(),
      };
      this.frameMeta.push(frame);
      this.frameOffsets[i] = offset;
      offset += frame.layerSize[0] + frame.layerSize[1] + frame.layerSize[2];
    }
  }

  private decodeSoundHeader() {
    let offset = this.sections["KSN"].offset + 8;
    this.seek(offset);
    let bgmSpeed = this.readUint32();
    this.bgmSpeed = bgmSpeed;
    this.bgmrate = FRAMERATES[bgmSpeed];
    let trackSizes = new Uint32Array(this.buffer, offset + 4, 20);
    this.soundMeta = {
      "bgm": {offset: offset += 28,            length: trackSizes[0]},
      "se1": {offset: offset += trackSizes[0], length: trackSizes[1]},
      "se2": {offset: offset += trackSizes[1], length: trackSizes[2]},
      "se3": {offset: offset += trackSizes[2], length: trackSizes[3]},
      "se4": {offset: offset += trackSizes[3], length: trackSizes[4]},
    };
  }

  private getDiffingFlag(frameIndex: number) {
    return ~(this.frameMeta[frameIndex].flags >> 4) & 0x07;
  }

  public getLayerDepths(frameIndex: number) {
    return this.frameMeta[frameIndex].layerDepth;
  }

  // sort layer indices sorted by depth, drom bottom to top
  public getLayerOrder(frameIndex: number) {
    const depths = this.getLayerDepths(frameIndex);
    return [2, 1, 0].sort((a, b) => depths[b] - depths[a]);
  }

  public decodeFrame(frameIndex: number, diffingFlag: number=0x7, isPrevFrame: boolean=false) {
    // if this frame is being decoded as a prev frame, then we only want to decode the layers necessary
    if (isPrevFrame)
      diffingFlag &= this.getDiffingFlag(frameIndex + 1);
    // the prevDecodedFrame check is an optimisation for decoding frames in full sequence
    if ((frameIndex !== 0) && (this.prevDecodedFrame !== frameIndex - 1) && (diffingFlag))
      this.decodeFrame(frameIndex - 1, diffingFlag=diffingFlag, isPrevFrame=true);

    const meta = this.frameMeta[frameIndex];
    let offset = this.frameOffsets[frameIndex];

    for (let layerIndex = 0; layerIndex < 3; layerIndex++) {
      this.seek(offset);
      let layerSize = meta.layerSize[layerIndex];
      offset += layerSize;

      // if the layer is 38 bytes then it hasn't changed at all since the previous frame, so we can skip it
      if (layerSize === 38) continue;

      if (((diffingFlag >> layerIndex) & 0x1) === 0) continue;

      this.bitIndex = 16;
      this.bitValue = 0;
      let skip = 0;

      for (let tileOffsetY = 0; tileOffsetY < 240; tileOffsetY += 128) {
        for (let tileOffsetX = 0; tileOffsetX < 320; tileOffsetX += 128) {
          for (let subTileOffsetY = 0; subTileOffsetY < 128; subTileOffsetY += 8) {
            let y = tileOffsetY + subTileOffsetY;
            if (y >= 240) break;

            for (let subTileOffsetX = 0; subTileOffsetX < 128; subTileOffsetX += 8) {
              let x = tileOffsetX + subTileOffsetX;
              if (x >= 320) break;

              if (skip) {
                skip -= 1;
                continue;
              }

              let pixelOffset = y * 320 + x;
              let pixelBuffer = this.layers[layerIndex];

              let type = this.readBits(3);

              if (type == 0) {
                let lineIndex = KWZ_TABLE_1[this.readBits(5)];
                let pixels = KWZ_LINE_TABLE.subarray(lineIndex * 8, lineIndex * 8 + 8);
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
                let lineIndex = this.readBits(13);
                let pixels = KWZ_LINE_TABLE.subarray(lineIndex * 8, lineIndex * 8 + 8);
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
                let lineValue = this.readBits(5);
                let lineIndexA = KWZ_TABLE_1[lineValue];
                let lineIndexB = KWZ_TABLE_2[lineValue];
                let a = KWZ_LINE_TABLE.subarray(lineIndexA * 8, lineIndexA * 8 + 8);
                let b = KWZ_LINE_TABLE.subarray(lineIndexB * 8, lineIndexB * 8 + 8);
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
                let lineIndexA = this.readBits(13);
                let lineIndexB = KWZ_TABLE_3[lineIndexA];
                let a = KWZ_LINE_TABLE.subarray(lineIndexA * 8, lineIndexA * 8 + 8);
                let b = KWZ_LINE_TABLE.subarray(lineIndexB * 8, lineIndexB * 8 + 8);
                pixelBuffer.set(a, pixelOffset);
                pixelBuffer.set(b, pixelOffset + 320);
                pixelBuffer.set(a, pixelOffset + 640);
                pixelBuffer.set(b, pixelOffset + 960);
                pixelBuffer.set(a, pixelOffset + 1280);
                pixelBuffer.set(b, pixelOffset + 1600);
                pixelBuffer.set(a, pixelOffset + 1920);
                pixelBuffer.set(b, pixelOffset + 2240);
              }

              else if (type == 4) {
                let mask = this.readBits(8);
                for (let line = 0; line < 8; line++) {
                  let lineIndex = 0;
                  if (mask & (1 << line)) {
                    lineIndex = KWZ_TABLE_1[this.readBits(5)];
                  } else {
                    lineIndex = this.readBits(13);
                  }
                  let pixels = KWZ_LINE_TABLE.subarray(lineIndex * 8, lineIndex * 8 + 8);
                  pixelBuffer.set(pixels, pixelOffset + line * 320);
                }
              }

              else if (type == 5) {
                skip = this.readBits(5);
                continue;
              }

              // type 6 doesnt exist

              else if (type == 7) {
                let pattern = this.readBits(2);
                let useTable = this.readBits(1);
                let lineIndexA = 0;
                let lineIndexB = 0;

                if (useTable) {
                  lineIndexA = KWZ_TABLE_1[this.readBits(5)];
                  lineIndexB = KWZ_TABLE_1[this.readBits(5)];
                  pattern = (pattern + 1) % 4;
                } else {
                  lineIndexA = this.readBits(13);
                  lineIndexB = this.readBits(13);
                }

                let a = KWZ_LINE_TABLE.subarray(lineIndexA * 8, lineIndexA * 8 + 8);
                let b = KWZ_LINE_TABLE.subarray(lineIndexB * 8, lineIndexB * 8 + 8);

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

    this.prevDecodedFrame = frameIndex;
    // return this._layers;
    return [
      new Uint8Array(this.layers[0].buffer),
      new Uint8Array(this.layers[1].buffer),
      new Uint8Array(this.layers[2].buffer),
    ];
  }

  public getFramePalette(frameIndex: number) {
    let flags = this.frameMeta[frameIndex].flags;
    let paletteMap = [
      this.palette.WHITE,
      this.palette.BLACK,
      this.palette.RED,
      this.palette.YELLOW,
      this.palette.GREEN,
      this.palette.BLUE,
      this.palette.NONE
    ];
    return [
      paletteMap[flags & 0xF], // paper color
      paletteMap[(flags >> 8) & 0xF], // layer A color 1
      paletteMap[(flags >> 12) & 0xF], // layer A color 2
      paletteMap[(flags >> 16) & 0xF], // layer B color 1
      paletteMap[(flags >> 20) & 0xF], // layer B color 2
      paletteMap[(flags >> 24) & 0xF], // layer C color 1
      paletteMap[(flags >> 28) & 0xF], // layer C color 2
    ];
  }

  // retuns an uint8 array where each item is a pixel's palette index
  public getLayerPixels(frameIndex: number, layerIndex: number) {
    if (this.prevDecodedFrame !== frameIndex) {
      this.decodeFrame(frameIndex);
    }
    const layer = this.layers[layerIndex];
    const image = new Uint8Array((320 * 240));
    const paletteOffset = layerIndex * 2 + 1;
    for (let index = 0; index < layer.length; index++) {
      let pixel = layer[index];
      if (pixel & 0xff00) {
        image[index] = paletteOffset;
      } else if (pixel & 0x00ff) {
        image[index] = paletteOffset + 1;
      }
    }
    return image;
  }

  // retuns an uint8 array where each item is a pixel's palette index
  public getFramePixels(frameIndex: number, useGlobalPalette: boolean = false) {
    let paletteMap: number[];
    if (useGlobalPalette) {
      const framePalette = this.getFramePalette(frameIndex);
      paletteMap = framePalette.map(color => KwzParser.globalPalette.indexOf(color));
    } else {
      paletteMap = [0, 1, 2, 3, 4, 5, 6];
    }
    const image = new Uint8Array((320 * 240));
    image.fill(paletteMap[0]);
    const layerOrder = this.getLayerOrder(frameIndex);
    layerOrder.forEach(layerIndex => {
      const layer = this.getLayerPixels(frameIndex, layerIndex);
      // merge layer into image result
      for (let index = 0; index < layer.length; index++) {
        let pixel = layer[index];
        if (pixel !== 0) {
          image[index] = paletteMap[pixel];
        }
      }
    });
    return image;
  }
  
  public decodeSoundFlags() {
    return this.frameMeta.map(frame => {
      let soundFlags = frame.soundFlags;
      return [
        soundFlags & 0x1,
        (soundFlags >> 1) & 0x1,
        (soundFlags >> 2) & 0x1,
        (soundFlags >> 3) & 0x1,
      ];
    });
  }

  public hasAudioTrack(trackIndex: number) {
    const keys: KwzSoundTrack[] = ['bgm', 'se1', 'se2', 'se3', 'se4'];
    const id = keys[trackIndex];
    return this.soundMeta[id].length > 0;
  }

  public decodeAudio(track: KwzSoundTrack) {
    let meta = this.soundMeta[track];
    let output = new Int16Array(16364 * 60);
    let outputOffset = 0;
    let adpcm = new Uint8Array(this.buffer, meta.offset, meta.length);
    // initial decoder state
    var prevDiff = 0;
    var prevStepIndex = 40;
    var sample: number, diff: number, stepIndex: number;
    // loop through each byte in the raw adpcm data
    for (let index = 0; index < adpcm.length; index++) {
      var byte = adpcm[index];
      var bitPos = 0;
      while (bitPos < 8) {
        if (prevStepIndex < 18 || bitPos == 6) {
          // isolate 2-bit sample
          sample = (byte >> bitPos) & 0x3;
          // get diff
          diff = prevDiff + ADPCM_SAMPLE_TABLE_2[sample + 4 * prevStepIndex];
          // get step index
          stepIndex = prevStepIndex + ADPCM_INDEX_TABLE_2[sample];
          bitPos += 2;
        }
        else {
          // isolate 4-bit sample
          sample = (byte >> bitPos) & 0xF;
          // get diff
          diff = prevDiff + ADPCM_SAMPLE_TABLE_4[sample + 16 * prevStepIndex];
          // get step index
          stepIndex = prevStepIndex + ADPCM_INDEX_TABLE_4[sample];
          bitPos += 4;
        }
        // clamp step index and diff
        stepIndex = Math.max(0, Math.min(stepIndex, 79));
        diff = Math.max(-2048, Math.min(diff, 2048));
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
}