/*!!
 * flipnote.js v6.0.1
 * https://flipnote.js.org
 * A JavaScript library for Flipnote Studio animation files
 * 2018 - 2024 James Daniel
 * Flipnote Studio is (c) Nintendo Co., Ltd. This project isn't affiliated with or endorsed by them in any way.
*/
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
 * Flipnote region
 */
var FlipnoteRegion;
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
})(FlipnoteRegion || (FlipnoteRegion = {}));
/**
 * Identifies which animation format a Flipnote uses
 */
var FlipnoteFormat;
(function (FlipnoteFormat) {
    /**
     * Animation format used by Flipnote Studio (Nintendo DSiWare)
     */
    FlipnoteFormat["PPM"] = "PPM";
    /**
     * Animation format used by Flipnote Studio 3D (Nintendo 3DS)
     */
    FlipnoteFormat["KWZ"] = "KWZ";
})(FlipnoteFormat || (FlipnoteFormat = {}));
/**
 * Buffer format for a FlipnoteThumbImage
 */
var FlipnoteThumbImageFormat;
(function (FlipnoteThumbImageFormat) {
    FlipnoteThumbImageFormat[FlipnoteThumbImageFormat["Jpeg"] = 0] = "Jpeg";
    FlipnoteThumbImageFormat[FlipnoteThumbImageFormat["Rgba"] = 1] = "Rgba";
})(FlipnoteThumbImageFormat || (FlipnoteThumbImageFormat = {}));
/**
 * stereoscopic eye view (left/right) for 3D effects
 */
var FlipnoteStereoscopicEye;
(function (FlipnoteStereoscopicEye) {
    FlipnoteStereoscopicEye[FlipnoteStereoscopicEye["Left"] = 0] = "Left";
    FlipnoteStereoscopicEye[FlipnoteStereoscopicEye["Right"] = 1] = "Right";
})(FlipnoteStereoscopicEye || (FlipnoteStereoscopicEye = {}));
/**
 * Identifies a Flipnote audio track type
 */
var FlipnoteAudioTrack;
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
})(FlipnoteAudioTrack || (FlipnoteAudioTrack = {}));
/**
 * {@link FlipnoteAudioTrack}, but just sound effect tracks
 */
var FlipnoteSoundEffectTrack;
(function (FlipnoteSoundEffectTrack) {
    FlipnoteSoundEffectTrack[FlipnoteSoundEffectTrack["SE1"] = 1] = "SE1";
    FlipnoteSoundEffectTrack[FlipnoteSoundEffectTrack["SE2"] = 2] = "SE2";
    FlipnoteSoundEffectTrack[FlipnoteSoundEffectTrack["SE3"] = 3] = "SE3";
    FlipnoteSoundEffectTrack[FlipnoteSoundEffectTrack["SE4"] = 4] = "SE4";
})(FlipnoteSoundEffectTrack || (FlipnoteSoundEffectTrack = {}));

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
 * Is the code running in a Node environment?
 * @internal
 */
const isNode = typeof process !== 'undefined'
    && process.versions != null
    && process.versions.node != null;
// TODO: Deno support?
/**
 * Is the code running in a Web Worker environment?
 * @internal
 */
const isWebWorker = typeof self === 'object'
    && self.constructor
    && self.constructor.name === 'DedicatedWorkerGlobalScope';

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

var _a$1;
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
        this[_a$1] = 'Flipnote';
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
    *[(_a$1 = Symbol.toStringTag, Symbol.iterator)]() {
        for (let i = 0; i < this.frameCount; i++)
            yield i;
    }
    /**
     * Get the pixels for a given frame layer, as palette indices
     * NOTE: layerIndex are not guaranteed to be sorted by 3D depth in KWZs, use {@link getFrameLayerOrder} to get the correct sort order first
     * NOTE: if the visibility flag for this layer is turned off, the result will be empty
     * @group Image
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
     * @group Image
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
     * @group Image
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
     * @group Image
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
 * Get the region for any valid Flipnote Studio user ID
 */
const getPpmFsidRegion = (fsid) => {
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
};

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
 * Get the duration (in seconds) of a number of framres running at a specified framerate.
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

