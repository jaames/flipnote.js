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

import dataStream from "utils/dataStream";

import {
  ADPCM_INDEX_TABLE_4,
  ADPCM_SAMPLE_TABLE_4
} from "utils/adpcm";

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

const WIDTH = 256;
const HEIGHT = 192;

const PALETTE = {
  WHITE: [0xff, 0xff, 0xff],
  BLACK: [0x0e, 0x0e, 0x0e],
  RED:   [0xff, 0x2a, 0x2a],
  BLUE:  [0x0a, 0x39, 0xff],
};

export default class ppmParser extends dataStream {
  /**
  * Create a ppmDecoder instance
  * @param {ArrayBuffer} arrayBuffer - data to read from
  */
  constructor(arrayBuffer) {
    super(arrayBuffer);
    this.type = "PPM";
    this._decodeHeader();
    this._decodeAnimationHeader();
    this._decodeSoundHeader();
    this._decodeMeta();
    this.sampleRate = 8192;
    this.palette = PALETTE;
    // create image buffers
     this._layers = [
      new Uint8Array(WIDTH * HEIGHT),
      new Uint8Array(WIDTH * HEIGHT)
    ];
    this._prevLayers = [
      new Uint8Array(WIDTH * HEIGHT),
      new Uint8Array(WIDTH * HEIGHT)
    ];
    this._prevDecodedFrame = null;
  }

  static validateFSID(fsid) {
    return /[0159]{1}[0-9A-F]{6}0[0-9A-F]{8}/.test(fsid);
  }

  static validateFilename(filename) {
    return /[0-9A-F]{6}_[0-9A-F]{13}_[0-9]{3}/.test(filename);
  }

  /**
  * Read a packed filename
  * @returns {string}
  * @access protected
  */
  readFilename() {
    return [
      this.readHex(3),
      this.readUtf8(13),
      this.readUint16().toString().padStart(3, "0")
    ].join("_");
  }

  /**
  * Unpack the line encoding flags for all 192 lines in a layer
  * @returns {array}
  * @access protected
  */
  readLineEncoding() {
    var unpacked = new Uint8Array(HEIGHT);
    for (var byteOffset = 0; byteOffset < 48; byteOffset ++) {
      var byte = this.readUint8();
      // each line's encoding type is stored as a 2-bit value
      for (var bitOffset = 0; bitOffset < 8; bitOffset += 2) {
        unpacked[byteOffset * 4 + bitOffset / 2] = (byte >> bitOffset) & 0x03;
      }
    }
    return unpacked;
  }

  _decodeHeader() {
    this.seek(0);
    // decode header
    // https://github.com/pbsds/hatena-server/wiki/PPM-format#file-header
    let magic = this.readUint32();
    this._frameDataLength = this.readUint32();
    this._soundDataLength = this.readUint32();
    this.frameCount = this.readUint16() + 1;
    this.version = this.readUint16();
  }

