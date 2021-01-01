import { parseSource, FlipnoteSource, Flipnote, FlipnoteFormat, FlipnoteMeta } from '../parsers';
import { PlayerEvent, PlayerEventMap, supportedEvents } from './PlayerEvent';
import { WebglRenderer } from '../webgl';
import { WebAudioPlayer } from '../webaudio';
import { createTimeRanges, padNumber, formatTime } from './playerUtils';
import { assert, assertRange, assertBrowserEnv } from '../utils';

type PlayerLayerVisibility = Record<number, boolean>;

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
export class Player {

  /** Frame renderer */
  public renderer: WebglRenderer;
  /** Audio player */
  public audio: WebAudioPlayer;
  /** Canvas HTML element */
  public canvasEl: HTMLCanvasElement;
  /** Currently loaded Flipnote */
  public note: Flipnote;
  /** Format of the currently loaded Flipnote */
  public noteFormat: FlipnoteFormat;
  /** Metadata for the currently loaded Flipnote */
  public meta: FlipnoteMeta;
  /** Animation duration, in seconds */
  public duration: number = 0;
  /** Animation layer visibility */
  public layerVisibility: PlayerLayerVisibility;
  /** Automatically begin playback after a Flipnote is loaded */
  public autoplay: boolean = false;
  /** Array of events supported by this player */
  public supportedEvents = supportedEvents;

  /** @internal */
  public _src: FlipnoteSource = null;
  /** @internal */
  public _loop: boolean = false;
  /** @internal */
  public _volume: number = 1;
  /** @internal */
  public _muted: boolean = false;
  /** @internal */
  public _frame: number = null;
  /** @internal */
  public isNoteLoaded: boolean = false;
  /** @internal */
  public events: PlayerEventMap = new Map();
  /** @internal */
  public playbackStartTime: number = 0;
  /** @internal */
  public playbackTime: number = 0;
  /** @internal */
  public playbackLoopId: number = null;
  /** @internal */
  public showThumbnail: boolean = true;
  /** @internal */
  public hasPlaybackStarted: boolean = false;
  /** @internal */
  public isPlaying: boolean = false;
  /** @internal */
  public wasPlaying: boolean = false;
  /** @internal */
  public isSeeking: boolean = false;

  /**
   * Create a new Player instance
   * 
   * @param el - Canvas element (or CSS selector matching a canvas element) to use as a rendering surface
   * @param width - Canvas width (pixels)
   * @param height - Canvas height (pixels)
   * 
   * The ratio between `width` and `height` should be 3:4 for best results
   */
  constructor(el: string | HTMLCanvasElement, width: number, height: number) {
    assertBrowserEnv();
    // if `el` is a string, use it to select an Element, else assume it's an element
    el = ('string' == typeof el) ? <HTMLCanvasElement>document.querySelector(el) : el;
    this.renderer = new WebglRenderer(el, width, height, {
      onlost: () => this.emit(PlayerEvent.Error),
      onrestored: () => this.load()
    });
    this.audio = new WebAudioPlayer();
    this.canvasEl = this.renderer.el;
  }

  /** The currently loaded Flipnote source, if there is one. Can be overridden to load another Flipnote */
  get src() {
    return this._src;
  }
  set src(source: FlipnoteSource) {
    this.load(source);
  }

  /** Indicates whether playback is currently paused */
  get paused() {
    return !this.isPlaying;
  }
  set paused(isPaused: boolean) {
    if (isPaused)
      this.pause();
    else
      this.play();
  }

  /** Current animation frame index */
  get currentFrame() {
    return this._frame;
  }
  set currentFrame(frameIndex: number) {
    this.setCurrentFrame(frameIndex);
  }

  /** Current animation playback position, in seconds */
  get currentTime() {
    return this.isNoteLoaded ? this.playbackTime : null;
  }
  set currentTime(value) {
    this.setCurrentTime(value);
  }

  /** Current animation playback progress, as a percentage out of 100 */
  get progress() {
    return this.isNoteLoaded ? (this.playbackTime / this.duration) * 100 : null;
  }
  set progress(value) {
    this.setProgress(value);
  }

  /** Audio volume, range `0` to `1` */
  get volume() {
    return this.getVolume();
  }

