/**
 * Player event types
 * @internal
 */
export declare enum PlayerEvent {
    __Any = "any",
    Play = "play",
    Pause = "pause",
    CanPlay = "canplay",
    CanPlayThrough = "canplaythrough",
    SeekStart = "seeking",
    SeekEnd = "seeked",
    Duration = "durationchange",
    Loop = "loop",
    Ended = "ended",
    VolumeChange = "volumechange",
    Progress = "progress",
    TimeUpdate = "timeupdate",
    FrameUpdate = "frameupdate",
    FrameNext = "framenext",
    FramePrev = "frameprev",
    FrameFirst = "framefirst",
    FrameLast = "framelast",
    Ready = "ready",
    Load = "load",
    LoadStart = "loadstart",
    LoadedData = "loadeddata",
    LoadedMeta = "loadedmetadata",
    Emptied = "emptied",
    Close = "close",
    Error = "error",
    Destroy = "destroy"
}
/** @internal */
export declare type PlayerEventMap = Map<PlayerEvent, Function[]>;
/** @internal */
export declare const supportedEvents: PlayerEvent[];
