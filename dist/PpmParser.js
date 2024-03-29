/*!!
flipnote.js v5.11.0
https://flipnote.js.org
A JavaScript library for parsing, converting, and in-browser playback of the proprietary animation formats used by Nintendo's Flipnote Studio and Flipnote Studio 3D apps.
2018 - 2022 James Daniel
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
PPM_FSID_SPECIAL_CASE.map(id => convertPpmFsidToKwzFsidSuffix(id));
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
        this[Symbol.toStringTag] = 'Flipnote';
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
    *[Symbol.iterator]() {
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

/**
 * PPM framerates in frames per second, indexed by the in-app frame speed.
 * Frame speed 0 is never normally used
 */
const PPM_FRAMERATES = [0.5, 0.5, 1, 2, 4, 6, 12, 20, 30];
/**
 * PPM frame color defines (red, green, blue, alpha)
 */
const PPM_PALETTE = {
    WHITE: [0xff, 0xff, 0xff, 0xff],
    BLACK: [0x0e, 0x0e, 0x0e, 0xff],
    RED: [0xff, 0x2a, 0x2a, 0xff],
    BLUE: [0x0a, 0x39, 0xff, 0xff]
};
/**
 * @internal
 * PPM thumbnail color defines (in ABGR order)
 */
const PPM_THUMB_PALETTE = [
    0xFFFFFFFF,
    0xFF525252,
    0xFFFFFFFF,
    0xFF9C9C9C,
    0xFF4448FF,
    0xFF4F51C8,
    0xFFACADFF,
    0xFF00FF00,
    0xFFFF4048,
    0xFFB84F51,
    0xFFFFABAD,
    0xFF00FF00,
    0xFFB757B6,
    0xFF00FF00,
    0xFF00FF00,
    0xFF00FF00,
];
/**
 * RSA public key used to verify that the PPM file signature is genuine.
 *
 * This **cannot** be used to resign Flipnotes, it can only verify that they are valid
 */
