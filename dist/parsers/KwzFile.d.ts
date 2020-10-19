import { FlipnoteAudioTrack, FlipnoteFileBase } from './FlipnoteFileBase';
export declare type KwzSectionMagic = 'KFH' | 'KTN' | 'KMC' | 'KMI' | 'KSN' | 'ICO';
export declare type KwzSectionMap = {
    [k in KwzSectionMagic]?: {
        offset: number;
        length: number;
    };
};
export interface KwzMeta {
    lock: boolean;
    loop: boolean;
    frame_count: number;
    frame_speed: number;
    thumb_index: number;
    timestamp: Date;
    creation_timestamp: Date;
    root: {
        filename: string;
        username: string;
        fsid: string;
    };
    parent: {
        filename: string;
        username: string;
        fsid: string;
    };
    current: {
        filename: string;
        username: string;
        fsid: string;
    };
}
export interface KwzFrameMeta {
    flags: number[];
    layerSize: number[];
    frameAuthor: string;
    layerDepth: number[];
    soundFlags: number;
    cameraFlag: number;
}
export interface KwzParserConfig {
    quickMeta?: boolean;
    dsiGalleryNote?: boolean;
}
export declare class KwzFile extends FlipnoteFileBase {
    static defaultConfig: KwzParserConfig;
    static type: string;
    static width: number;
    static height: number;
    static rawSampleRate: number;
    static sampleRate: number;
    static globalPalette: import("./FlipnoteFileBase").FlipnotePaletteColor[];
    config: KwzParserConfig;
    type: string;
    width: number;
    height: number;
    globalPalette: import("./FlipnoteFileBase").FlipnotePaletteColor[];
    rawSampleRate: number;
    sampleRate: number;
    meta: KwzMeta;
    private sections;
    private layers;
    private prevFrameIndex;
    private frameMeta;
    private frameMetaOffsets;
    private frameDataOffsets;
    private frameLayerSizes;
    private bitIndex;
    private bitValue;
    constructor(arrayBuffer: ArrayBuffer, config?: KwzParserConfig);
    load(): void;
    private readBits;
    private decodeMeta;
    private decodeMetaQuick;
    private getFrameOffsets;
    private decodeSoundHeader;
    getFramePaletteIndices(frameIndex: number): number[];
    private getFrameDiffingFlag;
    private getFrameLayerSizes;
    private getFrameLayerDepths;
    private getFrameAuthor;
    private getFrameSoundFlags;
    getFrameLayerOrder(frameIndex: number): number[];
    decodeFrame(frameIndex: number, diffingFlag?: number, isPrevFrame?: boolean): [Uint8Array, Uint8Array, Uint8Array];
    getFramePalette(frameIndex: number): import("./FlipnoteFileBase").FlipnotePaletteColor[];
    getLayerPixels(frameIndex: number, layerIndex: number): Uint8Array;
    getFramePixels(frameIndex: number): Uint8Array;
    decodeSoundFlags(): boolean[][];
    getAudioTrackRaw(trackId: FlipnoteAudioTrack): Uint8Array;
    decodeAudioTrack(trackId: FlipnoteAudioTrack): Int16Array;
    getAudioTrackPcm(trackId: FlipnoteAudioTrack, dstFreq?: number): Int16Array;
    getAudioMasterPcm(dstFreq?: number): Int16Array;
}
