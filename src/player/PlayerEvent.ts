/** 
 * Player event types
 */
export enum PlayerEvent {
  __Any = 'any', // special event, gets called on everything
  Play = 'play',
  Pause = 'pause',
  CanPlay = 'canplay',
  CanPlayThrough = 'canplaythrough',
  SeekStart = 'seeking',
  SeekEnd = 'seeked',
  Duration = 'durationchange',
  Loop = 'loop',
  Ended = 'ended',
  VolumeChange = 'volumechange',
  Progress = 'progress',
  TimeUpdate = 'timeupdate',
  FrameUpdate = 'frameupdate',
  FrameNext = 'framenext',
  FramePrev = 'frameprev',
  FrameFirst = 'framefirst',
  FrameLast = 'framelast',
  Ready = 'ready',
  Load = 'load',
  LoadStart = 'loadstart',
  LoadedData = 'loadeddata',
  LoadedMeta = 'loadedmetadata',
  Emptied = 'emptied',
  Close = 'close',
  Error = 'error',
  Destroy = 'destroy',
}

/** @internal */
export type PlayerEventMap = Map<PlayerEvent, Function[]>;

/** @internal */
export const supportedEvents: PlayerEvent[] = [
  PlayerEvent.Play,
  PlayerEvent.Pause,
  PlayerEvent.CanPlay,
  PlayerEvent.CanPlayThrough,
  PlayerEvent.SeekStart,
  PlayerEvent.SeekEnd,
  PlayerEvent.Duration,
  PlayerEvent.Loop,
  PlayerEvent.Ended,
  PlayerEvent.VolumeChange,
  PlayerEvent.Progress,
  PlayerEvent.TimeUpdate,
  PlayerEvent.FrameUpdate,
  PlayerEvent.FrameNext,
  PlayerEvent.FramePrev,
  PlayerEvent.FrameFirst,
  PlayerEvent.FrameLast,
  PlayerEvent.Ready,
  PlayerEvent.Load,
  PlayerEvent.LoadStart,
  PlayerEvent.LoadedData,
  PlayerEvent.LoadedMeta,
  PlayerEvent.Emptied,
  PlayerEvent.Close,
  PlayerEvent.Error,
];