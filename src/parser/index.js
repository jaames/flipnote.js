import fileReader from "./fileReader";

const BLACK = [14, 14, 14, 255];
const WHITE = [255, 255, 255, 255];
const BLUE = [10, 57, 255, 255];
const RED = [255, 42, 42, 255];

// internal framerate value -> FPS table
const FRAMERATES = {
    1: 0.5,
    2: 1,
    3: 2,
    4: 4,
    5: 6,
    6: 12,
    7: 20,
    8: 30,
};

function getPadLen(i, pad=4) {
  if (i % pad != 0) return i + pad - (i % pad);
  return i;
}

export default class ppmParser extends fileReader {
  constructor(arrBuffer) {
    super(arrBuffer);
    this.seek(4);
    this.frameDataLength = this.readUint32();
    this.soundDataLength = this.readUint32();
    this.frameCount = Math.min(this.readUint16() + 1, 999);
    this.seek(4, 1);
    this.thumbFrameIndex = this.readUint16();
    // calculate sound data offset -- frame data offset + frame data length + sound effect flags, rouded up to next multiple of 4
    this.soundDataOffset = getPadLen(0x06A0 + this.frameDataLength + this.frameCount, 4)
    // jump to the start of the animation data section
    this.seek(0x06A0);
    var offsetTableLength = Math.min(this.readUint16(), this.frameCount * 4);
    this.seek(6, 1);
    this.frameOffsets = new Uint32Array(offsetTableLength / 4);
    for (let i = 0; i < this.frameOffsets.length; i++) {
      this.frameOffsets[i] = this.readUint32();
    }
    this.frameOffsetStart = 0x06A0 + 8 + offsetTableLength;
    // jump to the start of the sound data
    this.seek(this.soundDataOffset);
    var bgmLen = this.readUint32();
    var se1Len = this.readUint32();
    var se2Len = this.readUint32();
    var se3Len = this.readUint32();
    this.frameSpeed = 8 - this.readUint8();
    this.bgmSpeed = 8 - this.readUint8();
    var offset = this.soundDataOffset + 32;
    this.soundMeta = {
      "bgm": {offset: offset,           length: bgmLen},
      "se1": {offset: offset += bgmLen, length: se1Len},
      "se2": {offset: offset += se1Len, length: se2Len},
      "se3": {offset: offset += se2Len, length: se3Len},
    };
    this.framerate = FRAMERATES[this.frameSpeed];
    this.bgmFramerate = FRAMERATES[this.bgmSpeed];

    // create image buffer
     this.layers = [
      new Uint8Array(256 * 192),
      new Uint8Array(256 * 192)
    ];

    this.layers_prev = [
      new Uint8Array(256 * 192),
      new Uint8Array(256 * 192)
    ];
  }

  _seekToFrame(index) {
    this.seek(this.frameOffsetStart + this.frameOffsets[index]);
  }

  _seekToAudio(track) {
    this.seek(this.soundMeta[track].offset);
  }

  _readLineEncoding() {
    var unpacked = new Uint8Array(192);
    for (let byteOffset = 0; byteOffset < 48; byteOffset ++) {
      var byte = this.readUint8();
      for (let bitOffset = 0; bitOffset < 8; bitOffset += 2) {
        unpacked[byteOffset * 4 + bitOffset / 2] = (byte >> bitOffset) & 0x03;
      }
    }
    return unpacked;
  }

  getFramePalette(index) {
    this._seekToFrame(index);
    var header = this.readUint8();
    var paperColor = header & 0x1;
    var layer1Color = (header >> 1) & 0x3;
    var layer2Color = (header >> 3) & 0x3;
    var pen = [
      null,
      paperColor == 1 ? BLACK : WHITE,
      RED,
      BLUE,
    ];
    return [
      paperColor == 1 ? WHITE : BLACK,
      pen[layer1Color],
      pen[layer2Color],
    ];
  }

  decodeFrame(index) {
    this._seekToFrame(index);
    var header = this.readUint8();
    var isNewFrame = (header >> 7) & 0x1;
    var isTranslated = (header >> 5) & 0x3;
    var layerEncoding = [
      this._readLineEncoding(),
      this._readLineEncoding()
    ];
    this.layers_prev[0].set(this.layers[0]);
    this.layers_prev[1].set(this.layers[1]);
    this.layers[0].fill(0);
    this.layers[1].fill(0);
    for (let layer = 0; layer < 2; layer++) {
      var layerBitmap = this.layers[layer];
      for (let line = 0; line < 192; line++) {
        var chunkOffset = line * 256;
        var lineType = layerEncoding[layer][line];
        switch(lineType) {
          // line type 0 = blank line, decode nothing
          case 0:
            break;
          // line types 1 + 2 = compressed bitmap line
          case 1:
          case 2:
            var lineHeader = this.readUint32(false);
            // line type 2 starts as an inverted line
            if (lineType == 2) layerBitmap.fill(1, chunkOffset, chunkOffset + 256);
            // loop through each bit in the line header
            while (lineHeader & 0xFFFFFFFF) {
              // if the bit is set, this 8-pix wide chunk is stored
              // else we can just leave it blank and move on to the next chunk
              if (lineHeader & 0x80000000) {
                var chunk = this.readUint8();
                // unpack chunk bits
                for (let pixel = 0; pixel < 8; pixel++) {
                  layerBitmap[chunkOffset + pixel] = chunk >> pixel & 0x1;
                }
              }
              chunkOffset += 8;
              lineHeader <<= 1;
            }
            break;
          // line type 3 = raw bitmap line
          case 3:
            while(chunkOffset < (line + 1) * 256) {
              var chunk = this.readUint8();
              for (let pixel = 0; pixel < 8; pixel++) {
                layerBitmap[chunkOffset + pixel] = chunk >> pixel & 0x1;
              }
              chunkOffset += 8;
            }
            break;
        }
      }
    }
    if (isTranslated) {
      // TODO: handle prev frame translation
    }
    if (!isNewFrame) {
      for (let i = 0; i < 256 * 192; i++) {
        this.layers[0][i] = this.layers[0][i] ^ this.layers_prev[0][i];
        this.layers[1][i] = this.layers[1][i] ^ this.layers_prev[1][i];
      }
    }
    return this.layers;
  }

  decodeAudio(track) {
    this._seekToAudio(track);
    var trackLen = this.trackMeta[track].length;
    var buffer = new Uint8Array(trackLen);
    for (let i = 0; i < trackLen; i++) {
      var byte = this.readUint8();
      buffer[i] = (byte & 0xF) << 4 | (byte >> 4);
    }
    return buffer;
  }

}