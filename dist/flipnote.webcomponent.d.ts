/// <reference types="node" />
import * as lit_element from 'lit-element';
import { PropertyValues, LitElement } from 'lit-element';

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
 * Get the region for any valid Flipnote Studio 3D user ID
 */
declare function getKwzFsidRegion(fsid: string): FlipnoteRegion;
/**
 * Get the region for any valid Flipnote Studio or Flipnote Studio 3D user ID
 */
declare function getFsidRegion(fsid: string): FlipnoteRegion;

type fsid_d_FlipnoteRegion = FlipnoteRegion;
declare const fsid_d_FlipnoteRegion: typeof FlipnoteRegion;
declare const fsid_d_isPpmFsid: typeof isPpmFsid;
declare const fsid_d_isKwzFsid: typeof isKwzFsid;
declare const fsid_d_isKwzDsiLibraryFsid: typeof isKwzDsiLibraryFsid;
declare const fsid_d_isFsid: typeof isFsid;
declare const fsid_d_getPpmFsidRegion: typeof getPpmFsidRegion;
declare const fsid_d_getKwzFsidRegion: typeof getKwzFsidRegion;
declare const fsid_d_getFsidRegion: typeof getFsidRegion;
declare namespace fsid_d {
  export {
    fsid_d_FlipnoteRegion as FlipnoteRegion,
    fsid_d_isPpmFsid as isPpmFsid,
    fsid_d_isKwzFsid as isKwzFsid,
    fsid_d_isKwzDsiLibraryFsid as isKwzDsiLibraryFsid,
    fsid_d_isFsid as isFsid,
    fsid_d_getPpmFsidRegion as getPpmFsidRegion,
    fsid_d_getKwzFsidRegion as getKwzFsidRegion,
    fsid_d_getFsidRegion as getFsidRegion,
  };
}

/** Identifies which animation format a Flipnote uses */
declare enum FlipnoteFormat {
    /** Animation format used by Flipnote Studio (Nintendo DSiWare) */
    PPM = "PPM",
    /** Animation format used by Flipnote Studio 3D (Nintendo 3DS) */
    KWZ = "KWZ"
}
/** RGBA color */
declare type FlipnotePaletteColor = [
    /** Red (0 to 255) */
    number,
    /** Green (0 to 255) */
    number,
    /** Blue (0 to 255) */
    number,
    /** Alpha (0 to 255) */
    number
];
/** Flipnote layer visibility */
declare type FlipnoteLayerVisibility = Record<number, boolean>;
/** Defines the colors used for a given Flipnote format */
declare type FlipnotePaletteDefinition = Record<string, FlipnotePaletteColor>;
/** Identifies a Flipnote audio track type */
declare enum FlipnoteAudioTrack {
    /** Background music track */
    BGM = 0,
    /** Sound effect 1 track */
    SE1 = 1,
    /** Sound effect 2 track */
    SE2 = 2,
    /** Sound effect 3 track */
    SE3 = 3,
    /** Sound effect 4 track (only used by KWZ files) */
    SE4 = 4
}
/** Contains data about a given audio track; it's file offset and length */
interface FlipnoteAudioTrackInfo {
    ptr: number;
    length: number;
}
/** {@link FlipnoteAudioTrack}, but just sound effect tracks */
declare enum FlipnoteSoundEffectTrack {
    SE1 = 1,
    SE2 = 2,
    SE3 = 3,
    SE4 = 4
}
/** Flipnote sound flags, indicating which sound effect tracks are used on a given frame */
declare type FlipnoteSoundEffectFlags = Record<FlipnoteSoundEffectTrack, boolean>;
/**
 * Flipnote version info - provides details about a particular Flipnote version and its author
 */
interface FlipnoteVersion {
    /** Flipnote unique filename */
    filename: string;
    /** Author's username */
    username: string;
    /** Author's unique Flipnote Studio ID, formatted in the same way that it would appear on the app's settings screen */
    fsid: string;
    /** Author's region */
    region: FlipnoteRegion;
    /** KWZ only - sometimes DSi library notes incorrectly use the PPM filename format instead */
    isDsiFilename?: boolean;
}
/**
 * Flipnote details
 */
interface FlipnoteMeta {
    /** File lock state. Locked Flipnotes cannot be edited by anyone other than the current author */
    lock: boolean;
    /** Playback loop state. If `true`, playback will loop once the end is reached */
    loop: boolean;
    /** Spinoffs are remixes of another user's Flipnote */
    isSpinoff: boolean;
    /** Total number of animation frames */
    frameCount: number;
    /** In-app frame playback speed */
    frameSpeed: number;
    /** Index of the animation frame used as the Flipnote's thumbnail image */
    thumbIndex: number;
    /** Date representing when the file was last edited */
    timestamp: Date;
    /** Flipnote duration measured in seconds, assuming normal playback speed */
    duration: number;
    /** Metadata about the author of the original Flipnote file */
    root: FlipnoteVersion;
    /** Metadata about the previous author of the Flipnote file */
    parent: FlipnoteVersion;
    /** Metadata about the current author of the Flipnote file */
    current: FlipnoteVersion;
}
/**
 * Base Flipnote parser class
 *
 * This doesn't implement any parsing functionality itself,
 * it just provides a consistent API for every format parser to implement.
 * @category File Parser
*/
declare abstract class FlipnoteParserBase extends DataStream {
    /** Static file format info */
    /** File format type */
    static format: FlipnoteFormat;
    /** Animation frame width */
    static frameWidth: number;
    /** Animation frame height */
    static frameHeight: number;
    /** Number of animation frame layers */
    static numLayers: number;
    /** Number of colors per layer (aside from transparent) */
    static numLayerColors: number;
    /** Which audio tracks are available in this format */
    static audioTracks: FlipnoteAudioTrack[];
    /** Which sound effect tracks are available in this format */
    static soundEffectTracks: FlipnoteSoundEffectTrack[];
    /** Audio track base sample rate */
    static rawSampleRate: number;
    /** Audio output sample rate */
    static sampleRate: number;
    /** Global animation frame color palette */
    static globalPalette: FlipnotePaletteColor[];
    /** key used for Flipnote verification, in PEM format */
    static publicKey: string;
    /** Instance file format info */
    /** Custom object tag */
    [Symbol.toStringTag]: string;
    /** File format type, reflects {@link FlipnoteParserBase.format} */
    format: FlipnoteFormat;
    /** Default formats used for {@link getTitle()} */
    titleFormats: {
        COMMENT: string;
        FLIPNOTE: string;
        ICON: string;
    };
    /** Animation frame width, reflects {@link FlipnoteParserBase.width} */
    imageWidth: number;
    /** Animation frame height, reflects {@link FlipnoteParserBase.height} */
    imageHeight: number;
    /** X offset for the top-left corner of the animation frame */
    imageOffsetX: number;
    /** Y offset for the top-left corner of the animation frame */
    imageOffsetY: number;
    /** Number of animation frame layers, reflects {@link FlipnoteParserBase.numLayers} */
    numLayers: number;
    /** Number of colors per layer (aside from transparent), reflects {@link FlipnoteParserBase.numLayerColors} */
    numLayerColors: number;
    /** @internal */
    srcWidth: number;
    /** Which audio tracks are available in this format, reflects {@link FlipnoteParserBase.audioTracks} */
    audioTracks: FlipnoteAudioTrack[];
    /** Which sound effect tracks are available in this format, reflects {@link FlipnoteParserBase.soundEffectTracks} */
    soundEffectTracks: FlipnoteSoundEffectTrack[];
    /** Audio track base sample rate, reflects {@link FlipnoteParserBase.rawSampleRate} */
    rawSampleRate: number;
    /** Audio output sample rate, reflects {@link FlipnoteParserBase.sampleRate} */
    sampleRate: number;
    /** Global animation frame color palette, reflects {@link FlipnoteParserBase.globalPalette} */
    globalPalette: FlipnotePaletteColor[];
    /** Flipnote palette */
    palette: FlipnotePaletteDefinition;
    /** File metadata, see {@link FlipnoteMeta} for structure */
    meta: FlipnoteMeta;
    /** File audio track info, see {@link FlipnoteAudioTrackInfo} */
    soundMeta: Map<FlipnoteAudioTrack, FlipnoteAudioTrackInfo>;
    /** Animation frame global layer visibility */
    layerVisibility: FlipnoteLayerVisibility;
    /** key used for Flipnote verification, in PEM format */
    publicKey: string;
    /** Instance-unique info */
    /** Spinoffs are remixes of another user's Flipnote */
    isSpinoff: boolean;
    /** (KWZ only) Indicates whether or not this file is a Flipnote Studio 3D folder icon */
    isFolderIcon: boolean;
    /** (KWZ only) Indicates whether or not this file is a handwritten comment from Flipnote Gallery World */
    isComment: boolean;
    /** (KWZ only) Indicates whether or not this Flipnote is a PPM to KWZ conversion from Flipnote Studio 3D's DSi Library service */
    isDsiLibraryNote: boolean;
    /** Animation frame count */
    frameCount: number;
    /** In-app animation playback speed */
    frameSpeed: number;
    /** Animation duration, in seconds */
    duration: number;
    /** In-app animation playback speed when the BGM track was recorded */
    bgmSpeed: number;
    /** Animation framerate, measured as frames per second */
    framerate: number;
    /** Animation framerate when the BGM track was recorded, measured as frames per second */
    bgmrate: number;
    /** Index of the animation frame used as the Flipnote's thumbnail image */
    thumbFrameIndex: number;
    /** Get the amount of clipping in the master audio track, useful for determining if a Flipnote's audio is corrupted. Closer to 1.0 = more clipping. Only available after {@link getAudioMasterPcm} has been called */
    audioClipRatio: number;
    /**
     * Get file default title - e.g. "Flipnote by Y", "Comment by X", etc.
     * A format object can be passed for localisation, where `$USERNAME` gets replaced by author name:
     * ```js
     * {
     *  COMMENT: 'Comment by $USERNAME',
     *  FLIPNOTE: 'Flipnote by $USERNAME',
     *  ICON: 'Folder icon'
     * }
     * ```
     * @category Utility
     */
    getTitle(formats?: {
        COMMENT: string;
        FLIPNOTE: string;
        ICON: string;
    }): string;
    /**
     * Returns the Flipnote title when casting a parser instance to a string
     *
     * ```js
     * const str = 'Title: ' + note;
     * // str === 'Title: Flipnote by username'
     * ```
     * @category Utility
     */
    toString(): string;
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
    [Symbol.iterator](): Generator<number, void, unknown>;
    /**
     * Decode a frame, returning the raw pixel buffers for each layer
     * @category Image
    */
    abstract decodeFrame(frameIndex: number): Uint8Array[];
    /**
     * Get the pixels for a given frame layer, as palette indices
     * NOTE: layerIndex are not guaranteed to be sorted by 3D depth in KWZs, use {@link getFrameLayerOrder} to get the correct sort order first
     * NOTE: if the visibility flag for this layer is turned off, the result will be empty
     * @category Image
    */
    getLayerPixels(frameIndex: number, layerIndex: number, imageBuffer?: Uint8Array): Uint8Array;
    /**
     * Get the pixels for a given frame layer, as RGBA pixels
     * NOTE: layerIndex are not guaranteed to be sorted by 3D depth in KWZs, use {@link getFrameLayerOrder} to get the correct sort order first
     * NOTE: if the visibility flag for this layer is turned off, the result will be empty
     * @category Image
    */
    getLayerPixelsRgba(frameIndex: number, layerIndex: number, imageBuffer?: Uint32Array, paletteBuffer?: Uint32Array): Uint32Array;
    /**
     * Get the layer draw order for a given frame
     * @category Image
    */
    abstract getFrameLayerOrder(frameIndex: number): number[];
    /**
     * Get the image for a given frame, as palette indices
     * @category Image
    */
    getFramePixels(frameIndex: number, imageBuffer?: Uint8Array): Uint8Array;
    /**
     * Get the image for a given frame as an uint32 array of RGBA pixels
     * @category Image
     */
    getFramePixelsRgba(frameIndex: number, imageBuffer?: Uint32Array, paletteBuffer?: Uint32Array): Uint32Array;
    /**
     * Get the color palette indices for a given frame. RGBA colors for these values can be indexed from {@link FlipnoteParserBase.globalPalette}
     * @category Image
    */
    abstract getFramePaletteIndices(frameIndex: number): number[];
    /**
     * Get the color palette for a given frame, as a list of `[r,g,b,a]` colors
     * @category Image
    */
    abstract getFramePalette(frameIndex: number): FlipnotePaletteColor[];
    /**
     * Get the color palette for a given frame, as an uint32 array
     * @category Image
    */
    getFramePaletteUint32(frameIndex: number, paletteBuffer?: Uint32Array): Uint32Array;
    /**
     * Get the sound effect flags for every frame in the Flipnote
     * @category Audio
    */
    abstract decodeSoundFlags(): boolean[][];
    /**
     * Get the sound effect usage flags for every frame
     * @category Audio
     */
    abstract getSoundEffectFlags(): FlipnoteSoundEffectFlags[];
    /**
     * Get the sound effect usage flags for a given frame
     * @category Audio
     */
    abstract getFrameSoundEffectFlags(frameIndex: number): FlipnoteSoundEffectFlags;
    /**
     * Get the usage flags for a given track accross every frame
     * @returns an array of booleans for every frame, indicating whether the track is used on that frame
     * @category Audio
     */
    getSoundEffectFlagsForTrack(trackId: FlipnoteSoundEffectTrack): boolean[];
    /**
     * Is a given track used on a given frame
     * @category Audio
     */
    isSoundEffectUsedOnFrame(trackId: FlipnoteSoundEffectTrack, frameIndex: number): boolean;
    /**
     * Does an audio track exist in the Flipnote?
     * @returns boolean
     * @category Audio
    */
    hasAudioTrack(trackId: FlipnoteAudioTrack): boolean;
    /**
     * Get the raw compressed audio data for a given track
     * @returns byte array
     * @category Audio
    */
    abstract getAudioTrackRaw(trackId: FlipnoteAudioTrack): Uint8Array;
    /**
     * Get the decoded audio data for a given track, using the track's native samplerate
     * @returns Signed 16-bit PCM audio
     * @category Audio
    */
    abstract decodeAudioTrack(trackId: FlipnoteAudioTrack): Int16Array;
    /**
     * Get the decoded audio data for a given track, using the specified samplerate
     * @returns Signed 16-bit PCM audio
     * @category Audio
    */
    abstract getAudioTrackPcm(trackId: FlipnoteAudioTrack, sampleRate?: number): Int16Array;
    /**
     * Get the full mixed audio for the Flipnote, using the specified samplerate
     * @returns Signed 16-bit PCM audio
     * @category Audio
    */
    abstract getAudioMasterPcm(sampleRate?: number): Int16Array;
    /**
     * Get the body of the Flipnote - the data that is digested for computing the signature
     * @returns content data as Uint8Array
     * @category Verification
     */
    abstract getBody(): Uint8Array;
    /**
     * Get the Flipnote's signature data
     * @returns signature data as Uint8Array
     * @category Verification
     */
    abstract getSignature(): Uint8Array;
    /**
     * Verify whether this Flipnote's signature is valid
     * @async
     * @returns boolean
     * @category Verification
     */
    abstract verify(): Promise<boolean>;
}