  _decodeMeta() {
    // https://github.com/pbsds/hatena-server/wiki/PPM-format#file-header
    this.seek(0x10);
    var lock = this.readUint16(),
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
    var timestamp = new Date((this.readUint32() + 946684800) * 1000);
    this.seek(0x06A6);
    var flags = this.readUint16();
    this.thumbFrameIndex = thumbIndex;
    this.meta = {
      lock: lock,
      loop: flags >> 1 & 0x01,
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

  _decodeAnimationHeader() {
    // jump to the start of the animation data section
    // https://github.com/pbsds/hatena-server/wiki/PPM-format#animation-data-section
    this.seek(0x06A0);
    var offsetTableLength = this.readUint16();
    // skip padding + flags
    this.seek(0x06A8);
    // read frame offsets and build them into a table
    this._frameOffsets = new Uint32Array(offsetTableLength / 4).map(value => {
      return 0x06A8 + offsetTableLength + this.readUint32();
    });
  }

  _decodeSoundHeader() {
    // https://github.com/pbsds/hatena-server/wiki/PPM-format#sound-data-section
    // offset = frame data offset + frame data length + sound effect flags
    var offset = 0x06A0 + this._frameDataLength + this.frameCount;
    // account for multiple-of-4 padding
    if (offset % 2 != 0) offset += 4 - (offset % 4);
    this.seek(offset);
    var bgmLen = this.readUint32();
    var se1Len = this.readUint32();
    var se2Len = this.readUint32();
    var se3Len = this.readUint32();
    this.frameSpeed = 8 - this.readUint8();
    this.bgmSpeed = 8 - this.readUint8();
    offset += 32;
    this.framerate = FRAMERATES[this.frameSpeed];
    this.bgmrate = FRAMERATES[this.bgmSpeed];
    this.soundMeta = {
      "bgm": {offset: offset,           length: bgmLen},
      "se1": {offset: offset += bgmLen, length: se1Len},
      "se2": {offset: offset += se1Len, length: se2Len},
      "se3": {offset: offset += se2Len, length: se3Len},
    };
  }

  /**
  * Check whether or not a given frame is based on the previous one
  * @param {number} index - zero-based frame index 
  * @returns {boolean}
  */
  isNewFrame(index) {
    this.seek(this._frameOffsets[index]);
    var header = this.readUint8();
    return (header >> 7) & 0x1;
  }

  /**
  * Get the color palette for a given frame
  * @param {number} index - zero-based frame index 
  * @returns {array} rgba palette in order of paper, layer1, layer2
  */
  getFramePalette(index) {
    this.seek(this._frameOffsets[index]);
    const palette = this.palette;
    var header = this.readUint8();
    var paperColor = header & 0x1;
    var pen = [
      palette.BLACK,
      paperColor == 1 ? palette.BLACK : palette.WHITE,
      palette.RED,
      palette.BLUE,
    ];
    return [
      paperColor == 1 ? palette.WHITE : palette.BLACK,
      pen[(header >> 1) & 0x3], // layer 1 color
      pen[(header >> 3) & 0x3], // layer 2 color
    ];
  }

  /**
  * Decode a frame
  * @param {number} index - zero-based frame index 
  * @returns {array} - 2 uint8 arrays representing each layer
  * */
  decodeFrame(index) {
    if ((index !== 0) && (this._prevDecodedFrame !== index - 1) && (!this.isNewFrame(index)))
      this.decodeFrame(index - 1);
    // https://github.com/pbsds/hatena-server/wiki/PPM-format#animation-frame
    this.seek(this._frameOffsets[index]);
    var header = this.readUint8();
    var isNewFrame = (header >> 7) & 0x1;
    var isTranslated = (header >> 5) & 0x3;
    var translateX = 0;
    var translateY = 0;
    // copy the current layer buffers to the previous ones
    this._prevLayers[0].set(this._layers[0]);
    this._prevLayers[1].set(this._layers[1]);
    this._prevDecodedFrame = index;
    // reset current layer buffers
    this._layers[0].fill(0);
    this._layers[1].fill(0);

    if (isTranslated) {
      translateX = this.readInt8();
      translateY = this.readInt8();
    }

    var layerEncoding = [
      this.readLineEncoding(),
      this.readLineEncoding(),
    ];
     // start decoding layer bitmaps
    for (var layer = 0; layer < 2; layer++) {
      var layerBitmap = this._layers[layer];
      for (var line = 0; line < HEIGHT; line++) {
        var chunkOffset = line * WIDTH;
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
            if (lineType == 2) layerBitmap.fill(0xFF, chunkOffset, chunkOffset + WIDTH);
            // loop through each bit in the line header
            while (lineHeader & 0xFFFFFFFF) {
              // if the bit is set, this 8-pix wide chunk is stored
              // else we can just leave it blank and move on to the next chunk
              if (lineHeader & 0x80000000) {
                var chunk = this.readUint8();
                // unpack chunk bits
                for (var pixel = 0; pixel < 8; pixel++) {
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
            while(chunkOffset < (line + 1) * WIDTH) {
              var chunk = this.readUint8();
              for (var pixel = 0; pixel < 8; pixel++) {
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
      var dest, src;
      // loop through each line
      for (var y = 0; y < HEIGHT; y++) {
        // skip to next line if this one falls off the top edge of the screen
        if (y - translateY < 0) continue;
        // stop once the bottom screen edge has been reached
        if (y - translateY >= HEIGHT) break;
        // loop through each pixel in the line
        for (var x = 0; x < WIDTH; x++) {
          // skip to the next pixel if this one falls off the left edge of the screen
          if (x - translateX < 0) continue;
          // stop diffing this line once the right screen edge has been reached
          if (x - translateX >= WIDTH) break;
          dest = x + y * WIDTH;
          src = dest - (translateX + translateY * WIDTH);
          // diff pixels with a binary XOR
          this._layers[0][dest] ^= this._prevLayers[0][src];
          this._layers[1][dest] ^= this._prevLayers[1][src];
        }
      }
    }
    return this._layers;
  }

  // retuns an uint8 array where each item is a pixel's palette index
  getLayerPixels(frameIndex, layerIndex) {
    if (this._prevDecodedFrame !== frameIndex) {
      this.decodeFrame(frameIndex);
    }
    const layer = this._layers[layerIndex];
    const image = new Uint8Array((256 * 192));
    const layerColor = layerIndex + 1
    for (let pixel = 0; pixel < image.length; pixel++) {
      if (layer[pixel] !== 0) {
        image[pixel] = layerColor;
      }
    }
    return image;
  }

  // retuns an uint8 array where each item is a pixel's palette index
  getFramePixels(frameIndex, useGlobalPalette = false) {
    let paletteMap;
    if (useGlobalPalette) {
      const framePalette = this.getFramePalette(frameIndex);
      paletteMap = framePalette.map(color => ppmParser.globalPalette.indexOf(color));
    } else {
      paletteMap = [0, 1, 2];
    }
    const layers = this.decodeFrame(frameIndex);
    const image = new Uint8Array((256 * 192));
    image.fill(paletteMap[0]);
    for (let pixel = 0; pixel < image.length; pixel++) {
      let a = layers[0][pixel];
      let b = layers[1][pixel];
      if (b) image[pixel] = paletteMap[2];
      if (a) image[pixel] = paletteMap[1];
    }
    return image;
  }

  hasAudioTrack(trackIndex) {
    let id = ["bgm", "se1", "se2", "se3"][trackIndex];
    return this.soundMeta[id].length > 0;
  }

  /**
  * Decode an audio track to 32-bit adpcm
  * @param {string} track - track name, "bgm" | "se1" | "se2" | "se3"
  * @returns {Int16Array}
  */
  decodeAudio(track) {
    let meta = this.soundMeta[track];
    let adpcm = new Uint8Array(this.buffer, meta.offset, meta.length);
    let output = new Int16Array(adpcm.length * 2);
    let outputOffset = 0;
    // initial decoder state
    var prevDiff = 0;
    var prevStepIndex = 0;
    var sample, diff, stepIndex;
    // loop through each byte in the raw adpcm data
    for (let index = 0; index < adpcm.length; index++) {
      let byte = adpcm[index];
      var bitPos = 0;
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
        output[outputOffset] = (diff);
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

  /**
  * Decode the sound effect usage for each frame
  * @returns {array}
  */
  decodeSoundFlags() {
    this.seek(0x06A0 + this._frameDataLength);
    // per msdn docs - the array map callback is only invoked for array indicies that have assigned values
    // so when we create an array, we need to fill it with something before we can map over it
    var arr = new Array(this.frameCount).fill([]);
    return arr.map(value => {
      var byte = this.readUint8();
      return [byte & 0x1, (byte >> 1) & 0x1, (byte >> 2) & 0x1];
    });
  }
}

ppmParser.width = WIDTH;
ppmParser.height = HEIGHT;
ppmParser.globalPalette = [
  PALETTE.BLACK,
  PALETTE.WHITE,
  PALETTE.RED,
  PALETTE.BLUE
];