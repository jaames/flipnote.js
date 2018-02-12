import canvas from "webgl/canvas";
import captureCanvas from "webgl/captureCanvas";
import ppmDecoder from "decoder";
import loader from "loader";
import audioTrack from "./audio";

// internal framerate value -> FPS table
const FRAMERATES = {
  1: 0.5,
  2: 1,
  3: 2,
  4: 4,
  5: 6,
  6: 12,
  7: 20,
  8: 30,
};

/** flipnote player API, based on HTMLMediaElement (https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) */ 
export default class ppmPlayer {
  /**
  * Create new flipnote player
  * @param {string | HTMLCanvasElement} el - HTML Canvas Element to use, or CSS selector for one
  * @param {number} width - canvas width in pixels
  * @param {number} height - canvas height in pixels
  */
  constructor(el, width, height) {
    // if `el` is a string, use it to select an Element, else assume it's an element
    el = ("string" == typeof el) ? document.querySelector(el) : el;
    this.canvas = new canvas(el, width, height);
    this._imgCanvas = new captureCanvas();
    this._isOpen = false;
    this.loop = false;
    this.currentFrame = 0;
    this.paused = true;
  }

  /**
  * Get the index of the current frame 
  */
  get currentFrame() {
    return this._frame;
  }

  /**
  * Set the current frame
  */
  set currentFrame(index) {
    this.setFrame(index);
  }

  /**
  * Get current playback time in seconds
  */
  get currentTime() {
    return this._isOpen ? this.currentFrame * (1 / this.framerate) : null;
  }

  /**
  * Set current playback time in seconds
  */
  set currentTime(value) {
    if ((this._isOpen) && (value < this.duration) && (value > 0)) {
      this.setFrame(Math.round(value / (1 / this.framerate)));
      this._playbackFrameTime = 0;
    }
  }

  /**
  * Get the duration of the Flipnote in seconds
  */
  get duration() {
    return this._isOpen ? this.frameCount * (1 / this.framerate) : null;
  }

  /**
  * Get the Flipnote framerate in frames-per-second
  */
  get framerate() {
    return FRAMERATES[this.frameSpeed];
  }

  /**
  * Get the audio playback rate by comparing audio and frame speeds
  * @access protected
  */
  get _audiorate() {
    return (1 / FRAMERATES[this.ppm.bgmSpeed]) / (1 / FRAMERATES[this.frameSpeed]);
  }

  /**
  * Load a Flipnote into the player
  * @param {ArrayBuffer} buffer - ppm data
  * @access protected
  */
  _load(buffer) {
    var ppm = new ppmDecoder(buffer);
    var meta = ppm.meta;
    this.ppm = ppm;
    this.meta = meta;
    this.frameCount = ppm.frameCount;
    this.frameSpeed = ppm.frameSpeed;
    this.loop = meta.loop == 1;
    this._bgmAudio = ppm.soundMeta.bgm.length > 0 ? new audioTrack(this.ppm.decodeAudio("bgm")) : null;
    if (this._bgmAudio) this._bgmAudio.playbackRate = this._audiorate;
    this._seAudio = [
      ppm.soundMeta.se1.length > 0 ? new audioTrack(this.ppm.decodeAudio("se1")) : null,
      ppm.soundMeta.se2.length > 0 ? new audioTrack(this.ppm.decodeAudio("se2")) : null,
      ppm.soundMeta.se3.length > 0 ? new audioTrack(this.ppm.decodeAudio("se3")) : null,
    ];
    this._seFlags = this.ppm.decodeSoundFlags();
    this._isOpen = true;
    this.paused = true;
    this._playbackFrameTime = 0;
    this._lastFrameTime = 0;
    this._events = {};
    this._hasPlaybackStarted = false;
    this.setFrame(this.ppm.thumbFrameIndex);
    this.emit("load");
  }

  /**
  * Load a Flipnote into the player
  * @param {String} source - ppm url
  */
  open(source) {
    if (this._isOpen) this.close();
    loader(source)
      .then((buffer) => {
        this._load(buffer);
      })
      .catch((err) => {
        console.error("Error loading Flipnote:", err);
      });
  }

  /**
  * Close the currently loaded Flipnote and clear the player canvas
  */
  close() {
    this.ppm = null;
    this._isOpen = false;
    this.paused = true;
    this.loop = null;
    this.meta = null;
    this.frameCount = null;
    this.frameSpeed = null;
    this._frame = 0;
    this._bgmAudio = null;
    this._seAudio = new Array(3);
    this._seFlags = null;
    this._hasPlaybackStarted = null;
    this.canvas.clear();
  }

  /**
  * Play the sound effects for a given frame
  * @param {number} index - zero-based frame index
  * @access protected
  */
  _playFrameSe(index) {
    var flags = this._seFlags[index];
    for (let i = 0; i < flags.length; i++) {
      if (flags[i] && this._seAudio[i]) this._seAudio[i].start();
    }
  }

  /**
  * Play the Flipnote BGM
  * @access protected
  */
  _playBgm() {
    if (this._bgmAudio) this._bgmAudio.start(this.currentTime);
  }

  /**
  * Stop all audio tracks
  * @access protected
  */
  _stopAudio() {
    if (this._bgmAudio) this._bgmAudio.stop();
    for (let i = 0; i < this._seAudio.length; i++) {
      if (this._seAudio[i]) this._seAudio[i].stop();
    }
  }