/**
 * PPM file metadata, stores information about its playback, author details, etc
 */
interface PpmMeta extends FlipnoteMeta {
    /** In-app frame playback speed when the BGM audio track was recorded */
    bgmSpeed: number;
}
/**
 * PPM parser options for enabling optimisations and other extra features.
 * None are currently implemented
 */
declare type PpmParserSettings = {};
/**
 * Parser class for (DSiWare) Flipnote Studio's PPM animation format.
 *
 * Format docs: https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format
 * @category File Parser
 */
declare class PpmParser extends FlipnoteParserBase {
    /** Default PPM parser settings */
    static defaultSettings: PpmParserSettings;
    /** File format type */
    static format: FlipnoteFormat;
    /** Animation frame width */
    static width: number;
    /** Animation frame height */
    static height: number;
    /** Number of animation frame layers */
    static numLayers: number;
    /** Number of colors per layer (aside from transparent) */
    static numLayerColors: number;
    /** Audio track base sample rate */
    static rawSampleRate: number;
    /** Nintendo DSi audio output rate */
    static sampleRate: number;
    /** Which audio tracks are available in this format */
    static audioTracks: FlipnoteAudioTrack[];
    /** Which sound effect tracks are available in this format */
    static soundEffectTracks: FlipnoteSoundEffectTrack[];
    /** Global animation frame color palette */
    static globalPalette: FlipnotePaletteColor[];
    /** Public key used for Flipnote verification, in PEM format */
    static publicKey: string;
    /** File format type, reflects {@link PpmParser.format} */
    format: FlipnoteFormat;
    /** Custom object tag */
    [Symbol.toStringTag]: string;
    /** Animation frame width, reflects {@link PpmParser.width} */
    imageWidth: number;
    /** Animation frame height, reflects {@link PpmParser.height} */
    imageHeight: number;
    /** X offset for the top-left corner of the animation frame */
    imageOffsetX: number;
    /** Y offset for the top-left corner of the animation frame */
    imageOffsetY: number;
    /** Number of animation frame layers, reflects {@link PpmParser.numLayers} */
    numLayers: number;
    /** Number of colors per layer (aside from transparent), reflects {@link PpmParser.numLayerColors} */
    numLayerColors: number;
    /** key used for Flipnote verification, in PEM format */
    publicKey: string;
    /** @internal */
    srcWidth: number;
    /** Which audio tracks are available in this format, reflects {@link PpmParser.audioTracks} */
    audioTracks: FlipnoteAudioTrack[];
    /** Which sound effect tracks are available in this format, reflects {@link PpmParser.soundEffectTracks} */
    soundEffectTracks: FlipnoteSoundEffectTrack[];
    /** Audio track base sample rate, reflects {@link PpmParser.rawSampleRate} */
    rawSampleRate: number;
    /** Audio output sample rate, reflects {@link PpmParser.sampleRate} */
    sampleRate: number;
    /** Global animation frame color palette, reflects {@link PpmParser.globalPalette} */
    globalPalette: FlipnotePaletteColor[];
    /** File metadata, see {@link PpmMeta} for structure */
    meta: PpmMeta;
    /** File format version; always the same as far as we know */
    version: number;
    private layerBuffers;
    private soundFlags;
    private prevLayerBuffers;
    private lineEncodingBuffers;
    private prevDecodedFrame;
    private frameDataLength;
    private soundDataLength;
    private soundDataOffset;
    private frameOffsets;
    /**
     * Create a new PPM file parser instance
     * @param arrayBuffer an ArrayBuffer containing file data
     * @param settings parser settings (none currently implemented)
     */
    constructor(arrayBuffer: ArrayBuffer, settings?: Partial<PpmParserSettings>);
    private decodeHeader;
    private readFilename;
    private decodeMeta;
    private decodeAnimationHeader;
    private decodeSoundHeader;
    private isKeyFrame;
    /**
     * Decode a frame, returning the raw pixel buffers for each layer
     * @category Image
    */
    decodeFrame(frameIndex: number): [Uint8Array, Uint8Array];
    /**
     * Get the layer draw order for a given frame
     * @category Image
     * @returns Array of layer indexes, in the order they should be drawn
    */
    getFrameLayerOrder(frameIndex?: number): number[];
    /**
     * Get the color palette indices for a given frame. RGBA colors for these values can be indexed from {@link PpmParser.globalPalette}
     *
     * Returns an array where:
     *  - index 0 is the paper color index
     *  - index 1 is the layer 1 color index
     *  - index 2 is the layer 2 color index
     * @category Image
    */
    getFramePaletteIndices(frameIndex: number): number[];
    /**
     * Get the RGBA colors for a given frame
     *
     * Returns an array where:
     *  - index 0 is the paper color
     *  - index 1 is the layer 1 color
     *  - index 2 is the layer 2 color
     * @category Image
     */
    getFramePalette(frameIndex: number): FlipnotePaletteColor[];
    /**
     * Get the sound effect flags for every frame in the Flipnote
     * @category Audio
    */
    decodeSoundFlags(): boolean[][];
    /**
     * Get the sound effect usage flags for every frame
     * @category Audio
     */
    getSoundEffectFlags(): FlipnoteSoundEffectFlags[];
    /**
     * Get the sound effect usage flags for a given frame
     * @category Audio
     */
    getFrameSoundEffectFlags(frameIndex: number): FlipnoteSoundEffectFlags;
    /**
     * Get the raw compressed audio data for a given track
     * @returns byte array
     * @category Audio
    */
    getAudioTrackRaw(trackId: FlipnoteAudioTrack): Uint8Array;
    /**
     * Get the decoded audio data for a given track, using the track's native samplerate
     * @returns Signed 16-bit PCM audio
     * @category Audio
    */
    decodeAudioTrack(trackId: FlipnoteAudioTrack): Int16Array;
    /**
     * Get the decoded audio data for a given track, using the specified samplerate
     * @returns Signed 16-bit PCM audio
     * @category Audio
    */
    getAudioTrackPcm(trackId: FlipnoteAudioTrack, dstFreq?: number): Int16Array;
    private pcmAudioMix;
    /**
     * Get the full mixed audio for the Flipnote, using the specified samplerate
     * @returns Signed 16-bit PCM audio
     * @category Audio
    */
    getAudioMasterPcm(dstFreq?: number): Int16Array;
    /**
     * Get the body of the Flipnote - the data that is digested for the signature
     * @category Verification
     */
    getBody(): Uint8Array;
    /**
    * Get the Flipnote's signature data
    * @category Verification
    */
    getSignature(): Uint8Array;
    /**
     * Verify whether this Flipnote's signature is valid
     * @category Verification
     */
    verify(): Promise<boolean>;
}

