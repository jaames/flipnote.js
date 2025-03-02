/*!!
 * flipnote.js v6.1.1
 * https://flipnote.js.org
 * A JavaScript library for Flipnote Studio animation files
 * 2018 - 2025 James Daniel
 * Flipnote Studio is (c) Nintendo Co., Ltd. This project isn't affiliated with or endorsed by them in any way.
*/
'use strict';

/**
 * Flipnote region
 */
exports.FlipnoteRegion = void 0;
(function (FlipnoteRegion) {
    /**
     * Europe and Oceania
     */
    FlipnoteRegion["EUR"] = "EUR";
    /**
     * Americas
     */
    FlipnoteRegion["USA"] = "USA";
    /**
     * Japan
     */
    FlipnoteRegion["JPN"] = "JPN";
    /**
     * Unidentified (possibly never used)
     */
    FlipnoteRegion["UNKNOWN"] = "UNKNOWN";
})(exports.FlipnoteRegion || (exports.FlipnoteRegion = {}));
/**
 * Identifies which animation format a Flipnote uses
 */
exports.FlipnoteFormat = void 0;
(function (FlipnoteFormat) {
    /**
     * Animation format used by Flipnote Studio (Nintendo DSiWare)
     */
    FlipnoteFormat["PPM"] = "PPM";
    /**
     * Animation format used by Flipnote Studio 3D (Nintendo 3DS)
     */
    FlipnoteFormat["KWZ"] = "KWZ";
})(exports.FlipnoteFormat || (exports.FlipnoteFormat = {}));
/**
 * Buffer format for a FlipnoteThumbImage
 */
exports.FlipnoteThumbImageFormat = void 0;
(function (FlipnoteThumbImageFormat) {
    FlipnoteThumbImageFormat[FlipnoteThumbImageFormat["Jpeg"] = 0] = "Jpeg";
    FlipnoteThumbImageFormat[FlipnoteThumbImageFormat["Rgba"] = 1] = "Rgba";
})(exports.FlipnoteThumbImageFormat || (exports.FlipnoteThumbImageFormat = {}));
/**
 * stereoscopic eye view (left/right) for 3D effects
 */
exports.FlipnoteStereoscopicEye = void 0;
(function (FlipnoteStereoscopicEye) {
    FlipnoteStereoscopicEye[FlipnoteStereoscopicEye["Left"] = 0] = "Left";
    FlipnoteStereoscopicEye[FlipnoteStereoscopicEye["Right"] = 1] = "Right";
})(exports.FlipnoteStereoscopicEye || (exports.FlipnoteStereoscopicEye = {}));
/**
 * Identifies a Flipnote audio track type
 */
exports.FlipnoteAudioTrack = void 0;
(function (FlipnoteAudioTrack) {
    /**
     * Background music track
     */
    FlipnoteAudioTrack[FlipnoteAudioTrack["BGM"] = 0] = "BGM";
    /**
     * Sound effect 1 track
     */
    FlipnoteAudioTrack[FlipnoteAudioTrack["SE1"] = 1] = "SE1";
    /**
     * Sound effect 2 track
     */
    FlipnoteAudioTrack[FlipnoteAudioTrack["SE2"] = 2] = "SE2";
    /**
     * Sound effect 3 track
     */
    FlipnoteAudioTrack[FlipnoteAudioTrack["SE3"] = 3] = "SE3";
    /**
     * Sound effect 4 track (only used by KWZ files)
     */
    FlipnoteAudioTrack[FlipnoteAudioTrack["SE4"] = 4] = "SE4";
})(exports.FlipnoteAudioTrack || (exports.FlipnoteAudioTrack = {}));
/**
 * {@link FlipnoteAudioTrack}, but just sound effect tracks
 */
exports.FlipnoteSoundEffectTrack = void 0;
(function (FlipnoteSoundEffectTrack) {
    FlipnoteSoundEffectTrack[FlipnoteSoundEffectTrack["SE1"] = 1] = "SE1";
    FlipnoteSoundEffectTrack[FlipnoteSoundEffectTrack["SE2"] = 2] = "SE2";
    FlipnoteSoundEffectTrack[FlipnoteSoundEffectTrack["SE3"] = 3] = "SE3";
    FlipnoteSoundEffectTrack[FlipnoteSoundEffectTrack["SE4"] = 4] = "SE4";
})(exports.FlipnoteSoundEffectTrack || (exports.FlipnoteSoundEffectTrack = {}));

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @internal
 */
