import { DataStream } from '../utils/index';
export declare type PaletteColor = [number, number, number];
export declare type PaletteDefinition = {
    [key in any]?: PaletteColor;
};
export declare enum FlipnoteAudioTrack {
    BGM = 0,
    SE1 = 1,
    SE2 = 2,
    SE3 = 3,
    SE4 = 4
}
export declare type FlipnoteAudioTrackInfo = {
    [key in FlipnoteAudioTrack]?: {
        offset: number;
        length: number;
    };
};
export declare abstract class FlipnoteParserBase extends DataStream {
    static type: string;
    static sampleRate: number;
    static width: number;
    static height: number;
    static globalPalette: PaletteColor[];
    type: string;
    width: number;
    height: number;
    palette: PaletteDefinition;
    globalPalette: PaletteColor[];
    meta: any;
    soundMeta: FlipnoteAudioTrackInfo;
    frameCount: number;
    frameSpeed: number;
    bgmSpeed: number;
    framerate: number;
    bgmrate: number;
    sampleRate: number;
    thumbFrameIndex: number;
    abstract decodeFrame(frameIndex: number): Uint8Array[];
    abstract getLayerPixels(frameIndex: number, layerIndex: number): Uint8Array | Uint16Array;
    abstract getLayerOrder(frameIndex: number): number[];
    abstract getFramePixels(frameIndex: number): Uint8Array;
    abstract getFramePaletteIndices(frameIndex: number): number[];
    abstract getFramePalette(frameIndex: number): PaletteColor[];
    abstract decodeAudio(trackId: FlipnoteAudioTrack): Int16Array;
    abstract decodeSoundFlags(): number[][];
    hasAudioTrack(trackId: FlipnoteAudioTrack): boolean;
    getInt16AudioData(trackId: FlipnoteAudioTrack): Int16Array;
    getFloat32AudioData(trackId: FlipnoteAudioTrack): Float32Array;
}