/**
 * KWZ file metadata, stores information about its playback, author details, etc
 */
interface KwzMeta extends FlipnoteMeta {
    /** Date representing when the file was created */
    creationTimestamp: Date;
}
/**
 * KWZ parser options for enabling optimisations and other extra features
 */
declare type KwzParserSettings = {
    /**
     * Skip full metadata parsing for quickness
     */
    quickMeta: boolean;
    /**
     * Apply special cases for DSi library notes
     */
    dsiLibraryNote: boolean;
    /**
     * Automatically crop out the border around any frames
     */
    borderCrop: boolean;
    /**
     * Nintendo messed up the initial adpcm state for a bunch of the PPM to KWZ conversions on DSi Library. They are effectively random.
     * By default flipnote.js will try to make a best guess, but you can disable this and provide your own state values
     *
     * This is only enabled if `dsiLibraryNote` is also set to `true`
     */
    guessInitialBgmState: boolean;
    /**
     * Manually provide the initial adpcm step index for the BGM track.
     *
     * This is only enabled if `dsiLibraryNote` is also set to `true`
     */
    initialBgmStepIndex: number | null;
    /**
     * Manually provide the initial adpcm predictor for the BGM track.
     *
     * This is only enabled if `dsiLibraryNote` is also set to `true`
     */
    initialBgmPredictor: number | null;
    /**
     * Manually provide an initial adpcm step index for each sound effect track.
     *
     * This is only enabled if `dsiLibraryNote` is also set to `true`
     */
    initialSeStepIndices: number[] | null;
    /**
     * Manually provide an initial adpcm predictor for each sound effect track.
     *
     * This is only enabled if `dsiLibraryNote` is also set to `true`
     */
    initialSePredictors: number[] | null;
};
/**
 * Parser class for Flipnote Studio 3D's KWZ animation format
 *
 * KWZ format docs: https://github.com/Flipnote-Collective/flipnote-studio-3d-docs/wiki/KWZ-Format
 * @category File Parser
 */
declare class KwzParser extends FlipnoteParserBase {
    /** Default KWZ parser settings */
    static defaultSettings: KwzParserSettings;
    /** File format type */
    static format: FlipnoteFormat;
    /** Animation frame width */
    static width: number;
    /** Animation frame height */
    static height: number;
    /** Number of animation frame layers */
    static numLayers: number;
    /** Number of colors per layer (aside from transparent) */
    static numLayerColors: number;
    /** Audio track base sample rate */
    static rawSampleRate: number;
    /** Audio output sample rate. NOTE: probably isn't accurate, full KWZ audio stack is still on the todo */
    static sampleRate: number;
    /** Which audio tracks are available in this format */
    static audioTracks: FlipnoteAudioTrack[];
    /** Which sound effect tracks are available in this format */
    static soundEffectTracks: FlipnoteSoundEffectTrack[];
    /** Global animation frame color palette */
    static globalPalette: FlipnotePaletteColor[];
    /** Public key used for Flipnote verification, in PEM format */
    static publicKey: string;
    /** File format type, reflects {@link KwzParser.format} */
    format: FlipnoteFormat;
    /** Custom object tag */
    [Symbol.toStringTag]: string;
    /** Animation frame width, reflects {@link KwzParser.width} */
    imageWidth: number;
    /** Animation frame height, reflects {@link KwzParser.height} */
    imageHeight: number;
    /** X offset for the top-left corner of the animation frame */
    imageOffsetX: number;
    /** Y offset for the top-left corner of the animation frame */
    imageOffsetY: number;
    /** Number of animation frame layers, reflects {@link KwzParser.numLayers} */
    numLayers: number;
    /** Number of colors per layer (aside from transparent), reflects {@link KwzParser.numLayerColors} */
    numLayerColors: number;
    /** key used for Flipnote verification, in PEM format */
    publicKey: string;
    /** @internal */
    srcWidth: number;
    /** Which audio tracks are available in this format, reflects {@link KwzParser.audioTracks} */
    audioTracks: FlipnoteAudioTrack[];
    /** Which sound effect tracks are available in this format, reflects {@link KwzParser.soundEffectTracks} */
    soundEffectTracks: FlipnoteSoundEffectTrack[];
    /** Audio track base sample rate, reflects {@link KwzParser.rawSampleRate} */
    rawSampleRate: number;
    /** Audio output sample rate, reflects {@link KwzParser.sampleRate} */
    sampleRate: number;
    /** Global animation frame color palette, reflects {@link KwzParser.globalPalette} */
    globalPalette: FlipnotePaletteColor[];
    /** File metadata, see {@link KwzMeta} for structure */
    meta: KwzMeta;
    private settings;
    private sectionMap;
    private bodyEndOffset;
    private layerBuffers;
    private soundFlags;
    private prevDecodedFrame;
    private frameMetaOffsets;
    private frameDataOffsets;
    private frameLayerSizes;
    private bitIndex;
    private bitValue;
    /**
     * Create a new KWZ file parser instance
     * @param arrayBuffer an ArrayBuffer containing file data
     * @param settings parser settings
     */
    constructor(arrayBuffer: ArrayBuffer, settings?: Partial<KwzParserSettings>);
    private buildSectionMap;
    private readBits;
    private readFsid;
    private readFilename;
    private decodeMeta;
    private decodeMetaQuick;
    private getFrameOffsets;
    private decodeSoundHeader;
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
    getFramePaletteIndices(frameIndex: number): number[];
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
    getFramePalette(frameIndex: number): FlipnotePaletteColor[];
    private getFrameDiffingFlag;
    private getFrameLayerSizes;
    private getFrameLayerDepths;
    private getFrameAuthor;
    private decodeFrameSoundFlags;
    private getFrameCameraFlags;
    /**
     * Get the layer draw order for a given frame
     * @category Image
     * @returns Array of layer indexes, in the order they should be drawn
    */
    getFrameLayerOrder(frameIndex: number): number[];
    /**
     * Decode a frame, returning the raw pixel buffers for each layer
     * @category Image
    */
    decodeFrame(frameIndex: number, diffingFlag?: number, isPrevFrame?: boolean): [Uint8Array, Uint8Array, Uint8Array];
    /**
     * Get the sound effect flags for every frame in the Flipnote
     * @category Audio
    */
    decodeSoundFlags(): boolean[][];
    /**
     * Get the sound effect usage flags for every frame
     * @category Audio
     */
    getSoundEffectFlags(): FlipnoteSoundEffectFlags[];
    /**
     * Get the sound effect usage for a given frame
     * @param frameIndex
     * @category Audio
     */
    getFrameSoundEffectFlags(frameIndex: number): FlipnoteSoundEffectFlags;
    /**
     * Get the raw compressed audio data for a given track
     * @returns Byte array
     * @category Audio
    */
    getAudioTrackRaw(trackId: FlipnoteAudioTrack): Uint8Array;
    private decodeAdpcm;
    /**
     * Get the decoded audio data for a given track, using the track's native samplerate
     * @returns Signed 16-bit PCM audio
     * @category Audio
    */
    decodeAudioTrack(trackId: FlipnoteAudioTrack): Int16Array;
    /**
     * Get the decoded audio data for a given track, using the specified samplerate
     * @returns Signed 16-bit PCM audio
     * @category Audio
    */
    getAudioTrackPcm(trackId: FlipnoteAudioTrack, dstFreq?: number): Int16Array;
    private pcmAudioMix;
    /**
     * Get the full mixed audio for the Flipnote, using the specified samplerate
     * @returns Signed 16-bit PCM audio
     * @category Audio
    */
    getAudioMasterPcm(dstFreq?: number): Int16Array;
    /**
     * Get the body of the Flipnote - the data that is digested for the signature
     * @category Verification
     */
    getBody(): Uint8Array;
    /**
     * Get the Flipnote's signature data
     * @category Verification
     */
    getSignature(): Uint8Array;
    /**
     * Verify whether this Flipnote's signature is valid
     * @category Verification
     */
    verify(): Promise<boolean>;
}

/** Optional settings to pass to a Flipnote parser instance. See {@link PpmParserSettings} and {@link KwzParserSettings} */
declare type FlipnoteParserSettings = Partial<PpmParserSettings & KwzParserSettings>;
/** Flipnote type. An object with this type is guranteed to implement the {@link FlipnoteParser} API. */
declare type Flipnote = FlipnoteParserBase;

