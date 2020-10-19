export declare type PcmAudioBuffer = Int16Array | Float32Array;
export declare class WebAudioPlayer {
    ctx: BaseAudioContext;
    sampleRate: number;
    useEq: boolean;
    eqSettings: [number, number][];
    private _volume;
    private buffer;
    private gainNode;
    private source;
    constructor();
    set volume(value: number);
    get volume(): number;
    setSamples(sampleData: PcmAudioBuffer, sampleRate: number): void;
    private connectEqNodesTo;
    private initNodes;
    setVolume(value: number): void;
    stop(): void;
    playFrom(currentTime: number): void;
}
