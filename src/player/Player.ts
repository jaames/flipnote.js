import { parseSource, FlipnoteSource, Flipnote, FlipnoteFormat, FlipnoteMeta } from '../parsers';
import { PlayerEvent, PlayerEventMap, supportedEvents } from './PlayerEvent';
import { createTimeRanges } from './playerUtils';
import { WebglRenderer } from '../webgl';
import { WebAudioPlayer } from '../webaudio';

type PlayerLayerVisibility = Record<number, boolean>;

/**
 * Flipnote Player API (exported as `flipnote.Player`)
 * 
 * This loads and plays Flipnotes in a web browser, taking a lot of inspiration from the {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement | MediaElement} API
 * 
 * Note: playback is only available in browser contexts for the time being
 */
export class Player {

  /** Rendering canvas */
  public canvas: WebglRenderer;
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
    // if `el` is a string, use it to select an Element, else assume it's an element
    el = ('string' == typeof el) ? <HTMLCanvasElement>document.querySelector(el) : el;
    this.canvas = new WebglRenderer(el, width, height);
    this.audio = new WebAudioPlayer();
    this.canvasEl = this.canvas.el;
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
    return this.isNoteLoaded ? Math.floor(this.playbackTime / (1 / this.framerate)) : null;
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
    return this._volume;
  }

  set volume(value) {
    this.assertValueRange(value, 0, 1);
    this.setVolume(value);
  }

  /** Audio mute state */
  get muted() {
    return this._muted;
  }

  set muted(value: boolean) {
    this.setMuted(value);
  }

  /** Indicates whether playback should loop once the end is reached */
  get loop() {
    return this._loop;
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
  public async load(source: any) {
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
    // this.playbackFrame = null;
    this.playbackTime = 0;
    this.duration = 0;
    this.loop = false;
    this.isPlaying = false;
    this.wasPlaying = false;
    this.hasPlaybackStarted = false;
    this.showThumbnail = true;
    this.canvas.clearFrameBuffer([0,0,0,0]);
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
    this.canvas.setInputSize(note.width, note.height);
    this.drawFrame(note.thumbFrameIndex);
    this.emit(PlayerEvent.LoadedData);
    this.emit(PlayerEvent.Load);
    this.emit(PlayerEvent.Ready);
    if (this.autoplay)
      this.play();
  }

  /**
   * Playback animation loop
   * @public
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
   * Set the current playback progress as a percentage (0 to 100)
   * @category Playback Control
   */
  public setProgress(value: number) {
    this.assertNoteLoaded();
    this.assertValueRange(value, 0, 100);
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
    const canvas = this.canvas;
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
    this.canvas.resize(width, height);
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
    return this._muted;
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
    this._volume = volume;
    this.audio.volume = volume;
    this.emit(PlayerEvent.VolumeChange, this.audio.volume);
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
   * Add an event callback
   * @category Event API
   */
  public on(eventType: PlayerEvent | PlayerEvent[], callback: Function) {
    const events = this.events;
    const eventList = Array.isArray(eventType) ? eventType : [eventType];
    eventList.forEach(eventType => {
      if (!events.has(eventType))
        events.set(eventType, [callback]);
      else
        events.get(eventType).push(callback);
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
    if (events.has(eventType)) {
      const callbackList = events.get(eventType);
      callbackList.forEach(callback => callback.apply(null, args));
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
    this.closeNote();
    await this.canvas.destroy();
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
    if (!this.isNoteLoaded)
      throw new Error('No Flipnote is currently loaded in this player');
  }

  /** @internal */
  public assertValueRange(value: number, min: number, max: number) {
    if (value < min || value > max)
      throw new Error(`Value ${value} must be between ${min} and ${max}`);
  }

}