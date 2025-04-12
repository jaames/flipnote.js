/*!!
 * flipnote.js v6.3.0
 * https://flipnote.js.org
 * A JavaScript library for Flipnote Studio animation files
 * 2018 - 2025 James Daniel
 * Flipnote Studio is (c) Nintendo Co., Ltd. This project isn't affiliated with or endorsed by them in any way.
*/
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
 * Assert condition is true.
 * @internal
 */
function assert(condition, errMsg = 'Assert failed') {
    if (!condition)
        err(errMsg);
}
/**
 * Assert condition is true.
 * @internal
 */
const err = (errMsg = 'Assert failed') => {
    throw new Error('flipnote.js error: ' + errMsg);
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
        this.format = FlipnoteFormat.PPM;
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
        this.format = FlipnoteFormat.KWZ;
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

/**
 * Parse a playlist file (.pls or .lst) from Flipnote Studio or Flipnote Studio 3D.
 */
const parse = async (format, source) => {
    const buffer = await load(source);
    if (format === FlipnoteFormat.PPM || format === 'ppm')
        return new PpmPlaylist(buffer);
    if (format === FlipnoteFormat.KWZ || format === 'kwz')
        return new KwzPlaylist(buffer);
};

export { KwzPlaylist, PpmPlaylist, parse };