/**
 * Resolution function passed to a loader's `load` method. Call when a Flipnote has been loaded successfully.
 * The result should be Flipnote file data as an ArrayBuffer.
 * @category Loader
 */
declare type LoaderResolve = (result: ArrayBuffer) => void;
/**
 * Rejection function passed to a loader's `load` method. Call when a Flipnote couldn't be loaded.
 * @category Loader
 */
declare type LoaderReject = (err?: any) => void;
/**
 * Loader interface
 * The goal of a loader is to be able to tell when it can handle a particular source type, and then resolve an ArrayBuffer for that source.
 * @category Loader
 */
interface LoaderDefinition<T> {
    /** Is this loader able to process the input source type? */
    matches: (source: any) => boolean;
    /** Try loading the source. Passes an ArrayBuffer to resolve() if successful, calls reject() with an optional error if not */
    load: (source: T, resolve: LoaderResolve, reject: LoaderReject) => void;
}

/**
 * A list of {@link LoaderDefinition} items to use when attempting to load a Flipnote.
 * Loaders are tried in sequence until a matching one is found for the requested input.
 * @category Loader
 */
declare type LoaderDefinitionList = LoaderDefinition<any>[];
/** @internal */
declare function loadSource(source: any, loaders?: LoaderDefinitionList): Promise<ArrayBuffer>;

/**
 * Source to load a Flipnote from. Depending on the operating envionment, this can be:
 * - A string representing a web URL
 * - An {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}
 * - A {@link https://developer.mozilla.org/en-US/docs/Web/API/File | File} object (Browser only)
 * - A {@link https://nodejs.org/api/buffer.html | Buffer} object (NodeJS only)
 */
declare type FlipnoteSource = string | ArrayBuffer | Buffer | File;
/**
 * Implements loading a Flipnote from a given source type, and returns a promise which resolves to a {@link Flipnote} parser instance.
 */
declare type FlipnoteSourceParser<S = FlipnoteSource, D = Flipnote> = (source: S, parserConfig?: Partial<FlipnoteParserSettings>, loaders?: LoaderDefinitionList) => Promise<D>;
/**
 * Load a Flipnote from a given source, returning a promise with a parser object.
 * It will auto-detect the Flipnote format and return either a {@link PpmParser} or {@link KwzParser} accordingly.
 *
 * @param source - Source to load a Flipnote from. Depending on the operating environment, this can be:
 * - A string representing a web URL
 * - An {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}
 * - A {@link https://developer.mozilla.org/en-US/docs/Web/API/File | File} object (Browser only)
 * - A {@link https://nodejs.org/api/buffer.html | Buffer} object (NodeJS only)
 * You can also pass your own list of loaders to support your own source types.
 * @param parserConfig - Config settings to pass to the parser, see {@link FlipnoteParserSettings}
 * @param loaders - Optional list of file loaders ({@link LoaderDefinition}) when attempting to load a Flipnote. Loaders are tried in sequence until a matching one is found for the requested input.
 */
declare const parseSource: FlipnoteSourceParser;

/**
 * Player event types
 */
declare enum PlayerEvent {
    __Any = "any",
    Play = "play",
    Pause = "pause",
    CanPlay = "canplay",
    CanPlayThrough = "canplaythrough",
    SeekStart = "seeking",
    SeekEnd = "seeked",
    Duration = "durationchange",
    Loop = "loop",
    Ended = "ended",
    VolumeChange = "volumechange",
    Progress = "progress",
    TimeUpdate = "timeupdate",
    FrameUpdate = "frameupdate",
    FrameNext = "framenext",
    FramePrev = "frameprev",
    FrameFirst = "framefirst",
    FrameLast = "framelast",
    Ready = "ready",
    Load = "load",
    LoadStart = "loadstart",
    LoadedData = "loadeddata",
    LoadedMeta = "loadedmetadata",
    Emptied = "emptied",
    Close = "close",
    Error = "error",
    Destroy = "destroy"
}
/** @internal */
declare type PlayerEventMap = Map<PlayerEvent, Function[]>;

/** @internal */
declare abstract class CanvasInterface {
    note: FlipnoteParserBase;
    width: number;
    height: number;
    srcWidth: number;
    srcHeight: number;
    dstWidth: number;
    dstHeight: number;
    prevFrameIndex: number;
    constructor(parent: Element, width: number, height: number);
    abstract setCanvasSize(width: number, height: number): void;
    abstract setNote(note: FlipnoteParserBase): void;
    abstract clear(color?: [number, number, number, number]): void;
    abstract drawFrame(frameIndex: number): void;
    abstract forceUpdate(): void;
    abstract getDataUrl(type?: string, quality?: any): string;
    abstract getBlob(type?: string, quality?: any): Promise<Blob>;
    abstract destroy(): void;
}

/**
 * Settings for {@link WebGlCanvas}
 */
interface WebglCanvasOptions {
    /** Function to be called if the context is lost */
    onlost: () => void;
    /** Function to be called if the context is restored */
    onrestored: () => void;
    /** Use DPI scaling */
    useDpi: boolean;
}
/**
 * Flipnote renderer for the {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API WebGL} API
 *
 * Only available in browser contexts
 */
declare class WebglCanvas implements CanvasInterface {
    static defaultOptions: WebglCanvasOptions;
    static isSupported(): boolean;
    /**  */
    note: FlipnoteParserBase;
    /** Canvas HTML element being used as a rendering surface */
    canvas: HTMLCanvasElement;
    /** Rendering context - see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext} */
    gl: WebGLRenderingContext;
    /** View width (CSS pixels) */
    width: number;
    /** View height (CSS pixels) */
    height: number;
    /** */
    srcWidth: number;
    /** */
    srcHeight: number;
    /**
     * Backing canvas width (real pixels)
     * Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels
     */
    dstWidth: number;
    /**
     * Backing canvas height (real pixels)
     * Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels
     */
    dstHeight: number;
    /** */
    prevFrameIndex: number;
    private options;
    private program;
    private quadBuffer;
    private paletteBuffer;
    private frameBuffer;
    private frameBufferBytes;
    private frameTexture;
    private refs;
    private isCtxLost;
    /**
     * Creates a new WebGlCanvas instance
     * @param el - Canvas HTML element to use as a rendering surface
     * @param width - Canvas width in CSS pixels
     * @param height - Canvas height in CSS pixels
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     */
    constructor(parent: Element, width?: number, height?: number, options?: Partial<WebglCanvasOptions>);
    private init;
    private createProgram;
    private createShader;
    private createScreenQuad;
    private setBuffersAndAttribs;
    private createTexture;
    /**
     * Resize the canvas surface
     * @param width - New canvas width, in CSS pixels
     * @param height - New canvas height, in CSS pixels
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     */
    setCanvasSize(width: number, height: number): void;
    /**
     * Sets the size of the input pixel arrays
     * @param width
     * @param height
     */
    setNote(note: FlipnoteParserBase): void;
    /**
     * Clear the canvas
     * @param color optional RGBA color to use as a background color
     */
    clear(color?: [number, number, number, number]): void;
    /**
     * Draw a frame from the currently loaded Flipnote
     * @param frameIndex
     */
    drawFrame(frameIndex: number): void;
    forceUpdate(): void;
    /**
     * Returns true if the webGL context has returned an error
     */
    isErrorState(): boolean;
    /**
     * Only a certain number of WebGL contexts can be added to a single page before the browser will start culling old contexts.
     * This method returns true if it has been culled, false if not
     */
    private checkContextLoss;
    private handleContextLoss;
    private handleContextRestored;
    /**
     *
     * @param type image mime type (`image/jpeg`, `image/png`, etc)
     * @param quality image quality where supported, between 0 and 1
     */
    getDataUrl(type?: string, quality?: any): string;
    getBlob(type?: string, quality?: any): Promise<Blob>;
    /**
     * Frees any resources used by this canvas instance
     */
    destroy(): void;
}

/**
 * Setup options for {@link Html5Canvas}
 */
interface Html5CanvasOptions {
    /** Use DPI scaling */
    useDpi: boolean;
    /** Use image smoothing */
    useSmoothing: boolean;
}
/**
 * Flipnote renderer for the [HTML5 2D canvas API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
 */
declare class Html5Canvas implements CanvasInterface {
    static defaultOptions: Html5CanvasOptions;
    static isSupported(): boolean;
    /** */
    note: FlipnoteParserBase;
    /** Canvas HTML element being used as a rendering surface */
    canvas: HTMLCanvasElement;
    /** Rendering context */
    ctx: CanvasRenderingContext2D;
    /** View width (CSS pixels) */
    width: number;
    /** View height (CSS pixels) */
    height: number;
    /**
     * Backing canvas width (real pixels)
     * Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels
    */
    dstWidth: number;
    /**
     * Backing canvas height (real pixels)
     * Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels
    */
    dstHeight: number;
    /**  */
    srcWidth: number;
    /**  */
    srcHeight: number;
    /** */
    prevFrameIndex: number;
    private options;
    private srcCanvas;
    private srcCtx;
    private frameImage;
    private paletteBuffer;
    private frameBuffer;
    constructor(parent: Element, width: number, height: number, options?: Partial<Html5CanvasOptions>);
    /**
     * Resize the canvas surface
     * @param width - New canvas width, in CSS pixels
     * @param height - New canvas height, in CSS pixels
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     */
    setCanvasSize(width: number, height: number): void;
    /**
     */
    setNote(note: FlipnoteParserBase): void;
    /**
     * Clear the canvas
     * @param color optional RGBA color to use as a background color
     */
    clear(color?: [number, number, number, number]): void;
    drawFrame(frameIndex: number): void;
    forceUpdate(): void;
    getDataUrl(type?: string, quality?: any): string;
    getBlob(type?: string, quality?: any): Promise<Blob>;
    destroy(): void;
}

