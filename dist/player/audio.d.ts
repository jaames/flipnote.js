export declare class AudioTrack {
    id: string;
    audio: HTMLAudioElement;
    playbackRate: number;
    sampleRate: number;
    length: number;
    isActive: boolean;
    private channelCount;
    private bitsPerSample;
    private url;
    constructor(id: string);
    set(pcmData: Int16Array, playbackRate: number): void;
    get duration(): number;
    unset(): void;
    start(offset?: number): void;
    stop(): void;
}
