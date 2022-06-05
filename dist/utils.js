/*!!
flipnote.js v5.8.4
https://flipnote.js.org
A JavaScript library for parsing, converting, and in-browser playback of the proprietary animation formats used by Nintendo's Flipnote Studio and Flipnote Studio 3D apps.
2018 - 2022 James Daniel
Flipnote Studio is (c) Nintendo Co., Ltd. This project isn't affiliated with or endorsed by them in any way.
Keep on Flipnoting!
*/
/** @internal */
class ByteArray {
    constructor() {
        // sizes
        this.pageSize = 2048 * 2;
        this.allocSize = 0; // allocated size counting all pages
        this.realSize = 0; // number of bytes actually used
        // pages
        this.pages = [];
        this.numPages = 0;
        // pointers
        this.pageIdx = 0; // page to write to
        this.pagePtr = 0; // position in page to write to
        this.realPtr = 0; // position in file
        this.newPage();
    }
    set pointer(ptr) {
        this.setPointer(ptr);
    }
    get pointer() {
        return this.realPtr;
    }
    newPage() {
        this.pages[this.numPages] = new Uint8Array(this.pageSize);
        this.numPages = this.pages.length;
        this.allocSize = this.numPages * this.pageSize;
    }
    setPointer(ptr) {
        // allocate enough pages to include pointer
        while (ptr >= this.allocSize) {
            this.newPage();
        }
        // increase real file size if the end is reached
        if (ptr > this.realSize)
            this.realSize = ptr;
        // update ptrs
        // TODO: this is going to get hit a lot, maybe optimise?
        this.pageIdx = Math.floor(ptr / this.pageSize);
        this.pagePtr = ptr % this.pageSize;
        this.realPtr = ptr;
    }
    writeByte(value) {
        this.pages[this.pageIdx][this.pagePtr] = value;
        this.setPointer(this.realPtr + 1);
    }
    writeBytes(bytes, srcPtr, length) {
        for (let l = length || bytes.length, i = srcPtr || 0; i < l; i++)
            this.writeByte(bytes[i]);
    }
    writeChars(str) {
        for (let i = 0; i < str.length; i++) {
            this.writeByte(str.charCodeAt(i));
        }
    }
    writeU8(value) {
        this.writeByte(value & 0xFF);
    }
    writeU16(value) {
        this.writeByte((value >>> 0) & 0xFF);
        this.writeByte((value >>> 8) & 0xFF);
    }
    writeU32(value) {
        this.writeByte((value >>> 0) & 0xFF);
        this.writeByte((value >>> 8) & 0xFF);
        this.writeByte((value >>> 16) & 0xFF);
        this.writeByte((value >>> 24) & 0xFF);
    }
    getBytes() {
        const bytes = new Uint8Array(this.realSize);
        const numPages = this.numPages;
        for (let i = 0; i < numPages; i++) {
            const page = this.pages[i];
            if (i === numPages - 1) // last page
                bytes.set(page.slice(0, this.realSize % this.pageSize), i * this.pageSize);
            else
                bytes.set(page, i * this.pageSize);
        }
        return bytes;
    }
    getBuffer() {
        const bytes = this.getBytes();
        return bytes.buffer;
    }
}

/**
 * Wrapper around the DataView API to keep track of the offset into the data
 * also provides some utils for reading ascii strings etc
 * @internal
 */