  set volume(value) {
    this.setVolume(value);
  }

  /** Audio mute state */
  get muted() {
    return this.getMuted();
  }

  set muted(value: boolean) {
    this.setMuted(value);
  }

  /** Indicates whether playback should loop once the end is reached */
  get loop() {
    return this.getLoop();
  }

  set loop(value: boolean) {
    this.setLoop(value);
  }

  /** Animation frame rate, measured in frames per second */
  get framerate() {
    return this.note.framerate;
  }

  /** Animation frame count */
  get frameCount() {
    return this.note.frameCount;
  }

  /** Animation frame speed */
  get frameSpeed() {
    return this.note.frameSpeed;
  }

  /**
   * Implementation of the `HTMLMediaElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered | buffered } property
   * @category HTMLVideoElement compatibility
   */
  get buffered() {
    return createTimeRanges([[0, this.duration]]);
  }

  /**
   * Implementation of the `HTMLMediaElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seekable | seekable} property
   * @category HTMLVideoElement compatibility
   */
  get seekable() {
    return createTimeRanges([[0, this.duration]]);
  }

  /**
   * Implementation of the `HTMLMediaElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentSrc | currentSrc} property
   * @category HTMLVideoElement compatibility
   */
  get currentSrc() {
    return this._src;
  }

  /**
   * Implementation of the `HTMLVideoElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoWidth | videoWidth} property
   * @category HTMLVideoElement compatibility
   */
  get videoWidth() {
    return this.isNoteLoaded ? this.note.width : 0;
  }

  /**
   * Implementation of the `HTMLVideoElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoHeight | videoHeight} property
   * @category HTMLVideoElement compatibility
   */
  get videoHeight() {
    return this.isNoteLoaded ? this.note.height : 0;
  }

  /** 
   * Open a Flipnote from a source
   * @category Lifecycle
   */
  public async load(source: any = null) {
    // close currently open note first
    if (this.isNoteLoaded) 
      this.closeNote();
    // if no source specified, just reset everything
    if (!source)
      return this.openNote(this.note);
    // otherwise do a normal load
    this.emit(PlayerEvent.LoadStart);
    return parseSource(source)
      .then((note: Flipnote) => {
        this.openNote(note);
        this._src = source;
      })
      .catch((err: any) => {
        this.emit(PlayerEvent.Error, err);
        throw new Error(`Error loading Flipnote: ${ err.message }`);
      });
  }

  /** 
   * Close the currently loaded Flipnote
   * @category Lifecycle
   */
  public closeNote() {
    this.pause();
    this.note = null;
    this.isNoteLoaded = false;
    this.meta = null;
    this._src = null;
    this._frame = 0;
    // this.playbackFrame = null;
    this.playbackTime = 0;
    this.duration = 0;
    this.loop = false;
    this.isPlaying = false;
    this.wasPlaying = false;
    this.hasPlaybackStarted = false;
    this.showThumbnail = true;
    this.renderer.clearFrameBuffer([0,0,0,0]);
  }

  /** 
   * Open a Flipnote into the player
   * @category Lifecycle
   */
  public openNote(note: Flipnote) {
    if (this.isNoteLoaded)
      this.closeNote();
    this.note = note;
    this.meta = note.meta;
    this.emit(PlayerEvent.LoadedMeta);
    this.noteFormat = note.format;
    this.duration = note.duration;
    this.playbackTime = 0;
    this._frame = 0;
    this.isNoteLoaded = true;
    this.isPlaying = false;
    this.wasPlaying = false;
    this.hasPlaybackStarted = false;
    this.layerVisibility = note.layerVisibility;
    this.showThumbnail = true;
    this.audio.setBuffer(note.getAudioMasterPcm(), note.sampleRate);
    this.emit(PlayerEvent.CanPlay);
    this.emit(PlayerEvent.CanPlayThrough);
    this.setLoop(note.meta.loop);
    this.renderer.setInputSize(note.width, note.height);
    this.drawFrame(note.thumbFrameIndex);
    this.emit(PlayerEvent.LoadedData);
    this.emit(PlayerEvent.Load);
    this.emit(PlayerEvent.Ready);
    if (this.autoplay)
      this.play();
  }

