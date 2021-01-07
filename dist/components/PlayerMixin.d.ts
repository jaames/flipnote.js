import { Player } from '../player';
/** @internal */
declare type Constructor<T = {}> = new (...args: any[]) => T;
/**
 * This is a bit of a hack to get a player component class to wrap a Player instance,
 * while also inheriting all of the Player API's methods and properties.
 *
 * The resulting PlayerMixinClass will get a Player instance on this.player,
 * and all of the Player API methods and properties applied as wrappers.
 *
 * e.g.
 * - PlayerMixinClass.play() will have the same behaviour as Player.play(), but will call this.player.play() internally.
 * - PlayerMixinClass.paused will have getters and setters to match it to this.player.paused.
 * @internal
 */
export declare function PlayerMixin<TargetBase extends Constructor>(Target: TargetBase): {
    new (...args: any[]): {
        player: Player;
        readonly renderer: import("../webgl").WebglRenderer;
        readonly audio: import("../webaudio").WebAudioPlayer;
        readonly canvasEl: HTMLCanvasElement;
        readonly note: import("../parsers").FlipnoteParser;
        readonly noteFormat: import("../parsers").FlipnoteFormat;
        readonly meta: import("../parsers").FlipnoteMeta;
        readonly duration: number;
        readonly layerVisibility: Record<number, boolean>;
        autoplay: boolean;
        supportedEvents: import("../player").PlayerEvent[];
        _src: import("../parseSource").FlipnoteSource;
        _loop: boolean;
        _volume: number;
        _muted: boolean;
        _frame: number;
        isNoteLoaded: boolean;
        events: import("../player").PlayerEventMap;
        playbackStartTime: number;
        playbackTime: number;
        playbackLoopId: number;
        showThumbnail: boolean;
        hasPlaybackStarted: boolean;
        isPlaying: boolean;
        wasPlaying: boolean;
        isSeeking: boolean;
        src: import("../parseSource").FlipnoteSource;
        paused: boolean;
        currentFrame: number;
        currentTime: number;
        progress: number;
        volume: number;
        muted: boolean;
        loop: boolean;
        readonly framerate: number;
        readonly frameCount: number;
        readonly frameSpeed: number;
        readonly buffered: TimeRanges;
        readonly seekable: TimeRanges;
        readonly currentSrc: import("../parseSource").FlipnoteSource;
        readonly videoWidth: number;
        readonly videoHeight: number;
        load(source?: any): Promise<void>;
        closeNote(): void;
        openNote(note: import("../parsers").FlipnoteParser): void;
        playbackLoop: (timestamp: number) => void;
        setCurrentTime(value: number): void;
        getCurrentTime(): number;
        getTimeCounter(): string;
        getFrameCounter(): string;
        setProgress(value: number): void;
        getProgress(): number;
        play(): Promise<void>;
        pause(): void;
        togglePlay(): void;
        getPaused(): boolean;
        getDuration(): number;
        getLoop(): boolean;
        setLoop(loop: boolean): void;
        toggleLoop(): void;
        setCurrentFrame(newFrameValue: number): void;
        nextFrame(): void;
        prevFrame(): void;
        lastFrame(): void;
        firstFrame(): void;
        thumbnailFrame(): void;
        startSeek(): void;
        seek(position: number): void;
        endSeek(): void;
        drawFrame(frameIndex: number): void;
        forceUpdate(): void;
        resize(width: number, height: number): void;
        setLayerVisibility(layer: number, value: boolean): void;
        getLayerVisibility(layer: number): boolean;
        toggleLayerVisibility(layerIndex: number): void;
        playAudio(): void;
        stopAudio(): void;
        toggleAudioEq(): void;
        setAudioEq(state: boolean): void;
        mute(): void;
        unmute(): void;
        setMuted(isMute: boolean): void;
        getMuted(): boolean;
        toggleMuted(): void;
        setVolume(volume: number): void;
        getVolume(): number;
        seekToNextFrame(): void;
        fastSeek(time: number): void;
        canPlayType(mediaType: string): "probably" | "maybe" | "";
        getVideoPlaybackQuality(): VideoPlaybackQuality;
        requestPictureInPicture(): void;
        captureStream(): void;
        onplay: () => void;
        onpause: () => void;
        oncanplay: () => void;
        oncanplaythrough: () => void;
        onseeking: () => void;
        onseeked: () => void;
        ondurationchange: () => void;
        onloop: () => void;
        onended: () => void;
        onvolumechane: (volume: number) => void;
        onprogress: (progress: number) => void;
        ontimeupdate: (time: number) => void;
        onframeupdate: (frameIndex: number) => void;
        onframenext: () => void;
        onframeprev: () => void;
        onframefirst: () => void;
        onframelast: () => void;
        onready: () => void;
        onload: () => void;
        onloadstart: () => void;
        onloadeddata: () => void;
        onloadedmetadata: () => void;
        onemptied: () => void;
        onclose: () => void;
        onerror: (err?: Error) => void;
        ondestroy: () => void;
        on(eventType: import("../player").PlayerEvent | import("../player").PlayerEvent[], listener: Function): void;
        off(eventType: import("../player").PlayerEvent | import("../player").PlayerEvent[], callback: Function): void;
        emit(eventType: import("../player").PlayerEvent, ...args: any): void;
        clearEvents(): void;
        destroy(): Promise<void>;
        supports(name: string): boolean;
        assertNoteLoaded(): void;
    };
} & TargetBase;
export {};