class DataStream {
    constructor(arrayBuffer) {
        this.buffer = arrayBuffer;
        this.data = new DataView(arrayBuffer);
        this.pointer = 0;
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
                this.pointer = this.data.byteLength + offset;
                break;
            case 1 /* Current */:
                this.pointer += offset;
                break;
            case 0 /* Begin */:
            default:
                this.pointer = offset;
                break;
        }
    }
    readUint8() {
        const val = this.data.getUint8(this.pointer);
        this.pointer += 1;
        return val;
    }
    writeUint8(value) {
        this.data.setUint8(this.pointer, value);
        this.pointer += 1;
    }
    readInt8() {
        const val = this.data.getInt8(this.pointer);
        this.pointer += 1;
        return val;
    }
    writeInt8(value) {
        this.data.setInt8(this.pointer, value);
        this.pointer += 1;
    }
    readUint16(littleEndian = true) {
        const val = this.data.getUint16(this.pointer, littleEndian);
        this.pointer += 2;
        return val;
    }
    writeUint16(value, littleEndian = true) {
        this.data.setUint16(this.pointer, value, littleEndian);
        this.pointer += 2;
    }
    readInt16(littleEndian = true) {
        const val = this.data.getInt16(this.pointer, littleEndian);
        this.pointer += 2;
        return val;
    }
    writeInt16(value, littleEndian = true) {
        this.data.setInt16(this.pointer, value, littleEndian);
        this.pointer += 2;
    }
    readUint32(littleEndian = true) {
        const val = this.data.getUint32(this.pointer, littleEndian);
        this.pointer += 4;
        return val;
    }
    writeUint32(value, littleEndian = true) {
        this.data.setUint32(this.pointer, value, littleEndian);
        this.pointer += 4;
    }
    readInt32(littleEndian = true) {
        const val = this.data.getInt32(this.pointer, littleEndian);
        this.pointer += 4;
        return val;
    }
    writeInt32(value, littleEndian = true) {
        this.data.setInt32(this.pointer, value, littleEndian);
        this.pointer += 4;
    }
    readBytes(count) {
        const bytes = new Uint8Array(this.data.buffer, this.pointer, count);
        this.pointer += bytes.byteLength;
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
        const chars = new Uint16Array(this.data.buffer, this.pointer, count);
        let str = '';
        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            if (char == 0)
                break;
            str += String.fromCharCode(char);
        }
        this.pointer += chars.byteLength;
        return str;
    }
}

/** @internal */
const ADPCM_INDEX_TABLE_2BIT = new Int8Array([
    -1, 2, -1, 2
]);
/** @internal */
const ADPCM_INDEX_TABLE_4BIT = new Int8Array([
    -1, -1, -1, -1, 2, 4, 6, 8,
    -1, -1, -1, -1, 2, 4, 6, 8
]);
/** @internal */
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
/**
 * Clamp a number n between l and h
 * @internal
 */
function clamp(n, l, h) {
    if (n < l)
        return l;
    if (n > h)
        return h;
    return n;
}
/**
 * Interpolate between a and b - returns a if fac = 0, b if fac = 1, and somewhere between if 0 < fac < 1
 * @internal
 */
const lerp = (a, b, fac) => a + fac * (b - a);
/** @internal */
function pcmGetSample(src, srcSize, srcPtr) {
    if (srcPtr < 0 || srcPtr >= srcSize)
        return 0;
    return src[srcPtr];
}
/**
 * Zero-order hold (nearest neighbour) audio interpolation
 * Credit to SimonTime for the original C version
 * @internal
 */
function pcmResampleNearestNeighbour(src, srcFreq, dstFreq) {
    const srcLength = src.length;
    const srcDuration = srcLength / srcFreq;
    const dstLength = srcDuration * dstFreq;
    const dst = new Int16Array(dstLength);
    const adjFreq = srcFreq / dstFreq;
    for (let dstPtr = 0; dstPtr < dstLength; dstPtr++) {
        dst[dstPtr] = pcmGetSample(src, srcLength, Math.floor(dstPtr * adjFreq));
    }
    return dst;
}
/**
 * Simple linear audio interpolation
 * @internal
 */
