import dataStream from "utils/dataStream";

import {
  ADPCM_INDEX_TABLE_2,
  ADPCM_INDEX_TABLE_4,
  ADPCM_SAMPLE_TABLE_2,
  ADPCM_SAMPLE_TABLE_4
} from "utils/adpcm";

import { BitmapEncoder } from "encoders/bmp";

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

const PALETTE = [
  [0xff, 0xff, 0xff],
  [0x10, 0x10, 0x10],
  [0xff, 0x10, 0x10],
  [0xff, 0xe7, 0x00],
  [0x00, 0x86, 0x31],
  [0x00, 0x38, 0xce],
  [0xff, 0xff, 0xff]
];

// table1 - commonly occuring line offsets
const TABLE_1 = new Uint16Array([
  0x0000, 0x0CD0, 0x19A0, 0x02D9, 0x088B, 0x0051, 0x00F3, 0x0009,
  0x001B, 0x0001, 0x0003, 0x05B2, 0x1116, 0x00A2, 0x01E6, 0x0012,
  0x0036, 0x0002, 0x0006, 0x0B64, 0x08DC, 0x0144, 0x00FC, 0x0024,
  0x001C, 0x0004, 0x0334, 0x099C, 0x0668, 0x1338, 0x1004, 0x166C
]);
// table2 - commonly occuring line offsets, but the lines are shifted to the left by one pixel
const TABLE_2 = new Uint16Array([
  0x0000, 0x0CD0, 0x19A0, 0x0003, 0x02D9, 0x088B, 0x0051, 0x00F3, 
  0x0009, 0x001B, 0x0001, 0x0006, 0x05B2, 0x1116, 0x00A2, 0x01E6, 
  0x0012, 0x0036, 0x0002, 0x02DC, 0x0B64, 0x08DC, 0x0144, 0x00FC, 
  0x0024, 0x001C, 0x099C, 0x0334, 0x1338, 0x0668, 0x166C, 0x1004
]);
// table3 - line offsets, but the lines are shifted to the left by one pixel
const TABLE_3 = new Uint16Array(6561);
var values = [0, 3, 7, 1, 4, 8, 2, 5, 6];
let index = 0;
for (let a = 0; a < 9; a++)
  for (let b = 0; b < 9; b++)
    for (let c = 0; c < 9; c++)
      for (let d = 0; d < 9; d++) {
        TABLE_3[index] = ((values[a] * 9 + values[b]) * 9 + values[c]) * 9 + values[d];
        index++;
      }

// linetable - contains every possible sequence of pixels for each tile line
const LINE_TABLE = new Uint16Array(6561 * 8);
var values = [0x0000, 0xFF00, 0x00FF];
let offset = 0;
for (let a = 0; a < 3; a++)
  for (let b = 0; b < 3; b++)
    for (let c = 0; c < 3; c++)
      for (let d = 0; d < 3; d++)
        for (let e = 0; e < 3; e++)
          for (let f = 0; f < 3; f++)
            for (let g = 0; g < 3; g++)
              for (let h = 0; h < 3; h++) {
                LINE_TABLE.set([
                  values[b], 
                  values[a], 
                  values[d], 
                  values[c], 
                  values[f], 
                  values[e], 
                  values[h], 
                  values[g]
                ], offset);
                offset += 8;
              }

export default class kwzParser extends dataStream {

  constructor(arrayBuffer) {
    super(arrayBuffer);
    this.type = "KWZ";
    this._layers = [
      new Uint16Array(320 * 240),
      new Uint16Array(320 * 240),
      new Uint16Array(320 * 240),
    ];
    this._bitIndex = 0;
    this._bitValue = 0;
    this.load();
  }

  load() {
    this.seek(0);
    this.sections = {};
    let size = this.byteLength - 256;
    let offset = 0;
    let sectionCount = 0;
    // counting sections should mitigate against one of mrnbayoh's notehax exploits
    while ((offset < size) && (sectionCount < 6)) {
      this.seek(offset);
      let sectionMagic = this.readUtf8(4).substring(0, 3);
      let sectionLength = this.readUint32();
      this.sections[sectionMagic] = {
        offset: offset,
        length: sectionLength
      };
      offset += sectionLength + 8;
      sectionCount += 1;
    }

    this._decodeMeta();
    this._decodeFrameMeta();
    this._decodeSoundHeader();
    this.sampleRate = 16364;
    this._prevDecodedFrame = null;
  }

  readBits(num) {
    if (this._bitIndex + num > 16) {
      let nextBits = this.readUint16();
      this._bitValue |= nextBits << (16 - this._bitIndex);
      this._bitIndex -= 16;
    }
    let mask = (1 << num) - 1;
    let result = this._bitValue & mask;
    this._bitValue >>= num;
    this._bitIndex += num;
    return result;
  }

