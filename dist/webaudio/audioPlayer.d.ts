export declare type PcmAudioBuffer = Int16Array | Float32Array;
export declare class WebAudioPlayer {
    ctx: BaseAudioContext;
    sampleRate: number;
    protected buffer: AudioBuffer;
    protected source: AudioBufferSourceNode;
    constructor(sampleData: PcmAudioBuffer, sampleRate: number);
    setSamples(sampleData: PcmAudioBuffer, sampleRate: number): void;
    stop(): void;
    playFrom(currentTime: number): void;
}