  /**
   * Playback animation loop
   * @internal
   * @category Playback Control 
   */
  public playbackLoop = (timestamp: DOMHighResTimeStamp) => {
    if (!this.isPlaying)
      return;
    const now = timestamp / 1000;
    const currPlaybackTime = now - this.playbackStartTime;
    if (currPlaybackTime >= this.duration) {
      if (this.loop) {
        this.playbackStartTime = now;
        this.emit(PlayerEvent.Loop);
      }
      else {
        this.pause();
        this.emit(PlayerEvent.Ended);
      }
    }
    this.setCurrentTime(currPlaybackTime % this.duration);
    this.playbackLoopId = requestAnimationFrame(this.playbackLoop);
  }

  /**
   * Set the current playback time
   * @category Playback Control 
   */
  public setCurrentTime(value: number) {
    this.assertNoteLoaded();
    const i = Math.floor(value / (1 / this.framerate));
    this.setCurrentFrame(i);
    this.playbackTime = value;
    this.emit(PlayerEvent.Progress, this.progress);
  }

  /**
   * Get the current playback time
   * @category Playback Control 
   */
  public getCurrentTime() {
    return this.currentTime;
  }

  /**
   * Get the current time as a counter string, like `"0:00 / 1:00"`
   * @category Playback Control
   */
  public getTimeCounter() {
    const currentTime = formatTime(Math.max(this.currentTime, 0));
    const duration = formatTime(this.duration);
    return `${ currentTime } / ${ duration }`;
  }

  /**
   * Get the current frame index as a counter string, like `"001 / 999"`
   * @category Playback Control
   */
  public getFrameCounter() {
    const frame = padNumber(this.currentFrame + 1, 3);
    const total = padNumber(this.frameCount, 3);
    return `${ frame } / ${ total }`;
  }

  /**
   * Set the current playback progress as a percentage (`0` to `100`)
   * @category Playback Control
   */
  public setProgress(value: number) {
    this.assertNoteLoaded();
    assertRange(value, 0, 100, 'progress');
    this.currentTime = this.duration * (value / 100);
  }

  /**
   * Get the current playback progress as a percentage (0 to 100)
   * @category Playback Control 
   */
  public getProgress() {
    return this.progress;
  }

  /** 
   * Begin animation playback starting at the current position
   * @category Playback Control 
   */
  public async play() {
    this.assertNoteLoaded();
    if (this.isPlaying)
      return;
    // if ((!this.hasPlaybackStarted) || ((!this.loop) && (this.currentFrame == this.frameCount - 1)))
    //   this.playbackTime = 0;
    this.isPlaying = true;
    this.hasPlaybackStarted = true;
    const now = performance.now();
    this.playbackStartTime = (now / 1000) - this.playbackTime;
    this.playAudio();
    this.playbackLoop(now);
    this.emit(PlayerEvent.Play);
  }

  /** 
   * Pause animation playback at the current position
   * @category Playback Control 
   */
  public pause() {
    if (!this.isPlaying)
      return;
    this.isPlaying = false;
    if (this.playbackLoopId !== null) 
      cancelAnimationFrame(this.playbackLoopId);
    this.stopAudio();
    this.emit(PlayerEvent.Pause);
  }

  /** 
   * Resumes animation playback if paused, otherwise pauses
   * @category Playback Control 
   */
  public togglePlay() {
    if (!this.isPlaying)
      this.play();
    else
      this.pause();
  }

  /** 
   * Determines if playback is currently paused
   * @category Playback Control 
   */
  public getPaused() {
    return !this.isPlaying;
  }

  /** 
   * Get the duration of the Flipnote in seconds
   * @category Playback Control 
   */
  public getDuration() {
    return this.duration;
  }

  /** 
   * Determines if playback is looped
   * @category Playback Control 
   */
  public getLoop() {
    return this._loop;
  }

  /** 
   * Set the playback loop
   * @category Playback Control 
   */
  public setLoop(loop: boolean) {
    this._loop = loop;
    this.audio.loop = loop;
  }

  /** 
   * Switch the playback loop between on and off
   * @category Playback Control 
   */
  public toggleLoop() {
    this.setLoop(!this._loop);
  }