class ByteArray {
    constructor() {
        /**
         * @internal
         */
        this.pageSize = 2048 * 2;
        /**
         * Allocated size counting all pages.
         * @internal
         */
        this.allocSize = 0;
        /**
         * Number of bytes actually used.
         * @internal
         */
        this.realSize = 0;
        /**
         * @internal
         */
        this.pages = [];
        /**
         * @internal
         */
        this.numPages = 0;
        /**
         * Page to write to.
         * @internal
         */
        this.pageIdx = 0;
        /**
         * Position in page to write to.
         * @internal
         */
        this.pagePtr = 0; // 
        /**
         * Position in file.
         * @internal
         */
        this.realPtr = 0;
        this.newPage();
    }
    /**
     * @internal
     */
    set pointer(ptr) {
        this.setPointer(ptr);
    }
    /**
     * @internal
     */
    get pointer() {
        return this.realPtr;
    }
    /**
     * @internal
     */
    newPage() {
        this.pages[this.numPages] = new Uint8Array(this.pageSize);
        this.numPages = this.pages.length;
        this.allocSize = this.numPages * this.pageSize;
    }
    /**
     * @internal
     */
    setPointer(ptr) {
        // allocate enough pages to include pointer
        while (ptr >= this.allocSize) {
            this.newPage();
        }
        // increase real file size if the end is reached
        if (ptr > this.realSize)
            this.realSize = ptr;
        // update ptrs
        this.pageIdx = Math.floor(ptr / this.pageSize);
        this.pagePtr = ptr % this.pageSize;
        this.realPtr = ptr;
    }
    /**
     * @internal
     */
    writeByte(value) {
        this.pages[this.pageIdx][this.pagePtr] = value;
        this.setPointer(this.realPtr + 1);
    }
    /**
     * @internal
     */
    writeBytes(bytes, srcPtr, length) {
        for (let l = length || bytes.length, i = srcPtr || 0; i < l; i++)
            this.writeByte(bytes[i]);
    }
    /**
     * @internal
     */
    writeChars(str) {
        for (let i = 0; i < str.length; i++) {
            this.writeByte(str.charCodeAt(i));
        }
    }
    /**
     * @internal
     */
    writeU8(value) {
        this.writeByte(value & 0xFF);
    }
    /**
     * @internal
     */
    writeU16(value) {
        this.writeByte((value >>> 0) & 0xFF);
        this.writeByte((value >>> 8) & 0xFF);
    }
    /**
     * @internal
     */
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
 * @internal
 */
const hexFromBytes = (bytes, reverse = false) => {
    let hex = [];
    for (let i = 0; i < bytes.length; i++)
        hex.push(bytes[i].toString(16).padStart(2, '0'));
    if (reverse)
        hex.reverse();
    return hex.join('');
};
/**
 * @internal
 */
const hexToBytes = (hex, reverse = false) => {
    const hexSize = hex.length;
    const bytes = new Uint8Array(hexSize / 2);
    for (let i = 0, j = 0; i < hexSize; i += 2)
        bytes[j++] = parseInt(hex.slice(i, i + 2), 16);
    if (reverse)
        bytes.reverse();
    return bytes;
};

/**
 * Wrapper around the DataView API to keep track of the offset into the data,
 * also provides some utils for reading ascii strings etc.
 * @internal
 */
class DataStream {
    constructor(buffer) {
        this.buffer = buffer;
        this.data = new DataView(buffer);
        this.pointer = 0;
    }
    /**
     * Returns the data as an Uint8Array of bytes.
     */
    get bytes() {
        return new Uint8Array(this.buffer);
    }
    /**
     * Returns the total number of bytes in the data.
     */
    get numBytes() {
        return this.data.byteLength;
    }
    /**
     * @internal
     */
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
    /**
     * @internal
     */
    readUint8() {
        const val = this.data.getUint8(this.pointer);
        this.pointer += 1;
        return val;
    }
    /**
     * @internal
     */
    writeUint8(value) {
        this.data.setUint8(this.pointer, value);
        this.pointer += 1;
    }
    /**
     * @internal
     */
    readInt8() {
        const val = this.data.getInt8(this.pointer);
        this.pointer += 1;
        return val;
    }
    /**
     * @internal
     */
    writeInt8(value) {
        this.data.setInt8(this.pointer, value);
        this.pointer += 1;
    }
    /**
     * @internal
     */
    readUint16(littleEndian = true) {
        const val = this.data.getUint16(this.pointer, littleEndian);
        this.pointer += 2;
        return val;
    }
    /**
     * @internal
     */
    writeUint16(value, littleEndian = true) {
        this.data.setUint16(this.pointer, value, littleEndian);
        this.pointer += 2;
    }
    /**
     * @internal
     */
    readInt16(littleEndian = true) {
        const val = this.data.getInt16(this.pointer, littleEndian);
        this.pointer += 2;
        return val;
    }
    /**
     * @internal
     */
    writeInt16(value, littleEndian = true) {
        this.data.setInt16(this.pointer, value, littleEndian);
        this.pointer += 2;
    }
    /**
     * @internal
     */
    readUint32(littleEndian = true) {
        const val = this.data.getUint32(this.pointer, littleEndian);
        this.pointer += 4;
        return val;
    }
    /**
     * @internal
     */
    writeUint32(value, littleEndian = true) {
        this.data.setUint32(this.pointer, value, littleEndian);
        this.pointer += 4;
    }
    /**
     * @internal
     */
    readInt32(littleEndian = true) {
        const val = this.data.getInt32(this.pointer, littleEndian);
        this.pointer += 4;
        return val;
    }
    /**
     * @internal
     */
    writeInt32(value, littleEndian = true) {
        this.data.setInt32(this.pointer, value, littleEndian);
        this.pointer += 4;
    }
    /**
     * @internal
     */
    readBytes(count) {
        const bytes = new Uint8Array(this.data.buffer, this.pointer, count);
        this.pointer += bytes.byteLength;
        return bytes;
    }
    /**
     * @internal
     */
    writeBytes(bytes) {
        bytes.forEach((byte) => this.writeUint8(byte));
    }
    /**
     * @internal
     */
    readHex(count, reverse = false) {
        const bytes = this.readBytes(count);
        return hexFromBytes(bytes, reverse);
    }
    /**
     * @internal
     */
    readChar() {
        const char = this.readUint8();
        return String.fromCharCode(char);
    }
    /**
     * @internal
     */
    readWideChar() {
        const char = this.readUint16();
        return String.fromCharCode(char);
    }
    /**
     * @internal
     */
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
    /**
     * @internal
     */
    writeChars(string) {
        for (let i = 0; i < string.length; i++) {
            const char = string.charCodeAt(i);
            this.writeUint8(char);
        }
    }
    /**
     * @internal
     */
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
    end() {
        return this.pointer >= this.data.byteLength;
    }
}

/**
 * Clamp a number n between l and h.
 * @internal
 */
const clamp = (n, l, h) => {
    if (n < l)
        return l;
    if (n > h)
        return h;
    return n;
};
/**
 * Interpolate between a and b - returns a if fac = 0, b if fac = 1, and somewhere between if 0 < fac < 1.
 * @internal
 */
const lerp = (a, b, fac) => a + fac * (b - a);

/**
 * Assert condition is true.
 * @internal
 */
function assert(condition, errMsg = 'Assert failed') {
    if (!condition)
        err(errMsg);
}
/**
 * Assert that a numerical value is between upper and lower bounds.
 * @internal
 */
const assertRange = (value, min, max, name = '') => assert(value >= min && value <= max, `flipnote.js error: ${name || 'value'} ${value} should be between ${min} and ${max}`);
/**
 * Assert condition is true.
 * @internal
 */
const err = (errMsg = 'Assert failed') => {
    throw new Error('flipnote.js error: ' + errMsg);
};

/**
 * Webpack tries to replace inline calls to require() with polyfills,
 * but we don't want that, since we only use require to add extra features in NodeJs environments.
 *
 * Modified from:
 * https://github.com/getsentry/sentry-javascript/blob/bd35d7364191ebed994fb132ff31031117c1823f/packages/utils/src/misc.ts#L9-L11
 * https://github.com/getsentry/sentry-javascript/blob/89bca28994a0eaab9bc784841872b12a1f4a875c/packages/hub/src/hub.ts#L340
 * @internal
 */
const dynamicRequire = (nodeModule, p) => {
    try {
        return nodeModule.require(p);
    }
    catch {
        throw new Error(`Could not require(${p})`);
    }
};
/**
 * Safely get global scope object.
 * @internal
 */
const getGlobalObject = () => {
    return isNode
        ? global
        : typeof window !== 'undefined'
            ? window
            : typeof self !== 'undefined'
                ? self
                : {};
};
/**
 * Utils to find out information about the current code execution environment.
 */
/**
 * Is the code running in a browser environment?
 * @internal
 */
const isBrowser = typeof window !== 'undefined'
    && typeof window.document !== 'undefined';
/**
 * Assert that the current environment should support browser APIs.
 * @internal
 */
const assertBrowserEnv = () => assert(isBrowser, 'This feature is only available in browser environments');
/**
 * Is the code running in a Node environment?
 * @internal
 */
const isNode = typeof process !== 'undefined'
    && process.versions != null
    && process.versions.node != null;
/**
 * Assert that the current environment should support NodeJS APIs.
 * @internal
 */
const assertNodeEnv = () => assert(isNode, 'This feature is only available in NodeJS environments');
// TODO: Deno support?
/**
 * Is the code running in a Web Worker environment?
 * @internal
 */
const isWebWorker = typeof self === 'object'
    && self.constructor
    && self.constructor.name === 'DedicatedWorkerGlobalScope';

/**
 * Gracefully handles a given Promise factory.
 *
 * Example:
 * `const [ error, data ] = await until(() => asyncAction())`
 *
 * @internal
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
 * @internal
 */
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

var _a$2;
/**
 * Base Flipnote parser class
 *
 * This doesn't implement any parsing functionality itself,
 * it just provides a consistent API for every format parser to implement.
 * @group File Parser
*/
class BaseParser extends DataStream {
    constructor() {
        /**
         * Static file format info
         */
        super(...arguments);
        /**
         * Instance file format info
         */
        /**
         * Custom object tag
         */
        this[_a$2] = 'Flipnote';
        /**
         * Default formats used for {@link getTitle}.
         * @group Meta
         */
        this.titleFormats = {
            COMMENT: 'Comment by $USERNAME',
            FLIPNOTE: 'Flipnote by $USERNAME',
            ICON: 'Folder icon'
        };
        /**
         * File audio track info, see {@link FlipnoteAudioTrackInfo}.
         * @group Meta
         */
        this.soundMeta = new Map();
        /**
         * Animation frame global layer visibility.
         * @group Image
         */
        this.layerVisibility = { 1: true, 2: true, 3: true };
        /**
         * (KWZ only) Indicates whether or not this file is a Flipnote Studio 3D folder icon.
         * @group Meta
         */
        this.isFolderIcon = false;
        /**
         * (KWZ only) Indicates whether or not this file is a handwritten comment from Flipnote Gallery World.
         * @group Meta
         */
        this.isComment = false;
        /**
         * (KWZ only) Indicates whether or not this Flipnote is a PPM to KWZ conversion from Flipnote Studio 3D's DSi Library service.
         * @group Meta
         */
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
     * @group Meta
     */
    getTitle(formats = this.titleFormats) {
        if (this.isFolderIcon)
            return formats.ICON;
        const title = this.isComment ? formats.COMMENT : formats.FLIPNOTE;
        return title.replace('$USERNAME', this.meta.current.username);
    }
    /**
     * Returns the Flipnote title when casting a parser instance to a string.
     *
     * ```js
     * const str = 'Title: ' + note;
     * // str === 'Title: Flipnote by username'
     * ```
     * @group Utility
     */
    toString() {
        return this.getTitle();
    }
    /**
     * Allows for frame index iteration when using the parser instance as a for..of iterator.
     *
     * ```js
     * for (const frameIndex of note) {
     *   // do something with frameIndex...
     * }
     * ```
     * @group Utility
     */
    *[(_a$2 = Symbol.toStringTag, Symbol.iterator)]() {
        for (let i = 0; i < this.frameCount; i++)
            yield i;
    }
    /**
     * Get the pixels for a given frame layer, as palette indices
     *
     * :::tip
     * Layer indices are not guaranteed to be sorted by 3D depth in KWZs, use [getFrameLayerOrder](/api/classes/ppmparser/#getframelayerorder) to get the correct sort order first.
     * :::
     *
     * :::tip
     * If the visibility flag for this layer is turned off, the result will be empty
     * :::
     *
     * @group Image
    */
    getLayerPixels(frameIndex, layerIndex, imageBuffer = new Uint8Array(this.imageWidth * this.imageHeight), depthStrength = 0, depthEye = exports.FlipnoteStereoscopicEye.Left) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        assertRange(layerIndex, 0, this.numLayers - 1, 'Layer index');
        // palette
        const palette = this.getFramePaletteIndices(frameIndex);
        const palettePtr = layerIndex * this.numLayerColors;
        // raw pixels
        const layers = this.decodeFrame(frameIndex);
        const layerBuffer = layers[layerIndex];
        const depth = Math.floor(this.getFrameLayerDepths(frameIndex)[layerIndex] * depthStrength);
        const depthShift = ((depthEye == exports.FlipnoteStereoscopicEye.Left) ? -depth : depth);
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
     *
     * :::tip
     * Layer indices are not guaranteed to be sorted by 3D depth in KWZs, use [getFrameLayerOrder](/api/classes/ppmparser/#getframelayerorder) to get the correct sort order first.
     * :::
     *
     * :::tip
     * If the visibility flag for this layer is turned off, the result will be empty
     * :::
     *
     * @group Image
    */
    getLayerPixelsRgba(frameIndex, layerIndex, imageBuffer = new Uint32Array(this.imageWidth * this.imageHeight), paletteBuffer = new Uint32Array(16), depthStrength = 0, depthEye = exports.FlipnoteStereoscopicEye.Left) {
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
        const depthShift = ((depthEye == exports.FlipnoteStereoscopicEye.Left) ? -depth : depth);
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
     * @group Image
    */
    getFramePixels(frameIndex, imageBuffer = new Uint8Array(this.imageWidth * this.imageHeight), depthStrength = 0, depthEye = exports.FlipnoteStereoscopicEye.Left) {
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
            const depthShift = ((depthEye == exports.FlipnoteStereoscopicEye.Left) ? -depth : depth);
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
     * @group Image
     */
    getFramePixelsRgba(frameIndex, imageBuffer = new Uint32Array(this.imageWidth * this.imageHeight), paletteBuffer = new Uint32Array(16), depthStrength = 0, depthEye = exports.FlipnoteStereoscopicEye.Left) {
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
            const depthShift = ((depthEye == exports.FlipnoteStereoscopicEye.Left) ? -depth : depth);
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
     * @group Image
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
     * @group Audio
     */
    getSoundEffectFlagsForTrack(trackId) {
        return this.getSoundEffectFlags().map(flags => flags[trackId]);
    }
    ;
    /**
     * Is a given track used on a given frame
     * @group Audio
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
     * @group Audio
    */
    hasAudioTrack(trackId) {
        return this.soundMeta.has(trackId) && this.soundMeta.get(trackId).length > 0;
    }
}

/**
 * Match an FSID from Flipnote Studio
 * e.g. 1440D700CEF78DA8
 * @internal
 */
const REGEX_PPM_FSID = /^[0159]{1}[0-9A-F]{6}0[0-9A-F]{8}$/;
/**
 * @internal
 * There are several known exceptions to the standard FSID format, all from Nintendo or Hatena developer/event accounts (mario, zelda 25th, etc).
 * This list was compiled from data provided by the Flipnote Archive, so it can be considered comprehensive enough to match any Flipnote you may encounter.
 */
const PPM_FSID_SPECIAL_CASE = [
    '01FACA7A4367FC5F',
    '03D6E959E2F9A42D',
    '03F80445160587FA',
    '04068426E1008915',
    '092A3EC8199FD5D5',
    '0B8D56BA1BD441B8',
    '0E61C75C9B5AD90B',
    '14E494E35A443235'
];
/**
 * Indicates whether the input is a valid Flipnote Studio user ID
 */
const isPpmFsid = (fsid) => REGEX_PPM_FSID.test(fsid) || PPM_FSID_SPECIAL_CASE.includes(fsid);
/**
 * Get the region for any valid Flipnote Studio user ID
 */
const getPpmFsidRegion = (fsid) => {
    switch (fsid.charAt(0)) {
        case '0':
        case '1':
            return exports.FlipnoteRegion.JPN;
        case '5':
            return exports.FlipnoteRegion.USA;
        case '9':
            return exports.FlipnoteRegion.EUR;
        default:
            return exports.FlipnoteRegion.UNKNOWN;
    }
};

/**
 * @internal
 */
const ADPCM_INDEX_TABLE_2BIT = new Int8Array([
    -1, 2, -1, 2
]);
/**
 * @internal
 */
const ADPCM_INDEX_TABLE_4BIT = new Int8Array([
    -1, -1, -1, -1, 2, 4, 6, 8,
    -1, -1, -1, -1, 2, 4, 6, 8
]);
/**
 * @internal
 */
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
 * @internal
 */
const pcmGetSample = (src, srcSize, srcPtr) => {
    if (srcPtr < 0 || srcPtr >= srcSize)
        return 0;
    return src[srcPtr];
};
/**
 * Zero-order hold (nearest neighbour) audio interpolation
 * Credit to SimonTime for the original C version
 * @internal
 */
const pcmResampleNearestNeighbour = (src, srcFreq, dstFreq) => {
    const srcLength = src.length;
    const srcDuration = srcLength / srcFreq;
    const dstLength = srcDuration * dstFreq;
    const dst = new Int16Array(dstLength);
    const adjFreq = srcFreq / dstFreq;
    for (let dstPtr = 0; dstPtr < dstLength; dstPtr++)
        dst[dstPtr] = pcmGetSample(src, srcLength, Math.floor(dstPtr * adjFreq));
    return dst;
};
/**
 * Simple linear audio interpolation
 * @internal
 */
const pcmResampleLinear = (src, srcFreq, dstFreq) => {
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
};
/**
 * Get a ratio of how many audio samples hit the pcm_s16_le clipping bounds
 * This can be used to detect corrupted audio
 * @internal
 */
const pcmGetClippingRatio = (src) => {
    const numSamples = src.length;
    let numClippedSamples = 0;
    for (let i = 0; i < numSamples; i++) {
        const sample = src[i];
        if (sample <= -32768 || sample >= 32767)
            numClippedSamples += 1;
    }
    return numClippedSamples / numSamples;
};
/**
 * Get the root mean square of a PCM track
 * @internal
 */
const pcmGetRms = (src) => {
    const numSamples = src.length;
    let rms = 0;
    for (let i = 0; i < numSamples; i++) {
        rms += Math.pow(src[i], 2);
    }
    return Math.sqrt(rms / numSamples);
};

/**
 * Number of seconds between the UNIX timestamp epoch (jan 1 1970) and the Nintendo timestamp epoch (jan 1 2000).
 * @internal
 */
const NINTENDO_UNIX_EPOCH = 946684800;
/**
 * Convert a Nintendo DS or 3DS timestamp integer to a JS Date object.
 * @internal
 */
const dateFromNintendoTimestamp = (timestamp) => new Date((timestamp + NINTENDO_UNIX_EPOCH) * 1000);
/**
 * Convert a JS Date to a Nintendo timestamp integer.
 */
const dateToNintendoTimestamp = (date) => Math.floor((date.getTime() / 1000) - NINTENDO_UNIX_EPOCH);
/**
 * Get the duration (in seconds) of a number of frames running at a specified framerate.
 * @internal
 */
const timeGetNoteDuration = (frameCount, framerate) => 
// multiply and divide by 100 to get around floating precision issues
((frameCount * 100) * (1 / framerate)) / 100;

/**
 * Same SubtleCrypto API is available in browser and node, but in node it isn't global
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
 * Crypto algo used
 * @internal
 */
const ALGORITHM = 'RSASSA-PKCS1-v1_5';
/**
 * @internal
 */
const rsaLoadPublicKey = async (pemKey, hashType) => {
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
};
/**
 * @internal
 */
const rsaVerify = async (key, signature, data) => await SUBTLE_CRYPTO.verify(ALGORITHM, key, signature, data);

var _PpmParser_instances, _PpmParser_layerBuffers, _PpmParser_soundFlags, _PpmParser_prevLayerBuffers, _PpmParser_lineEncodingBuffers, _PpmParser_prevDecodedFrame, _PpmParser_frameDataLength, _PpmParser_soundDataLength, _PpmParser_soundDataOffset, _PpmParser_frameOffsets, _PpmParser_decodeHeader, _PpmParser_readFilename, _PpmParser_decodeMeta, _PpmParser_decodeAnimationHeader, _PpmParser_decodeSoundHeader, _PpmParser_isKeyFrame, _PpmParser_pcmAudioMix, _a$1;
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
 * @internal
 */
const PPM_FRAME_DATA_MAX_SIZE = 736800;
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
 * Parser class for (DSiWare) Flipnote Studio's PPM animation format. Format docs: https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format
 * @group File Parser
 */
class PpmParser extends BaseParser {
    static matchBuffer(buffer) {
        // check the buffer's magic to identify which format it uses
        const magicBytes = new Uint8Array(buffer.slice(0, 4));
        const magic = (magicBytes[0] << 24) | (magicBytes[1] << 16) | (magicBytes[2] << 8) | magicBytes[3];
        // check if magic is PARA (ppm magic)
        return magic === 0x50415241;
    }
    /**
     * Create a new PPM file parser instance
     * @param arrayBuffer an ArrayBuffer containing file data
     * @param settings parser settings (none currently implemented)
     */
    constructor(arrayBuffer, settings = {}) {
        super(arrayBuffer);
        _PpmParser_instances.add(this);
        /**
         * File format type, reflects {@link PpmParser.format}.
         * @group Meta
         */
        this.format = exports.FlipnoteFormat.PPM;
        /**
         * Custom object tag.
         * @group Utility
         */
        this[_a$1] = 'Flipnote Studio PPM animation file';
        /**
         * Animation frame width, reflects {@link PpmParser.width}.
         * @group Image
         */
        this.imageWidth = PpmParser.width;
        /**
         * Animation frame height, reflects {@link PpmParser.height}.
         * @group Image
         */
        this.imageHeight = PpmParser.height;
        /**
         * Animation frame aspect ratio, reflects {@link PpmParser.aspect}.
         * @group Image
         */
        this.aspect = PpmParser.aspect;
        /**
         * X offset for the top-left corner of the animation frame.
         * @group Image
         */
        this.imageOffsetX = 0;
        /**
         * Y offset for the top-left corner of the animation frame.
         * @group Image
         */
        this.imageOffsetY = 0;
        /**
         * Number of animation frame layers, reflects {@link PpmParser.numLayers}.
         * @group Image
         */
        this.numLayers = PpmParser.numLayers;
        /**
         * Number of colors per layer (aside from transparent), reflects {@link PpmParser.numLayerColors}.
         * @group Image
         */
        this.numLayerColors = PpmParser.numLayerColors;
        /**
         * Key used for Flipnote verification, in PEM format.
         * @group Verification
         */
        this.publicKey = PpmParser.publicKey;
        /**
         * @internal
         * @group Image
         */
        this.srcWidth = PpmParser.width;
        /**
         * Which audio tracks are available in this format, reflects {@link PpmParser.audioTracks}.
         * @group Audio
         */
        this.audioTracks = PpmParser.audioTracks;
        /**
         * Which sound effect tracks are available in this format, reflects {@link PpmParser.soundEffectTracks}.
         * @group Audio
         */
        this.soundEffectTracks = PpmParser.soundEffectTracks;
        /**
         * Audio track base sample rate, reflects {@link PpmParser.rawSampleRate}.
         * @group Audio
         */
        this.rawSampleRate = PpmParser.rawSampleRate;
        /**
         * Audio output sample rate, reflects {@link PpmParser.sampleRate}.
         * @group Audio
         */
        this.sampleRate = PpmParser.sampleRate;
        /**
         * Global animation frame color palette, reflects {@link PpmParser.globalPalette}.
         * @group Image
         */
        this.globalPalette = PpmParser.globalPalette;
        _PpmParser_layerBuffers.set(this, void 0);
        _PpmParser_soundFlags.set(this, void 0);
        _PpmParser_prevLayerBuffers.set(this, void 0);
        _PpmParser_lineEncodingBuffers.set(this, void 0);
        _PpmParser_prevDecodedFrame.set(this, null);
        _PpmParser_frameDataLength.set(this, void 0);
        _PpmParser_soundDataLength.set(this, void 0);
        _PpmParser_soundDataOffset.set(this, void 0);
        _PpmParser_frameOffsets.set(this, void 0);
        __classPrivateFieldGet(this, _PpmParser_instances, "m", _PpmParser_decodeHeader).call(this);
        __classPrivateFieldGet(this, _PpmParser_instances, "m", _PpmParser_decodeAnimationHeader).call(this);
        __classPrivateFieldGet(this, _PpmParser_instances, "m", _PpmParser_decodeSoundHeader).call(this);
        // this is always true afaik, it's likely just a remnant from development
        // doesn't hurt to be accurate though...
        if (((this.version >> 4) & 0xf) !== 0) {
            __classPrivateFieldGet(this, _PpmParser_instances, "m", _PpmParser_decodeMeta).call(this);
        }
        // create image buffers
        __classPrivateFieldSet(this, _PpmParser_layerBuffers, [
            new Uint8Array(PpmParser.width * PpmParser.height),
            new Uint8Array(PpmParser.width * PpmParser.height)
        ], "f");
        __classPrivateFieldSet(this, _PpmParser_prevLayerBuffers, [
            new Uint8Array(PpmParser.width * PpmParser.height),
            new Uint8Array(PpmParser.width * PpmParser.height)
        ], "f");
        __classPrivateFieldSet(this, _PpmParser_lineEncodingBuffers, [
            new Uint8Array(PpmParser.height),
            new Uint8Array(PpmParser.height)
        ], "f");
        __classPrivateFieldSet(this, _PpmParser_prevDecodedFrame, null, "f");
    }
    /**
     * Decodes the thumbnail image embedded in the Flipnote. Will return a {@link FlipnoteThumbImage} containing raw RGBA data.
     *
     * Note: For most purposes, you should probably just decode the thumbnail frame to get a higher resolution image.
     * @group Meta
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
            format: exports.FlipnoteThumbImageFormat.Rgba,
            width: 64,
            height: 48,
            data: pixels.buffer
        };
    }
    /**
     * Get the memory meter level for the Flipnote.
     * This is a value between 0 and 1 indicating how "full" the Flipnote is, based on the size limit of Flipnote Studio.
     *
     * Values will never be below 0, but can be above 1 if the Flipnote is larger than the size limit - it is technically possible to exceed the size limit by one frame.
     *
     * @group Meta
    */
    getMemoryMeterLevel() {
        const level = __classPrivateFieldGet(this, _PpmParser_frameDataLength, "f") / PPM_FRAME_DATA_MAX_SIZE;
        if (level < 0)
            return 0;
        // No upper limit; can technically be exceeded by the size of a single frame
        return level;
    }
    /**
     * Decode a frame, returning the raw pixel buffers for each layer
     * @group Image
    */
    decodeFrame(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        // return existing layer buffers if no new frame has been decoded since the last call
        if (__classPrivateFieldGet(this, _PpmParser_prevDecodedFrame, "f") === frameIndex)
            return __classPrivateFieldGet(this, _PpmParser_layerBuffers, "f");
        // if necessary, decode previous frames until a keyframe is reached
        if (__classPrivateFieldGet(this, _PpmParser_prevDecodedFrame, "f") !== frameIndex - 1 && (!__classPrivateFieldGet(this, _PpmParser_instances, "m", _PpmParser_isKeyFrame).call(this, frameIndex)) && frameIndex !== 0)
            this.decodeFrame(frameIndex - 1);
        __classPrivateFieldSet(this, _PpmParser_prevDecodedFrame, frameIndex, "f");
        // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#animation-data
        this.seek(__classPrivateFieldGet(this, _PpmParser_frameOffsets, "f")[frameIndex]);
        const header = this.readUint8();
        const isKeyFrame = (header >> 7) & 0x1;
        const isTranslated = (header >> 5) & 0x3;
        // reset current layer buffers
        __classPrivateFieldGet(this, _PpmParser_layerBuffers, "f")[0].fill(0);
        __classPrivateFieldGet(this, _PpmParser_layerBuffers, "f")[1].fill(0);
        let translateX = 0;
        let translateY = 0;
        if (isTranslated) {
            translateX = this.readInt8();
            translateY = this.readInt8();
        }
        // unpack line encodings for each layer
        for (let layerIndex = 0; layerIndex < 2; layerIndex++) {
            const lineEncodingBuffer = __classPrivateFieldGet(this, _PpmParser_lineEncodingBuffers, "f")[layerIndex];
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
            const pixelBuffer = __classPrivateFieldGet(this, _PpmParser_layerBuffers, "f")[layerIndex];
            const lineEncodingBuffer = __classPrivateFieldGet(this, _PpmParser_lineEncodingBuffers, "f")[layerIndex];
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
                        // shift line header to the left by 1 bit every iteration, 
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
                        // shift line header to the left by 1 bit every iteration, 
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
        const layer1 = __classPrivateFieldGet(this, _PpmParser_layerBuffers, "f")[0];
        const layer2 = __classPrivateFieldGet(this, _PpmParser_layerBuffers, "f")[1];
        const layer1Prev = __classPrivateFieldGet(this, _PpmParser_prevLayerBuffers, "f")[0];
        const layer2Prev = __classPrivateFieldGet(this, _PpmParser_prevLayerBuffers, "f")[1];
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
        __classPrivateFieldGet(this, _PpmParser_prevLayerBuffers, "f")[0].set(__classPrivateFieldGet(this, _PpmParser_layerBuffers, "f")[0]);
        __classPrivateFieldGet(this, _PpmParser_prevLayerBuffers, "f")[1].set(__classPrivateFieldGet(this, _PpmParser_layerBuffers, "f")[1]);
        return __classPrivateFieldGet(this, _PpmParser_layerBuffers, "f");
    }
    /**
     * Get the color palette indices for a given frame. RGBA colors for these values can be indexed from {@link PpmParser.globalPalette}
    
     * Returns an array where:
     *  - index 0 is the paper color index
     *  - index 1 is the layer 1 color index
     *  - index 2 is the layer 2 color index
     * @group Image
    */
    getFramePaletteIndices(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        this.seek(__classPrivateFieldGet(this, _PpmParser_frameOffsets, "f")[frameIndex]);
        const header = this.readUint8();
        const isInverted = (header & 0x1) !== 1;
        const penMap = [
            isInverted ? 0 : 1, // pen index 0 isn't used in normal cases
            isInverted ? 0 : 1,
            2,
            3,
        ];
        return [
            isInverted ? 1 : 0, // paper
            penMap[(header >> 1) & 0x3], // layer 1 color
            penMap[(header >> 3) & 0x3], // layer 2 color
        ];
    }
    /**
     * Get the RGBA colors for a given frame
     *
     * Returns an array where:
     *  - index 0 is the paper color
     *  - index 1 is the layer 1 color
     *  - index 2 is the layer 2 color
     * @group Image
     */
    getFramePalette(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        const indices = this.getFramePaletteIndices(frameIndex);
        return indices.map(colorIndex => this.globalPalette[colorIndex]);
    }
    /**
     * Determines if a given frame is a video key frame or not. This returns an array of booleans for each layer, since in the KWZ format, keyframe encoding is done on a per-layer basis.
     * @param frameIndex
     * @group Image
    */
    getIsKeyFrame(frameIndex) {
        const flag = __classPrivateFieldGet(this, _PpmParser_instances, "m", _PpmParser_isKeyFrame).call(this, frameIndex) === 1;
        return [flag, flag];
    }
    /**
     * Get the 3D depths for each layer in a given frame. The PPM format doesn't actually store this information, so `0` is returned for both layers. This method is only here for consistency with KWZ.
     * @param frameIndex
     * @group Image
    */
    getFrameLayerDepths(frameIndex) {
        return [0, 0];
    }
    /**
     * Get the FSID for a given frame's original author. The PPM format doesn't actually store this information, so the current author FSID is returned. This method is only here for consistency with KWZ.
     * @param frameIndex
     * @group Meta
    */
    getFrameAuthor(frameIndex) {
        return this.meta.current.fsid;
    }
    /**
     * Get the camera flags for a given frame. The PPM format doesn't actually store this information so `false` will be returned for both layers. This method is only here for consistency with KWZ.
     * @group Image
     * @returns Array of booleans, indicating whether each layer uses a photo or not
    */
    getFrameCameraFlags(frameIndex) {
        return [false, false];
    }
    /**
     * Get the layer draw order for a given frame
     * @group Image
     * @returns Array of layer indices, in the order they should be drawn
    */
    getFrameLayerOrder(frameIndex) {
        return [1, 0];
    }
    /**
     * Get the sound effect flags for every frame in the Flipnote
     * @group Audio
    */
    decodeSoundFlags() {
        if (__classPrivateFieldGet(this, _PpmParser_soundFlags, "f") !== undefined)
            return __classPrivateFieldGet(this, _PpmParser_soundFlags, "f");
        assert(0x06A0 + __classPrivateFieldGet(this, _PpmParser_frameDataLength, "f") < this.numBytes);
        // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#sound-effect-flags
        this.seek(0x06A0 + __classPrivateFieldGet(this, _PpmParser_frameDataLength, "f"));
        const numFlags = this.frameCount;
        const flags = this.readBytes(numFlags);
        __classPrivateFieldSet(this, _PpmParser_soundFlags, new Array(numFlags), "f");
        for (let i = 0; i < numFlags; i++) {
            const byte = flags[i];
            __classPrivateFieldGet(this, _PpmParser_soundFlags, "f")[i] = [
                (byte & 0x1) !== 0, // SE1 bitflag
                (byte & 0x2) !== 0, // SE2 bitflag
                (byte & 0x4) !== 0, // SE3 bitflag
            ];
        }
        return __classPrivateFieldGet(this, _PpmParser_soundFlags, "f");
    }
    /**
     * Get the sound effect usage flags for every frame
     * @group Audio
     */
    getSoundEffectFlags() {
        return this.decodeSoundFlags().map(frameFlags => ({
            [exports.FlipnoteSoundEffectTrack.SE1]: frameFlags[0],
            [exports.FlipnoteSoundEffectTrack.SE2]: frameFlags[1],
            [exports.FlipnoteSoundEffectTrack.SE3]: frameFlags[2],
            [exports.FlipnoteSoundEffectTrack.SE4]: false
        }));
    }
    /**
     * Get the sound effect usage flags for a given frame
     * @group Audio
     */
    getFrameSoundEffectFlags(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        this.seek(0x06A0 + __classPrivateFieldGet(this, _PpmParser_frameDataLength, "f") + frameIndex);
        const byte = this.readUint8();
        return {
            [exports.FlipnoteSoundEffectTrack.SE1]: (byte & 0x1) !== 0,
            [exports.FlipnoteSoundEffectTrack.SE2]: (byte & 0x2) !== 0,
            [exports.FlipnoteSoundEffectTrack.SE3]: (byte & 0x4) !== 0,
            [exports.FlipnoteSoundEffectTrack.SE4]: false
        };
    }
    /**
     * Get the raw compressed audio data for a given track
     * @returns byte array
     * @group Audio
    */
    getAudioTrackRaw(trackId) {
        const trackMeta = this.soundMeta.get(trackId);
        assert(trackMeta.ptr + trackMeta.length < this.numBytes);
        this.seek(trackMeta.ptr);
        return this.readBytes(trackMeta.length);
    }
    /**
     * Get the decoded audio data for a given track, using the track's native samplerate
     * @returns Signed 16-bit PCM audio
     * @group Audio
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
     * @group Audio
    */
    getAudioTrackPcm(trackId, dstFreq = this.sampleRate) {
        const srcPcm = this.decodeAudioTrack(trackId);
        let srcFreq = this.rawSampleRate;
        if (trackId === exports.FlipnoteAudioTrack.BGM) {
            const bgmAdjust = (1 / this.bgmrate) / (1 / this.framerate);
            srcFreq = this.rawSampleRate * bgmAdjust;
        }
        if (srcFreq !== dstFreq)
            return pcmResampleNearestNeighbour(srcPcm, srcFreq, dstFreq);
        return srcPcm;
    }
    /**
     * Get the full mixed audio for the Flipnote, using the specified samplerate
     * @returns Signed 16-bit PCM audio
     * @group Audio
    */
    getAudioMasterPcm(dstFreq = this.sampleRate) {
        const dstSize = Math.ceil(this.duration * dstFreq);
        const master = new Int16Array(dstSize);
        const hasBgm = this.hasAudioTrack(exports.FlipnoteAudioTrack.BGM);
        const hasSe1 = this.hasAudioTrack(exports.FlipnoteAudioTrack.SE1);
        const hasSe2 = this.hasAudioTrack(exports.FlipnoteAudioTrack.SE2);
        const hasSe3 = this.hasAudioTrack(exports.FlipnoteAudioTrack.SE3);
        // Mix background music
        if (hasBgm) {
            const bgmPcm = this.getAudioTrackPcm(exports.FlipnoteAudioTrack.BGM, dstFreq);
            __classPrivateFieldGet(this, _PpmParser_instances, "m", _PpmParser_pcmAudioMix).call(this, bgmPcm, master, 0);
        }
        // Mix sound effects
        if (hasSe1 || hasSe2 || hasSe3) {
            const samplesPerFrame = dstFreq / this.framerate;
            const se1Pcm = hasSe1 ? this.getAudioTrackPcm(exports.FlipnoteAudioTrack.SE1, dstFreq) : null;
            const se2Pcm = hasSe2 ? this.getAudioTrackPcm(exports.FlipnoteAudioTrack.SE2, dstFreq) : null;
            const se3Pcm = hasSe3 ? this.getAudioTrackPcm(exports.FlipnoteAudioTrack.SE3, dstFreq) : null;
            const seFlags = this.decodeSoundFlags();
            for (let frame = 0; frame < this.frameCount; frame++) {
                const seOffset = Math.ceil(frame * samplesPerFrame);
                const flag = seFlags[frame];
                if (hasSe1 && flag[0])
                    __classPrivateFieldGet(this, _PpmParser_instances, "m", _PpmParser_pcmAudioMix).call(this, se1Pcm, master, seOffset);
                if (hasSe2 && flag[1])
                    __classPrivateFieldGet(this, _PpmParser_instances, "m", _PpmParser_pcmAudioMix).call(this, se2Pcm, master, seOffset);
                if (hasSe3 && flag[2])
                    __classPrivateFieldGet(this, _PpmParser_instances, "m", _PpmParser_pcmAudioMix).call(this, se3Pcm, master, seOffset);
            }
        }
        this.audioClipRatio = pcmGetClippingRatio(master);
        return master;
    }
    /**
     * Get the body of the Flipnote - the data that is digested for the signature
     * @group Verification
     */
    getBody() {
        const bodyEnd = __classPrivateFieldGet(this, _PpmParser_soundDataOffset, "f") + __classPrivateFieldGet(this, _PpmParser_soundDataLength, "f") + 32;
        return this.bytes.subarray(0, bodyEnd);
    }
    /**
    * Get the Flipnote's signature data
    * @group Verification
    */
    getSignature() {
        const bodyEnd = __classPrivateFieldGet(this, _PpmParser_soundDataOffset, "f") + __classPrivateFieldGet(this, _PpmParser_soundDataLength, "f") + 32;
        return this.bytes.subarray(bodyEnd, bodyEnd + 128);
    }
    /**
     * Verify whether this Flipnote's signature is valid
     * @group Verification
     */
    async verify() {
        const key = await rsaLoadPublicKey(PPM_PUBLIC_KEY, 'SHA-1');
        return await rsaVerify(key, this.getSignature(), this.getBody());
    }
}
_PpmParser_layerBuffers = new WeakMap(), _PpmParser_soundFlags = new WeakMap(), _PpmParser_prevLayerBuffers = new WeakMap(), _PpmParser_lineEncodingBuffers = new WeakMap(), _PpmParser_prevDecodedFrame = new WeakMap(), _PpmParser_frameDataLength = new WeakMap(), _PpmParser_soundDataLength = new WeakMap(), _PpmParser_soundDataOffset = new WeakMap(), _PpmParser_frameOffsets = new WeakMap(), _PpmParser_instances = new WeakSet(), _a$1 = Symbol.toStringTag, _PpmParser_decodeHeader = function _PpmParser_decodeHeader() {
    assert(16 < this.numBytes);
    this.seek(4);
    // decode header
    // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#header
    __classPrivateFieldSet(this, _PpmParser_frameDataLength, this.readUint32(), "f");
    __classPrivateFieldSet(this, _PpmParser_soundDataLength, this.readUint32(), "f");
    this.frameCount = this.readUint16() + 1;
    this.version = this.readUint16();
    // sound data offset = frame data offset + frame data length + sound effect flags
    let soundDataOffset = 0x06A0 + __classPrivateFieldGet(this, _PpmParser_frameDataLength, "f") + this.frameCount;
    if (soundDataOffset % 4 !== 0)
        soundDataOffset += 4 - (soundDataOffset % 4);
    assert(soundDataOffset < this.numBytes);
    __classPrivateFieldSet(this, _PpmParser_soundDataOffset, soundDataOffset, "f");
}, _PpmParser_readFilename = function _PpmParser_readFilename() {
    const mac = this.readHex(3);
    const random = this.readChars(13);
    const edits = this.readUint16().toString().padStart(3, '0');
    return `${mac}_${random}_${edits}`;
}, _PpmParser_decodeMeta = function _PpmParser_decodeMeta() {
    // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#metadata
    assert(0x06A8 < this.numBytes);
    this.seek(0x10);
    const lock = this.readUint16();
    const thumbIndex = this.readInt16();
    const rootAuthorName = this.readWideChars(11);
    const parentAuthorName = this.readWideChars(11);
    const currentAuthorName = this.readWideChars(11);
    const parentAuthorId = this.readHex(8, true);
    const currentAuthorId = this.readHex(8, true);
    const parentFilename = __classPrivateFieldGet(this, _PpmParser_instances, "m", _PpmParser_readFilename).call(this);
    const currentFilename = __classPrivateFieldGet(this, _PpmParser_instances, "m", _PpmParser_readFilename).call(this);
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
        advancedTools: undefined,
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
}, _PpmParser_decodeAnimationHeader = function _PpmParser_decodeAnimationHeader() {
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
        assert(ptr < this.numBytes, `Frame ${n} pointer is out of bounds`);
        frameOffsets[n] = ptr;
    }
    __classPrivateFieldSet(this, _PpmParser_frameOffsets, frameOffsets, "f");
}, _PpmParser_decodeSoundHeader = function _PpmParser_decodeSoundHeader() {
    // https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format#sound-header
    let ptr = __classPrivateFieldGet(this, _PpmParser_soundDataOffset, "f");
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
    soundMeta.set(exports.FlipnoteAudioTrack.BGM, { ptr: ptr, length: bgmLen });
    soundMeta.set(exports.FlipnoteAudioTrack.SE1, { ptr: ptr += bgmLen, length: se1Len });
    soundMeta.set(exports.FlipnoteAudioTrack.SE2, { ptr: ptr += se1Len, length: se2Len });
    soundMeta.set(exports.FlipnoteAudioTrack.SE3, { ptr: ptr += se2Len, length: se3Len });
    this.soundMeta = soundMeta;
}, _PpmParser_isKeyFrame = function _PpmParser_isKeyFrame(frameIndex) {
    assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
    this.seek(__classPrivateFieldGet(this, _PpmParser_frameOffsets, "f")[frameIndex]);
    const header = this.readUint8();
    return (header >> 7) & 0x1;
}, _PpmParser_pcmAudioMix = function _PpmParser_pcmAudioMix(src, dst, dstOffset = 0) {
    const srcSize = src.length;
    const dstSize = dst.length;
    for (let n = 0; n < srcSize; n++) {
        if (dstOffset + n > dstSize)
            break;
        // half src volume
        const samp = dst[dstOffset + n] + (src[n] / 2);
        dst[dstOffset + n] = clamp(samp, -32768, 32767);
    }
};
/**
 * Default PPM parser settings.
 */
PpmParser.defaultSettings = {};
/**
 * File format type.
 */
PpmParser.format = exports.FlipnoteFormat.PPM;
/**
 * Animation frame width.
 */
PpmParser.width = 256;
/**
 * Animation frame height.
 */
PpmParser.height = 192;
/**
 * Animation frame aspect ratio.
 */
PpmParser.aspect = 3 / 4;
/**
 * Number of animation frame layers.
 */
PpmParser.numLayers = 2;
/**
 * Number of colors per layer (aside from transparent).
 */
PpmParser.numLayerColors = 1;
/**
 * Audio track base sample rate.
 */
PpmParser.rawSampleRate = 8192;
/**
 * Nintendo DSi audio output rate.
 */
PpmParser.sampleRate = 32768;
/**
 * Which audio tracks are available in this format.
 */
PpmParser.audioTracks = [
    exports.FlipnoteAudioTrack.BGM,
    exports.FlipnoteAudioTrack.SE1,
    exports.FlipnoteAudioTrack.SE2,
    exports.FlipnoteAudioTrack.SE3
];
/**
 * Which sound effect tracks are available in this format.
 */
PpmParser.soundEffectTracks = [
    exports.FlipnoteSoundEffectTrack.SE1,
    exports.FlipnoteSoundEffectTrack.SE2,
    exports.FlipnoteSoundEffectTrack.SE3,
];
/**
 * Global animation frame color palette.
 */
PpmParser.globalPalette = [
    PPM_PALETTE.WHITE,
    PPM_PALETTE.BLACK,
    PPM_PALETTE.RED,
    PPM_PALETTE.BLUE
];
/**
 * Public key used for Flipnote verification, in PEM format.
 */
PpmParser.publicKey = PPM_PUBLIC_KEY;

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
 * KWZ equivalents of PPM_FSID_SPECIAL_CASE
 * @internal
 */
const KWZ_DSI_LIBRARY_FSID_SPECIAL_CASE_SUFFIX = [
    '5f-fc67-437a-cafa01',
    '2d-a4f9-e259-e9d603',
    'fa-8705-1645-04f803',
    '15-8900-e126-840604',
    'd5-d59f-19c8-3e2a09',
    'b8-41d4-1bba-568d0b',
    '0b-d95a-9b5c-c7610e',
    '35-3244-5ae3-94e414',
];
/**
 * Indicates whether the input is a valid Flipnote Studio 3D user ID
 */
const isKwzFsid = (fsid) => REGEX_KWZ_FSID.test(fsid);
/**
 * Indicates whether the input is a valid DSi Library user ID
 */
const isKwzDsiLibraryFsid = (fsid) => {
    if (REGEX_KWZ_DSI_LIBRARY_FSID.test(fsid))
        return true;
    for (let suffix of KWZ_DSI_LIBRARY_FSID_SPECIAL_CASE_SUFFIX) {
        if (fsid.endsWith(suffix))
            return true;
    }
    return false;
};
/**
 * Get the region for any valid Flipnote Studio 3D user ID.
 *
 * :::tip
 * This may be incorrect for IDs that are not from the DSi Library.
 * :::
 */
const getKwzFsidRegion = (fsid) => {
    if (isKwzDsiLibraryFsid(fsid)) {
        switch (fsid.charAt(19)) {
            case '0':
            case '1':
                return exports.FlipnoteRegion.JPN;
            case '5':
                return exports.FlipnoteRegion.USA;
            case '9':
                return exports.FlipnoteRegion.EUR;
            default:
                return exports.FlipnoteRegion.UNKNOWN;
        }
    }
    return exports.FlipnoteRegion.UNKNOWN;
};
/**
 * Format a hex string with dashes, to match the format used to display Flipnote Studio IDs in the app.
 */
const kwzFsidFormat = (hex) => {
    return `${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 18)}`.toLowerCase();
};
/**
 * Unformat a Flipnote Studio ID string back into regular hex.
 */
const kwzFsidUnformat = (fsid) => {
    return fsid.replace(/-/g, '').toUpperCase();
};

var _KwzParser_instances, _KwzParser_settings, _KwzParser_sectionMap, _KwzParser_bodyEndOffset, _KwzParser_layerBuffers, _KwzParser_soundFlags, _KwzParser_prevDecodedFrame, _KwzParser_frameMetaOffsets, _KwzParser_frameDataOffsets, _KwzParser_frameLayerSizes, _KwzParser_frameDataTotalSize, _KwzParser_bitIndex, _KwzParser_bitValue, _KwzParser_buildSectionMap, _KwzParser_readBits, _KwzParser_readFsid, _KwzParser_readFilename, _KwzParser_decodeMeta, _KwzParser_decodeMetaQuick, _KwzParser_getFrameOffsets, _KwzParser_decodeSoundHeader, _a;
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
 * Pre computed bitmasks for readBits; done as a slight optimization
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
/**
 * @internal
 */
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
 * Parser class for Flipnote Studio 3D's KWZ animation format. KWZ format docs: https://github.com/Flipnote-Collective/flipnote-studio-3d-docs/wiki/KWZ-Format
 * @group File Parser
 */
class KwzParser extends BaseParser {
    static matchBuffer(buffer) {
        // check the buffer's magic to identify which format it uses
        const magicBytes = new Uint8Array(buffer.slice(0, 4));
        const magic = (magicBytes[0] << 24) | (magicBytes[1] << 16) | (magicBytes[2] << 8);
        // check if magic is KFH (kwz magic) or  KIC (fs3d folder icon)
        return magic === 0x4B464800 || magic === 0x4B494300;
    }
    /**
     * Create a new KWZ file parser instance
     * @param arrayBuffer an ArrayBuffer containing file data
     * @param settings parser settings
     */
    constructor(arrayBuffer, settings = {}) {
        super(arrayBuffer);
        _KwzParser_instances.add(this);
        /**
         * File format type, reflects {@link KwzParser.format}
         */
        this.format = exports.FlipnoteFormat.KWZ;
        /**
         * Custom object tag
         */
        this[_a] = 'Flipnote Studio 3D KWZ animation file';
        /**
         * Animation frame width, reflects {@link KwzParser.width}
         */
        this.imageWidth = KwzParser.width;
        /**
         * Animation frame height, reflects {@link KwzParser.height}
         */
        this.imageHeight = KwzParser.height;
        /**
         * Animation frame aspect ratio, reflects {@link KwzParser.aspect}
         */
        this.aspect = KwzParser.aspect;
        /**
         * X offset for the top-left corner of the animation frame
         */
        this.imageOffsetX = 0;
        /**
         * Y offset for the top-left corner of the animation frame
         */
        this.imageOffsetY = 0;
        /**
         * Number of animation frame layers, reflects {@link KwzParser.numLayers}
         */
        this.numLayers = KwzParser.numLayers;
        /**
         * Number of colors per layer (aside from transparent), reflects {@link KwzParser.numLayerColors}
         */
        this.numLayerColors = KwzParser.numLayerColors;
        /**
         * key used for Flipnote verification, in PEM format
         */
        this.publicKey = KwzParser.publicKey;
        /**
         * @internal
         */
        this.srcWidth = KwzParser.width;
        /**
         * Which audio tracks are available in this format, reflects {@link KwzParser.audioTracks}
         */
        this.audioTracks = KwzParser.audioTracks;
        /**
         * Which sound effect tracks are available in this format, reflects {@link KwzParser.soundEffectTracks}
         */
        this.soundEffectTracks = KwzParser.soundEffectTracks;
        /**
         * Audio track base sample rate, reflects {@link KwzParser.rawSampleRate}
         */
        this.rawSampleRate = KwzParser.rawSampleRate;
        /**
         * Audio output sample rate, reflects {@link KwzParser.sampleRate}
         */
        this.sampleRate = KwzParser.sampleRate;
        /**
         * Global animation frame color palette, reflects {@link KwzParser.globalPalette}
         */
        this.globalPalette = KwzParser.globalPalette;
        _KwzParser_settings.set(this, void 0);
        _KwzParser_sectionMap.set(this, void 0);
        _KwzParser_bodyEndOffset.set(this, void 0);
        _KwzParser_layerBuffers.set(this, void 0);
        _KwzParser_soundFlags.set(this, void 0); // sound effect flag cache
        _KwzParser_prevDecodedFrame.set(this, null);
        // frameMeta: Map<number, KwzFrameMeta>;
        _KwzParser_frameMetaOffsets.set(this, void 0);
        _KwzParser_frameDataOffsets.set(this, void 0);
        _KwzParser_frameLayerSizes.set(this, void 0);
        _KwzParser_frameDataTotalSize.set(this, void 0);
        _KwzParser_bitIndex.set(this, 0);
        _KwzParser_bitValue.set(this, 0);
        __classPrivateFieldSet(this, _KwzParser_settings, { ...KwzParser.defaultSettings, ...settings }, "f");
        __classPrivateFieldSet(this, _KwzParser_layerBuffers, [
            new Uint8Array(KwzParser.width * KwzParser.height),
            new Uint8Array(KwzParser.width * KwzParser.height),
            new Uint8Array(KwzParser.width * KwzParser.height),
        ], "f");
        // skip through the file and read all of the section headers so we can locate them
        __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_buildSectionMap).call(this);
        // if the KIC section is present, we're dealing with a folder icon
        // these are single-frame KWZs without a KFH section for metadata, or a KSN section for sound
        // while the data for a full frame (320*240) is present, only the top-left 24*24 pixels are used
        if (__classPrivateFieldGet(this, _KwzParser_sectionMap, "f").has('KIC')) {
            this.isFolderIcon = true;
            // icons still use the full 320 * 240 frame size, so we just set up our image crop to deal with that
            this.imageWidth = 24;
            this.imageHeight = 24;
            this.frameCount = 1;
            this.frameSpeed = 0;
            this.framerate = KWZ_FRAMERATES[0];
            this.thumbFrameIndex = 0;
            __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_getFrameOffsets).call(this);
        }
        // if the KSN section is not present, then this is a handwritten comment from the Flipnote Gallery World online service
        // these are single-frame KWZs, just with no sound
        else if (!__classPrivateFieldGet(this, _KwzParser_sectionMap, "f").has('KSN')) {
            this.isComment = true;
            __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_decodeMeta).call(this);
            __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_getFrameOffsets).call(this);
        }
        // else let's assume this is a regular note
        else {
            __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_decodeMeta).call(this);
            __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_getFrameOffsets).call(this);
            __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_decodeSoundHeader).call(this);
        }
        // apply special optimizations for converted DSi library notes
        if (__classPrivateFieldGet(this, _KwzParser_settings, "f").dsiLibraryNote) {
            this.isDsiLibraryNote = true;
        }
        // automatically crop out the border around every frame
        if (__classPrivateFieldGet(this, _KwzParser_settings, "f").borderCrop) {
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
    /**
     * Decodes the thumbnail image embedded in the Flipnote. Will return a {@link FlipnoteThumbImage} containing JPEG data.
     *
     * Note: For most purposes, you should probably just decode the thumbnail frame to get a higher resolution image.
     * @group Meta
     */
    getThumbnailImage() {
        assert(__classPrivateFieldGet(this, _KwzParser_sectionMap, "f").has('KTN'), 'KTN section missing - Note that folder icons and comments do not contain thumbnail data');
        const ktn = __classPrivateFieldGet(this, _KwzParser_sectionMap, "f").get('KTN');
        this.seek(ktn.ptr + 12);
        const bytes = this.readBytes(ktn.length - 12);
        return {
            format: exports.FlipnoteThumbImageFormat.Jpeg,
            width: 80,
            height: 64,
            data: bytes.buffer
        };
    }
    /**
     * Get the memory meter level for the Flipnote.
     * This is a value between 0 and 1 indicating how "full" the Flipnote is, based on the size calculation formula inside Flipnote Studio 3D.
     *
     * Values will never be below 0, but can be above 1 if the Flipnote is larger than the size limit - it is technically possible to exceed the size limit by one frame.
     *
     * @group Meta
    */
    getMemoryMeterLevel() {
        // NOTE: Flipnote Studio 3D seems to have a couple of different calculations for the actual memory limit
        // This is based on the function at 0x002b4224, which gives the level used for the memory bar itself
        // A slightly different calculation is used when deciding if a new frame can be added, unsure why!
        assert(__classPrivateFieldGet(this, _KwzParser_sectionMap, "f").has('KMI') && __classPrivateFieldGet(this, _KwzParser_sectionMap, "f").has('KMC'));
        const sampleRate = this.rawSampleRate;
        const bytesPerSecond = sampleRate / 2;
        const bgmMaxSize = bytesPerSecond * 60;
        const seMaxSize = bytesPerSecond * 2;
        const audioMaxSize = bgmMaxSize + seMaxSize * 4;
        const totalSize = __classPrivateFieldGet(this, _KwzParser_frameDataTotalSize, "f");
        // The function at 0x0031f258 gives the max size used in this calculation
        // I'm actually unsure what the (something + 39) is, but maximum possible audio size seems to fit well enough for now :^)
        const maxSize = 4219447 - ((audioMaxSize + 39) & 0xfffffffc);
        const level = (totalSize + 57600) / maxSize;
        return level;
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
     * @group Image
    */
    getFramePaletteIndices(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        this.seek(__classPrivateFieldGet(this, _KwzParser_frameMetaOffsets, "f")[frameIndex]);
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
     * @group Image
    */
    getFramePalette(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        const indices = this.getFramePaletteIndices(frameIndex);
        return indices.map(colorIndex => this.globalPalette[colorIndex]);
    }
    getFrameDiffingFlag(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        this.seek(__classPrivateFieldGet(this, _KwzParser_frameMetaOffsets, "f")[frameIndex]);
        return (this.readUint32() >> 4) & 0x07;
    }
    /**
     * Determines if a given frame is a video key frame or not. This returns an array of booleans for each layer, since keyframe encoding is done on a per-layer basis.
     * @param frameIndex
     * @group Image
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
     * @group Image
    */
    getFrameLayerDepths(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        this.seek(__classPrivateFieldGet(this, _KwzParser_frameMetaOffsets, "f")[frameIndex] + 0x14);
        return [
            this.readUint8(),
            this.readUint8(),
            this.readUint8()
        ];
    }
    /**
     * Get the FSID for a given frame's original author.
     * @param frameIndex
     * @group Meta
    */
    getFrameAuthor(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        this.seek(__classPrivateFieldGet(this, _KwzParser_frameMetaOffsets, "f")[frameIndex] + 0xA);
        return __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readFsid).call(this);
    }
    /**
     * Get the camera flags for a given frame
     * @group Image
     * @returns Array of booleans, indicating whether each layer uses a photo or not
    */
    getFrameCameraFlags(frameIndex) {
        this.seek(__classPrivateFieldGet(this, _KwzParser_frameMetaOffsets, "f")[frameIndex] + 0x1A);
        const cameraFlags = this.readUint8();
        return [
            (cameraFlags & 0x1) !== 0,
            (cameraFlags & 0x2) !== 0,
            (cameraFlags & 0x4) !== 0,
        ];
    }
    /**
     * Get the layer draw order for a given frame
     * @group Image
    */
    getFrameLayerOrder(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        const depths = this.getFrameLayerDepths(frameIndex);
        return [2, 1, 0].sort((a, b) => depths[b] - depths[a]);
    }
    /**
     * Decode a frame, returning the raw pixel buffers for each layer
     * @group Image
    */
    decodeFrame(frameIndex, diffingFlag = 0x7, isPrevFrame = false) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        // return existing layer buffers if no new frame has been decoded since the last call
        if (__classPrivateFieldGet(this, _KwzParser_prevDecodedFrame, "f") === frameIndex)
            return __classPrivateFieldGet(this, _KwzParser_layerBuffers, "f");
        // the prevDecodedFrame check is an optimization for decoding frames in full sequence
        if (__classPrivateFieldGet(this, _KwzParser_prevDecodedFrame, "f") !== frameIndex - 1 && frameIndex !== 0) {
            // if this frame is being decoded as a prev frame, then we only want to decode the layers necessary
            // diffingFlag is negated with ~ so if no layers are diff-based, diffingFlag is 0
            if (isPrevFrame)
                diffingFlag = diffingFlag & ~this.getFrameDiffingFlag(frameIndex + 1);
            // if diffing flag isn't 0, decode the previous frame before this one
            if (diffingFlag !== 0)
                this.decodeFrame(frameIndex - 1, diffingFlag, true);
        }
        let framePtr = __classPrivateFieldGet(this, _KwzParser_frameDataOffsets, "f")[frameIndex];
        const layerSizes = __classPrivateFieldGet(this, _KwzParser_frameLayerSizes, "f")[frameIndex];
        for (let layerIndex = 0; layerIndex < 3; layerIndex++) {
            // dsi gallery conversions don't use the third layer, so it can be skipped if this is set
            if (__classPrivateFieldGet(this, _KwzParser_settings, "f").dsiLibraryNote && layerIndex === 3)
                break;
            this.seek(framePtr);
            let layerSize = layerSizes[layerIndex];
            framePtr += layerSize;
            const pixelBuffer = __classPrivateFieldGet(this, _KwzParser_layerBuffers, "f")[layerIndex];
            // if the layer is 38 bytes then it hasn't changed at all since the previous frame, so we can skip it
            if (layerSize === 38)
                continue;
            // if this layer doesn't need to be decoded for diffing
            if (((diffingFlag >> layerIndex) & 0x1) === 0)
                continue;
            // reset readbits state
            __classPrivateFieldSet(this, _KwzParser_bitIndex, 16, "f");
            __classPrivateFieldSet(this, _KwzParser_bitValue, 0, "f");
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
                            const tileType = __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readBits).call(this, 3);
                            if (tileType === 0) {
                                const linePtr = __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readBits).call(this, 5) * 8;
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
                                const linePtr = __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readBits).call(this, 13) * 8;
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
                                const linePtr = __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readBits).call(this, 5) * 8;
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
                                const linePtr = __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readBits).call(this, 13) * 8;
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
                                const flags = __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readBits).call(this, 8);
                                for (let mask = 1; mask < 0xFF; mask <<= 1) {
                                    if (flags & mask) {
                                        const linePtr = __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readBits).call(this, 5) * 8;
                                        const pixels = KWZ_LINE_TABLE_COMMON.subarray(linePtr, linePtr + 8);
                                        pixelBuffer.set(pixels, pixelBufferPtr);
                                    }
                                    else {
                                        const linePtr = __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readBits).call(this, 13) * 8;
                                        const pixels = KWZ_LINE_TABLE.subarray(linePtr, linePtr + 8);
                                        pixelBuffer.set(pixels, pixelBufferPtr);
                                    }
                                    pixelBufferPtr += 320;
                                }
                            }
                            else if (tileType === 5) {
                                skipTileCounter = __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readBits).call(this, 5);
                                continue;
                            }
                            // type 6 doesnt exist
                            else if (tileType === 7) {
                                let pattern = __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readBits).call(this, 2);
                                let useCommonLines = __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readBits).call(this, 1);
                                let a, b;
                                if (useCommonLines !== 0) {
                                    const linePtrA = __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readBits).call(this, 5) * 8;
                                    const linePtrB = __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readBits).call(this, 5) * 8;
                                    a = KWZ_LINE_TABLE_COMMON.subarray(linePtrA, linePtrA + 8);
                                    b = KWZ_LINE_TABLE_COMMON.subarray(linePtrB, linePtrB + 8);
                                    pattern += 1;
                                }
                                else {
                                    const linePtrA = __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readBits).call(this, 13) * 8;
                                    const linePtrB = __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readBits).call(this, 13) * 8;
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
        __classPrivateFieldSet(this, _KwzParser_prevDecodedFrame, frameIndex, "f");
        return __classPrivateFieldGet(this, _KwzParser_layerBuffers, "f");
    }
    decodeFrameSoundFlags(frameIndex) {
        assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
        this.seek(__classPrivateFieldGet(this, _KwzParser_frameMetaOffsets, "f")[frameIndex] + 0x17);
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
     * @group Audio
    */
    decodeSoundFlags() {
        if (__classPrivateFieldGet(this, _KwzParser_soundFlags, "f") !== undefined)
            return __classPrivateFieldGet(this, _KwzParser_soundFlags, "f");
        __classPrivateFieldSet(this, _KwzParser_soundFlags, new Array(this.frameCount)
            .fill(false)
            .map((_, i) => this.decodeFrameSoundFlags(i)), "f");
        return __classPrivateFieldGet(this, _KwzParser_soundFlags, "f");
    }
    /**
     * Get the sound effect usage flags for every frame
     * @group Audio
     */
    getSoundEffectFlags() {
        return this.decodeSoundFlags().map((frameFlags) => ({
            [exports.FlipnoteSoundEffectTrack.SE1]: frameFlags[0],
            [exports.FlipnoteSoundEffectTrack.SE2]: frameFlags[1],
            [exports.FlipnoteSoundEffectTrack.SE3]: frameFlags[2],
            [exports.FlipnoteSoundEffectTrack.SE4]: frameFlags[3],
        }));
    }
    /**
     * Get the sound effect usage for a given frame
     * @param frameIndex
     * @group Audio
     */
    getFrameSoundEffectFlags(frameIndex) {
        const frameFlags = this.decodeFrameSoundFlags(frameIndex);
        return {
            [exports.FlipnoteSoundEffectTrack.SE1]: frameFlags[0],
            [exports.FlipnoteSoundEffectTrack.SE2]: frameFlags[1],
            [exports.FlipnoteSoundEffectTrack.SE3]: frameFlags[2],
            [exports.FlipnoteSoundEffectTrack.SE4]: frameFlags[3],
        };
    }
    /**
     * Get the raw compressed audio data for a given track
     * @returns Byte array
     * @group Audio
    */
    getAudioTrackRaw(trackId) {
        const trackMeta = this.soundMeta.get(trackId);
        assert(trackMeta.ptr + trackMeta.length < this.numBytes);
        return new Uint8Array(this.buffer, trackMeta.ptr, trackMeta.length);
    }
    decodeAdpcm(src, dst, predictor = 0, stepIndex = 40) {
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
     * @group Audio
    */
    decodeAudioTrack(trackId) {
        const settings = __classPrivateFieldGet(this, _KwzParser_settings, "f");
        const src = this.getAudioTrackRaw(trackId);
        const dstSize = this.rawSampleRate * 60; // enough for 60 seconds, the max bgm size
        const dst = new Int16Array(dstSize);
        // initial decoder state
        let predictor = 0;
        let stepIndex = 40;
        // Nintendo messed up the initial adpcm state for a bunch of the PPM conversions on DSi Library
        // they are effectively random, so you can optionally provide your own state values, or let the lib make a best guess
        if (this.isDsiLibraryNote) {
            if (trackId === exports.FlipnoteAudioTrack.BGM) {
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
     * @group Audio
    */
    getAudioTrackPcm(trackId, dstFreq = this.sampleRate) {
        const srcPcm = this.decodeAudioTrack(trackId);
        let srcFreq = this.rawSampleRate;
        if (trackId === exports.FlipnoteAudioTrack.BGM) {
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
     * @group Audio
    */
    getAudioMasterPcm(dstFreq = this.sampleRate) {
        const dstSize = Math.ceil(this.duration * dstFreq);
        const master = new Int16Array(dstSize);
        const hasBgm = this.hasAudioTrack(exports.FlipnoteAudioTrack.BGM);
        const hasSe1 = this.hasAudioTrack(exports.FlipnoteAudioTrack.SE1);
        const hasSe2 = this.hasAudioTrack(exports.FlipnoteAudioTrack.SE2);
        const hasSe3 = this.hasAudioTrack(exports.FlipnoteAudioTrack.SE3);
        const hasSe4 = this.hasAudioTrack(exports.FlipnoteAudioTrack.SE4);
        // Mix background music
        if (hasBgm) {
            const bgmPcm = this.getAudioTrackPcm(exports.FlipnoteAudioTrack.BGM, dstFreq);
            this.pcmAudioMix(bgmPcm, master, 0);
        }
        // Mix sound effects
        if (hasSe1 || hasSe2 || hasSe3 || hasSe4) {
            const samplesPerFrame = dstFreq / this.framerate;
            const se1Pcm = hasSe1 ? this.getAudioTrackPcm(exports.FlipnoteAudioTrack.SE1, dstFreq) : null;
            const se2Pcm = hasSe2 ? this.getAudioTrackPcm(exports.FlipnoteAudioTrack.SE2, dstFreq) : null;
            const se3Pcm = hasSe3 ? this.getAudioTrackPcm(exports.FlipnoteAudioTrack.SE3, dstFreq) : null;
            const se4Pcm = hasSe4 ? this.getAudioTrackPcm(exports.FlipnoteAudioTrack.SE4, dstFreq) : null;
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
     * @group Verification
     */
    getBody() {
        const bodyEnd = __classPrivateFieldGet(this, _KwzParser_bodyEndOffset, "f");
        return this.bytes.subarray(0, bodyEnd);
    }
    /**
     * Get the Flipnote's signature data
     * @group Verification
     */
    getSignature() {
        const bodyEnd = __classPrivateFieldGet(this, _KwzParser_bodyEndOffset, "f");
        return this.bytes.subarray(bodyEnd, bodyEnd + 256);
    }
    /**
     * Verify whether this Flipnote's signature is valid
     * @group Verification
     */
    async verify() {
        const key = await rsaLoadPublicKey(KWZ_PUBLIC_KEY, 'SHA-256');
        return await rsaVerify(key, this.getSignature(), this.getBody());
    }
}
_KwzParser_settings = new WeakMap(), _KwzParser_sectionMap = new WeakMap(), _KwzParser_bodyEndOffset = new WeakMap(), _KwzParser_layerBuffers = new WeakMap(), _KwzParser_soundFlags = new WeakMap(), _KwzParser_prevDecodedFrame = new WeakMap(), _KwzParser_frameMetaOffsets = new WeakMap(), _KwzParser_frameDataOffsets = new WeakMap(), _KwzParser_frameLayerSizes = new WeakMap(), _KwzParser_frameDataTotalSize = new WeakMap(), _KwzParser_bitIndex = new WeakMap(), _KwzParser_bitValue = new WeakMap(), _KwzParser_instances = new WeakSet(), _a = Symbol.toStringTag, _KwzParser_buildSectionMap = function _KwzParser_buildSectionMap() {
    const fileSize = this.numBytes - 256;
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
    __classPrivateFieldSet(this, _KwzParser_bodyEndOffset, ptr, "f");
    __classPrivateFieldSet(this, _KwzParser_sectionMap, sectionMap, "f");
    assert(sectionMap.has('KMC') && sectionMap.has('KMI'));
}, _KwzParser_readBits = function _KwzParser_readBits(num) {
    // assert(num < 16);
    if (__classPrivateFieldGet(this, _KwzParser_bitIndex, "f") + num > 16) {
        const nextBits = this.readUint16();
        __classPrivateFieldSet(this, _KwzParser_bitValue, __classPrivateFieldGet(this, _KwzParser_bitValue, "f") | nextBits << (16 - __classPrivateFieldGet(this, _KwzParser_bitIndex, "f")), "f");
        __classPrivateFieldSet(this, _KwzParser_bitIndex, __classPrivateFieldGet(this, _KwzParser_bitIndex, "f") - 16, "f");
    }
    const result = __classPrivateFieldGet(this, _KwzParser_bitValue, "f") & BITMASKS[num];
    __classPrivateFieldSet(this, _KwzParser_bitValue, __classPrivateFieldGet(this, _KwzParser_bitValue, "f") >> num, "f");
    __classPrivateFieldSet(this, _KwzParser_bitIndex, __classPrivateFieldGet(this, _KwzParser_bitIndex, "f") + num, "f");
    return result;
}, _KwzParser_readFsid = function _KwzParser_readFsid() {
    if (__classPrivateFieldGet(this, _KwzParser_settings, "f").dsiLibraryNote) { // format as DSi PPM FSID
        const hex = this.readHex(10, true);
        return hex.slice(2, 18);
    }
    return kwzFsidFormat(this.readHex(10));
}, _KwzParser_readFilename = function _KwzParser_readFilename() {
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
}, _KwzParser_decodeMeta = function _KwzParser_decodeMeta() {
    if (__classPrivateFieldGet(this, _KwzParser_settings, "f").quickMeta)
        return __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_decodeMetaQuick).call(this);
    assert(__classPrivateFieldGet(this, _KwzParser_sectionMap, "f").has('KFH'));
    this.seek(__classPrivateFieldGet(this, _KwzParser_sectionMap, "f").get('KFH').ptr + 12);
    const creationTime = dateFromNintendoTimestamp(this.readUint32());
    const modifiedTime = dateFromNintendoTimestamp(this.readUint32());
    // const simonTime = 
    this.readUint32();
    const rootAuthorId = __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readFsid).call(this);
    const parentAuthorId = __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readFsid).call(this);
    const currentAuthorId = __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readFsid).call(this);
    const rootAuthorName = this.readWideChars(11);
    const parentAuthorName = this.readWideChars(11);
    const currentAuthorName = this.readWideChars(11);
    const rootFilename = __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readFilename).call(this);
    const parentFilename = __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readFilename).call(this);
    const currentFilename = __classPrivateFieldGet(this, _KwzParser_instances, "m", _KwzParser_readFilename).call(this);
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
        advancedTools: (flags & 0x4) !== 0,
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
}, _KwzParser_decodeMetaQuick = function _KwzParser_decodeMetaQuick() {
    assert(__classPrivateFieldGet(this, _KwzParser_sectionMap, "f").has('KFH'));
    this.seek(__classPrivateFieldGet(this, _KwzParser_sectionMap, "f").get('KFH').ptr + 0x8 + 0xC4);
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
}, _KwzParser_getFrameOffsets = function _KwzParser_getFrameOffsets() {
    assert(__classPrivateFieldGet(this, _KwzParser_sectionMap, "f").has('KMI') && __classPrivateFieldGet(this, _KwzParser_sectionMap, "f").has('KMC'));
    const numFrames = this.frameCount;
    const kmiSection = __classPrivateFieldGet(this, _KwzParser_sectionMap, "f").get('KMI');
    const kmcSection = __classPrivateFieldGet(this, _KwzParser_sectionMap, "f").get('KMC');
    assert(kmiSection.length / 28 >= numFrames);
    const frameMetaOffsets = new Uint32Array(numFrames);
    const frameDataOffsets = new Uint32Array(numFrames);
    const frameLayerSizes = [];
    let frameMetaPtr = kmiSection.ptr + 8;
    let frameDataPtr = kmcSection.ptr + 12;
    let totalSize = 0;
    for (let frameIndex = 0; frameIndex < numFrames; frameIndex++) {
        this.seek(frameMetaPtr + 4);
        const layerASize = this.readUint16();
        const layerBSize = this.readUint16();
        const layerCSize = this.readUint16();
        frameMetaOffsets[frameIndex] = frameMetaPtr;
        frameDataOffsets[frameIndex] = frameDataPtr;
        frameMetaPtr += 28;
        frameDataPtr += layerASize + layerBSize + layerCSize;
        assert(frameMetaPtr < this.numBytes, `frame${frameIndex} meta pointer out of bounds`);
        assert(frameDataPtr < this.numBytes, `frame${frameIndex} data pointer out of bounds`);
        frameLayerSizes.push([layerASize, layerBSize, layerCSize]);
        totalSize += layerASize + layerBSize + layerCSize;
    }
    __classPrivateFieldSet(this, _KwzParser_frameMetaOffsets, frameMetaOffsets, "f");
    __classPrivateFieldSet(this, _KwzParser_frameDataOffsets, frameDataOffsets, "f");
    __classPrivateFieldSet(this, _KwzParser_frameLayerSizes, frameLayerSizes, "f");
    __classPrivateFieldSet(this, _KwzParser_frameDataTotalSize, totalSize, "f");
}, _KwzParser_decodeSoundHeader = function _KwzParser_decodeSoundHeader() {
    assert(__classPrivateFieldGet(this, _KwzParser_sectionMap, "f").has('KSN'));
    let ptr = __classPrivateFieldGet(this, _KwzParser_sectionMap, "f").get('KSN').ptr + 8;
    this.seek(ptr);
    this.bgmSpeed = this.readUint32();
    assert(this.bgmSpeed <= 10);
    this.bgmrate = KWZ_FRAMERATES[this.bgmSpeed];
    const trackSizes = new Uint32Array(this.buffer, ptr + 4, 20);
    const soundMeta = new Map();
    soundMeta.set(exports.FlipnoteAudioTrack.BGM, { ptr: ptr += 28, length: trackSizes[0] });
    soundMeta.set(exports.FlipnoteAudioTrack.SE1, { ptr: ptr += trackSizes[0], length: trackSizes[1] });
    soundMeta.set(exports.FlipnoteAudioTrack.SE2, { ptr: ptr += trackSizes[1], length: trackSizes[2] });
    soundMeta.set(exports.FlipnoteAudioTrack.SE3, { ptr: ptr += trackSizes[2], length: trackSizes[3] });
    soundMeta.set(exports.FlipnoteAudioTrack.SE4, { ptr: ptr += trackSizes[3], length: trackSizes[4] });
    this.soundMeta = soundMeta;
};
/**
 * Default KWZ parser settings
 */
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
/**
 * File format type
 */
KwzParser.format = exports.FlipnoteFormat.KWZ;
/**
 * Animation frame width
 */
KwzParser.width = 320;
/**
 * Animation frame height
 */
KwzParser.height = 240;
/**
 * Animation frame aspect ratio
 */
KwzParser.aspect = 3 / 4;
/**
 * Number of animation frame layers
 */
KwzParser.numLayers = 3;
/**
 * Number of colors per layer (aside from transparent)
 */
KwzParser.numLayerColors = 2;
/**
 * Audio track base sample rate
 */
KwzParser.rawSampleRate = 16364;
/**
 * Audio output sample rate
 */
KwzParser.sampleRate = 32768;
/**
 * Which audio tracks are available in this format
 */
KwzParser.audioTracks = [
    exports.FlipnoteAudioTrack.BGM,
    exports.FlipnoteAudioTrack.SE1,
    exports.FlipnoteAudioTrack.SE2,
    exports.FlipnoteAudioTrack.SE3,
    exports.FlipnoteAudioTrack.SE4,
];
/**
 * Which sound effect tracks are available in this format
 */
KwzParser.soundEffectTracks = [
    exports.FlipnoteSoundEffectTrack.SE1,
    exports.FlipnoteSoundEffectTrack.SE2,
    exports.FlipnoteSoundEffectTrack.SE3,
    exports.FlipnoteSoundEffectTrack.SE4,
];
/**
 * Global animation frame color palette
 */
KwzParser.globalPalette = [
    KWZ_PALETTE.WHITE,
    KWZ_PALETTE.BLACK,
    KWZ_PALETTE.RED,
    KWZ_PALETTE.YELLOW,
    KWZ_PALETTE.GREEN,
    KWZ_PALETTE.BLUE,
    KWZ_PALETTE.NONE,
];
/**
 * Public key used for Flipnote verification, in PEM format
 */
KwzParser.publicKey = KWZ_PUBLIC_KEY;

/**
 * Indicates whether the input is a valid Flipnote Studio or Flipnote Studio 3D user ID.
 */
const isFsid = (fsid) => isPpmFsid(fsid) || isKwzFsid(fsid);
/**
 * Get the region for any valid Flipnote Studio or Flipnote Studio 3D user ID
 */
const getFsidRegion = (fsid) => {
    if (isPpmFsid(fsid))
        return getPpmFsidRegion(fsid);
    else if (isKwzFsid(fsid))
        return getKwzFsidRegion(fsid);
    return exports.FlipnoteRegion.UNKNOWN;
};
/**
 * Convert a PPM Flipnote Studio ID to the format used by KWZ Flipnote Studio IDs (as seen in Nintendo DSi Library Flipnotes).
 * Will return `null` if the conversion could not be made.
 *
 * :::tip
 * KWZ Flipnote Studio IDs contain an extra two characters at the beginning.
 * It is not possible to resolve these from a PPM Flipnote Studio ID.
 * :::
*/
const ppmFsidToKwzFsidSuffix = (fsid) => {
    if (isPpmFsid(fsid)) {
        const a = fsid.slice(14, 16);
        const b = fsid.slice(12, 14);
        const c = fsid.slice(10, 12);
        const d = fsid.slice(8, 10);
        const e = fsid.slice(6, 8);
        const f = fsid.slice(4, 6);
        const g = fsid.slice(2, 4);
        const h = fsid.slice(0, 2);
        return `${a}-${b}${c}-${d}${e}-${f}${g}${h}`.toLocaleLowerCase();
    }
    return null;
};
/**
 * Convert a PPM Flipnote Studio ID to an array of all possible matching KWZ Flipnote Studio IDs (as seen in Nintendo DSi Library Flipnotes).
 * Will return `null` if the conversion could not be made.
 */
const ppmFsidToPossibleKwzFsids = (fsid) => {
    const kwzIdSuffix = ppmFsidToKwzFsidSuffix(fsid);
    if (kwzIdSuffix) {
        return [
            '00' + kwzIdSuffix,
            '10' + kwzIdSuffix,
            '12' + kwzIdSuffix,
            '14' + kwzIdSuffix,
        ];
    }
    return null;
};
/**
 * Convert a KWZ Flipnote Studio ID (from a Nintendo DSi Library Flipnote) to the format used by PPM Flipnote Studio IDs.
 * Will return `null` if the conversion could not be made.
 */
const kwzFsidToPpmFsid = (fsid) => {
    if (isKwzDsiLibraryFsid(fsid)) {
        const a = fsid.slice(19, 21);
        const b = fsid.slice(17, 19);
        const c = fsid.slice(15, 17);
        const d = fsid.slice(12, 14);
        const e = fsid.slice(10, 12);
        const f = fsid.slice(7, 9);
        const g = fsid.slice(5, 7);
        const h = fsid.slice(2, 4);
        return `${a}${b}${c}${d}${e}${f}${g}${h}`.toUpperCase();
    }
    return null;
};

/**
 * ## Flipnote Studio IDs
 *
 * Flipnote Studio and Flipnote Studio 3D both generate a "unique" ID for the user when they first launch the app.
 * This ID is then saved into any Flipnotes they create, and was also used as their unique identifier when they went online.
 *
 * In both apps, your Flipnote Studio ID can be found in the settings menu.
 *
 * This module contains functions for working with those IDs.
 */

var index$3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getFsidRegion: getFsidRegion,
    getKwzFsidRegion: getKwzFsidRegion,
    getPpmFsidRegion: getPpmFsidRegion,
    isFsid: isFsid,
    isKwzDsiLibraryFsid: isKwzDsiLibraryFsid,
    isKwzFsid: isKwzFsid,
    isPpmFsid: isPpmFsid,
    kwzFsidFormat: kwzFsidFormat,
    kwzFsidToPpmFsid: kwzFsidToPpmFsid,
    kwzFsidUnformat: kwzFsidUnformat,
    ppmFsidToKwzFsidSuffix: ppmFsidToKwzFsidSuffix,
    ppmFsidToPossibleKwzFsids: ppmFsidToPossibleKwzFsids
});

