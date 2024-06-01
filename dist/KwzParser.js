/*!!
flipnote.js v5.11.0
https://flipnote.js.org
A JavaScript library for parsing, converting, and in-browser playback of the proprietary animation formats used by Nintendo's Flipnote Studio and Flipnote Studio 3D apps.
2018 - 2024 James Daniel
Flipnote Studio is (c) Nintendo Co., Ltd. This project isn't affiliated with or endorsed by them in any way.
Keep on Flipnoting!
*/
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
            case 2 /* SeekOrigin.End */:
                this.pointer = this.data.byteLength + offset;
                break;
            case 1 /* SeekOrigin.Current */:
                this.pointer += offset;
                break;
            case 0 /* SeekOrigin.Begin */:
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
 * Is the code running in a Node environment?
 * @internal
 */
const isNode = typeof process !== 'undefined'
    && process.versions != null
    && process.versions.node != null;
// TODO: Deno support?
/**
 * Is the code running in a Web Worker enviornment?
 * @internal
 */
const isWebWorker = typeof self === 'object'
    && self.constructor
    && self.constructor.name === 'DedicatedWorkerGlobalScope';

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
    // create crypto api key
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
 * Match an FSID from a DSi Library note (PPM to KWZ conversion)
 * e.g. 10b8-b909-5180-9b2013
 * @internal
 */
const REGEX_KWZ_DSI_LIBRARY_FSID = /^(00|10|12|14)[0-9a-f]{2}-[0-9a-f]{4}-[0-9a-f]{3}0-[0-9a-f]{4}[0159]{1}[0-9a-f]{1}$/;
/**
 * @internal
 * There are several known exceptions to the FSID format, all from Nintendo or Hatena developer and event accounts (mario, zelda 25th, etc).
 * This list was compiled from data provided by the Flipnote Archive, so it can be considered comprehensive enough to match any Flipnote you may encounter.
 */
const PPM_FSID_SPECIAL_CASE = [
    '01FACA7A4367FC5F', '03D6E959E2F9A42D',
    '03F80445160587FA', '04068426E1008915',
    '092A3EC8199FD5D5', '0B8D56BA1BD441B8',
    '0E61C75C9B5AD90B', '14E494E35A443235'
];
/**
 * @internal
 */
const KWZ_DSI_LIBRARY_FSID_SPECIAL_CASE_SUFFIX = PPM_FSID_SPECIAL_CASE.map(id => convertPpmFsidToKwzFsidSuffix(id));
/**
 * Indicates whether the input is a valid DSi Library user ID
 */
function isKwzDsiLibraryFsid(fsid) {
    if (REGEX_KWZ_DSI_LIBRARY_FSID.test(fsid))
        return true;
    for (let suffix of KWZ_DSI_LIBRARY_FSID_SPECIAL_CASE_SUFFIX) {
        if (fsid.endsWith(suffix))
            return true;
    }
    return false;
}
/**
 * Get the region for any valid Flipnote Studio 3D user ID.
 * NOTE: This may be incorrect for IDs that are not from the DSi Library.
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
 * Convert a PPM Flipnote Studio ID to the format used by KWZ Flipnote Studio IDs (as seen in Nintendo DSi Library Flipnotes).
 * Will return `null` if the conversion could not be made.
 *
 * NOTE: KWZ Flipnote Studio IDs contain an extra two characters at the beginning. It is not possible to resolve these from a PPM Flipnote Studio ID.
 */
function convertPpmFsidToKwzFsidSuffix(fsid) {
    if (REGEX_PPM_FSID.test(fsid))
        return (fsid.slice(14, 16) + fsid.slice(12, 14) + '-' + fsid.slice(10, 12) + fsid.slice(8, 10) + '-' + fsid.slice(6, 8) + fsid.slice(4, 6) + '-' + fsid.slice(2, 4) + fsid.slice(0, 2)).toLowerCase();
    return null;
}