  /** 
   * Jump to a given animation frame
   * @category Frame Control 
   */
  public setCurrentFrame(newFrameValue: number) {
    this.assertNoteLoaded();
    const newFrameIndex = Math.max(0, Math.min(Math.floor(newFrameValue), this.frameCount - 1));
    if (newFrameIndex === this.currentFrame && !this.showThumbnail)
      return;
    this._frame = newFrameIndex;
    this.drawFrame(newFrameIndex);
    this.showThumbnail = false;
    if (!this.isPlaying) {
      this.playbackTime = newFrameIndex * (1 / this.framerate);
      this.emit(PlayerEvent.SeekEnd);
    } 
    this.emit(PlayerEvent.FrameUpdate, this.currentFrame);
    this.emit(PlayerEvent.Progress, this.progress);
    this.emit(PlayerEvent.TimeUpdate, this.currentFrame);
  }

  /** 
   * Jump to the next animation frame
   * If the animation loops, and is currently on its last frame, it will wrap to the first frame
   * @category Frame Control 
   */
  public nextFrame() {
    if ((this.loop) && (this.currentFrame === this.frameCount -1))
      this.currentFrame = 0;
    else
      this.currentFrame += 1;
    this.emit(PlayerEvent.FrameNext);
  }

  /** 
   * Jump to the next animation frame
   * If the animation loops, and is currently on its first frame, it will wrap to the last frame
   * @category Frame Control 
   */
  public prevFrame() {
    if ((this.loop) && (this.currentFrame === 0))
      this.currentFrame = this.frameCount - 1;
    else
      this.currentFrame -= 1;
    this.emit(PlayerEvent.FramePrev);
  }

  /** 
   * Jump to the last animation frame
   * @category Frame Control 
   */
  public lastFrame() {
    this.currentFrame = this.frameCount - 1;
    this.emit(PlayerEvent.FrameLast);
  }

  /** 
   * Jump to the first animation frame
   * @category Frame Control 
   */
  public firstFrame() {
    this.currentFrame = 0;
    this.emit(PlayerEvent.FrameFirst);
  }

  /** 
   * Jump to the thumbnail frame
   * @category Frame Control 
   */
  public thumbnailFrame() {
    this.currentFrame = this.note.thumbFrameIndex;
  }

  /** 
   * Begins a seek operation
   * @category Playback Control 
   */
  public startSeek() {
    if (!this.isSeeking) {
      this.emit(PlayerEvent.SeekStart);
      this.wasPlaying = this.isPlaying;
      this.pause();
      this.isSeeking = true;
    }
  }

  /** 
   * Seek the playback progress to a different position
   * @param position - animation playback position, range `0` to `1`
   * @category Playback Control 
   */
  public seek(position: number) {
    if (this.isSeeking)
      this.progress = position * 100;
  }

  /** 
   * Ends a seek operation
   * @category Playback Control 
   */
  public endSeek() {
    if (this.isSeeking && this.wasPlaying === true)
      this.play();
    this.wasPlaying = false;
    this.isSeeking = false;
  }

  /**
   * Draws the specified animation frame to the canvas. Note that this doesn't update the playback time or anything, it simply decodes a given frame and displays it.
   * @param frameIndex 
   * @category Display Control 
   */
  public drawFrame(frameIndex: number) {
    const note = this.note;
    const canvas = this.renderer;
    const colors = note.getFramePalette(frameIndex);
    const layerBuffers = note.decodeFrame(frameIndex);
    const layerVisibility = this.layerVisibility;
    // this.canvas.setPaperColor(colors[0]);
    canvas.setPalette(colors);
    canvas.clearFrameBuffer(colors[0]);
    if (note.format === FlipnoteFormat.PPM) {
      if (layerVisibility[2]) // bottom
        canvas.drawPixels(layerBuffers[1], 1);
      if (layerVisibility[1]) // top
        canvas.drawPixels(layerBuffers[0], 0);
    } 
    else if (note.format === FlipnoteFormat.KWZ) {
      const order = note.getFrameLayerOrder(frameIndex)
      const layerIndexC = order[0];
      const layerIndexB = order[1];
      const layerIndexA = order[2];
      if (layerVisibility[layerIndexC + 1]) // bottom
        canvas.drawPixels(layerBuffers[layerIndexC], layerIndexC * 2);
      if (layerVisibility[layerIndexB + 1]) // middle
        canvas.drawPixels(layerBuffers[layerIndexB], layerIndexB * 2);
      if (layerVisibility[layerIndexA + 1]) // top
        canvas.drawPixels(layerBuffers[layerIndexA], layerIndexA * 2);
    }
    canvas.composite();
  }

