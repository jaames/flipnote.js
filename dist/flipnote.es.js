/*!!
 flipnote.js v4.1.0 (web version)
 Browser-based playback of .ppm and .kwz animations from Flipnote Studio and Flipnote Studio 3D
 2018 - 2020 James Daniel
 github.com/jaames/flipnote.js
 Flipnote Studio is (c) Nintendo Co., Ltd.
*/

var urlLoader = {
    matches: function (source) {
        return typeof source === 'string';
    },
    load: function (source, resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', source, true);
        xhr.responseType = 'arraybuffer';
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response);
                }
                else {
                    reject({
                        type: 'httpError',
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                }
            }
        };
        xhr.send(null);
    }
};

var fileLoader = {
    matches: function (source) {
        return (typeof File !== 'undefined' && source instanceof File);
    },
    load: function (source, resolve, reject) {
        if (typeof FileReader !== 'undefined') {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(reader.result);
            };
            reader.onerror = (event) => {
                reject({ type: 'fileReadError' });
            };
            reader.readAsArrayBuffer(source);
        }
        else {
            reject();
        }
    }
};

var arrayBufferLoader = {
    matches: function (source) {
        return (source instanceof ArrayBuffer);
    },
    load: function (source, resolve, reject) {
        resolve(source);
    }
};

const loaders = [
    urlLoader,
    fileLoader,
    arrayBufferLoader
];
function loadSource(source) {
    return new Promise(function (resolve, reject) {
        loaders.forEach(loader => {
            if (loader.matches(source)) {
                loader.load(source, resolve, reject);
            }
        });
    });
}

class ByteArray {
    constructor() {
        this.page = -1;
        this.pages = [];
        this.cursor = 0;
        this.newPage();
    }
    newPage() {
        this.pages[++this.page] = new Uint8Array(ByteArray.pageSize);
        this.cursor = 0;
    }
    getData() {
        const data = new Uint8Array((this.page) * ByteArray.pageSize + this.cursor);
        this.pages.map((page, index) => {
            if (index === this.page) {
                data.set(page.slice(0, this.cursor), index * ByteArray.pageSize);
            }
            else {
                data.set(page, index * ByteArray.pageSize);
            }
        });
        return data;
    }
    getBuffer() {
        const data = this.getData();
        return data.buffer;
    }
    writeByte(val) {
        if (this.cursor >= ByteArray.pageSize)
            this.newPage();
        this.pages[this.page][this.cursor++] = val;
    }
    writeBytes(array, offset, length) {
        for (let l = length || array.length, i = offset || 0; i < l; i++)
            this.writeByte(array[i]);
    }
}
ByteArray.pageSize = 4096;

class DataStream {
    constructor(arrayBuffer) {
        this.buffer = arrayBuffer;
        this.data = new DataView(arrayBuffer);
        this.cursor = 0;
    }
    get bytes() {
        return new Uint8Array(this.buffer);
    }
    get byteLength() {
        return this.data.byteLength;
    }
    seek(offset, whence) {
        switch (whence) {
            case 2 /* End */:
                this.cursor = this.data.byteLength + offset;
                break;
            case 1 /* Current */:
                this.cursor += offset;
                break;
            case 0 /* Begin */:
            default:
                this.cursor = offset;
                break;
        }
    }
    readUint8() {
        const val = this.data.getUint8(this.cursor);
        this.cursor += 1;
        return val;
    }
    writeUint8(value) {
        this.data.setUint8(this.cursor, value);
        this.cursor += 1;
    }
    readInt8() {
        const val = this.data.getInt8(this.cursor);
        this.cursor += 1;
        return val;
    }
    writeInt8(value) {
        this.data.setInt8(this.cursor, value);
        this.cursor += 1;
    }
    readUint16(littleEndian = true) {
        const val = this.data.getUint16(this.cursor, littleEndian);
        this.cursor += 2;
        return val;
    }
    writeUint16(value, littleEndian = true) {
        this.data.setUint16(this.cursor, value, littleEndian);
        this.cursor += 2;
    }
    readInt16(littleEndian = true) {
        const val = this.data.getInt16(this.cursor, littleEndian);
        this.cursor += 2;
        return val;
    }
    writeInt16(value, littleEndian = true) {
        this.data.setInt16(this.cursor, value, littleEndian);
        this.cursor += 2;
    }
    readUint32(littleEndian = true) {
        const val = this.data.getUint32(this.cursor, littleEndian);
        this.cursor += 4;
        return val;
    }
    writeUint32(value, littleEndian = true) {
        this.data.setUint32(this.cursor, value, littleEndian);
        this.cursor += 4;
    }
    readInt32(littleEndian = true) {
        const val = this.data.getInt32(this.cursor, littleEndian);
        this.cursor += 4;
        return val;
    }
    writeInt32(value, littleEndian = true) {
        this.data.setInt32(this.cursor, value, littleEndian);
        this.cursor += 4;
    }
    readBytes(count) {
        const bytes = new Uint8Array(this.data.buffer, this.cursor, count);
        this.cursor += bytes.byteLength;
        return bytes;
    }
    writeBytes(bytes) {
        bytes.forEach((byte) => this.writeUint8(byte));
    }
    readHex(count, reverse = false) {
        const bytes = this.readBytes(count);
        let hex = [];
        for (let i = 0; i < bytes.length; i++) {
            hex.push(bytes[i].toString(16).padStart(2, '0'));
        }
        if (reverse)
            hex.reverse();
        return hex.join('').toUpperCase();
    }
    readChars(count) {
        const chars = this.readBytes(count);
        let str = '';
        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            if (char === 0)
                break;
            str += String.fromCharCode(char);
        }
        return str;
    }
    writeChars(string) {
        for (let i = 0; i < string.length; i++) {
            const char = string.charCodeAt(i);
            this.writeUint8(char);
        }
    }
    readWideChars(count) {
        const chars = new Uint16Array(this.data.buffer, this.cursor, count);
        let str = '';
        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            if (char == 0)
                break;
            str += String.fromCharCode(char);
        }
        this.cursor += chars.byteLength;
        return str;
    }
}

var FlipnoteAudioTrack;
(function (FlipnoteAudioTrack) {
    FlipnoteAudioTrack[FlipnoteAudioTrack["BGM"] = 0] = "BGM";
    FlipnoteAudioTrack[FlipnoteAudioTrack["SE1"] = 1] = "SE1";
    FlipnoteAudioTrack[FlipnoteAudioTrack["SE2"] = 2] = "SE2";
    FlipnoteAudioTrack[FlipnoteAudioTrack["SE3"] = 3] = "SE3";
    FlipnoteAudioTrack[FlipnoteAudioTrack["SE4"] = 4] = "SE4";
})(FlipnoteAudioTrack || (FlipnoteAudioTrack = {}));
class FlipnoteParserBase extends DataStream {
    hasAudioTrack(trackId) {
        if (this.soundMeta.hasOwnProperty(trackId) && this.soundMeta[trackId].length > 0) {
            return true;
        }
        return false;
    }
}