const PPM_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDCPLwTL6oSflv+gjywi/sM0TUB
90xqOvuCpjduETjPoN2FwMebxNjdKIqHUyDu4AvrQ6BDJc6gKUbZ1E27BGZoCPH4
9zQRb+zAM6M9EjHwQ6BABr0u2TcF7xGg2uQ9MBWz9AfbVQ91NjfrNWo0f7UPmffv
1VvixmTk1BCtavZxBwIDAQAB
-----END PUBLIC KEY-----`;
/**
 * Parser class for (DSiWare) Flipnote Studio's PPM animation format.
 *
 * Format docs: https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format
 * @category File Parser
 */
class PpmParser extends FlipnoteParserBase {
    /**
     * Create a new PPM file parser instance
     * @param arrayBuffer an ArrayBuffer containing file data
     * @param settings parser settings (none currently implemented)
     */
    constructor(arrayBuffer, settings = {}) {
        super(arrayBuffer);
        /** File format type, reflects {@link PpmParser.format} */
        this.format = FlipnoteFormat.PPM;
        /** Custom object tag */
        this[Symbol.toStringTag] = 'Flipnote Studio PPM animation file';
        /** Animation frame width, reflects {@link PpmParser.width} */
        this.imageWidth = PpmParser.width;
        /** Animation frame height, reflects {@link PpmParser.height} */
        this.imageHeight = PpmParser.height;
        /** Animation frame aspect ratio, reflects {@link PpmParser.aspect} */
        this.aspect = PpmParser.aspect;
        /** X offset for the top-left corner of the animation frame */
        this.imageOffsetX = 0;
        /** Y offset for the top-left corner of the animation frame */
        this.imageOffsetY = 0;
        /** Number of animation frame layers, reflects {@link PpmParser.numLayers} */
        this.numLayers = PpmParser.numLayers;
        /** Number of colors per layer (aside from transparent), reflects {@link PpmParser.numLayerColors} */
        this.numLayerColors = PpmParser.numLayerColors;
        /** key used for Flipnote verification, in PEM format */
        this.publicKey = PpmParser.publicKey;
        /** @internal */
        this.srcWidth = PpmParser.width;
        /** Which audio tracks are available in this format, reflects {@link PpmParser.audioTracks} */
        this.audioTracks = PpmParser.audioTracks;
        /** Which sound effect tracks are available in this format, reflects {@link PpmParser.soundEffectTracks} */
        this.soundEffectTracks = PpmParser.soundEffectTracks;
        /** Audio track base sample rate, reflects {@link PpmParser.rawSampleRate} */
        this.rawSampleRate = PpmParser.rawSampleRate;
        /** Audio output sample rate, reflects {@link PpmParser.sampleRate} */
        this.sampleRate = PpmParser.sampleRate;
        /** Global animation frame color palette, reflects {@link PpmParser.globalPalette} */
        this.globalPalette = PpmParser.globalPalette;
        this.prevDecodedFrame = null;
        this.decodeHeader();
        this.decodeAnimationHeader();
        this.decodeSoundHeader();
        // this is always true afaik, it's likely just a remnant from development
        // doesn't hurt to be accurate though...
        if (((this.version >> 4) & 0xf) !== 0) {
            this.decodeMeta();
        }
        // create image buffers
        this.layerBuffers = [
            new Uint8Array(PpmParser.width * PpmParser.height),
            new Uint8Array(PpmParser.width * PpmParser.height)
        ];
        this.prevLayerBuffers = [
            new Uint8Array(PpmParser.width * PpmParser.height),
            new Uint8Array(PpmParser.width * PpmParser.height)
        ];
        this.lineEncodingBuffers = [
            new Uint8Array(PpmParser.height),
            new Uint8Array(PpmParser.height)
        ];
        this.prevDecodedFrame = null;
    }
    decodeHeader() {
        assert(16 < this.byteLength);
        this.seek(4);
        // decode header
        // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#header
        this.frameDataLength = this.readUint32();
        this.soundDataLength = this.readUint32();
        this.frameCount = this.readUint16() + 1;
        this.version = this.readUint16();
        // sound data offset = frame data offset + frame data length + sound effect flags
        let soundDataOffset = 0x06A0 + this.frameDataLength + this.frameCount;
        if (soundDataOffset % 4 !== 0)
            soundDataOffset += 4 - (soundDataOffset % 4);
        assert(soundDataOffset < this.byteLength);
        this.soundDataOffset = soundDataOffset;
    }
    readFilename() {
        const mac = this.readHex(3);
        const random = this.readChars(13);
        const edits = this.readUint16().toString().padStart(3, '0');
        return `${mac}_${random}_${edits}`;
    }
    decodeMeta() {
        // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#metadata
        assert(0x06A8 < this.byteLength);
        this.seek(0x10);
        const lock = this.readUint16();
        const thumbIndex = this.readInt16();
        const rootAuthorName = this.readWideChars(11);
        const parentAuthorName = this.readWideChars(11);
        const currentAuthorName = this.readWideChars(11);
        const parentAuthorId = this.readHex(8, true);
        const currentAuthorId = this.readHex(8, true);
        const parentFilename = this.readFilename();
        const currentFilename = this.readFilename();
        const rootAuthorId = this.readHex(8, true);
        this.seek(0x9A);
        const timestamp = dateFromNintendoTimestamp(this.readInt32());
        this.seek(0x06A6);
        const flags = this.readUint16();
        this.thumbFrameIndex = thumbIndex;
        this.layerVisibility = {
            1: (flags & 0x10) === 0,
            2: (flags & 0x20) === 0,
            3: false
        };
        this.isSpinoff = (currentAuthorId !== parentAuthorId) || (currentAuthorId !== rootAuthorId);
        this.meta = {
            lock: lock === 1,
            loop: (flags >> 1 & 0x1) === 1,
            isSpinoff: this.isSpinoff,
            frameCount: this.frameCount,
            frameSpeed: this.frameSpeed,
            bgmSpeed: this.bgmSpeed,
            duration: this.duration,
            thumbIndex: thumbIndex,
            timestamp: timestamp,
            root: {
                username: rootAuthorName,
                fsid: rootAuthorId,
                region: getPpmFsidRegion(rootAuthorId),
                filename: null
            },
            parent: {
                username: parentAuthorName,
                fsid: parentAuthorId,
                region: getPpmFsidRegion(parentAuthorId),
                filename: parentFilename
            },
            current: {
                username: currentAuthorName,
                fsid: currentAuthorId,
                region: getPpmFsidRegion(currentAuthorId),
                filename: currentFilename
            },
        };
    }
    decodeAnimationHeader() {
        // jump to the start of the animation data section
        // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#animation-header
        this.seek(0x06A0);
        const offsetTableLength = this.readUint16();
        const numOffsets = offsetTableLength / 4;
        assert(numOffsets <= this.frameCount);
        // skip padding + flags
        this.seek(0x06A8);
        // read frame offsets and build them into a table
        const frameOffsets = new Uint32Array(numOffsets);
        for (let n = 0; n < numOffsets; n++) {
            const ptr = 0x06A8 + offsetTableLength + this.readUint32();
            assert(ptr < this.byteLength, `Frame ${n} pointer is out of bounds`);
            frameOffsets[n] = ptr;
        }
        this.frameOffsets = frameOffsets;
    }
    decodeSoundHeader() {
        // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#sound-header
        let ptr = this.soundDataOffset;
        this.seek(ptr);
        const bgmLen = this.readUint32();
        const se1Len = this.readUint32();
        const se2Len = this.readUint32();
        const se3Len = this.readUint32();
        this.frameSpeed = 8 - this.readUint8();
        this.bgmSpeed = 8 - this.readUint8();
        assert(this.frameSpeed <= 8 && this.bgmSpeed <= 8);
        ptr += 32;
        this.framerate = PPM_FRAMERATES[this.frameSpeed];
        this.duration = timeGetNoteDuration(this.frameCount, this.framerate);
        this.bgmrate = PPM_FRAMERATES[this.bgmSpeed];
        const soundMeta = new Map();
        soundMeta.set(FlipnoteAudioTrack.BGM, { ptr: ptr, length: bgmLen });
        soundMeta.set(FlipnoteAudioTrack.SE1, { ptr: ptr += bgmLen, length: se1Len });
        soundMeta.set(FlipnoteAudioTrack.SE2, { ptr: ptr += se1Len, length: se2Len });
        soundMeta.set(FlipnoteAudioTrack.SE3, { ptr: ptr += se2Len, length: se3Len });
        this.soundMeta = soundMeta;
    }
    isKeyFrame(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        this.seek(this.frameOffsets[frameIndex]);
        const header = this.readUint8();
        return (header >> 7) & 0x1;
    }
    /**
     * Decodes the thumbnail image embedded in the Flipnote. Will return a {@link FlipnoteThumbImage} containing raw RGBA data.
     *
     * Note: For most purposes, you should probably just decode the thumbnail frame to get a higher resolution image.
     * @category Meta
     */
    getThumbnailImage() {
        this.seek(0xA0);
        const data = this.readBytes(1536);
        const pixels = new Uint32Array(64 * 48);
        let ptr = 0;
        for (let tileY = 0; tileY < 48; tileY += 8) {
            for (let tileX = 0; tileX < 64; tileX += 8) {
                for (let line = 0; line < 8; line += 1) {
                    for (let pixel = 0; pixel < 8; pixel += 2) {
                        const x = tileX + pixel;
                        const y = tileY + line;
                        pixels[y * 64 + x] = PPM_THUMB_PALETTE[data[ptr] & 0xF];
                        pixels[y * 64 + x + 1] = PPM_THUMB_PALETTE[(data[ptr] << 4) & 0xF];
                    }
                }
            }
        }
        return {
            format: FlipnoteThumbImageFormat.Rgba,
            width: 64,
            height: 48,
            data: pixels.buffer
        };
    }
    /**
     * Decode a frame, returning the raw pixel buffers for each layer
     * @category Image
    */
    decodeFrame(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        // return existing layer buffers if no new frame has been decoded since the last call
        if (this.prevDecodedFrame === frameIndex)
            return this.layerBuffers;
        // if necessary, decode previous frames until a keyframe is reached
        if (this.prevDecodedFrame !== frameIndex - 1 && (!this.isKeyFrame(frameIndex)) && frameIndex !== 0)
            this.decodeFrame(frameIndex - 1);
        this.prevDecodedFrame = frameIndex;
        // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#animation-data
        this.seek(this.frameOffsets[frameIndex]);
        const header = this.readUint8();
        const isKeyFrame = (header >> 7) & 0x1;
        const isTranslated = (header >> 5) & 0x3;
        // reset current layer buffers
        this.layerBuffers[0].fill(0);
        this.layerBuffers[1].fill(0);
        let translateX = 0;
        let translateY = 0;
        if (isTranslated) {
            translateX = this.readInt8();
            translateY = this.readInt8();
        }
        // unpack line encodings for each layer
        for (let layerIndex = 0; layerIndex < 2; layerIndex++) {
            const lineEncodingBuffer = this.lineEncodingBuffers[layerIndex];
            lineEncodingBuffer.fill(0);
            for (let ptr = 0; ptr < lineEncodingBuffer.length;) {
                let byte = this.readUint8();
                // the 4 lines in this byte are all empty (type 0) - skip
                if (byte === 0) {
                    ptr += 4;
                    continue;
                }
                // unpack 4 line types from the current byte
                lineEncodingBuffer[ptr++] = byte & 0x03;
                lineEncodingBuffer[ptr++] = (byte >> 2) & 0x03;
                lineEncodingBuffer[ptr++] = (byte >> 4) & 0x03;
                lineEncodingBuffer[ptr++] = (byte >> 6) & 0x03;
            }
        }
        // unpack layer bitmaps
        for (let layerIndex = 0; layerIndex < 2; layerIndex++) {
            const pixelBuffer = this.layerBuffers[layerIndex];
            const lineEncodingBuffer = this.lineEncodingBuffers[layerIndex];
            for (let y = 0; y < PpmParser.height; y++) {
                let pixelBufferPtr = y * PpmParser.width;
                const lineType = lineEncodingBuffer[y];
                switch (lineType) {
                    // line type 0 = blank line, decode nothing
                    case 0:
                        break;
                    // line type 1 = compressed bitmap line
                    case 1:
                        // read lineHeader as a big-endian int
                        var lineHeader = this.readUint32(false);
                        // loop through each bit in the line header
                        // shift lineheader to the left by 1 bit every interation, 
                        // so on the next loop cycle the next bit will be checked
                        // and if the line header equals 0, no more bits are set, 
                        // the rest of the line is empty and can be skipped
                        for (; lineHeader !== 0; lineHeader <<= 1, pixelBufferPtr += 8) {
                            // if the bit is set, this 8-pix wide chunk is stored
                            // else we can just leave it blank and move on to the next chunk
                            if (lineHeader & 0x80000000) {
                                let chunk = this.readUint8();
                                // unpack chunk bits
                                // the chunk if shifted right 1 bit on every loop
                                // if the chunk equals 0, no more bits are set, 
                                // so the rest of the chunk is empty and can be skipped
                                for (let pixel = 0; chunk !== 0; pixel++, chunk >>= 1)
                                    pixelBuffer[pixelBufferPtr + pixel] = chunk & 0x1;
                            }
                        }
                        break;
                    // line type 2 = compressed bitmap line like type 1, but all pixels are set to 1 first
                    case 2:
                        // line type 2 starts as an inverted line
                        pixelBuffer.fill(1, pixelBufferPtr, pixelBufferPtr + PpmParser.width);
                        // read lineHeader as a big-endian int
                        var lineHeader = this.readUint32(false);
                        // loop through each bit in the line header
                        // shift lineheader to the left by 1 bit every iteration, 
                        // so on the next loop cycle the next bit will be checked
                        // and if the line header equals 0, no more bits are set, 
                        // the rest of the line is empty and can be skipped
                        for (; lineHeader !== 0; lineHeader <<= 1, pixelBufferPtr += 8) {
                            // if the bit is set, this 8-pix wide chunk is stored
                            // else we can just leave it blank and move on to the next chunk
                            if (lineHeader & 0x80000000) {
                                let chunk = this.readUint8();
                                // unpack chunk bits
                                for (let pixel = 0; pixel < 8; pixel++, chunk >>= 1)
                                    pixelBuffer[pixelBufferPtr + pixel] = chunk & 0x1;
                            }
                        }
                        break;
                    // line type 3 = raw bitmap line
                    case 3:
                        for (let chunk = 0, i = 0; i < PpmParser.width; i++) {
                            if (i % 8 === 0)
                                chunk = this.readUint8();
                            pixelBuffer[pixelBufferPtr++] = chunk & 0x1;
                            chunk >>= 1;
                        }
                        break;
                }
            }
        }
        // if the current frame is based on changes from the previous one, merge them by XORing their values
        const layer1 = this.layerBuffers[0];
        const layer2 = this.layerBuffers[1];
        const layer1Prev = this.prevLayerBuffers[0];
        const layer2Prev = this.prevLayerBuffers[1];
        // fast diffing if the frame isn't translated
        if (!isKeyFrame && translateX === 0 && translateY === 0) {
            const size = PpmParser.height * PpmParser.width;
            for (let i = 0; i < size; i++) {
                layer1[i] ^= layer1Prev[i];
                layer2[i] ^= layer2Prev[i];
            }
        }
        // slower diffing if the frame is translated
        else if (!isKeyFrame) {
            const w = PpmParser.width;
            const h = PpmParser.height;
            const startX = Math.max(translateX, 0);
            const startY = Math.max(translateY, 0);
            const endX = Math.min(w + translateX, w);
            const endY = Math.min(h + translateY, h);
            const shift = translateY * w + translateX;
            let dest, src;
            // loop through each line
            for (let y = startY; y < endY; y++) {
                // loop through each pixel in the line
                for (let x = startX; x < endX; x++) {
                    dest = y * w + x;
                    src = dest - shift;
                    // diff pixels with a binary XOR
                    layer1[dest] ^= layer1Prev[src];
                    layer2[dest] ^= layer2Prev[src];
                }
            }
        }
        // copy the current layer buffers to the previous ones
        this.prevLayerBuffers[0].set(this.layerBuffers[0]);
        this.prevLayerBuffers[1].set(this.layerBuffers[1]);
        return this.layerBuffers;
    }
    /**
     * Get the color palette indices for a given frame. RGBA colors for these values can be indexed from {@link PpmParser.globalPalette}
     *
     * Returns an array where:
     *  - index 0 is the paper color index
     *  - index 1 is the layer 1 color index
     *  - index 2 is the layer 2 color index
     * @category Image
    */
    getFramePaletteIndices(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
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
    /**
     * Get the RGBA colors for a given frame
     *
     * Returns an array where:
     *  - index 0 is the paper color
     *  - index 1 is the layer 1 color
     *  - index 2 is the layer 2 color
     * @category Image
     */
    getFramePalette(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        const indices = this.getFramePaletteIndices(frameIndex);
        return indices.map(colorIndex => this.globalPalette[colorIndex]);
    }
    /**
     * Determines if a given frame is a video key frame or not. This returns an array of booleans for each layer, since in the KWZ format, keyframe encoding is done on a per-layer basis.
     * @param frameIndex
     * @category Image
    */
    getIsKeyFrame(frameIndex) {
        const flag = this.isKeyFrame(frameIndex) === 1;
        return [flag, flag];
    }
    /**
     * Get the 3D depths for each layer in a given frame. The PPM format doesn't actually store this information, so `0` is returned for both layers. This method is only here for consistency with KWZ.
     * @param frameIndex
     * @category Image
    */
    getFrameLayerDepths(frameIndex) {
        return [0, 0];
    }
    /**
     * Get the FSID for a given frame's original author. The PPM format doesn't actually store this information, so the current author FSID is returned. This method is only here for consistency with KWZ.
     * @param frameIndex
     * @category Meta
    */
    getFrameAuthor(frameIndex) {
        return this.meta.current.fsid;
    }
    /**
     * Get the camera flags for a given frame. The PPM format doesn't actually store this information so `false` will be returned for both layers. This method is only here for consistency with KWZ.
     * @category Image
     * @returns Array of booleans, indicating whether each layer uses a photo or not
    */
    getFrameCameraFlags(frameIndex) {
        return [false, false];
    }
    /**
     * Get the layer draw order for a given frame
     * @category Image
     * @returns Array of layer indices, in the order they should be drawn
    */
    getFrameLayerOrder(frameIndex) {
        return [1, 0];
    }
    /**
     * Get the sound effect flags for every frame in the Flipnote
     * @category Audio
    */
    decodeSoundFlags() {
        if (this.soundFlags !== undefined)
            return this.soundFlags;
        assert(0x06A0 + this.frameDataLength < this.byteLength);
        // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#sound-effect-flags
        this.seek(0x06A0 + this.frameDataLength);
        const numFlags = this.frameCount;
        const flags = this.readBytes(numFlags);
        this.soundFlags = new Array(numFlags);
        for (let i = 0; i < numFlags; i++) {
            const byte = flags[i];
            this.soundFlags[i] = [
                (byte & 0x1) !== 0,
                (byte & 0x2) !== 0,
                (byte & 0x4) !== 0,
            ];
        }
        return this.soundFlags;
    }
    /**
     * Get the sound effect usage flags for every frame
     * @category Audio
     */
    getSoundEffectFlags() {
        return this.decodeSoundFlags().map(frameFlags => ({
            [FlipnoteSoundEffectTrack.SE1]: frameFlags[0],
            [FlipnoteSoundEffectTrack.SE2]: frameFlags[1],
            [FlipnoteSoundEffectTrack.SE3]: frameFlags[2]
        }));
    }
    /**
     * Get the sound effect usage flags for a given frame
     * @category Audio
     */
    getFrameSoundEffectFlags(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        this.seek(0x06A0 + this.frameDataLength + frameIndex);
        const byte = this.readUint8();
        return {
            [FlipnoteSoundEffectTrack.SE1]: (byte & 0x1) !== 0,
            [FlipnoteSoundEffectTrack.SE2]: (byte & 0x2) !== 0,
            [FlipnoteSoundEffectTrack.SE3]: (byte & 0x4) !== 0
        };
    }
    /**
     * Get the raw compressed audio data for a given track
     * @returns byte array
     * @category Audio
    */
    getAudioTrackRaw(trackId) {
        const trackMeta = this.soundMeta.get(trackId);
        assert(trackMeta.ptr + trackMeta.length < this.byteLength);
        this.seek(trackMeta.ptr);
        return this.readBytes(trackMeta.length);
    }
    /**
     * Get the decoded audio data for a given track, using the track's native samplerate
     * @returns Signed 16-bit PCM audio
     * @category Audio
    */
    decodeAudioTrack(trackId) {
        // note this doesn't resample
        // decode a 4 bit IMA adpcm audio track
        // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#sound-data
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
            // switch between high and low nibble each loop iteration
            // increments srcPtr after every high nibble
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
            return pcmResampleNearestNeighbour(srcPcm, srcFreq, dstFreq);
        return srcPcm;
    }
    pcmAudioMix(src, dst, dstOffset = 0) {
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
        // Mix background music
        if (hasBgm) {
            const bgmPcm = this.getAudioTrackPcm(FlipnoteAudioTrack.BGM, dstFreq);
            this.pcmAudioMix(bgmPcm, master, 0);
        }
        // Mix sound effects
        if (hasSe1 || hasSe2 || hasSe3) {
            const samplesPerFrame = dstFreq / this.framerate;
            const se1Pcm = hasSe1 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE1, dstFreq) : null;
            const se2Pcm = hasSe2 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE2, dstFreq) : null;
            const se3Pcm = hasSe3 ? this.getAudioTrackPcm(FlipnoteAudioTrack.SE3, dstFreq) : null;
            const seFlags = this.decodeSoundFlags();
            for (let frame = 0; frame < this.frameCount; frame++) {
                const seOffset = Math.ceil(frame * samplesPerFrame);
                const flag = seFlags[frame];
                if (hasSe1 && flag[0])
                    this.pcmAudioMix(se1Pcm, master, seOffset);
                if (hasSe2 && flag[1])
                    this.pcmAudioMix(se2Pcm, master, seOffset);
                if (hasSe3 && flag[2])
                    this.pcmAudioMix(se3Pcm, master, seOffset);
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
        const bodyEnd = this.soundDataOffset + this.soundDataLength + 32;
        return this.bytes.subarray(0, bodyEnd);
    }
    /**
    * Get the Flipnote's signature data
    * @category Verification
    */
    getSignature() {
        const bodyEnd = this.soundDataOffset + this.soundDataLength + 32;
        return this.bytes.subarray(bodyEnd, bodyEnd + 128);
    }
    /**
     * Verify whether this Flipnote's signature is valid
     * @category Verification
     */
    async verify() {
        const key = await rsaLoadPublicKey(PPM_PUBLIC_KEY, 'SHA-1');
        return await rsaVerify(key, this.getSignature(), this.getBody());
    }
}
/** Default PPM parser settings */
PpmParser.defaultSettings = {};
/** File format type */
PpmParser.format = FlipnoteFormat.PPM;
/** Animation frame width */
PpmParser.width = 256;
/** Animation frame height */
PpmParser.height = 192;
/** Animation frame aspect ratio */
PpmParser.aspect = 3 / 4;
/** Number of animation frame layers */
PpmParser.numLayers = 2;
/** Number of colors per layer (aside from transparent) */
PpmParser.numLayerColors = 1;
/** Audio track base sample rate */
PpmParser.rawSampleRate = 8192;
/** Nintendo DSi audio output rate */
PpmParser.sampleRate = 32768;
/** Which audio tracks are available in this format */
PpmParser.audioTracks = [
    FlipnoteAudioTrack.BGM,
    FlipnoteAudioTrack.SE1,
    FlipnoteAudioTrack.SE2,
    FlipnoteAudioTrack.SE3
];
/** Which sound effect tracks are available in this format */
PpmParser.soundEffectTracks = [
    FlipnoteSoundEffectTrack.SE1,
    FlipnoteSoundEffectTrack.SE2,
    FlipnoteSoundEffectTrack.SE3,
];
/** Global animation frame color palette */
PpmParser.globalPalette = [
    PPM_PALETTE.WHITE,
    PPM_PALETTE.BLACK,
    PPM_PALETTE.RED,
    PPM_PALETTE.BLUE
];
/** Public key used for Flipnote verification, in PEM format */
PpmParser.publicKey = PPM_PUBLIC_KEY;

export { PpmParser };