var _PpmParser_instances, _PpmParser_layerBuffers, _PpmParser_soundFlags, _PpmParser_prevLayerBuffers, _PpmParser_lineEncodingBuffers, _PpmParser_prevDecodedFrame, _PpmParser_frameDataLength, _PpmParser_soundDataLength, _PpmParser_soundDataOffset, _PpmParser_frameOffsets, _PpmParser_decodeHeader, _PpmParser_readFilename, _PpmParser_decodeMeta, _PpmParser_decodeAnimationHeader, _PpmParser_decodeSoundHeader, _PpmParser_isKeyFrame, _PpmParser_pcmAudioMix, _a;
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
        this.format = FlipnoteFormat.PPM;
        /**
         * Custom object tag.
         * @group Utility
         */
        this[_a] = 'Flipnote Studio PPM animation file';
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
            format: FlipnoteThumbImageFormat.Rgba,
            width: 64,
            height: 48,
            data: pixels.buffer
        };
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
            [FlipnoteSoundEffectTrack.SE1]: frameFlags[0],
            [FlipnoteSoundEffectTrack.SE2]: frameFlags[1],
            [FlipnoteSoundEffectTrack.SE3]: frameFlags[2],
            [FlipnoteSoundEffectTrack.SE4]: false
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
            [FlipnoteSoundEffectTrack.SE1]: (byte & 0x1) !== 0,
            [FlipnoteSoundEffectTrack.SE2]: (byte & 0x2) !== 0,
            [FlipnoteSoundEffectTrack.SE3]: (byte & 0x4) !== 0,
            [FlipnoteSoundEffectTrack.SE4]: false
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
        if (trackId === FlipnoteAudioTrack.BGM) {
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
        const hasBgm = this.hasAudioTrack(FlipnoteAudioTrack.BGM);
        const hasSe1 = this.hasAudioTrack(FlipnoteAudioTrack.SE1);
        const hasSe2 = this.hasAudioTrack(FlipnoteAudioTrack.SE2);
        const hasSe3 = this.hasAudioTrack(FlipnoteAudioTrack.SE3);
        // Mix background music
        if (hasBgm) {
            const bgmPcm = this.getAudioTrackPcm(FlipnoteAudioTrack.BGM, dstFreq);
            __classPrivateFieldGet(this, _PpmParser_instances, "m", _PpmParser_pcmAudioMix).call(this, bgmPcm, master, 0);
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
_PpmParser_layerBuffers = new WeakMap(), _PpmParser_soundFlags = new WeakMap(), _PpmParser_prevLayerBuffers = new WeakMap(), _PpmParser_lineEncodingBuffers = new WeakMap(), _PpmParser_prevDecodedFrame = new WeakMap(), _PpmParser_frameDataLength = new WeakMap(), _PpmParser_soundDataLength = new WeakMap(), _PpmParser_soundDataOffset = new WeakMap(), _PpmParser_frameOffsets = new WeakMap(), _PpmParser_instances = new WeakSet(), _a = Symbol.toStringTag, _PpmParser_decodeHeader = function _PpmParser_decodeHeader() {
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
    soundMeta.set(FlipnoteAudioTrack.BGM, { ptr: ptr, length: bgmLen });
    soundMeta.set(FlipnoteAudioTrack.SE1, { ptr: ptr += bgmLen, length: se1Len });
    soundMeta.set(FlipnoteAudioTrack.SE2, { ptr: ptr += se1Len, length: se2Len });
    soundMeta.set(FlipnoteAudioTrack.SE3, { ptr: ptr += se2Len, length: se3Len });
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
PpmParser.format = FlipnoteFormat.PPM;
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
    FlipnoteAudioTrack.BGM,
    FlipnoteAudioTrack.SE1,
    FlipnoteAudioTrack.SE2,
    FlipnoteAudioTrack.SE3
];
/**
 * Which sound effect tracks are available in this format.
 */
PpmParser.soundEffectTracks = [
    FlipnoteSoundEffectTrack.SE1,
    FlipnoteSoundEffectTrack.SE2,
    FlipnoteSoundEffectTrack.SE3,
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

export { PpmParser };