declare type UniversalCanvasOptions = WebglCanvasOptions & Html5CanvasOptions;
declare class UniversalCanvas implements CanvasInterface {
    /** */
    subRenderer: CanvasInterface;
    /** */
    note: FlipnoteParserBase;
    /** View width (CSS pixels) */
    width: number;
    /** View height (CSS pixels) */
    height: number;
    /**
     * Backing canvas width (real pixels)
     * Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels
    */
    dstWidth: number;
    /**
     * Backing canvas height (real pixels)
     * Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels
    */
    dstHeight: number;
    /**  */
    srcWidth: number;
    /**  */
    srcHeight: number;
    /** */
    prevFrameIndex: number;
    private parent;
    private options;
    private isReady;
    private isHtml5;
    constructor(parent: Element, width?: number, height?: number, options?: Partial<UniversalCanvasOptions>);
    switchToHtml5(): void;
    setCanvasSize(width: number, height: number): void;
    setNote(note: FlipnoteParserBase): void;
    clear(color?: [number, number, number, number]): void;
    drawFrame(frameIndex: number): void;
    forceUpdate(): void;
    getDataUrl(type?: string, quality?: any): string;
    getBlob(type?: string, quality?: any): Promise<Blob>;
    destroy(): void;
}

/** PCM audio buffer types. Supports s16_le, or float32_le with a range of -1.0 to 1.0 */
declare type PcmAudioBuffer = Int16Array | Float32Array;
/**
 * Audio player built around the {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API | Web Audio API}
 *
 * Capable of playing PCM streams, with volume adjustment and an optional equalizer. Only available in browser contexts
 */
declare class WebAudioPlayer {
    /** Audio context, see {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioContext | AudioContext} */
    ctx: AudioContext;
    /** Audio sample rate */
    sampleRate: number;
    /** Whether the audio is being run through an equalizer or not */
    useEq: boolean;
    /** Whether to connect the output to an audio analyser (see {@link analyser}) */
    useAnalyser: boolean;
    /** Default equalizer settings. Credit to {@link https://www.sudomemo.net/ | Sudomemo} for these */
    eqSettings: [number, number][];
    /** If enabled, provides audio analysis for visualisation etc - https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API */
    analyser: AnalyserNode;
    private _volume;
    private _loop;
    private _startTime;
    private _ctxStartTime;
    private nodeRefs;
    private buffer;
    private gainNode;
    private source;
    constructor();
    /** The audio output volume. Range is 0 to 1 */
    set volume(value: number);
    get volume(): number;
    /** Whether the audio should loop after it has ended */
    set loop(value: boolean);
    get loop(): boolean;
    private getCtx;
    /**
     * Set the audio buffer to play
     * @param inputBuffer
     * @param sampleRate - For best results, this should be a multiple of 16364
     */
    setBuffer(inputBuffer: PcmAudioBuffer, sampleRate: number): void;
    private connectEqNodesTo;
    private initNodes;
    setAnalyserEnabled(on: boolean): void;
    /**
     * Sets the audio volume level
     * @param value - range is 0 to 1
     */
    setVolume(value: number): void;
    /**
     * Begin playback from a specific point
     *
     * Note that the WebAudioPlayer doesn't keep track of audio playback itself. We rely on the {@link Player} API for that.
     * @param currentTime initial playback position, in seconds
     */
    playFrom(currentTime: number): void;
    /**
     * Stops the audio playback
     */
    stop(): void;
    /**
     * Get the current playback time, in seconds
     */
    getCurrentTime(): number;
    /**
     * Frees any resources used by this canvas instance
     */
    destroy(): Promise<void>;
}

