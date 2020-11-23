import { Flipnote, FlipnoteFormat, FlipnoteMeta } from '../parsers';
import { WavAudio, GifImage, GifImageSettings } from '../encoders';
import { WebglRenderer } from '../webgl';
import { WebAudioPlayer } from '../webaudio';
declare type PlayerLayerVisibility = Record<number, boolean>;
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
/**
 * Flipnote Player API (exported as `flipnote.Player`)
 *
 * This loads and plays Flipnotes in a web browser, taking a lot of inspiration from the {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement | MediaElement} API
 *
 * Note: playback is only available in browser contexts for the time being
 */
export declare class Player {
    /** Rendering canvas */
    canvas: WebglRenderer;
    /** Audio player */
    audio: WebAudioPlayer;
    /** Canvas HTML element */
    el: HTMLCanvasElement;
    /** Currently loaded Flipnote */
    note: Flipnote;
    /** Format of the currently loaded Flipnote */
    noteFormat: FlipnoteFormat;
    /** Format of the currently loaded Flipnote, as a string (`'PPM'` or `'KWZ'`) */
    noteFormatString: string;
    /** Metadata for the currently loaded Flipnote */
    meta: FlipnoteMeta;
    /** Indicates whether playback should loop once the end is reached */
    loop: boolean;
    /** Indicates whether playback is currently paused */
    paused: boolean;
    /** Animation duration, in seconds */
    duration: number;
    /** Animation layer visibility */
    layerVisibility: PlayerLayerVisibility;
    /** @internal (not implemented yet) */
    static defaultState: PlayerState;
    /** @internal (not implemented yet) */
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
    /**
     * Create a new Player instance
     *
     * @param el - Canvas element (or CSS selector matching a canvas element) to use as a rendering surface
     * @param width - Canvas width (pixels)
     * @param height - Canvas height (pixels)
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     */
    constructor(el: string | HTMLCanvasElement, width: number, height: number);
    /** Current animation frame index */
    get currentFrame(): number;
    set currentFrame(frameIndex: number);
    /** Current animation playback position, in seconds */
    get currentTime(): number;
    set currentTime(value: number);
    /** Current animation playback progress, as a percentage out of 100 */
    get progress(): number;
    set progress(value: number);
    /** Audio volume, range `0` to `1` */
    get volume(): number;
    set volume(value: number);
    /**
     * Audio mute state
     * TODO: implement
     * @internal
    */
    get muted(): boolean;
    set muted(value: boolean);
    /** Animation frame rate, measured in frames per second */
    get framerate(): number;
    /** Animation frame count */
    get frameCount(): number;
    /** Animation frame speed */
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
     * TODO: MUTE NOT CURRENTLY IMPLEMENTED
     * @internal
     * @category Audio Control
     */
    toggleMute(): void;
    private playbackLoop;
    /**
     * Begin animation playback starting at the current position
     * @category Playback Control
     */
    play(): void;
    /**
     * Pause animation playback at the current position
     * @category Playback Control
     */
    pause(): void;
    /**
     * Resumes animation playback if paused, otherwise pauses
     * @category Playback Control
     */
    togglePlay(): void;
    /**
     * Jump to a given animation frame
     * @category Frame Control
     */
    setFrame(frameIndex: number): void;
    /**
     * Jump to the next animation frame
     * If the animation loops, and is currently on its last frame, it will wrap to the first frame
     * @category Frame Control
     */
    nextFrame(): void;
    /**
     * Jump to the next animation frame
     * If the animation loops, and is currently on its first frame, it will wrap to the last frame
     * @category Frame Control
     */
    prevFrame(): void;
    /**
     * Jump to the last animation frame
     * @category Frame Control
     */
    lastFrame(): void;
    /**
     * Jump to the first animation frame
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
     * Returns the master audio as a {@link WavAudio} object
     * @category Quick Export
     */
    getMasterWav(): WavAudio;
    /**
     * Saves the master audio track as a WAV file
     * @category Quick Export
     */
    saveMasterWav(): void;
    /**
     * Returns an animation frame as a {@link GifImage} object
     * @category Quick Export
     */
    getFrameGif(frameIndex: number, meta?: Partial<GifImageSettings>): GifImage;
    /**
     * Saves an animation frame as a GIF file
     * @category Quick Export
     */
    saveFrameGif(frameIndex: number, meta?: Partial<GifImageSettings>): void;
    /**
     * Returns the full animation as a {@link GifImage} object
     * @category Quick Export
     */
    getAnimatedGif(meta?: Partial<GifImageSettings>): GifImage;
    /**
     * Saves the full animation as a GIF file
     * @category Quick Export
     */
    saveAnimatedGif(meta?: Partial<GifImageSettings>): void;
    /**
     * Draws the specified animation frame to the canvas
     * @param frameIndex
     */
    drawFrame(frameIndex: number): void;
    /**
     * Forces the current animation frame to be redrawn
     */
    forceUpdate(): void;
    /**
     * Resize the playback canvas to a new size
     * @param width - new canvas width (pixels)
     * @param height - new canvas height (pixels)
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     *
     * @category Display Control
     */
    resize(width: number, height: number): void;
    /**
     * Sets whether an animation layer should be visible throughout the entire animation
     * @param layer - layer index, starting at 1
     * @param value - `true` for visible, `false` for invisible
     *
     * @category Display Control
     */
    setLayerVisibility(layer: number, value: boolean): void;
    /**
     * Toggles whether an animation layer should be visible throughout the entire animation
     *
     * @category Display Control
     */
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