const REGEX_PPM_LOCAL_FILENAME = /^[0-9A-Z]{1}[0-9A-F]{5}_[0-9A-F]{13}_[0-9]{3}$/;
const REGEX_PPM_FILENAME = /^[0-9A-F]{6}_[0-9A-F]{13}_[0-9]{3}$/;
/**
 * Determines if a string matches the PPM filename format.
 */
const isPpmFilename = (filename) => REGEX_PPM_LOCAL_FILENAME.test(filename);
/**
 * Does the same thing as {@link isPpmFilename}, expect it only matches "basic" filenames, without the checksum character that is added when saving a Flipnote to the filesystem.
 */
const isPpmBasicFilename = (filename) => REGEX_PPM_FILENAME.test(filename);
// TODO: checksum reverse-engineering and implementation

const REGEX_KWZ_FILENAME = /^[0-5a-z]{28}$/;
const BASE32_ALPHABET = 'cwmfjordvegbalksnthpyxquiz012345';
const base32Decode = (src) => {
    const srcSize = src.length;
    let srcPtr = 0;
    const dst = new Uint8Array(srcSize * 5 / 8);
    let dstPtr = 0;
    let value = 0;
    for (let i = 0; i < srcSize; i++) {
        value = (value << 5) | BASE32_ALPHABET.indexOf(src[i]);
        srcPtr += 5;
        if (srcPtr >= 8) {
            dst[dstPtr++] = (value >>> (srcPtr - 8)) & 0xFF;
            srcPtr -= 8;
        }
    }
    return dst;
};
const base32Encode = (src) => {
    const srcSize = src.byteLength;
    let srcPtr = 0;
    let dst = '';
    let value = 0;
    for (let i = 0; i < srcSize; i++) {
        value = (value << 8) | src[i];
        srcPtr += 8;
        while (srcPtr >= 5) {
            dst += BASE32_ALPHABET[(value >>> (srcPtr - 5)) & 31];
            srcPtr -= 5;
        }
    }
    if (srcPtr > 0)
        dst += BASE32_ALPHABET[(value << (5 - srcPtr)) & 31];
    return dst;
};
/**
 * Determines if a string matches the KWZ filename format.
 */
const isKwzFilename = (filename) => REGEX_KWZ_FILENAME.test(filename);
/**
 * Decode a KWZ filename into its constituent parts.
 */
const kwzFilenameDecode = (filename) => {
    const bytes = base32Decode(filename);
    const data = new DataView(bytes.buffer);
    const fsid = kwzFsidFormat(hexFromBytes(bytes.slice(0, 9)));
    const created = dateFromNintendoTimestamp(data.getUint32(9, true));
    const edited = dateFromNintendoTimestamp(data.getUint32(13, true));
    return { fsid, created, edited };
};
/**
 * Encode a KWZ filename from its parts; i.e. do the inverse of {@link kwzFilenameDecode}.
 */
const kwzFilenameEncode = (filename) => {
    const bytes = new Uint8Array(17);
    const data = new DataView(bytes.buffer);
    const fsid = kwzFsidUnformat(filename.fsid);
    bytes.set(hexToBytes(fsid));
    data.setUint32(9, dateToNintendoTimestamp(filename.created), true);
    data.setUint32(13, dateToNintendoTimestamp(filename.edited), true);
    return base32Encode(bytes);
};

/**
 * ## Flipnote Filenames
 *
 * Flipnote Studio and Flipnote Studio 3D both autogenerate filenames when Flipnotes are saved.
 * This module contains functions for testing and working with those Flipnote filenames.
 */

var index$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    isKwzFilename: isKwzFilename,
    isPpmBasicFilename: isPpmBasicFilename,
    isPpmFilename: isPpmFilename,
    kwzFilenameDecode: kwzFilenameDecode,
    kwzFilenameEncode: kwzFilenameEncode
});

const XOR_KEY = [
    0xF7, 0x4C, 0x6A, 0x3A, 0xFB, 0x82, 0xA6, 0x37,
    0x6E, 0x11, 0x38, 0xCF, 0xA0, 0xDD, 0x85, 0xC0,
    0xC7, 0x9B, 0xC4, 0xD8, 0xDD, 0x28, 0x8A, 0x87,
    0x53, 0x20, 0xEE, 0xE0, 0x0B, 0xEB, 0x43, 0xA0,
    0xDB, 0x55, 0x0F, 0x75, 0x36, 0x37, 0xEB, 0x35,
    0x6A, 0x34, 0x7F, 0xB5, 0x0F, 0x99, 0xF7, 0xEF,
    0x43, 0x25, 0xCE, 0xA0, 0x29, 0x46, 0xD9, 0xD4,
    0x4D, 0xBB, 0x04, 0x66, 0x68, 0x08, 0xF1, 0xF8,
];
class BasePlaylistParser extends DataStream {
    constructor(buffer) {
        super(buffer);
        /**
         * List of filepaths in the playlist.
         */
        this.entries = [];
    }
    addEntry(full) {
        const parts = full.split('/');
        const name = parts.at(-1);
        const lastDot = full.lastIndexOf('.');
        this.entries.push({
            full,
            name,
            base: full.slice(0, lastDot),
            ext: full.slice(lastDot + 1),
            folder: parts.at(-2),
            parentFolder: parts.at(-3)
        });
    }
}

/**
 * Parses .pls and .lst playlist files from Flipnote Studio (DSiWare).
 *
 * > This only supports playlists from version 2 of Flipnote Studio.
 * > Since version 1 was only ever released in Japan (and for a short period of time at that) I didn't bother including support.
 *
 * File format documentation is at https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/.pls-and-.lst-files
 */
class PpmPlaylist extends BasePlaylistParser {
    constructor(buffer) {
        super(buffer);
        this.format = exports.FlipnoteFormat.PPM;
        // Decrypt
        const bytes = this.bytes;
        const size = this.numBytes;
        for (let i = 0; i < size; i++)
            bytes[i] = bytes[i] ^ XOR_KEY[i % 64];
        // Parse
        let currPath = '';
        while (!this.end()) {
            const char = this.readChar();
            if (char === '\x0A') {
                this.addEntry(currPath);
                currPath = '';
                continue;
            }
            currPath += char;
        }
    }
}

/**
 * Parses .lst playlist files from Flipnote Studio 3D.
 *
 * File format documentation is at https://github.com/Flipnote-Collective/flipnote-studio-3d-docs/wiki/lst-format
 */
class KwzPlaylist extends BasePlaylistParser {
    constructor(buffer) {
        super(buffer);
        this.format = exports.FlipnoteFormat.KWZ;
        // Decrypt
        const bytes = this.bytes;
        const size = this.numBytes;
        for (let i = 0; i < size; i++)
            bytes[i] = bytes[i] ^ XOR_KEY[i % 61]; // Yes, the KWZ playlist format doesn't use the full key length.
        // Parse
        let currPath = '';
        this.seek(4);
        const separator = this.readWideChar();
        while (!this.end()) {
            const char = this.readWideChar();
            if (char === separator) {
                this.addEntry(currPath);
                currPath = '';
                continue;
            }
            currPath += char;
        }
    }
}

/**
 * Loader for web url strings (Browser only)
 * @group Loader
 */
const urlLoader = {
    name: 'url',
    matches(source) {
        return typeof source === 'string';
    },
    async load(source) {
        const response = await fetch(source);
        assert(response.status >= 200 && response.status < 300, `Failed to load Flipnote from URL, response failed with status ${response.status}`);
        return await response.arrayBuffer();
    }
};

/**
 * Loader for File objects (browser only)
 * @group Loader
 */
const fileLoader = {
    name: 'file',
    matches(source) {
        return isBrowser
            && typeof File !== 'undefined'
            && typeof FileReader !== 'undefined'
            && source instanceof File;
    },
    async load(source) {
        return source.arrayBuffer();
    }
};

/**
 * Loader for Blob objects (browser only)
 * @group Loader
 */
const blobLoader = {
    name: 'blob',
    matches(source) {
        return isBrowser
            && typeof Blob !== 'undefined'
            && typeof Response !== 'undefined'
            && source instanceof Blob;
    },
    async load(source) {
        return source.arrayBuffer();
    }
};

/**
 * Loader for Buffer objects (Node only)
 * @group Loader
 */
const nodeBufferLoader = {
    name: 'node-buffer',
    matches(source) {
        return isNode && (source instanceof Buffer);
    },
    async load(source) {
        return source.buffer;
    }
};

/**
 * Loader for ArrayBuffer objects.
 * @group Loader
 */
const arrayBufferLoader = {
    name: 'array-buffer',
    matches(source) {
        return source instanceof ArrayBuffer;
    },
    async load(source) {
        return source;
    }
};

const LOADER_REGISTRY = new Map();
/**
 * Resolve a source, using the current loaders list.
 * Returns an ArrayBuffer containing the data loaded from the source.
 */
const load = (source) => {
    for (let [name, loader] of LOADER_REGISTRY) {
        if (!loader.matches(source))
            continue;
        try {
            return loader.load(source);
        }
        catch (e) {
            err(`Failed to load Flipnote from source, loader "${name}" failed with error ${err}`);
        }
    }
    err('No loader available for source type');
};
/**
 * List all currently registered loaders, as an object.
 */
const list = () => Object.fromEntries(LOADER_REGISTRY.entries());
/**
 * Clear all currently registered loaders.
 */
const clear = () => LOADER_REGISTRY.clear();
/**
 * Register a resource loader to use when loading Flipnotes.
 * A loader should take a source and return an ArrayBuffer.
 */
const register = (loader) => {
    LOADER_REGISTRY.set(loader.name, loader);
};
register(arrayBufferLoader);
register(nodeBufferLoader);
register(blobLoader);
register(fileLoader);
register(urlLoader);

var index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    clear: clear,
    list: list,
    load: load,
    register: register
});

/**
 * Parse a playlist file (.pls or .lst) from Flipnote Studio or Flipnote Studio 3D.
 */
const parse$1 = async (format, source) => {
    const buffer = await load(source);
    if (format === exports.FlipnoteFormat.PPM || format === 'ppm')
        return new PpmPlaylist(buffer);
    if (format === exports.FlipnoteFormat.KWZ || format === 'kwz')
        return new KwzPlaylist(buffer);
};

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    KwzPlaylist: KwzPlaylist,
    PpmPlaylist: PpmPlaylist,
    parse: parse$1
});

/**
 * Load a Flipnote from a given source, returning a promise with a parser object.
 * It will auto-detect the Flipnote format and return either a {@link PpmParser} or {@link KwzParser} accordingly.
 *
 * @param source - Source to load a Flipnote from. This will attempt to use one of the registered {@link loaders} to load the Flipnote.
 * Depending on the operating environment, the default loader set supports the following sources:
 * - A string representing a web URL.
 * - An {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}.
 * - A {@link https://developer.mozilla.org/en-US/docs/Web/API/File | File} object (Browser only).
 * - A {@link https://nodejs.org/api/buffer.html | Buffer} object (NodeJS only).
 *
 * @param parserConfig - Config settings to pass to the parser, see {@link FlipnoteParserSettings}.
 */