declare type PlayerLayerVisibility = Record<number, boolean>;
/**
 * Flipnote Player API (exported as `flipnote.Player`) - provides a {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement | MediaElement}-like interface for loading Flipnotes and playing them.
 * This is intended for cases where you want to implement your own player UI, if you just want a pre-built player with some nice UI controls, check out the {@page Web Components} page instead!
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
declare class Player {
    /** Frame renderer */
    renderer: UniversalCanvas;
    /** Audio player */
    audio: WebAudioPlayer;
    /** Root element */
    el: Element;
    /** Canvas HTML element */
    canvasEl: HTMLCanvasElement;
    /** Currently loaded Flipnote */
    note: Flipnote;
    /** Flipnote parser settings */
    parserSettings: FlipnoteParserSettings;
    /** Format of the currently loaded Flipnote */
    noteFormat: FlipnoteFormat;
    /** Metadata for the currently loaded Flipnote */
    meta: FlipnoteMeta;
    /** Animation duration, in seconds */
    duration: number;
    /** Animation layer visibility */
    layerVisibility: PlayerLayerVisibility;
    /** Automatically begin playback after a Flipnote is loaded */
    autoplay: boolean;
    /** Array of events supported by this player */
    supportedEvents: PlayerEvent[];
    /** @internal */
    _src: FlipnoteSource;
    /** @internal */
    _loop: boolean;
    /** @internal */
    _volume: number;
    /** @internal */
    _muted: boolean;
    /** @internal */
    _frame: number;
    /** @internal */
    _hasEnded: boolean;
    /** @internal */
    isNoteLoaded: boolean;
    /** @internal */
    events: PlayerEventMap;
    /** @internal */
    playbackStartTime: number;
    /** @internal */
    playbackTime: number;
    /** @internal */
    playbackLoopId: number;
    /** @internal */
    showThumbnail: boolean;
    /** @internal */
    hasPlaybackStarted: boolean;
    /** @internal */
    isPlaying: boolean;
    /** @internal */
    wasPlaying: boolean;
    /** @internal */
    isSeeking: boolean;
    /** @internal */
    lastParser: FlipnoteSourceParser;
    /** @internal */
    lastLoaders: LoaderDefinitionList;
    /**
     * Create a new Player instance
     *
     * @param parent - Element to mount the rendering canvas to
     * @param width - Canvas width (pixels)
     * @param height - Canvas height (pixels)
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     */
    constructor(parent: string | Element, width: number, height: number, parserSettings?: FlipnoteParserSettings);
    /** The currently loaded Flipnote source, if there is one */
    get src(): FlipnoteSource;
    set src(source: FlipnoteSource);
    /** Indicates whether playback is currently paused */
    get paused(): boolean;
    set paused(isPaused: boolean);
    /** Current animation frame index */
    get currentFrame(): number;
    set currentFrame(frameIndex: number);
    /** Current animation playback position, in seconds */
    get currentTime(): number;
    set currentTime(value: number);
    /** Current animation playback progress, as a percentage out of 100 */
    get progress(): number;
    set progress(value: number);
    /** Audio volume, range `0` to `1` */
    get volume(): number;
    set volume(value: number);
    /** Audio mute state */
    get muted(): boolean;
    set muted(value: boolean);
    /** Indicates whether playback should loop once the end is reached */
    get loop(): boolean;
    set loop(value: boolean);
    /** Animation frame rate, measured in frames per second */
    get framerate(): number;
    /** Animation frame count */
    get frameCount(): number;
    /** Animation frame speed */
    get frameSpeed(): number;
    /**
     * Implementation of the `HTMLMediaElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered | buffered } property
     * @category HTMLVideoElement compatibility
     */
    get buffered(): TimeRanges;
    /**
     * Implementation of the `HTMLMediaElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seekable | seekable} property
     * @category HTMLVideoElement compatibility
     */
    get seekable(): TimeRanges;
    /**
     * Implementation of the `HTMLMediaElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentSrc | currentSrc} property
     * @category HTMLVideoElement compatibility
     */
    get currentSrc(): FlipnoteSource;
    /**
     * Implementation of the `HTMLVideoElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoWidth | videoWidth} property
     * @category HTMLVideoElement compatibility
     */
    get videoWidth(): number;
    /**
     * Implementation of the `HTMLVideoElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoHeight | videoHeight} property
     * @category HTMLVideoElement compatibility
     */
    get videoHeight(): number;
    /**
     * Open a Flipnote from a source
     * @category Lifecycle
     */
    load(source: any, getParser: FlipnoteSourceParser, loaders?: LoaderDefinitionList): Promise<void>;
    /**
     * Reload the current Flipnote
     */
    reload(): Promise<void>;
    /**
     * Reload the current Flipnote
     */
    updateSettings(settings: FlipnoteParserSettings): Promise<void>;
    /**
     * Close the currently loaded Flipnote
     * @category Lifecycle
     */
    closeNote(): void;
    /**
     * Open a Flipnote into the player
     * @category Lifecycle
     */
    openNote(note: Flipnote): void;
    /**
     * Playback animation loop
     * @internal
     * @category Playback Control
     */
    playbackLoop: (timestamp: DOMHighResTimeStamp) => void;
    /**
     * Set the current playback time
     * @category Playback Control
     */
    setCurrentTime(value: number): void;
    /**
     * Get the current playback time
     * @category Playback Control
     */
    getCurrentTime(): number;
    /**
     * Get the current time as a counter string, like `"0:00 / 1:00"`
     * @category Playback Control
     */
    getTimeCounter(): string;
    /**
     * Get the current frame index as a counter string, like `"001 / 999"`
     * @category Playback Control
     */
    getFrameCounter(): string;
    /**
     * Set the current playback progress as a percentage (`0` to `100`)
     * @category Playback Control
     */
    setProgress(value: number): void;
    /**
     * Get the current playback progress as a percentage (0 to 100)
     * @category Playback Control
     */
    getProgress(): number;
    /**
     * Begin animation playback starting at the current position
     * @category Playback Control
     */
    play(): Promise<void>;
    /**
     * Pause animation playback at the current position
     * @category Playback Control
     */
    pause(): void;
    /**
     * Resumes animation playback if paused, otherwise pauses
     * @category Playback Control
     */
    togglePlay(): void;
    /**
     * Determines if playback is currently paused
     * @category Playback Control
     */
    getPaused(): boolean;
    /**
     * Get the duration of the Flipnote in seconds
     * @category Playback Control
     */
    getDuration(): number;
    /**
     * Determines if playback is looped
     * @category Playback Control
     */
    getLoop(): boolean;
    /**
     * Set the playback loop
     * @category Playback Control
     */
    setLoop(loop: boolean): void;
    /**
     * Switch the playback loop between on and off
     * @category Playback Control
     */
    toggleLoop(): void;
    /**
     * Jump to a given animation frame
     * @category Frame Control
     */
    setCurrentFrame(newFrameValue: number): void;
    /**
     * Jump to the next animation frame
     * If the animation loops, and is currently on its last frame, it will wrap to the first frame
     * @category Frame Control
     */
    nextFrame(): void;
    /**
     * Jump to the next animation frame
     * If the animation loops, and is currently on its first frame, it will wrap to the last frame
     * @category Frame Control
     */
    prevFrame(): void;
    /**
     * Jump to the last animation frame
     * @category Frame Control
     */
    lastFrame(): void;
    /**
     * Jump to the first animation frame
     * @category Frame Control
     */
    firstFrame(): void;
    /**
     * Jump to the thumbnail frame
     * @category Frame Control
     */
    thumbnailFrame(): void;
    /**
     * Begins a seek operation
     * @category Playback Control
     */
    startSeek(): void;
    /**
     * Seek the playback progress to a different position
     * @param position - animation playback position, range `0` to `1`
     * @category Playback Control
     */
    seek(position: number): void;
    /**
     * Ends a seek operation
     * @category Playback Control
     */
    endSeek(): void;
    /**
     * Draws the specified animation frame to the canvas. Note that this doesn't update the playback time or anything, it simply decodes a given frame and displays it.
     * @param frameIndex
     * @category Display Control
     */
    drawFrame(frameIndex: number): void;
    /**
     * Forces the current animation frame to be redrawn
     * @category Display Control
     */
    forceUpdate(): void;
    /**
     * Resize the playback canvas to a new size
     * @param width - new canvas width (pixels)
     * @param height - new canvas height (pixels)
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     *
     * @category Display Control
     */
    resize(width: number, height: number): void;
    /**
     * Sets whether an animation layer should be visible throughout the entire animation
     * @param layer - layer index, starting at 1
     * @param value - `true` for visible, `false` for invisible
     *
     * @category Display Control
     */
    setLayerVisibility(layer: number, value: boolean): void;
    /**
     * Returns the visibility state for a given layer
     * @param layer - layer index, starting at 1
     *
     * @category Display Control
     */
    getLayerVisibility(layer: number): boolean;
    /**
     * Toggles whether an animation layer should be visible throughout the entire animation
     *
     * @category Display Control
     */
    toggleLayerVisibility(layerIndex: number): void;
    playAudio(): void;
    stopAudio(): void;
    /**
     * Toggle audio Sudomemo equalizer filter
     * @category Audio Control
     */
    toggleAudioEq(): void;
    /**
     * Turn audio Sudomemo equalizer filter on or off
     * @category Audio Control
     */
    setAudioEq(state: boolean): void;
    /**
     * Turn the audio off
     * @category Audio Control
     */
    mute(): void;
    /**
     * Turn the audio on
     * @category Audio Control
     */
    unmute(): void;
    /**
     * Turn the audio on or off
     * @category Audio Control
     */
    setMuted(isMute: boolean): void;
    /**
     * Get the audio mute state
     * @category Audio Control
     */
    getMuted(): boolean;
    /**
     * Switch the audio between muted and unmuted
     * @category Audio Control
     */
    toggleMuted(): void;
    /**
     * Set the audio volume
     * @category Audio Control
     */
    setVolume(volume: number): void;
    /**
     * Get the current audio volume
     * @category Audio Control
     */
    getVolume(): number;
    /**
     * Implementation of the `HTMLVideoElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/seekToNextFrame | seekToNextFrame} method
     * @category HTMLVideoElement compatibility
     */
    seekToNextFrame(): void;
    /**
     * Implementation of the `HTMLMediaElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/fastSeek | fastSeek} method
     * @category HTMLVideoElement compatibility
     */
    fastSeek(time: number): void;
    /**
     * Implementation of the `HTMLVideoElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/getVideoPlaybackQuality | getVideoPlaybackQuality } method
     * @category HTMLVideoElement compatibility
     */
    canPlayType(mediaType: string): "" | "probably" | "maybe";
    /**
     * Implementation of the `HTMLVideoElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/getVideoPlaybackQuality](getVideoPlaybackQuality) method
     * @category HTMLVideoElement compatibility
     */
    getVideoPlaybackQuality(): VideoPlaybackQuality;
    /**
     * Implementation of the `HTMLVideoElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestPictureInPicture](requestPictureInPicture) method. Not currently working, only a stub.
     * @category HTMLVideoElement compatibility
     */
    requestPictureInPicture(): void;
    /**
     * Implementation of the `HTMLVideoElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/captureStream](captureStream) method. Not currently working, only a stub.
     * @category HTMLVideoElement compatibility
     */
    captureStream(): void;
    /**
     * Fired when animation playback begins or is resumed
     * @category playback
     * @event play
     */
    onplay: () => void;
    /**
     * Fired when animation playback is paused
     * @category playback
     * @event pause
     */
    onpause: () => void;
    /**
     * Fired when the Flipnote has loaded enough to begin animation play
     * @category HTMLVideoElement compatibility
     * @event canplay
     */
    oncanplay: () => void;
    /**
     *Fired when the Flipnote has loaded enough to play successfully
     * @category HTMLVideoElement compatibility
     * @event canplaythrough
     */
    oncanplaythrough: () => void;
    /**
     * Fired when a seek operation begins
     * @category playback
     * @event seeking
     */
    onseeking: () => void;
    /**
     * Fired when a seek operation completes
     * @category playback
     * @event seeked
     */
    onseeked: () => void;
    /**
     * Fired when the animation duration has changed
     * @category HTMLVideoElement compatibility
     * @event durationchange
     */
    ondurationchange: () => void;
    /**
     * Fired when playbackc has looped after reaching the end
     * @category playback
     * @event loop
     */
    onloop: () => void;
    /**
     * Fired when playback has ended
     * @category playback
     * @event ended
     */
    onended: () => void;
    /**
     * Fired when the player audio volume or muted state has changed
     * @category audio
     * @event volumechange
     */
    onvolumechane: (volume: number) => void;
    /**
     * Fired when playback progress has changed
     * @category playback
     * @event progress
     */
    onprogress: (progress: number) => void;
    /**
     * Fired when the playback time has changed
     * @category playback
     * @event timeupdate
     */
    ontimeupdate: (time: number) => void;
    /**
     * Fired when the current frame index has changed
     * @category frame
     * @event frameupdate
     */
    onframeupdate: (frameIndex: number) => void;
    /**
     * Fired when {@link nextFrame} has been called
     * @category frame
     * @event framenext
     */
    onframenext: () => void;
    /**
     * Fired when {@link prevFrame} has been called
     * @category frame
     * @event frameprev
     */
    onframeprev: () => void;
    /**
     * Fired when {@link firstFrame} has been called
     * @category frame
     * @event framefirst
     */
    onframefirst: () => void;
    /**
     * Fired when {@link lastFrame} has been called
     * @category frame
     * @event framelast
     */
    onframelast: () => void;
    /**
     * Fired when a Flipnote is ready for playback
     * @category lifecycle
     * @event ready
     */
    onready: () => void;
    /**
     * Fired when a Flipnote has finished loading
     * @category lifecycle
     * @event load
     */
    onload: () => void;
    /**
     * Fired when a Flipnote has begun loading
     * @category lifecycle
     * @event loadstart
     */
    onloadstart: () => void;
    /**
     * Fired when the Flipnote data has been loaded; implementation of the `HTMLMediaElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event](loadeddata) event.
     * @category HTMLVideoElement compatibility
     * @event loadeddata
     */
    onloadeddata: () => void;
    /**
     * Fired when the Flipnote metadata has been loaded; implementation of the `HTMLMediaElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event](loadedmetadata) event.
     * @category HTMLVideoElement compatibility
     * @event loadedmetadata
     */
    onloadedmetadata: () => void;
    /**
     * Fired when the media has become empty; implementation of the `HTMLMediaElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event](emptied) event.
     * @category HTMLVideoElement compatibility
     * @event emptied
     */
    onemptied: () => void;
    /**
     * Fired after the Flipnote has been closed with {@link close}
     * @category lifecycle
     * @event close
     */
    onclose: () => void;
    /**
     * Fired after a loading, parsing or playback error occurs
     * @category lifecycle
     * @event error
     */
    onerror: (err?: Error) => void;
    /**
     * Fired just before the player has been destroyed, after calling {@link destroy}
     * @category lifecycle
     * @event destroy
     */
    ondestroy: () => void;
    /**
     * Add an event callback
     * @category Event API
     */
    on(eventType: PlayerEvent | PlayerEvent[], listener: Function): void;
    /**
     * Remove an event callback
     * @category Event API
     */
    off(eventType: PlayerEvent | PlayerEvent[], callback: Function): void;
    /**
     * Emit an event - mostly used internally
     * @category Event API
     */
    emit(eventType: PlayerEvent, ...args: any): void;
    /**
     * Remove all registered event callbacks
     * @category Event API
     */
    clearEvents(): void;
    /**
     * Destroy a Player instace
     * @category Lifecycle
     */
    destroy(): Promise<void>;
    /**
     * Returns true if the player supports a given event or method name
     */
    supports(name: string): boolean;
    /** @internal */
    assertNoteLoaded(): void;
}

/** @internal */
declare type Constructor<T = {}> = new (...args: any[]) => T;
/**
 * This is a bit of a hack to get a player component class to wrap a Player instance,
 * while also inheriting all of the Player API's methods and properties.
 *
 * The resulting PlayerMixinClass will get a Player instance on this.player,
 * and all of the Player API methods and properties applied as wrappers.
 *
 * e.g.
 * - PlayerMixinClass.play() will have the same behaviour as Player.play(), but will call this.player.play() internally.
 * - PlayerMixinClass.paused will have getters and setters to match it to this.player.paused.
 * @internal
 */
