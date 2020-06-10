/**
 * PPM decoder
 * Reads frames, audio, and metadata from Flipnote Studio PPM files
 * Based on my Python PPM decoder implementation (https://github.com/jaames/flipnote-tools)
 *
 * Credits:
 *  PPM format reverse-engineering and documentation:
 *   - bricklife (http://ugomemo.g.hatena.ne.jp/bricklife/20090307/1236391313)
 *   - mirai-iro (http://mirai-iro.hatenablog.jp/entry/20090116/ugomemo_ppm)
 *   - harimau_tigris (http://ugomemo.g.hatena.ne.jp/harimau_tigris)
 *   - steven (http://www.dsibrew.org/wiki/User:Steven)
 *   - yellows8 (http://www.dsibrew.org/wiki/User:Yellows8)
 *   - PBSDS (https://github.com/pbsds)
 *   - jaames (https://github.com/jaames)
 *  Identifying the PPM sound codec:
 *   - Midmad from Hatena Haiku
 *   - WDLMaster from hcs64.com
 *  Helping me to identify issues with the Python decoder that this is based on:
 *   - Austin Burk (https://sudomemo.net)
 *
 *  Lastly, a huge thanks goes to Nintendo for creating Flipnote Studio,
 *  and to Hatena for providing the Flipnote Hatena online service, both of which inspired so many c:
*/
import { FlipnoteAudioTrack, FlipnoteParserBase } from './parserBase';
export interface PpmMeta {
    lock: boolean;
    loop: boolean;
    frame_count: number;
    frame_speed: number;
    bgm_speed: number;
    thumb_index: number;
    timestamp: Date;
    spinoff: boolean;
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
export declare class PpmParser extends FlipnoteParserBase {
    static type: string;
    static width: number;
    static height: number;
    static sampleRate: number;
    static globalPalette: [number, number, number][];
    type: string;
    width: number;
    height: number;
    globalPalette: [number, number, number][];
    sampleRate: number;
    meta: PpmMeta;
    version: number;
    private layers;
    private prevLayers;
    private prevDecodedFrame;
    private frameDataLength;
    private soundDataLength;
    private frameOffsets;
    constructor(arrayBuffer: ArrayBuffer);
    static validateFSID(fsid: string): boolean;
    static validateFilename(filename: string): boolean;
    private readFilename;
    private readLineEncoding;
    private decodeHeader;
    private decodeMeta;
    private decodeAnimationHeader;
    private decodeSoundHeader;
    isNewFrame(frameIndex: number): number;
    getLayerOrder(frameIndex?: number): number[];
    decodeFrame(frameIndex: number): Uint8Array[];
    getFramePaletteIndices(frameIndex: number): number[];
    getFramePalette(frameIndex: number): [number, number, number][];
    getLayerPixels(frameIndex: number, layerIndex: number): Uint8Array;
    getFramePixels(frameIndex: number): Uint8Array;
    decodeAudio(trackId: FlipnoteAudioTrack): Int16Array;
    decodeSoundFlags(): number[][];
}