const parse = async (source, parserConfig) => {
    const buffer = await load(source);
    if (PpmParser.matchBuffer(buffer))
        return new PpmParser(buffer, parserConfig);
    if (KwzParser.matchBuffer(buffer))
        return new KwzParser(buffer, parserConfig);
    err('Could not identify source as a valid Flipnote file');
};
/**
 * @deprecated Use {@link parse} instead.
 */
const parseSource = (...args) => {
    console.warn('parseSource() is deprecated, please use parse() instead');
    return parse(...args);
};

/**
 * Player event types
 */
exports.PlayerEvent = void 0;
(function (PlayerEvent) {
    PlayerEvent["__Any"] = "any";
    PlayerEvent["Play"] = "play";
    PlayerEvent["Pause"] = "pause";
    PlayerEvent["CanPlay"] = "canplay";
    PlayerEvent["CanPlayThrough"] = "canplaythrough";
    PlayerEvent["SeekStart"] = "seeking";
    PlayerEvent["SeekEnd"] = "seeked";
    PlayerEvent["Duration"] = "durationchange";
    PlayerEvent["Loop"] = "loop";
    PlayerEvent["Ended"] = "ended";
    PlayerEvent["VolumeChange"] = "volumechange";
    PlayerEvent["Progress"] = "progress";
    PlayerEvent["TimeUpdate"] = "timeupdate";
    PlayerEvent["FrameUpdate"] = "frameupdate";
    PlayerEvent["FrameNext"] = "framenext";
    PlayerEvent["FramePrev"] = "frameprev";
    PlayerEvent["FrameFirst"] = "framefirst";
    PlayerEvent["FrameLast"] = "framelast";
    PlayerEvent["Ready"] = "ready";
    PlayerEvent["Load"] = "load";
    PlayerEvent["LoadStart"] = "loadstart";
    PlayerEvent["LoadedData"] = "loadeddata";
    PlayerEvent["LoadedMeta"] = "loadedmetadata";
    PlayerEvent["Emptied"] = "emptied";
    PlayerEvent["Close"] = "close";
    PlayerEvent["Error"] = "error";
    PlayerEvent["Destroy"] = "destroy";
})(exports.PlayerEvent || (exports.PlayerEvent = {}));
/**
 * @internal
 */
const supportedEvents = [
    exports.PlayerEvent.Play,
    exports.PlayerEvent.Pause,
    exports.PlayerEvent.CanPlay,
    exports.PlayerEvent.CanPlayThrough,
    exports.PlayerEvent.SeekStart,
    exports.PlayerEvent.SeekEnd,
    exports.PlayerEvent.Duration,
    exports.PlayerEvent.Loop,
    exports.PlayerEvent.Ended,
    exports.PlayerEvent.VolumeChange,
    exports.PlayerEvent.Progress,
    exports.PlayerEvent.TimeUpdate,
    exports.PlayerEvent.FrameUpdate,
    exports.PlayerEvent.FrameNext,
    exports.PlayerEvent.FramePrev,
    exports.PlayerEvent.FrameFirst,
    exports.PlayerEvent.FrameLast,
    exports.PlayerEvent.Ready,
    exports.PlayerEvent.Load,
    exports.PlayerEvent.LoadStart,
    exports.PlayerEvent.LoadedData,
    exports.PlayerEvent.LoadedMeta,
    exports.PlayerEvent.Emptied,
    exports.PlayerEvent.Close,
    exports.PlayerEvent.Error,
];

/**
 * @internal
 */
const createTimeRanges = (ranges) => ({
    length: ranges.length,
    start: (i) => ranges[i][0],
    end: (i) => ranges[i][1],
});
/**
 * @internal
 */
const padNumber = (num, strLength) => num.toString().padStart(strLength, '0');
/**
 * @internal
 */
const formatTime = (seconds) => {
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${padNumber(s, 2)}`;
};

exports.CanvasStereoscopicMode = void 0;
(function (CanvasStereoscopicMode) {
    CanvasStereoscopicMode[CanvasStereoscopicMode["None"] = 0] = "None";
    CanvasStereoscopicMode[CanvasStereoscopicMode["Dual"] = 1] = "Dual";
    // not actually supported, sorry!
    CanvasStereoscopicMode[CanvasStereoscopicMode["Anaglyph"] = 2] = "Anaglyph";
})(exports.CanvasStereoscopicMode || (exports.CanvasStereoscopicMode = {}));
/**
 * @internal
 */
class CanvasInterface {
    constructor(parent, width, height, options) { }
}

/* @license twgl.js 5.5.4 Copyright (c) 2015, Gregg Tavares All Rights Reserved.
Available via the MIT license.
see: http://github.com/greggman/twgl.js for details */
/*
 * Copyright 2019 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */


/*
 * Copyright 2019 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/* DataType */
const BYTE$2                           = 0x1400;
const UNSIGNED_BYTE$3                  = 0x1401;
const SHORT$2                          = 0x1402;
const UNSIGNED_SHORT$3                 = 0x1403;
const INT$3                            = 0x1404;
const UNSIGNED_INT$3                   = 0x1405;
const FLOAT$3                          = 0x1406;
const UNSIGNED_SHORT_4_4_4_4$1       = 0x8033;
const UNSIGNED_SHORT_5_5_5_1$1       = 0x8034;
const UNSIGNED_SHORT_5_6_5$1         = 0x8363;
const HALF_FLOAT$1                   = 0x140B;
const UNSIGNED_INT_2_10_10_10_REV$1  = 0x8368;
const UNSIGNED_INT_10F_11F_11F_REV$1 = 0x8C3B;
const UNSIGNED_INT_5_9_9_9_REV$1     = 0x8C3E;
const FLOAT_32_UNSIGNED_INT_24_8_REV$1 = 0x8DAD;
const UNSIGNED_INT_24_8$1            = 0x84FA;

const glTypeToTypedArray = {};
{
  const tt = glTypeToTypedArray;
  tt[BYTE$2]                           = Int8Array;
  tt[UNSIGNED_BYTE$3]                  = Uint8Array;
  tt[SHORT$2]                          = Int16Array;
  tt[UNSIGNED_SHORT$3]                 = Uint16Array;
  tt[INT$3]                            = Int32Array;
  tt[UNSIGNED_INT$3]                   = Uint32Array;
  tt[FLOAT$3]                          = Float32Array;
  tt[UNSIGNED_SHORT_4_4_4_4$1]         = Uint16Array;
  tt[UNSIGNED_SHORT_5_5_5_1$1]         = Uint16Array;
  tt[UNSIGNED_SHORT_5_6_5$1]           = Uint16Array;
  tt[HALF_FLOAT$1]                     = Uint16Array;
  tt[UNSIGNED_INT_2_10_10_10_REV$1]    = Uint32Array;
  tt[UNSIGNED_INT_10F_11F_11F_REV$1]   = Uint32Array;
  tt[UNSIGNED_INT_5_9_9_9_REV$1]       = Uint32Array;
  tt[FLOAT_32_UNSIGNED_INT_24_8_REV$1] = Uint32Array;
  tt[UNSIGNED_INT_24_8$1]              = Uint32Array;
}

/**
 * Get the GL type for a typedArray
 * @param {ArrayBufferView} typedArray a typedArray
 * @return {number} the GL type for array. For example pass in an `Int8Array` and `gl.BYTE` will
 *   be returned. Pass in a `Uint32Array` and `gl.UNSIGNED_INT` will be returned
 * @memberOf module:twgl/typedArray
 */
function getGLTypeForTypedArray(typedArray) {
  if (typedArray instanceof Int8Array)         { return BYTE$2; }           // eslint-disable-line
  if (typedArray instanceof Uint8Array)        { return UNSIGNED_BYTE$3; }  // eslint-disable-line
  if (typedArray instanceof Uint8ClampedArray) { return UNSIGNED_BYTE$3; }  // eslint-disable-line
  if (typedArray instanceof Int16Array)        { return SHORT$2; }          // eslint-disable-line
  if (typedArray instanceof Uint16Array)       { return UNSIGNED_SHORT$3; } // eslint-disable-line
  if (typedArray instanceof Int32Array)        { return INT$3; }            // eslint-disable-line
  if (typedArray instanceof Uint32Array)       { return UNSIGNED_INT$3; }   // eslint-disable-line
  if (typedArray instanceof Float32Array)      { return FLOAT$3; }          // eslint-disable-line
  throw new Error('unsupported typed array type');
}

/**
 * Get the GL type for a typedArray type
 * @param {ArrayBufferView} typedArrayType a typedArray constructor
 * @return {number} the GL type for type. For example pass in `Int8Array` and `gl.BYTE` will
 *   be returned. Pass in `Uint32Array` and `gl.UNSIGNED_INT` will be returned
 * @memberOf module:twgl/typedArray
 */
function getGLTypeForTypedArrayType(typedArrayType) {
  if (typedArrayType === Int8Array)         { return BYTE$2; }           // eslint-disable-line
  if (typedArrayType === Uint8Array)        { return UNSIGNED_BYTE$3; }  // eslint-disable-line
  if (typedArrayType === Uint8ClampedArray) { return UNSIGNED_BYTE$3; }  // eslint-disable-line
  if (typedArrayType === Int16Array)        { return SHORT$2; }          // eslint-disable-line
  if (typedArrayType === Uint16Array)       { return UNSIGNED_SHORT$3; } // eslint-disable-line
  if (typedArrayType === Int32Array)        { return INT$3; }            // eslint-disable-line
  if (typedArrayType === Uint32Array)       { return UNSIGNED_INT$3; }   // eslint-disable-line
  if (typedArrayType === Float32Array)      { return FLOAT$3; }          // eslint-disable-line
  throw new Error('unsupported typed array type');
}

/**
 * Get the typed array constructor for a given GL type
 * @param {number} type the GL type. (eg: `gl.UNSIGNED_INT`)
 * @return {function} the constructor for a the corresponding typed array. (eg. `Uint32Array`).
 * @memberOf module:twgl/typedArray
 */
function getTypedArrayTypeForGLType(type) {
  const CTOR = glTypeToTypedArray[type];
  if (!CTOR) {
    throw new Error('unknown gl type');
  }
  return CTOR;
}

const isArrayBuffer$1 = typeof SharedArrayBuffer !== 'undefined'
  ? function isArrayBufferOrSharedArrayBuffer(a) {
    return a && a.buffer && (a.buffer instanceof ArrayBuffer || a.buffer instanceof SharedArrayBuffer);
  }
  : function isArrayBuffer(a) {
    return a && a.buffer && a.buffer instanceof ArrayBuffer;
  };

const isTypeWeakMaps = new Map();

function isType(object, type) {
  if (!object || typeof object !== 'object') {
    return false;
  }
  let weakMap = isTypeWeakMaps.get(type);
  if (!weakMap) {
    weakMap = new WeakMap();
    isTypeWeakMaps.set(type, weakMap);
  }
  let isOfType = weakMap.get(object);
  if (isOfType === undefined) {
    const s = Object.prototype.toString.call(object);
    isOfType = s.substring(8, s.length - 1) === type;
    weakMap.set(object, isOfType);
  }
  return isOfType;
}

function isBuffer(gl, t) {
  return typeof WebGLBuffer !== 'undefined' && isType(t, 'WebGLBuffer');
}

function isTexture(gl, t) {
  return typeof WebGLTexture !== 'undefined' && isType(t, 'WebGLTexture');
}

/*
 * Copyright 2019 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

const STATIC_DRAW                  = 0x88e4;
const ARRAY_BUFFER$1                 = 0x8892;
const ELEMENT_ARRAY_BUFFER$2         = 0x8893;
const BUFFER_SIZE                  = 0x8764;

const BYTE$1                         = 0x1400;
const UNSIGNED_BYTE$2                = 0x1401;
const SHORT$1                        = 0x1402;
const UNSIGNED_SHORT$2               = 0x1403;
const INT$2                          = 0x1404;
const UNSIGNED_INT$2                 = 0x1405;
const FLOAT$2                        = 0x1406;
const defaults$2 = {
  attribPrefix: "",
};

function setBufferFromTypedArray(gl, type, buffer, array, drawType) {
  gl.bindBuffer(type, buffer);
  gl.bufferData(type, array, drawType || STATIC_DRAW);
}

/**
 * Given typed array creates a WebGLBuffer and copies the typed array
 * into it.
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext
 * @param {ArrayBuffer|SharedArrayBuffer|ArrayBufferView|WebGLBuffer} typedArray the typed array. Note: If a WebGLBuffer is passed in it will just be returned. No action will be taken
 * @param {number} [type] the GL bind type for the buffer. Default = `gl.ARRAY_BUFFER`.
 * @param {number} [drawType] the GL draw type for the buffer. Default = 'gl.STATIC_DRAW`.
 * @return {WebGLBuffer} the created WebGLBuffer
 * @memberOf module:twgl/attributes
 */
function createBufferFromTypedArray(gl, typedArray, type, drawType) {
  if (isBuffer(gl, typedArray)) {
    return typedArray;
  }
  type = type || ARRAY_BUFFER$1;
  const buffer = gl.createBuffer();
  setBufferFromTypedArray(gl, type, buffer, typedArray, drawType);
  return buffer;
}

function isIndices(name) {
  return name === "indices";
}

// This is really just a guess. Though I can't really imagine using
// anything else? Maybe for some compression?
function getNormalizationForTypedArrayType(typedArrayType) {
  if (typedArrayType === Int8Array)    { return true; }  // eslint-disable-line
  if (typedArrayType === Uint8Array)   { return true; }  // eslint-disable-line
  return false;
}

function getArray$1(array) {
  return array.length ? array : array.data;
}

const texcoordRE = /coord|texture/i;
const colorRE = /color|colour/i;

function guessNumComponentsFromName(name, length) {
  let numComponents;
  if (texcoordRE.test(name)) {
    numComponents = 2;
  } else if (colorRE.test(name)) {
    numComponents = 4;
  } else {
    numComponents = 3;  // position, normals, indices ...
  }

  if (length % numComponents > 0) {
    throw new Error(`Can not guess numComponents for attribute '${name}'. Tried ${numComponents} but ${length} values is not evenly divisible by ${numComponents}. You should specify it.`);
  }

  return numComponents;
}

function getNumComponents$1(array, arrayName, numValues) {
  return array.numComponents || array.size || guessNumComponentsFromName(arrayName, numValues || getArray$1(array).length);
}

function makeTypedArray(array, name) {
  if (isArrayBuffer$1(array)) {
    return array;
  }

  if (isArrayBuffer$1(array.data)) {
    return array.data;
  }

  if (Array.isArray(array)) {
    array = {
      data: array,
    };
  }

  let Type = array.type ? typedArrayTypeFromGLTypeOrTypedArrayCtor(array.type) : undefined;
  if (!Type) {
    if (isIndices(name)) {
      Type = Uint16Array;
    } else {
      Type = Float32Array;
    }
  }
  return new Type(array.data);
}

function glTypeFromGLTypeOrTypedArrayType(glTypeOrTypedArrayCtor) {
  return typeof glTypeOrTypedArrayCtor === 'number'
      ? glTypeOrTypedArrayCtor
      : glTypeOrTypedArrayCtor ? getGLTypeForTypedArrayType(glTypeOrTypedArrayCtor) : FLOAT$2;
}

function typedArrayTypeFromGLTypeOrTypedArrayCtor(glTypeOrTypedArrayCtor) {
  return typeof glTypeOrTypedArrayCtor === 'number'
      ? getTypedArrayTypeForGLType(glTypeOrTypedArrayCtor)
      : glTypeOrTypedArrayCtor || Float32Array;
}

function attribBufferFromBuffer(gl, array/*, arrayName */) {
  return {
    buffer: array.buffer,
    numValues: 2 * 3 * 4,  // safely divided by 2, 3, 4
    type: glTypeFromGLTypeOrTypedArrayType(array.type),
    arrayType: typedArrayTypeFromGLTypeOrTypedArrayCtor(array.type),
  };
}

function attribBufferFromSize(gl, array/*, arrayName*/) {
  const numValues = array.data || array;
  const arrayType = typedArrayTypeFromGLTypeOrTypedArrayCtor(array.type);
  const numBytes = numValues * arrayType.BYTES_PER_ELEMENT;
  const buffer = gl.createBuffer();
  gl.bindBuffer(ARRAY_BUFFER$1, buffer);
  gl.bufferData(ARRAY_BUFFER$1, numBytes, array.drawType || STATIC_DRAW);
  return {
    buffer,
    numValues,
    type: getGLTypeForTypedArrayType(arrayType),
    arrayType,
  };
}

function attribBufferFromArrayLike(gl, array, arrayName) {
  const typedArray = makeTypedArray(array, arrayName);
  return {
    arrayType: typedArray.constructor,
    buffer: createBufferFromTypedArray(gl, typedArray, undefined, array.drawType),
    type: getGLTypeForTypedArray(typedArray),
    numValues: 0,
  };
}

/**
 * The info for an attribute. This is effectively just the arguments to `gl.vertexAttribPointer` plus the WebGLBuffer
 * for the attribute.
 *
 * @typedef {Object} AttribInfo
 * @property {number[]|ArrayBufferView} [value] a constant value for the attribute. Note: if this is set the attribute will be
 *    disabled and set to this constant value and all other values will be ignored.
 * @property {number} [numComponents] the number of components for this attribute.
 * @property {number} [size] synonym for `numComponents`.
 * @property {number} [type] the type of the attribute (eg. `gl.FLOAT`, `gl.UNSIGNED_BYTE`, etc...) Default = `gl.FLOAT`
 * @property {boolean} [normalize] whether or not to normalize the data. Default = false
 * @property {number} [offset] offset into buffer in bytes. Default = 0
 * @property {number} [stride] the stride in bytes per element. Default = 0
 * @property {number} [divisor] the divisor in instances. Default = 0.
 *    Requires WebGL2 or the ANGLE_instanced_arrays extension.
 *    and, if you're using WebGL1 you must have called {@link module:twgl.addExtensionsToContext}
 * @property {WebGLBuffer} buffer the buffer that contains the data for this attribute
 * @property {number} [drawType] the draw type passed to gl.bufferData. Default = gl.STATIC_DRAW
 * @memberOf module:twgl
 */

/**
 * @typedef {(Int8ArrayConstructor|Uint8ArrayConstructor|Int16ArrayConstructor|Uint16ArrayConstructor|Int32ArrayConstructor|Uint32ArrayConstructor|Float32ArrayConstructor)} TypedArrayConstructor
 */

/**
 * Use this type of array spec when TWGL can't guess the type or number of components of an array
 * @typedef {Object} FullArraySpec
 * @property {number[]|ArrayBufferView} [value] a constant value for the attribute. Note: if this is set the attribute will be
 *    disabled and set to this constant value and all other values will be ignored.
 * @property {(number|number[]|ArrayBufferView)} [data] The data of the array. A number alone becomes the number of elements of type.
 * @property {number} [numComponents] number of components for `vertexAttribPointer`. Default is based on the name of the array.
 *    If `coord` is in the name assumes `numComponents = 2`.
 *    If `color` is in the name assumes `numComponents = 4`.
 *    otherwise assumes `numComponents = 3`
 * @property {number|TypedArrayConstructor} [type] type. This is used if `data` is a JavaScript array, or `buffer` is passed in, or `data` is a number.
 *   It can either be the constructor for a typedarray. (eg. `Uint8Array`) OR a WebGL type, (eg `gl.UNSIGNED_BYTE`).
 *   For example if you want colors in a `Uint8Array` you might have a `FullArraySpec` like `{ type: gl.UNSIGNED_BYTE, data: [255,0,255,255, ...], }`.
 * @property {number} [size] synonym for `numComponents`.
 * @property {boolean} [normalize] normalize for `vertexAttribPointer`. Default is true if type is `Int8Array` or `Uint8Array` otherwise false.
 * @property {number} [stride] stride for `vertexAttribPointer`. Default = 0
 * @property {number} [offset] offset for `vertexAttribPointer`. Default = 0
 * @property {number} [divisor] divisor for `vertexAttribDivisor`. Default = 0.
 *     Requires WebGL2 or the ANGLE_instanced_arrays extension.
 *     and, if you using WebGL1 you must have called {@link module:twgl.addExtensionsToContext}
 * @property {string} [attrib] name of attribute this array maps to. Defaults to same name as array prefixed by the default attribPrefix.
 * @property {string} [name] synonym for `attrib`.
 * @property {string} [attribName] synonym for `attrib`.
 * @property {WebGLBuffer} [buffer] Buffer to use for this attribute. This lets you use your own buffer
 *    but you will need to supply `numComponents` and `type`. You can effectively pass an `AttribInfo`
 *    to provide this. Example:
 *
 *         const bufferInfo1 = twgl.createBufferInfoFromArrays(gl, {
 *           position: [1, 2, 3, ... ],
 *         });
 *         const bufferInfo2 = twgl.createBufferInfoFromArrays(gl, {
 *           position: bufferInfo1.attribs.position,  // use the same buffer from bufferInfo1
 *         });
 *
 * @property {number} [drawType] the draw type passed to gl.bufferData. Default = gl.STATIC_DRAW
 * @memberOf module:twgl
 */

/**
 * An individual array in {@link module:twgl.Arrays}
 *
 * When passed to {@link module:twgl.createBufferInfoFromArrays} if an ArraySpec is `number[]` or `ArrayBufferView`
 * the types will be guessed based on the name. `indices` will be `Uint16Array`, everything else will
 * be `Float32Array`. If an ArraySpec is a number it's the number of floats for an empty (zeroed) buffer.
 *
 * @typedef {(number|number[]|ArrayBufferView|module:twgl.FullArraySpec)} ArraySpec
 * @memberOf module:twgl
 */

/**
 * This is a JavaScript object of arrays by name. The names should match your shader's attributes. If your
 * attributes have a common prefix you can specify it by calling {@link module:twgl.setAttributePrefix}.
 *
 *     Bare JavaScript Arrays
 *
 *         var arrays = {
 *            position: [-1, 1, 0],
 *            normal: [0, 1, 0],
 *            ...
 *         }
 *
 *     Bare TypedArrays
 *
 *         var arrays = {
 *            position: new Float32Array([-1, 1, 0]),
 *            color: new Uint8Array([255, 128, 64, 255]),
 *            ...
 *         }
 *
 * *   Will guess at `numComponents` if not specified based on name.
 *
 *     If `coord` is in the name assumes `numComponents = 2`
 *
 *     If `color` is in the name assumes `numComponents = 4`
 *
 *     otherwise assumes `numComponents = 3`
 *
 * Objects with various fields. See {@link module:twgl.FullArraySpec}.
 *
 *     var arrays = {
 *       position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
 *       texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
 *       normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],     },
 *       indices:  { numComponents: 3, data: [0, 1, 2, 1, 2, 3],                       },
 *     };
 *
 * @typedef {Object.<string, module:twgl.ArraySpec>} Arrays
 * @memberOf module:twgl
 */


/**
 * Creates a set of attribute data and WebGLBuffers from set of arrays
 *
 * Given
 *
 *      var arrays = {
 *        position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
 *        texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
 *        normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],     },
 *        color:    { numComponents: 4, data: [255, 255, 255, 255, 255, 0, 0, 255, 0, 0, 255, 255], type: Uint8Array, },
 *        indices:  { numComponents: 3, data: [0, 1, 2, 1, 2, 3],                       },
 *      };
 *
 * returns something like
 *
 *      var attribs = {
 *        position: { numComponents: 3, type: gl.FLOAT,         normalize: false, buffer: WebGLBuffer, },
 *        texcoord: { numComponents: 2, type: gl.FLOAT,         normalize: false, buffer: WebGLBuffer, },
 *        normal:   { numComponents: 3, type: gl.FLOAT,         normalize: false, buffer: WebGLBuffer, },
 *        color:    { numComponents: 4, type: gl.UNSIGNED_BYTE, normalize: true,  buffer: WebGLBuffer, },
 *      };
 *
 * notes:
 *
 * *   Arrays can take various forms
 *
 *     Bare JavaScript Arrays
 *
 *         var arrays = {
 *            position: [-1, 1, 0],
 *            normal: [0, 1, 0],
 *            ...
 *         }
 *
 *     Bare TypedArrays
 *
 *         var arrays = {
 *            position: new Float32Array([-1, 1, 0]),
 *            color: new Uint8Array([255, 128, 64, 255]),
 *            ...
 *         }
 *
 * *   Will guess at `numComponents` if not specified based on name.
 *
 *     If `coord` is in the name assumes `numComponents = 2`
 *
 *     If `color` is in the name assumes `numComponents = 4`
 *
 *     otherwise assumes `numComponents = 3`
 *
 * @param {WebGLRenderingContext} gl The webgl rendering context.
 * @param {module:twgl.Arrays} arrays The arrays
 * @param {module:twgl.BufferInfo} [srcBufferInfo] a BufferInfo to copy from
 *   This lets you share buffers. Any arrays you supply will override
 *   the buffers from srcBufferInfo.
 * @return {Object.<string, module:twgl.AttribInfo>} the attribs
 * @memberOf module:twgl/attributes
 */
function createAttribsFromArrays(gl, arrays) {
  const attribs = {};
  Object.keys(arrays).forEach(function(arrayName) {
    if (!isIndices(arrayName)) {
      const array = arrays[arrayName];
      const attribName = array.attrib || array.name || array.attribName || (defaults$2.attribPrefix + arrayName);
      if (array.value) {
        if (!Array.isArray(array.value) && !isArrayBuffer$1(array.value)) {
          throw new Error('array.value is not array or typedarray');
        }
        attribs[attribName] = {
          value: array.value,
        };
      } else {
        let fn;
        if (array.buffer && array.buffer instanceof WebGLBuffer) {
          fn = attribBufferFromBuffer;
        } else if (typeof array === "number" || typeof array.data === "number") {
          fn = attribBufferFromSize;
        } else {
          fn = attribBufferFromArrayLike;
        }
        const {buffer, type, numValues, arrayType} = fn(gl, array, arrayName);
        const normalization = array.normalize !== undefined ? array.normalize : getNormalizationForTypedArrayType(arrayType);
        const numComponents = getNumComponents$1(array, arrayName, numValues);
        attribs[attribName] = {
          buffer:        buffer,
          numComponents: numComponents,
          type:          type,
          normalize:     normalization,
          stride:        array.stride || 0,
          offset:        array.offset || 0,
          divisor:       array.divisor === undefined ? undefined : array.divisor,
          drawType:      array.drawType,
        };
      }
    }
  });
  gl.bindBuffer(ARRAY_BUFFER$1, null);
  return attribs;
}

function getBytesPerValueForGLType(gl, type) {
  if (type === BYTE$1)           return 1;  // eslint-disable-line
  if (type === UNSIGNED_BYTE$2)  return 1;  // eslint-disable-line
  if (type === SHORT$1)          return 2;  // eslint-disable-line
  if (type === UNSIGNED_SHORT$2) return 2;  // eslint-disable-line
  if (type === INT$2)            return 4;  // eslint-disable-line
  if (type === UNSIGNED_INT$2)   return 4;  // eslint-disable-line
  if (type === FLOAT$2)          return 4;  // eslint-disable-line
  return 0;
}

// Tries to get the number of elements from a set of arrays.
const positionKeys = ['position', 'positions', 'a_position'];

function getNumElementsFromAttributes(gl, attribs) {
  let key;
  let ii;
  for (ii = 0; ii < positionKeys.length; ++ii) {
    key = positionKeys[ii];
    if (key in attribs) {
      break;
    }
    key = defaults$2.attribPrefix + key;
    if (key in attribs) {
      break;
    }
  }
  if (ii === positionKeys.length) {
    key = Object.keys(attribs)[0];
  }
  const attrib = attribs[key];
  if (!attrib.buffer) {
    return 1; // There's no buffer
  }
  gl.bindBuffer(ARRAY_BUFFER$1, attrib.buffer);
  const numBytes = gl.getBufferParameter(ARRAY_BUFFER$1, BUFFER_SIZE);
  gl.bindBuffer(ARRAY_BUFFER$1, null);

  const bytesPerValue = getBytesPerValueForGLType(gl, attrib.type);
  const totalElements = numBytes / bytesPerValue;
  const numComponents = attrib.numComponents || attrib.size;
  // TODO: check stride
  const numElements = totalElements / numComponents;
  if (numElements % 1 !== 0) {
    throw new Error(`numComponents ${numComponents} not correct for length ${length}`);
  }
  return numElements;
}

/**
 * @typedef {Object} BufferInfo
 * @property {number} numElements The number of elements to pass to `gl.drawArrays` or `gl.drawElements`.
 * @property {number} [elementType] The type of indices `UNSIGNED_BYTE`, `UNSIGNED_SHORT` etc..
 * @property {WebGLBuffer} [indices] The indices `ELEMENT_ARRAY_BUFFER` if any indices exist.
 * @property {Object.<string, module:twgl.AttribInfo>} [attribs] The attribs appropriate to call `setAttributes`
 * @memberOf module:twgl
 */

/**
 * Creates a BufferInfo from an object of arrays.
 *
 * This can be passed to {@link module:twgl.setBuffersAndAttributes} and to
 * {@link module:twgl:drawBufferInfo}.
 *
 * Given an object like
 *
 *     var arrays = {
 *       position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
 *       texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
 *       normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],     },
 *       indices:  { numComponents: 3, data: [0, 1, 2, 1, 2, 3],                       },
 *     };
 *
 *  Creates an BufferInfo like this
 *
 *     bufferInfo = {
 *       numElements: 4,        // or whatever the number of elements is
 *       indices: WebGLBuffer,  // this property will not exist if there are no indices
 *       attribs: {
 *         position: { buffer: WebGLBuffer, numComponents: 3, },
 *         normal:   { buffer: WebGLBuffer, numComponents: 3, },
 *         texcoord: { buffer: WebGLBuffer, numComponents: 2, },
 *       },
 *     };
 *
 *  The properties of arrays can be JavaScript arrays in which case the number of components
 *  will be guessed.
 *
 *     var arrays = {
 *        position: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0],
 *        texcoord: [0, 0, 0, 1, 1, 0, 1, 1],
 *        normal:   [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
 *        indices:  [0, 1, 2, 1, 2, 3],
 *     };
 *
 *  They can also be TypedArrays
 *
 *     var arrays = {
 *        position: new Float32Array([0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0]),
 *        texcoord: new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]),
 *        normal:   new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]),
 *        indices:  new Uint16Array([0, 1, 2, 1, 2, 3]),
 *     };
 *
 *  Or AugmentedTypedArrays
 *
 *     var positions = createAugmentedTypedArray(3, 4);
 *     var texcoords = createAugmentedTypedArray(2, 4);
 *     var normals   = createAugmentedTypedArray(3, 4);
 *     var indices   = createAugmentedTypedArray(3, 2, Uint16Array);
 *
 *     positions.push([0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0]);
 *     texcoords.push([0, 0, 0, 1, 1, 0, 1, 1]);
 *     normals.push([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);
 *     indices.push([0, 1, 2, 1, 2, 3]);
 *
 *     var arrays = {
 *        position: positions,
 *        texcoord: texcoords,
 *        normal:   normals,
 *        indices:  indices,
 *     };
 *
 * For the last example it is equivalent to
 *
 *     var bufferInfo = {
 *       attribs: {
 *         position: { numComponents: 3, buffer: gl.createBuffer(), },
 *         texcoord: { numComponents: 2, buffer: gl.createBuffer(), },
 *         normal: { numComponents: 3, buffer: gl.createBuffer(), },
 *       },
 *       indices: gl.createBuffer(),
 *       numElements: 6,
 *     };
 *
 *     gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.position.buffer);
 *     gl.bufferData(gl.ARRAY_BUFFER, arrays.position, gl.STATIC_DRAW);
 *     gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.texcoord.buffer);
 *     gl.bufferData(gl.ARRAY_BUFFER, arrays.texcoord, gl.STATIC_DRAW);
 *     gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.normal.buffer);
 *     gl.bufferData(gl.ARRAY_BUFFER, arrays.normal, gl.STATIC_DRAW);
 *     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferInfo.indices);
 *     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, arrays.indices, gl.STATIC_DRAW);
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext
 * @param {module:twgl.Arrays} arrays Your data
 * @param {module:twgl.BufferInfo} [srcBufferInfo] An existing
 *        buffer info to start from. WebGLBuffers etc specified
 *        in the srcBufferInfo will be used in a new BufferInfo
 *        with any arrays specified overriding the ones in
 *        srcBufferInfo.
 * @return {module:twgl.BufferInfo} A BufferInfo
 * @memberOf module:twgl/attributes
 */
function createBufferInfoFromArrays(gl, arrays, srcBufferInfo) {
  const newAttribs = createAttribsFromArrays(gl, arrays);
  const bufferInfo = Object.assign({}, srcBufferInfo ? srcBufferInfo : {});
  bufferInfo.attribs = Object.assign({}, srcBufferInfo ? srcBufferInfo.attribs : {}, newAttribs);
  const indices = arrays.indices;
  if (indices) {
    const newIndices = makeTypedArray(indices, "indices");
    bufferInfo.indices = createBufferFromTypedArray(gl, newIndices, ELEMENT_ARRAY_BUFFER$2);
    bufferInfo.numElements = newIndices.length;
    bufferInfo.elementType = getGLTypeForTypedArray(newIndices);
  } else if (!bufferInfo.numElements) {
    bufferInfo.numElements = getNumElementsFromAttributes(gl, bufferInfo.attribs);
  }

  return bufferInfo;
}

/*
 * Copyright 2019 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/**
 * Gets the gl version as a number
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext
 * @return {number} version of gl
 * @private
 */
//function getVersionAsNumber(gl) {
//  return parseFloat(gl.getParameter(gl.VERSION).substr(6));
//}

/**
 * Check if context is WebGL 2.0
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext
 * @return {bool} true if it's WebGL 2.0
 * @memberOf module:twgl
 */
function isWebGL2(gl) {
  // This is the correct check but it's slow
  //  return gl.getParameter(gl.VERSION).indexOf("WebGL 2.0") === 0;
  // This might also be the correct check but I'm assuming it's slow-ish
  // return gl instanceof WebGL2RenderingContext;
  return !!gl.texStorage2D;
}

const TEXTURE0                       = 0x84c0;

const ARRAY_BUFFER                   = 0x8892;
const ELEMENT_ARRAY_BUFFER$1           = 0x8893;

const ACTIVE_UNIFORMS                = 0x8b86;
const ACTIVE_ATTRIBUTES              = 0x8b89;
const TRANSFORM_FEEDBACK_VARYINGS    = 0x8c83;
const ACTIVE_UNIFORM_BLOCKS          = 0x8a36;
const UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER   = 0x8a44;
const UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER = 0x8a46;
const UNIFORM_BLOCK_DATA_SIZE                     = 0x8a40;
const UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES        = 0x8a43;

const FLOAT                         = 0x1406;
const FLOAT_VEC2                    = 0x8B50;
const FLOAT_VEC3                    = 0x8B51;
const FLOAT_VEC4                    = 0x8B52;
const INT                           = 0x1404;
const INT_VEC2                      = 0x8B53;
const INT_VEC3                      = 0x8B54;
const INT_VEC4                      = 0x8B55;
const BOOL                          = 0x8B56;
const BOOL_VEC2                     = 0x8B57;
const BOOL_VEC3                     = 0x8B58;
const BOOL_VEC4                     = 0x8B59;
const FLOAT_MAT2                    = 0x8B5A;
const FLOAT_MAT3                    = 0x8B5B;
const FLOAT_MAT4                    = 0x8B5C;
const SAMPLER_2D                    = 0x8B5E;
const SAMPLER_CUBE                  = 0x8B60;
const SAMPLER_3D                    = 0x8B5F;
const SAMPLER_2D_SHADOW             = 0x8B62;
const FLOAT_MAT2x3                  = 0x8B65;
const FLOAT_MAT2x4                  = 0x8B66;
const FLOAT_MAT3x2                  = 0x8B67;
const FLOAT_MAT3x4                  = 0x8B68;
const FLOAT_MAT4x2                  = 0x8B69;
const FLOAT_MAT4x3                  = 0x8B6A;
const SAMPLER_2D_ARRAY              = 0x8DC1;
const SAMPLER_2D_ARRAY_SHADOW       = 0x8DC4;
const SAMPLER_CUBE_SHADOW           = 0x8DC5;
const UNSIGNED_INT                  = 0x1405;
const UNSIGNED_INT_VEC2             = 0x8DC6;
const UNSIGNED_INT_VEC3             = 0x8DC7;
const UNSIGNED_INT_VEC4             = 0x8DC8;
const INT_SAMPLER_2D                = 0x8DCA;
const INT_SAMPLER_3D                = 0x8DCB;
const INT_SAMPLER_CUBE              = 0x8DCC;
const INT_SAMPLER_2D_ARRAY          = 0x8DCF;
const UNSIGNED_INT_SAMPLER_2D       = 0x8DD2;
const UNSIGNED_INT_SAMPLER_3D       = 0x8DD3;
const UNSIGNED_INT_SAMPLER_CUBE     = 0x8DD4;
const UNSIGNED_INT_SAMPLER_2D_ARRAY = 0x8DD7;

const TEXTURE_2D$1                    = 0x0DE1;
const TEXTURE_CUBE_MAP              = 0x8513;
const TEXTURE_3D                    = 0x806F;
const TEXTURE_2D_ARRAY              = 0x8C1A;

const typeMap = {};

/**
 * Returns the corresponding bind point for a given sampler type
 * @private
 */
function getBindPointForSamplerType(gl, type) {
  return typeMap[type].bindPoint;
}

// This kind of sucks! If you could compose functions as in `var fn = gl[name];`
// this code could be a lot smaller but that is sadly really slow (T_T)

function floatSetter(gl, location) {
  return function(v) {
    gl.uniform1f(location, v);
  };
}

function floatArraySetter(gl, location) {
  return function(v) {
    gl.uniform1fv(location, v);
  };
}

function floatVec2Setter(gl, location) {
  return function(v) {
    gl.uniform2fv(location, v);
  };
}

function floatVec3Setter(gl, location) {
  return function(v) {
    gl.uniform3fv(location, v);
  };
}

function floatVec4Setter(gl, location) {
  return function(v) {
    gl.uniform4fv(location, v);
  };
}

function intSetter(gl, location) {
  return function(v) {
    gl.uniform1i(location, v);
  };
}

function intArraySetter(gl, location) {
  return function(v) {
    gl.uniform1iv(location, v);
  };
}

function intVec2Setter(gl, location) {
  return function(v) {
    gl.uniform2iv(location, v);
  };
}

function intVec3Setter(gl, location) {
  return function(v) {
    gl.uniform3iv(location, v);
  };
}

function intVec4Setter(gl, location) {
  return function(v) {
    gl.uniform4iv(location, v);
  };
}

function uintSetter(gl, location) {
  return function(v) {
    gl.uniform1ui(location, v);
  };
}

function uintArraySetter(gl, location) {
  return function(v) {
    gl.uniform1uiv(location, v);
  };
}

function uintVec2Setter(gl, location) {
  return function(v) {
    gl.uniform2uiv(location, v);
  };
}

function uintVec3Setter(gl, location) {
  return function(v) {
    gl.uniform3uiv(location, v);
  };
}

function uintVec4Setter(gl, location) {
  return function(v) {
    gl.uniform4uiv(location, v);
  };
}

function floatMat2Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix2fv(location, false, v);
  };
}