declare function PlayerMixin<TargetBase extends Constructor>(Target: TargetBase): {
    new (...args: any[]): {
        player: Player;
        readonly renderer: UniversalCanvas;
        readonly audio: WebAudioPlayer;
        readonly canvasEl: HTMLCanvasElement;
        readonly note: FlipnoteParserBase;
        readonly noteFormat: FlipnoteFormat;
        readonly meta: FlipnoteMeta;
        readonly duration: number;
        readonly layerVisibility: Record<number, boolean>;
        autoplay: boolean;
        el: Element;
        parserSettings: Partial<KwzParserSettings>;
        supportedEvents: PlayerEvent[];
        _src: FlipnoteSource;
        _loop: boolean;
        _volume: number;
        _muted: boolean;
        _frame: number;
        _hasEnded: boolean;
        isNoteLoaded: boolean;
        events: PlayerEventMap;
        playbackStartTime: number;
        playbackTime: number;
        playbackLoopId: number;
        showThumbnail: boolean;
        hasPlaybackStarted: boolean;
        isPlaying: boolean;
        wasPlaying: boolean;
        isSeeking: boolean;
        lastParser: FlipnoteSourceParser<FlipnoteSource, FlipnoteParserBase>;
        lastLoaders: LoaderDefinitionList;
        src: FlipnoteSource;
        paused: boolean;
        currentFrame: number;
        currentTime: number;
        progress: number;
        volume: number;
        muted: boolean;
        loop: boolean;
        readonly framerate: number;
        readonly frameCount: number;
        readonly frameSpeed: number;
        readonly buffered: TimeRanges;
        readonly seekable: TimeRanges;
        readonly currentSrc: FlipnoteSource;
        readonly videoWidth: number;
        readonly videoHeight: number;
        load(source: any, getParser: FlipnoteSourceParser<FlipnoteSource, FlipnoteParserBase>, loaders?: LoaderDefinitionList): Promise<void>;
        reload(): Promise<void>;
        updateSettings(settings: Partial<KwzParserSettings>): Promise<void>;
        closeNote(): void;
        openNote(note: FlipnoteParserBase): void;
        playbackLoop: (timestamp: number) => void;
        setCurrentTime(value: number): void;
        getCurrentTime(): number;
        getTimeCounter(): string;
        getFrameCounter(): string;
        setProgress(value: number): void;
        getProgress(): number;
        play(): Promise<void>;
        pause(): void;
        togglePlay(): void;
        getPaused(): boolean;
        getDuration(): number;
        getLoop(): boolean;
        setLoop(loop: boolean): void;
        toggleLoop(): void;
        setCurrentFrame(newFrameValue: number): void;
        nextFrame(): void;
        prevFrame(): void;
        lastFrame(): void;
        firstFrame(): void;
        thumbnailFrame(): void;
        startSeek(): void;
        seek(position: number): void;
        endSeek(): void;
        drawFrame(frameIndex: number): void;
        forceUpdate(): void;
        resize(width: number, height: number): void;
        setLayerVisibility(layer: number, value: boolean): void;
        getLayerVisibility(layer: number): boolean;
        toggleLayerVisibility(layerIndex: number): void;
        playAudio(): void;
        stopAudio(): void;
        toggleAudioEq(): void;
        setAudioEq(state: boolean): void;
        mute(): void;
        unmute(): void;
        setMuted(isMute: boolean): void;
        getMuted(): boolean;
        toggleMuted(): void;
        setVolume(volume: number): void;
        getVolume(): number;
        seekToNextFrame(): void;
        fastSeek(time: number): void;
        canPlayType(mediaType: string): "probably" | "maybe" | "";
        getVideoPlaybackQuality(): VideoPlaybackQuality;
        requestPictureInPicture(): void;
        captureStream(): void;
        onplay: () => void;
        onpause: () => void;
        oncanplay: () => void;
        oncanplaythrough: () => void;
        onseeking: () => void;
        onseeked: () => void;
        ondurationchange: () => void;
        onloop: () => void;
        onended: () => void;
        onvolumechane: (volume: number) => void;
        onprogress: (progress: number) => void;
        ontimeupdate: (time: number) => void;
        onframeupdate: (frameIndex: number) => void;
        onframenext: () => void;
        onframeprev: () => void;
        onframefirst: () => void;
        onframelast: () => void;
        onready: () => void;
        onload: () => void;
        onloadstart: () => void;
        onloadeddata: () => void;
        onloadedmetadata: () => void;
        onemptied: () => void;
        onclose: () => void;
        onerror: (err?: Error) => void;
        ondestroy: () => void;
        on(eventType: PlayerEvent | PlayerEvent[], listener: Function): void;
        off(eventType: PlayerEvent | PlayerEvent[], callback: Function): void;
        emit(eventType: PlayerEvent, ...args: any): void;
        clearEvents(): void;
        destroy(): Promise<void>;
        supports(name: string): boolean;
        assertNoteLoaded(): void;
    };
} & TargetBase;

declare abstract class EncoderBase {
    mimeType: string;
    dataUrl: string;
    /**
     * Returns the file data as an {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}
     */
    abstract getArrayBuffer(): ArrayBuffer;
    /**
     * Returns the file data as a NodeJS {@link https://nodejs.org/api/buffer.html | Buffer}
     *
     * Note: This method does not work outside of NodeJS environments
     */
    getBuffer(): Buffer;
    /**
     * Returns the file data as a {@link https://developer.mozilla.org/en-US/docs/Web/API/Blob | Blob}
     */
    getBlob(): Blob;
    /**
     * Returns the file data as an {@link https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL | Object URL}
     *
     * Note: This method does not work outside of browser environments
     */
    getUrl(): string;
    /**
     * Revokes this file's {@link https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL | Object URL} if one has been created, use this when the url created with {@link getUrl} is no longer needed, to preserve memory.
     *
     * Note: This method does not work outside of browser environments
     */
    revokeUrl(): void;
}

/**
 * GIF RGBA palette color definition
 */
declare type GifPaletteColor = [
    /** Red (0 to 255) */
    number,
    /** Green (0 to 255) */
    number,
    /** Blue (0 to 255) */
    number,
    /** Alpha (0 to 255) */
    number
];
/**
 * Optional GIF encoder settings
 */
interface GifImageSettings {
    /** Use transparency */
    /** Delay between animated GIF frames, measured in milliseconds */
    delay: number;
    /** Color depth as bits per pixel. Defaults to 8 */
    colorDepth: number;
    /** -1 = no repeat, 0 = repeat forever. Anything else is repeat count */
    repeat: number;
}
/**
 * GIF image encoder
 *
 * Supports static single-frame GIF export as well as animated GIF
 * @category File Encoder
 */
declare class GifImage extends EncoderBase {
    /**
     * Default GIF encoder settings
     */
    static defaultSettings: GifImageSettings;
    mimeType: string;
    /** Image width */
    width: number;
    /** Image height */
    height: number;
    /** GIF global RGBA color palette. Max 256 colors, alpha channel is ignored */
    palette: GifPaletteColor[];
    /** GIF image settings, such as whether it should loop, the delay between frames, etc */
    settings: GifImageSettings;
    /** Number of current GIF frames */
    frameCount: number;
    private data;
    private compressor;
    /**
     * Create a new GIF image object
     * @param width image width
     * @param height image height
     * @param settings whether the gif should loop, the delay between frames, etc. See {@link GifEncoderSettings}
     */
    constructor(width: number, height: number, settings?: Partial<GifImageSettings>);
    /**
     * Create an animated GIF image from a Flipnote
     *
     * This will encode the entire animation, so depending on the number of frames it could take a while to return.
     * @param flipnote {@link Flipnote} object ({@link PpmParser} or {@link KwzParser} instance)
     * @param settings whether the gif should loop, the delay between frames, etc. See {@link GifEncoderSettings}
     */
    static fromFlipnote(flipnote: Flipnote, settings?: Partial<GifImageSettings>): GifImage;
    /**
     * Create an GIF image from a single Flipnote frame
     * @param flipnote
     * @param frameIndex animation frame index to encode
     * @param settings whether the gif should loop, the delay between frames, etc. See {@link GifEncoderSettings}
     */
    static fromFlipnoteFrame(flipnote: Flipnote, frameIndex: number, settings?: Partial<GifImageSettings>): GifImage;
    /**
     * Add a frame to the GIF image
     * @param pixels Raw pixels to encode, must be an uncompressed 8bit array of palette indices with a size matching image width * image height
     */
    writeFrame(pixels: Uint8Array): void;
    finish(): void;
    private writeFirstFrame;
    private writeAdditionalFrame;
    private writeHeader;
    private writeGraphicControlExt;
    private writeLogicalScreenDescriptor;
    private writeNetscapeExt;
    private writeColorTable;
    private writeImageDescriptor;
    private colorTableSize;
    private writePixels;
    /**
     * Returns the GIF image data as an {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}
     */
    getArrayBuffer(): ArrayBufferLike;
    /**
      * Returns the GIF image data as an {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image | Image} object
      *
      * Note: This method does not work outside of browser environments
      */
    getImage(): HTMLImageElement;
}

/**
 * Wav audio object. Used to create a {@link https://en.wikipedia.org/wiki/WAV | WAV} file from a PCM audio stream or a {@link Flipnote} object.
 *
 * Currently only supports PCM s16_le audio encoding.
 *
 * @category File Encoder
 */
declare class WavAudio extends EncoderBase {
    mimeType: 'audio/wav';
    /** Audio samplerate */
    sampleRate: number;
    /** Number of audio channels */
    channels: number;
    /** Number of bits per sample */
    bitsPerSample: number;
    private header;
    private pcmData;
    /**
     * Create a new WAV audio object
     * @param sampleRate audio samplerate
     * @param channels number of audio channels
     * @param bitsPerSample number of bits per sample
     */
    constructor(sampleRate: number, channels?: number, bitsPerSample?: number);
    /**
     * Create a WAV audio file from a Flipnote's master audio track
     * @param flipnote
     * @param trackId
     */
    static fromFlipnote(note: Flipnote): WavAudio;
    /**
     * Create a WAV audio file from a given Flipnote audio track
     * @param flipnote
     * @param trackId
     */
    static fromFlipnoteTrack(flipnote: Flipnote, trackId: FlipnoteAudioTrack): WavAudio;
    /**
     * Add PCM audio frames to the WAV
     * @param pcmData signed int16 PCM audio samples
     */
    writeSamples(pcmData: Int16Array): void;
    /**
     * Returns the WAV audio data as an {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}
     */
    getArrayBuffer(): ArrayBufferLike;
}