  /**
   * Forces the current animation frame to be redrawn
   * @category Display Control 
   */
  public forceUpdate() {
    if (this.isNoteLoaded)
      this.drawFrame(this.currentFrame);
  }

  /**
   * Resize the playback canvas to a new size
   * @param width - new canvas width (pixels)
   * @param height - new canvas height (pixels)
   * 
   * The ratio between `width` and `height` should be 3:4 for best results
   * 
   * @category Display Control 
   */
  public resize(width: number, height: number) {
    if (height !== width * .75)
      console.warn(`Canvas width to height ratio should be 3:4 for best results (got ${width}x${height})`);
    this.renderer.setCanvasSize(width, height);
    this.forceUpdate();
  }

  /**
   * Sets whether an animation layer should be visible throughout the entire animation
   * @param layer - layer index, starting at 1
   * @param value - `true` for visible, `false` for invisible
   * 
   * @category Display Control 
   */
  public setLayerVisibility(layer: number, value: boolean) {
    this.layerVisibility[layer] = value;
    this.forceUpdate();
  }

  /**
   * Returns the visibility state for a given layer
   * @param layer - layer index, starting at 1
   * 
   * @category Display Control
   */
  public getLayerVisibility(layer: number) {
    return this.layerVisibility[layer];
  }

  /**
   * Toggles whether an animation layer should be visible throughout the entire animation
   * 
   * @category Display Control 
   */
  public toggleLayerVisibility(layerIndex: number) {
    this.setLayerVisibility(layerIndex, !this.layerVisibility[layerIndex]);
  }

  public playAudio() {
    this.audio.playFrom(this.currentTime);
  }

  public stopAudio() {
    this.audio.stop();
  }

  /** 
   * Toggle audio Sudomemo equalizer filter
   * @category Audio Control
   */
  public toggleAudioEq() {
    this.setAudioEq(!this.audio.useEq);
  }

  /** 
   * Turn audio Sudomemo equalizer filter on or off
   * @category Audio Control
   */
  public setAudioEq(state: boolean) {
    if (this.isPlaying) {
      this.wasPlaying = true;
      this.stopAudio();
    }
    this.audio.useEq = state;
    if (this.wasPlaying) {
      this.wasPlaying = false;
      this.playAudio();
    }
  }

  /**
   * Turn the audio off
   * @category Audio Control
   */
  public mute() {
    this.setMuted(true);
  }

  /**
   * Turn the audio on
   * @category Audio Control
   */
  public unmute() {
    this.setMuted(false);
  }

  /**
   * Turn the audio on or off
   * @category Audio Control
   */
  public setMuted(isMute: boolean) {
    if (isMute)
      this.audio.volume = 0;
    else
      this.audio.volume = this._volume;
    this._muted = isMute;
    this.emit(PlayerEvent.VolumeChange, this.audio.volume);
  }

  /**
   * Get the audio mute state
   * @category Audio Control
   */
  public getMuted() {
    return this.volume === 0 ? true : this._muted;
  }

  /** 
   * Switch the audio between muted and unmuted
   * @category Audio Control
   */
  public toggleMuted() {
    this.setMuted(!this._muted);
  }

  /**
   * Set the audio volume
   * @category Audio Control
   */
  public setVolume(volume: number) {
    assertRange(volume, 0, 1, 'volume');
    this._volume = volume;
    this.audio.volume = volume;
    this.emit(PlayerEvent.VolumeChange, this.audio.volume);
  }

  /**
   * Get the current audio volume
   * @category Audio Control
   */
  public getVolume() {
    return this._muted ? 0 : this._volume;
  }

  /**
   * Implementation of the `HTMLVideoElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/seekToNextFrame | seekToNextFrame} method
   * @category HTMLVideoElement compatibility
   */
  public seekToNextFrame() {
    this.nextFrame();
  }

