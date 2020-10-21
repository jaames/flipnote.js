import { Flipnote, FlipnoteFormat, FlipnoteMeta } from '../parsers';
import { WavAudio, GifImage, GifEncoderSettings } from '../encoders';
import { WebglCanvas } from '../webglRenderer';
import { WebAudioPlayer } from '../webaudio';
interface PlayerLayerVisibility {
    [key: number]: boolean;
}
/** @internal */
interface PlayerState {
    noteType: 'PPM' | 'KWZ';
    isNoteOpen: boolean;
    hasPlaybackStarted: boolean;
    paused: boolean;
    frame: number;
    time: number;
    loop: boolean;
    volume: number;
    muted: boolean;
    layerVisibility: PlayerLayerVisibility;
    isSeeking: boolean;
    wasPlaying: boolean;
}
/** flipnote player API, based on HTMLMediaElement (https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) */
export declare class Player {
    canvas: WebglCanvas;
    audio: WebAudioPlayer;
    el: HTMLCanvasElement;
    noteFormat: FlipnoteFormat;
    noteFormatString: string;
    note: Flipnote;
    meta: FlipnoteMeta;
    loop: boolean;
    paused: boolean;
    duration: number;
    layerVisibility: PlayerLayerVisibility;
    static defaultState: PlayerState;
    state: PlayerState;
    private isOpen;
    private customPalette;
    private events;
    private _lastTick;
    private _frame;
    private _time;
    private hasPlaybackStarted;
    private wasPlaying;
    private isSeeking;
    constructor(el: string | HTMLCanvasElement, width: number, height: number);
    get currentFrame(): number;
    set currentFrame(frameIndex: number);
    get currentTime(): number;
    set currentTime(value: number);
    get progress(): number;
    set progress(value: number);
    get volume(): number;
    set volume(value: number);
    get muted(): boolean;
    set muted(value: boolean);
    get framerate(): number;
    get frameCount(): number;
    get frameSpeed(): number;
    private setState;
    /**
     * Open a Flipnote from a source
     * @category Lifecycle
     */
    open(source: any): Promise<void>;
    /**
     * Close the currently loaded Flipnote
     * @category Lifecycle
     */
    close(): void;
    /**
     * Load a Flipnote into the player
     * @category Lifecycle
     */
    load(note: Flipnote): void;
    private playAudio;
    private stopAudio;
    /**
     * Toggle audio equalizer filter
     * @category Audio Control
     */
    toggleEq(): void;
    /**
     * Toggle audio mute
     * MUTE NOT CURRENTLY IMPLEMENTED
     * @category Audio Control
     */
    toggleMute(): void;
    private playbackLoop;
    /**
     * Begin playback starting at the current position
     * @category Playback Control
     */
    play(): void;
    /**
     * Pause playback starting at the current position
     * @category Playback Control
     */
    pause(): void;
    /**
     * Resumes playback if paused, otherwise pauses
     * @category Playback Control
     */
    togglePlay(): void;
    /**
     * Jump to a given Flipnote frame
     * @category Frame Control
     */
    setFrame(frameIndex: number): void;
    /**
     * Jump to the next Flipnote frame
     * If the Flipnote loops, and is currently on its last frame, it will wrap to the first frame
     * @category Frame Control
     */
    nextFrame(): void;
    /**
     * Jump to the next Flipnote frame
     * If the Flipnote loops, and is currently on its first frame, it will wrap to the last frame
     * @category Frame Control
     */
    prevFrame(): void;
    /**
     * Jump to the last Flipnote frame
     * @category Frame Control
     */
    lastFrame(): void;
    /**
     * Jump to the first Flipnote frame
     * @category Frame Control
     */
    firstFrame(): void;
    /**
     * Jump to the thumbnail frame
     * @category Frame Control
     */
    thumbnailFrame(): void;
    /**
     * Begins a seek operation
     * @category Playback Control
     */
    startSeek(): void;
    /**
     * Seek the playback progress to a different position
     * @category Playback Control
     */
    seek(progress: number): void;
    /**
     * Ends a seek operation
     * @category Playback Control
     */
    endSeek(): void;
    /**
     * Returns the Flipnote's master audio as a WavEncoder object
     * @category Quick Export
     */
    getMasterWav(): WavAudio;
    /**
     * Saves the Flipnote's master audio as a WAV file
     * @category Quick Export
     */
    saveMasterWav(): void;
    /**
     * Returns a Flipnote frame as a GifEncoder object
     * @category Quick Export
     */
    getFrameGif(frameIndex: number, meta?: Partial<GifEncoderSettings>): GifImage;
    /**
     * Saves a Flipnote frame as a GIF file
     * @category Quick Export
     */
    saveFrameGif(frameIndex: number, meta?: Partial<GifEncoderSettings>): void;
    /**
     * Returns the full Flipnote as an animated GifEncoder object
     * @category Quick Export
     */
    getAnimatedGif(meta?: Partial<GifEncoderSettings>): GifImage;
    /**
     * Saves the full Flipnote as an animated GIF file
     * @category Quick Export
     */
    saveAnimatedGif(meta?: Partial<GifEncoderSettings>): void;
    drawFrame(frameIndex: number): void;
    forceUpdate(): void;
    resize(width: number, height: number): void;
    setLayerVisibility(layerIndex: number, value: boolean): void;
    toggleLayerVisibility(layerIndex: number): void;
    /**
     * Add an event callback
     * @category Event API
     */
    on(eventType: string, callback: Function): void;
    /**
     * Remove an event callback
     * @category Event API
     */
    off(eventType: string, callback: Function): void;
    /**
     * Emit an event - mostly used internally
     * @category Event API
     */
    emit(eventType: string, ...args: any): void;
    /**
     * Remove all registered event callbacks
     * @category Event API
     */
    clearEvents(): void;
    /**
     * Destroy a Player instace
     * @category Lifecycle
     */
    destroy(): void;
}
export {};
