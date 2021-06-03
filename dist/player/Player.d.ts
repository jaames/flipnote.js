import { Flipnote, FlipnoteFormat, FlipnoteMeta, FlipnoteParserSettings } from '../parsers';
import { FlipnoteSource } from '../parseSource';
import { PlayerEvent, PlayerEventMap } from './PlayerEvent';
import { UniversalCanvas } from '../renderers';
import { WebAudioPlayer } from '../webaudio';
declare type PlayerLayerVisibility = Record<number, boolean>;
/**
 * Flipnote Player API (exported as `flipnote.Player`) - provides a {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement | MediaElement}-like interface for loading Flipnotes and playing them.
 * This is intended for cases where you want to implement your own player UI, if you just want a pre-built player with some nice UI controls, check out the {@page Web Components} page instead!
 *
 * ### Create a new player
 *
 * You'll need a canvas element in your page's HTML:
 *
 * ```html
 *  <canvas id="player-canvas"></canvas>
 * ```
 *
 * Then you can create a new `Player` instance by passing a CSS selector that matches the canvas, plus the disired width and height.
 *
 * ```js
 *  const player = new flipnote.Player('#player-canvas', 320, 240);
 * ```
 *
 * ### Load a Flipnote
 *
 * Load a Flipnote from a valid {@link FlipnoteSource}:
 *
 * ```js
 * player.load('./path/to/flipnote.ppm');
 * ```
 *
 * ### Listen to events
 *
 * Use the {@link on} method to register event listeners:
 *
 * ```js
 *  player.on('play', function() {
 *    // do something when the Flipnote starts playing...
 *  });
 * ```
 */
export declare class Player {
    /** Frame renderer */
    renderer: UniversalCanvas;
    /** Audio player */
    audio: WebAudioPlayer;
    /** Canvas HTML element */
    canvasEl: HTMLCanvasElement;
    /** Currently loaded Flipnote */
    note: Flipnote;
    /** Flipnote parser settings */
    parserSettings: FlipnoteParserSettings;
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
     * @param parent - Element to mount the rendering canvas to
     * @param width - Canvas width (pixels)
     * @param height - Canvas height (pixels)
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     */
    constructor(parent: string | Element, width: number, height: number, parserSettings?: FlipnoteParserSettings);
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
     * Reload the current Flipnote
     */
    reload(): Promise<void>;
    /**
     * Reload the current Flipnote
     */
    updateSettings(settings: FlipnoteParserSettings): Promise<void>;
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
     * @internal
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
     * Get the current time as a counter string, like `"0:00 / 1:00"`
     * @category Playback Control
     */
    getTimeCounter(): string;
    /**
     * Get the current frame index as a counter string, like `"001 / 999"`
     * @category Playback Control
     */
    getFrameCounter(): string;
    /**
     * Set the current playback progress as a percentage (`0` to `100`)
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
     * Fired when animation playback begins or is resumed
     * @category playback
     * @event play
     */
    onplay: () => void;
    /**
     * Fired when animation playback is paused
     * @category playback
     * @event pause
     */
    onpause: () => void;
    /**
     * Fired when the Flipnote has loaded enough to begin animation play
     * @category HTMLVideoElement compatibility
     * @event canplay
     */
    oncanplay: () => void;
    /**
     *Fired when the Flipnote has loaded enough to play successfully
     * @category HTMLVideoElement compatibility
     * @event canplaythrough
     */
    oncanplaythrough: () => void;
    /**
     * Fired when a seek operation begins
     * @category playback
     * @event seeking
     */
    onseeking: () => void;
    /**
     * Fired when a seek operation completes
     * @category playback
     * @event seeked
     */
    onseeked: () => void;
    /**
     * Fired when the animation duration has changed
     * @category HTMLVideoElement compatibility
     * @event durationchange
     */
    ondurationchange: () => void;
    /**
     * Fired when playbackc has looped after reaching the end
     * @category playback
     * @event loop
     */
    onloop: () => void;
    /**
     * Fired when playback has ended
     * @category playback
     * @event ended
     */
    onended: () => void;
    /**
     * Fired when the player audio volume or muted state has changed
     * @category audio
     * @event volumechange
     */
    onvolumechane: (volume: number) => void;
    /**
     * Fired when playback progress has changed
     * @category playback
     * @event progress
     */
    onprogress: (progress: number) => void;
    /**
     * Fired when the playback time has changed
     * @category playback
     * @event timeupdate
     */
    ontimeupdate: (time: number) => void;
    /**
     * Fired when the current frame index has changed
     * @category frame
     * @event frameupdate
     */
    onframeupdate: (frameIndex: number) => void;
    /**
     * Fired when {@link nextFrame} has been called
     * @category frame
     * @event framenext
     */
    onframenext: () => void;
    /**
     * Fired when {@link prevFrame} has been called
     * @category frame
     * @event frameprev
     */
    onframeprev: () => void;
    /**
     * Fired when {@link firstFrame} has been called
     * @category frame
     * @event framefirst
     */
    onframefirst: () => void;
    /**
     * Fired when {@link lastFrame} has been called
     * @category frame
     * @event framelast
     */
    onframelast: () => void;
    /**
     * Fired when a Flipnote is ready for playback
     * @category lifecycle
     * @event ready
     */
    onready: () => void;
    /**
     * Fired when a Flipnote has finished loading
     * @category lifecycle
     * @event load
     */
    onload: () => void;
    /**
     * Fired when a Flipnote has begun loading
     * @category lifecycle
     * @event loadstart
     */
    onloadstart: () => void;
    /**
     * Fired when the Flipnote data has been loaded; implementation of the `HTMLMediaElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event](loadeddata) event.
     * @category HTMLVideoElement compatibility
     * @event loadeddata
     */
    onloadeddata: () => void;
    /**
     * Fired when the Flipnote metadata has been loaded; implementation of the `HTMLMediaElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event](loadedmetadata) event.
     * @category HTMLVideoElement compatibility
     * @event loadedmetadata
     */
    onloadedmetadata: () => void;
    /**
     * Fired when the media has become empty; implementation of the `HTMLMediaElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event](emptied) event.
     * @category HTMLVideoElement compatibility
     * @event emptied
     */
    onemptied: () => void;
    /**
     * Fired after the Flipnote has been closed with {@link close}
     * @category lifecycle
     * @event close
     */
    onclose: () => void;
    /**
     * Fired after a loading, parsing or playback error occurs
     * @category lifecycle
     * @event error
     */
    onerror: (err?: Error) => void;
    /**
     * Fired just before the player has been destroyed, after calling {@link destroy}
     * @category lifecycle
     * @event destroy
     */
    ondestroy: () => void;
    /**
     * Add an event callback
     * @category Event API
     */
    on(eventType: PlayerEvent | PlayerEvent[], listener: Function): void;
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