  /**
   * Implementation of the `HTMLMediaElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/fastSeek | fastSeek} method
   * @category HTMLVideoElement compatibility
   */
  public fastSeek(time: number) {
    this.currentTime = time;
  }

  /**
   * Implementation of the `HTMLVideoElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/getVideoPlaybackQuality | getVideoPlaybackQuality } method
   * @category HTMLVideoElement compatibility
   */
  public canPlayType(mediaType: string) {
    switch (mediaType) {
      case 'application/x-ppm':
      case 'application/x-kwz':
      case 'video/x-ppm':
      case 'video/x-kwz':
      // lauren is planning on registering these officially
      case 'video/vnd.nintendo.ugomemo.ppm':
      case 'video/vnd.nintendo.ugomemo.kwz':
        return 'probably';
      case 'application/octet-stream':
        return 'maybe';
      // and koizumi is planning his revenge
      case 'video/vnd.nintendo.ugomemo.fykt':
      default:
        return '';
    }
  }

  /**
   * Implementation of the `HTMLVideoElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/getVideoPlaybackQuality](getVideoPlaybackQuality) method
   * @category HTMLVideoElement compatibility
   */
  public getVideoPlaybackQuality() {
    const quality: VideoPlaybackQuality = {
      creationTime: 0,
      droppedVideoFrames: 0,
      totalVideoFrames: this.frameCount
    };
    return quality;
  }

  /**
   * Implementation of the `HTMLVideoElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestPictureInPicture](requestPictureInPicture) method. Not currently working, only a stub.
   * @category HTMLVideoElement compatibility
   */
  public requestPictureInPicture() {
    throw new Error('Not implemented');
  }

  /**
   * Implementation of the `HTMLVideoElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/captureStream](captureStream) method. Not currently working, only a stub.
   * @category HTMLVideoElement compatibility
   */
  public captureStream() {
    throw new Error('Not implemented');
  }


  /**
   * Fired when animation playback begins or is resumed
   * @category playback
   * @event play
   */
  public onplay: () => void;

  /**
   * Fired when animation playback is paused
   * @category playback
   * @event pause 
   */
  public onpause: () => void;

  /**
   * Fired when the Flipnote has loaded enough to begin animation play
   * @category HTMLVideoElement compatibility
   * @event canplay
   */
  public oncanplay: () => void;

  /**
   *Fired when the Flipnote has loaded enough to play successfully
   * @category HTMLVideoElement compatibility
   * @event canplaythrough
   */
  public oncanplaythrough: () => void;

  /**
   * Fired when a seek operation begins
   * @category playback
   * @event seeking
   */
  public onseeking: () => void;

  /**
   * Fired when a seek operation completes
   * @category playback
   * @event seeked
   */
  public onseeked: () => void;

  /**
   * Fired when the animation duration has changed
   * @category HTMLVideoElement compatibility
   * @event durationchange
   */
  public ondurationchange: () => void;

  /**
   * Fired when playbackc has looped after reaching the end
   * @category playback
   * @event loop
   */
  public onloop: () => void;

  /**
   * Fired when playback has ended
   * @category playback
   * @event ended
   */
  public onended: () => void;

  /**
   * Fired when the player audio volume or muted state has changed
   * @category audio
   * @event volumechange
   */
  public onvolumechane: (volume: number) => void;

  /**
   * Fired when playback progress has changed
   * @category playback
   * @event progress
   */
  public onprogress: (progress: number) => void;

  /**
   * Fired when the playback time has changed
   * @category playback
   * @event timeupdate
   */
  public ontimeupdate: (time: number) => void;

  /**
   * Fired when the current frame index has changed
   * @category frame
   * @event frameupdate
   */
  public onframeupdate: (frameIndex: number) => void;

  /**
   * Fired when {@link nextFrame} has been called
   * @category frame
   * @event framenext
   */
  public onframenext: () => void;

  /**
   * Fired when {@link prevFrame} has been called
   * @category frame
   * @event frameprev
   */
  public onframeprev: () => void;

  /**
   * Fired when {@link firstFrame} has been called
   * @category frame
   * @event framefirst
   */
  public onframefirst: () => void;