function floatMat3Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix3fv(location, false, v);
  };
}

function floatMat4Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix4fv(location, false, v);
  };
}

function floatMat23Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix2x3fv(location, false, v);
  };
}

function floatMat32Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix3x2fv(location, false, v);
  };
}

function floatMat24Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix2x4fv(location, false, v);
  };
}

function floatMat42Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix4x2fv(location, false, v);
  };
}

function floatMat34Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix3x4fv(location, false, v);
  };
}

function floatMat43Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix4x3fv(location, false, v);
  };
}

function samplerSetter(gl, type, unit, location) {
  const bindPoint = getBindPointForSamplerType(gl, type);
  return isWebGL2(gl) ? function(textureOrPair) {
    let texture;
    let sampler;
    if (!textureOrPair || isTexture(gl, textureOrPair)) {
      texture = textureOrPair;
      sampler = null;
    } else {
      texture = textureOrPair.texture;
      sampler = textureOrPair.sampler;
    }
    gl.uniform1i(location, unit);
    gl.activeTexture(TEXTURE0 + unit);
    gl.bindTexture(bindPoint, texture);
    gl.bindSampler(unit, sampler);
  } : function(texture) {
    gl.uniform1i(location, unit);
    gl.activeTexture(TEXTURE0 + unit);
    gl.bindTexture(bindPoint, texture);
  };
}

function samplerArraySetter(gl, type, unit, location, size) {
  const bindPoint = getBindPointForSamplerType(gl, type);
  const units = new Int32Array(size);
  for (let ii = 0; ii < size; ++ii) {
    units[ii] = unit + ii;
  }

  return isWebGL2(gl) ? function(textures) {
    gl.uniform1iv(location, units);
    textures.forEach(function(textureOrPair, index) {
      gl.activeTexture(TEXTURE0 + units[index]);
      let texture;
      let sampler;
      if (!textureOrPair || isTexture(gl, textureOrPair)) {
        texture = textureOrPair;
        sampler = null;
      } else {
        texture = textureOrPair.texture;
        sampler = textureOrPair.sampler;
      }
      gl.bindSampler(unit, sampler);
      gl.bindTexture(bindPoint, texture);
    });
  } : function(textures) {
    gl.uniform1iv(location, units);
    textures.forEach(function(texture, index) {
      gl.activeTexture(TEXTURE0 + units[index]);
      gl.bindTexture(bindPoint, texture);
    });
  };
}

typeMap[FLOAT]                         = { Type: Float32Array, size:  4, setter: floatSetter,      arraySetter: floatArraySetter, };
typeMap[FLOAT_VEC2]                    = { Type: Float32Array, size:  8, setter: floatVec2Setter,  cols: 2, };
typeMap[FLOAT_VEC3]                    = { Type: Float32Array, size: 12, setter: floatVec3Setter,  cols: 3, };
typeMap[FLOAT_VEC4]                    = { Type: Float32Array, size: 16, setter: floatVec4Setter,  cols: 4, };
typeMap[INT]                           = { Type: Int32Array,   size:  4, setter: intSetter,        arraySetter: intArraySetter, };
typeMap[INT_VEC2]                      = { Type: Int32Array,   size:  8, setter: intVec2Setter,    cols: 2, };
typeMap[INT_VEC3]                      = { Type: Int32Array,   size: 12, setter: intVec3Setter,    cols: 3, };
typeMap[INT_VEC4]                      = { Type: Int32Array,   size: 16, setter: intVec4Setter,    cols: 4, };
typeMap[UNSIGNED_INT]                  = { Type: Uint32Array,  size:  4, setter: uintSetter,       arraySetter: uintArraySetter, };
typeMap[UNSIGNED_INT_VEC2]             = { Type: Uint32Array,  size:  8, setter: uintVec2Setter,   cols: 2, };
typeMap[UNSIGNED_INT_VEC3]             = { Type: Uint32Array,  size: 12, setter: uintVec3Setter,   cols: 3, };
typeMap[UNSIGNED_INT_VEC4]             = { Type: Uint32Array,  size: 16, setter: uintVec4Setter,   cols: 4, };
typeMap[BOOL]                          = { Type: Uint32Array,  size:  4, setter: intSetter,        arraySetter: intArraySetter, };
typeMap[BOOL_VEC2]                     = { Type: Uint32Array,  size:  8, setter: intVec2Setter,    cols: 2, };
typeMap[BOOL_VEC3]                     = { Type: Uint32Array,  size: 12, setter: intVec3Setter,    cols: 3, };
typeMap[BOOL_VEC4]                     = { Type: Uint32Array,  size: 16, setter: intVec4Setter,    cols: 4, };
typeMap[FLOAT_MAT2]                    = { Type: Float32Array, size: 32, setter: floatMat2Setter,  rows: 2, cols: 2, };
typeMap[FLOAT_MAT3]                    = { Type: Float32Array, size: 48, setter: floatMat3Setter,  rows: 3, cols: 3, };
typeMap[FLOAT_MAT4]                    = { Type: Float32Array, size: 64, setter: floatMat4Setter,  rows: 4, cols: 4, };
typeMap[FLOAT_MAT2x3]                  = { Type: Float32Array, size: 32, setter: floatMat23Setter, rows: 2, cols: 3, };
typeMap[FLOAT_MAT2x4]                  = { Type: Float32Array, size: 32, setter: floatMat24Setter, rows: 2, cols: 4, };
typeMap[FLOAT_MAT3x2]                  = { Type: Float32Array, size: 48, setter: floatMat32Setter, rows: 3, cols: 2, };
typeMap[FLOAT_MAT3x4]                  = { Type: Float32Array, size: 48, setter: floatMat34Setter, rows: 3, cols: 4, };
typeMap[FLOAT_MAT4x2]                  = { Type: Float32Array, size: 64, setter: floatMat42Setter, rows: 4, cols: 2, };
typeMap[FLOAT_MAT4x3]                  = { Type: Float32Array, size: 64, setter: floatMat43Setter, rows: 4, cols: 3, };
typeMap[SAMPLER_2D]                    = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D$1,       };
typeMap[SAMPLER_CUBE]                  = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP, };
typeMap[SAMPLER_3D]                    = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_3D,       };
typeMap[SAMPLER_2D_SHADOW]             = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D$1,       };
typeMap[SAMPLER_2D_ARRAY]              = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY, };
typeMap[SAMPLER_2D_ARRAY_SHADOW]       = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY, };
typeMap[SAMPLER_CUBE_SHADOW]           = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP, };
typeMap[INT_SAMPLER_2D]                = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D$1,       };
typeMap[INT_SAMPLER_3D]                = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_3D,       };
typeMap[INT_SAMPLER_CUBE]              = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP, };
typeMap[INT_SAMPLER_2D_ARRAY]          = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY, };
typeMap[UNSIGNED_INT_SAMPLER_2D]       = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D$1,       };
typeMap[UNSIGNED_INT_SAMPLER_3D]       = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_3D,       };
typeMap[UNSIGNED_INT_SAMPLER_CUBE]     = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP, };
typeMap[UNSIGNED_INT_SAMPLER_2D_ARRAY] = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY, };

function floatAttribSetter(gl, index) {
  return function(b) {
    if (b.value) {
      gl.disableVertexAttribArray(index);
      switch (b.value.length) {
        case 4:
          gl.vertexAttrib4fv(index, b.value);
          break;
        case 3:
          gl.vertexAttrib3fv(index, b.value);
          break;
        case 2:
          gl.vertexAttrib2fv(index, b.value);
          break;
        case 1:
          gl.vertexAttrib1fv(index, b.value);
          break;
        default:
          throw new Error('the length of a float constant value must be between 1 and 4!');
      }
    } else {
      gl.bindBuffer(ARRAY_BUFFER, b.buffer);
      gl.enableVertexAttribArray(index);
      gl.vertexAttribPointer(
          index, b.numComponents || b.size, b.type || FLOAT, b.normalize || false, b.stride || 0, b.offset || 0);
      if (gl.vertexAttribDivisor) {
        gl.vertexAttribDivisor(index, b.divisor || 0);
      }
    }
  };
}

function intAttribSetter(gl, index) {
  return function(b) {
    if (b.value) {
      gl.disableVertexAttribArray(index);
      if (b.value.length === 4) {
        gl.vertexAttrib4iv(index, b.value);
      } else {
        throw new Error('The length of an integer constant value must be 4!');
      }
    } else {
      gl.bindBuffer(ARRAY_BUFFER, b.buffer);
      gl.enableVertexAttribArray(index);
      gl.vertexAttribIPointer(
          index, b.numComponents || b.size, b.type || INT, b.stride || 0, b.offset || 0);
      if (gl.vertexAttribDivisor) {
        gl.vertexAttribDivisor(index, b.divisor || 0);
      }
    }
  };
}

function uintAttribSetter(gl, index) {
  return function(b) {
    if (b.value) {
      gl.disableVertexAttribArray(index);
      if (b.value.length === 4) {
        gl.vertexAttrib4uiv(index, b.value);
      } else {
        throw new Error('The length of an unsigned integer constant value must be 4!');
      }
    } else {
      gl.bindBuffer(ARRAY_BUFFER, b.buffer);
      gl.enableVertexAttribArray(index);
      gl.vertexAttribIPointer(
          index, b.numComponents || b.size, b.type || UNSIGNED_INT, b.stride || 0, b.offset || 0);
      if (gl.vertexAttribDivisor) {
        gl.vertexAttribDivisor(index, b.divisor || 0);
      }
    }
  };
}

function matAttribSetter(gl, index, typeInfo) {
  const defaultSize = typeInfo.size;
  const count = typeInfo.count;

  return function(b) {
    gl.bindBuffer(ARRAY_BUFFER, b.buffer);
    const numComponents = b.size || b.numComponents || defaultSize;
    const size = numComponents / count;
    const type = b.type || FLOAT;
    const typeInfo = typeMap[type];
    const stride = typeInfo.size * numComponents;
    const normalize = b.normalize || false;
    const offset = b.offset || 0;
    const rowOffset = stride / count;
    for (let i = 0; i < count; ++i) {
      gl.enableVertexAttribArray(index + i);
      gl.vertexAttribPointer(
          index + i, size, type, normalize, stride, offset + rowOffset * i);
      if (gl.vertexAttribDivisor) {
        gl.vertexAttribDivisor(index + i, b.divisor || 0);
      }
    }
  };
}



const attrTypeMap = {};
attrTypeMap[FLOAT]             = { size:  4, setter: floatAttribSetter, };
attrTypeMap[FLOAT_VEC2]        = { size:  8, setter: floatAttribSetter, };
attrTypeMap[FLOAT_VEC3]        = { size: 12, setter: floatAttribSetter, };
attrTypeMap[FLOAT_VEC4]        = { size: 16, setter: floatAttribSetter, };
attrTypeMap[INT]               = { size:  4, setter: intAttribSetter,   };
attrTypeMap[INT_VEC2]          = { size:  8, setter: intAttribSetter,   };
attrTypeMap[INT_VEC3]          = { size: 12, setter: intAttribSetter,   };
attrTypeMap[INT_VEC4]          = { size: 16, setter: intAttribSetter,   };
attrTypeMap[UNSIGNED_INT]      = { size:  4, setter: uintAttribSetter,  };
attrTypeMap[UNSIGNED_INT_VEC2] = { size:  8, setter: uintAttribSetter,  };
attrTypeMap[UNSIGNED_INT_VEC3] = { size: 12, setter: uintAttribSetter,  };
attrTypeMap[UNSIGNED_INT_VEC4] = { size: 16, setter: uintAttribSetter,  };
attrTypeMap[BOOL]              = { size:  4, setter: intAttribSetter,   };
attrTypeMap[BOOL_VEC2]         = { size:  8, setter: intAttribSetter,   };
attrTypeMap[BOOL_VEC3]         = { size: 12, setter: intAttribSetter,   };
attrTypeMap[BOOL_VEC4]         = { size: 16, setter: intAttribSetter,   };
attrTypeMap[FLOAT_MAT2]        = { size:  4, setter: matAttribSetter,   count: 2, };
attrTypeMap[FLOAT_MAT3]        = { size:  9, setter: matAttribSetter,   count: 3, };
attrTypeMap[FLOAT_MAT4]        = { size: 16, setter: matAttribSetter,   count: 4, };

/**
 * Returns true if attribute/uniform is a reserved/built in
 *
 * It makes no sense to me why GL returns these because it's
 * illegal to call `gl.getUniformLocation` and `gl.getAttribLocation`
 * with names that start with `gl_` (and `webgl_` in WebGL)
 *
 * I can only assume they are there because they might count
 * when computing the number of uniforms/attributes used when you want to
 * know if you are near the limit. That doesn't really make sense
 * to me but the fact that these get returned are in the spec.
 *
 * @param {WebGLActiveInfo} info As returned from `gl.getActiveUniform` or
 *    `gl.getActiveAttrib`.
 * @return {bool} true if it's reserved
 * @private
 */
function isBuiltIn(info) {
  const name = info.name;
  return name.startsWith("gl_") || name.startsWith("webgl_");
}

const tokenRE = /(\.|\[|]|\w+)/g;
const isDigit = s => s >= '0' && s <= '9';
function addSetterToUniformTree(fullPath, setter, node, uniformSetters) {
  const tokens = fullPath.split(tokenRE).filter(s => s !== '');
  let tokenNdx = 0;
  let path = '';

  for (;;) {
    const token = tokens[tokenNdx++];  // has to be name or number
    path += token;
    const isArrayIndex = isDigit(token[0]);
    const accessor = isArrayIndex
        ? parseInt(token)
        : token;
    if (isArrayIndex) {
      path += tokens[tokenNdx++];  // skip ']'
    }
    const isLastToken = tokenNdx === tokens.length;
    if (isLastToken) {
      node[accessor] = setter;
      break;
    } else {
      const token = tokens[tokenNdx++];  // has to be . or [
      const isArray = token === '[';
      const child = node[accessor] || (isArray ? [] : {});
      node[accessor] = child;
      node = child;
      uniformSetters[path] = uniformSetters[path] || function(node) {
        return function(value) {
          setUniformTree(node, value);
        };
      }(child);
      path += token;
    }
  }
}

/**
 * Creates setter functions for all uniforms of a shader
 * program.
 *
 * @see {@link module:twgl.setUniforms}
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {WebGLProgram} program the program to create setters for.
 * @returns {Object.<string, function>} an object with a setter by name for each uniform
 * @memberOf module:twgl/programs
 */
function createUniformSetters(gl, program) {
  let textureUnit = 0;

  /**
   * Creates a setter for a uniform of the given program with it's
   * location embedded in the setter.
   * @param {WebGLProgram} program
   * @param {WebGLUniformInfo} uniformInfo
   * @returns {function} the created setter.
   */
  function createUniformSetter(program, uniformInfo, location) {
    const isArray = uniformInfo.name.endsWith("[0]");
    const type = uniformInfo.type;
    const typeInfo = typeMap[type];
    if (!typeInfo) {
      throw new Error(`unknown type: 0x${type.toString(16)}`); // we should never get here.
    }
    let setter;
    if (typeInfo.bindPoint) {
      // it's a sampler
      const unit = textureUnit;
      textureUnit += uniformInfo.size;
      if (isArray) {
        setter = typeInfo.arraySetter(gl, type, unit, location, uniformInfo.size);
      } else {
        setter = typeInfo.setter(gl, type, unit, location, uniformInfo.size);
      }
    } else {
      if (typeInfo.arraySetter && isArray) {
        setter = typeInfo.arraySetter(gl, location);
      } else {
        setter = typeInfo.setter(gl, location);
      }
    }
    setter.location = location;
    return setter;
  }

  const uniformSetters = {};
  const uniformTree = {};
  const numUniforms = gl.getProgramParameter(program, ACTIVE_UNIFORMS);

  for (let ii = 0; ii < numUniforms; ++ii) {
    const uniformInfo = gl.getActiveUniform(program, ii);
    if (isBuiltIn(uniformInfo)) {
      continue;
    }
    let name = uniformInfo.name;
    // remove the array suffix.
    if (name.endsWith("[0]")) {
      name = name.substr(0, name.length - 3);
    }
    const location = gl.getUniformLocation(program, uniformInfo.name);
    // the uniform will have no location if it's in a uniform block
    if (location) {
      const setter = createUniformSetter(program, uniformInfo, location);
      uniformSetters[name] = setter;
      addSetterToUniformTree(name, setter, uniformTree, uniformSetters);
    }
  }

  return uniformSetters;
}

/**
 * @typedef {Object} TransformFeedbackInfo
 * @property {number} index index of transform feedback
 * @property {number} type GL type
 * @property {number} size 1 - 4
 * @memberOf module:twgl
 */

/**
 * Create TransformFeedbackInfo for passing to bindTransformFeedbackInfo.
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {WebGLProgram} program an existing WebGLProgram.
 * @return {Object<string, module:twgl.TransformFeedbackInfo>}
 * @memberOf module:twgl
 */
function createTransformFeedbackInfo(gl, program) {
  const info = {};
  const numVaryings = gl.getProgramParameter(program, TRANSFORM_FEEDBACK_VARYINGS);
  for (let ii = 0; ii < numVaryings; ++ii) {
    const varying = gl.getTransformFeedbackVarying(program, ii);
    info[varying.name] = {
      index: ii,
      type: varying.type,
      size: varying.size,
    };
  }
  return info;
}

/**
 * @typedef {Object} UniformData
 * @property {string} name The name of the uniform
 * @property {number} type The WebGL type enum for this uniform
 * @property {number} size The number of elements for this uniform
 * @property {number} blockNdx The block index this uniform appears in
 * @property {number} offset The byte offset in the block for this uniform's value
 * @memberOf module:twgl
 */

/**
 * The specification for one UniformBlockObject
 *
 * @typedef {Object} BlockSpec
 * @property {number} index The index of the block.
 * @property {number} size The size in bytes needed for the block
 * @property {number[]} uniformIndices The indices of the uniforms used by the block. These indices
 *    correspond to entries in a UniformData array in the {@link module:twgl.UniformBlockSpec}.
 * @property {bool} usedByVertexShader Self explanatory
 * @property {bool} usedByFragmentShader Self explanatory
 * @property {bool} used Self explanatory
 * @memberOf module:twgl
 */

/**
 * A `UniformBlockSpec` represents the data needed to create and bind
 * UniformBlockObjects for a given program
 *
 * @typedef {Object} UniformBlockSpec
 * @property {Object.<string, module:twgl.BlockSpec>} blockSpecs The BlockSpec for each block by block name
 * @property {UniformData[]} uniformData An array of data for each uniform by uniform index.
 * @memberOf module:twgl
 */

/**
 * Creates a UniformBlockSpec for the given program.
 *
 * A UniformBlockSpec represents the data needed to create and bind
 * UniformBlockObjects
 *
 * @param {WebGL2RenderingContext} gl A WebGL2 Rendering Context
 * @param {WebGLProgram} program A WebGLProgram for a successfully linked program
 * @return {module:twgl.UniformBlockSpec} The created UniformBlockSpec
 * @memberOf module:twgl/programs
 */
function createUniformBlockSpecFromProgram(gl, program) {
  const numUniforms = gl.getProgramParameter(program, ACTIVE_UNIFORMS);
  const uniformData = [];
  const uniformIndices = [];

  for (let ii = 0; ii < numUniforms; ++ii) {
    uniformIndices.push(ii);
    uniformData.push({});
    const uniformInfo = gl.getActiveUniform(program, ii);
    uniformData[ii].name = uniformInfo.name;
  }

  [
    [ "UNIFORM_TYPE", "type" ],
    [ "UNIFORM_SIZE", "size" ],  // num elements
    [ "UNIFORM_BLOCK_INDEX", "blockNdx" ],
    [ "UNIFORM_OFFSET", "offset", ],
  ].forEach(function(pair) {
    const pname = pair[0];
    const key = pair[1];
    gl.getActiveUniforms(program, uniformIndices, gl[pname]).forEach(function(value, ndx) {
      uniformData[ndx][key] = value;
    });
  });

  const blockSpecs = {};

  const numUniformBlocks = gl.getProgramParameter(program, ACTIVE_UNIFORM_BLOCKS);
  for (let ii = 0; ii < numUniformBlocks; ++ii) {
    const name = gl.getActiveUniformBlockName(program, ii);
    const blockSpec = {
      index: gl.getUniformBlockIndex(program, name),
      usedByVertexShader: gl.getActiveUniformBlockParameter(program, ii, UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER),
      usedByFragmentShader: gl.getActiveUniformBlockParameter(program, ii, UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER),
      size: gl.getActiveUniformBlockParameter(program, ii, UNIFORM_BLOCK_DATA_SIZE),
      uniformIndices: gl.getActiveUniformBlockParameter(program, ii, UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES),
    };
    blockSpec.used = blockSpec.usedByVertexShader || blockSpec.usedByFragmentShader;
    blockSpecs[name] = blockSpec;
  }

  return {
    blockSpecs: blockSpecs,
    uniformData: uniformData,
  };
}

function setUniformTree(tree, values) {
  for (const name in values) {
    const prop = tree[name];
    if (typeof prop === 'function') {
      prop(values[name]);
    } else {
      setUniformTree(tree[name], values[name]);
    }
  }
}

/**
 * Set uniforms and binds related textures.
 *
 * example:
 *
 *     const programInfo = createProgramInfo(
 *         gl, ["some-vs", "some-fs"]);
 *
 *     const tex1 = gl.createTexture();
 *     const tex2 = gl.createTexture();
 *
 *     ... assume we setup the textures with data ...
 *
 *     const uniforms = {
 *       u_someSampler: tex1,
 *       u_someOtherSampler: tex2,
 *       u_someColor: [1,0,0,1],
 *       u_somePosition: [0,1,1],
 *       u_someMatrix: [
 *         1,0,0,0,
 *         0,1,0,0,
 *         0,0,1,0,
 *         0,0,0,0,
 *       ],
 *     };
 *
 *     gl.useProgram(programInfo.program);
 *
 * This will automatically bind the textures AND set the
 * uniforms.
 *
 *     twgl.setUniforms(programInfo, uniforms);
 *
 * For the example above it is equivalent to
 *
 *     let texUnit = 0;
 *     gl.activeTexture(gl.TEXTURE0 + texUnit);
 *     gl.bindTexture(gl.TEXTURE_2D, tex1);
 *     gl.uniform1i(u_someSamplerLocation, texUnit++);
 *     gl.activeTexture(gl.TEXTURE0 + texUnit);
 *     gl.bindTexture(gl.TEXTURE_2D, tex2);
 *     gl.uniform1i(u_someSamplerLocation, texUnit++);
 *     gl.uniform4fv(u_someColorLocation, [1, 0, 0, 1]);
 *     gl.uniform3fv(u_somePositionLocation, [0, 1, 1]);
 *     gl.uniformMatrix4fv(u_someMatrix, false, [
 *         1,0,0,0,
 *         0,1,0,0,
 *         0,0,1,0,
 *         0,0,0,0,
 *       ]);
 *
 * Note it is perfectly reasonable to call `setUniforms` multiple times. For example
 *
 *     const uniforms = {
 *       u_someSampler: tex1,
 *       u_someOtherSampler: tex2,
 *     };
 *
 *     const moreUniforms {
 *       u_someColor: [1,0,0,1],
 *       u_somePosition: [0,1,1],
 *       u_someMatrix: [
 *         1,0,0,0,
 *         0,1,0,0,
 *         0,0,1,0,
 *         0,0,0,0,
 *       ],
 *     };
 *
 *     twgl.setUniforms(programInfo, uniforms);
 *     twgl.setUniforms(programInfo, moreUniforms);
 *
 * You can also add WebGLSamplers to uniform samplers as in
 *
 *     const uniforms = {
 *       u_someSampler: {
 *         texture: someWebGLTexture,
 *         sampler: someWebGLSampler,
 *       },
 *     };
 *
 * In which case both the sampler and texture will be bound to the
 * same unit.
 *
 * @param {(module:twgl.ProgramInfo|Object.<string, function>)} setters a `ProgramInfo` as returned from `createProgramInfo` or the setters returned from
 *        `createUniformSetters`.
 * @param {Object.<string, ?>} values an object with values for the
 *        uniforms.
 *   You can pass multiple objects by putting them in an array or by calling with more arguments.For example
 *
 *     const sharedUniforms = {
 *       u_fogNear: 10,
 *       u_projection: ...
 *       ...
 *     };
 *
 *     const localUniforms = {
 *       u_world: ...
 *       u_diffuseColor: ...
 *     };
 *
 *     twgl.setUniforms(programInfo, sharedUniforms, localUniforms);
 *
 *     // is the same as
 *
 *     twgl.setUniforms(programInfo, [sharedUniforms, localUniforms]);
 *
 *     // is the same as
 *
 *     twgl.setUniforms(programInfo, sharedUniforms);
 *     twgl.setUniforms(programInfo, localUniforms};
 *
 *   You can also fill out structure and array values either via
 *   shortcut. Example
 *
 *     // -- in shader --
 *     struct Light {
 *       float intensity;
 *       vec4 color;
 *       float nearFar[2];
 *     };
 *     uniform Light lights[2];
 *
 *     // in JavaScript
 *
 *     twgl.setUniforms(programInfo, {
 *       lights: [
 *         { intensity: 5.0, color: [1, 0, 0, 1], nearFar[0.1, 10] },
 *         { intensity: 2.0, color: [0, 0, 1, 1], nearFar[0.2, 15] },
 *       ],
 *     });
 *
 *   or the more traditional way
 *
 *     twgl.setUniforms(programInfo, {
 *       "lights[0].intensity": 5.0,
 *       "lights[0].color": [1, 0, 0, 1],
 *       "lights[0].nearFar": [0.1, 10],
 *       "lights[1].intensity": 2.0,
 *       "lights[1].color": [0, 0, 1, 1],
 *       "lights[1].nearFar": [0.2, 15],
 *     });
 *
 *   You can also specify partial paths
 *
 *     twgl.setUniforms(programInfo, {
 *       'lights[1]': { intensity: 5.0, color: [1, 0, 0, 1], nearFar[0.2, 15] },
 *     });
 *
 *   But you can not specify leaf array indices
 *
 *     twgl.setUniforms(programInfo, {
 *       'lights[1].nearFar[1]': 15,     // BAD! nearFar is a leaf
 *       'lights[1].nearFar': [0.2, 15], // GOOD
 *     });
 *
 * @memberOf module:twgl/programs
 */
