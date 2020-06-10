export declare class WavEncoder {
    sampleRate: number;
    channels: number;
    bitsPerSample: number;
    private header;
    private pcmData;
    constructor(sampleRate: number, channels?: number, bitsPerSample?: number);
    writeFrames(pcmData: Int16Array): void;
    getBlob(): Blob;
}
