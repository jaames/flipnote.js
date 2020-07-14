/*!!
 flipnote.js v4.0.3 (node ver)
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
    readUtf8(count) {
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
    writeUtf8(string) {
        for (let i = 0; i < string.length; i++) {
            const char = string.charCodeAt(i);
            this.writeUint8(char);
        }
    }
    readUtf16(count) {
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
    getInt16AudioData(trackId) {
        return this.decodeAudio(trackId);
    }
    getFloat32AudioData(trackId) {
        const pcm16 = this.decodeAudio(trackId);
        const outbuffer = new Float32Array(pcm16.length);
        for (let i = 0; i < pcm16.length; i++) {
            outbuffer[i] = pcm16[i] / 32767;
        }
        return outbuffer;
    }
}

const ADPCM_INDEX_TABLE_2 = new Int8Array([
    -1, 2, -1, 2
]);
const ADPCM_INDEX_TABLE_4 = new Int8Array([
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
const ADPCM_SAMPLE_TABLE_2 = new Int16Array(90 * 4);
for (let sample = 0; sample < 4; sample++) {
    for (let stepIndex = 0; stepIndex < 90; stepIndex++) {
        let step = ADPCM_STEP_TABLE[stepIndex];
        let diff = step >> 3;
        if (sample & 1)
            diff += step;
        if (sample & 2)
            diff = -diff;
        ADPCM_SAMPLE_TABLE_2[sample + 4 * stepIndex] = diff;
    }
}
const ADPCM_SAMPLE_TABLE_4 = new Int16Array(90 * 16);
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
        ADPCM_SAMPLE_TABLE_4[sample + 16 * stepIndex] = diff;
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
const PALETTE = {
    WHITE: [0xff, 0xff, 0xff],
    BLACK: [0x0e, 0x0e, 0x0e],
    RED: [0xff, 0x2a, 0x2a],
    BLUE: [0x0a, 0x39, 0xff],
};
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
    static validateFSID(fsid) {
        return /[0159]{1}[0-9A-F]{6}0[0-9A-F]{8}/.test(fsid);
    }
    static validateFilename(filename) {
        return /[0-9A-F]{6}_[0-9A-F]{13}_[0-9]{3}/.test(filename);
    }
    readFilename() {
        return [
            this.readHex(3),
            this.readUtf8(13),
            this.readUint16().toString().padStart(3, '0')
        ].join('_');
    }
    readLineEncoding() {
        const unpacked = new Uint8Array(PpmParser.height);
        for (var byteIndex = 0; byteIndex < 48; byteIndex++) {
            const byte = this.readUint8();
            // each line's encoding type is stored as a 2-bit value
            for (var bitOffset = 0; bitOffset < 8; bitOffset += 2) {
                unpacked[byteIndex * 4 + bitOffset / 2] = (byte >> bitOffset) & 0x03;
            }
        }
        return unpacked;
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
    decodeMeta() {
        // https://github.com/pbsds/hatena-server/wiki/PPM-format#file-header
        this.seek(0x10);
        const lock = this.readUint16(), thumbIndex = this.readInt16(), rootAuthorName = this.readUtf16(11), parentAuthorName = this.readUtf16(11), currentAuthorName = this.readUtf16(11), parentAuthorId = this.readHex(8, true), currentAuthorId = this.readHex(8, true), parentFilename = this.readFilename(), currentFilename = this.readFilename(), rootAuthorId = this.readHex(8, true);
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
        // skip padding + flags
        this.seek(0x06A8);
        // read frame offsets and build them into a table
        this.frameOffsets = new Uint32Array(offsetTableLength / 4).map(value => {
            return 0x06A8 + offsetTableLength + this.readUint32();
        });
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
    decodeFrame(frameIndex) {
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
                    this.layers[0][dest] ^= this.prevLayers[0][src];
                    this.layers[1][dest] ^= this.prevLayers[1][src];
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
            if (layer[pixel] !== 0) {
                image[pixel] = layerColor;
            }
        }
        return image;
    }
    // retuns an uint8 array where each item is a pixel's palette index
    getFramePixels(frameIndex) {
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
    decodeAudio(trackId) {
        const trackMeta = this.soundMeta[trackId];
        const adpcm = new Uint8Array(this.buffer, trackMeta.offset, trackMeta.length);
        const output = new Int16Array(adpcm.length * 2);
        let outputOffset = 0;
        // initial decoder state
        let prevDiff = 0;
        let prevStepIndex = 0;
        let sample;
        let diff;
        let stepIndex;
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
    decodeSoundFlags() {
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
PpmParser.type = 'PPM';
PpmParser.width = 256;
PpmParser.height = 192;
PpmParser.sampleRate = 8192;
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

const FRAMERATES$1 = [
    1 / 5,
    1 / 2,
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
const PALETTE$1 = {
    WHITE: [0xff, 0xff, 0xff],
    BLACK: [0x10, 0x10, 0x10],
    RED: [0xff, 0x10, 0x10],
    YELLOW: [0xff, 0xe7, 0x00],
    GREEN: [0x00, 0x86, 0x31],
    BLUE: [0x00, 0x38, 0xce],
    NONE: [0xff, 0xff, 0xff]
};
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
            const sectionMagic = this.readUtf8(4).substring(0, 3);
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
        const creationTimestamp = new Date((this.readUint32() + 946684800) * 1000), modifiedTimestamp = new Date((this.readUint32() + 946684800) * 1000), appVersion = this.readUint32(), rootAuthorId = this.readHex(10), parentAuthorId = this.readHex(10), currentAuthorId = this.readHex(10), rootAuthorName = this.readUtf16(11), parentAuthorName = this.readUtf16(11), currentAuthorName = this.readUtf16(11), rootFilename = this.readUtf8(28), parentFilename = this.readUtf8(28), currentFilename = this.readUtf8(28), frameCount = this.readUint16(), thumbIndex = this.readUint16(), flags = this.readUint16(), frameSpeed = this.readUint8(), layerFlags = this.readUint8();
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
        if ((frameIndex !== 0) && (this.prevDecodedFrame !== frameIndex - 1) && (diffingFlag))
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
        if (this.prevDecodedFrame !== frameIndex) {
            this.decodeFrame(frameIndex);
        }
        const palette = this.getFramePaletteIndices(frameIndex);
        const layers = this.layers[layerIndex];
        const image = new Uint8Array((KwzParser.width * KwzParser.height));
        const paletteOffset = layerIndex * 2 + 1;
        for (let pixelIndex = 0; pixelIndex < layers.length; pixelIndex++) {
            let pixel = layers[pixelIndex];
            if (pixel & 0xff00) {
                image[pixelIndex] = palette[paletteOffset];
            }
            else if (pixel & 0x00ff) {
                image[pixelIndex] = palette[paletteOffset + 1];
            }
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
                if (pixel !== 0) {
                    image[pixelIndex] = pixel;
                }
            }
        });
        return image;
    }
    decodeSoundFlags() {
        return this.frameMeta.map(frame => {
            const soundFlags = frame.soundFlags;
            return [
                soundFlags & 0x1,
                (soundFlags >> 1) & 0x1,
                (soundFlags >> 2) & 0x1,
                (soundFlags >> 3) & 0x1,
            ];
        });
    }
    decodeAudio(trackId) {
        const trackMeta = this.soundMeta[trackId];
        const adpcm = new Uint8Array(this.buffer, trackMeta.offset, trackMeta.length);
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
                diff = Math.max(-2047, Math.min(diff, 2047));
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
            if (magic === 0x50415241) { // check if magic is PARA (ppm magic)
                resolve(new PpmParser(arrayBuffer));
            }
            else if ((magic & 0xFFFFFF00) === 0x4B464800) { // check if magic is KFH (kwz magic)
                resolve(new KwzParser(arrayBuffer));
            }
            else {
                reject();
            }
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
        gif.delay = 100 / flipnote.framerate;
        gif.repeat = flipnote.meta.loop ? -1 : 0;
        gif.init();
        gif.writeFrame(flipnote.getFramePixels(frameIndex));
        return gif;
    }
    init() {
        const paletteSize = this.palette.length;
        for (var p = 1; 1 << p < paletteSize; p += 1) {
            continue;
        }
        this.colorDepth = p;
        this.writeHeader();
        this.writeColorTable();
        this.writeNetscapeExt();
    }
    writeHeader() {
        const header = new DataStream(new ArrayBuffer(13));
        header.writeUtf8('GIF89a');
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
        netscapeExt.writeUtf8('NETSCAPE2.0');
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
        header.writeUtf8('RIFF');
        // filesize (set later)
        header.writeUint32(0);
        // 'WAVE' indent
        header.writeUtf8('WAVE');
        // 'fmt ' section header
        header.writeUtf8('fmt ');
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
        header.writeUtf8('data');
        // data section length (set later)
        header.writeUint32(0);
        this.header = header;
        this.pcmData = null;
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

// Stripped down entrypoint for Node that only contains parsers + encoders
var node = {
    version: "4.0.3",
    parseSource,
    kwzParser: KwzParser,
    ppmParser: PpmParser,
    gifEncoder: GifEncoder,
    wavEncoder: WavEncoder,
};

export default node;
