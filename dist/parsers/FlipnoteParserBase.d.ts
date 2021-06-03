import { DataStream, FlipnoteRegion } from '../utils';
export { FlipnoteRegion } from '../utils';
/** Identifies which animation format a Flipnote uses */
export declare enum FlipnoteFormat {
    /** Animation format used by Flipnote Studio (Nintendo DSiWare) */
    PPM = "PPM",
    /** Animation format used by Flipnote Studio 3D (Nintendo 3DS) */
    KWZ = "KWZ"
}
/** RGBA color */
export declare type FlipnotePaletteColor = [
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
export declare type FlipnoteLayerVisibility = Record<number, boolean>;
/** Defines the colors used for a given Flipnote format */
export declare type FlipnotePaletteDefinition = Record<string, FlipnotePaletteColor>;
/** Identifies a Flipnote audio track type */
export declare enum FlipnoteAudioTrack {
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
export interface FlipnoteAudioTrackInfo {
    ptr: number;
    length: number;
}
/** {@link FlipnoteAudioTrack}, but just sound effect tracks */
export declare enum FlipnoteSoundEffectTrack {
    SE1 = 1,
    SE2 = 2,
    SE3 = 3,
    SE4 = 4
}
/** Flipnote sound flags, indicating which sound effect tracks are used on a given frame */
export declare type FlipnoteSoundEffectFlags = Record<FlipnoteSoundEffectTrack, boolean>;
/**
 * Flipnote version info - provides details about a particular Flipnote version and its author
 */
export interface FlipnoteVersion {
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
export interface FlipnoteMeta {
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
export declare abstract class FlipnoteParserBase extends DataStream {
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
    /** Public key used for Flipnote verification, in PEM format */
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
    /** Public key used for Flipnote verification, in PEM format */
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