function pcmResampleLinear(src, srcFreq, dstFreq) {
    const srcLength = src.length;
    const srcDuration = srcLength / srcFreq;
    const dstLength = srcDuration * dstFreq;
    const dst = new Int16Array(dstLength);
    const adjFreq = srcFreq / dstFreq;
    for (let dstPtr = 0, adj = 0, srcPtr = 0, weight = 0; dstPtr < dstLength; dstPtr++) {
        adj = dstPtr * adjFreq;
        srcPtr = Math.floor(adj);
        weight = adj % 1;
        dst[dstPtr] = lerp(pcmGetSample(src, srcLength, srcPtr), pcmGetSample(src, srcLength, srcPtr + 1), weight);
    }
    return dst;
}
/**
 * Get a ratio of how many audio samples hit the pcm_s16_le clipping bounds
 * This can be used to detect corrupted audio
 * @internal
 */
function pcmGetClippingRatio(src) {
    const numSamples = src.length;
    let numClippedSamples = 0;
    for (let i = 0; i < numSamples; i++) {
        const sample = src[i];
        if (sample <= -32768 || sample >= 32767)
            numClippedSamples += 1;
    }
    return numClippedSamples / numSamples;
}
/**
 * Get the root mean square of a PCM track
 * @internal
 */
function pcmGetRms(src) {
    const numSamples = src.length;
    let rms = 0;
    for (let i = 0; i < numSamples; i++) {
        rms += Math.pow(src[i], 2);
    }
    return Math.sqrt(rms / numSamples);
}

/**
 * Assert condition is true
 * @internal
 */
function assert(condition, errMsg = 'Assert failed') {
    if (!condition) {
        console.trace(errMsg);
        throw new Error(errMsg);
    }
}
/**
 * Assert that a value exists
 * @internal
 */
function assertExists(value, name = '') {
    if (value === undefined || value === null)
        throw new Error(`Missing object ${name}`);
    return value;
}
/**
 * Assert that a numberical value is between upper and lower bounds
 * @internal
 */
function assertRange(value, min, max, name = '') {
    assert(value >= min && value <= max, `${name || 'value'} ${value} should be between ${min} and ${max}`);
}

/**
 * Webpack tries to replace inline calles to require() with polyfills,
 * but we don't want that, since we only use require to add extra features in NodeJs environments
 *
 * Modified from:
 * https://github.com/getsentry/sentry-javascript/blob/bd35d7364191ebed994fb132ff31031117c1823f/packages/utils/src/misc.ts#L9-L11
 * https://github.com/getsentry/sentry-javascript/blob/89bca28994a0eaab9bc784841872b12a1f4a875c/packages/hub/src/hub.ts#L340
 * @internal
 */
function dynamicRequire(nodeModule, p) {
    try {
        return nodeModule.require(p);
    }
    catch {
        throw new Error(`Could not require(${p})`);
    }
}
/**
 * Safely get global scope object
 * @internal
 */
function getGlobalObject() {
    return isNode
        ? global
        : typeof window !== 'undefined'
            ? window
            : typeof self !== 'undefined'
                ? self
                : {};
}
/**
 * Utils to find out information about the current code execution environment
 */
/**
 * Is the code running in a browser environment?
 * @internal
 */
const isBrowser = typeof window !== 'undefined'
    && typeof window.document !== 'undefined';
/**
 * Assert that the current environment should support browser APIs
 * @internal
 */
function assertBrowserEnv() {
    return assert(isBrowser, 'This feature is only available in browser environments');
}
/**
 * Is the code running in a Node environment?
 * @internal
 */
const isNode = typeof process !== 'undefined'
    && process.versions != null
    && process.versions.node != null;
/**
 * Assert that the current environment should support NodeJS APIs
 * @internal
 */
function assertNodeEnv() {
    return assert(isNode, 'This feature is only available in NodeJS environments');
}
// TODO: Deno support?
/**
 * Is the code running in a Web Worker enviornment?
 * @internal
 */
const isWebWorker = typeof self === 'object'
    && self.constructor
    && self.constructor.name === 'DedicatedWorkerGlobalScope';
/**
 * Assert that the current environment should support NodeJS APIs
 * @internal
 */
function assertWebWorkerEnv() {
    return assert(isWebWorker, 'This feature is only available in WebWorker environments');
}

