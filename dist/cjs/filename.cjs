/*!!
 * flipnote.js v6.2.0
 * https://flipnote.js.org
 * A JavaScript library for Flipnote Studio animation files
 * 2018 - 2025 James Daniel
 * Flipnote Studio is (c) Nintendo Co., Ltd. This project isn't affiliated with or endorsed by them in any way.
*/
'use strict';

const REGEX_PPM_LOCAL_FILENAME = /^[0-9A-Z]{1}[0-9A-F]{5}_[0-9A-F]{13}_[0-9]{3}$/;
const REGEX_PPM_FILENAME = /^[0-9A-F]{6}_[0-9A-F]{13}_[0-9]{3}$/;
const CHECKSUM_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
/**
 * Determines if a string matches the PPM filename format.
 */
const isPpmFilename = (filename) => REGEX_PPM_LOCAL_FILENAME.test(filename);
/**
 * Does the same thing as {@link isPpmFilename}, expect it only matches "basic" filenames, without the checksum character that is added when saving a Flipnote to the filesystem.
 */
const isPpmBasicFilename = (filename) => REGEX_PPM_FILENAME.test(filename);
/**
 *
 */
const ppmFilenameCalculateCheckDigit = (filename) => {
    let sum = parseInt(filename.slice(0, 2), 16);
    for (let i = 1; i < 16; i++) {
        const char = filename.charCodeAt(i);
        sum = (sum + char) & 0xff;
    }
    return CHECKSUM_ALPHABET[sum % 36];
};
/**
 *
 */
const ppmFilenameDecode = (filename) => {
    const macSuffix = filename.slice(0, 6);
    const random1 = filename.slice(7, 12);
    const random2 = filename.slice(12, 19);
    const edits = parseInt(filename.slice(-3));
    return { macSuffix, random1, random2, edits };
};
/**
 *
 */
const ppmFilenameEncode = (filename) => {
    const edits = filename.edits.toString().padEnd(3, '0');
    return `${filename.macSuffix}_${filename.random1}_${filename.random2}_${edits}`;
};

/**
 * @internal
 */
const hexFromBytes = (bytes, reverse = false) => {
    let hex = [];
    for (let i = 0; i < bytes.length; i++)
        hex.push(bytes[i].toString(16).padStart(2, '0'));
    if (reverse)
        hex.reverse();
    return hex.join('').toUpperCase();
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
 * Same SubtleCrypto API is available in browser and node, but in node it isn't global
 * @internal
 */
(() => {
    if (isBrowser || isWebWorker) {
        const global = getGlobalObject();
        return (global.crypto || global.msCrypto).subtle;
    }
    else if (isNode)
        return dynamicRequire(module, 'crypto').webcrypto.subtle;
})();

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

exports.isKwzFilename = isKwzFilename;
exports.isPpmBasicFilename = isPpmBasicFilename;
exports.isPpmFilename = isPpmFilename;
exports.kwzFilenameDecode = kwzFilenameDecode;
exports.kwzFilenameEncode = kwzFilenameEncode;
exports.ppmFilenameCalculateCheckDigit = ppmFilenameCalculateCheckDigit;
exports.ppmFilenameDecode = ppmFilenameDecode;
exports.ppmFilenameEncode = ppmFilenameEncode;