function setUniforms(setters, ...args) {  // eslint-disable-line
  const actualSetters = setters.uniformSetters || setters;
  const numArgs = args.length;
  for (let aNdx = 0; aNdx < numArgs; ++aNdx) {
    const values = args[aNdx];
    if (Array.isArray(values)) {
      const numValues = values.length;
      for (let ii = 0; ii < numValues; ++ii) {
        setUniforms(actualSetters, values[ii]);
      }
    } else {
      for (const name in values) {
        const setter = actualSetters[name];
        if (setter) {
          setter(values[name]);
        }
      }
    }
  }
}

/**
 * Creates setter functions for all attributes of a shader
 * program. You can pass this to {@link module:twgl.setBuffersAndAttributes} to set all your buffers and attributes.
 *
 * @see {@link module:twgl.setAttributes} for example
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {WebGLProgram} program the program to create setters for.
 * @return {Object.<string, function>} an object with a setter for each attribute by name.
 * @memberOf module:twgl/programs
 */
function createAttributeSetters(gl, program) {
  const attribSetters = {
  };

  const numAttribs = gl.getProgramParameter(program, ACTIVE_ATTRIBUTES);
  for (let ii = 0; ii < numAttribs; ++ii) {
    const attribInfo = gl.getActiveAttrib(program, ii);
    if (isBuiltIn(attribInfo)) {
      continue;
    }
    const index = gl.getAttribLocation(program, attribInfo.name);
    const typeInfo = attrTypeMap[attribInfo.type];
    const setter = typeInfo.setter(gl, index, typeInfo);
    setter.location = index;
    attribSetters[attribInfo.name] = setter;
  }

  return attribSetters;
}

/**
 * Sets attributes and binds buffers (deprecated... use {@link module:twgl.setBuffersAndAttributes})
 *
 * Example:
 *
 *     const program = createProgramFromScripts(
 *         gl, ["some-vs", "some-fs");
 *
 *     const attribSetters = createAttributeSetters(program);
 *
 *     const positionBuffer = gl.createBuffer();
 *     const texcoordBuffer = gl.createBuffer();
 *
 *     const attribs = {
 *       a_position: {buffer: positionBuffer, numComponents: 3},
 *       a_texcoord: {buffer: texcoordBuffer, numComponents: 2},
 *     };
 *
 *     gl.useProgram(program);
 *
 * This will automatically bind the buffers AND set the
 * attributes.
 *
 *     setAttributes(attribSetters, attribs);
 *
 * Properties of attribs. For each attrib you can add
 * properties:
 *
 * *   type: the type of data in the buffer. Default = gl.FLOAT
 * *   normalize: whether or not to normalize the data. Default = false
 * *   stride: the stride. Default = 0
 * *   offset: offset into the buffer. Default = 0
 * *   divisor: the divisor for instances. Default = undefined
 *
 * For example if you had 3 value float positions, 2 value
 * float texcoord and 4 value uint8 colors you'd setup your
 * attribs like this
 *
 *     const attribs = {
 *       a_position: {buffer: positionBuffer, numComponents: 3},
 *       a_texcoord: {buffer: texcoordBuffer, numComponents: 2},
 *       a_color: {
 *         buffer: colorBuffer,
 *         numComponents: 4,
 *         type: gl.UNSIGNED_BYTE,
 *         normalize: true,
 *       },
 *     };
 *
 * @param {Object.<string, function>} setters Attribute setters as returned from createAttributeSetters
 * @param {Object.<string, module:twgl.AttribInfo>} buffers AttribInfos mapped by attribute name.
 * @memberOf module:twgl/programs
 * @deprecated use {@link module:twgl.setBuffersAndAttributes}
 * @private
 */
function setAttributes(setters, buffers) {
  for (const name in buffers) {
    const setter = setters[name];
    if (setter) {
      setter(buffers[name]);
    }
  }
}

/**
 * Sets attributes and buffers including the `ELEMENT_ARRAY_BUFFER` if appropriate
 *
 * Example:
 *
 *     const programInfo = createProgramInfo(
 *         gl, ["some-vs", "some-fs");
 *
 *     const arrays = {
 *       position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
 *       texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
 *     };
 *
 *     const bufferInfo = createBufferInfoFromArrays(gl, arrays);
 *
 *     gl.useProgram(programInfo.program);
 *
 * This will automatically bind the buffers AND set the
 * attributes.
 *
 *     setBuffersAndAttributes(gl, programInfo, bufferInfo);
 *
 * For the example above it is equivalent to
 *
 *     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
 *     gl.enableVertexAttribArray(a_positionLocation);
 *     gl.vertexAttribPointer(a_positionLocation, 3, gl.FLOAT, false, 0, 0);
 *     gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
 *     gl.enableVertexAttribArray(a_texcoordLocation);
 *     gl.vertexAttribPointer(a_texcoordLocation, 4, gl.FLOAT, false, 0, 0);
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext.
 * @param {(module:twgl.ProgramInfo|Object.<string, function>)} setters A `ProgramInfo` as returned from {@link module:twgl.createProgramInfo} or Attribute setters as returned from {@link module:twgl.createAttributeSetters}
 * @param {(module:twgl.BufferInfo|module:twgl.VertexArrayInfo)} buffers a `BufferInfo` as returned from {@link module:twgl.createBufferInfoFromArrays}.
 *   or a `VertexArrayInfo` as returned from {@link module:twgl.createVertexArrayInfo}
 * @memberOf module:twgl/programs
 */
function setBuffersAndAttributes(gl, programInfo, buffers) {
  if (buffers.vertexArrayObject) {
    gl.bindVertexArray(buffers.vertexArrayObject);
  } else {
    setAttributes(programInfo.attribSetters || programInfo, buffers.attribs);
    if (buffers.indices) {
      gl.bindBuffer(ELEMENT_ARRAY_BUFFER$1, buffers.indices);
    }
  }
}

/**
 * @typedef {Object} ProgramInfo
 * @property {WebGLProgram} program A shader program
 * @property {Object<string, function>} uniformSetters object of setters as returned from createUniformSetters,
 * @property {Object<string, function>} attribSetters object of setters as returned from createAttribSetters,
 * @property {module:twgl.UniformBlockSpec} [uniformBlockSpec] a uniform block spec for making UniformBlockInfos with createUniformBlockInfo etc..
 * @property {Object<string, module:twgl.TransformFeedbackInfo>} [transformFeedbackInfo] info for transform feedbacks
 * @memberOf module:twgl
 */

/**
 * Creates a ProgramInfo from an existing program.
 *
 * A ProgramInfo contains
 *
 *     programInfo = {
 *        program: WebGLProgram,
 *        uniformSetters: object of setters as returned from createUniformSetters,
 *        attribSetters: object of setters as returned from createAttribSetters,
 *     }
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext
 *        to use.
 * @param {WebGLProgram} program an existing WebGLProgram.
 * @return {module:twgl.ProgramInfo} The created ProgramInfo.
 * @memberOf module:twgl/programs
 */
function createProgramInfoFromProgram(gl, program) {
  const uniformSetters = createUniformSetters(gl, program);
  const attribSetters = createAttributeSetters(gl, program);
  const programInfo = {
    program,
    uniformSetters,
    attribSetters,
  };

  if (isWebGL2(gl)) {
    programInfo.uniformBlockSpec = createUniformBlockSpecFromProgram(gl, program);
    programInfo.transformFeedbackInfo = createTransformFeedbackInfo(gl, program);
  }

  return programInfo;
}

var vertShaderLayer = "#define GLSLIFY 1\nattribute vec4 position;attribute vec2 texcoord;varying vec2 v_uv;uniform bool u_flipY;uniform vec2 u_textureSize;uniform int u_3d_eye;uniform float u_3d_depth;uniform float u_3d_strength;void main(){vec4 pos=position;float depthDirection=u_3d_eye==0 ?-1.0 : 1.0;float depthShift=floor(u_3d_depth*u_3d_strength)/(u_textureSize.x/2.0)*depthDirection;pos.x+=depthShift;pos.y*=u_flipY ?-1.0 : 1.0;v_uv=texcoord;gl_Position=pos;}"; // eslint-disable-line

var fragShaderLayer = "precision highp float;\n#define GLSLIFY 1\nvarying vec2 v_uv;uniform sampler2D u_tex;uniform int u_3d_mode;void main(){vec4 col=texture2D(u_tex,v_uv);if(col.a==0.0){discard;}gl_FragColor=col;}"; // eslint-disable-line

var vertShaderUpscale = "#define GLSLIFY 1\nattribute vec4 position;attribute vec2 texcoord;varying vec2 v_texel;varying vec2 v_uv;varying float v_scale;uniform bool u_flipY;uniform vec2 u_textureSize;uniform vec2 u_screenSize;void main(){v_uv=texcoord;v_scale=floor(u_screenSize.y/u_textureSize.y+0.01);gl_Position=position;if(u_flipY){gl_Position.y*=-1.;}}"; // eslint-disable-line

var fragShaderUpscale = "precision highp float;\n#define GLSLIFY 1\nvarying vec2 v_uv;uniform sampler2D u_tex;varying float v_scale;uniform vec2 u_textureSize;uniform vec2 u_screenSize;void main(){vec2 v_texel=v_uv*u_textureSize;vec2 texel_floored=floor(v_texel);vec2 s=fract(v_texel);float region_range=0.5-0.5/v_scale;vec2 center_dist=s-0.5;vec2 f=(center_dist-clamp(center_dist,-region_range,region_range))*v_scale+0.5;vec2 mod_texel=texel_floored+f;vec2 coord=mod_texel.xy/u_textureSize.xy;gl_FragColor=texture2D(u_tex,coord);}"; // eslint-disable-line

var _WebglCanvas_instances, _WebglCanvas_options, _WebglCanvas_layerProgram, _WebglCanvas_upscaleProgram, _WebglCanvas_quadBuffer, _WebglCanvas_paletteBuffer, _WebglCanvas_layerTexture, _WebglCanvas_layerTexturePixelBuffer, _WebglCanvas_layerTexturePixels, _WebglCanvas_frameTexture, _WebglCanvas_frameBuffer, _WebglCanvas_textureTypes, _WebglCanvas_textureSizes, _WebglCanvas_frameBufferTextures, _WebglCanvas_applyFirefoxFix, _WebglCanvas_refs, _WebglCanvas_isCtxLost, _WebglCanvas_init, _WebglCanvas_drawLayers, _WebglCanvas_upscale, _WebglCanvas_createProgram, _WebglCanvas_createShader, _WebglCanvas_createScreenQuad, _WebglCanvas_setBuffersAndAttribs, _WebglCanvas_createTexture, _WebglCanvas_resizeTexture, _WebglCanvas_createFramebuffer, _WebglCanvas_useFramebuffer, _WebglCanvas_resizeFramebuffer, _WebglCanvas_checkContextLoss, _WebglCanvas_handleContextLoss, _WebglCanvas_handleContextRestored;
/**
 * Flipnote renderer for the {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API WebGL} API.
 *
 * Only available in browser contexts.
 */
class WebglCanvas {
    static isSupported() {
        if (!isBrowser)
            return false;
        let testCanvas = document.createElement('canvas');
        let testCtx = testCanvas.getContext('2d');
        const supported = testCtx !== null;
        testCanvas = null;
        testCtx = null;
        return supported;
    }
    /**
     * Creates a new WebGlCanvas instance
     * @param el - Canvas HTML element to use as a rendering surface
     * @param width - Canvas width in CSS pixels
     * @param height - Canvas height in CSS pixels
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     */
    constructor(parent, width = 640, height = 480, options = {}) {
        _WebglCanvas_instances.add(this);
        /**
         *
         */
        this.supportedStereoscopeModes = [
            exports.CanvasStereoscopicMode.None,
            exports.CanvasStereoscopicMode.Dual,
            // CanvasStereoscopicMode.Anaglyph, // couldn't get this working, despite spending lots of time on it :/
        ];
        /**
         *
         */
        this.stereoscopeMode = exports.CanvasStereoscopicMode.None;
        /**
         *
         */
        this.stereoscopeStrength = 0;
        _WebglCanvas_options.set(this, void 0);
        _WebglCanvas_layerProgram.set(this, void 0); // for drawing renderbuffer w/ filtering
        _WebglCanvas_upscaleProgram.set(this, void 0); // for drawing renderbuffer w/ filtering
        _WebglCanvas_quadBuffer.set(this, void 0);
        _WebglCanvas_paletteBuffer.set(this, new Uint32Array(16));
        _WebglCanvas_layerTexture.set(this, void 0);
        _WebglCanvas_layerTexturePixelBuffer.set(this, void 0);
        _WebglCanvas_layerTexturePixels.set(this, void 0); // will be same memory as layerTexturePixelBuffer, just uint8 for webgl texture
        _WebglCanvas_frameTexture.set(this, void 0);
        _WebglCanvas_frameBuffer.set(this, void 0);
        _WebglCanvas_textureTypes.set(this, new Map());
        _WebglCanvas_textureSizes.set(this, new Map());
        _WebglCanvas_frameBufferTextures.set(this, new Map());
        _WebglCanvas_applyFirefoxFix.set(this, false);
        _WebglCanvas_refs.set(this, {
            programs: [],
            shaders: [],
            textures: [],
            buffers: [],
            frameBuffers: []
        });
        _WebglCanvas_isCtxLost.set(this, false);
        _WebglCanvas_handleContextLoss.set(this, (e) => {
            this.destroy();
            if (e)
                e.preventDefault();
            if (!__classPrivateFieldGet(this, _WebglCanvas_isCtxLost, "f"))
                __classPrivateFieldGet(this, _WebglCanvas_options, "f").onlost();
            __classPrivateFieldSet(this, _WebglCanvas_isCtxLost, true, "f");
        });
        _WebglCanvas_handleContextRestored.set(this, (e) => {
            __classPrivateFieldSet(this, _WebglCanvas_isCtxLost, false, "f");
            __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_init).call(this);
            __classPrivateFieldGet(this, _WebglCanvas_options, "f").onrestored();
        });
        assertBrowserEnv();
        __classPrivateFieldSet(this, _WebglCanvas_options, { ...WebglCanvas.defaultOptions, ...options }, "f");
        this.width = width;
        this.height = height;
        this.canvas = document.createElement('canvas');
        this.canvas.addEventListener('webglcontextlost', __classPrivateFieldGet(this, _WebglCanvas_handleContextLoss, "f"), false);
        this.canvas.addEventListener('webglcontextrestored', __classPrivateFieldGet(this, _WebglCanvas_handleContextRestored, "f"), false);
        this.canvas.className = 'FlipnoteCanvas FlipnoteCanvas--webgl';
        this.gl = this.canvas.getContext('webgl', {
            antialias: false,
            alpha: true
        });
        if (parent)
            parent.appendChild(this.canvas);
        __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_init).call(this);
    }
    /**
     * Resize the canvas surface
     * @param width - New canvas width, in CSS pixels
     * @param height - New canvas height, in CSS pixels
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     */
    setCanvasSize(width, height) {
        const dpi = __classPrivateFieldGet(this, _WebglCanvas_options, "f").useDpi ? (window.devicePixelRatio || 1) : 1;
        const internalWidth = width * dpi;
        const internalHeight = height * dpi;
        this.width = width;
        this.height = height;
        this.canvas.width = internalWidth;
        this.canvas.height = internalHeight;
        this.dstWidth = internalWidth;
        this.dstHeight = internalHeight;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_checkContextLoss).call(this);
    }
    /**
     * Sets the note to use for this player
     */
    setNote(note) {
        if (__classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_checkContextLoss).call(this))
            return;
        const width = note.imageWidth;
        const height = note.imageHeight;
        this.note = note;
        this.srcWidth = width;
        this.srcHeight = height;
        __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_resizeFramebuffer).call(this, __classPrivateFieldGet(this, _WebglCanvas_frameBuffer, "f"), width, height);
        __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_resizeTexture).call(this, __classPrivateFieldGet(this, _WebglCanvas_layerTexture, "f"), width, height);
        __classPrivateFieldSet(this, _WebglCanvas_layerTexturePixelBuffer, new Uint32Array(width * height), "f");
        __classPrivateFieldSet(this, _WebglCanvas_layerTexturePixels, new Uint8Array(__classPrivateFieldGet(this, _WebglCanvas_layerTexturePixelBuffer, "f").buffer), "f"); // same memory buffer as rgbaData
        this.frameIndex = undefined;
        // set canvas alt text
        this.canvas.title = note.getTitle();
    }
    /**
     * Clear the canvas
     * @param color optional RGBA color to use as a background color
     */
    clear(color) {
        if (__classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_checkContextLoss).call(this))
            return;
        const gl = this.gl;
        const paperColor = color ?? this.note.getFramePalette(this.frameIndex)[0];
        const [r, g, b, a] = paperColor;
        gl.clearColor(r / 255, g / 255, b / 255, a / 255);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    /**
     * Draw a frame from the currently loaded Flipnote
     * @param frameIndex
     */
    drawFrame(frameIndex) {
        if (__classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_checkContextLoss).call(this))
            return;
        const gl = this.gl;
        const mode = this.stereoscopeMode;
        const strength = this.stereoscopeStrength;
        this.frameIndex = frameIndex;
        if (mode === exports.CanvasStereoscopicMode.None) {
            __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_drawLayers).call(this, frameIndex);
            __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_useFramebuffer).call(this, null);
            __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_upscale).call(this, gl.drawingBufferWidth, gl.drawingBufferHeight);
        }
        else if (mode === exports.CanvasStereoscopicMode.Dual) {
            __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_drawLayers).call(this, frameIndex, strength, exports.FlipnoteStereoscopicEye.Left);
            __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_useFramebuffer).call(this, null, 0, 0, gl.drawingBufferWidth / 2, gl.drawingBufferHeight);
            __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_upscale).call(this, gl.drawingBufferWidth / 2, gl.drawingBufferHeight);
            __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_drawLayers).call(this, frameIndex, strength, exports.FlipnoteStereoscopicEye.Right);
            __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_useFramebuffer).call(this, null, gl.drawingBufferWidth / 2, 0, gl.drawingBufferWidth / 2, gl.drawingBufferHeight);
            __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_upscale).call(this, gl.drawingBufferWidth / 2, gl.drawingBufferHeight);
        }
    }
    requestStereoScopeMode(mode) {
        if (this.supportedStereoscopeModes.includes(mode))
            this.stereoscopeMode = mode;
        else
            this.stereoscopeMode = exports.CanvasStereoscopicMode.None;
        this.forceUpdate();
    }
    forceUpdate() {
        if (this.frameIndex !== undefined)
            this.drawFrame(this.frameIndex);
    }
    /**
     * Returns true if the webGL context has returned an error
     */
    isErrorState() {
        const gl = this.gl;
        return gl === null || gl.getError() !== gl.NO_ERROR;
    }
    /**
     * Get the contents of the canvas as a data URL.
     *
     * @param type image mime type (`image/jpeg`, `image/png`, etc)
     * @param quality image quality where supported, between 0 and 1
     */
    getDataUrl(type, quality) {
        return this.canvas.toDataURL(type, quality);
    }
    /**
     * Get the contents of the canvas as a blob.
     *
     * @param type image mime type (`image/jpeg`, `image/png`, etc)
     * @param quality image quality where supported, between 0 and 1
     */
    async getBlob(type, quality) {
        return new Promise((resolve, reject) => this.canvas.toBlob(resolve, type, quality));
    }
    /**
     * Frees any resources used by this canvas instance
     */
    destroy() {
        const refs = __classPrivateFieldGet(this, _WebglCanvas_refs, "f");
        const gl = this.gl;
        const canvas = this.canvas;
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
        refs.frameBuffers.forEach((fb) => {
            gl.deleteFramebuffer(fb);
        });
        refs.frameBuffers = [];
        refs.programs.forEach((program) => {
            gl.deleteProgram(program);
        });
        refs.programs = [];
        __classPrivateFieldSet(this, _WebglCanvas_paletteBuffer, null, "f");
        __classPrivateFieldSet(this, _WebglCanvas_layerTexturePixelBuffer, null, "f");
        __classPrivateFieldSet(this, _WebglCanvas_layerTexturePixels, null, "f");
        __classPrivateFieldGet(this, _WebglCanvas_textureTypes, "f").clear();
        __classPrivateFieldGet(this, _WebglCanvas_textureSizes, "f").clear();
        __classPrivateFieldGet(this, _WebglCanvas_frameBufferTextures, "f").clear();
        if (canvas && canvas.parentElement) {
            // shrink the canvas to reduce memory usage until it is garbage collected
            canvas.width = 1;
            canvas.height = 1;
            // remove canvas from dom
            canvas.parentNode.removeChild(canvas);
        }
    }
}
_WebglCanvas_options = new WeakMap(), _WebglCanvas_layerProgram = new WeakMap(), _WebglCanvas_upscaleProgram = new WeakMap(), _WebglCanvas_quadBuffer = new WeakMap(), _WebglCanvas_paletteBuffer = new WeakMap(), _WebglCanvas_layerTexture = new WeakMap(), _WebglCanvas_layerTexturePixelBuffer = new WeakMap(), _WebglCanvas_layerTexturePixels = new WeakMap(), _WebglCanvas_frameTexture = new WeakMap(), _WebglCanvas_frameBuffer = new WeakMap(), _WebglCanvas_textureTypes = new WeakMap(), _WebglCanvas_textureSizes = new WeakMap(), _WebglCanvas_frameBufferTextures = new WeakMap(), _WebglCanvas_applyFirefoxFix = new WeakMap(), _WebglCanvas_refs = new WeakMap(), _WebglCanvas_isCtxLost = new WeakMap(), _WebglCanvas_handleContextLoss = new WeakMap(), _WebglCanvas_handleContextRestored = new WeakMap(), _WebglCanvas_instances = new WeakSet(), _WebglCanvas_init = function _WebglCanvas_init() {
    this.setCanvasSize(this.width, this.height);
    const gl = this.gl;
    if (__classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_checkContextLoss).call(this))
        return;
    __classPrivateFieldSet(this, _WebglCanvas_layerProgram, __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_createProgram).call(this, vertShaderLayer, fragShaderLayer), "f");
    __classPrivateFieldSet(this, _WebglCanvas_upscaleProgram, __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_createProgram).call(this, vertShaderUpscale, fragShaderUpscale), "f");
    __classPrivateFieldSet(this, _WebglCanvas_quadBuffer, __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_createScreenQuad).call(this, -1, -1, 2, 2, 1, 1), "f");
    __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_setBuffersAndAttribs).call(this, __classPrivateFieldGet(this, _WebglCanvas_layerProgram, "f"), __classPrivateFieldGet(this, _WebglCanvas_quadBuffer, "f"));
    __classPrivateFieldSet(this, _WebglCanvas_layerTexture, __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_createTexture).call(this, gl.RGBA, gl.LINEAR, gl.CLAMP_TO_EDGE), "f");
    __classPrivateFieldSet(this, _WebglCanvas_frameTexture, __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_createTexture).call(this, gl.RGBA, gl.LINEAR, gl.CLAMP_TO_EDGE), "f");
    __classPrivateFieldSet(this, _WebglCanvas_frameBuffer, __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_createFramebuffer).call(this, __classPrivateFieldGet(this, _WebglCanvas_frameTexture, "f")), "f");
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    const userAgent = navigator.userAgent;
    const isMacFirefox = userAgent.includes('Firefox') && userAgent.includes('Mac');
    __classPrivateFieldSet(this, _WebglCanvas_applyFirefoxFix, isMacFirefox && renderer.includes('Apple M'), "f");
}, _WebglCanvas_drawLayers = function _WebglCanvas_drawLayers(frameIndex, depthStrength = 0, depthEye = exports.FlipnoteStereoscopicEye.Left, shouldClear = true) {
    const gl = this.gl;
    const note = this.note;
    const srcWidth = this.srcWidth;
    const srcHeight = this.srcHeight;
    const numLayers = note.numLayers;
    const layerOrder = note.getFrameLayerOrder(frameIndex);
    const layerDepths = note.getFrameLayerDepths(frameIndex);
    __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_useFramebuffer).call(this, __classPrivateFieldGet(this, _WebglCanvas_frameBuffer, "f"));
    if (shouldClear)
        this.clear();
    gl.useProgram(__classPrivateFieldGet(this, _WebglCanvas_layerProgram, "f").program);
    for (let i = 0; i < numLayers; i++) {
        const layerIndex = layerOrder[i];
        note.getLayerPixelsRgba(frameIndex, layerIndex, __classPrivateFieldGet(this, _WebglCanvas_layerTexturePixelBuffer, "f"), __classPrivateFieldGet(this, _WebglCanvas_paletteBuffer, "f"));
        setUniforms(__classPrivateFieldGet(this, _WebglCanvas_layerProgram, "f"), {
            u_flipY: true,
            u_tex: __classPrivateFieldGet(this, _WebglCanvas_layerTexture, "f"),
            u_textureSize: [srcWidth, srcHeight],
            u_3d_mode: this.stereoscopeMode,
            u_3d_eye: depthEye,
            u_3d_depth: layerDepths[layerIndex],
            u_3d_strength: depthStrength,
        });
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, srcWidth, srcHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, __classPrivateFieldGet(this, _WebglCanvas_layerTexturePixels, "f"));
        gl.drawElements(gl.TRIANGLES, __classPrivateFieldGet(this, _WebglCanvas_quadBuffer, "f").numElements, __classPrivateFieldGet(this, _WebglCanvas_quadBuffer, "f").elementType, 0);
    }
}, _WebglCanvas_upscale = function _WebglCanvas_upscale(width, height) {
    if (__classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_checkContextLoss).call(this))
        return;
    const gl = this.gl;
    gl.useProgram(__classPrivateFieldGet(this, _WebglCanvas_upscaleProgram, "f").program);
    setUniforms(__classPrivateFieldGet(this, _WebglCanvas_upscaleProgram, "f"), {
        // u_flipY: true,
        u_tex: __classPrivateFieldGet(this, _WebglCanvas_frameTexture, "f"),
        u_textureSize: [this.srcWidth, this.srcHeight],
        u_screenSize: [width, height],
    });
    gl.drawElements(gl.TRIANGLES, __classPrivateFieldGet(this, _WebglCanvas_quadBuffer, "f").numElements, __classPrivateFieldGet(this, _WebglCanvas_quadBuffer, "f").elementType, 0);
}, _WebglCanvas_createProgram = function _WebglCanvas_createProgram(vertexShaderSource, fragmentShaderSource) {
    if (__classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_checkContextLoss).call(this))
        return;
    const gl = this.gl;
    const vert = __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_createShader).call(this, gl.VERTEX_SHADER, vertexShaderSource);
    const frag = __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_createShader).call(this, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = gl.createProgram();
    // set up shaders
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    // link program
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const log = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error(log);
    }
    const programInfo = createProgramInfoFromProgram(gl, program);
    __classPrivateFieldGet(this, _WebglCanvas_refs, "f").programs.push(program);
    return programInfo;
}, _WebglCanvas_createShader = function _WebglCanvas_createShader(type, source) {
    if (__classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_checkContextLoss).call(this))
        return;
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
    __classPrivateFieldGet(this, _WebglCanvas_refs, "f").shaders.push(shader);
    return shader;
}, _WebglCanvas_createScreenQuad = function _WebglCanvas_createScreenQuad(x0, y0, width, height, xSubdivs, ySubdivs) {
    if (__classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_checkContextLoss).call(this))
        return;
    const numVerts = (xSubdivs + 1) * (ySubdivs + 1);
    const numVertsAcross = xSubdivs + 1;
    const positions = new Float32Array(numVerts * 2);
    const texCoords = new Float32Array(numVerts * 2);
    let positionPtr = 0;
    let texCoordPtr = 0;
    for (let y = 0; y <= ySubdivs; y++) {
        for (let x = 0; x <= xSubdivs; x++) {
            const u = x / xSubdivs;
            const v = y / ySubdivs;
            positions[positionPtr++] = x0 + width * u;
            positions[positionPtr++] = y0 + height * v;
            texCoords[texCoordPtr++] = u;
            texCoords[texCoordPtr++] = v;
        }
    }
    const indices = new Uint16Array(xSubdivs * ySubdivs * 2 * 3);
    let indicesPtr = 0;
    for (let y = 0; y < ySubdivs; y++) {
        for (let x = 0; x < xSubdivs; x++) {
            // triangle 1
            indices[indicesPtr++] = (y + 0) * numVertsAcross + x;
            indices[indicesPtr++] = (y + 1) * numVertsAcross + x;
            indices[indicesPtr++] = (y + 0) * numVertsAcross + x + 1;
            // triangle 2
            indices[indicesPtr++] = (y + 0) * numVertsAcross + x + 1;
            indices[indicesPtr++] = (y + 1) * numVertsAcross + x;
            indices[indicesPtr++] = (y + 1) * numVertsAcross + x + 1;
        }
    }
    const bufferInfo = createBufferInfoFromArrays(this.gl, {
        position: {
            numComponents: 2,
            data: positions
        },
        texcoord: {
            numComponents: 2,
            data: texCoords
        },
        indices: indices
    });
    // collect references to buffer objects
    for (let name in bufferInfo.attribs)
        __classPrivateFieldGet(this, _WebglCanvas_refs, "f").buffers.push(bufferInfo.attribs[name].buffer);
    return bufferInfo;
}, _WebglCanvas_setBuffersAndAttribs = function _WebglCanvas_setBuffersAndAttribs(program, buffer) {
    if (__classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_checkContextLoss).call(this))
        return;
    setBuffersAndAttributes(this.gl, program.attribSetters, buffer);
}, _WebglCanvas_createTexture = function _WebglCanvas_createTexture(type, minMag, wrap, width = 1, height = 1) {
    if (__classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_checkContextLoss).call(this))
        return;
    const gl = this.gl;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minMag);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, minMag);
    gl.texImage2D(gl.TEXTURE_2D, 0, type, width, height, 0, type, gl.UNSIGNED_BYTE, null);
    __classPrivateFieldGet(this, _WebglCanvas_refs, "f").textures.push(tex);
    __classPrivateFieldGet(this, _WebglCanvas_textureTypes, "f").set(tex, type);
    __classPrivateFieldGet(this, _WebglCanvas_textureSizes, "f").set(tex, { width, height });
    return tex;
}, _WebglCanvas_resizeTexture = function _WebglCanvas_resizeTexture(texture, width, height) {
    if (__classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_checkContextLoss).call(this))
        return;
    const gl = this.gl;
    const textureType = __classPrivateFieldGet(this, _WebglCanvas_textureTypes, "f").get(texture);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, textureType, width, height, 0, textureType, gl.UNSIGNED_BYTE, null);
    __classPrivateFieldGet(this, _WebglCanvas_textureSizes, "f").set(texture, { width, height });
}, _WebglCanvas_createFramebuffer = function _WebglCanvas_createFramebuffer(texture) {
    if (__classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_checkContextLoss).call(this))
        return;
    const gl = this.gl;
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    __classPrivateFieldGet(this, _WebglCanvas_refs, "f").frameBuffers.push(fb);
    __classPrivateFieldGet(this, _WebglCanvas_frameBufferTextures, "f").set(fb, texture);
    return fb;
}, _WebglCanvas_useFramebuffer = function _WebglCanvas_useFramebuffer(fb, viewX, viewY, viewWidth, viewHeight) {
    if (__classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_checkContextLoss).call(this))
        return;
    const gl = this.gl;
    if (fb === null) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        /**
         * Firefox on Apple Silicon Macs seems to have some kind of viewport sizing bug that I can't track down.
         * Details here: https://github.com/jaames/flipnote.js/issues/30#issuecomment-2134602056
         * Not sure what's causing it, but this hack fixes it for now.
         * Need to test whether only specific versions of Firefox are affected, if it's only an Apple Silicon thing, etc, etc...
         */
        if (__classPrivateFieldGet(this, _WebglCanvas_applyFirefoxFix, "f")) {
            const srcWidth = this.srcWidth;
            const srcHeight = this.srcHeight;
            const sx = gl.drawingBufferWidth / srcWidth;
            const sy = gl.drawingBufferHeight / srcHeight;
            const adj = srcWidth === 256 ? 1 : 0; // ??????? why
            viewWidth = gl.drawingBufferWidth * (sx - adj);
            viewHeight = gl.drawingBufferHeight * (sy - adj);
            viewX = -(viewWidth - srcWidth * sx);
            viewY = -(viewHeight - srcHeight * sy);
        }
        gl.viewport(viewX ?? 0, viewY ?? 0, viewWidth ?? gl.drawingBufferWidth, viewHeight ?? gl.drawingBufferHeight);
    }
    else {
        const tex = __classPrivateFieldGet(this, _WebglCanvas_frameBufferTextures, "f").get(fb);
        const { width, height } = __classPrivateFieldGet(this, _WebglCanvas_textureSizes, "f").get(tex);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.viewport(viewX ?? 0, viewY ?? 0, viewWidth ?? width, viewHeight ?? height);
    }
}, _WebglCanvas_resizeFramebuffer = function _WebglCanvas_resizeFramebuffer(fb, width, height) {
    if (__classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_checkContextLoss).call(this))
        return;
    const texture = __classPrivateFieldGet(this, _WebglCanvas_frameBufferTextures, "f").get(fb);
    __classPrivateFieldGet(this, _WebglCanvas_instances, "m", _WebglCanvas_resizeTexture).call(this, texture, width, height);
}, _WebglCanvas_checkContextLoss = function _WebglCanvas_checkContextLoss() {
    const isLost = __classPrivateFieldGet(this, _WebglCanvas_isCtxLost, "f") || this.isErrorState();
    if (isLost)
        __classPrivateFieldGet(this, _WebglCanvas_handleContextLoss, "f").call(this);
    return isLost;
};
WebglCanvas.defaultOptions = {
    onlost: () => { },
    onrestored: () => { },
    useDpi: true
};

