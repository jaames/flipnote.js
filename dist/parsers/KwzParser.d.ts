import { FlipnoteFormat, FlipnoteAudioTrack, FlipnoteParserBase } from './FlipnoteParserBase';
/**
 * KWZ section types
 * @internal
 */
export declare type KwzSectionMagic = 'KFH' | 'KTN' | 'KMC' | 'KMI' | 'KSN' | 'ICO';
/**
 * KWZ section map, tracking their offset and length
 * @internal
 */
export declare type KwzSectionMap = {
    [k in KwzSectionMagic]?: {
        offset: number;
        length: number;
    };
};
/**
 * KWZ file metadata, stores information about its playback, author details, etc
 */
export interface KwzMeta {
    /** Flipnote lock state. Locked Flipnotes cannot be edited by anyone other than the current author */
    lock: boolean;
    /** Playback loop state. If `true`, playback will loop once the end is reached */
    loop: boolean;
    /** Total number of animation frames */
    frame_count: number;
    /** In-app animation playback speed, range 0 to 10 */
    frame_speed: number;
    /** Index of the animation frame used as the Flipnote's thumbnail image */
    thumb_index: number;
    /** Date representing when the file was last edited */
    timestamp: Date;
    /** Date representing when the file was created */
    creation_timestamp: Date;
    /** Metadata about the author of the original Flipnote file */
    root: {
        filename: string;
        username: string;
        fsid: string;
    };
    /** Metadata about the previous author of the Flipnote file */
    parent: {
        filename: string;
        username: string;
        fsid: string;
    };
    /** Metadata about the current author of the Flipnote file */
    current: {
        filename: string;
        username: string;
        fsid: string;
    };
}
/**
 * KWZ frame metadata, stores information about each frame, like layer depths sound effect usage
 */
export interface KwzFrameMeta {
    /** Frame flags */
    flags: number[];
    /** Frame layer sizes */
    layerSize: number[];
    /** Frame author's Flipnote Studio ID */
    frameAuthor: string;
    /** Frame layer 3D depths */
    layerDepth: number[];
    /** Frame sound */
    soundFlags: number;
    /** Whether this frame contains photos taken with the console's camera */
    cameraFlag: number;
}
/**
 * KWZ parser options for enabling optimisations and other extra features
 */
export interface KwzParserSettings {
    /** Skip full metadata parsing for quickness */
    quickMeta?: boolean;
    /** apply special cases for dsi gallery notes */
    dsiGalleryNote?: boolean;
}
/**
 * Parser class for Flipnote Studio 3D's KWZ animation format
 *
 * Format docs: https://github.com/Flipnote-Collective/flipnote-studio-3d-docs/wiki/KWZ-Format
 * @category File Parser
 */
export declare class KwzParser extends FlipnoteParserBase<KwzMeta> {
    /** Default KWZ parser settings */
    static defaultSettings: KwzParserSettings;
    /** File format type */
    static format: FlipnoteFormat.KWZ;
    /** Animation frame width */
    static width: number;
    /** Animation frame height */
    static height: number;
    /** Audio track base sample rate */
    static rawSampleRate: number;
    /** Audio output sample rate. NOTE: probably isn't accurate, full KWZ audio stack is still on the todo */
    static sampleRate: number;
    /** Global animation frame color palette */
    static globalPalette: import("./FlipnoteParserBase").FlipnotePaletteColor[];
    /** File format type, reflects {@link KwzParser.format} */
    format: FlipnoteFormat.KWZ;
    /** Animation frame width, reflects {@link KwzParser.width} */
    width: number;
    /** Animation frame height, reflects {@link KwzParser.height} */
    height: number;
    /** Audio track base sample rate, reflects {@link KwzParser.rawSampleRate} */
    rawSampleRate: number;
    /** Audio output sample rate, reflects {@link KwzParser.sampleRate} */
    sampleRate: number;
    /** Global animation frame color palette, reflects {@link KwzParser.globalPalette} */
    globalPalette: import("./FlipnoteParserBase").FlipnotePaletteColor[];
    /** File metadata, see {@link KwzMeta} for structure */
    meta: KwzMeta;
    private settings;
    private sections;
    private layers;
    private prevFrameIndex;
    private frameMeta;
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
    getFramePalette(frameIndex: number): import("./FlipnoteParserBase").FlipnotePaletteColor[];
    private getFrameDiffingFlag;
    private getFrameLayerSizes;
    private getFrameLayerDepths;
    private getFrameAuthor;
    private getFrameSoundFlags;
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
     * Get the pixels for a given frame layer
     * @category Image
    */
    getLayerPixels(frameIndex: number, layerIndex: number): Uint8Array;
    /**
     * Get the pixels for a given frame
     * @category Image
    */
    getFramePixels(frameIndex: number): Uint8Array;
    /**
     * Get the sound effect flags for every frame in the Flipnote
     * @category Audio
    */
    decodeSoundFlags(): boolean[][];
    /**
     * Get the raw compressed audio data for a given track
     * @returns Byte array
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
    /**
     * Get the full mixed audio for the Flipnote, using the specified samplerate
     * @returns Signed 16-bit PCM audio
     * @category Audio
    */
    getAudioMasterPcm(dstFreq?: number): Int16Array;
}