/**
 * flipnote.js library version (exported as `flipnote.version`). You can find the latest version on the project's [NPM](https://www.npmjs.com/package/flipnote.js) page.
 */
declare const version = "5.8.5";

declare const PlayerComponent_base: {
    new (...args: any[]): {
        player: Player;
        readonly renderer: UniversalCanvas;
        readonly audio: WebAudioPlayer;
        readonly canvasEl: HTMLCanvasElement;
        readonly note: FlipnoteParserBase;
        readonly noteFormat: FlipnoteFormat;
        readonly meta: FlipnoteMeta;
        readonly duration: number;
        readonly layerVisibility: Record<number, boolean>;
        autoplay: boolean;
        el: Element;
        parserSettings: Partial<KwzParserSettings>;
        supportedEvents: PlayerEvent[];
        _src: FlipnoteSource;
        _loop: boolean;
        _volume: number;
        _muted: boolean;
        _frame: number;
        _hasEnded: boolean;
        isNoteLoaded: boolean;
        events: PlayerEventMap;
        playbackStartTime: number;
        playbackTime: number;
        playbackLoopId: number;
        showThumbnail: boolean;
        hasPlaybackStarted: boolean;
        isPlaying: boolean;
        wasPlaying: boolean;
        isSeeking: boolean;
        lastParser: FlipnoteSourceParser<FlipnoteSource, FlipnoteParserBase>;
        lastLoaders: LoaderDefinitionList;
        src: FlipnoteSource;
        paused: boolean;
        currentFrame: number;
        currentTime: number;
        progress: number;
        volume: number;
        muted: boolean;
        loop: boolean;
        readonly framerate: number;
        readonly frameCount: number;
        readonly frameSpeed: number;
        readonly buffered: TimeRanges;
        readonly seekable: TimeRanges;
        readonly currentSrc: FlipnoteSource;
        readonly videoWidth: number;
        readonly videoHeight: number;
        load(source: any, getParser: FlipnoteSourceParser<FlipnoteSource, FlipnoteParserBase>, loaders?: LoaderDefinitionList): Promise<void>;
        reload(): Promise<void>;
        updateSettings(settings: Partial<KwzParserSettings>): Promise<void>;
        closeNote(): void;
        openNote(note: FlipnoteParserBase): void;
        playbackLoop: (timestamp: number) => void;
        setCurrentTime(value: number): void;
        getCurrentTime(): number;
        getTimeCounter(): string;
        getFrameCounter(): string;
        setProgress(value: number): void;
        getProgress(): number;
        play(): Promise<void>;
        pause(): void;
        togglePlay(): void;
        getPaused(): boolean;
        getDuration(): number;
        getLoop(): boolean;
        setLoop(loop: boolean): void;
        toggleLoop(): void;
        setCurrentFrame(newFrameValue: number): void;
        nextFrame(): void;
        prevFrame(): void;
        lastFrame(): void;
        firstFrame(): void;
        thumbnailFrame(): void;
        startSeek(): void;
        seek(position: number): void;
        endSeek(): void;
        drawFrame(frameIndex: number): void;
        forceUpdate(): void;
        resize(width: number, height: number): void;
        setLayerVisibility(layer: number, value: boolean): void;
        getLayerVisibility(layer: number): boolean;
        toggleLayerVisibility(layerIndex: number): void;
        playAudio(): void;
        stopAudio(): void;
        toggleAudioEq(): void;
        setAudioEq(state: boolean): void;
        mute(): void;
        unmute(): void;
        setMuted(isMute: boolean): void;
        getMuted(): boolean;
        toggleMuted(): void;
        setVolume(volume: number): void;
        getVolume(): number;
        seekToNextFrame(): void;
        fastSeek(time: number): void;
        canPlayType(mediaType: string): "" | "probably" | "maybe";
        getVideoPlaybackQuality(): VideoPlaybackQuality;
        requestPictureInPicture(): void;
        captureStream(): void;
        onplay: () => void;
        onpause: () => void;
        oncanplay: () => void;
        oncanplaythrough: () => void;
        onseeking: () => void;
        onseeked: () => void;
        ondurationchange: () => void;
        onloop: () => void;
        onended: () => void;
        onvolumechane: (volume: number) => void;
        onprogress: (progress: number) => void;
        ontimeupdate: (time: number) => void;
        onframeupdate: (frameIndex: number) => void;
        onframenext: () => void;
        onframeprev: () => void;
        onframefirst: () => void;
        onframelast: () => void;
        onready: () => void;
        onload: () => void;
        onloadstart: () => void;
        onloadeddata: () => void;
        onloadedmetadata: () => void;
        onemptied: () => void;
        onclose: () => void;
        onerror: (err?: Error) => void;
        ondestroy: () => void;
        on(eventType: PlayerEvent | PlayerEvent[], listener: Function): void;
        off(eventType: PlayerEvent | PlayerEvent[], callback: Function): void;
        emit(eventType: PlayerEvent, ...args: any): void;
        clearEvents(): void;
        destroy(): Promise<void>;
        supports(name: string): boolean;
        assertNoteLoaded(): void;
    };
} & typeof LitElement;
/**
 * @category Web Component
 * @internal
 */
declare class PlayerComponent$1 extends PlayerComponent_base {
    static get styles(): lit_element.CSSResult;
    controls: string;
    dsiLibrary: boolean;
    cropBorder: boolean;
    bgmPredictor: number;
    bgmStepIndex: number;
    sePredictors: string;
    seStepIndices: string;
    get width(): number | string;
    set width(value: number | string);
    get src(): any;
    set src(src: any);
    get autoplay(): boolean;
    set autoplay(value: boolean);
    private _width;
    private _cssWidth;
    private _progress;
    private _counter;
    private _isLoading;
    private _isError;
    private _isPlaying;
    private _isMuted;
    private _volumeLevel;
    private playerCanvasWrapper;
    private _isPlayerAvailable;
    private _playerSrc;
    private _resizeObserver;
    constructor();
    /** @internal */
    render(): lit_element.TemplateResult;
    /** @internal */
    renderControls(): lit_element.TemplateResult;
    /** @internal */
    firstUpdated(changedProperties: PropertyValues): void;
    /** @internal */
    disconnectedCallback(): void;
    private updateSettingsFromProps;
    private parseListProp;
    private updateCanvasSize;
    private handleResize;
    private handleKeyInput;
    private handlePlayToggle;
    private handleMuteToggle;
    private handleProgressSliderChange;
    private handleProgressSliderInputStart;
    private handleProgressSliderInputEnd;
    private handleVolumeBarChange;
}

/** @internal */
declare type SliderOrientation = 'horizontal' | 'vertical';
/**
 * @category Web Component
 * @internal
 */
declare class SliderComponent extends LitElement {
    static get styles(): lit_element.CSSResult;
    value: number;
    orientation: SliderOrientation;
    private isActive;
    private sliderElement;
    render(): lit_element.TemplateResult;
    onSliderMouseStart: (event: MouseEvent) => void;
    onSliderMouseEnd: (event: MouseEvent) => void;
    onSliderMouseMove: (event: MouseEvent) => void;
    onSliderTouchStart: (event: TouchEvent) => void;
    onSliderTouchEnd: (event: TouchEvent) => void;
    onSliderTouchMove: (event: TouchEvent) => void;
    onSliderInput: (x: number, y: number) => void;
    private dispatch;
}

/**
 * Flipnote player icon component
 *
 * @category Web Component
 * @internal
 */
declare class IconComponent extends LitElement {
    static get styles(): lit_element.CSSResult;
    /**
     * Available icons:
     * - `play`
     * - `pause`
     * - `loader`
     * - `volumeOn`
     * - `volumeOff`
     */
    icon: string;
    /** @internal */
    render(): lit_element.TemplateResult;
}

/**
 * Flipnote player icon component
 *
 * @category Web Component
 * @internal
 */
declare class ImageComponent$1 extends LitElement {
    static get styles(): lit_element.CSSResult;
    gif: GifImage;
    note: Flipnote;
    private _src;
    private _frame;
    set src(src: any);
    get src(): any;
    set frame(frame: string);
    get frame(): string;
    cropped: boolean;
    private gifUrl;
    private imgTitle;
    /** @internal */
    render(): lit_element.TemplateResult;
    private revokeUrl;
    loadNote(note: Flipnote): void;
    load(src: any): void;
    disconnectedCallback(): void;
    private dispatchLoad;
    private dispatchError;
}

/** @internal */
declare global {
    /**
     * Maps web component HTML tag names to their component classes
     */
    interface HTMLElementTagNameMap {
        'flipnote-player': PlayerComponent$1;
        'flipnote-player-slider': SliderComponent;
        'flipnote-player-icon': IconComponent;
        'flipnote-image': ImageComponent$1;
    }
}

/** @internal */
declare const PlayerComponent: typeof PlayerComponent$1;
/** @internal */
declare const ImageComponent: typeof ImageComponent$1;

export { CanvasInterface, Flipnote, FlipnoteAudioTrack, FlipnoteAudioTrackInfo, FlipnoteFormat, FlipnoteLayerVisibility, FlipnoteMeta, FlipnotePaletteColor, FlipnotePaletteDefinition, FlipnoteParserSettings, FlipnoteRegion, FlipnoteSoundEffectFlags, FlipnoteSoundEffectTrack, FlipnoteSource, FlipnoteSourceParser, FlipnoteVersion, GifImage, Html5Canvas, ImageComponent, KwzParser, KwzParserSettings, LoaderDefinition, LoaderDefinitionList, LoaderReject, LoaderResolve, Player, PlayerComponent, PlayerEvent, PlayerMixin, PpmParser, PpmParserSettings, UniversalCanvas, WavAudio, WebAudioPlayer, WebglCanvas, loadSource, parseSource, fsid_d as utils, version };
