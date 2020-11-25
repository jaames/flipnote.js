/** PCM audio buffer types. Supports s16_le, or float32_le with a range of -1.0 to 1.0 */
export declare type PcmAudioBuffer = Int16Array | Float32Array;
/**
 * Audio player built around the {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API | Web Audio API}
 *
 * Capable of playing PCM streams, with volume adjustment and an optional equalizer. Only available in browser contexts
 */
export declare class WebAudioPlayer {
    /** Audio context, see {@link https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext | BaseAudioContext} */
    ctx: BaseAudioContext;
    /** Audio sample rate */
    sampleRate: number;
    /** Whether the audio is being run through an equalizer or not */
    useEq: boolean;
    /** Equalizer settings. Credit to {@link https://www.sudomemo.net/ | Sudomemo} */
    eqSettings: [number, number][];
    private _volume;
    private buffer;
    private gainNode;
    private source;
    constructor();
    /** Sets the audio output volume */
    set volume(value: number);
    get volume(): number;
    /**
     * Set the audio buffer to play
     * @param inputBuffer
     * @param sampleRate - For best results, this should be a multiple of 16364
     */
    setBuffer(inputBuffer: PcmAudioBuffer, sampleRate: number): void;
    private connectEqNodesTo;
    private initNodes;
    /**
     * Sets the audio volume level
     * @param value - range is 0 to 1
     */
    setVolume(value: number): void;
    /**
     * Begin playback from a specific point
     *
     * Note that the WebAudioPlayer doesn't keep track of audio playback itself. We rely on the {@link Player} API for that.
     * @param currentTime initial playback position, in seconds
     */
    playFrom(currentTime: number): void;
    /**
     * Stops the audio playback
     */
    stop(): void;
}
