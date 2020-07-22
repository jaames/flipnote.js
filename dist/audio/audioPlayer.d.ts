export declare class WebAudioPlayer {
    ctx: BaseAudioContext;
    protected buffers: AudioBuffer[];
    protected sources: AudioBufferSourceNode[];
    constructor(...args: any[]);
    protected createContext(...args: any[]): any;
    protected initSources(): void;
    addBuffer(size: number, sampleRate: number): number;
    setBufferData(bufferId: number, data: Float32Array, timeOffset?: number): void;
    stop(): void;
    playFrom(currentTime: number): void;
}
