import fileReader from "./fileReader";

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

export default class kwzParser extends fileReader {

  constructor(arrayBuffer) {
    super(arrayBuffer);
    // table1 - commonly occuring line offsets
    this._table1 = new Uint16Array([
      0x0000, 0x0CD0, 0x19A0, 0x02D9, 0x088B, 0x0051, 0x00F3, 0x0009,
      0x001B, 0x0001, 0x0003, 0x05B2, 0x1116, 0x00A2, 0x01E6, 0x0012,
      0x0036, 0x0002, 0x0006, 0x0B64, 0x08DC, 0x0144, 0x00FC, 0x0024,
      0x001C, 0x0004, 0x0334, 0x099C, 0x0668, 0x1338, 0x1004, 0x166C
    ]);
    // table2 - commonly occuring line offsets, but the lines are shifted to the left by one pixel
    this._table2 = new Uint16Array([
      0x0000, 0x0CD0, 0x19A0, 0x0003, 0x02D9, 0x088B, 0x0051, 0x00F3, 
      0x0009, 0x001B, 0x0001, 0x0006, 0x05B2, 0x1116, 0x00A2, 0x01E6, 
      0x0012, 0x0036, 0x0002, 0x02DC, 0x0B64, 0x08DC, 0x0144, 0x00FC, 
      0x0024, 0x001C, 0x099C, 0x0334, 0x1338, 0x0668, 0x166C, 0x1004
    ]);
    // table3 - line offsets, but the lines are shifted to the left by one pixel
    this._table3 = new Uint16Array(6561);
    const values = [0, 3, 7, 1, 4, 8, 2, 5, 6];
    let index = 0;
    for (let a = 0; a < 9; a++)
      for (let b = 0; b < 9; b++)
        for (let c = 0; c < 9; c++)
          for (let d = 0; d < 9; d++) {
            this._table3[index] = ((values[a] * 9 + values[b]) * 9 + values[c]) * 9 + values[d];
            index++;
          }
    // linetable - contains every possible sequence of pixels for each tile line
    this._linetable = new Uint8Array(6561 * 8);
    let offset = 0;
    for (let a = 0; a < 3; a++)
      for (let b = 0; b < 3; b++)
        for (let c = 0; c < 3; c++)
          for (let d = 0; d < 3; d++)
            for (let e = 0; e < 3; e++)
              for (let f = 0; f < 3; f++)
                for (let g = 0; g < 3; g++)
                  for (let h = 0; h < 3; h++) {
                    this._linetable.set([b, a, d, c, f, e, h, g], offset);
                    offset += 8;
                  }

    this._layers = [
      new Uint8Array(320 * 240),
      new Uint8Array(320 * 240),
      new Uint8Array(320 * 240),
    ];
    this._bitIndex = 0;
    this._bitValue = 0;
    this.load();
  }

  load() {
    this.seek(0);
    this.sections = {};
    let size = this.fileLength - 256;
    let offset = 0;
    while (offset < size) {
      this.seek(offset);
      let sectionMagic = this.readUtf8(4).substring(0, 3);
      let sectionLength = this.readUint32();
      this.sections[sectionMagic] = {
        offset: offset,
        length: sectionLength
      };
      offset += sectionLength + 8;
    }

    this.frameMeta = [];
    this.frameOffsets = [];
    this.seek(this.sections["KMI"].offset + 8);
    offset = this.sections["KMC"].offset + 12;
    let frameCount = this.sections["KMI"].length / 28;
    for (let i = 0; i < frameCount; i++) {
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
    this.frameCount = frameCount;
    this._prevDecodedFrame = -1;
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

  getDiffingFlag(frameIndex) {
    return ~(this.frameMeta[frameIndex].flags >> 4) & 0x07;
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
                let lineIndex = this._table1[this.readBits(5)];
                let pixels = this._linetable.subarray(lineIndex * 8, lineIndex * 8 + 8);
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
                let pixels = this._linetable.subarray(lineIndex * 8, lineIndex * 8 + 8);
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
                let lineIndexA = this._table1[lineValue];
                let lineIndexB = this._table2[lineValue];
                let a = this._linetable.subarray(lineIndexA * 8, lineIndexA * 8 + 8);
                let b = this._linetable.subarray(lineIndexB * 8, lineIndexB * 8 + 8);
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
                let lineIndexB = this._table3[lineIndexA];
                let a = this._linetable.subarray(lineIndexA * 8, lineIndexA * 8 + 8);
                let b = this._linetable.subarray(lineIndexB * 8, lineIndexB * 8 + 8);
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
                    lineIndex = this._table1[this.readBits(5)];
                  } else {
                    lineIndex = this.readBits(13);
                  }
                  let pixels = this._linetable.subarray(lineIndex * 8, lineIndex * 8 + 8);
                  pixelBuffer.set(pixels, pixelOffset + line * 320);
                }
              }

              else if (type == 5) {
                skip = this.readBits(5);
                continue;
              }

              else if (type == 6) {
                console.warn("type 6??? nah m8")
              }

              else if (type == 7) {
                let pattern = this.readBits(2);
                let useTable = this.readBits(1);
                let lineIndexA = 0;
                let lineIndexB = 0;

                if (useTable) {
                  lineIndexA = this._table1[this.readBits(5)];
                  lineIndexB = this._table1[this.readBits(5)];
                  pattern = (pattern + 1) % 4;
                } else {
                  lineIndexA = this.readBits(13);
                  lineIndexB = this.readBits(13);
                }

                let a = this._linetable.subarray(lineIndexA * 8, lineIndexA * 8 + 8);
                let b = this._linetable.subarray(lineIndexB * 8, lineIndexB * 8 + 8);

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
    return this._layers;
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

  getFrameImage(frameIndex) {
    let layers = this.decodeFrame(frameIndex);
    let image = new Uint8Array((320 * 240));
    for (let pixel = 0; pixel < (320 * 240); pixel++) {
      let a = layers[0][pixel];
      let b = layers[1][pixel];
      let c = layers[2][pixel];
      if (c) image[pixel] = c + 4;
      if (b) image[pixel] = b + 2;
      if (a) image[pixel] = a;
    }
    return image;
  }

}