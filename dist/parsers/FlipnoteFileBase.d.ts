import { DataStream } from '../utils/index';
export declare type FlipnotePaletteColor = [number, number, number, number];
export declare type FlipnotePaletteDefinition = {
    [key in any]?: FlipnotePaletteColor;
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
export declare abstract class FlipnoteFileBase extends DataStream {
    static type: string;
    static sampleRate: number;
    static width: number;
    static height: number;
    static globalPalette: FlipnotePaletteColor[];
    type: string;
    width: number;
    height: number;
    palette: FlipnotePaletteDefinition;
    globalPalette: FlipnotePaletteColor[];
    meta: any;
    soundMeta: FlipnoteAudioTrackInfo;
    frameCount: number;
    frameSpeed: number;
    bgmSpeed: number;
    framerate: number;
    bgmrate: number;
    rawSampleRate: number;
    sampleRate: number;
    thumbFrameIndex: number;
    abstract decodeFrame(frameIndex: number): Uint8Array[];
    abstract getLayerPixels(frameIndex: number, layerIndex: number): Uint8Array;
    abstract getFrameLayerOrder(frameIndex: number): number[];
    abstract getFramePixels(frameIndex: number): Uint8Array;
    abstract getFramePaletteIndices(frameIndex: number): number[];
    abstract getFramePalette(frameIndex: number): FlipnotePaletteColor[];
    abstract decodeSoundFlags(): boolean[][];
    abstract getAudioTrackRaw(trackId: FlipnoteAudioTrack): Uint8Array;
    abstract decodeAudioTrack(trackId: FlipnoteAudioTrack): Int16Array;
    abstract getAudioTrackPcm(trackId: FlipnoteAudioTrack, sampleRate?: number): Int16Array;
    abstract getAudioMasterPcm(sampleRate?: number): Int16Array;
    hasAudioTrack(trackId: FlipnoteAudioTrack): boolean;
}
