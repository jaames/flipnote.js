/// <reference types="node" />
/** @internal */
declare class ByteArray {
    pageSize: number;
    allocSize: number;
    realSize: number;
    pages: Uint8Array[];
    numPages: number;
    pageIdx: number;
    pagePtr: number;
    realPtr: number;
    constructor();
    set pointer(ptr: number);
    get pointer(): number;
    newPage(): void;
    setPointer(ptr: number): void;
    writeByte(value: number): void;
    writeBytes(bytes: Uint8Array | number[], srcPtr?: number, length?: number): void;
    writeChars(str: string): void;
    writeU8(value: number): void;
    writeU16(value: number): void;
    writeU32(value: number): void;
    getBytes(): Uint8Array;
    getBuffer(): ArrayBufferLike;
}

/** @internal */
declare const enum SeekOrigin {
    Begin = 0,
    Current = 1,
    End = 2
}
/**
 * Wrapper around the DataView API to keep track of the offset into the data
 * also provides some utils for reading ascii strings etc
 * @internal
 */
declare class DataStream {
    buffer: ArrayBuffer;
    pointer: number;
    data: DataView;
    constructor(arrayBuffer: ArrayBuffer);
    get bytes(): Uint8Array;
    get byteLength(): number;
    seek(offset: number, whence?: SeekOrigin): void;
    readUint8(): number;
    writeUint8(value: number): void;
    readInt8(): number;
    writeInt8(value: number): void;
    readUint16(littleEndian?: boolean): number;
    writeUint16(value: number, littleEndian?: boolean): void;
    readInt16(littleEndian?: boolean): number;
    writeInt16(value: number, littleEndian?: boolean): void;
    readUint32(littleEndian?: boolean): number;
    writeUint32(value: number, littleEndian?: boolean): void;
    readInt32(littleEndian?: boolean): number;
    writeInt32(value: number, littleEndian?: boolean): void;
    readBytes(count: number): Uint8Array;
    writeBytes(bytes: number[] | Uint8Array): void;
    readHex(count: number, reverse?: boolean): string;
    readChars(count: number): string;
    writeChars(string: string): void;
    readWideChars(count: number): string;
}

/** @internal */
declare const ADPCM_INDEX_TABLE_2BIT: Int8Array;
/** @internal */
declare const ADPCM_INDEX_TABLE_4BIT: Int8Array;
/** @internal */
declare const ADPCM_STEP_TABLE: Int16Array;
/**
 * Clamp a number n between l and h
 * @internal
 */
declare function clamp(n: number, l: number, h: number): number;
/**
 * Interpolate between a and b - returns a if fac = 0, b if fac = 1, and somewhere between if 0 < fac < 1
 * @internal
 */
declare const lerp: (a: number, b: number, fac: number) => number;
/** @internal */
declare function pcmGetSample(src: Int16Array, srcSize: number, srcPtr: number): number;
/**
 * Zero-order hold (nearest neighbour) audio interpolation
 * Credit to SimonTime for the original C version
 * @internal
 */
declare function pcmResampleNearestNeighbour(src: Int16Array, srcFreq: number, dstFreq: number): Int16Array;
/**
 * Simple linear audio interpolation
 * @internal
 */
declare function pcmResampleLinear(src: Int16Array, srcFreq: number, dstFreq: number): Int16Array;
/**
 * Get a ratio of how many audio samples hit the pcm_s16_le clipping bounds
 * This can be used to detect corrupted audio
 * @internal
 */
declare function pcmGetClippingRatio(src: Int16Array): number;
/**
 * Get the root mean square of a PCM track
 * @internal
 */
declare function pcmGetRms(src: Int16Array): number;

/** @internal */
declare function nextPaint(callback: Function): void;

/**
 * @internal
 */
declare type HashType = 'SHA-1' | 'SHA-256';
/**
 * @internal
 */
declare function rsaLoadPublicKey(pemKey: string, hashType: HashType): Promise<CryptoKey>;
/**
 * @internal
 */
declare function rsaVerify(key: CryptoKey, signature: Uint8Array, data: Uint8Array): Promise<boolean>;

/**
 * Webpack tries to replace inline calles to require() with polyfills,
 * but we don't want that, since we only use require to add extra features in NodeJs environments
 *
 * Modified from:
 * https://github.com/getsentry/sentry-javascript/blob/bd35d7364191ebed994fb132ff31031117c1823f/packages/utils/src/misc.ts#L9-L11
 * https://github.com/getsentry/sentry-javascript/blob/89bca28994a0eaab9bc784841872b12a1f4a875c/packages/hub/src/hub.ts#L340
 * @internal
 */
declare function dynamicRequire(nodeModule: NodeModule, p: string): any;
/**
 * Safely get global scope object
 * @internal
 */
declare function getGlobalObject(): Window | typeof globalThis | {};
/**
 * Utils to find out information about the current code execution environment
 */
/**
 * Is the code running in a browser environment?
 * @internal
 */
declare const isBrowser: boolean;
/**
 * Assert that the current environment should support browser APIs
 * @internal
 */
declare function assertBrowserEnv(): void;
/**
 * Is the code running in a Node environment?
 * @internal
 */
declare const isNode: boolean;
/**
 * Assert that the current environment should support NodeJS APIs
 * @internal
 */
declare function assertNodeEnv(): void;
/**
 * Is the code running in a Web Worker enviornment?
 * @internal
 */