/** @internal */
((function () {
    if (!isBrowser) {
        return function () { };
    }
    const a = document.createElement('a');
    return function (blob, filename) {
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}))();

var _a$1;
/** Identifies which animation format a Flipnote uses */
var FlipnoteFormat;
(function (FlipnoteFormat) {
    /** Animation format used by Flipnote Studio (Nintendo DSiWare) */
    FlipnoteFormat["PPM"] = "PPM";
    /** Animation format used by Flipnote Studio 3D (Nintendo 3DS) */
    FlipnoteFormat["KWZ"] = "KWZ";
})(FlipnoteFormat || (FlipnoteFormat = {}));
/** Buffer format for a FlipnoteThumbImage  */
var FlipnoteThumbImageFormat;
(function (FlipnoteThumbImageFormat) {
    FlipnoteThumbImageFormat[FlipnoteThumbImageFormat["Jpeg"] = 0] = "Jpeg";
    FlipnoteThumbImageFormat[FlipnoteThumbImageFormat["Rgba"] = 1] = "Rgba";
})(FlipnoteThumbImageFormat || (FlipnoteThumbImageFormat = {}));
/** stereoscopic eye view (left/right) for 3D effects */
var FlipnoteStereoscopicEye;
(function (FlipnoteStereoscopicEye) {
    FlipnoteStereoscopicEye[FlipnoteStereoscopicEye["Left"] = 0] = "Left";
    FlipnoteStereoscopicEye[FlipnoteStereoscopicEye["Right"] = 1] = "Right";
})(FlipnoteStereoscopicEye || (FlipnoteStereoscopicEye = {}));
/** Identifies a Flipnote audio track type */
var FlipnoteAudioTrack;
(function (FlipnoteAudioTrack) {
    /** Background music track */
    FlipnoteAudioTrack[FlipnoteAudioTrack["BGM"] = 0] = "BGM";
    /** Sound effect 1 track */
    FlipnoteAudioTrack[FlipnoteAudioTrack["SE1"] = 1] = "SE1";
    /** Sound effect 2 track */
    FlipnoteAudioTrack[FlipnoteAudioTrack["SE2"] = 2] = "SE2";
    /** Sound effect 3 track */
    FlipnoteAudioTrack[FlipnoteAudioTrack["SE3"] = 3] = "SE3";
    /** Sound effect 4 track (only used by KWZ files) */
    FlipnoteAudioTrack[FlipnoteAudioTrack["SE4"] = 4] = "SE4";
})(FlipnoteAudioTrack || (FlipnoteAudioTrack = {}));
/** {@link FlipnoteAudioTrack}, but just sound effect tracks */
var FlipnoteSoundEffectTrack;
(function (FlipnoteSoundEffectTrack) {
    FlipnoteSoundEffectTrack[FlipnoteSoundEffectTrack["SE1"] = 1] = "SE1";
    FlipnoteSoundEffectTrack[FlipnoteSoundEffectTrack["SE2"] = 2] = "SE2";
    FlipnoteSoundEffectTrack[FlipnoteSoundEffectTrack["SE3"] = 3] = "SE3";
    FlipnoteSoundEffectTrack[FlipnoteSoundEffectTrack["SE4"] = 4] = "SE4";
})(FlipnoteSoundEffectTrack || (FlipnoteSoundEffectTrack = {}));
/**
 * Base Flipnote parser class
 *
 * This doesn't implement any parsing functionality itself,
 * it just provides a consistent API for every format parser to implement.
 * @category File Parser
*/
class FlipnoteParserBase extends DataStream {
    constructor() {
        /** Static file format info */
        super(...arguments);
        /** Instance file format info */
        /** Custom object tag */
        this[_a$1] = 'Flipnote';
        /** Default formats used for {@link getTitle()} */
        this.titleFormats = {
            COMMENT: 'Comment by $USERNAME',
            FLIPNOTE: 'Flipnote by $USERNAME',
            ICON: 'Folder icon'
        };
        /** File audio track info, see {@link FlipnoteAudioTrackInfo} */
        this.soundMeta = new Map();
        /** Animation frame global layer visibility */
        this.layerVisibility = { 1: true, 2: true, 3: true };
        /** (KWZ only) Indicates whether or not this file is a Flipnote Studio 3D folder icon */
        this.isFolderIcon = false;
        /** (KWZ only) Indicates whether or not this file is a handwritten comment from Flipnote Gallery World */
        this.isComment = false;
        /** (KWZ only) Indicates whether or not this Flipnote is a PPM to KWZ conversion from Flipnote Studio 3D's DSi Library service */
        this.isDsiLibraryNote = false;
    }
    /**
     * Get file default title - e.g. "Flipnote by Y", "Comment by X", etc.
     * A format object can be passed for localization, where `$USERNAME` gets replaced by author name:
     * ```js
     * {
     *  COMMENT: 'Comment by $USERNAME',
     *  FLIPNOTE: 'Flipnote by $USERNAME',
     *  ICON: 'Folder icon'
     * }
     * ```
     * @category Utility
     */
    getTitle(formats = this.titleFormats) {
        if (this.isFolderIcon)
            return formats.ICON;
        const title = this.isComment ? formats.COMMENT : formats.FLIPNOTE;
        return title.replace('$USERNAME', this.meta.current.username);
    }
    /**
     * Returns the Flipnote title when casting a parser instance to a string
     *
     * ```js
     * const str = 'Title: ' + note;
     * // str === 'Title: Flipnote by username'
     * ```
     * @category Utility
     */
    toString() {
        return this.getTitle();
    }
    /**
     * Allows for frame index iteration when using the parser instance as a for..of iterator
     *
     * ```js
     * for (const frameIndex of note) {
     *   // do something with frameIndex...
     * }
     * ```
     * @category Utility
     */
    *[(_a$1 = Symbol.toStringTag, Symbol.iterator)]() {
        for (let i = 0; i < this.frameCount; i++)
            yield i;
    }
    /**
     * Get the pixels for a given frame layer, as palette indices
     * NOTE: layerIndex are not guaranteed to be sorted by 3D depth in KWZs, use {@link getFrameLayerOrder} to get the correct sort order first
     * NOTE: if the visibility flag for this layer is turned off, the result will be empty
     * @category Image
    */
    getLayerPixels(frameIndex, layerIndex, imageBuffer = new Uint8Array(this.imageWidth * this.imageHeight), depthStrength = 0, depthEye = FlipnoteStereoscopicEye.Left) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        assertRange(layerIndex, 0, this.numLayers - 1, 'Layer index');
        // palette
        const palette = this.getFramePaletteIndices(frameIndex);
        const palettePtr = layerIndex * this.numLayerColors;
        // raw pixels
        const layers = this.decodeFrame(frameIndex);
        const layerBuffer = layers[layerIndex];
        const depth = Math.floor(this.getFrameLayerDepths(frameIndex)[layerIndex] * depthStrength);
        const depthShift = ((depthEye == FlipnoteStereoscopicEye.Left) ? -depth : depth);
        // image dimensions and crop
        const srcStride = this.srcWidth;
        const dstStride = this.imageWidth;
        const width = this.imageWidth;
        const height = this.imageHeight;
        const xOffs = this.imageOffsetX;
        const yOffs = this.imageOffsetY;
        // clear image buffer before writing
        imageBuffer.fill(0);
        // handle layer visibility by returning a blank image if the layer is invisible
        if (!this.layerVisibility[layerIndex + 1])
            return imageBuffer;
        // convert to palette indices and crop
        for (let srcY = yOffs, dstY = 0; dstY < height; srcY++, dstY++) {
            for (let srcX = xOffs, dstX = 0; dstX < width; srcX++, dstX++) {
                const srcPtr = srcY * srcStride + srcX;
                const dstPtr = dstY * dstStride + dstX + depthShift;
                let pixel = layerBuffer[srcPtr];
                if (pixel !== 0)
                    imageBuffer[dstPtr] = palette[palettePtr + pixel];
            }
        }
        return imageBuffer;
    }
    /**
     * Get the pixels for a given frame layer, as RGBA pixels
     * NOTE: layerIndex are not guaranteed to be sorted by 3D depth in KWZs, use {@link getFrameLayerOrder} to get the correct sort order first
     * NOTE: if the visibility flag for this layer is turned off, the result will be empty
     * @category Image
    */
    getLayerPixelsRgba(frameIndex, layerIndex, imageBuffer = new Uint32Array(this.imageWidth * this.imageHeight), paletteBuffer = new Uint32Array(16), depthStrength = 0, depthEye = FlipnoteStereoscopicEye.Left) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        assertRange(layerIndex, 0, this.numLayers - 1, 'Layer index');
        // palette
        this.getFramePaletteUint32(frameIndex, paletteBuffer);
        const palettePtr = layerIndex * this.numLayerColors;
        // raw pixels
        const layers = this.decodeFrame(frameIndex);
        const layerBuffer = layers[layerIndex];
        // depths
        const depth = Math.floor(this.getFrameLayerDepths(frameIndex)[layerIndex] * depthStrength);
        const depthShift = ((depthEye == FlipnoteStereoscopicEye.Left) ? -depth : depth);
        // image dimensions and crop
        const srcStride = this.srcWidth;
        const dstStride = this.imageWidth;
        const width = this.imageWidth - depth;
        const height = this.imageHeight;
        const xOffs = this.imageOffsetX;
        const yOffs = this.imageOffsetY;
        // clear image buffer before writing
        imageBuffer.fill(0);
        // handle layer visibility by returning a blank image if the layer is invisible
        if (!this.layerVisibility[layerIndex + 1])
            return imageBuffer;
        // convert to palette indices and crop
        for (let srcY = yOffs, dstY = 0; dstY < height; srcY++, dstY++) {
            for (let srcX = xOffs, dstX = 0; dstX < width; srcX++, dstX++) {
                const srcPtr = srcY * srcStride + srcX;
                const dstPtr = dstY * dstStride + dstX + depthShift;
                let pixel = layerBuffer[srcPtr];
                if (pixel !== 0)
                    imageBuffer[dstPtr] = paletteBuffer[palettePtr + pixel];
            }
        }
        return imageBuffer;
    }
    /**
     * Get the image for a given frame, as palette indices
     * @category Image
    */
    getFramePixels(frameIndex, imageBuffer = new Uint8Array(this.imageWidth * this.imageHeight), depthStrength = 0, depthEye = FlipnoteStereoscopicEye.Left) {
        // image dimensions and crop
        const srcStride = this.srcWidth;
        this.imageWidth;
        const width = this.imageWidth;
        const height = this.imageHeight;
        const xOffs = this.imageOffsetX;
        const yOffs = this.imageOffsetY;
        // palette
        const palette = this.getFramePaletteIndices(frameIndex);
        // clear framebuffer with paper color
        imageBuffer.fill(palette[0]);
        // get layer info + decode into buffers
        const layerOrder = this.getFrameLayerOrder(frameIndex);
        const layerDepth = this.getFrameLayerDepths(frameIndex);
        const layers = this.decodeFrame(frameIndex);
        // merge layers into framebuffer
        for (let i = 0; i < this.numLayers; i++) {
            const layerIndex = layerOrder[i];
            const layerBuffer = layers[layerIndex];
            const palettePtr = layerIndex * this.numLayerColors;
            const depth = Math.floor(layerDepth[layerIndex] * depthStrength);
            const depthShift = ((depthEye == FlipnoteStereoscopicEye.Left) ? -depth : depth);
            // skip if layer is not visible
            if (!this.layerVisibility[layerIndex + 1])
                continue;
            // merge layer into rgb buffer
            for (let srcY = yOffs, dstY = 0; dstY < height; srcY++, dstY++) {
                for (let srcX = xOffs, dstX = 0; dstX < width; srcX++, dstX++) {
                    const srcPtr = srcY * srcStride + srcX;
                    const dstPtr = dstY * width + dstX + depthShift;
                    let pixel = layerBuffer[srcPtr];
                    if (pixel !== 0)
                        imageBuffer[dstPtr] = palette[palettePtr + pixel];
                }
            }
        }
        return imageBuffer;
    }
    /**
     * Get the image for a given frame as an uint32 array of RGBA pixels
     * @category Image
     */
    getFramePixelsRgba(frameIndex, imageBuffer = new Uint32Array(this.imageWidth * this.imageHeight), paletteBuffer = new Uint32Array(16), depthStrength = 0, depthEye = FlipnoteStereoscopicEye.Left) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        // image dimensions and crop
        const srcStride = this.srcWidth;
        const dstStride = this.imageWidth;
        const width = this.imageWidth;
        const height = this.imageHeight;
        const xOffs = this.imageOffsetX;
        const yOffs = this.imageOffsetY;
        // palette
        this.getFramePaletteUint32(frameIndex, paletteBuffer);
        // clear framebuffer with paper color
        imageBuffer.fill(paletteBuffer[0]);
        // get layer info + decode into buffers
        const layerOrder = this.getFrameLayerOrder(frameIndex);
        const layerDepth = this.getFrameLayerDepths(frameIndex);
        const layers = this.decodeFrame(frameIndex);
        // merge layers into framebuffer
        for (let i = 0; i < this.numLayers; i++) {
            const layerIndex = layerOrder[i];
            // skip if layer is not visible
            if (!this.layerVisibility[layerIndex + 1])
                continue;
            const layerBuffer = layers[layerIndex];
            const palettePtr = layerIndex * this.numLayerColors;
            const depth = Math.floor(layerDepth[layerIndex] * depthStrength);
            const depthShift = ((depthEye == FlipnoteStereoscopicEye.Left) ? -depth : depth);
            for (let srcY = yOffs, dstY = 0; srcY < height; srcY++, dstY++) {
                for (let srcX = xOffs, dstX = 0; srcX < width; srcX++, dstX++) {
                    const srcPtr = srcY * srcStride + srcX;
                    const dstPtr = dstY * dstStride + dstX + depthShift;
                    let pixel = layerBuffer[srcPtr];
                    if (pixel !== 0)
                        imageBuffer[dstPtr] = paletteBuffer[palettePtr + pixel];
                }
            }
        }
        return imageBuffer;
    }
    /**
     * Get the color palette for a given frame, as an uint32 array
     * @category Image
    */
    getFramePaletteUint32(frameIndex, paletteBuffer = new Uint32Array(16)) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        const colors = this.getFramePalette(frameIndex);
        paletteBuffer.fill(0);
        colors.forEach(([r, g, b, a], i) => paletteBuffer[i] = (a << 24) | (b << 16) | (g << 8) | r);
        return paletteBuffer;
    }
    /**
     * Get the usage flags for a given track across every frame
     * @returns an array of booleans for every frame, indicating whether the track is used on that frame
     * @category Audio
     */
    getSoundEffectFlagsForTrack(trackId) {
        return this.getSoundEffectFlags().map(flags => flags[trackId]);
    }
    ;
    /**
     * Is a given track used on a given frame
     * @category Audio
     */
    isSoundEffectUsedOnFrame(trackId, frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        if (!this.soundEffectTracks.includes(trackId))
            return false;
        return this.getFrameSoundEffectFlags(frameIndex)[trackId];
    }
    /**
     * Does an audio track exist in the Flipnote?
     * @returns boolean
     * @category Audio
    */
    hasAudioTrack(trackId) {
        return this.soundMeta.has(trackId) && this.soundMeta.get(trackId).length > 0;
    }
}

