import { DataStream } from '../utils/index';
/** Identifies which animation format a Flipnote uses */
export declare enum FlipnoteFormat {
    /** Animation format used by Flipnote Studio (Nintendo DSiWare) */
    PPM = 0,
    /** Animation format used by Flipnote Studio 3D (Nintendo 3DS) */
    KWZ = 1
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
number];
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
/**
 * Contains data about a given audio track; it's file offset and length
 */
export declare type FlipnoteAudioTrackInfo = {
    [key in FlipnoteAudioTrack]?: {
        offset: number;
        length: number;
    };
};
/**
 * Flipnote layer visibility
 */
export declare type FlipnoteLayerVisibility = {
    1: boolean;
    2: boolean;
    3: boolean;
};
/**
 * Base Flipnote parser class
 *
 * This doesn't implement any parsing functionality itself,
 * it just provides a consistent API for every format parser to implement.
 * @category File Parser
*/
export declare abstract class FlipnoteParserBase<Meta> extends DataStream {
    /** File format type */
    static format: FlipnoteFormat;
    /** Animation frame width */
    static width: number;
    /** Animation frame height */
    static height: number;
    /** Number of animation frame layers */
    static numLayers: number;
    /** Audio track base sample rate */
    static rawSampleRate: number;
    /** Audio output sample rate */
    static sampleRate: number;
    /** Global animation frame color palette */
    static globalPalette: FlipnotePaletteColor[];
    /** File format type, reflects {@link FlipnoteParserBase.format} */
    format: FlipnoteFormat;
    /** Flipnote Format as a string */
    formatString: string;
    /** Animation frame width, reflects {@link FlipnoteParserBase.width} */
    width: number;
    /** Animation frame height, reflects {@link FlipnoteParserBase.height} */
    height: number;
    /** Number of animation frame layers, reflects {@link FlipnoteParserBase.numLayers} */
    numLayers: number;
    /** Audio track base sample rate, reflects {@link FlipnoteParserBase.rawSampleRate} */
    rawSampleRate: number;
    /** Audio output sample rate, reflects {@link FlipnoteParserBase.sampleRate} */
    sampleRate: number;
    /** Global animation frame color palette, reflects {@link FlipnoteParserBase.globalPalette} */
    globalPalette: FlipnotePaletteColor[];
    /** Flipnote palette */
    palette: FlipnotePaletteDefinition;
    /** File metadata, see {@link FlipnoteMeta} for structure */
    meta: Meta;
    /** File audio track info, see {@link FlipnoteAudioTrackInfo} */
    soundMeta: FlipnoteAudioTrackInfo;
    /** Animation frame global layer visibility */
    layerVisibility: FlipnoteLayerVisibility;
    /** Animation frame count */
    frameCount: number;
    /** In-app animation playback speed */
    frameSpeed: number;
    /** In-app animation playback speed when the BGM track was recorded */
    bgmSpeed: number;
    /** Animation framerate, measured as frames per second */
    framerate: number;
    /** Animation framerate when the BGM track was recorded, measured as frames per second */
    bgmrate: number;
    /** Index of the animation frame used as the Flipnote's thumbnail image */
    thumbFrameIndex: number;
    /**
     * Decode a frame, returning the raw pixel buffers for each layer
     * @category Image
    */
    abstract decodeFrame(frameIndex: number): Uint8Array[];
    /**
     * Get the pixels for a given frame layer
     * @category Image
    */
    abstract getLayerPixels(frameIndex: number, layerIndex: number): Uint8Array;
    /**
     * Get the layer draw order for a given frame
     * @category Image
    */
    abstract getFrameLayerOrder(frameIndex: number): number[];
    /**
     * Get the pixels for a given frame
     * @category Image
    */
    abstract getFramePixels(frameIndex: number): Uint8Array;
    /**
     * Get the color palette indices for a given frame. RGBA colors for these values can be indexed from {@link FlipnoteParserBase.globalPalette}
     * @category Image
    */
    abstract getFramePaletteIndices(frameIndex: number): number[];
    /**
     * Get the RGBA color for a given frame
     * @category Image
    */
    abstract getFramePalette(frameIndex: number): FlipnotePaletteColor[];
    /**
     * Get the sound effect flags for every frame in the Flipnote
     * @category Audio
    */
    abstract decodeSoundFlags(): boolean[][];
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
     * Does an audio track exist in the Flipnote?
     * @category Audio
    */
    hasAudioTrack(trackId: FlipnoteAudioTrack): boolean;
}