declare const isWebWorker: boolean;
/**
 * Assert that the current environment should support NodeJS APIs
 * @internal
 */
declare function assertWebWorkerEnv(): void;

/**
 * Assert condition is true
 * @internal
 */
declare function assert(condition: boolean, errMsg?: string): asserts condition;
/**
 * Assert that a value exists
 * @internal
 */
declare function assertExists<T>(value: T | null | undefined, name?: string): T;
/**
 * Assert that a numberical value is between upper and lower bounds
 * @internal
 */
declare function assertRange(value: number, min: number, max: number, name?: string): asserts value;

/**
 * @internal
 */
declare type AsyncTuple<ErrorType extends any = Error, DataType extends any = unknown> = [ErrorType, null] | [null, DataType];
/**
 * Gracefully handles a given Promise factory.
 * @internal
 * @example
 * const [ error, data ] = await until(() => asyncAction())
 */
declare const until: <ErrorType extends unknown = Error, DataType extends unknown = unknown>(promise: () => Promise<DataType>) => Promise<AsyncTuple<ErrorType, DataType>>;

/**
 * Convert a Nintendo DS or 3DS timestamp int to a JS Date object
 * @internal
 */
declare function dateFromNintendoTimestamp(timestamp: number): Date;
/**
 * Get the duration (in seconds) of a number of framres running at a specified framerate
 * @internal
 */
declare function timeGetNoteDuration(frameCount: number, framerate: number): number;

/**
 * Flipnote region
 */
declare enum FlipnoteRegion {
    /** Europe and Oceania */
    EUR = "EUR",
    /** Americas */
    USA = "USA",
    /** Japan */
    JPN = "JPN",
    /** Unidentified (possibly never used) */
    UNKNOWN = "UNKNOWN"
}
/**
 * Indicates whether the input is a valid Flipnote Studio user ID
 */
declare function isPpmFsid(fsid: string): boolean;
/**
 * Indicates whether the input is a valid Flipnote Studio 3D user ID
 */
declare function isKwzFsid(fsid: string): boolean;
/**
 * Indicates whether the input is a valid DSi Library user ID
 */
declare function isKwzDsiLibraryFsid(fsid: string): boolean;
/**
 * Indicates whether the input is a valid Flipnote Studio or Flipnote Studio 3D user ID
 */
declare function isFsid(fsid: string): boolean;
/**
 * Get the region for any valid Flipnote Studio user ID
 */
declare function getPpmFsidRegion(fsid: string): FlipnoteRegion;
/**
 * Get the region for any valid Flipnote Studio 3D user ID.
 * NOTE: This may be incorrect for IDs that are not from the DSi Library.
 */
declare function getKwzFsidRegion(fsid: string): FlipnoteRegion;
/**
 * Convert a KWZ Flipnote Studio ID (from a Nintendo DSi Library Flipnote) to the format used by PPM Flipnote Studio IDs.
 * Will return `null` if the conversion could not be made.
 */
declare function convertKwzFsidToPpmFsid(fsid: string): string;
/**
 * Convert a PPM Flipnote Studio ID to the format used by KWZ Flipnote Studio IDs (as seen in Nintendo DSi Library Flipnotes).
 * Will return `null` if the conversion could not be made.
 *
 * NOTE: KWZ Flipnote Studio IDs contain an extra two characters at the beginning. It is not possible to resolve these from a PPM Flipnote Studio ID.
 */
declare function convertPpmFsidToKwzFsidSuffix(fsid: string): string;
/**
 * Convert a PPM Flipnote Studio ID to an array of all possible matching KWZ Flipnote Studio IDs (as seen in Nintendo DSi Library Flipnotes).
 * Will return `null` if the conversion could not be made.
 */
declare function convertPpmFsidToPossibleKwzFsids(fsid: string): string[];
/**
 * Tests if a KWZ Flipnote Studio ID (from a Nintendo DSi Library Flipnote) matches a given PPM-formatted Flipnote Studio ID.
 */
declare function testKwzFsidMatchesPpmFsid(kwzFsid: string, ppmFsid: string): boolean;
/**
 * Get the region for any valid Flipnote Studio or Flipnote Studio 3D user ID
 */
declare function getFsidRegion(fsid: string): FlipnoteRegion;

/** @internal */
declare const saveData: (blob: Blob, filename: string) => void;

export { ADPCM_INDEX_TABLE_2BIT, ADPCM_INDEX_TABLE_4BIT, ADPCM_STEP_TABLE, AsyncTuple, ByteArray, DataStream, FlipnoteRegion, SeekOrigin, assert, assertBrowserEnv, assertExists, assertNodeEnv, assertRange, assertWebWorkerEnv, clamp, convertKwzFsidToPpmFsid, convertPpmFsidToKwzFsidSuffix, convertPpmFsidToPossibleKwzFsids, dateFromNintendoTimestamp, dynamicRequire, getFsidRegion, getGlobalObject, getKwzFsidRegion, getPpmFsidRegion, isBrowser, isFsid, isKwzDsiLibraryFsid, isKwzFsid, isNode, isPpmFsid, isWebWorker, lerp, nextPaint, pcmGetClippingRatio, pcmGetRms, pcmGetSample, pcmResampleLinear, pcmResampleNearestNeighbour, rsaLoadPublicKey, rsaVerify, saveData, testKwzFsidMatchesPpmFsid, timeGetNoteDuration, until };
