import { FlipnoteSource, Flipnote, FlipnoteFormat, FlipnoteMeta } from '../parsers';
import { PlayerEvent, PlayerEventMap } from './PlayerEvent';
import { WebglRenderer } from '../webgl';
import { WebAudioPlayer } from '../webaudio';
declare type PlayerLayerVisibility = Record<number, boolean>;
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
    canvasEl: HTMLCanvasElement;
    /** Currently loaded Flipnote */
    note: Flipnote;
    /** Format of the currently loaded Flipnote */
    noteFormat: FlipnoteFormat;
    /** Metadata for the currently loaded Flipnote */
    meta: FlipnoteMeta;
    /** Animation duration, in seconds */
    duration: number;
    /** Animation layer visibility */
    layerVisibility: PlayerLayerVisibility;
    /** Automatically begin playback after a Flipnote is loaded */
    autoplay: boolean;
    /** Array of events supported by this player */
    supportedEvents: PlayerEvent[];
    /** @internal */
    _src: FlipnoteSource;
    /** @internal */
    _loop: boolean;
    /** @internal */
    _volume: number;
    /** @internal */
    _muted: boolean;
    /** @internal */
    _frame: number;
    /** @internal */
    isNoteLoaded: boolean;
    /** @internal */
    events: PlayerEventMap;
    /** @internal */
    playbackStartTime: number;
    /** @internal */
    playbackTime: number;
    /** @internal */
    playbackLoopId: number;
    /** @internal */
    showThumbnail: boolean;
    /** @internal */
    hasPlaybackStarted: boolean;
    /** @internal */
    isPlaying: boolean;
    /** @internal */
    wasPlaying: boolean;
    /** @internal */
    isSeeking: boolean;
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
    /** The currently loaded Flipnote source, if there is one. Can be overridden to load another Flipnote */
    get src(): FlipnoteSource;
    set src(source: FlipnoteSource);
    /** Indicates whether playback is currently paused */
    get paused(): boolean;
    set paused(isPaused: boolean);
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
    /** Audio mute state */
    get muted(): boolean;
    set muted(value: boolean);
    /** Indicates whether playback should loop once the end is reached */
    get loop(): boolean;
    set loop(value: boolean);
    /** Animation frame rate, measured in frames per second */
    get framerate(): number;
    /** Animation frame count */
    get frameCount(): number;
    /** Animation frame speed */
    get frameSpeed(): number;
    /**
     * Implementation of the `HTMLMediaElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered | buffered } property
     * @category HTMLVideoElement compatibility
     */
    get buffered(): TimeRanges;
    /**
     * Implementation of the `HTMLMediaElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seekable | seekable} property
     * @category HTMLVideoElement compatibility
     */
    get seekable(): TimeRanges;
    /**
     * Implementation of the `HTMLMediaElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentSrc | currentSrc} property
     * @category HTMLVideoElement compatibility
     */
    get currentSrc(): FlipnoteSource;
    /**
     * Implementation of the `HTMLVideoElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoWidth | videoWidth} property
     * @category HTMLVideoElement compatibility
     */
    get videoWidth(): number;
    /**
     * Implementation of the `HTMLVideoElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoHeight | videoHeight} property
     * @category HTMLVideoElement compatibility
     */
    get videoHeight(): number;
    /**
     * Open a Flipnote from a source
     * @category Lifecycle
     */
    load(source?: any): Promise<void>;
    /**
     * Close the currently loaded Flipnote
     * @category Lifecycle
     */
    closeNote(): void;
    /**
     * Open a Flipnote into the player
     * @category Lifecycle
     */
    openNote(note: Flipnote): void;
    /**
     * Playback animation loop
     * @public
     * @category Playback Control
     */
    playbackLoop: (timestamp: DOMHighResTimeStamp) => void;
    /**
     * Set the current playback time
     * @category Playback Control
     */
    setCurrentTime(value: number): void;
    /**
     * Get the current playback time
     * @category Playback Control
     */
    getCurrentTime(): number;
    /**
     * Get the current time as a counter string, like `0:00 / 1:00`
     * @category Playback Control
     */
    getTimeCounter(): string;
    /**
     * Get the current frame index as a counter string, like `001/999`
     * @category Playback Control
     */
    getFrameCounter(): string;
    /**
     * Set the current playback progress as a percentage (0 to 100)
     * @category Playback Control
     */
    setProgress(value: number): void;
    /**
     * Get the current playback progress as a percentage (0 to 100)
     * @category Playback Control
     */
    getProgress(): number;
    /**
     * Begin animation playback starting at the current position
     * @category Playback Control
     */
    play(): Promise<void>;
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
     * Determines if playback is currently paused
     * @category Playback Control
     */
    getPaused(): boolean;
    /**
     * Get the duration of the Flipnote in seconds
     * @category Playback Control
     */
    getDuration(): number;
    /**
     * Determines if playback is looped
     * @category Playback Control
     */
    getLoop(): boolean;
    /**
     * Set the playback loop
     * @category Playback Control
     */
    setLoop(loop: boolean): void;
    /**
     * Switch the playback loop between on and off
     * @category Playback Control
     */
    toggleLoop(): void;
    /**
     * Jump to a given animation frame
     * @category Frame Control
     */
    setCurrentFrame(newFrameValue: number): void;
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
     * @param position - animation playback position, range `0` to `1`
     * @category Playback Control
     */
    seek(position: number): void;
    /**
     * Ends a seek operation
     * @category Playback Control
     */
    endSeek(): void;
    /**
     * Draws the specified animation frame to the canvas. Note that this doesn't update the playback time or anything, it simply decodes a given frame and displays it.
     * @param frameIndex
     * @category Display Control
     */
    drawFrame(frameIndex: number): void;
    /**
     * Forces the current animation frame to be redrawn
     * @category Display Control
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
     * Returns the visibility state for a given layer
     * @param layer - layer index, starting at 1
     *
     * @category Display Control
     */
    getLayerVisibility(layer: number): boolean;
    /**
     * Toggles whether an animation layer should be visible throughout the entire animation
     *
     * @category Display Control
     */
    toggleLayerVisibility(layerIndex: number): void;
    playAudio(): void;
    stopAudio(): void;
    /**
     * Toggle audio Sudomemo equalizer filter
     * @category Audio Control
     */
    toggleAudioEq(): void;
    /**
     * Turn audio Sudomemo equalizer filter on or off
     * @category Audio Control
     */
    setAudioEq(state: boolean): void;
    /**
     * Turn the audio off
     * @category Audio Control
     */
    mute(): void;
    /**
     * Turn the audio on
     * @category Audio Control
     */
    unmute(): void;
    /**
     * Turn the audio on or off
     * @category Audio Control
     */
    setMuted(isMute: boolean): void;
    /**
     * Get the audio mute state
     * @category Audio Control
     */
    getMuted(): boolean;
    /**
     * Switch the audio between muted and unmuted
     * @category Audio Control
     */
    toggleMuted(): void;
    /**
     * Set the audio volume
     * @category Audio Control
     */
    setVolume(volume: number): void;
    /**
     * Get the current audio volume
     * @category Audio Control
     */
    getVolume(): number;
    /**
     * Implementation of the `HTMLVideoElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/seekToNextFrame | seekToNextFrame} method
     * @category HTMLVideoElement compatibility
     */
    seekToNextFrame(): void;
    /**
     * Implementation of the `HTMLMediaElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/fastSeek | fastSeek} method
     * @category HTMLVideoElement compatibility
     */
    fastSeek(time: number): void;
    /**
     * Implementation of the `HTMLVideoElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/getVideoPlaybackQuality | getVideoPlaybackQuality } method
     * @category HTMLVideoElement compatibility
     */
    canPlayType(mediaType: string): "" | "probably" | "maybe";
    /**
     * Implementation of the `HTMLVideoElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/getVideoPlaybackQuality](getVideoPlaybackQuality) method
     * @category HTMLVideoElement compatibility
     */
    getVideoPlaybackQuality(): VideoPlaybackQuality;
    /**
     * Implementation of the `HTMLVideoElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestPictureInPicture](requestPictureInPicture) method. Not currently working, only a stub.
     * @category HTMLVideoElement compatibility
     */
    requestPictureInPicture(): void;
    /**
     * Implementation of the `HTMLVideoElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/captureStream](captureStream) method. Not currently working, only a stub.
     * @category HTMLVideoElement compatibility
     */
    captureStream(): void;
    /**
     * Add an event callback
     * @category Event API
     */
    on(eventType: PlayerEvent | PlayerEvent[], callback: Function): void;
    /**
     * Remove an event callback
     * @category Event API
     */
    off(eventType: PlayerEvent | PlayerEvent[], callback: Function): void;
    /**
     * Emit an event - mostly used internally
     * @category Event API
     */
    emit(eventType: PlayerEvent, ...args: any): void;
    /**
     * Remove all registered event callbacks
     * @category Event API
     */
    clearEvents(): void;
    /**
     * Destroy a Player instace
     * @category Lifecycle
     */
    destroy(): Promise<void>;
    /**
     * Returns true if the player supports a given event or method name
     */
    supports(name: string): boolean;
    /** @internal */
    assertNoteLoaded(): void;
}
export {};