/** @internal */
const raf = isBrowser && (window.requestAnimationFrame || window.webkitRequestAnimationFrame);
/** @internal */
function nextPaint(callback) {
    if (isBrowser)
        raf(() => raf(() => callback()));
    else
        callback();
}

/**
 * same SubtleCrypto API is available in browser and node, but in node it isn't global
 * @internal
 */
const SUBTLE_CRYPTO = (() => {
    if (isBrowser || isWebWorker) {
        const global = getGlobalObject();
        return (global.crypto || global.msCrypto).subtle;
    }
    else if (isNode)
        return dynamicRequire(module, 'crypto').webcrypto.subtle;
})();
/**
 * crypto algo used
 * @internal
 */
const ALGORITHM = 'RSASSA-PKCS1-v1_5';
/**
 * @internal
 */
async function rsaLoadPublicKey(pemKey, hashType) {
    // remove PEM header and footer
    const lines = pemKey
        .split('\n')
        .filter(line => !line.startsWith('-----') && !line.endsWith('-----'))
        .join('');
    // base64 decode
    const keyPlaintext = atob(lines);
    // convert to byte array
    const keyBytes = new Uint8Array(keyPlaintext.length)
        .map((_, i) => keyPlaintext.charCodeAt(i));
    // create cypto api key
    return await SUBTLE_CRYPTO.importKey('spki', keyBytes.buffer, {
        name: ALGORITHM,
        hash: hashType,
    }, false, ['verify']);
}
/**
 * @internal
 */
async function rsaVerify(key, signature, data) {
    return await SUBTLE_CRYPTO.verify(ALGORITHM, key, signature, data);
}

/**
 * Gracefully handles a given Promise factory.
 * @internal
 * @example
 * const [ error, data ] = await until(() => asyncAction())
 */
const until = async (promise) => {
    try {
        const data = await promise().catch((error) => {
            throw error;
        });
        return [null, data];
    }
    catch (error) {
        return [error, null];
    }
};

/**
 * Number of seconds between the UNIX timestamp epoch (jan 1 1970) and the Nintendo timestamp epoch (jan 1 2000)
 * @internal
 */
const UNIX_EPOCH_2000 = 946684800;
/**
 * Convert a Nintendo DS or 3DS timestamp int to a JS Date object
 * @internal
 */
function dateFromNintendoTimestamp(timestamp) {
    return new Date((timestamp + UNIX_EPOCH_2000) * 1000);
}
/**
 * Get the duration (in seconds) of a number of framres running at a specified framerate
 * @internal
 */
function timeGetNoteDuration(frameCount, framerate) {
    // multiply and divide by 100 to get around floating precision issues
    return ((frameCount * 100) * (1 / framerate)) / 100;
}

/**
 * Flipnote region
 */
var FlipnoteRegion;
(function (FlipnoteRegion) {
    /** Europe and Oceania */
    FlipnoteRegion["EUR"] = "EUR";
    /** Americas */
    FlipnoteRegion["USA"] = "USA";
    /** Japan */
    FlipnoteRegion["JPN"] = "JPN";
    /** Unidentified (possibly never used) */
    FlipnoteRegion["UNKNOWN"] = "UNKNOWN";
})(FlipnoteRegion || (FlipnoteRegion = {}));
/**
 * Match an FSID from Flipnote Studio
 * e.g. 1440D700CEF78DA8
 * @internal
 */
const REGEX_PPM_FSID = /^[0159]{1}[0-9A-F]{6}0[0-9A-F]{8}$/;
/**
 * Match an FSID from Flipnote Studio 3D
 * e.g. 003f-0b7e-82a6-fe0bda
 * @internal
 */