function clamp(n, l, h) {
    if (n < l)
        return l;
    if (n > h)
        return h;
    return n;
}
// zero-order hold interpolation
function pcmDsAudioResample(src, srcFreq, dstFreq) {
    const srcDuration = src.length / srcFreq;
    const dstLength = srcDuration * dstFreq;
    const dst = new Int16Array(dstLength);
    const adjFreq = (srcFreq << 8) / dstFreq;
    for (let n = 0; n < dst.length; n++) {
        dst[n] = src[(n * adjFreq) >> 8];
        // dst[n] = clamp(samp, -32768, 32767);
    }
    return dst;
}
function pcmAudioMix(src, dst, dstOffset = 0) {
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
const ADPCM_INDEX_TABLE_2BIT = new Int8Array([
    -1, 2, -1, 2
]);
const ADPCM_INDEX_TABLE_4BIT = new Int8Array([
    -1, -1, -1, -1, 2, 4, 6, 8,
    -1, -1, -1, -1, 2, 4, 6, 8
]);
// note that this is a slight deviation from the normal adpcm table
const ADPCM_STEP_TABLE = new Int16Array([
    7, 8, 9, 10, 11, 12, 13, 14, 16, 17,
    19, 21, 23, 25, 28, 31, 34, 37, 41, 45,
    50, 55, 60, 66, 73, 80, 88, 97, 107, 118,
    130, 143, 157, 173, 190, 209, 230, 253, 279, 307,
    337, 371, 408, 449, 494, 544, 598, 658, 724, 796,
    876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066,
    2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358,
    5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899,
    15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767, 0
]);
const ADPCM_SAMPLE_TABLE_2BIT = new Int16Array(90 * 4);
for (let sample = 0; sample < 4; sample++) {
    for (let stepIndex = 0; stepIndex < 90; stepIndex++) {
        let step = ADPCM_STEP_TABLE[stepIndex];
        let diff = step >> 3;
        if (sample & 1)
            diff += step;
        if (sample & 2)
            diff = -diff;
        ADPCM_SAMPLE_TABLE_2BIT[sample + 4 * stepIndex] = diff;
    }
}
const ADPCM_SAMPLE_TABLE_4BIT = new Int16Array(90 * 16);
for (let sample = 0; sample < 16; sample++) {
    for (let stepIndex = 0; stepIndex < 90; stepIndex++) {
        let step = ADPCM_STEP_TABLE[stepIndex];
        let diff = step >> 3;
        if (sample & 4)
            diff += step;
        if (sample & 2)
            diff += step >> 1;
        if (sample & 1)
            diff += step >> 2;
        if (sample & 8)
            diff = -diff;
        ADPCM_SAMPLE_TABLE_4BIT[sample + 16 * stepIndex] = diff;
    }
}

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
// internal frame speed value -> FPS table
const FRAMERATES = [0.5, 0.5, 1, 2, 4, 6, 12, 20, 30];
const PALETTE = {
    WHITE: [0xff, 0xff, 0xff],
    BLACK: [0x0e, 0x0e, 0x0e],
    RED: [0xff, 0x2a, 0x2a],
    BLUE: [0x0a, 0x39, 0xff]
};
const DS_SAMPLE_RATE = 32768;
class PpmParser extends FlipnoteParserBase {
    constructor(arrayBuffer) {
        super(arrayBuffer);
        this.type = PpmParser.type;
        this.width = PpmParser.width;
        this.height = PpmParser.height;
        this.globalPalette = PpmParser.globalPalette;
        this.sampleRate = PpmParser.sampleRate;
        this.prevDecodedFrame = null;
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
    static validateFSID(fsid) {
        return /[0159]{1}[0-9A-F]{6}0[0-9A-F]{8}/.test(fsid);
    }
    static validateFilename(filename) {
        return /[0-9A-F]{6}_[0-9A-F]{13}_[0-9]{3}/.test(filename);
    }
    decodeHeader() {
        this.seek(0);
        // decode header
        // https://github.com/pbsds/hatena-server/wiki/PPM-format#file-header
        let magic = this.readUint32();
        this.frameDataLength = this.readUint32();
        this.soundDataLength = this.readUint32();
        this.frameCount = this.readUint16() + 1;
        this.version = this.readUint16();
    }
    readFilename() {
        return [
            this.readHex(3),
            this.readChars(13),
            this.readUint16().toString().padStart(3, '0')
        ].join('_');
    }
    decodeMeta() {
        // https://github.com/pbsds/hatena-server/wiki/PPM-format#file-header
        this.seek(0x10);
        const lock = this.readUint16(), thumbIndex = this.readInt16(), rootAuthorName = this.readWideChars(11), parentAuthorName = this.readWideChars(11), currentAuthorName = this.readWideChars(11), parentAuthorId = this.readHex(8, true), currentAuthorId = this.readHex(8, true), parentFilename = this.readFilename(), currentFilename = this.readFilename(), rootAuthorId = this.readHex(8, true);
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
    decodeAnimationHeader() {
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
    decodeSoundHeader() {
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
            [FlipnoteAudioTrack.BGM]: { offset: offset, length: bgmLen },
            [FlipnoteAudioTrack.SE1]: { offset: offset += bgmLen, length: se1Len },
            [FlipnoteAudioTrack.SE2]: { offset: offset += se1Len, length: se2Len },
            [FlipnoteAudioTrack.SE3]: { offset: offset += se2Len, length: se3Len },
        };
    }
    isNewFrame(frameIndex) {
        this.seek(this.frameOffsets[frameIndex]);
        const header = this.readUint8();
        return (header >> 7) & 0x1;
    }
    getLayerOrder(frameIndex) {
        return [0, 1];
    }
    readLineEncoding() {
        const unpacked = new Uint8Array(PpmParser.height);
        let unpackedPtr = 0;
        for (var byteIndex = 0; byteIndex < 48; byteIndex++) {
            const byte = this.readUint8();
            // each line's encoding type is stored as a 2-bit value
            for (var bitOffset = 0; bitOffset < 8; bitOffset += 2) {
                unpacked[unpackedPtr++] = (byte >> bitOffset) & 0x03;
            }
        }
        return unpacked;
    }
    decodeFrame(frameIndex) {
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
                switch (lineType) {
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
                        while (chunkOffset < (line + 1) * PpmParser.width) {
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
            let dest, src;
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
    getFramePaletteIndices(frameIndex) {
        this.seek(this.frameOffsets[frameIndex]);
        const header = this.readUint8();
        const isInverted = (header & 0x1) !== 1;
        const penMap = [
            isInverted ? 0 : 1,
            isInverted ? 0 : 1,
            2,
            3,
        ];
        return [
            isInverted ? 1 : 0,
            penMap[(header >> 1) & 0x3],
            penMap[(header >> 3) & 0x3],
        ];
    }
    getFramePalette(frameIndex) {
        const indices = this.getFramePaletteIndices(frameIndex);
        return indices.map(colorIndex => this.globalPalette[colorIndex]);
    }
    // retuns an uint8 array where each item is a pixel's palette index
    getLayerPixels(frameIndex, layerIndex) {
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
    getFramePixels(frameIndex) {
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
    decodeSoundFlags() {
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
    getAudioTrackRaw(trackId) {
        const trackMeta = this.soundMeta[trackId];
        const adpcm = new Uint8Array(this.buffer, trackMeta.offset, trackMeta.length);
        return adpcm;
    }
    // kinda slow, maybe use sample lookup table
    decodeAudioTrack(trackId) {
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
    getAudioTrackPcm(trackId, dstFreq = DS_SAMPLE_RATE) {
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
    getAudioMasterPcm(dstFreq = DS_SAMPLE_RATE) {
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
PpmParser.type = 'PPM';
PpmParser.width = 256;
PpmParser.height = 192;
PpmParser.sampleRate = 8192;
PpmParser.outputSampleRate = 32768;
PpmParser.globalPalette = [
    PALETTE.WHITE,
    PALETTE.BLACK,
    PALETTE.RED,
    PALETTE.BLUE
];

// Every possible sequence of pixels for each tile line
const KWZ_LINE_TABLE = new Uint16Array(6561 * 8);
const pixelValues = [0x0000, 0xFF00, 0x00FF];
var offset = 0;
for (let a = 0; a < 3; a++)
    for (let b = 0; b < 3; b++)
        for (let c = 0; c < 3; c++)
            for (let d = 0; d < 3; d++)
                for (let e = 0; e < 3; e++)
                    for (let f = 0; f < 3; f++)
                        for (let g = 0; g < 3; g++)
                            for (let h = 0; h < 3; h++) {
                                KWZ_LINE_TABLE.set([
                                    pixelValues[b],
                                    pixelValues[a],
                                    pixelValues[d],
                                    pixelValues[c],
                                    pixelValues[f],
                                    pixelValues[e],
                                    pixelValues[h],
                                    pixelValues[g]
                                ], offset);
                                offset += 8;
                            }
// Line offsets, but the lines are shifted to the left by one pixel
const KWZ_LINE_TABLE_SHIFT = new Uint16Array(6561 * 8);
var offset = 0;
for (let a = 0; a < 2187; a += 729)
    for (let b = 0; b < 729; b += 243)
        for (let c = 0; c < 243; c += 81)
            for (let d = 0; d < 81; d += 27)
                for (let e = 0; e < 27; e += 9)
                    for (let f = 0; f < 9; f += 3)
                        for (let g = 0; g < 3; g += 1)
                            for (let h = 0; h < 6561; h += 2187) {
                                const lineTableIndex = a + b + c + d + e + f + g + h;
                                const pixels = KWZ_LINE_TABLE.subarray(lineTableIndex * 8, lineTableIndex * 8 + 8);
                                KWZ_LINE_TABLE_SHIFT.set(pixels, offset);
                                offset += 8;
                            }
// Commonly occuring line offsets
const KWZ_LINE_TABLE_COMMON = new Uint16Array(32 * 8);
[
    0x0000, 0x0CD0, 0x19A0, 0x02D9, 0x088B, 0x0051, 0x00F3, 0x0009,
    0x001B, 0x0001, 0x0003, 0x05B2, 0x1116, 0x00A2, 0x01E6, 0x0012,
    0x0036, 0x0002, 0x0006, 0x0B64, 0x08DC, 0x0144, 0x00FC, 0x0024,
    0x001C, 0x0004, 0x0334, 0x099C, 0x0668, 0x1338, 0x1004, 0x166C
].forEach((lineTableIndex, index) => {
    const pixels = KWZ_LINE_TABLE.subarray(lineTableIndex * 8, lineTableIndex * 8 + 8);
    KWZ_LINE_TABLE_COMMON.set(pixels, index * 8);
});
// Commonly occuring line offsets, but the lines are shifted to the left by one pixel
const KWZ_LINE_TABLE_COMMON_SHIFT = new Uint16Array(32 * 8);
[
    0x0000, 0x0CD0, 0x19A0, 0x0003, 0x02D9, 0x088B, 0x0051, 0x00F3,
    0x0009, 0x001B, 0x0001, 0x0006, 0x05B2, 0x1116, 0x00A2, 0x01E6,
    0x0012, 0x0036, 0x0002, 0x02DC, 0x0B64, 0x08DC, 0x0144, 0x00FC,
    0x0024, 0x001C, 0x099C, 0x0334, 0x1338, 0x0668, 0x166C, 0x1004
].forEach((lineTableIndex, index) => {
    const pixels = KWZ_LINE_TABLE.subarray(lineTableIndex * 8, lineTableIndex * 8 + 8);
    KWZ_LINE_TABLE_COMMON_SHIFT.set(pixels, index * 8);
});

const FRAMERATES$1 = [.2, .5, 1, 2, 4, 6, 8, 12, 20, 24, 30];
const PALETTE$1 = {
    WHITE: [0xff, 0xff, 0xff],
    BLACK: [0x10, 0x10, 0x10],
    RED: [0xff, 0x10, 0x10],
    YELLOW: [0xff, 0xe7, 0x00],
    GREEN: [0x00, 0x86, 0x31],
    BLUE: [0x00, 0x38, 0xce],
    NONE: [0xff, 0xff, 0xff]
};
const CTR_SAMPLE_RATE = 32768;
class KwzParser extends FlipnoteParserBase {
    constructor(arrayBuffer) {
        super(arrayBuffer);
        this.type = KwzParser.type;
        this.width = KwzParser.width;
        this.height = KwzParser.height;
        this.globalPalette = KwzParser.globalPalette;
        this.sampleRate = KwzParser.sampleRate;
        this.prevDecodedFrame = null;
        this.bitIndex = 0;
        this.bitValue = 0;
        this.layers = [
            new Uint16Array(KwzParser.width * KwzParser.height),
            new Uint16Array(KwzParser.width * KwzParser.height),
            new Uint16Array(KwzParser.width * KwzParser.height),
        ];
        this.bitIndex = 0;
        this.bitValue = 0;
        this.load();
    }
    load() {
        this.seek(0);
        this.sections = {};
        this.frameMeta = [];
        const fileSize = this.byteLength - 256;
        let offset = 0;
        let sectionCount = 0;
        // counting sections should mitigate against one of mrnbayoh's notehax exploits
        while ((offset < fileSize) && (sectionCount < 6)) {
            this.seek(offset);
            const sectionMagic = this.readChars(4).substring(0, 3);
            const sectionLength = this.readUint32();
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
    readBits(num) {
        if (this.bitIndex + num > 16) {
            const nextBits = this.readUint16();
            this.bitValue |= nextBits << (16 - this.bitIndex);
            this.bitIndex -= 16;
        }
        const mask = (1 << num) - 1;
        const result = this.bitValue & mask;
        this.bitValue >>= num;
        this.bitIndex += num;
        return result;
    }
    decodeMeta() {
        this.seek(this.sections['KFH'].offset + 12);
        const creationTimestamp = new Date((this.readUint32() + 946684800) * 1000), modifiedTimestamp = new Date((this.readUint32() + 946684800) * 1000), appVersion = this.readUint32(), rootAuthorId = this.readHex(10), parentAuthorId = this.readHex(10), currentAuthorId = this.readHex(10), rootAuthorName = this.readWideChars(11), parentAuthorName = this.readWideChars(11), currentAuthorName = this.readWideChars(11), rootFilename = this.readChars(28), parentFilename = this.readChars(28), currentFilename = this.readChars(28), frameCount = this.readUint16(), thumbIndex = this.readUint16(), flags = this.readUint16(), frameSpeed = this.readUint8(), layerFlags = this.readUint8();
        this.frameCount = frameCount;
        this.thumbFrameIndex = thumbIndex;
        this.frameSpeed = frameSpeed;
        this.framerate = FRAMERATES$1[frameSpeed];
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
    decodeFrameMeta() {
        this.frameOffsets = new Uint32Array(this.frameCount);
        this.seek(this.sections['KMI'].offset + 8);
        let offset = this.sections['KMC'].offset + 12;
        for (let i = 0; i < this.frameCount; i++) {
            const frame = {
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
    decodeSoundHeader() {
        if (this.sections.hasOwnProperty('KSN')) {
            let offset = this.sections['KSN'].offset + 8;
            this.seek(offset);
            const bgmSpeed = this.readUint32();
            this.bgmSpeed = bgmSpeed;
            this.bgmrate = FRAMERATES$1[bgmSpeed];
            const trackSizes = new Uint32Array(this.buffer, offset + 4, 20);
            this.soundMeta = {
                [FlipnoteAudioTrack.BGM]: { offset: offset += 28, length: trackSizes[0] },
                [FlipnoteAudioTrack.SE1]: { offset: offset += trackSizes[0], length: trackSizes[1] },
                [FlipnoteAudioTrack.SE2]: { offset: offset += trackSizes[1], length: trackSizes[2] },
                [FlipnoteAudioTrack.SE3]: { offset: offset += trackSizes[2], length: trackSizes[3] },
                [FlipnoteAudioTrack.SE4]: { offset: offset += trackSizes[3], length: trackSizes[4] },
            };
        }
    }
    getDiffingFlag(frameIndex) {
        return ~(this.frameMeta[frameIndex].flags >> 4) & 0x07;
    }
    getLayerDepths(frameIndex) {
        return this.frameMeta[frameIndex].layerDepth;
    }
    // sort layer indices sorted by depth, from bottom to top
    getLayerOrder(frameIndex) {
        const depths = this.getLayerDepths(frameIndex);
        return [2, 1, 0].sort((a, b) => depths[b] - depths[a]);
    }
    decodeFrame(frameIndex, diffingFlag = 0x7, isPrevFrame = false) {
        // if this frame is being decoded as a prev frame, then we only want to decode the layers necessary
        if (isPrevFrame)
            diffingFlag &= this.getDiffingFlag(frameIndex + 1);
        // the prevDecodedFrame check is an optimisation for decoding frames in full sequence
        if ((this.prevDecodedFrame !== frameIndex - 1) && (diffingFlag) && (frameIndex !== 0))
            this.decodeFrame(frameIndex - 1, diffingFlag = diffingFlag, isPrevFrame = true);
        const meta = this.frameMeta[frameIndex];
        let offset = this.frameOffsets[frameIndex];
        for (let layerIndex = 0; layerIndex < 3; layerIndex++) {
            this.seek(offset);
            const layerSize = meta.layerSize[layerIndex];
            offset += layerSize;
            // if the layer is 38 bytes then it hasn't changed at all since the previous frame, so we can skip it
            if (layerSize === 38)
                continue;
            if (((diffingFlag >> layerIndex) & 0x1) === 0)
                continue;
            this.bitIndex = 16;
            this.bitValue = 0;
            let skip = 0;
            for (let tileOffsetY = 0; tileOffsetY < KwzParser.height; tileOffsetY += 128) {
                for (let tileOffsetX = 0; tileOffsetX < KwzParser.width; tileOffsetX += 128) {
                    for (let subTileOffsetY = 0; subTileOffsetY < 128; subTileOffsetY += 8) {
                        const y = tileOffsetY + subTileOffsetY;
                        if (y >= KwzParser.height)
                            break;
                        for (let subTileOffsetX = 0; subTileOffsetX < 128; subTileOffsetX += 8) {
                            const x = tileOffsetX + subTileOffsetX;
                            if (x >= KwzParser.width)
                                break;
                            if (skip) {
                                skip -= 1;
                                continue;
                            }
                            const pixelOffset = y * KwzParser.width + x;
                            const pixelBuffer = this.layers[layerIndex];
                            const type = this.readBits(3);
                            if (type == 0) {
                                const lineIndex = this.readBits(5);
                                const pixels = KWZ_LINE_TABLE_COMMON.subarray(lineIndex * 8, lineIndex * 8 + 8);
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
                                const lineIndex = this.readBits(13);
                                const pixels = KWZ_LINE_TABLE.subarray(lineIndex * 8, lineIndex * 8 + 8);
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
                                const lineValue = this.readBits(5);
                                const a = KWZ_LINE_TABLE_COMMON.subarray(lineValue * 8, lineValue * 8 + 8);
                                const b = KWZ_LINE_TABLE_COMMON_SHIFT.subarray(lineValue * 8, lineValue * 8 + 8);
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
                                const lineValue = this.readBits(13);
                                const a = KWZ_LINE_TABLE.subarray(lineValue * 8, lineValue * 8 + 8);
                                const b = KWZ_LINE_TABLE_SHIFT.subarray(lineValue * 8, lineValue * 8 + 8);
                                pixelBuffer.set(a, pixelOffset);
                                pixelBuffer.set(b, pixelOffset + 320);
                                pixelBuffer.set(a, pixelOffset + 640);
                                pixelBuffer.set(b, pixelOffset + 960);
                                pixelBuffer.set(a, pixelOffset + 1280);
                                pixelBuffer.set(b, pixelOffset + 1600);
                                pixelBuffer.set(a, pixelOffset + 1920);
                                pixelBuffer.set(b, pixelOffset + 2240);
                            }
                            // most common tile type
                            else if (type == 4) {
                                const mask = this.readBits(8);
                                for (let line = 0; line < 8; line++) {
                                    if (mask & (1 << line)) {
                                        const lineIndex = this.readBits(5);
                                        const pixels = KWZ_LINE_TABLE_COMMON.subarray(lineIndex * 8, lineIndex * 8 + 8);
                                        pixelBuffer.set(pixels, pixelOffset + line * 320);
                                    }
                                    else {
                                        const lineIndex = this.readBits(13);
                                        const pixels = KWZ_LINE_TABLE.subarray(lineIndex * 8, lineIndex * 8 + 8);
                                        pixelBuffer.set(pixels, pixelOffset + line * 320);
                                    }
                                }
                            }
                            else if (type == 5) {
                                skip = this.readBits(5);
                                continue;
                            }
                            // type 6 doesnt exist
                            else if (type == 7) {
                                let pattern = this.readBits(2);
                                let useCommonLines = this.readBits(1);
                                let a;
                                let b;
                                if (useCommonLines) {
                                    const lineIndexA = this.readBits(5);
                                    const lineIndexB = this.readBits(5);
                                    a = KWZ_LINE_TABLE_COMMON.subarray(lineIndexA * 8, lineIndexA * 8 + 8);
                                    b = KWZ_LINE_TABLE_COMMON.subarray(lineIndexB * 8, lineIndexB * 8 + 8);
                                    pattern = (pattern + 1) % 4;
                                }
                                else {
                                    const lineIndexA = this.readBits(13);
                                    const lineIndexB = this.readBits(13);
                                    a = KWZ_LINE_TABLE.subarray(lineIndexA * 8, lineIndexA * 8 + 8);
                                    b = KWZ_LINE_TABLE.subarray(lineIndexB * 8, lineIndexB * 8 + 8);
                                }
                                if (pattern == 0) {
                                    pixelBuffer.set(a, pixelOffset);
                                    pixelBuffer.set(b, pixelOffset + 320);
                                    pixelBuffer.set(a, pixelOffset + 640);
                                    pixelBuffer.set(b, pixelOffset + 960);
                                    pixelBuffer.set(a, pixelOffset + 1280);
                                    pixelBuffer.set(b, pixelOffset + 1600);
                                    pixelBuffer.set(a, pixelOffset + 1920);
                                    pixelBuffer.set(b, pixelOffset + 2240);
                                }
                                else if (pattern == 1) {
                                    pixelBuffer.set(a, pixelOffset);
                                    pixelBuffer.set(a, pixelOffset + 320);
                                    pixelBuffer.set(b, pixelOffset + 640);
                                    pixelBuffer.set(a, pixelOffset + 960);
                                    pixelBuffer.set(a, pixelOffset + 1280);
                                    pixelBuffer.set(b, pixelOffset + 1600);
                                    pixelBuffer.set(a, pixelOffset + 1920);
                                    pixelBuffer.set(a, pixelOffset + 2240);
                                }
                                else if (pattern == 2) {
                                    pixelBuffer.set(a, pixelOffset);
                                    pixelBuffer.set(b, pixelOffset + 320);
                                    pixelBuffer.set(a, pixelOffset + 640);
                                    pixelBuffer.set(a, pixelOffset + 960);
                                    pixelBuffer.set(b, pixelOffset + 1280);
                                    pixelBuffer.set(a, pixelOffset + 1600);
                                    pixelBuffer.set(a, pixelOffset + 1920);
                                    pixelBuffer.set(b, pixelOffset + 2240);
                                }
                                else if (pattern == 3) {
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
    getFramePaletteIndices(frameIndex) {
        const { flags } = this.frameMeta[frameIndex];
        return [
            flags & 0xF,
            (flags >> 8) & 0xF,
            (flags >> 12) & 0xF,
            (flags >> 16) & 0xF,
            (flags >> 20) & 0xF,
            (flags >> 24) & 0xF,
            (flags >> 28) & 0xF,
        ];
    }
    getFramePalette(frameIndex) {
        const indices = this.getFramePaletteIndices(frameIndex);
        return indices.map(colorIndex => this.globalPalette[colorIndex]);
    }
    // retuns an uint8 array where each item is a pixel's palette index
    getLayerPixels(frameIndex, layerIndex) {
        if (this.prevDecodedFrame !== frameIndex)
            this.decodeFrame(frameIndex);
        const palette = this.getFramePaletteIndices(frameIndex);
        const layers = this.layers[layerIndex];
        const image = new Uint8Array((KwzParser.width * KwzParser.height));
        const paletteOffset = layerIndex * 2 + 1;
        for (let pixelIndex = 0; pixelIndex < layers.length; pixelIndex++) {
            let pixel = layers[pixelIndex];
            if (pixel & 0xff00)
                image[pixelIndex] = palette[paletteOffset];
            else if (pixel & 0x00ff)
                image[pixelIndex] = palette[paletteOffset + 1];
        }
        return image;
    }
    // retuns an uint8 array where each item is a pixel's palette index
    getFramePixels(frameIndex) {
        const palette = this.getFramePaletteIndices(frameIndex);
        const image = new Uint8Array((KwzParser.width * KwzParser.height));
        image.fill(palette[0]); // fill with paper color first
        const layerOrder = this.getLayerOrder(frameIndex);
        layerOrder.forEach(layerIndex => {
            const layer = this.getLayerPixels(frameIndex, layerIndex);
            // merge layer into image result
            for (let pixelIndex = 0; pixelIndex < layer.length; pixelIndex++) {
                const pixel = layer[pixelIndex];
                if (pixel !== 0)
                    image[pixelIndex] = pixel;
            }
        });
        return image;
    }
    decodeSoundFlags() {
        return this.frameMeta.map(frame => {
            const soundFlags = frame.soundFlags;
            return [
                (soundFlags & 0x1) !== 0,
                (soundFlags & 0x2) !== 0,
                (soundFlags & 0x4) !== 0,
                (soundFlags & 0x8) !== 0,
            ];
        });
    }
    getAudioTrackRaw(trackId) {
        const trackMeta = this.soundMeta[trackId];
        return new Uint8Array(this.buffer, trackMeta.offset, trackMeta.length);
    }
    decodeAudioTrack(trackId) {
        const adpcm = this.getAudioTrackRaw(trackId);
        const output = new Int16Array(16364 * 60);
        let outputOffset = 0;
        // initial decoder state
        let prevDiff = 0;
        let prevStepIndex = 40;
        let sample;
        let diff;
        let stepIndex;
        // loop through each byte in the raw adpcm data
        for (let adpcmOffset = 0; adpcmOffset < adpcm.length; adpcmOffset++) {
            const byte = adpcm[adpcmOffset];
            let bitPos = 0;
            while (bitPos < 8) {
                if (prevStepIndex < 18 || bitPos == 6) {
                    // isolate 2-bit sample
                    sample = (byte >> bitPos) & 0x3;
                    // get diff
                    diff = prevDiff + ADPCM_SAMPLE_TABLE_2BIT[sample + 4 * prevStepIndex];
                    // get step index
                    stepIndex = prevStepIndex + ADPCM_INDEX_TABLE_2BIT[sample];
                    bitPos += 2;
                }
                else {
                    // isolate 4-bit sample
                    sample = (byte >> bitPos) & 0xF;
                    // get diff
                    diff = prevDiff + ADPCM_SAMPLE_TABLE_4BIT[sample + 16 * prevStepIndex];
                    // get step index
                    stepIndex = prevStepIndex + ADPCM_INDEX_TABLE_4BIT[sample];
                    bitPos += 4;
                }
                // clamp step index and diff
                stepIndex = clamp(stepIndex, 0, 79);
                diff = clamp(diff, -2047, 2047);
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
    getAudioTrackPcm(trackId, dstFreq = CTR_SAMPLE_RATE) {
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
    getAudioMasterPcm(dstFreq = CTR_SAMPLE_RATE) {
        const duration = this.frameCount * (1 / this.framerate);
        const dstSize = Math.floor(duration * dstFreq);
        const master = new Int16Array(dstSize);
        const hasBgm = this.hasAudioTrack(FlipnoteAudioTrack.BGM);
        const hasSe1 = this.hasAudioTrack(FlipnoteAudioTrack.SE1);
        const hasSe2 = this.hasAudioTrack(FlipnoteAudioTrack.SE2);
        const hasSe3 = this.hasAudioTrack(FlipnoteAudioTrack.SE3);
        const hasSe4 = this.hasAudioTrack(FlipnoteAudioTrack.SE4);
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
            const se4Pcm = hasSe4 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE4, dstFreq) : null;
            for (let i = 0; i < this.frameCount; i++) {
                const seOffset = samplesPerFrame * i;
                const flag = seFlags[i];
                if (hasSe1 && flag[0])
                    pcmAudioMix(se1Pcm, master, seOffset);
                if (hasSe2 && flag[1])
                    pcmAudioMix(se2Pcm, master, seOffset);
                if (hasSe3 && flag[2])
                    pcmAudioMix(se3Pcm, master, seOffset);
                if (hasSe4 && flag[3])
                    pcmAudioMix(se4Pcm, master, seOffset);
            }
        }
        return master;
    }
}
KwzParser.type = 'KWZ';
KwzParser.width = 320;
KwzParser.height = 240;
KwzParser.sampleRate = 16364;
KwzParser.globalPalette = [
    PALETTE$1.WHITE,
    PALETTE$1.BLACK,
    PALETTE$1.RED,
    PALETTE$1.YELLOW,
    PALETTE$1.GREEN,
    PALETTE$1.BLUE,
    PALETTE$1.NONE,
];

function parseSource(source) {
    return loadSource(source)
        .then((arrayBuffer) => {
        return new Promise((resolve, reject) => {
            // check the buffer's magic to identify which format it uses
            const magicBytes = new Uint8Array(arrayBuffer.slice(0, 4));
            const magic = (magicBytes[0] << 24) | (magicBytes[1] << 16) | (magicBytes[2] << 8) | magicBytes[3];
            // check if magic is PARA (ppm magic)
            if (magic === 0x50415241)
                resolve(new PpmParser(arrayBuffer));
            // check if magic is KFH (kwz magic)
            else if ((magic & 0xFFFFFF00) === 0x4B464800)
                resolve(new KwzParser(arrayBuffer));
            else
                reject();
        });
    });
}

/*
  LZWEncoder.js

  Authors
  Kevin Weiner (original Java version - kweiner@fmsware.com)
  Thibault Imbert (AS3 version - bytearray.org)
  Johan Nordberg (JS version - code@johan-nordberg.com)
  James Daniel (ES6/TS version)

  Acknowledgements
  GIFCOMPR.C - GIF Image compression routines
  Lempel-Ziv compression based on 'compress'. GIF modifications by
  David Rowley (mgardi@watdcsu.waterloo.edu)
  GIF Image compression - modified 'compress'
  Based on: compress.c - File compression ala IEEE Computer, June 1984.
  By Authors: Spencer W. Thomas (decvax!harpo!utah-cs!utah-gr!thomas)
  Jim McKie (decvax!mcvax!jim)
  Steve Davies (decvax!vax135!petsd!peora!srd)
  Ken Turkowski (decvax!decwrl!turtlevax!ken)
  James A. Woods (decvax!ihnp4!ames!jaw)
  Joe Orost (decvax!vax135!petsd!joe)
*/
const EOF = -1;
const BITS = 12;
const HSIZE = 5003; // 80% occupancy
const masks = [
    0x0000, 0x0001, 0x0003, 0x0007, 0x000F, 0x001F,
    0x003F, 0x007F, 0x00FF, 0x01FF, 0x03FF, 0x07FF,
    0x0FFF, 0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF
];
class LZWEncoder {
    constructor(width, height, pixels, colorDepth) {
        this.accum = new Uint8Array(256);
        this.htab = new Int32Array(HSIZE);
        this.codetab = new Int32Array(HSIZE);
        this.cur_accum = 0;
        this.cur_bits = 0;
        this.curPixel = 0;
        this.free_ent = 0; // first unused entry
        // block compression parameters -- after all codes are used up,
        // and compression rate changes, start over.
        this.clear_flg = false;
        // Algorithm: use open addressing double hashing (no chaining) on the
        // prefix code / next character combination. We do a variant of Knuth's
        // algorithm D (vol. 3, sec. 6.4) along with G. Knott's relatively-prime
        // secondary probe. Here, the modular division first probe is gives way
        // to a faster exclusive-or manipulation. Also do block compression with
        // an adaptive reset, whereby the code table is cleared when the compression
        // ratio decreases, but after the table fills. The variable-length output
        // codes are re-sized at this point, and a special CLEAR code is generated
        // for the decompressor. Late addition: construct the table according to
        // file size for noticeable speed improvement on small files. Please direct
        // questions about this implementation to ames!jaw.
        this.g_init_bits = undefined;
        this.ClearCode = undefined;
        this.EOFCode = undefined;
        this.width = width;
        this.height = height;
        this.pixels = pixels;
        this.colorDepth = colorDepth;
        this.initCodeSize = Math.max(2, this.colorDepth);
        this.accum = new Uint8Array(256);
        this.htab = new Int32Array(HSIZE);
        this.codetab = new Int32Array(HSIZE);
        this.cur_accum = 0;
        this.cur_bits = 0;
        this.a_count;
        this.remaining;
        this.curPixel = 0;
        this.free_ent = 0; // first unused entry
        this.maxcode;
        // block compression parameters -- after all codes are used up,
        // and compression rate changes, start over.
        this.clear_flg = false;
        // Algorithm: use open addressing double hashing (no chaining) on the
        // prefix code / next character combination. We do a variant of Knuth's
        // algorithm D (vol. 3, sec. 6.4) along with G. Knott's relatively-prime
        // secondary probe. Here, the modular division first probe is gives way
        // to a faster exclusive-or manipulation. Also do block compression with
        // an adaptive reset, whereby the code table is cleared when the compression
        // ratio decreases, but after the table fills. The variable-length output
        // codes are re-sized at this point, and a special CLEAR code is generated
        // for the decompressor. Late addition: construct the table according to
        // file size for noticeable speed improvement on small files. Please direct
        // questions about this implementation to ames!jaw.
        this.g_init_bits = undefined;
        this.ClearCode = undefined;
        this.EOFCode = undefined;
    }
    // Add a character to the end of the current packet, and if it is 254
    // characters, flush the packet to disk.
    char_out(c, outs) {
        this.accum[this.a_count++] = c;
        if (this.a_count >= 254)
            this.flush_char(outs);
    }
    // Clear out the hash table
    // table clear for block compress
    cl_block(outs) {
        this.cl_hash(HSIZE);
        this.free_ent = this.ClearCode + 2;
        this.clear_flg = true;
        this.output(this.ClearCode, outs);
    }
    // Reset code table
    cl_hash(hsize) {
        for (var i = 0; i < hsize; ++i)
            this.htab[i] = -1;
    }
    compress(init_bits, outs) {
        var fcode, c, i, ent, disp, hsize_reg, hshift;
        // Set up the globals: this.g_init_bits - initial number of bits
        this.g_init_bits = init_bits;
        // Set up the necessary values
        this.clear_flg = false;
        this.n_bits = this.g_init_bits;
        this.maxcode = this.get_maxcode(this.n_bits);
        this.ClearCode = 1 << (init_bits - 1);
        this.EOFCode = this.ClearCode + 1;
        this.free_ent = this.ClearCode + 2;
        this.a_count = 0; // clear packet
        ent = this.nextPixel();
        hshift = 0;
        for (fcode = HSIZE; fcode < 65536; fcode *= 2)
            ++hshift;
        hshift = 8 - hshift; // set hash code range bound
        hsize_reg = HSIZE;
        this.cl_hash(hsize_reg); // clear hash table
        this.output(this.ClearCode, outs);
        outer_loop: while ((c = this.nextPixel()) != EOF) {
            fcode = (c << BITS) + ent;
            i = (c << hshift) ^ ent; // xor hashing
            if (this.htab[i] === fcode) {
                ent = this.codetab[i];
                continue;
            }
            else if (this.htab[i] >= 0) { // non-empty slot
                disp = hsize_reg - i; // secondary hash (after G. Knott)
                if (i === 0)
                    disp = 1;
                do {
                    if ((i -= disp) < 0)
                        i += hsize_reg;
                    if (this.htab[i] === fcode) {
                        ent = this.codetab[i];
                        continue outer_loop;
                    }
                } while (this.htab[i] >= 0);
            }
            this.output(ent, outs);
            ent = c;
            if (this.free_ent < 1 << BITS) {
                this.codetab[i] = this.free_ent++; // code -> hasthis.htable
                this.htab[i] = fcode;
            }
            else {
                this.cl_block(outs);
            }
        }
        // Put out the final code.
        this.output(ent, outs);
        this.output(this.EOFCode, outs);
    }
    encode(outs) {
        outs.writeByte(this.initCodeSize); // write 'initial code size' byte
        this.remaining = this.width * this.height; // reset navigation variables
        this.curPixel = 0;
        this.compress(this.initCodeSize + 1, outs); // compress and write the pixel data
        outs.writeByte(0); // write block terminator
    }
    // Flush the packet to disk, and reset the this.accumulator
    flush_char(outs) {
        if (this.a_count > 0) {
            outs.writeByte(this.a_count);
            outs.writeBytes(this.accum, 0, this.a_count);
            this.a_count = 0;
        }
    }
    get_maxcode(n_bits) {
        return (1 << n_bits) - 1;
    }
    // Return the next pixel from the image
    nextPixel() {
        if (this.remaining === 0)
            return EOF;
        --this.remaining;
        var pix = this.pixels[this.curPixel++];
        return pix & 0xff;
    }
    output(code, outs) {
        this.cur_accum &= masks[this.cur_bits];
        if (this.cur_bits > 0)
            this.cur_accum |= (code << this.cur_bits);
        else
            this.cur_accum = code;
        this.cur_bits += this.n_bits;
        while (this.cur_bits >= 8) {
            this.char_out((this.cur_accum & 0xff), outs);
            this.cur_accum >>= 8;
            this.cur_bits -= 8;
        }
        // If the next entry is going to be too big for the code size,
        // then increase it, if possible.
        if (this.free_ent > this.maxcode || this.clear_flg) {
            if (this.clear_flg) {
                this.maxcode = this.get_maxcode(this.n_bits = this.g_init_bits);
                this.clear_flg = false;
            }
            else {
                ++this.n_bits;
                if (this.n_bits == BITS)
                    this.maxcode = 1 << BITS;
                else
                    this.maxcode = this.get_maxcode(this.n_bits);
            }
        }
        if (code == this.EOFCode) {
            // At EOF, write the rest of the buffer.
            while (this.cur_bits > 0) {
                this.char_out((this.cur_accum & 0xff), outs);
                this.cur_accum >>= 8;
                this.cur_bits -= 8;
            }
            this.flush_char(outs);
        }
    }
}

class GifEncoder {
    constructor(width, height) {
        this.delay = 100;
        // -1 = no repeat, 0 = forever. anything else is repeat count
        this.repeat = -1;
        this.colorDepth = 8;
        this.palette = [];
        this.width = width;
        this.height = height;
        this.data = new ByteArray();
    }
    static fromFlipnote(flipnote) {
        const gif = new GifEncoder(flipnote.width, flipnote.height);
        gif.palette = flipnote.globalPalette;
        gif.delay = 100 / flipnote.framerate;
        gif.repeat = flipnote.meta.loop ? -1 : 0;
        gif.init();
        for (let frameIndex = 0; frameIndex < flipnote.frameCount; frameIndex++) {
            gif.writeFrame(flipnote.getFramePixels(frameIndex));
        }
        return gif;
    }
    static fromFlipnoteFrame(flipnote, frameIndex) {
        const gif = new GifEncoder(flipnote.width, flipnote.height);
        gif.palette = flipnote.globalPalette;
        // TODO: look at ideal delay and repeat settings for single frame GIF
        gif.delay = 100 / flipnote.framerate;
        gif.repeat = flipnote.meta.loop ? -1 : 0;
        gif.init();
        gif.writeFrame(flipnote.getFramePixels(frameIndex));
        return gif;
    }
    init() {
        const paletteSize = this.palette.length;
        for (var p = 1; 1 << p < paletteSize; p += 1)
            continue;
        this.colorDepth = p;
        this.writeHeader();
        this.writeColorTable();
        this.writeNetscapeExt();
    }
    writeHeader() {
        const header = new DataStream(new ArrayBuffer(13));
        header.writeChars('GIF89a');
        // Logical Screen Descriptor
        header.writeUint16(this.width);
        header.writeUint16(this.height);
        header.writeUint8(0x80 | // 1 : global color table flag = 1 (gct used)
            (this.colorDepth - 1) // 6-8 : gct size
        );
        header.writeUint8(0);
        header.writeUint8(0);
        this.data.writeBytes(new Uint8Array(header.buffer));
    }
    writeColorTable() {
        const palette = new Uint8Array(3 * Math.pow(2, this.colorDepth));
        for (let index = 0, offset = 0; index < this.palette.length; index += 1, offset += 3) {
            palette.set(this.palette[index], offset);
        }
        this.data.writeBytes(palette);
    }
    writeGraphicsControlExt() {
        const graphicsControlExt = new DataStream(new ArrayBuffer(8));
        graphicsControlExt.writeBytes([
            0x21,
            0xF9,
            4,
            0 // bitfield
        ]);
        graphicsControlExt.writeUint16(this.delay); // loop flag
        graphicsControlExt.writeBytes([
            0,
            0
        ]);
        this.data.writeBytes(new Uint8Array(graphicsControlExt.buffer));
    }
    writeNetscapeExt() {
        const netscapeExt = new DataStream(new ArrayBuffer(19));
        netscapeExt.writeBytes([
            0x21,
            0xFF,
            11,
        ]);
        netscapeExt.writeChars('NETSCAPE2.0');
        netscapeExt.writeUint8(3); // subblock size
        netscapeExt.writeUint8(1); // loop subblock id
        netscapeExt.writeUint16(this.repeat); // loop flag
        this.data.writeBytes(new Uint8Array(netscapeExt.buffer));
    }
    writeImageDesc() {
        const desc = new DataStream(new ArrayBuffer(10));
        desc.writeUint8(0x2C);
        desc.writeUint16(0); // image left
        desc.writeUint16(0); // image top
        desc.writeUint16(this.width);
        desc.writeUint16(this.height);
        desc.writeUint8(0);
        this.data.writeBytes(new Uint8Array(desc.buffer));
    }
    writePixels(pixels) {
        const lzw = new LZWEncoder(this.width, this.height, pixels, this.colorDepth);
        lzw.encode(this.data);
    }
    writeFrame(pixels) {
        this.writeGraphicsControlExt();
        this.writeImageDesc();
        this.writePixels(pixels);
    }
    getBuffer() {
        return this.data.getBuffer();
    }
    getBlob() {
        return new Blob([this.getBuffer()], { type: 'image/gif' });
    }
    getUrl() {
        return window.URL.createObjectURL(this.getBlob());
    }
    getImage() {
        const img = new Image(this.width, this.height);
        img.src = this.getUrl();
        return img;
    }
}

// Typical WAV sample rate
const WAV_SAMPLE_RATE = 44100;
class WavEncoder {
    constructor(sampleRate, channels = 1, bitsPerSample = 16) {
        this.sampleRate = sampleRate;
        this.channels = channels;
        this.bitsPerSample = bitsPerSample;
        // Write WAV file header
        // Reference: http://www.topherlee.com/software/pcm-tut-wavformat.html
        let headerBuffer = new ArrayBuffer(44);
        let header = new DataStream(headerBuffer);
        // 'RIFF' indent
        header.writeChars('RIFF');
        // filesize (set later)
        header.writeUint32(0);
        // 'WAVE' indent
        header.writeChars('WAVE');
        // 'fmt ' section header
        header.writeChars('fmt ');
        // fmt section length
        header.writeUint32(16);
        // specify audio format is pcm (type 1)
        header.writeUint16(1);
        // number of audio channels
        header.writeUint16(this.channels);
        // audio sample rate
        header.writeUint32(this.sampleRate);
        // byterate = (sampleRate * bitsPerSample * channelCount) / 8
        header.writeUint32((this.sampleRate * this.bitsPerSample * this.channels) / 8);
        // blockalign = (bitsPerSample * channels) / 8
        header.writeUint16((this.bitsPerSample * this.channels) / 8);
        // bits per sample
        header.writeUint16(this.bitsPerSample);
        // 'data' section header
        header.writeChars('data');
        // data section length (set later)
        header.writeUint32(0);
        this.header = header;
        this.pcmData = null;
    }
    static fromFlipnote(note) {
        const wav = new WavEncoder(WAV_SAMPLE_RATE, 1, 16);
        const pcm = note.getAudioMasterPcm(WAV_SAMPLE_RATE);
        wav.writeFrames(pcm);
        return wav;
    }
    static fromFlipnoteTrack(note, trackId) {
        const wav = new WavEncoder(WAV_SAMPLE_RATE, 1, 16);
        const pcm = note.getAudioTrackPcm(trackId, WAV_SAMPLE_RATE);
        wav.writeFrames(pcm);
        return wav;
    }
    writeFrames(pcmData) {
        let header = this.header;
        // fill in filesize
        header.seek(4);
        header.writeUint32(header.byteLength + pcmData.byteLength);
        // fill in data section length
        header.seek(40);
        header.writeUint32(pcmData.byteLength);
        this.pcmData = pcmData;
    }
    getBlob() {
        return new Blob([this.header.buffer, this.pcmData.buffer], { type: 'audio/wav' });
    }
}

var vertexShader = "#define GLSLIFY 1\nattribute vec4 a_position;varying vec2 v_texel;varying float v_scale;uniform vec2 u_textureSize;uniform vec2 u_screenSize;void main(){gl_Position=a_position;vec2 uv=a_position.xy*vec2(0.5,-0.5)+0.5;v_texel=uv*u_textureSize;v_scale=floor(u_screenSize.y/u_textureSize.y+0.01);}"; // eslint-disable-line

var fragmentShader = "precision highp float;\n#define GLSLIFY 1\nvarying vec2 v_texel;varying float v_scale;uniform vec4 u_color1;uniform vec4 u_color2;uniform sampler2D u_bitmap;uniform bool u_isSmooth;uniform vec2 u_textureSize;uniform vec2 u_screenSize;void main(){vec2 texel_floored=floor(v_texel);vec2 s=fract(v_texel);float region_range=0.5-0.5/v_scale;vec2 center_dist=s-0.5;vec2 f=(center_dist-clamp(center_dist,-region_range,region_range))*v_scale+0.5;vec2 mod_texel=texel_floored+f;vec2 coord=mod_texel.xy/u_textureSize.xy;vec2 colorWeights=texture2D(u_bitmap,coord).ra;gl_FragColor=vec4(u_color1.rgb,1.0)*colorWeights.y+vec4(u_color2.rgb,1.0)*colorWeights.x;}"; // eslint-disable-line

var TextureType;
(function (TextureType) {
    TextureType[TextureType["Alpha"] = WebGLRenderingContext.ALPHA] = "Alpha";
    TextureType[TextureType["LuminanceAlpha"] = WebGLRenderingContext.LUMINANCE_ALPHA] = "LuminanceAlpha";
})(TextureType || (TextureType = {}));
/** webgl canvas wrapper class */
class WebglCanvas {
    constructor(el, width = 640, height = 480, params = { antialias: false, alpha: false }) {
        this.uniforms = {};
        this.refs = {
            shaders: [],
            textures: [],
            buffers: []
        };
        const gl = el.getContext('webgl', params);
        this.el = el;
        this.gl = gl;
        this.createProgram();
        this.setCanvasSize(width, height);
        this.createScreenQuad();
        this.createBitmapTexture();
        gl.enable(gl.BLEND);
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }
    createProgram() {
        const gl = this.gl;
        const program = gl.createProgram();
        // set up shaders
        gl.attachShader(program, this.createShader(gl.VERTEX_SHADER, vertexShader));
        gl.attachShader(program, this.createShader(gl.FRAGMENT_SHADER, fragmentShader));
        // link program
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            let log = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            throw new Error(log);
        }
        // activate the program
        gl.useProgram(program);
        // map uniform locations
        const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let index = 0; index < uniformCount; index++) {
            const name = gl.getActiveUniform(program, index).name;
            this.uniforms[name] = gl.getUniformLocation(program, name);
        }
        this.program = program;
    }
    createScreenQuad() {
        const gl = this.gl;
        // create quad that fills the screen, this will be our drawing surface
        const vertBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        this.refs.buffers.push(vertBuffer);
    }
    createBitmapTexture() {
        const gl = this.gl;
        // create texture to use as the layer bitmap
        gl.activeTexture(gl.TEXTURE0);
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.uniform1i(this.uniforms['u_bitmap'], 0);
        this.refs.textures.push(tex);
    }
    createShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        // test if shader compilation was successful
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const log = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error(log);
        }
        this.refs.shaders.push(shader);
        return shader;
    }
    setInputSize(width, height) {
        this.gl.uniform2f(this.uniforms['u_textureSize'], width, height);
    }
    setCanvasSize(width, height) {
        const dpi = window.devicePixelRatio || 1;
        const internalWidth = width * dpi;
        const internalHeight = height * dpi;
        this.el.width = internalWidth;
        this.el.height = internalHeight;
        this.width = internalWidth;
        this.height = internalHeight;
        this.gl.viewport(0, 0, internalWidth, internalHeight);
        this.gl.uniform2f(this.uniforms['u_screenSize'], internalWidth, internalHeight);
        this.el.style.width = `${width}px`;
        this.el.style.height = `${height}px`;
    }
    setLayerType(textureType) {
        this.textureType = textureType;
    }
    toImage(type) {
        return this.el.toDataURL(type);
    }
    setColor(color, value) {
        this.gl.uniform4f(this.uniforms[color], value[0] / 255, value[1] / 255, value[2] / 255, 1);
    }
    setPaperColor(value) {
        this.gl.clearColor(value[0] / 255, value[1] / 255, value[2] / 255, 1);
    }
    drawLayer(buffer, width, height, color1, color2) {
        const gl = this.gl;
        // gl.activeTexture(gl.TEXTURE0);
        gl.texImage2D(gl.TEXTURE_2D, 0, this.textureType, width, height, 0, this.textureType, gl.UNSIGNED_BYTE, buffer);
        this.setColor('u_color1', color1);
        this.setColor('u_color2', color2);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    resize(width = 640, height = 480) {
        this.setCanvasSize(width, height);
    }
    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
    destroy() {
        // free resources
        const refs = this.refs;
        const gl = this.gl;
        refs.shaders.forEach((shader) => {
            gl.deleteShader(shader);
        });
        refs.shaders = [];
        refs.textures.forEach((texture) => {
            gl.deleteTexture(texture);
        });
        refs.textures = [];
        refs.buffers.forEach((buffer) => {
            gl.deleteBuffer(buffer);
        });
        refs.buffers = [];
        gl.deleteProgram(this.program);
        // shrink the canvas to reduce memory usage until it is garbage collected
        gl.canvas.width = 1;
        gl.canvas.height = 1;
    }
}

const _AudioContext = (window.AudioContext || window.webkitAudioContext);
class WebAudioPlayer {
    constructor() {
        this.useEq = false;
        // Thanks to Sudomemo for the default settings
        this.eqSettings = [
            [31.25, 4.1],
            [62.5, 1.2],
            [125, 0],
            [250, -4.1],
            [500, -2.3],
            [1000, 0.5],
            [2000, 6.5],
            [8000, 5.1],
            [16000, 5.1]
        ];
        this._volume = 1;
        this.ctx = new _AudioContext();
    }
    set volume(value) {
        this.setVolume(value);
    }
    get volume() {
        return this._volume;
    }
    setSamples(sampleData, sampleRate) {
        const numSamples = sampleData.length;
        const audioBuffer = this.ctx.createBuffer(1, numSamples, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        if (sampleData instanceof Float32Array) {
            channelData.set(sampleData, 0);
        }
        else if (sampleData instanceof Int16Array) {
            for (let i = 0; i < numSamples; i++) {
                channelData[i] = sampleData[i] / 32767;
            }
        }
        this.buffer = audioBuffer;
        this.sampleRate = sampleRate;
    }
    connectEqNodesTo(inNode) {
        const { ctx, eqSettings } = this;
        let lastNode = inNode;
        eqSettings.forEach(([frequency, gain], index) => {
            let node = ctx.createBiquadFilter();
            if (index === 0)
                node.type = 'lowshelf';
            else if (index === eqSettings.length - 1)
                node.type = 'highshelf';
            else
                node.type = 'peaking';
            node.frequency.value = frequency;
            node.gain.value = gain;
            lastNode.connect(node);
            lastNode = node;
        });
        return lastNode;
    }
    initNodes() {
        const { ctx } = this;
        const source = ctx.createBufferSource();
        source.buffer = this.buffer;
        const gainNode = ctx.createGain();
        if (this.useEq) {
            const eq = this.connectEqNodesTo(source);
            eq.connect(gainNode);
        }
        else {
            source.connect(gainNode);
        }
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        this.source = source;
        this.gainNode = gainNode;
        this.setVolume(this._volume);
    }
    setVolume(value) {
        this._volume = value;
        if (this.gainNode) {
            // human perception of loudness is logarithmic, rather than linear
            // https://www.dr-lex.be/info-stuff/volumecontrols.html
            this.gainNode.gain.value = Math.pow(value, 2);
        }
    }
    stop() {
        this.source.stop(0);
    }
    playFrom(currentTime) {
        this.initNodes();
        this.source.start(0, currentTime);
    }
}

const saveData = (function () {
    var a = document.createElement("a");
    // document.body.appendChild(a);
    // a.style.display = "none";
    return function (blob, filename) {
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());
/** flipnote player API, based on HTMLMediaElement (https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) */
class Player {
    constructor(el, width, height) {
        this.loop = false;
        this.paused = true;
        this.duration = 0;
        this.isOpen = false;
        this.events = {};
        this._lastTick = -1;
        this._frame = -1;
        this._time = -1;
        this.hasPlaybackStarted = false;
        this.wasPlaying = false;
        this.isSeeking = false;
        // if `el` is a string, use it to select an Element, else assume it's an element
        el = ('string' == typeof el) ? document.querySelector(el) : el;
        this.canvas = new WebglCanvas(el, width, height);
        this.audio = new WebAudioPlayer();
        this.el = this.canvas.el;
        this.customPalette = null;
        this.state = { ...Player.defaultState };
    }
    saveWav() {
        const wav = WavEncoder.fromFlipnote(this.note);
        saveData(wav.getBlob(), 'audio.wav');
    }
    get currentFrame() {
        return this._frame;
    }
    set currentFrame(frameIndex) {
        this.setFrame(frameIndex);
    }
    get currentTime() {
        return this.isOpen ? this._time : null;
    }
    set currentTime(value) {
        if ((this.isOpen) && (value <= this.duration) && (value >= 0)) {
            this.setFrame(Math.round(value / (1 / this.framerate)));
            this._time = value;
            this.emit('progress', this.progress);
        }
    }
    get progress() {
        return this.isOpen ? (this._time / this.duration) * 100 : 0;
    }
    set progress(value) {
        this.currentTime = this.duration * (value / 100);
    }
    get volume() {
        return this.audio.volume;
    }
    set volume(value) {
        this.audio.volume = value;
    }
    get muted() {
        // return this.audioTracks[3].audio.muted;
        return false;
    }
    set muted(value) {
        // for (let i = 0; i < this.audioTracks.length; i++) {
        //   this.audioTracks[i].audio.muted = value;
        // }
    }
    get framerate() {
        return this.note.framerate;
    }
    get frameCount() {
        return this.note.frameCount;
    }
    get frameSpeed() {
        return this.note.frameSpeed;
    }
    setState(newState) {
        newState = { ...this.state, ...newState };
        const oldState = this.state;
        this.emit('state:change');
    }
    async open(source) {
        if (this.isOpen)
            this.close();
        return parseSource(source)
            .then((note) => this.load(note))
            .catch((err) => {
            this.emit('error', err);
            console.error('Error loading Flipnote:', err);
            throw 'Error loading Flipnote';
        });
    }
    close() {
        this.pause();
        this.note = null;
        this.isOpen = false;
        this.paused = true;
        this.loop = null;
        this.meta = null;
        this._frame = null;
        this._time = null;
        this.duration = null;
        this.loop = null;
        this.hasPlaybackStarted = null;
        this.canvas.clear();
    }
    load(note) {
        this.note = note;
        this.meta = note.meta;
        this.type = note.type;
        this.loop = note.meta.loop;
        this.duration = (this.note.frameCount) * (1 / this.note.framerate);
        this.paused = true;
        this.isOpen = true;
        this.hasPlaybackStarted = false;
        this.layerVisibility = {
            1: true,
            2: true,
            3: true
        };
        const sampleRate = this.audio.ctx.sampleRate;
        const pcm = note.getAudioMasterPcm(sampleRate);
        this.audio.setSamples(pcm, sampleRate);
        this.canvas.setInputSize(note.width, note.height);
        this.canvas.setLayerType(this.type === 'PPM' ? TextureType.Alpha : TextureType.LuminanceAlpha);
        this.setFrame(this.note.thumbFrameIndex);
        this._time = 0;
        this.emit('load');
    }
    playAudio() {
        this.audio.playFrom(this.currentTime);
    }
    stopAudio() {
        this.audio.stop();
    }
    toggleEq() {
        this.stopAudio();
        this.audio.useEq = !this.audio.useEq;
        this.playAudio();
    }
    playbackLoop(timestamp) {
        if (this.paused) { // break loop if paused is set to true
            this.stopAudio();
            return null;
        }
        const time = timestamp / 1000;
        const progress = time - this._lastTick;
        if (progress > this.duration) {
            if (this.loop) {
                this.currentTime = 0;
                this.playAudio();
                this._lastTick = time;
                this.emit('playback:loop');
            }
            else {
                this.pause();
                this.emit('playback:end');
            }
        }
        else {
            this.currentTime = progress;
        }
        requestAnimationFrame(this.playbackLoop.bind(this));
    }
    play() {
        window.__activeFlipnotePlayer = this;
        if ((!this.isOpen) || (!this.paused))
            return null;
        if ((!this.hasPlaybackStarted) || ((!this.loop) && (this.currentFrame == this.frameCount - 1)))
            this._time = 0;
        this.paused = false;
        this.hasPlaybackStarted = true;
        this._lastTick = (performance.now() / 1000) - this.currentTime;
        this.playAudio();
        requestAnimationFrame(this.playbackLoop.bind(this));
        this.emit('playback:start');
    }
    pause() {
        if ((!this.isOpen) || (this.paused))
            return null;
        this.paused = true;
        this.stopAudio();
        this.emit('playback:stop');
    }
    togglePlay() {
        if (this.paused) {
            this.play();
        }
        else {
            this.pause();
        }
    }
    setFrame(frameIndex) {
        if ((this.isOpen) && (frameIndex !== this.currentFrame)) {
            // clamp frame index
            frameIndex = Math.max(0, Math.min(Math.floor(frameIndex), this.frameCount - 1));
            this.drawFrame(frameIndex);
            this._frame = frameIndex;
            if (this.paused) {
                this._time = frameIndex * (1 / this.framerate);
                this.emit('progress', this.progress);
            }
            this.emit('frame:update', this.currentFrame);
        }
    }
    nextFrame() {
        if ((this.loop) && (this.currentFrame >= this.frameCount - 1)) {
            this.currentFrame = 0;
        }
        else {
            this.currentFrame += 1;
        }
    }
    prevFrame() {
        if ((this.loop) && (this.currentFrame <= 0)) {
            this.currentFrame = this.frameCount - 1;
        }
        else {
            this.currentFrame -= 1;
        }
    }
    lastFrame() {
        this.currentFrame = this.frameCount - 1;
    }
    firstFrame() {
        this.currentFrame = 0;
    }
    thumbnailFrame() {
        this.currentFrame = this.note.thumbFrameIndex;
    }
    startSeek() {
        if (!this.isSeeking) {
            this.wasPlaying = !this.paused;
            this.pause();
            this.isSeeking = true;
        }
    }
    seek(progress) {
        if (this.isSeeking) {
            this.progress = progress;
        }
    }
    endSeek() {
        if ((this.isSeeking) && (this.wasPlaying === true)) {
            this.play();
        }
        this.wasPlaying = false;
        this.isSeeking = false;
    }
    drawFrame(frameIndex) {
        const width = this.note.width;
        const height = this.note.height;
        const colors = this.note.getFramePalette(frameIndex);
        const layerBuffers = this.note.decodeFrame(frameIndex);
        this.canvas.setPaperColor(colors[0]);
        this.canvas.clear();
        if (this.note.type === 'PPM') {
            if (this.layerVisibility[2]) {
                this.canvas.drawLayer(layerBuffers[1], width, height, colors[2], [0, 0, 0, 0]);
            }
            if (this.layerVisibility[1]) {
                this.canvas.drawLayer(layerBuffers[0], width, height, colors[1], [0, 0, 0, 0]);
            }
        }
        else if (this.note.type === 'KWZ') {
            // loop through each layer
            this.note.getLayerOrder(frameIndex).forEach((layerIndex) => {
                // only draw layer if it's visible
                if (this.layerVisibility[layerIndex + 1]) {
                    this.canvas.drawLayer(layerBuffers[layerIndex], width, height, colors[layerIndex * 2 + 1], colors[layerIndex * 2 + 2]);
                }
            });
        }
    }
    forceUpdate() {
        if (this.isOpen) {
            this.drawFrame(this.currentFrame);
        }
    }
    resize(width, height) {
        this.canvas.resize(width, height);
        this.forceUpdate();
    }
    setLayerVisibility(layerIndex, value) {
        this.layerVisibility[layerIndex] = value;
        this.forceUpdate();
    }
    toggleLayerVisibility(layerIndex) {
        this.setLayerVisibility(layerIndex, !this.layerVisibility[layerIndex]);
    }
    // public setPalette(palette: any): void {
    //   this.customPalette = palette;
    //   this.note.palette = palette;
    //   this.forceUpdate();
    // }
    on(eventType, callback) {
        const events = this.events;
        (events[eventType] || (events[eventType] = [])).push(callback);
    }
    off(eventType, callback) {
        const callbackList = this.events[eventType];
        if (callbackList)
            callbackList.splice(callbackList.indexOf(callback), 1);
    }
    emit(eventType, ...args) {
        var callbackList = this.events[eventType] || [];
        for (var i = 0; i < callbackList.length; i++) {
            callbackList[i].apply(null, args);
        }
    }
    clearEvents() {
        this.events = {};
    }
    destroy() {
        this.close();
        this.canvas.destroy();
    }
}
Player.defaultState = {
    noteType: null,
    isNoteOpen: false,
    paused: false,
    hasPlaybackStarted: false,
    frame: -1,
    time: -1,
    loop: false,
    volume: 1,
    muted: false,
    layerVisibility: {
        1: true,
        2: true,
        3: true
    },
    isSeeking: false,
    wasPlaying: false,
};

// Main entrypoint for web
var api;
(function (api) {
    api.version = "4.1.0"; // replaced by @rollup/plugin-replace; see rollup.config.js
    api.player = Player;
    api.parseSource = parseSource;
    api.kwzParser = KwzParser;
    api.ppmParser = PpmParser;
    api.gifEncoder = GifEncoder;
    api.wavEncoder = WavEncoder;
})(api || (api = {}));
var api$1 = api;
const version = "4.1.0";
const player = Player;
const parseSource$1 = parseSource;
const kwzParser = KwzParser;
const ppmParser = PpmParser;
const gifEncoder = GifEncoder;
const wavEncoder = WavEncoder;

export default api$1;
export { gifEncoder, kwzParser, parseSource$1 as parseSource, player, ppmParser, version, wavEncoder };