  _decodeMeta() {
    this.seek(this.sections["KFH"].offset + 12);
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
      lock: flags & 0x1,
      loop: (flags >> 1) & 0x01,
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

  _decodeFrameMeta() {
    this.frameMeta = [];
    this.frameOffsets = [];
    this.seek(this.sections["KMI"].offset + 8);
    offset = this.sections["KMC"].offset + 12;
    for (let i = 0; i < this.frameCount; i++) {
      let frame = {
        flags: this.readUint32(),
        layerSize: [
          this.readUint16(),
          this.readUint16(),
          this.readUint16()
        ],
        frameAuthor: this.readUtf8(10),
        layerDepth: [
          this.readUint8(),
          this.readUint8(),
          this.readUint8(),
        ],
        soundFlags: this.readUint8(),
        cameraFlag: this.readUint32(),
      };
      this.frameMeta.push(frame);
      this.frameOffsets.push(offset);
      offset += frame.layerSize[0] + frame.layerSize[1] + frame.layerSize[2];
    }
  }

  _decodeSoundHeader() {
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

  getDiffingFlag(frameIndex) {
    return ~(this.frameMeta[frameIndex].flags >> 4) & 0x07;
  }

  getLayerDepths(frameIndex) {
    return this.frameMeta[frameIndex].layerDepth;
  }

  decodeFrame(frameIndex, diffingFlag=0x7, isPrevFrame=false) {
    // if this frame is being decoded as a prev frame, then we only want to decode the layers necessary
    if (isPrevFrame)
      diffingFlag &= this.getDiffingFlag(frameIndex + 1);
    // the prevDecodedFrame check is an optimisation for decoding frames in full sequence
    if ((frameIndex !== 0) && (this._prevDecodedFrame !== frameIndex - 1) && (diffingFlag))
      this.decodeFrame(frameIndex - 1, diffingFlag=diffingFlag, isPrevFrame=true);

    let meta = this.frameMeta[frameIndex];
    let offset = this.frameOffsets[frameIndex];

    for (let layerIndex = 0; layerIndex < 3; layerIndex++) {
      this.seek(offset);
      let layerSize = meta.layerSize[layerIndex];
      offset += layerSize;

      // if the layer is 38 bytes then it hasn't changed at all since the previous frame, so we can skip it
      if (layerSize === 38) continue;

      if ((diffingFlag >> layerIndex) & 0x1 === 0) continue;

      this._bitIndex = 16;
      this._bitValue = 0;
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
              let pixelBuffer = this._layers[layerIndex];

              let type = this.readBits(3);

              if (type == 0) {
                let lineIndex = TABLE_1[this.readBits(5)];
                let pixels = LINE_TABLE.subarray(lineIndex * 8, lineIndex * 8 + 8);
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
                let pixels = LINE_TABLE.subarray(lineIndex * 8, lineIndex * 8 + 8);
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
                let lineIndexA = TABLE_1[lineValue];
                let lineIndexB = TABLE_2[lineValue];
                let a = LINE_TABLE.subarray(lineIndexA * 8, lineIndexA * 8 + 8);
                let b = LINE_TABLE.subarray(lineIndexB * 8, lineIndexB * 8 + 8);
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
                let lineIndexB = TABLE_3[lineIndexA];
                let a = LINE_TABLE.subarray(lineIndexA * 8, lineIndexA * 8 + 8);
                let b = LINE_TABLE.subarray(lineIndexB * 8, lineIndexB * 8 + 8);
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
                    lineIndex = TABLE_1[this.readBits(5)];
                  } else {
                    lineIndex = this.readBits(13);
                  }
                  let pixels = LINE_TABLE.subarray(lineIndex * 8, lineIndex * 8 + 8);
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
                  lineIndexA = TABLE_1[this.readBits(5)];
                  lineIndexB = TABLE_1[this.readBits(5)];
                  pattern = (pattern + 1) % 4;
                } else {
                  lineIndexA = this.readBits(13);
                  lineIndexB = this.readBits(13);
                }

                let a = LINE_TABLE.subarray(lineIndexA * 8, lineIndexA * 8 + 8);
                let b = LINE_TABLE.subarray(lineIndexB * 8, lineIndexB * 8 + 8);

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

    this._prevDecodedFrame = frameIndex;
    // return this._layers;
    return [
      new Uint8Array(this._layers[0].buffer),
      new Uint8Array(this._layers[1].buffer),
      new Uint8Array(this._layers[2].buffer),
    ];
  }

  getFramePalette(frameIndex) {
    let flags = this.frameMeta[frameIndex].flags;
    return [
      PALETTE[flags & 0xF], // paper color
      PALETTE[(flags >> 8) & 0xF], // layer A color 1
      PALETTE[(flags >> 12) & 0xF], // layer A color 2
      PALETTE[(flags >> 16) & 0xF], // layer B color 1
      PALETTE[(flags >> 20) & 0xF], // layer B color 2
      PALETTE[(flags >> 24) & 0xF], // layer C color 1
      PALETTE[(flags >> 28) & 0xF], // layer C color 2
    ];
  }

  getFramePixels(frameIndex) {
    let layers = this.decodeFrame(frameIndex);
    let image = new Uint8Array((320 * 240));
    for (let pixel = 0; pixel < (320 * 240); pixel++) {
      // because kwz layers use 2 items per pixel, one for color 1, one for color 2
      let pixelOffset = pixel * 2;
      if (layers[0][pixelOffset]) image[pixel] = 2;
      if (layers[0][pixelOffset + 1]) image[pixel] = 1;
      if (layers[1][pixelOffset]) image[pixel] = 4;
      if (layers[1][pixelOffset + 1]) image[pixel] = 3;
      if (layers[2][pixelOffset]) image[pixel] = 6;
      if (layers[2][pixelOffset + 1]) image[pixel] = 5;
    }
    return image;
  }

  getFrameBitmap(frameIndex) {
    let bmp = new BitmapEncoder(320, 240, 8);
    bmp.setPixels(this.getFramePixels(frameIndex));
    bmp.setPalette(this.getFramePalette(frameIndex));
    return bmp;
  }

  decodeSoundFlags() {
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

  hasAudioTrack(trackIndex) {
    let id = ["bgm", "se1", "se2", "se3", "se4"][trackIndex];
    return this.soundMeta[id].length > 0
  }

  decodeAudio(track) {
    let meta = this.soundMeta[track];
    let output = new Int16Array(16364 * 60);
    let outputOffset = 0;
    let adpcm = new Uint8Array(this.buffer, meta.offset, meta.length);
    // initial decoder state
    var prevDiff = 0;
    var prevStepIndex = 40;
    var sample, diff, stepIndex;
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