const REGEX_KWZ_FSID = /^[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{6}$/;
/**
 * Match an FSID from a DSi Library note (PPM to KWZ conversion)
 * e.g. 10b8-b909-5180-9b2013
 * @internal
 */
const REGEX_KWZ_DSI_LIBRARY_FSID = /^(00|10|12|14)[0-9a-f]{2}-[0-9a-f]{4}-[0-9a-f]{3}0-[0-9a-f]{4}[0159]{1}[0-9a-f]{1}$/;
/**
 * Indicates whether the input is a valid Flipnote Studio user ID
 */
function isPpmFsid(fsid) {
    // The only known exception to the FSID format is the one Nintendo used for their event notes (mario, zelda 25th, etc)
    // This is likely a goof on their part
    return fsid === '14E494E35A443235' || REGEX_PPM_FSID.test(fsid);
}
/**
 * Indicates whether the input is a valid Flipnote Studio 3D user ID
 */
function isKwzFsid(fsid) {
    return REGEX_KWZ_FSID.test(fsid);
}
/**
 * Indicates whether the input is a valid DSi Library user ID
 */
function isKwzDsiLibraryFsid(fsid) {
    // DSi Library eqiuvalent of the 14E494E35A443235 ID exception
    return fsid.endsWith('3532445AE394E414') || REGEX_KWZ_DSI_LIBRARY_FSID.test(fsid);
}
/**
 * Indicates whether the input is a valid Flipnote Studio or Flipnote Studio 3D user ID
 */
function isFsid(fsid) {
    return isPpmFsid(fsid) || isKwzFsid(fsid);
}
/**
 * Get the region for any valid Flipnote Studio user ID
 */
function getPpmFsidRegion(fsid) {
    switch (fsid.charAt(0)) {
        case '0':
        case '1':
            return FlipnoteRegion.JPN;
        case '5':
            return FlipnoteRegion.USA;
        case '9':
            return FlipnoteRegion.EUR;
        default:
            return FlipnoteRegion.UNKNOWN;
    }
}
/**
 * Get the region for any valid Flipnote Studio 3D user ID
 */
function getKwzFsidRegion(fsid) {
    if (isKwzDsiLibraryFsid(fsid)) {
        switch (fsid.charAt(19)) {
            case '0':
            case '1':
                return FlipnoteRegion.JPN;
            case '5':
                return FlipnoteRegion.USA;
            case '9':
                return FlipnoteRegion.EUR;
            default:
                return FlipnoteRegion.UNKNOWN;
        }
    }
    switch (fsid.slice(0, 2)) {
        // note: might be incorrect
        case '00':
            return FlipnoteRegion.JPN;
        case '02':
            return FlipnoteRegion.USA;
        case '04':
            return FlipnoteRegion.EUR;
        default:
            return FlipnoteRegion.UNKNOWN;
    }
}
/**
 * Get the region for any valid Flipnote Studio or Flipnote Studio 3D user ID
 */
function getFsidRegion(fsid) {
    if (isPpmFsid(fsid))
        return getPpmFsidRegion(fsid);
    else if (isKwzFsid(fsid))
        return getKwzFsidRegion(fsid);
    return FlipnoteRegion.UNKNOWN;
}

/** @internal */
const saveData = (function () {
    if (!isBrowser) {
        return function () { };
    }
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
})();

export { ADPCM_INDEX_TABLE_2BIT, ADPCM_INDEX_TABLE_4BIT, ADPCM_STEP_TABLE, ByteArray, DataStream, FlipnoteRegion, assert, assertBrowserEnv, assertExists, assertNodeEnv, assertRange, assertWebWorkerEnv, clamp, dateFromNintendoTimestamp, dynamicRequire, getFsidRegion, getGlobalObject, getKwzFsidRegion, getPpmFsidRegion, isBrowser, isFsid, isKwzDsiLibraryFsid, isKwzFsid, isNode, isPpmFsid, isWebWorker, lerp, nextPaint, pcmGetClippingRatio, pcmGetRms, pcmGetSample, pcmResampleLinear, pcmResampleNearestNeighbour, rsaLoadPublicKey, rsaVerify, saveData, timeGetNoteDuration, until };
