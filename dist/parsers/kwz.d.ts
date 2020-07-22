import { FlipnoteAudioTrack, FlipnoteParserBase } from './parserBase';
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
    flags: number;
    layerSize: number[];
    frameAuthor: string;
    layerDepth: number[];
    soundFlags: number;
    cameraFlag: number;
}
export declare class KwzParser extends FlipnoteParserBase {
    static type: string;
    static width: number;
    static height: number;
    static sampleRate: number;
    static globalPalette: import("./parserBase").FlipnotePaletteColor[];
    type: string;
    width: number;
    height: number;
    globalPalette: import("./parserBase").FlipnotePaletteColor[];
    sampleRate: number;
    meta: KwzMeta;
    private sections;
    private layers;
    private prevDecodedFrame;
    private frameMeta;
    private frameOffsets;
    private bitIndex;
    private bitValue;
    constructor(arrayBuffer: ArrayBuffer);
    load(): void;
    private readBits;
    private decodeMeta;
    private decodeFrameMeta;
    private decodeSoundHeader;
    private getDiffingFlag;
    getLayerDepths(frameIndex: number): number[];
    getLayerOrder(frameIndex: number): number[];
    decodeFrame(frameIndex: number, diffingFlag?: number, isPrevFrame?: boolean): Uint8Array[];
    getFramePaletteIndices(frameIndex: number): number[];
    getFramePalette(frameIndex: number): import("./parserBase").FlipnotePaletteColor[];
    getLayerPixels(frameIndex: number, layerIndex: number): Uint8Array;
    getFramePixels(frameIndex: number): Uint8Array;
    decodeSoundFlags(): boolean[][];
    getAudioTrackRaw(trackId: FlipnoteAudioTrack): Uint8Array;
    decodeAudioTrack(trackId: FlipnoteAudioTrack): Int16Array;
    getAudioTrackPcm(trackId: FlipnoteAudioTrack, dstFreq?: number): Int16Array;
    getAudioMasterPcm(dstFreq?: number): Int16Array;
}