  /**
  * Internal requestAnimationFrame handler
  * @param {number} now - current time
  * @access protected
  */
  _playbackLoop(now) {
    var dt = (now - this._lastFrameTime) / (1000 / 60);
    var frame = this.currentFrame;
    if (this._playbackFrameTime >= 60 / this.framerate) {
      this._playFrameSe(frame);
      this.nextFrame();
      this._playbackFrameTime = 0;
    }
    if (frame >= this.frameCount -1) {
      this._stopAudio();
      if (this.loop) {
        this.firstFrame();
        this._playBgm(0);
        this.emit("playback:loop");
      } else {
        this.pause();
        this.emit("playback:end");
      }
    }
    this._playbackFrameTime += dt;
    this._lastFrameTime = now;
    if (!this.paused) requestAnimationFrame(this._playbackLoop.bind(this));
  }

  /**
  * Begin Flipnote playback
  */
  play() {
    if (!this._isOpen) return null;
    this.paused = false;
    if ((!this._hasPlaybackStarted) || ((!this.loop) && (this.currentFrame == this.frameCount - 1))) this._frame = 0;
    this._lastFrameTime = performance.now();
    this._playBgm();
    this._playbackLoop(this._lastFrameTime);
    this._hasPlaybackStarted = true;
    this.emit("playback:start");
  }

  /**
  * Pause Flipnote playback
  */
  pause() {
    if (!this._isOpen) return null;
    // break the playback loop
    this.paused = true;
    if (this._bgmAudio) this._bgmAudio.stop();
    this.emit("playback:stop");
  }

  /**
  * Get a specific frame as an image data URL
  * @param {number} index - zero-based frame index
  * @param {string} type - image MIME type, default is image/png
  * @param {number} encoderOptions - number between 0 and 1 indicating image quality if type is image/jpeg or image/webp
  */
  getFrameImage(index, type, encoderOptions) {
    if (!this._isOpen) return null;
    // clamp frame index
    index = Math.max(0, Math.min(index, this.frameCount - 1));
    this._imgCanvas.setPalette(this.ppm.getFramePalette(index));
    this._imgCanvas.setBitmaps(this.ppm.decodeFrame(index));
    this._imgCanvas.refresh();
    return this._imgCanvas.toImage(type, encoderOptions);
  }

  /**
  * Get a Flipnote thumbnail as an image data URL
  * @param {string} type - image MIME type, default is image/png
  * @param {number} encoderOptions - number between 0 and 1 indicating image quality if type is image/jpeg or image/webp
  */
  getThumbImage(type, encoderOptions) {
    return this.getFrameImage(this.ppm.thumbFrameIndex, type, encoderOptions);
  }

  /**
  * Jump to a specific frame
  * @param {number} index - zero-based frame index
  */
  setFrame(index) {
    if (!this._isOpen) return null;
    // clamp frame index
    index = Math.max(0, Math.min(index, this.frameCount - 1));
    this._frame = index;
    this._playbackFrameTime = 0;
    this.canvas.setPalette(this.ppm.getFramePalette(index));
    this.canvas.setBitmaps(this.ppm.decodeFrame(index));
    this.canvas.refresh();
  }

  /**
  * Jump to the thumbnail frame
  */
  thumbnailFrame() {
    this.currentFrame = this.ppm.thumbFrameIndex;
  }

  /**
  * Jump to the next frame in the animation
  */
  nextFrame() {
    if ((this.loop) && (this.currentFrame >= this.frameCount -1)) {
      this.currentFrame = 0;
    } else {
      this.currentFrame += 1;
    }
  }

  /**
  * Jump to the previous frame in the animation
  */
  prevFrame() {
    if ((this.loop) && (this.currentFrame <= 0)) {
      this.currentFrame = this.frameCount - 1;
    } else {
      this.currentFrame -= 1;
    }
  }

  /**
  * Jump to the last frame in the animation
  */
  lastFrame() {
    this.currentFrame = this.frameCount - 1;
  }

  /**
  * Jump to the first frame in the animation
  */
  firstFrame() {
    this.currentFrame = 0;
  }

  /**
  * Resize player canvas
  * @param {number} width - canvas width in pixels
  * @param {number} height - canvas height in pixels
  */
  resize(width, height) {
    this.canvas.resize(width, height);
  }

  /**
  * Register an event callback
  * @param {string} eventType - event type
  * @param {function} callback - event callback function
  */
  on(eventType, callback) {
    var events = this._events;
    (events[eventType] || (events[eventType] = [])).push(callback);
  }

  /**
  * Remove an event callback
  * @param {string} eventType - event type
  * @param {function} callback - event callback function
  */
  off(eventType, callback) {
    var callbackList = this._events[eventType];
    if (callbackList) callbackList.splice(callbackList.indexOf(callback), 1);
  }

  /**
  * Emit an event (used internally)
  * @param {string} eventType - event type
  * @param {...} args - arguments to be passed to event callback
  */
  emit(eventType, ...args) {
    var callbackList = this._events[eventType] || [];
    for (var i = 0; i < callbackList.length; i++) {
      callbackList[i].apply(null, args); 
    }
  }

}