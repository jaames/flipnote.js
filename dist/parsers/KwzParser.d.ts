import { FlipnoteFormat, FlipnoteAudioTrack, FlipnoteSoundEffectTrack, FlipnoteSoundEffectFlags, FlipnoteMeta, FlipnoteParserBase } from './FlipnoteParserBase';
/**
 * KWZ section types
 * @internal
 */
export declare type KwzSectionMagic = 'KFH' | 'KTN' | 'KMC' | 'KMI' | 'KSN' | 'KIC';
/**
 * KWZ section map, tracking their offset and length
 * @internal
 */
export declare type KwzSectionMap = Map<KwzSectionMagic, {
    ptr: number;
    length: number;
}>;
/**
 * KWZ file metadata, stores information about its playback, author details, etc
 */
export interface KwzMeta extends FlipnoteMeta {
    /** Date representing when the file was created */
    creationTimestamp: Date;
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
export declare type KwzParserSettings = {
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
export declare class KwzParser extends FlipnoteParserBase {
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
    static globalPalette: import("./FlipnoteParserBase").FlipnotePaletteColor[];
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
    globalPalette: import("./FlipnoteParserBase").FlipnotePaletteColor[];
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
    getFramePalette(frameIndex: number): import("./FlipnoteParserBase").FlipnotePaletteColor[];
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
