import { Flipnote, FlipnoteAudioTrack } from '../parsers/index';
export declare class WavEncoder {
    sampleRate: number;
    channels: number;
    bitsPerSample: number;
    private header;
    private pcmData;
    constructor(sampleRate: number, channels?: number, bitsPerSample?: number);
    static fromFlipnote(note: Flipnote): WavEncoder;
    static fromFlipnoteTrack(note: Flipnote, trackId: FlipnoteAudioTrack): WavEncoder;
    writeFrames(pcmData: Int16Array): void;
    getBlob(): Blob;
}