var _a;
/**
 * KWZ framerates in frames per second, indexed by the in-app frame speed
 */
const KWZ_FRAMERATES = [.2, .5, 1, 2, 4, 6, 8, 12, 20, 24, 30];
/**
 * KWZ color defines (red, green, blue, alpha)
 */
const KWZ_PALETTE = {
    WHITE: [0xff, 0xff, 0xff, 0xff],
    BLACK: [0x10, 0x10, 0x10, 0xff],
    RED: [0xff, 0x10, 0x10, 0xff],
    YELLOW: [0xff, 0xe7, 0x00, 0xff],
    GREEN: [0x00, 0x86, 0x31, 0xff],
    BLUE: [0x00, 0x38, 0xce, 0xff],
    NONE: [0xff, 0xff, 0xff, 0x00]
};
/**
 * RSA public key used to verify that the KWZ file signature is genuine.
 *
 * This **cannot** be used to resign Flipnotes, it can only verify that they are valid
 */
const KWZ_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuv+zHAXXvbbtRqxADDeJ
ArX2b9RMxj3T+qpRg3FnIE/jeU3tj7eoDzsMduY+D/UT9CSnP+QHYY/vf0n5lqX9
s6ljoZAmyUuruyj1e5Bg+fkDEu/yPEPQjqhbyywCyYL4TEAOJveopUBx9fdQxUJ6
J4J5oCE/Im1kFrlGW+puARiHmt3mmUyNzO8bI/Jx3cGSfoOHJG1foEaQsI5aaKqA
pBqxtzvwqMhudcZtAWSyRMBMlndvkRnVTDNTfTXLOYdHShCIgnKULCTH87uLBIP/
nsmr4/bnQz8q2rp/HyVO+0yjR6mVr0NX5APJQ+6riJmGg3t3VOldhKP7aTHDUW+h
kQIDAQAB
-----END PUBLIC KEY-----`;
/**
 * Pre computed bitmasks for readBits; done as a slight optimisation
 * @internal
 */
const BITMASKS = new Uint16Array(16);
for (let i = 0; i < 16; i++) {
    BITMASKS[i] = (1 << i) - 1;
}
/**
 * Every possible sequence of pixels for each 8-pixel line
 * @internal
 */
const KWZ_LINE_TABLE = new Uint8Array(6561 * 8);
/**
 * Same lines as KWZ_LINE_TABLE, but the pixels are shift-rotated to the left by one place
 * @internal
 */
const KWZ_LINE_TABLE_SHIFT = new Uint8Array(6561 * 8);
/** @internal */
var offset = 0;
for (let a = 0; a < 3; a++)
    for (let b = 0; b < 3; b++)
        for (let c = 0; c < 3; c++)
            for (let d = 0; d < 3; d++)
                for (let e = 0; e < 3; e++)
                    for (let f = 0; f < 3; f++)
                        for (let g = 0; g < 3; g++)
                            for (let h = 0; h < 3; h++) {
                                KWZ_LINE_TABLE.set([b, a, d, c, f, e, h, g], offset);
                                KWZ_LINE_TABLE_SHIFT.set([a, d, c, f, e, h, g, b], offset);
                                offset += 8;
                            }
/**
 * Commonly used lines - represents lines where all the pixels are empty, full,
 * or include a pattern produced by the paint tool, etc
 * @internal
 */
const KWZ_LINE_TABLE_COMMON = new Uint8Array(32 * 8);
/**
 * Same lines as common line table, but shift-rotates one place to the left
 * @internal
 */
const KWZ_LINE_TABLE_COMMON_SHIFT = new Uint8Array(32 * 8);
[
    0x0000, 0x0CD0, 0x19A0, 0x02D9, 0x088B, 0x0051, 0x00F3, 0x0009,
    0x001B, 0x0001, 0x0003, 0x05B2, 0x1116, 0x00A2, 0x01E6, 0x0012,
    0x0036, 0x0002, 0x0006, 0x0B64, 0x08DC, 0x0144, 0x00FC, 0x0024,
    0x001C, 0x0004, 0x0334, 0x099C, 0x0668, 0x1338, 0x1004, 0x166C
].forEach((value, i) => {
    const lineTablePtr = value * 8;
    const pixels = KWZ_LINE_TABLE.subarray(lineTablePtr, lineTablePtr + 8);
    const shiftPixels = KWZ_LINE_TABLE_SHIFT.subarray(lineTablePtr, lineTablePtr + 8);
    KWZ_LINE_TABLE_COMMON.set(pixels, i * 8);
    KWZ_LINE_TABLE_COMMON_SHIFT.set(shiftPixels, i * 8);
});
/**
 * Parser class for Flipnote Studio 3D's KWZ animation format
 *
 * KWZ format docs: https://github.com/Flipnote-Collective/flipnote-studio-3d-docs/wiki/KWZ-Format
 * @category File Parser
 */
class KwzParser extends FlipnoteParserBase {
    /**
     * Create a new KWZ file parser instance
     * @param arrayBuffer an ArrayBuffer containing file data
     * @param settings parser settings
     */
    constructor(arrayBuffer, settings = {}) {
        super(arrayBuffer);
        /** File format type, reflects {@link KwzParser.format} */
        this.format = FlipnoteFormat.KWZ;
        /** Custom object tag */
        this[_a] = 'Flipnote Studio 3D KWZ animation file';
        /** Animation frame width, reflects {@link KwzParser.width} */
        this.imageWidth = KwzParser.width;
        /** Animation frame height, reflects {@link KwzParser.height} */
        this.imageHeight = KwzParser.height;
        /** Animation frame aspect ratio, reflects {@link KwzParser.aspect} */
        this.aspect = KwzParser.aspect;
        /** X offset for the top-left corner of the animation frame */
        this.imageOffsetX = 0;
        /** Y offset for the top-left corner of the animation frame */
        this.imageOffsetY = 0;
        /** Number of animation frame layers, reflects {@link KwzParser.numLayers} */
        this.numLayers = KwzParser.numLayers;
        /** Number of colors per layer (aside from transparent), reflects {@link KwzParser.numLayerColors} */
        this.numLayerColors = KwzParser.numLayerColors;
        /** key used for Flipnote verification, in PEM format */
        this.publicKey = KwzParser.publicKey;
        /** @internal */
        this.srcWidth = KwzParser.width;
        /** Which audio tracks are available in this format, reflects {@link KwzParser.audioTracks} */
        this.audioTracks = KwzParser.audioTracks;
        /** Which sound effect tracks are available in this format, reflects {@link KwzParser.soundEffectTracks} */
        this.soundEffectTracks = KwzParser.soundEffectTracks;
        /** Audio track base sample rate, reflects {@link KwzParser.rawSampleRate} */
        this.rawSampleRate = KwzParser.rawSampleRate;
        /** Audio output sample rate, reflects {@link KwzParser.sampleRate} */
        this.sampleRate = KwzParser.sampleRate;
        /** Global animation frame color palette, reflects {@link KwzParser.globalPalette} */
        this.globalPalette = KwzParser.globalPalette;
        this.prevDecodedFrame = null;
        this.bitIndex = 0;
        this.bitValue = 0;
        this.settings = { ...KwzParser.defaultSettings, ...settings };
        this.layerBuffers = [
            new Uint8Array(KwzParser.width * KwzParser.height),
            new Uint8Array(KwzParser.width * KwzParser.height),
            new Uint8Array(KwzParser.width * KwzParser.height),
        ];
        // skip through the file and read all of the section headers so we can locate them
        this.buildSectionMap();
        // if the KIC section is present, we're dealing with a folder icon
        // these are single-frame KWZs without a KFH section for metadata, or a KSN section for sound
        // while the data for a full frame (320*240) is present, only the top-left 24*24 pixels are used
        if (this.sectionMap.has('KIC')) {
            this.isFolderIcon = true;
            // icons still use the full 320 * 240 frame size, so we just set up our image crop to deal with that
            this.imageWidth = 24;
            this.imageHeight = 24;
            this.frameCount = 1;
            this.frameSpeed = 0;
            this.framerate = KWZ_FRAMERATES[0];
            this.thumbFrameIndex = 0;
            this.getFrameOffsets();
        }
        // if the KSN section is not present, then this is a handwritten comment from the Flipnote Gallery World online service
        // these are single-frame KWZs, just with no sound
        else if (!this.sectionMap.has('KSN')) {
            this.isComment = true;
            this.decodeMeta();
            this.getFrameOffsets();
        }
        // else let's assume this is a regular note
        else {
            this.decodeMeta();
            this.getFrameOffsets();
            this.decodeSoundHeader();
        }
        // apply special optimizations for converted DSi library notes
        if (this.settings.dsiLibraryNote) {
            this.isDsiLibraryNote = true;
        }
        // automatically crop out the border around every frame
        if (this.settings.borderCrop) {
            // dsi library notes can be cropped to their original resolution
            if (this.isDsiLibraryNote) {
                this.imageOffsetX = 32;
                this.imageOffsetY = 24;
                this.imageWidth = 256;
                this.imageHeight = 192;
            }
            // even standard notes have a bit of a border...
            else if (!this.isFolderIcon) {
                this.imageOffsetX = 5;
                this.imageOffsetY = 5;
                this.imageWidth = 310;
                this.imageHeight = 230;
            }
        }
    }
    buildSectionMap() {
        const fileSize = this.byteLength - 256;
        const sectionMap = new Map();
        let sectionCount = 0;
        let ptr = 0;
        // counting sections should mitigate against one of mrnbayoh's notehax exploits
        while (ptr < fileSize && sectionCount < 6) {
            this.seek(ptr);
            const magic = this.readChars(4).substring(0, 3);
            const length = this.readUint32();
            sectionMap.set(magic, { ptr, length });
            ptr += length + 8;
            sectionCount += 1;
        }
        this.bodyEndOffset = ptr;
        this.sectionMap = sectionMap;
        assert(sectionMap.has('KMC') && sectionMap.has('KMI'));
    }
    readBits(num) {
        // assert(num < 16);
        if (this.bitIndex + num > 16) {
            const nextBits = this.readUint16();
            this.bitValue |= nextBits << (16 - this.bitIndex);
            this.bitIndex -= 16;
        }
        const result = this.bitValue & BITMASKS[num];
        this.bitValue >>= num;
        this.bitIndex += num;
        return result;
    }
    readFsid() {
        if (this.settings.dsiLibraryNote) { // format as DSi PPM FSID
            const hex = this.readHex(10, true);
            return hex.slice(2, 18);
        }
        const hex = this.readHex(10);
        return `${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 18)}`.toLowerCase();
    }
    readFilename() {
        const ptr = this.pointer;
        const chars = this.readChars(28);
        if (chars.length === 28)
            return chars;
        // Otherwise, this is likely a DSi Library note, 
        // where sometimes Nintendo's buggy PPM converter includes the original packed PPM filename
        this.seek(ptr);
        const mac = this.readHex(3);
        const random = this.readChars(13);
        const edits = this.readUint16().toString().padStart(3, '0');
        this.seek(ptr + 28);
        return `${mac}_${random}_${edits}`;
    }
    decodeMeta() {
        if (this.settings.quickMeta)
            return this.decodeMetaQuick();
        assert(this.sectionMap.has('KFH'));
        this.seek(this.sectionMap.get('KFH').ptr + 12);
        const creationTime = dateFromNintendoTimestamp(this.readUint32());
        const modifiedTime = dateFromNintendoTimestamp(this.readUint32());
        // const simonTime = 
        this.readUint32();
        const rootAuthorId = this.readFsid();
        const parentAuthorId = this.readFsid();
        const currentAuthorId = this.readFsid();
        const rootAuthorName = this.readWideChars(11);
        const parentAuthorName = this.readWideChars(11);
        const currentAuthorName = this.readWideChars(11);
        const rootFilename = this.readFilename();
        const parentFilename = this.readFilename();
        const currentFilename = this.readFilename();
        const frameCount = this.readUint16();
        const thumbIndex = this.readUint16();
        const flags = this.readUint16();
        const frameSpeed = this.readUint8();
        const layerFlags = this.readUint8();
        this.isSpinoff = (currentAuthorId !== parentAuthorId) || (currentAuthorId !== rootAuthorId);
        this.frameCount = frameCount;
        this.frameSpeed = frameSpeed;
        this.framerate = KWZ_FRAMERATES[frameSpeed];
        this.duration = timeGetNoteDuration(this.frameCount, this.framerate);
        this.thumbFrameIndex = thumbIndex;
        this.layerVisibility = {
            1: (layerFlags & 0x1) === 0,
            2: (layerFlags & 0x2) === 0,
            3: (layerFlags & 0x3) === 0,
        };
        // Try to auto-detect whether the current author ID matches a converted PPM ID
        // if (isKwzDsiLibraryFsid(currentAuthorId)) {
        //   this.isDsiLibraryNote = true;
        // }
        this.meta = {
            lock: (flags & 0x1) !== 0,
            loop: (flags & 0x2) !== 0,
            isSpinoff: this.isSpinoff,
            frameCount: frameCount,
            frameSpeed: frameSpeed,
            duration: this.duration,
            thumbIndex: thumbIndex,
            timestamp: modifiedTime,
            creationTimestamp: creationTime,
            root: {
                username: rootAuthorName,
                fsid: rootAuthorId,
                region: getKwzFsidRegion(rootAuthorId),
                filename: rootFilename,
                isDsiFilename: rootFilename.length !== 28
            },
            parent: {
                username: parentAuthorName,
                fsid: parentAuthorId,
                region: getKwzFsidRegion(parentAuthorId),
                filename: parentFilename,
                isDsiFilename: parentFilename.length !== 28
            },
            current: {
                username: currentAuthorName,
                fsid: currentAuthorId,
                region: getKwzFsidRegion(currentAuthorId),
                filename: currentFilename,
                isDsiFilename: currentFilename.length !== 28
            },
        };
    }
    decodeMetaQuick() {
        assert(this.sectionMap.has('KFH'));
        this.seek(this.sectionMap.get('KFH').ptr + 0x8 + 0xC4);
        const frameCount = this.readUint16();
        const thumbFrameIndex = this.readUint16();
        this.readUint16();
        const frameSpeed = this.readUint8();
        const layerFlags = this.readUint8();
        this.frameCount = frameCount;
        this.thumbFrameIndex = thumbFrameIndex;
        this.frameSpeed = frameSpeed;
        this.framerate = KWZ_FRAMERATES[frameSpeed];
        this.duration = timeGetNoteDuration(this.frameCount, this.framerate);
        this.layerVisibility = {
            1: (layerFlags & 0x1) === 0,
            2: (layerFlags & 0x2) === 0,
            3: (layerFlags & 0x3) === 0,
        };
    }
    getFrameOffsets() {
        assert(this.sectionMap.has('KMI') && this.sectionMap.has('KMC'));
        const numFrames = this.frameCount;
        const kmiSection = this.sectionMap.get('KMI');
        const kmcSection = this.sectionMap.get('KMC');
        assert(kmiSection.length / 28 >= numFrames);
        const frameMetaOffsets = new Uint32Array(numFrames);
        const frameDataOffsets = new Uint32Array(numFrames);
        const frameLayerSizes = [];
        let frameMetaPtr = kmiSection.ptr + 8;
        let frameDataPtr = kmcSection.ptr + 12;
        for (let frameIndex = 0; frameIndex < numFrames; frameIndex++) {
            this.seek(frameMetaPtr + 4);
            const layerASize = this.readUint16();
            const layerBSize = this.readUint16();
            const layerCSize = this.readUint16();
            frameMetaOffsets[frameIndex] = frameMetaPtr;
            frameDataOffsets[frameIndex] = frameDataPtr;
            frameMetaPtr += 28;
            frameDataPtr += layerASize + layerBSize + layerCSize;
            assert(frameMetaPtr < this.byteLength, `frame${frameIndex} meta pointer out of bounds`);
            assert(frameDataPtr < this.byteLength, `frame${frameIndex} data pointer out of bounds`);
            frameLayerSizes.push([layerASize, layerBSize, layerCSize]);
        }
        this.frameMetaOffsets = frameMetaOffsets;
        this.frameDataOffsets = frameDataOffsets;
        this.frameLayerSizes = frameLayerSizes;
    }
    decodeSoundHeader() {
        assert(this.sectionMap.has('KSN'));
        let ptr = this.sectionMap.get('KSN').ptr + 8;
        this.seek(ptr);
        this.bgmSpeed = this.readUint32();
        assert(this.bgmSpeed <= 10);
        this.bgmrate = KWZ_FRAMERATES[this.bgmSpeed];
        const trackSizes = new Uint32Array(this.buffer, ptr + 4, 20);
        const soundMeta = new Map();
        soundMeta.set(FlipnoteAudioTrack.BGM, { ptr: ptr += 28, length: trackSizes[0] });
        soundMeta.set(FlipnoteAudioTrack.SE1, { ptr: ptr += trackSizes[0], length: trackSizes[1] });
        soundMeta.set(FlipnoteAudioTrack.SE2, { ptr: ptr += trackSizes[1], length: trackSizes[2] });
        soundMeta.set(FlipnoteAudioTrack.SE3, { ptr: ptr += trackSizes[2], length: trackSizes[3] });
        soundMeta.set(FlipnoteAudioTrack.SE4, { ptr: ptr += trackSizes[3], length: trackSizes[4] });
        this.soundMeta = soundMeta;
    }
    /**
     * Decodes the thumbnail image embedded in the Flipnote. Will return a {@link FlipnoteThumbImage} containing JPEG data.
     *
     * Note: For most purposes, you should probably just decode the thumbnail fraa to get a higher resolution image.
     * @category Meta
     */
    getThumbnailImage() {
        assert(this.sectionMap.has('KTN'), 'KTN section missing - Note that folder icons and comments do not contain thumbnail data');
        const ktn = this.sectionMap.get('KTN');
        this.seek(ktn.ptr + 12);
        const bytes = this.readBytes(ktn.length - 12);
        return {
            format: FlipnoteThumbImageFormat.Jpeg,
            width: 80,
            height: 64,
            data: bytes.buffer
        };
    }
    /**
     * Get the color palette indices for a given frame. RGBA colors for these values can be indexed from {@link KwzParser.globalPalette}
     *
     * Returns an array where:
     *  - index 0 is the paper color index
     *  - index 1 is the layer A color 1 index
     *  - index 2 is the layer A color 2 index
     *  - index 3 is the layer B color 1 index
     *  - index 4 is the layer B color 2 index
     *  - index 5 is the layer C color 1 index
     *  - index 6 is the layer C color 2 index
     * @category Image
    */
    getFramePaletteIndices(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        this.seek(this.frameMetaOffsets[frameIndex]);
        const flags = this.readUint32();
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
    /**
     * Get the RGBA colors for a given frame
     *
     * Returns an array where:
     *  - index 0 is the paper color
     *  - index 1 is the layer A color 1
     *  - index 2 is the layer A color 2
     *  - index 3 is the layer B color 1
     *  - index 4 is the layer B color 2
     *  - index 5 is the layer C color 1
     *  - index 6 is the layer C color 2
     * @category Image
    */
    getFramePalette(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        const indices = this.getFramePaletteIndices(frameIndex);
        return indices.map(colorIndex => this.globalPalette[colorIndex]);
    }
    getFrameDiffingFlag(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        this.seek(this.frameMetaOffsets[frameIndex]);
        return (this.readUint32() >> 4) & 0x07;
    }
    /**
     * Determines if a given frame is a video key frame or not. This returns an array of booleans for each layer, since keyframe encoding is done on a per-layer basis.
     * @param frameIndex
     * @category Image
    */
    getIsKeyFrame(frameIndex) {
        const flag = this.getFrameDiffingFlag(frameIndex);
        return [
            (flag & 0x1) === 0,
            (flag & 0x2) === 0,
            (flag & 0x4) === 0,
        ];
    }
    /**
     * Get the 3D depths for each layer in a given frame.
     * @param frameIndex
     * @category Image
    */
    getFrameLayerDepths(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        this.seek(this.frameMetaOffsets[frameIndex] + 0x14);
        return [
            this.readUint8(),
            this.readUint8(),
            this.readUint8()
        ];
    }
    /**
     * Get the FSID for a given frame's original author.
     * @param frameIndex
     * @category Meta
    */
    getFrameAuthor(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        this.seek(this.frameMetaOffsets[frameIndex] + 0xA);
        return this.readFsid();
    }
    /**
     * Get the camera flags for a given frame
     * @category Image
     * @returns Array of booleans, indicating whether each layer uses a photo or not
    */
    getFrameCameraFlags(frameIndex) {
        this.seek(this.frameMetaOffsets[frameIndex] + 0x1A);
        const cameraFlags = this.readUint8();
        return [
            (cameraFlags & 0x1) !== 0,
            (cameraFlags & 0x2) !== 0,
            (cameraFlags & 0x4) !== 0,
        ];
    }
    /**
     * Get the layer draw order for a given frame
     * @category Image
    */
    getFrameLayerOrder(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        const depths = this.getFrameLayerDepths(frameIndex);
        return [2, 1, 0].sort((a, b) => depths[b] - depths[a]);
    }
    /**
     * Decode a frame, returning the raw pixel buffers for each layer
     * @category Image
    */
    decodeFrame(frameIndex, diffingFlag = 0x7, isPrevFrame = false) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        // return existing layer buffers if no new frame has been decoded since the last call
        if (this.prevDecodedFrame === frameIndex)
            return this.layerBuffers;
        // the prevDecodedFrame check is an optimization for decoding frames in full sequence
        if (this.prevDecodedFrame !== frameIndex - 1 && frameIndex !== 0) {
            // if this frame is being decoded as a prev frame, then we only want to decode the layers necessary
            // diffingFlag is negated with ~ so if no layers are diff-based, diffingFlag is 0
            if (isPrevFrame)
                diffingFlag = diffingFlag & ~this.getFrameDiffingFlag(frameIndex + 1);
            // if diffing flag isn't 0, decode the previous frame before this one
            if (diffingFlag !== 0)
                this.decodeFrame(frameIndex - 1, diffingFlag, true);
        }
        let framePtr = this.frameDataOffsets[frameIndex];
        const layerSizes = this.frameLayerSizes[frameIndex];
        for (let layerIndex = 0; layerIndex < 3; layerIndex++) {
            // dsi gallery conversions don't use the third layer, so it can be skipped if this is set
            if (this.settings.dsiLibraryNote && layerIndex === 3)
                break;
            this.seek(framePtr);
            let layerSize = layerSizes[layerIndex];
            framePtr += layerSize;
            const pixelBuffer = this.layerBuffers[layerIndex];
            // if the layer is 38 bytes then it hasn't changed at all since the previous frame, so we can skip it
            if (layerSize === 38)
                continue;
            // if this layer doesn't need to be decoded for diffing
            if (((diffingFlag >> layerIndex) & 0x1) === 0)
                continue;
            // reset readbits state
            this.bitIndex = 16;
            this.bitValue = 0;
            // tile skip counter
            let skipTileCounter = 0;
            for (let tileOffsetY = 0; tileOffsetY < 240; tileOffsetY += 128) {
                for (let tileOffsetX = 0; tileOffsetX < 320; tileOffsetX += 128) {
                    // loop small tiles
                    for (let subTileOffsetY = 0; subTileOffsetY < 128; subTileOffsetY += 8) {
                        const y = tileOffsetY + subTileOffsetY;
                        if (y >= 240)
                            break;
                        for (let subTileOffsetX = 0; subTileOffsetX < 128; subTileOffsetX += 8) {
                            const x = tileOffsetX + subTileOffsetX;
                            if (x >= 320)
                                break;
                            // continue to next tile loop if skipTileCounter is > 0
                            if (skipTileCounter > 0) {
                                skipTileCounter -= 1;
                                continue;
                            }
                            let pixelBufferPtr = y * KwzParser.width + x;
                            const tileType = this.readBits(3);
                            if (tileType === 0) {
                                const linePtr = this.readBits(5) * 8;
                                const pixels = KWZ_LINE_TABLE_COMMON.subarray(linePtr, linePtr + 8);
                                pixelBuffer.set(pixels, pixelBufferPtr);
                                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                            }
                            else if (tileType === 1) {
                                const linePtr = this.readBits(13) * 8;
                                const pixels = KWZ_LINE_TABLE.subarray(linePtr, linePtr + 8);
                                pixelBuffer.set(pixels, pixelBufferPtr);
                                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                                pixelBuffer.set(pixels, pixelBufferPtr += 320);
                            }
                            else if (tileType === 2) {
                                const linePtr = this.readBits(5) * 8;
                                const a = KWZ_LINE_TABLE_COMMON.subarray(linePtr, linePtr + 8);
                                const b = KWZ_LINE_TABLE_COMMON_SHIFT.subarray(linePtr, linePtr + 8);
                                pixelBuffer.set(a, pixelBufferPtr);
                                pixelBuffer.set(b, pixelBufferPtr += 320);
                                pixelBuffer.set(a, pixelBufferPtr += 320);
                                pixelBuffer.set(b, pixelBufferPtr += 320);
                                pixelBuffer.set(a, pixelBufferPtr += 320);
                                pixelBuffer.set(b, pixelBufferPtr += 320);
                                pixelBuffer.set(a, pixelBufferPtr += 320);
                                pixelBuffer.set(b, pixelBufferPtr += 320);
                            }
                            else if (tileType === 3) {
                                const linePtr = this.readBits(13) * 8;
                                const a = KWZ_LINE_TABLE.subarray(linePtr, linePtr + 8);
                                const b = KWZ_LINE_TABLE_SHIFT.subarray(linePtr, linePtr + 8);
                                pixelBuffer.set(a, pixelBufferPtr);
                                pixelBuffer.set(b, pixelBufferPtr += 320);
                                pixelBuffer.set(a, pixelBufferPtr += 320);
                                pixelBuffer.set(b, pixelBufferPtr += 320);
                                pixelBuffer.set(a, pixelBufferPtr += 320);
                                pixelBuffer.set(b, pixelBufferPtr += 320);
                                pixelBuffer.set(a, pixelBufferPtr += 320);
                                pixelBuffer.set(b, pixelBufferPtr += 320);
                            }
                            // most common tile type
                            else if (tileType === 4) {
                                const flags = this.readBits(8);
                                for (let mask = 1; mask < 0xFF; mask <<= 1) {
                                    if (flags & mask) {
                                        const linePtr = this.readBits(5) * 8;
                                        const pixels = KWZ_LINE_TABLE_COMMON.subarray(linePtr, linePtr + 8);
                                        pixelBuffer.set(pixels, pixelBufferPtr);
                                    }
                                    else {
                                        const linePtr = this.readBits(13) * 8;
                                        const pixels = KWZ_LINE_TABLE.subarray(linePtr, linePtr + 8);
                                        pixelBuffer.set(pixels, pixelBufferPtr);
                                    }
                                    pixelBufferPtr += 320;
                                }
                            }
                            else if (tileType === 5) {
                                skipTileCounter = this.readBits(5);
                                continue;
                            }
                            // type 6 doesnt exist
                            else if (tileType === 7) {
                                let pattern = this.readBits(2);
                                let useCommonLines = this.readBits(1);
                                let a, b;
                                if (useCommonLines !== 0) {
                                    const linePtrA = this.readBits(5) * 8;
                                    const linePtrB = this.readBits(5) * 8;
                                    a = KWZ_LINE_TABLE_COMMON.subarray(linePtrA, linePtrA + 8);
                                    b = KWZ_LINE_TABLE_COMMON.subarray(linePtrB, linePtrB + 8);
                                    pattern += 1;
                                }
                                else {
                                    const linePtrA = this.readBits(13) * 8;
                                    const linePtrB = this.readBits(13) * 8;
                                    a = KWZ_LINE_TABLE.subarray(linePtrA, linePtrA + 8);
                                    b = KWZ_LINE_TABLE.subarray(linePtrB, linePtrB + 8);
                                }
                                switch (pattern % 4) {
                                    case 0:
                                        pixelBuffer.set(a, pixelBufferPtr);
                                        pixelBuffer.set(b, pixelBufferPtr += 320);
                                        pixelBuffer.set(a, pixelBufferPtr += 320);
                                        pixelBuffer.set(b, pixelBufferPtr += 320);
                                        pixelBuffer.set(a, pixelBufferPtr += 320);
                                        pixelBuffer.set(b, pixelBufferPtr += 320);
                                        pixelBuffer.set(a, pixelBufferPtr += 320);
                                        pixelBuffer.set(b, pixelBufferPtr += 320);
                                        break;
                                    case 1:
                                        pixelBuffer.set(a, pixelBufferPtr);
                                        pixelBuffer.set(a, pixelBufferPtr += 320);
                                        pixelBuffer.set(b, pixelBufferPtr += 320);
                                        pixelBuffer.set(a, pixelBufferPtr += 320);
                                        pixelBuffer.set(a, pixelBufferPtr += 320);
                                        pixelBuffer.set(b, pixelBufferPtr += 320);
                                        pixelBuffer.set(a, pixelBufferPtr += 320);
                                        pixelBuffer.set(a, pixelBufferPtr += 320);
                                        break;
                                    case 2:
                                        pixelBuffer.set(a, pixelBufferPtr);
                                        pixelBuffer.set(b, pixelBufferPtr += 320);
                                        pixelBuffer.set(a, pixelBufferPtr += 320);
                                        pixelBuffer.set(a, pixelBufferPtr += 320);
                                        pixelBuffer.set(b, pixelBufferPtr += 320);
                                        pixelBuffer.set(a, pixelBufferPtr += 320);
                                        pixelBuffer.set(a, pixelBufferPtr += 320);
                                        pixelBuffer.set(b, pixelBufferPtr += 320);
                                        break;
                                    case 3:
                                        pixelBuffer.set(a, pixelBufferPtr);
                                        pixelBuffer.set(b, pixelBufferPtr += 320);
                                        pixelBuffer.set(b, pixelBufferPtr += 320);
                                        pixelBuffer.set(a, pixelBufferPtr += 320);
                                        pixelBuffer.set(b, pixelBufferPtr += 320);
                                        pixelBuffer.set(b, pixelBufferPtr += 320);
                                        pixelBuffer.set(a, pixelBufferPtr += 320);
                                        pixelBuffer.set(b, pixelBufferPtr += 320);
                                        break;
                                }
                            }
                        }
                    }
                }
            }
        }
        this.prevDecodedFrame = frameIndex;
        return this.layerBuffers;
    }
    decodeFrameSoundFlags(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        this.seek(this.frameMetaOffsets[frameIndex] + 0x17);
        const soundFlags = this.readUint8();
        return [
            (soundFlags & 0x1) !== 0,
            (soundFlags & 0x2) !== 0,
            (soundFlags & 0x4) !== 0,
            (soundFlags & 0x8) !== 0,
        ];
    }
    /**
     * Get the sound effect flags for every frame in the Flipnote
     * @category Audio
    */
    decodeSoundFlags() {
        if (this.soundFlags !== undefined)
            return this.soundFlags;
        this.soundFlags = new Array(this.frameCount)
            .fill(false)
            .map((_, i) => this.decodeFrameSoundFlags(i));
        return this.soundFlags;
    }
    /**
     * Get the sound effect usage flags for every frame
     * @category Audio
     */
    getSoundEffectFlags() {
        return this.decodeSoundFlags().map((frameFlags) => ({
            [FlipnoteSoundEffectTrack.SE1]: frameFlags[0],
            [FlipnoteSoundEffectTrack.SE2]: frameFlags[1],
            [FlipnoteSoundEffectTrack.SE3]: frameFlags[2],
            [FlipnoteSoundEffectTrack.SE4]: frameFlags[3],
        }));
    }
    /**
     * Get the sound effect usage for a given frame
     * @param frameIndex
     * @category Audio
     */
    getFrameSoundEffectFlags(frameIndex) {
        const frameFlags = this.decodeFrameSoundFlags(frameIndex);
        return {
            [FlipnoteSoundEffectTrack.SE1]: frameFlags[0],
            [FlipnoteSoundEffectTrack.SE2]: frameFlags[1],
            [FlipnoteSoundEffectTrack.SE3]: frameFlags[2],
            [FlipnoteSoundEffectTrack.SE4]: frameFlags[3],
        };
    }
    /**
     * Get the raw compressed audio data for a given track
     * @returns Byte array
     * @category Audio
    */
    getAudioTrackRaw(trackId) {
        const trackMeta = this.soundMeta.get(trackId);
        assert(trackMeta.ptr + trackMeta.length < this.byteLength);
        return new Uint8Array(this.buffer, trackMeta.ptr, trackMeta.length);
    }
    decodeAdpcm(src, dst, predictor = 0, stepIndex = 0) {
        const srcSize = src.length;
        let dstPtr = 0;
        let sample = 0;
        let step = 0;
        let diff = 0;
        // loop through each byte in the raw adpcm data
        for (let srcPtr = 0; srcPtr < srcSize; srcPtr++) {
            let currByte = src[srcPtr];
            let currBit = 0;
            while (currBit < 8) {
                // 2 bit sample
                if (stepIndex < 18 || currBit > 4) {
                    sample = currByte & 0x3;
                    step = ADPCM_STEP_TABLE[stepIndex];
                    diff = step >> 3;
                    if (sample & 1)
                        diff += step;
                    if (sample & 2)
                        diff = -diff;
                    predictor += diff;
                    stepIndex += ADPCM_INDEX_TABLE_2BIT[sample];
                    currByte >>= 2;
                    currBit += 2;
                }
                // 4 bit sample
                else {
                    sample = currByte & 0xf;
                    step = ADPCM_STEP_TABLE[stepIndex];
                    diff = step >> 3;
                    if (sample & 1)
                        diff += step >> 2;
                    if (sample & 2)
                        diff += step >> 1;
                    if (sample & 4)
                        diff += step;
                    if (sample & 8)
                        diff = -diff;
                    predictor += diff;
                    stepIndex += ADPCM_INDEX_TABLE_4BIT[sample];
                    currByte >>= 4;
                    currBit += 4;
                }
                stepIndex = clamp(stepIndex, 0, 79);
                // clamp as 12 bit then scale to 16
                predictor = clamp(predictor, -2048, 2047);
                dst[dstPtr] = predictor * 16;
                dstPtr += 1;
            }
        }
        return dstPtr;
    }
    /**
     * Get the decoded audio data for a given track, using the track's native samplerate
     * @returns Signed 16-bit PCM audio
     * @category Audio
    */
    decodeAudioTrack(trackId) {
        const settings = this.settings;
        const src = this.getAudioTrackRaw(trackId);
        const dstSize = this.rawSampleRate * 60; // enough for 60 seconds, the max bgm size
        const dst = new Int16Array(dstSize);
        // initial decoder state
        let predictor = 0;
        let stepIndex = 40;
        // Nintendo messed up the initial adpcm state for a bunch of the PPM conversions on DSi Library
        // they are effectively random, so you can optionally provide your own state values, or let the lib make a best guess
        if (this.isDsiLibraryNote) {
            if (trackId === FlipnoteAudioTrack.BGM) {
                // passing an initial index or predictor value should disable bruteforcing
                let doGuess = true;
                // allow manual overrides for default predictor
                if (settings.initialBgmPredictor !== null) {
                    predictor = settings.initialBgmPredictor;
                    doGuess = false;
                }
                // allow manual overrides for default step index
                if (settings.initialBgmStepIndex !== null) {
                    stepIndex = settings.initialBgmStepIndex;
                    doGuess = false;
                }
                // bruteforce step index by finding the lowest track root mean square 
                if (doGuess && settings.guessInitialBgmState) {
                    let bestRms = 0xFFFFFFFF; // arbitrarily large
                    let bestStepIndex = 0;
                    for (stepIndex = 0; stepIndex <= 40; stepIndex++) {
                        const dstPtr = this.decodeAdpcm(src, dst, predictor, stepIndex);
                        const rms = pcmGetRms(dst.subarray(0, dstPtr)); // uses same underlying memory as dst
                        if (rms < bestRms) {
                            bestRms = rms;
                            bestStepIndex = stepIndex;
                        }
                    }
                    stepIndex = bestStepIndex;
                }
            }
            else {
                const trackIndex = this.soundEffectTracks.indexOf(trackId);
                // allow manual overrides for default predictor
                if (Array.isArray(settings.initialSePredictors) && settings.initialSePredictors[trackIndex] !== undefined)
                    predictor = settings.initialSePredictors[trackIndex];
                // allow manual overrides for default step index
                if (Array.isArray(settings.initialSeStepIndices) && settings.initialSeStepIndices[trackIndex] !== undefined)
                    stepIndex = settings.initialSeStepIndices[trackIndex];
            }
        }
        // decode track
        const dstPtr = this.decodeAdpcm(src, dst, predictor, stepIndex);
        // copy part of dst with slice() so dst buffer can be garbage collected
        return dst.slice(0, dstPtr);
    }
    /**
     * Get the decoded audio data for a given track, using the specified samplerate
     * @returns Signed 16-bit PCM audio
     * @category Audio
    */
    getAudioTrackPcm(trackId, dstFreq = this.sampleRate) {
        const srcPcm = this.decodeAudioTrack(trackId);
        let srcFreq = this.rawSampleRate;
        if (trackId === FlipnoteAudioTrack.BGM) {
            const bgmAdjust = (1 / this.bgmrate) / (1 / this.framerate);
            srcFreq = this.rawSampleRate * bgmAdjust;
        }
        if (srcFreq !== dstFreq)
            return pcmResampleLinear(srcPcm, srcFreq, dstFreq);
        return srcPcm;
    }
    pcmAudioMix(src, dst, dstOffset = 0) {
        const srcSize = src.length;
        const dstSize = dst.length;
        for (let n = 0; n < srcSize; n++) {
            if (dstOffset + n > dstSize)
                break;
            // half src volume
            const samp = dst[dstOffset + n] + src[n];
            dst[dstOffset + n] = clamp(samp, -32768, 32767);
        }
    }
    /**
     * Get the full mixed audio for the Flipnote, using the specified samplerate
     * @returns Signed 16-bit PCM audio
     * @category Audio
    */
    getAudioMasterPcm(dstFreq = this.sampleRate) {
        const dstSize = Math.ceil(this.duration * dstFreq);
        const master = new Int16Array(dstSize);
        const hasBgm = this.hasAudioTrack(FlipnoteAudioTrack.BGM);
        const hasSe1 = this.hasAudioTrack(FlipnoteAudioTrack.SE1);
        const hasSe2 = this.hasAudioTrack(FlipnoteAudioTrack.SE2);
        const hasSe3 = this.hasAudioTrack(FlipnoteAudioTrack.SE3);
        const hasSe4 = this.hasAudioTrack(FlipnoteAudioTrack.SE4);
        // Mix background music
        if (hasBgm) {
            const bgmPcm = this.getAudioTrackPcm(FlipnoteAudioTrack.BGM, dstFreq);
            this.pcmAudioMix(bgmPcm, master, 0);
        }
        // Mix sound effects
        if (hasSe1 || hasSe2 || hasSe3 || hasSe4) {
            const samplesPerFrame = dstFreq / this.framerate;
            const se1Pcm = hasSe1 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE1, dstFreq) : null;
            const se2Pcm = hasSe2 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE2, dstFreq) : null;
            const se3Pcm = hasSe3 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE3, dstFreq) : null;
            const se4Pcm = hasSe4 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE4, dstFreq) : null;
            const soundEffectFlags = this.decodeSoundFlags();
            for (let i = 0; i < this.frameCount; i++) {
                const seFlags = soundEffectFlags[i];
                const seOffset = Math.ceil(i * samplesPerFrame);
                if (hasSe1 && seFlags[0])
                    this.pcmAudioMix(se1Pcm, master, seOffset);
                if (hasSe2 && seFlags[1])
                    this.pcmAudioMix(se2Pcm, master, seOffset);
                if (hasSe3 && seFlags[2])
                    this.pcmAudioMix(se3Pcm, master, seOffset);
                if (hasSe4 && seFlags[3])
                    this.pcmAudioMix(se4Pcm, master, seOffset);
            }
        }
        this.audioClipRatio = pcmGetClippingRatio(master);
        return master;
    }
    /**
     * Get the body of the Flipnote - the data that is digested for the signature
     * @category Verification
     */
    getBody() {
        const bodyEnd = this.bodyEndOffset;
        return this.bytes.subarray(0, bodyEnd);
    }
    /**
     * Get the Flipnote's signature data
     * @category Verification
     */
    getSignature() {
        const bodyEnd = this.bodyEndOffset;
        return this.bytes.subarray(bodyEnd, bodyEnd + 256);
    }
    /**
     * Verify whether this Flipnote's signature is valid
     * @category Verification
     */
    async verify() {
        const key = await rsaLoadPublicKey(KWZ_PUBLIC_KEY, 'SHA-256');
        return await rsaVerify(key, this.getSignature(), this.getBody());
    }
}
_a = Symbol.toStringTag;
/** Default KWZ parser settings */
KwzParser.defaultSettings = {
    quickMeta: false,
    dsiLibraryNote: false,
    borderCrop: false,
    guessInitialBgmState: true,
    initialBgmPredictor: null,
    initialBgmStepIndex: null,
    initialSePredictors: null,
    initialSeStepIndices: null,
};
/** File format type */
KwzParser.format = FlipnoteFormat.KWZ;
/** Animation frame width */
KwzParser.width = 320;
/** Animation frame height */
KwzParser.height = 240;
/** Animation frame aspect ratio */
KwzParser.aspect = 3 / 4;
/** Number of animation frame layers */
KwzParser.numLayers = 3;
/** Number of colors per layer (aside from transparent) */
KwzParser.numLayerColors = 2;
/** Audio track base sample rate */
KwzParser.rawSampleRate = 16364;
/** Audio output sample rate  */
KwzParser.sampleRate = 32768;
/** Which audio tracks are available in this format */
KwzParser.audioTracks = [
    FlipnoteAudioTrack.BGM,
    FlipnoteAudioTrack.SE1,
    FlipnoteAudioTrack.SE2,
    FlipnoteAudioTrack.SE3,
    FlipnoteAudioTrack.SE4,
];
/** Which sound effect tracks are available in this format */
KwzParser.soundEffectTracks = [
    FlipnoteSoundEffectTrack.SE1,
    FlipnoteSoundEffectTrack.SE2,
    FlipnoteSoundEffectTrack.SE3,
    FlipnoteSoundEffectTrack.SE4,
];
/** Global animation frame color palette */
KwzParser.globalPalette = [
    KWZ_PALETTE.WHITE,
    KWZ_PALETTE.BLACK,
    KWZ_PALETTE.RED,
    KWZ_PALETTE.YELLOW,
    KWZ_PALETTE.GREEN,
    KWZ_PALETTE.BLUE,
    KWZ_PALETTE.NONE,
];
/** Public key used for Flipnote verification, in PEM format */
KwzParser.publicKey = KWZ_PUBLIC_KEY;

export { KwzParser };