var _Html5Canvas_options, _Html5Canvas_srcCanvas, _Html5Canvas_srcCtx, _Html5Canvas_frameImage, _Html5Canvas_paletteBuffer, _Html5Canvas_frameBuffer;
/**
 * Flipnote renderer for the [HTML5 2D canvas API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
 */
class Html5Canvas {
    static isSupported() {
        if (!isBrowser)
            return false;
        let testCanvas = document.createElement('canvas');
        let testCtx = testCanvas.getContext('2d');
        const supported = testCtx !== null;
        testCanvas = null;
        testCtx = null;
        return supported;
    }
    constructor(parent, width, height, options = {}) {
        /**
         *
         */
        this.supportedStereoscopeModes = [
            exports.CanvasStereoscopicMode.None
        ];
        /**
         *
         */
        this.stereoscopeMode = exports.CanvasStereoscopicMode.None;
        /**
         *
         */
        this.stereoscopeStrength = 0;
        _Html5Canvas_options.set(this, void 0);
        _Html5Canvas_srcCanvas.set(this, void 0);
        _Html5Canvas_srcCtx.set(this, void 0);
        _Html5Canvas_frameImage.set(this, void 0);
        _Html5Canvas_paletteBuffer.set(this, new Uint32Array(16));
        _Html5Canvas_frameBuffer.set(this, void 0);
        assertBrowserEnv();
        __classPrivateFieldSet(this, _Html5Canvas_options, { ...Html5Canvas.defaultOptions, ...options }, "f");
        this.width = width;
        this.height = height;
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'FlipnoteCanvas FlipnoteCanvas--html5';
        this.ctx = this.canvas.getContext('2d');
        __classPrivateFieldSet(this, _Html5Canvas_srcCanvas, document.createElement('canvas'), "f");
        __classPrivateFieldSet(this, _Html5Canvas_srcCtx, __classPrivateFieldGet(this, _Html5Canvas_srcCanvas, "f").getContext('2d'), "f");
        assert(this.ctx !== null && __classPrivateFieldGet(this, _Html5Canvas_srcCtx, "f") !== null, 'Could not create HTML5 canvas');
        if (parent)
            parent.appendChild(this.canvas);
        this.setCanvasSize(width, height);
    }
    /**
     * Resize the canvas surface
     * @param width - New canvas width, in CSS pixels
     * @param height - New canvas height, in CSS pixels
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     */
    setCanvasSize(width, height) {
        const canvas = this.canvas;
        const useDpi = __classPrivateFieldGet(this, _Html5Canvas_options, "f").useDpi;
        const dpi = useDpi ? (window.devicePixelRatio || 1) : 1;
        const internalWidth = width * dpi;
        const internalHeight = height * dpi;
        this.width = width;
        this.height = height;
        this.dstWidth = internalWidth;
        this.dstHeight = internalHeight;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.width = internalWidth;
        canvas.height = internalHeight;
    }
    /**
     */
    setNote(note) {
        const width = note.imageWidth;
        const height = note.imageHeight;
        this.note = note;
        this.srcWidth = width;
        this.srcHeight = height;
        __classPrivateFieldGet(this, _Html5Canvas_srcCanvas, "f").width = width;
        __classPrivateFieldGet(this, _Html5Canvas_srcCanvas, "f").height = height;
        // create image data to fit note size
        __classPrivateFieldSet(this, _Html5Canvas_frameImage, __classPrivateFieldGet(this, _Html5Canvas_srcCtx, "f").createImageData(width, height), "f");
        // uint32 view of the img buffer memory
        __classPrivateFieldSet(this, _Html5Canvas_frameBuffer, new Uint32Array(__classPrivateFieldGet(this, _Html5Canvas_frameImage, "f").data.buffer), "f");
        this.frameIndex = undefined;
        // set canvas alt text
        this.canvas.title = note.getTitle();
    }
    /**
     * Clear the canvas
     * @param color optional RGBA color to use as a background color
     */
    clear(color) {
        // clear framebuffer
        __classPrivateFieldGet(this, _Html5Canvas_frameBuffer, "f").fill(0);
        // clear canvas
        this.ctx.clearRect(0, 0, this.dstWidth, this.dstHeight);
        // fill canvas with paper color
        if (color) {
            const [r, g, b, a] = color;
            this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
            this.ctx.fillRect(0, 0, this.dstWidth, this.dstHeight);
        }
    }
    drawFrame(frameIndex) {
        // clear whatever's already been drawn
        this.clear();
        // optionally enable image smoothing
        if (!__classPrivateFieldGet(this, _Html5Canvas_options, "f").useSmoothing)
            this.ctx.imageSmoothingEnabled = false;
        // get frame pixels as RGBA buffer
        this.note.getFramePixelsRgba(frameIndex, __classPrivateFieldGet(this, _Html5Canvas_frameBuffer, "f"), __classPrivateFieldGet(this, _Html5Canvas_paletteBuffer, "f"));
        // put framebuffer pixels into the src canvas
        __classPrivateFieldGet(this, _Html5Canvas_srcCtx, "f").putImageData(__classPrivateFieldGet(this, _Html5Canvas_frameImage, "f"), 0, 0);
        // composite src canvas to dst (so image scaling can be handled)
        this.ctx.drawImage(__classPrivateFieldGet(this, _Html5Canvas_srcCanvas, "f"), 0, 0, this.srcWidth, this.srcHeight, 0, 0, this.dstWidth, this.dstHeight);
        this.frameIndex = frameIndex;
    }
    requestStereoScopeMode(mode) {
        if (this.supportedStereoscopeModes.includes(mode))
            this.stereoscopeMode = mode;
        else
            this.stereoscopeMode = exports.CanvasStereoscopicMode.None;
        this.forceUpdate();
    }
    forceUpdate() {
        if (this.frameIndex !== undefined)
            this.drawFrame(this.frameIndex);
    }
    getDataUrl(type, quality) {
        return this.canvas.toDataURL(type, quality);
    }
    async getBlob(type, quality) {
        return new Promise((resolve, reject) => this.canvas.toBlob(resolve, type, quality));
    }
    destroy() {
        __classPrivateFieldSet(this, _Html5Canvas_frameImage, null, "f");
        __classPrivateFieldSet(this, _Html5Canvas_paletteBuffer, null, "f");
        __classPrivateFieldSet(this, _Html5Canvas_frameBuffer, null, "f");
        this.canvas.parentNode.removeChild(this.canvas);
        this.canvas.width = 1;
        this.canvas.height = 1;
        this.canvas = null;
        __classPrivateFieldGet(this, _Html5Canvas_srcCanvas, "f").width = 1;
        __classPrivateFieldGet(this, _Html5Canvas_srcCanvas, "f").height = 1;
        __classPrivateFieldSet(this, _Html5Canvas_srcCanvas, null, "f");
    }
}
_Html5Canvas_options = new WeakMap(), _Html5Canvas_srcCanvas = new WeakMap(), _Html5Canvas_srcCtx = new WeakMap(), _Html5Canvas_frameImage = new WeakMap(), _Html5Canvas_paletteBuffer = new WeakMap(), _Html5Canvas_frameBuffer = new WeakMap();
Html5Canvas.defaultOptions = {
    useDpi: true,
    useSmoothing: true,
};

var _UniversalCanvas_instances, _UniversalCanvas_rendererStack, _UniversalCanvas_rendererStackIdx, _UniversalCanvas_parent, _UniversalCanvas_options, _UniversalCanvas_setSubRenderer;
class UniversalCanvas {
    constructor(parent, width = 640, height = 480, options = {}) {
        _UniversalCanvas_instances.add(this);
        /**
         *
         */
        this.isReady = false;
        /**
         *
         */
        this.isHtml5 = false;
        /**
         *
         */
        this.supportedStereoscopeModes = [];
        /**
         *
         */
        this.stereoscopeMode = exports.CanvasStereoscopicMode.None;
        /**
         *
         */
        this.stereoscopeStrength = 1;
        _UniversalCanvas_rendererStack.set(this, [
            WebglCanvas,
            Html5Canvas
        ]);
        _UniversalCanvas_rendererStackIdx.set(this, 0);
        _UniversalCanvas_parent.set(this, void 0);
        _UniversalCanvas_options.set(this, {});
        this.width = width;
        this.height = height;
        __classPrivateFieldSet(this, _UniversalCanvas_parent, parent, "f");
        __classPrivateFieldSet(this, _UniversalCanvas_options, options, "f");
        __classPrivateFieldGet(this, _UniversalCanvas_instances, "m", _UniversalCanvas_setSubRenderer).call(this, __classPrivateFieldGet(this, _UniversalCanvas_rendererStack, "f")[0]);
    }
    fallbackIfPossible() {
        if (__classPrivateFieldGet(this, _UniversalCanvas_rendererStackIdx, "f") >= __classPrivateFieldGet(this, _UniversalCanvas_rendererStack, "f").length)
            throw new Error('No renderer to fall back to');
        __classPrivateFieldSet(this, _UniversalCanvas_rendererStackIdx, __classPrivateFieldGet(this, _UniversalCanvas_rendererStackIdx, "f") + 1, "f");
        __classPrivateFieldGet(this, _UniversalCanvas_instances, "m", _UniversalCanvas_setSubRenderer).call(this, __classPrivateFieldGet(this, _UniversalCanvas_rendererStack, "f")[__classPrivateFieldGet(this, _UniversalCanvas_rendererStackIdx, "f")]);
    }
    // for backwards compat
    switchToHtml5() {
        __classPrivateFieldGet(this, _UniversalCanvas_instances, "m", _UniversalCanvas_setSubRenderer).call(this, Html5Canvas);
    }
    setCanvasSize(width, height) {
        const renderer = this.renderer;
        renderer.setCanvasSize(width, height);
        this.width = width;
        this.width = height;
        this.dstWidth = renderer.dstWidth;
        this.dstHeight = renderer.dstHeight;
    }
    setNote(note) {
        this.note = note;
        this.renderer.setNote(note);
        this.frameIndex = undefined;
        this.srcWidth = this.renderer.srcWidth;
        this.srcHeight = this.renderer.srcHeight;
    }
    clear(color) {
        this.renderer.clear(color);
    }
    drawFrame(frameIndex) {
        this.renderer.drawFrame(frameIndex);
        this.frameIndex = frameIndex;
    }
    forceUpdate() {
        this.renderer.forceUpdate();
    }
    requestStereoScopeMode(mode) {
        this.renderer.requestStereoScopeMode(mode);
        this.stereoscopeMode = this.renderer.stereoscopeMode;
    }
    getDataUrl(type, quality) {
        return this.renderer.getDataUrl();
    }
    async getBlob(type, quality) {
        return this.renderer.getBlob();
    }
    destroy() {
        this.renderer.destroy();
        this.note = null;
    }
}
_UniversalCanvas_rendererStack = new WeakMap(), _UniversalCanvas_rendererStackIdx = new WeakMap(), _UniversalCanvas_parent = new WeakMap(), _UniversalCanvas_options = new WeakMap(), _UniversalCanvas_instances = new WeakSet(), _UniversalCanvas_setSubRenderer = function _UniversalCanvas_setSubRenderer(Canvas) {
    let immediateLoss = false;
    const renderer = new Canvas(__classPrivateFieldGet(this, _UniversalCanvas_parent, "f"), this.width, this.height, {
        ...__classPrivateFieldGet(this, _UniversalCanvas_options, "f"),
        onlost: () => {
            immediateLoss = true;
            this.fallbackIfPossible();
        }
    });
    // if onlost was called immediately, we succeed to the fallback
    if (immediateLoss)
        return;
    if (this.note) {
        renderer.setNote(this.note);
        renderer.frameIndex = this.renderer?.frameIndex;
        renderer.forceUpdate();
    }
    if (this.renderer)
        this.renderer.destroy();
    this.isHtml5 = renderer instanceof Html5Canvas;
    this.isReady = true;
    this.renderer = renderer;
    __classPrivateFieldSet(this, _UniversalCanvas_rendererStackIdx, __classPrivateFieldGet(this, _UniversalCanvas_rendererStack, "f").indexOf(Canvas), "f");
    this.supportedStereoscopeModes = renderer.supportedStereoscopeModes;
    renderer.stereoscopeStrength = this.stereoscopeStrength;
    this.requestStereoScopeMode(this.stereoscopeMode);
};

var _WebAudioPlayer_instances, _WebAudioPlayer_volume, _WebAudioPlayer_loop, _WebAudioPlayer_startTime, _WebAudioPlayer_ctxStartTime, _WebAudioPlayer_nodeRefs, _WebAudioPlayer_buffer, _WebAudioPlayer_gainNode, _WebAudioPlayer_source, _WebAudioPlayer_getCtx, _WebAudioPlayer_connectEqNodesTo, _WebAudioPlayer_initNodes;
/**
 * @internal
 */
const _AudioContext = (() => {
    if (isBrowser)
        return (window.AudioContext || window.webkitAudioContext);
    return null;
})();
/**
 * Audio player built around the {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API | Web Audio API}.
 *
 * Capable of playing PCM streams, with volume adjustment and an optional equalizer. Only available in browser contexts.
 */