  /**
   * Fired when {@link lastFrame} has been called
   * @category frame
   * @event framelast
   */
  public onframelast: () => void;

  /**
   * Fired when a Flipnote is ready for playback
   * @category lifecycle
   * @event ready
   */
  public onready: () => void;

  /**
   * Fired when a Flipnote has finished loading
   * @category lifecycle
   * @event load
   */
  public onload: () => void;

  /**
   * Fired when a Flipnote has begun loading
   * @category lifecycle
   * @event loadstart
   */
  public onloadstart: () => void;

  /**
   * Fired when the Flipnote data has been loaded; implementation of the `HTMLMediaElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event](loadeddata) event.
   * @category HTMLVideoElement compatibility
   * @event loadeddata
   */
  public onloadeddata: () => void;

  /**
   * Fired when the Flipnote metadata has been loaded; implementation of the `HTMLMediaElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event](loadedmetadata) event.
   * @category HTMLVideoElement compatibility
   * @event loadedmetadata
   */
  public onloadedmetadata: () => void;

  /**
   * Fired when the media has become empty; implementation of the `HTMLMediaElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event](emptied) event.
   * @category HTMLVideoElement compatibility
   * @event emptied
   */
  public onemptied: () => void;

  /**
   * Fired after the Flipnote has been closed with {@link close}
   * @category lifecycle
   * @event close
   */
  public onclose: () => void;

  /**
   * Fired after a loading, parsing or playback error occurs
   * @category lifecycle
   * @event error
   */
  public onerror: (err?: Error) => void;

  /**
   * Fired just before the player has been destroyed, after calling {@link destroy}
   * @category lifecycle
   * @event destroy
   */
  public ondestroy: () => void;

  /** 
   * Add an event callback
   * @category Event API
   */
  public on(eventType: PlayerEvent | PlayerEvent[], listener: Function) {
    const events = this.events;
    const eventList = Array.isArray(eventType) ? eventType : [eventType];
    eventList.forEach(eventType => {
      if (!events.has(eventType))
        events.set(eventType, [listener]);
      else
        events.get(eventType).push(listener);
    });
  }

  /** 
   * Remove an event callback
   * @category Event API
   */
  public off(eventType: PlayerEvent | PlayerEvent[], callback: Function) {
    const events = this.events;
    const eventList = Array.isArray(eventType) ? eventType : [eventType];
    eventList.forEach(eventType => {
      if (!events.has(eventType))
        return;
      const callbackList = events.get(eventType);
      events.set(eventType, callbackList.splice(callbackList.indexOf(callback), 1));
    });
  }

  /** 
   * Emit an event - mostly used internally
   * @category Event API
   */
  public emit(eventType: PlayerEvent, ...args: any) {
    const events = this.events;
    if (eventType !== PlayerEvent.__Any && events.has(eventType)) {
      const callbackList = events.get(eventType);
      callbackList.forEach(callback => callback.apply(null, args));
      // call onwhatever() function for this event, if one has been added
      const listenerName = `on${ eventType }`;
      const thisAsAny = this as any;
      if (typeof thisAsAny[listenerName] === 'function')
        thisAsAny[listenerName].apply(null, args);
    }
    // "any" event listeners fire for all events, and receive eventType as their first param
    if (events.has(PlayerEvent.__Any)) {
      const callbackList = events.get(PlayerEvent.__Any);
      callbackList.forEach(callback => callback.apply(null, [eventType, ...args]));
    }
  }

  /** 
   * Remove all registered event callbacks
   * @category Event API
   */
  public clearEvents() {
    this.events.clear();
  }

  /** 
   * Destroy a Player instace
   * @category Lifecycle
   */
  public async destroy() {
    this.clearEvents();
    this.emit(PlayerEvent.Destroy);
    this.closeNote();
    await this.renderer.destroy();
    await this.audio.destroy();
  }

  /** 
   * Returns true if the player supports a given event or method name
   */
  public supports(name: string) {
    const isEvent = this.supportedEvents.includes(name as PlayerEvent);
    const isMethod = typeof (this as any)[name] === 'function';
    return isEvent || isMethod;
  }

  /** @internal */
  public assertNoteLoaded() {
    assert(this.isNoteLoaded, 'No Flipnote is currently loaded in this player');
  }

}