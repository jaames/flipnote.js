/*!!
 * flipnote.js v6.0.1
 * https://flipnote.js.org
 * A JavaScript library for Flipnote Studio animation files
 * 2018 - 2024 James Daniel
 * Flipnote Studio is (c) Nintendo Co., Ltd. This project isn't affiliated with or endorsed by them in any way.
*/
'use strict';

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
 * Assert that a value exists.
 * @internal
 */
const assertExists = (value, name = '') => {
    if (value === undefined || value === null)
        throw new Error(`flipnote.js error: Missing object ${name}`);
    return value;
};
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
 * Assert that the current environment should support NodeJS APIs
 * @internal
 */
const assertWebWorkerEnv = () => assert(isWebWorker, 'This feature is only available in WebWorker environments');

/**
 * @internal
 */
const raf = isBrowser && (window.requestAnimationFrame || window.webkitRequestAnimationFrame);
/**
 * @internal
 */
const nextPaint = (callback) => {
    if (isBrowser)
        raf(() => raf(() => callback()));
    else
        callback();
};

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
const saveData = (function () {
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
})();

exports.ByteArray = ByteArray;
exports.DataStream = DataStream;
exports.assert = assert;
exports.assertBrowserEnv = assertBrowserEnv;
exports.assertExists = assertExists;
exports.assertNodeEnv = assertNodeEnv;
exports.assertRange = assertRange;
exports.assertWebWorkerEnv = assertWebWorkerEnv;
exports.clamp = clamp;
exports.dynamicRequire = dynamicRequire;
exports.err = err;
exports.getGlobalObject = getGlobalObject;
exports.hexFromBytes = hexFromBytes;
exports.hexToBytes = hexToBytes;
exports.isBrowser = isBrowser;
exports.isNode = isNode;
exports.isWebWorker = isWebWorker;
exports.lerp = lerp;
exports.nextPaint = nextPaint;
exports.saveData = saveData;
exports.until = until;