class WebAudioPlayer {
    constructor() {
        _WebAudioPlayer_instances.add(this);
        /**
         * Whether the audio is being run through an equalizer or not.
         */
        this.useEq = false;
        /**
         * Whether to connect the output to an audio analyser (see {@link analyser}).
         */
        this.useAnalyser = false;
        /**
         * Default equalizer settings. Credit to {@link https://www.sudomemo.net/ | Sudomemo} for these.
         */
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
        _WebAudioPlayer_volume.set(this, 1);
        _WebAudioPlayer_loop.set(this, false);
        _WebAudioPlayer_startTime.set(this, 0);
        _WebAudioPlayer_ctxStartTime.set(this, 0);
        _WebAudioPlayer_nodeRefs.set(this, []);
        _WebAudioPlayer_buffer.set(this, void 0);
        _WebAudioPlayer_gainNode.set(this, void 0);
        _WebAudioPlayer_source.set(this, void 0);
        assertBrowserEnv();
    }
    /**
     * The audio output volume. Range is 0 to 1.
     */
    set volume(value) {
        this.setVolume(value);
    }
    get volume() {
        return __classPrivateFieldGet(this, _WebAudioPlayer_volume, "f");
    }
    /**
     * Whether the audio should loop after it has ended
     */
    set loop(value) {
        __classPrivateFieldSet(this, _WebAudioPlayer_loop, value, "f");
        if (__classPrivateFieldGet(this, _WebAudioPlayer_source, "f"))
            __classPrivateFieldGet(this, _WebAudioPlayer_source, "f").loop = value;
    }
    get loop() {
        return __classPrivateFieldGet(this, _WebAudioPlayer_loop, "f");
    }
    /**
     * Set the audio buffer to play
     * @param inputBuffer
     * @param sampleRate - For best results, this should be a multiple of 16364
     */
    setBuffer(inputBuffer, sampleRate) {
        const ctx = __classPrivateFieldGet(this, _WebAudioPlayer_instances, "m", _WebAudioPlayer_getCtx).call(this);
        const numSamples = inputBuffer.length;
        const audioBuffer = ctx.createBuffer(1, numSamples, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        if (inputBuffer instanceof Float32Array)
            channelData.set(inputBuffer, 0);
        else if (inputBuffer instanceof Int16Array) {
            for (let i = 0; i < numSamples; i++) {
                channelData[i] = inputBuffer[i] / 32768;
            }
        }
        __classPrivateFieldSet(this, _WebAudioPlayer_buffer, audioBuffer, "f");
        this.sampleRate = sampleRate;
    }
    setAnalyserEnabled(on) {
        this.useAnalyser = on;
        __classPrivateFieldGet(this, _WebAudioPlayer_instances, "m", _WebAudioPlayer_initNodes).call(this);
    }
    /**
     * Sets the audio volume level
     * @param value - range is 0 to 1
     */
    setVolume(value) {
        __classPrivateFieldSet(this, _WebAudioPlayer_volume, value, "f");
        if (__classPrivateFieldGet(this, _WebAudioPlayer_gainNode, "f")) {
            // human perception of loudness is logarithmic, rather than linear
            // https://www.dr-lex.be/info-stuff/volumecontrols.html
            __classPrivateFieldGet(this, _WebAudioPlayer_gainNode, "f").gain.value = Math.pow(value, 2);
        }
    }
    /**
     * Begin playback from a specific point
     *
     * Note that the WebAudioPlayer doesn't keep track of audio playback itself. We rely on the {@link Player} API for that.
     * @param currentTime initial playback position, in seconds
     */
    playFrom(currentTime) {
        __classPrivateFieldGet(this, _WebAudioPlayer_instances, "m", _WebAudioPlayer_initNodes).call(this);
        __classPrivateFieldSet(this, _WebAudioPlayer_startTime, currentTime, "f");
        __classPrivateFieldSet(this, _WebAudioPlayer_ctxStartTime, this.ctx.currentTime, "f");
        __classPrivateFieldGet(this, _WebAudioPlayer_source, "f").loop = __classPrivateFieldGet(this, _WebAudioPlayer_loop, "f");
        __classPrivateFieldGet(this, _WebAudioPlayer_source, "f").start(0, currentTime);
    }
    /**
     * Stops the audio playback
     */
    stop() {
        if (__classPrivateFieldGet(this, _WebAudioPlayer_source, "f"))
            __classPrivateFieldGet(this, _WebAudioPlayer_source, "f").stop(0);
    }
    /**
     * Get the current playback time, in seconds
     */
    getCurrentTime() {
        return __classPrivateFieldGet(this, _WebAudioPlayer_startTime, "f") + (this.ctx.currentTime - __classPrivateFieldGet(this, _WebAudioPlayer_ctxStartTime, "f"));
    }
    /**
     * Frees any resources used by this canvas instance
     */
    async destroy() {
        this.stop();
        const ctx = __classPrivateFieldGet(this, _WebAudioPlayer_instances, "m", _WebAudioPlayer_getCtx).call(this);
        __classPrivateFieldGet(this, _WebAudioPlayer_nodeRefs, "f").forEach(node => node.disconnect());
        __classPrivateFieldSet(this, _WebAudioPlayer_nodeRefs, [], "f");
        this.analyser = undefined;
        if (ctx.state !== 'closed' && typeof ctx.close === 'function')
            await ctx.close();
        __classPrivateFieldSet(this, _WebAudioPlayer_buffer, null, "f");
    }
}
_WebAudioPlayer_volume = new WeakMap(), _WebAudioPlayer_loop = new WeakMap(), _WebAudioPlayer_startTime = new WeakMap(), _WebAudioPlayer_ctxStartTime = new WeakMap(), _WebAudioPlayer_nodeRefs = new WeakMap(), _WebAudioPlayer_buffer = new WeakMap(), _WebAudioPlayer_gainNode = new WeakMap(), _WebAudioPlayer_source = new WeakMap(), _WebAudioPlayer_instances = new WeakSet(), _WebAudioPlayer_getCtx = function _WebAudioPlayer_getCtx() {
    if (!this.ctx)
        this.ctx = new _AudioContext();
    return this.ctx;
}, _WebAudioPlayer_connectEqNodesTo = function _WebAudioPlayer_connectEqNodesTo(inNode) {
    const ctx = __classPrivateFieldGet(this, _WebAudioPlayer_instances, "m", _WebAudioPlayer_getCtx).call(this);
    const eqSettings = this.eqSettings;
    let lastNode = inNode;
    eqSettings.forEach(([frequency, gain], index) => {
        const node = ctx.createBiquadFilter();
        __classPrivateFieldGet(this, _WebAudioPlayer_nodeRefs, "f").push(node);
        node.frequency.value = frequency;
        node.gain.value = gain;
        if (index === 0)
            node.type = 'lowshelf';
        else if (index === eqSettings.length - 1)
            node.type = 'highshelf';
        else
            node.type = 'peaking';
        lastNode.connect(node);
        lastNode = node;
    });
    return lastNode;
}, _WebAudioPlayer_initNodes = function _WebAudioPlayer_initNodes() {
    const ctx = __classPrivateFieldGet(this, _WebAudioPlayer_instances, "m", _WebAudioPlayer_getCtx).call(this);
    __classPrivateFieldSet(this, _WebAudioPlayer_nodeRefs, [], "f");
    const source = ctx.createBufferSource();
    __classPrivateFieldGet(this, _WebAudioPlayer_nodeRefs, "f").push(source);
    source.buffer = __classPrivateFieldGet(this, _WebAudioPlayer_buffer, "f");
    const gainNode = ctx.createGain();
    __classPrivateFieldGet(this, _WebAudioPlayer_nodeRefs, "f").push(gainNode);
    if (this.useEq) {
        const eq = __classPrivateFieldGet(this, _WebAudioPlayer_instances, "m", _WebAudioPlayer_connectEqNodesTo).call(this, source);
        eq.connect(gainNode);
    }
    else {
        source.connect(gainNode);
    }
    if (this.useAnalyser) {
        const analyserNode = ctx.createAnalyser();
        __classPrivateFieldGet(this, _WebAudioPlayer_nodeRefs, "f").push(analyserNode);
        this.analyser = analyserNode;
        gainNode.connect(analyserNode);
        analyserNode.connect(ctx.destination);
    }
    else {
        this.analyser = undefined;
        gainNode.connect(ctx.destination);
    }
    __classPrivateFieldSet(this, _WebAudioPlayer_source, source, "f");
    __classPrivateFieldSet(this, _WebAudioPlayer_gainNode, gainNode, "f");
    this.setVolume(__classPrivateFieldGet(this, _WebAudioPlayer_volume, "f"));
};

var _Player_instances, _Player_playAudio, _Player_stopAudio;
/**
 * Flipnote Player API (exported as `flipnote.Player`) - provides a {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement | MediaElement}-like interface for loading Flipnotes and playing them.
 * This is intended for cases where you want to implement your own player UI, if you just want a pre-built player with some nice UI controls, check out the [Web Components](/web-components/) page instead!
 *
 * ### Create a new player
 *
 * You'll need an element in your page's HTML to act as a wrapper for the player:
 *
 * ```html
 *  <div id="player-wrapper"></div>
 * ```
 *
 * Then you can create a new `Player` instance by passing a CSS selector that matches the wrapper element, plus the desired width and height.
 *
 * ```js
 *  const player = new flipnote.Player('#player-wrapper', 320, 240);
 * ```
 *
 * ### Load a Flipnote
 *
 * Load a Flipnote from a valid {@link FlipnoteSource}:
 *
 * ```js
 * player.load('./path/to/flipnote.ppm');
 * ```
 *
 * ### Listen to events
 *
 * Use the {@link on} method to register event listeners:
 *
 * ```js
 *  player.on('play', function() {
 *    // do something when the Flipnote starts playing...
 *  });
 * ```
 */
class Player {
    /**
     * Create a new Player instance
     *
     * @param parent - Element to mount the rendering canvas to
     * @param width - Canvas width (pixels)
     * @param height - Canvas height (pixels)
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     */
    constructor(parent, width, height, parserSettings = {}) {
        _Player_instances.add(this);
        /**
         * Animation duration, in seconds
         */
        this.duration = 0;
        /**
         * Automatically begin playback after a Flipnote is loaded
         */
        this.autoplay = false;
        /**
         * Array of events supported by this player
         */
        this.supportedEvents = supportedEvents;
        /**
         * @internal
         */
        this._src = null;
        /**
         * @internal
         */
        this._loop = false;
        /**
         * @internal
         */
        this._volume = 1;
        /**
         * @internal
         */
        this._muted = false;
        /**
         * @internal
         */
        this._frame = null;
        /**
         * @internal
         */
        this._hasEnded = false;
        /**
         * @internal
         */
        this.isNoteLoaded = false;
        /**
         * @internal
         */
        this.events = new Map();
        /**
         * @internal
         */
        this.playbackStartTime = 0;
        /**
         * @internal
         */
        this.playbackTime = 0;
        /**
         * @internal
         */
        this.playbackLoopId = null;
        /**
         * @internal
         */
        this.showThumbnail = true;
        /**
         * @internal
         */
        this.hasPlaybackStarted = false;
        /**
         * @internal
         */
        this.isPlaying = false;
        /**
         * @internal
         */
        this.wasPlaying = false;
        /**
         * @internal
         */
        this.isSeeking = false;
        /**
         * Playback animation loop
         * @internal
         * @group Playback Control
         */
        this.playbackLoop = (timestamp) => {
            if (!this.isPlaying)
                return;
            const now = timestamp / 1000;
            const duration = this.duration;
            const currAudioTime = this.audio.getCurrentTime();
            let currPlaybackTime = now - this.playbackStartTime;
            // try to keep playback time in sync with the audio if there's any slipping
            if (Math.abs((currPlaybackTime % duration) - (currAudioTime % duration)) > 0.01)
                currPlaybackTime = currAudioTime;
            // handle playback end, if reached
            if (currPlaybackTime >= duration) {
                if (this.loop) {
                    this.playbackStartTime = now;
                    this.emit(exports.PlayerEvent.Loop);
                }
                else {
                    this.pause();
                    this._hasEnded = true;
                    this.emit(exports.PlayerEvent.Ended);
                    return;
                }
            }
            this.setCurrentTime(currPlaybackTime % duration);
            this.playbackLoopId = requestAnimationFrame(this.playbackLoop);
        };
        assertBrowserEnv();
        // if parent is a string, use it to select an Element, else assume it's an Element
        const mountPoint = ('string' == typeof parent) ? document.querySelector(parent) : parent;
        this.parserSettings = parserSettings;
        this.renderer = new UniversalCanvas(mountPoint, width, height, {
            onlost: () => this.emit(exports.PlayerEvent.Error),
            onrestored: () => this.reload()
        });
        this.audio = new WebAudioPlayer();
        this.el = mountPoint;
    }
    /**
     * The currently loaded Flipnote source, if there is one
     * @group Lifecycle
     * @deprecated
     */
    get src() {
        return this._src;
    }
    set src(source) {
        throw new Error('Setting a Player source has been deprecated, please use the load() method instead');
    }
    /**
     * Indicates whether playback is currently paused
     * @group Playback Control
     */
    get paused() {
        return !this.isPlaying;
    }
    set paused(isPaused) {
        if (isPaused)
            this.pause();
        else
            this.play();
    }
    /**
     * Current animation frame index.
     * @group Playback Control
     */
    get currentFrame() {
        return this._frame;
    }
    set currentFrame(frameIndex) {
        this.setCurrentFrame(frameIndex);
    }
    /**
     * Current animation playback position, in seconds.
     * @group Playback Control
     */
    get currentTime() {
        return this.isNoteLoaded ? this.playbackTime : null;
    }
    set currentTime(value) {
        this.setCurrentTime(value);
    }
    /**
     * Current animation playback progress, as a percentage out of 100.
     * @group Playback Control
     */
    get progress() {
        return this.isNoteLoaded ? (this.playbackTime / this.duration) * 100 : null;
    }
    set progress(value) {
        this.setProgress(value);
    }
    /**
     * Audio volume, range `0` to `1`.
     * @group Audio Control
     */
    get volume() {
        return this.getVolume();
    }
    set volume(value) {
        this.setVolume(value);
    }
    /**
     * Audio mute state.
     * @group Audio Control
     */
    get muted() {
        return this.getMuted();
    }
    set muted(value) {
        this.setMuted(value);
    }
    /**
     * Indicates whether playback should loop once the end is reached
     * @group Playback Control
     */
    get loop() {
        return this.getLoop();
    }
    set loop(value) {
        this.setLoop(value);
    }
    /**
     * Animation frame rate, measured in frames per second.
     * @group Playback Control
     */
    get framerate() {
        return this.note.framerate;
    }
    /**
     * Animation frame count.
     * @group Frame Control
     */
    get frameCount() {
        return this.note.frameCount;
    }
    /**
     * Animation frame speed.
     * @group Frame Control
     */
    get frameSpeed() {
        return this.note.frameSpeed;
    }
    /**
     * Implementation of the `HTMLMediaElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered | buffered } property.
     * @group HTMLVideoElement compatibility
     */
    get buffered() {
        return createTimeRanges([[0, this.duration]]);
    }
    /**
     * Implementation of the `HTMLMediaElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seekable | seekable} property
     * @group HTMLVideoElement compatibility
     */
    get seekable() {
        return createTimeRanges([[0, this.duration]]);
    }
    /**
     * Implementation of the `HTMLMediaElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentSrc | currentSrc} property
     * @group HTMLVideoElement compatibility
     */
    get currentSrc() {
        return this._src;
    }
    /**
     * Implementation of the `HTMLVideoElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoWidth | videoWidth} property
     * @group HTMLVideoElement compatibility
     */
    get videoWidth() {
        return this.isNoteLoaded ? this.note.imageWidth : 0;
    }
    /**
     * Implementation of the `HTMLVideoElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoHeight | videoHeight} property
     * @group HTMLVideoElement compatibility
     */
    get videoHeight() {
        return this.isNoteLoaded ? this.note.imageHeight : 0;
    }
    /**
     * Open a Flipnote from a source
     * @group Lifecycle
     */
    async load(source) {
        // close currently open note first
        if (this.isNoteLoaded)
            this.closeNote();
        // keep track of source
        this._src = source;
        // if no source specified, just reset everything
        if (!source)
            return this.openNote(this.note);
        // otherwise do a normal load
        this.emit(exports.PlayerEvent.LoadStart);
        const [err, note] = await until(() => parse(source, this.parserSettings));
        if (err) {
            this.emit(exports.PlayerEvent.Error, err);
            throw new Error(`Error loading Flipnote: ${err.message}`);
        }
        this.openNote(note);
    }
    /**
     * Reload the current Flipnote.
     * @group Lifecycle
     */
    async reload() {
        if (this.note)
            return await this.load(this.note.buffer);
    }
    /**
     * Reload the current Flipnote, applying new parser settings.
     * @group Lifecycle
     */
    async updateSettings(settings) {
        this.parserSettings = settings;
        return await this.reload();
    }
    /**
     * Close the currently loaded Flipnote
     * @group Lifecycle
     */
    closeNote() {
        this.pause();
        this.note = null;
        this.isNoteLoaded = false;
        this.meta = null;
        this._src = null;
        this._frame = 0;
        // this.playbackFrame = null;
        this.playbackTime = 0;
        this.duration = 0;
        this.loop = false;
        this.isPlaying = false;
        this.wasPlaying = false;
        this.hasPlaybackStarted = false;
        this.showThumbnail = true;
        this.renderer.clear();
    }
    /**
     * Open a Flipnote into the player
     * @group Lifecycle
     */
    openNote(note) {
        if (this.isNoteLoaded)
            this.closeNote();
        this.note = note;
        this.meta = note.meta;
        this.emit(exports.PlayerEvent.LoadedMeta);
        this.noteFormat = note.format;
        this.duration = note.duration;
        this.playbackTime = 0;
        this._frame = 0;
        this.isNoteLoaded = true;
        this.isPlaying = false;
        this.wasPlaying = false;
        this.hasPlaybackStarted = false;
        this.layerVisibility = note.layerVisibility;
        this.showThumbnail = true;
        this.audio.setBuffer(note.getAudioMasterPcm(), note.sampleRate);
        this.emit(exports.PlayerEvent.CanPlay);
        this.emit(exports.PlayerEvent.CanPlayThrough);
        this.setLoop(note.meta.loop);
        this.renderer.setNote(note);
        this.drawFrame(note.thumbFrameIndex);
        this.emit(exports.PlayerEvent.LoadedData);
        this.emit(exports.PlayerEvent.Load);
        this.emit(exports.PlayerEvent.Ready);
        if (this.autoplay)
            this.play();
    }
    /**
     * Set the current playback time
     * @group Playback Control
     */
    setCurrentTime(value) {
        this.assertNoteLoaded();
        const i = Math.floor(value / (1 / this.framerate));
        this.setCurrentFrame(i);
        this.playbackTime = value;
        this.emit(exports.PlayerEvent.Progress, this.progress);
    }
    /**
     * Get the current playback time
     * @group Playback Control
     */
    getCurrentTime() {
        return this.currentTime;
    }
    /**
     * Get the current time as a counter string, like `"0:00 / 1:00"`
     * @group Playback Control
     */
    getTimeCounter() {
        const currentTime = formatTime(Math.max(this.currentTime, 0));
        const duration = formatTime(this.duration);
        return `${currentTime} / ${duration}`;
    }
    /**
     * Get the current frame index as a counter string, like `"001 / 999"`
     * @group Playback Control
     */
    getFrameCounter() {
        const frame = padNumber(this.currentFrame + 1, 3);
        const total = padNumber(this.frameCount, 3);
        return `${frame} / ${total}`;
    }
    /**
     * Set the current playback progress as a percentage (`0` to `100`)
     * @group Playback Control
     */
    setProgress(value) {
        this.assertNoteLoaded();
        assertRange(value, 0, 100, 'progress');
        this.currentTime = this.duration * (value / 100);
    }
    /**
     * Get the current playback progress as a percentage (0 to 100)
     * @group Playback Control
     */
    getProgress() {
        return this.progress;
    }
    /**
     * Begin animation playback starting at the current position
     * @group Playback Control
     */
    async play() {
        this.assertNoteLoaded();
        if (this.isPlaying)
            return;
        // if the flipnote hasn't looped and is at the end, rewind it to 0
        if (this._hasEnded) {
            this.playbackTime = 0;
            this._hasEnded = false;
        }
        const now = performance.now();
        this.playbackStartTime = (now / 1000) - this.playbackTime;
        this.isPlaying = true;
        this.hasPlaybackStarted = true;
        __classPrivateFieldGet(this, _Player_instances, "m", _Player_playAudio).call(this);
        this.playbackLoop(now);
        this.emit(exports.PlayerEvent.Play);
    }
    /**
     * Pause animation playback at the current position
     * @group Playback Control
     */
    pause() {
        if (!this.isPlaying)
            return;
        this.isPlaying = false;
        if (this.playbackLoopId !== null)
            cancelAnimationFrame(this.playbackLoopId);
        __classPrivateFieldGet(this, _Player_instances, "m", _Player_stopAudio).call(this);
        this.emit(exports.PlayerEvent.Pause);
    }
    /**
     * Resumes animation playback if paused, otherwise pauses
     * @group Playback Control
     */
    togglePlay() {
        if (!this.isPlaying)
            this.play();
        else
            this.pause();
    }
    /**
     * Determines if playback is currently paused
     * @group Playback Control
     */
    getPaused() {
        return !this.isPlaying;
    }
    /**
     * Get the duration of the Flipnote in seconds
     * @group Playback Control
     */
    getDuration() {
        return this.duration;
    }
    /**
     * Determines if playback is looped
     * @group Playback Control
     */
    getLoop() {
        return this._loop;
    }
    /**
     * Set the playback loop
     * @group Playback Control
     */
    setLoop(loop) {
        this._loop = loop;
        this.audio.loop = loop;
    }
    /**
     * Switch the playback loop between on and off
     * @group Playback Control
     */
    toggleLoop() {
        this.setLoop(!this._loop);
    }
    /**
     * Jump to a given animation frame
     * @group Frame Control
     */
    setCurrentFrame(newFrameValue) {
        this.assertNoteLoaded();
        const newFrameIndex = Math.max(0, Math.min(Math.floor(newFrameValue), this.frameCount - 1));
        if (newFrameIndex === this.currentFrame && !this.showThumbnail)
            return;
        this._frame = newFrameIndex;
        this.drawFrame(newFrameIndex);
        this.showThumbnail = false;
        if (!this.isPlaying) {
            this.playbackTime = newFrameIndex * (1 / this.framerate);
            this.emit(exports.PlayerEvent.SeekEnd);
        }
        this.emit(exports.PlayerEvent.FrameUpdate, this.currentFrame);
        this.emit(exports.PlayerEvent.Progress, this.progress);
        this.emit(exports.PlayerEvent.TimeUpdate, this.currentFrame);
    }
    /**
     * Jump to the next animation frame
     * If the animation loops, and is currently on its last frame, it will wrap to the first frame
     * @group Frame Control
     */
    nextFrame() {
        if ((this.loop) && (this.currentFrame === this.frameCount - 1))
            this.currentFrame = 0;
        else
            this.currentFrame += 1;
        this.emit(exports.PlayerEvent.FrameNext);
    }
    /**
     * Jump to the next animation frame
     * If the animation loops, and is currently on its first frame, it will wrap to the last frame
     * @group Frame Control
     */
    prevFrame() {
        if ((this.loop) && (this.currentFrame === 0))
            this.currentFrame = this.frameCount - 1;
        else
            this.currentFrame -= 1;
        this.emit(exports.PlayerEvent.FramePrev);
    }
    /**
     * Jump to the last animation frame
     * @group Frame Control
     */
    lastFrame() {
        this.currentFrame = this.frameCount - 1;
        this.emit(exports.PlayerEvent.FrameLast);
    }
    /**
     * Jump to the first animation frame
     * @group Frame Control
     */
    firstFrame() {
        this.currentFrame = 0;
        this.emit(exports.PlayerEvent.FrameFirst);
    }
    /**
     * Jump to the thumbnail frame
     * @group Frame Control
     */
    thumbnailFrame() {
        this.currentFrame = this.note.thumbFrameIndex;
    }
    /**
     * Begins a seek operation
     * @group Playback Control
     */
    startSeek() {
        if (!this.isSeeking) {
            this.emit(exports.PlayerEvent.SeekStart);
            this.wasPlaying = this.isPlaying;
            this.pause();
            this.isSeeking = true;
        }
    }
    /**
     * Seek the playback progress to a different position
     * @param position - animation playback position, range `0` to `1`
     * @group Playback Control
     */
    seek(position) {
        if (this.isSeeking)
            this.progress = position * 100;
    }
    /**
     * Ends a seek operation
     * @group Playback Control
     */
    endSeek() {
        if (this.isSeeking && this.wasPlaying === true)
            this.play();
        this.wasPlaying = false;
        this.isSeeking = false;
    }
    /**
     * Draws the specified animation frame to the canvas. Note that this doesn't update the playback time or anything, it simply decodes a given frame and displays it.
     * @param frameIndex
     * @group Display Control
     */
    drawFrame(frameIndex) {
        this.renderer.drawFrame(frameIndex);
    }
    /**
     * Forces the current animation frame to be redrawn
     * @group Display Control
     */
    forceUpdate() {
        this.renderer.forceUpdate();
    }
    /**
     * Resize the playback canvas to a new size
     * @param width - new canvas width (pixels)
     * @param height - new canvas height (pixels)
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     *
     * @group Display Control
     */
    resize(width, height) {
        if (height !== width * .75)
            console.warn(`Canvas width to height ratio should be 3:4 for best results (got ${width}x${height})`);
        this.renderer.setCanvasSize(width, height);
        this.forceUpdate();
    }
    /**
     * Sets whether an animation layer should be visible throughout the entire animation
     * @param layer - layer index, starting at 1
     * @param value - `true` for visible, `false` for invisible
     *
     * @group Display Control
     */
    setLayerVisibility(layer, value) {
        this.note.layerVisibility[layer] = value;
        this.layerVisibility[layer] = value;
        this.forceUpdate();
    }
    /**
     * Returns the visibility state for a given layer
     * @param layer - layer index, starting at 1
     *
     * @group Display Control
     */
    getLayerVisibility(layer) {
        return this.layerVisibility[layer];
    }
    /**
     * Toggles whether an animation layer should be visible throughout the entire animation
     *
     * @group Display Control
     */
    toggleLayerVisibility(layerIndex) {
        this.setLayerVisibility(layerIndex, !this.layerVisibility[layerIndex]);
    }
    /**
     * Toggle audio Sudomemo equalizer filter.
     * @group Audio Control
     */
    toggleAudioEq() {
        this.setAudioEq(!this.audio.useEq);
    }
    /**
     * Turn audio Sudomemo equalizer filter on or off.
     * @group Audio Control
     */
    setAudioEq(state) {
        if (this.isPlaying) {
            this.wasPlaying = true;
            __classPrivateFieldGet(this, _Player_instances, "m", _Player_stopAudio).call(this);
        }
        this.audio.useEq = state;
        if (this.wasPlaying) {
            this.wasPlaying = false;
            __classPrivateFieldGet(this, _Player_instances, "m", _Player_playAudio).call(this);
        }
    }
    /**
     * Turn the audio off
     * @group Audio Control
     */
    mute() {
        this.setMuted(true);
    }
    /**
     * Turn the audio on
     * @group Audio Control
     */
    unmute() {
        this.setMuted(false);
    }
    /**
     * Turn the audio on or off
     * @group Audio Control
     */
    setMuted(isMute) {
        if (isMute)
            this.audio.volume = 0;
        else
            this.audio.volume = this._volume;
        this._muted = isMute;
        this.emit(exports.PlayerEvent.VolumeChange, this.audio.volume);
    }
    /**
     * Get the audio mute state
     * @group Audio Control
     */
    getMuted() {
        return this.volume === 0 ? true : this._muted;
    }
    /**
     * Switch the audio between muted and unmuted
     * @group Audio Control
     */
    toggleMuted() {
        this.setMuted(!this._muted);
    }
    /**
     * Set the audio volume
     * @group Audio Control
     */
    setVolume(volume) {
        assertRange(volume, 0, 1, 'volume');
        this._volume = volume;
        this.audio.volume = volume;
        this.emit(exports.PlayerEvent.VolumeChange, this.audio.volume);
    }
    /**
     * Get the current audio volume
     * @group Audio Control
     */
    getVolume() {
        return this._muted ? 0 : this._volume;
    }
    /**
     * Implementation of the `HTMLVideoElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/seekToNextFrame | seekToNextFrame} method
     * @group HTMLVideoElement compatibility
     */
    seekToNextFrame() {
        this.nextFrame();
    }
    /**
     * Implementation of the `HTMLMediaElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/fastSeek | fastSeek} method
     * @group HTMLVideoElement compatibility
     */
    fastSeek(time) {
        this.currentTime = time;
    }
    /**
     * Implementation of the `HTMLVideoElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/getVideoPlaybackQuality | getVideoPlaybackQuality } method
     * @group HTMLVideoElement compatibility
     */
    canPlayType(mediaType) {
        switch (mediaType) {
            case 'application/x-ppm':
            case 'application/x-kwz':
            case 'video/x-ppm':
            case 'video/x-kwz':
            // lauren is planning on registering these officially
            case 'video/vnd.nintendo.ugomemo.ppm':
            case 'video/vnd.nintendo.ugomemo.kwz':
                return 'probably';
            case 'application/octet-stream':
                return 'maybe';
            default:
                return '';
        }
    }
    /**
     * Implementation of the `HTMLVideoElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/getVideoPlaybackQuality](getVideoPlaybackQuality) method
     * @group HTMLVideoElement compatibility
     */
    getVideoPlaybackQuality() {
        const quality = {
            creationTime: 0,
            droppedVideoFrames: 0,
            // @ts-ignore
            corruptedVideoFrames: 0,
            totalVideoFrames: this.frameCount
        };
        return quality;
    }
    /**
     * Implementation of the `HTMLVideoElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestPictureInPicture](requestPictureInPicture) method. Not currently working, only a stub.
     * @group HTMLVideoElement compatibility
     */
    requestPictureInPicture() {
        throw new Error('Not implemented');
    }
    /**
     * Implementation of the `HTMLVideoElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/captureStream](captureStream) method. Not currently working, only a stub.
     * @group HTMLVideoElement compatibility
     */
    captureStream() {
        throw new Error('Not implemented');
    }
    /**
     * Add an event callback
     * @group Event API
     */
    on(eventType, listener) {
        const events = this.events;
        const eventList = Array.isArray(eventType) ? eventType : [eventType];
        eventList.forEach(eventType => {
            if (!events.has(eventType))
                events.set(eventType, [listener]);
            else
                events.get(eventType).push(listener);
        });
    }
    /**
     * Remove an event callback
     * @group Event API
     */
    off(eventType, callback) {
        const events = this.events;
        const eventList = Array.isArray(eventType) ? eventType : [eventType];
        eventList.forEach(eventType => {
            if (!events.has(eventType))
                return;
            const callbackList = events.get(eventType);
            events.set(eventType, callbackList.splice(callbackList.indexOf(callback), 1));
        });
    }
    /**
     * Emit an event - mostly used internally
     * @group Event API
     */
    emit(eventType, ...args) {
        const events = this.events;
        if (eventType !== exports.PlayerEvent.__Any && events.has(eventType)) {
            const callbackList = events.get(eventType);
            callbackList.forEach(callback => callback.apply(null, args));
            // call onwhatever() function for this event, if one has been added
            const listenerName = `on${eventType}`;
            const thisAsAny = this;
            if (typeof thisAsAny[listenerName] === 'function')
                thisAsAny[listenerName].apply(null, args);
        }
        // "any" event listeners fire for all events, and receive eventType as their first param
        if (events.has(exports.PlayerEvent.__Any)) {
            const callbackList = events.get(exports.PlayerEvent.__Any);
            callbackList.forEach(callback => callback.apply(null, [eventType, ...args]));
        }
    }
    /**
     * Remove all registered event callbacks
     * @group Event API
     */
    clearEvents() {
        this.events.clear();
    }
    /**
     * Destroy a Player instance
     * @group Lifecycle
     */
    async destroy() {
        this.clearEvents();
        this.emit(exports.PlayerEvent.Destroy);
        this.closeNote();
        await this.renderer.destroy();
        await this.audio.destroy();
    }
    /**
     * @internal
     */
    assertNoteLoaded() {
        assert(this.isNoteLoaded, 'No Flipnote is currently loaded in this player');
    }
}
_Player_instances = new WeakSet(), _Player_playAudio = function _Player_playAudio() {
    this.audio.playFrom(this.currentTime);
}, _Player_stopAudio = function _Player_stopAudio() {
    this.audio.stop();
};

/**
 * This is a bit of a hack to get a player component class to wrap a Player instance,
 * while also inheriting all of the Player API's methods and properties.
 *
 * The resulting PlayerMixinClass will get a Player instance on this.player,
 * and all of the Player API methods and properties applied as wrappers.
 *
 * e.g.
 * - PlayerMixinClass.play() will have the same behavior as Player.play(), but will call this.player.play() internally.
 * - PlayerMixinClass.paused will have getters and setters to match it to this.player.paused.
 * @internal
 */
function PlayerMixin(Target) {
    class PlayerMixinClass extends Target {
        // Mixin needs to re-define all the normal player properties, but most should be made readonly anyway...
        get renderer() {
            return this.player.renderer;
        }
        get note() {
            return this.player.note;
        }
        get noteFormat() {
            return this.player.noteFormat;
        }
        get meta() {
            return this.player.meta;
        }
        get duration() {
            return this.player.duration;
        }
        get layerVisibility() {
            return this.player.layerVisibility;
        }
        get autoplay() {
            return this.player.autoplay;
        }
        set autoplay(value) {
            this.player.autoplay = value;
        }
    }
    // add all Player API methods and getter/setter props to target
    for (let key of Reflect.ownKeys(Player.prototype)) {
        let desc = Object.getOwnPropertyDescriptor(Player.prototype, key);
        // don't override stuff that already exists, and ignore JS prototype junk
        if (key in Target.prototype || key === 'constructor' || key === 'name' || key === 'prototype')
            continue;
        // ignore private props
        if (typeof key === "string" && key.startsWith("#"))
            continue;
        // override methods to call e.g. `this.player.methodName()` when `methodName()` is called
        if (desc.value && typeof desc.value === 'function') {
            Object.defineProperty(PlayerMixinClass.prototype, key, {
                ...desc,
                value(...args) {
                    return this.player[key](...args);
                }
            });
        }
        // override getters and setters so that e.g. `property` will always reflect `this.player.property`
        else if (desc.get || desc.set) {
            Object.defineProperty(PlayerMixinClass.prototype, key, {
                ...desc,
                set(value) {
                    this.player[key] = value;
                },
                get() {
                    return this.player[key];
                }
            });
        }
    }
    return PlayerMixinClass;
}

class EncoderBase {
    constructor() {
        this.dataUrl = null;
    }
    /**
     * Returns the file data as a NodeJS {@link https://nodejs.org/api/buffer.html | Buffer}.
     *
     * > Note: This method does not work outside of NodeJS environments.
     */
    getBuffer() {
        assertNodeEnv();
        return Buffer.from(this.getArrayBuffer());
    }
    /**
     * Returns the file data as a {@link https://developer.mozilla.org/en-US/docs/Web/API/Blob | Blob}.
     */
    getBlob() {
        assertBrowserEnv();
        return new Blob([this.getArrayBuffer()], {
            type: this.mimeType
        });
    }
    /**
     * Returns the file data as an {@link https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL | Object URL}.
     *
     * > Note: This method does not work outside of browser environments.
     */
    getUrl() {
        assertBrowserEnv();
        if (this.dataUrl)
            return this.dataUrl;
        return window.URL.createObjectURL(this.getBlob());
    }
    /**
     * Revokes this file's {@link https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL | Object URL} if one has been created, use this when the url created with {@link getUrl} is no longer needed, to preserve memory.
     *
     * > Note: This method does not work outside of browser environments.
     */
    revokeUrl() {
        assertBrowserEnv();
        if (this.dataUrl)
            window.URL.revokeObjectURL(this.dataUrl);
    }
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
/**
 * @internal
 */
const EOF = -1;
/**
 * @internal
 */
const BITS = 12;
/**
 * @internal
 */
const HSIZE = 5003; // 80% occupancy
/**
 * @internal
 */
const masks = [
    0x0000, 0x0001, 0x0003, 0x0007, 0x000F, 0x001F,
    0x003F, 0x007F, 0x00FF, 0x01FF, 0x03FF, 0x07FF,
    0x0FFF, 0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF
];
/**
 * @internal
 */
class LzwCompressor {
    constructor(width, height, colorDepth) {
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
        this.colorDepth = colorDepth;
        this.reset();
    }
    reset() {
        this.initCodeSize = Math.max(2, this.colorDepth);
        this.accum.fill(0);
        this.htab.fill(0);
        this.codetab.fill(0);
        this.cur_accum = 0;
        this.cur_bits = 0;
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
                if (i === 0) {
                    disp = 1;
                }
                do {
                    if ((i -= disp) < 0) {
                        i += hsize_reg;
                    }
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
    encode(pixels, outs) {
        this.pixels = pixels;
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

var _GifImage_instances, _GifImage_data, _GifImage_compressor, _GifImage_writeFirstFrame, _GifImage_writeAdditionalFrame, _GifImage_writeHeader, _GifImage_writeGraphicControlExt, _GifImage_writeLogicalScreenDescriptor, _GifImage_writeNetscapeExt, _GifImage_writeColorTable, _GifImage_writeImageDescriptor, _GifImage_colorTableSize, _GifImage_writePixels;
/**
 * GIF image encoder, supports static single-frame GIF export as well as animated GIF.
 *
 * @group File Encoder
 */
class GifImage extends EncoderBase {
    /**
     * Create a new GIF image object.
     *
     * @param width Image width
     * @param height Image height
     * @param settings Whether the gif should loop, the delay between frames, etc. See {@link GifEncoderSettings}
     */
    constructor(width, height, settings = {}) {
        super();
        _GifImage_instances.add(this);
        this.mimeType = 'gif/image';
        /**
         * Number of current GIF frames.
         */
        this.frameCount = 0;
        _GifImage_data.set(this, void 0);
        _GifImage_compressor.set(this, void 0);
        this.width = width;
        this.height = height;
        __classPrivateFieldSet(this, _GifImage_data, new ByteArray(), "f");
        this.settings = { ...GifImage.defaultSettings, ...settings };
        __classPrivateFieldSet(this, _GifImage_compressor, new LzwCompressor(width, height, settings.colorDepth), "f");
    }
    /**
     * Create an animated GIF image from a Flipnote.
     *
     * This will encode the entire animation, so depending on the number of frames it could take a while to return.
     * @param flipnote {@link Flipnote} object ({@link PpmParser} or {@link KwzParser} instance)
     * @param settings Whether the gif should loop, the delay between frames, etc. See {@link GifEncoderSettings}
     */
    static fromFlipnote(flipnote, settings = {}) {
        const gif = new GifImage(flipnote.imageWidth, flipnote.imageHeight, {
            delay: 100 / flipnote.framerate,
            repeat: flipnote.meta?.loop ? -1 : 0,
            ...settings
        });
        gif.palette = flipnote.globalPalette;
        for (let frameIndex = 0; frameIndex < flipnote.frameCount; frameIndex++)
            gif.writeFrame(flipnote.getFramePixels(frameIndex));
        gif.finish();
        return gif;
    }
    /**
     * Create an GIF image from a single Flipnote frame.
     * @param flipnote
     * @param frameIndex animation frame index to encode
     * @param settings whether the gif should loop, the delay between frames, etc. See {@link GifEncoderSettings}
     */
    static fromFlipnoteFrame(flipnote, frameIndex, settings = {}) {
        const gif = new GifImage(flipnote.imageWidth, flipnote.imageHeight, {
            delay: 0,
            repeat: 0,
            ...settings,
        });
        gif.palette = flipnote.globalPalette;
        gif.writeFrame(flipnote.getFramePixels(frameIndex));
        gif.finish();
        return gif;
    }
    /**
     * Add a frame to the GIF image.
     * @param pixels Raw pixels to encode, must be an uncompressed 8bit array of palette indices with a size matching image width * image height
     */
    writeFrame(pixels) {
        if (this.frameCount === 0)
            __classPrivateFieldGet(this, _GifImage_instances, "m", _GifImage_writeFirstFrame).call(this, pixels);
        else
            __classPrivateFieldGet(this, _GifImage_instances, "m", _GifImage_writeAdditionalFrame).call(this, pixels);
        this.frameCount += 1;
    }
    /**
     * Call once all frames have been written to finish the GIF image.
     */
    finish() {
        __classPrivateFieldGet(this, _GifImage_data, "f").writeByte(0x3B);
    }
    /**
     * Returns the GIF image data as an {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}.
     */
    getArrayBuffer() {
        return __classPrivateFieldGet(this, _GifImage_data, "f").getBuffer();
    }
    /**
      * Returns the GIF image data as an {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image | Image} object.
      *
      * Note: This method does not work outside of browser environments
      */
    getImage() {
        assertBrowserEnv();
        const img = new Image(this.width, this.height);
        img.src = this.getUrl();
        return img;
    }
}
_GifImage_data = new WeakMap(), _GifImage_compressor = new WeakMap(), _GifImage_instances = new WeakSet(), _GifImage_writeFirstFrame = function _GifImage_writeFirstFrame(pixels) {
    __classPrivateFieldGet(this, _GifImage_instances, "m", _GifImage_writeHeader).call(this);
    __classPrivateFieldGet(this, _GifImage_instances, "m", _GifImage_writeLogicalScreenDescriptor).call(this);
    __classPrivateFieldGet(this, _GifImage_instances, "m", _GifImage_writeColorTable).call(this);
    __classPrivateFieldGet(this, _GifImage_instances, "m", _GifImage_writeNetscapeExt).call(this);
    __classPrivateFieldGet(this, _GifImage_instances, "m", _GifImage_writeGraphicControlExt).call(this);
    __classPrivateFieldGet(this, _GifImage_instances, "m", _GifImage_writeImageDescriptor).call(this);
    __classPrivateFieldGet(this, _GifImage_instances, "m", _GifImage_writePixels).call(this, pixels);
}, _GifImage_writeAdditionalFrame = function _GifImage_writeAdditionalFrame(pixels) {
    __classPrivateFieldGet(this, _GifImage_instances, "m", _GifImage_writeGraphicControlExt).call(this);
    __classPrivateFieldGet(this, _GifImage_instances, "m", _GifImage_writeImageDescriptor).call(this);
    __classPrivateFieldGet(this, _GifImage_instances, "m", _GifImage_writePixels).call(this, pixels);
}, _GifImage_writeHeader = function _GifImage_writeHeader() {
    __classPrivateFieldGet(this, _GifImage_data, "f").writeChars('GIF89a');
}, _GifImage_writeGraphicControlExt = function _GifImage_writeGraphicControlExt() {
    __classPrivateFieldGet(this, _GifImage_data, "f").writeByte(0x21); // extension introducer
    __classPrivateFieldGet(this, _GifImage_data, "f").writeByte(0xf9); // GCE label
    __classPrivateFieldGet(this, _GifImage_data, "f").writeByte(4); // data block size
    // packed fields
    __classPrivateFieldGet(this, _GifImage_data, "f").writeByte(0);
    __classPrivateFieldGet(this, _GifImage_data, "f").writeU16(this.settings.delay); // delay x 1/100 sec
    __classPrivateFieldGet(this, _GifImage_data, "f").writeByte(0); // transparent color index
    __classPrivateFieldGet(this, _GifImage_data, "f").writeByte(0); // block terminator
}, _GifImage_writeLogicalScreenDescriptor = function _GifImage_writeLogicalScreenDescriptor() {
    const palette = this.palette;
    const colorDepth = this.settings.colorDepth;
    const globalColorTableFlag = 1;
    const sortFlag = 0;
    const globalColorTableSize = __classPrivateFieldGet(this, _GifImage_instances, "m", _GifImage_colorTableSize).call(this, palette.length) - 1;
    const fields = (globalColorTableFlag << 7) |
        ((colorDepth - 1) << 4) |
        (sortFlag << 3) |
        globalColorTableSize;
    const backgroundColorIndex = 0;
    const pixelAspectRatio = 0;
    __classPrivateFieldGet(this, _GifImage_data, "f").writeU16(this.width);
    __classPrivateFieldGet(this, _GifImage_data, "f").writeU16(this.height);
    __classPrivateFieldGet(this, _GifImage_data, "f").writeBytes([fields, backgroundColorIndex, pixelAspectRatio]);
}, _GifImage_writeNetscapeExt = function _GifImage_writeNetscapeExt() {
    __classPrivateFieldGet(this, _GifImage_data, "f").writeByte(0x21); // extension introducer
    __classPrivateFieldGet(this, _GifImage_data, "f").writeByte(0xff); // app extension label
    __classPrivateFieldGet(this, _GifImage_data, "f").writeByte(11); // block size
    __classPrivateFieldGet(this, _GifImage_data, "f").writeChars('NETSCAPE2.0'); // app id + auth code
    __classPrivateFieldGet(this, _GifImage_data, "f").writeByte(3); // sub-block size
    __classPrivateFieldGet(this, _GifImage_data, "f").writeByte(1); // loop sub-block id
    __classPrivateFieldGet(this, _GifImage_data, "f").writeU16(this.settings.repeat); // loop count (extra iterations, 0=repeat forever)
    __classPrivateFieldGet(this, _GifImage_data, "f").writeByte(0); // block terminator
}, _GifImage_writeColorTable = function _GifImage_writeColorTable() {
    const palette = this.palette;
    const colorTableLength = 1 << __classPrivateFieldGet(this, _GifImage_instances, "m", _GifImage_colorTableSize).call(this, palette.length);
    for (let i = 0; i < colorTableLength; i++) {
        let color = [0, 0, 0];
        if (i < palette.length) {
            color = palette[i];
        }
        __classPrivateFieldGet(this, _GifImage_data, "f").writeByte(color[0]);
        __classPrivateFieldGet(this, _GifImage_data, "f").writeByte(color[1]);
        __classPrivateFieldGet(this, _GifImage_data, "f").writeByte(color[2]);
    }
}, _GifImage_writeImageDescriptor = function _GifImage_writeImageDescriptor() {
    __classPrivateFieldGet(this, _GifImage_data, "f").writeByte(0x2c); // image separator
    __classPrivateFieldGet(this, _GifImage_data, "f").writeU16(0); // x position
    __classPrivateFieldGet(this, _GifImage_data, "f").writeU16(0); // y position
    __classPrivateFieldGet(this, _GifImage_data, "f").writeU16(this.width); // image size
    __classPrivateFieldGet(this, _GifImage_data, "f").writeU16(this.height);
    __classPrivateFieldGet(this, _GifImage_data, "f").writeByte(0); // global palette
}, _GifImage_colorTableSize = function _GifImage_colorTableSize(length) {
    return Math.max(Math.ceil(Math.log2(length)), 1);
}, _GifImage_writePixels = function _GifImage_writePixels(pixels) {
    __classPrivateFieldGet(this, _GifImage_compressor, "f").colorDepth = this.settings.colorDepth;
    __classPrivateFieldGet(this, _GifImage_compressor, "f").reset();
    __classPrivateFieldGet(this, _GifImage_compressor, "f").encode(pixels, __classPrivateFieldGet(this, _GifImage_data, "f"));
};
/**
 * Default GIF encoder settings
 */
GifImage.defaultSettings = {
    delay: 100,
    repeat: -1,
    colorDepth: 8
};

var _WavAudio_header, _WavAudio_pcmData;
/**
 * Wav audio object. Used to create a {@link https://en.wikipedia.org/wiki/WAV | WAV} file from a PCM audio stream or a {@link Flipnote} object.
 *
 * Currently only supports PCM s16_le audio encoding.
 *
 * @group File Encoder
 */
class WavAudio extends EncoderBase {
    /**
     * Create a new WAV audio object
     * @param sampleRate audio samplerate
     * @param channels number of audio channels
     * @param bitsPerSample number of bits per sample
     */
    constructor(sampleRate, channels = 1, bitsPerSample = 16) {
        super();
        _WavAudio_header.set(this, void 0);
        _WavAudio_pcmData.set(this, void 0);
        this.sampleRate = sampleRate;
        this.channels = channels;
        this.bitsPerSample = bitsPerSample;
        // Write WAV file header
        // Reference: http://www.topherlee.com/software/pcm-tut-wavformat.html
        const headerBuffer = new ArrayBuffer(44);
        const header = new DataStream(headerBuffer);
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
        __classPrivateFieldSet(this, _WavAudio_header, header, "f");
        __classPrivateFieldSet(this, _WavAudio_pcmData, null, "f");
    }
    /**
     * Create a WAV audio file from a Flipnote's master audio track
     * @param flipnote
     * @param trackId
     */
    static fromFlipnote(note) {
        const sampleRate = note.sampleRate;
        const wav = new WavAudio(sampleRate, 1, 16);
        const pcm = note.getAudioMasterPcm(sampleRate);
        wav.writeSamples(pcm);
        return wav;
    }
    /**
     * Create a WAV audio file from a given Flipnote audio track
     * @param flipnote
     * @param trackId
     */
    static fromFlipnoteTrack(flipnote, trackId) {
        const sampleRate = flipnote.sampleRate;
        const wav = new WavAudio(sampleRate, 1, 16);
        const pcm = flipnote.getAudioTrackPcm(trackId, sampleRate);
        wav.writeSamples(pcm);
        return wav;
    }
    /**
     * Add PCM audio frames to the WAV
     * @param pcmData signed int16 PCM audio samples
     */
    writeSamples(pcmData) {
        let header = __classPrivateFieldGet(this, _WavAudio_header, "f");
        // fill in filesize
        header.seek(4);
        header.writeUint32(header.numBytes + pcmData.byteLength);
        // fill in data section length
        header.seek(40);
        header.writeUint32(pcmData.byteLength);
        __classPrivateFieldSet(this, _WavAudio_pcmData, pcmData, "f");
    }
    /**
     * Returns the WAV audio data as an {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}
     */
    getArrayBuffer() {
        const headerBytes = __classPrivateFieldGet(this, _WavAudio_header, "f").bytes;
        const pcmBytes = new Uint8Array(__classPrivateFieldGet(this, _WavAudio_pcmData, "f").buffer);
        const resultBytes = new Uint8Array(__classPrivateFieldGet(this, _WavAudio_header, "f").numBytes + __classPrivateFieldGet(this, _WavAudio_pcmData, "f").byteLength);
        resultBytes.set(headerBytes);
        resultBytes.set(pcmBytes, headerBytes.byteLength);
        return resultBytes.buffer;
    }
}
_WavAudio_header = new WeakMap(), _WavAudio_pcmData = new WeakMap();

// Entrypoint for web and node
/**
 * flipnote.js library version (exported as `flipnote.version`).
 * You can find the latest version on the project's [NPM](https://www.npmjs.com/package/flipnote.js) page.
 */
const version = "6.1.1"; // replaced by @rollup/plugin-replace;

exports.CanvasInterface = CanvasInterface;
exports.GifImage = GifImage;
exports.Html5Canvas = Html5Canvas;
exports.KwzParser = KwzParser;
exports.Player = Player;
exports.PlayerMixin = PlayerMixin;
exports.PpmParser = PpmParser;
exports.UniversalCanvas = UniversalCanvas;
exports.WavAudio = WavAudio;
exports.WebAudioPlayer = WebAudioPlayer;
exports.WebglCanvas = WebglCanvas;
exports.filename = index$2;
exports.id = index$3;
exports.loaders = index$1;
exports.parse = parse;
exports.parseSource = parseSource;
exports.playlist = index;
exports.supportedEvents = supportedEvents;
exports.version = version;
