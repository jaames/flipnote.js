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
    this._events = {};
    this.loop = false;
    this.currentFrame = 0;
    this.paused = true;
    this.audioTracks = [
      new audioTrack("se1"),
      new audioTrack("se2"),
      new audioTrack("se3"),
      new audioTrack("bgm"),
    ];
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
    }
  }

  /**
  * Get audio volume
  */
  get volume() {
    return this.audioTracks[3].audio.volume;
  }

  /**
  * Set audio volume
  */
  set volume(value) {
    for (let i = 0; i < this.audioTracks.length; i++) {
      this.audioTracks[i].audio.volume = value;
    }
  }

  /**
  * Get audio mute
  */
  get muted() {
    return this.audioTracks[3].audio.muted;
  }

  /**
  * Set audio mute
  */
  set muted(value) {
    for (let i = 0; i < this.audioTracks.length; i++) {
      this.audioTracks[i].audio.muted = value;
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
    this.fileLength = ppm.fileLength;
    this.loop = meta.loop == 1;
    this.paused = true;
    this._isOpen = true;
    if (ppm.soundMeta.se1.length) this.audioTracks[0].set(this.ppm.decodeAudio("se1"), 1);
    if (ppm.soundMeta.se2.length) this.audioTracks[1].set(this.ppm.decodeAudio("se2"), 1);
    if (ppm.soundMeta.se3.length) this.audioTracks[2].set(this.ppm.decodeAudio("se3"), 1);
    if (ppm.soundMeta.bgm.length) this.audioTracks[3].set(this.ppm.decodeAudio("bgm"), this._audiorate);
    this._seFlags = this.ppm.decodeSoundFlags();
    this._playbackLoop = null;
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
    return loader(source)
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
    this.pause();
    this.ppm = null;
    this._isOpen = false;
    this.paused = true;
    this.loop = null;
    this.meta = null;
    this.frameCount = null;
    this.frameSpeed = null;
    this._frame = 0;
    for (let i = 0; i < this.audioTracks.length; i++) {
      this.audioTracks[i].unset();
    }
    this._seFlags = null;
    this._hasPlaybackStarted = null;
    this.canvas.clear();
    this._imgCanvas.clear();
  }

  /**
  * Destroy this player instance cleanly
  */
  destroy() {
    this.close();
    this.canvas.destroy();
    this._imgCanvas.destroy();
  }

  /**
  * Play the sound effects for a given frame
  * @param {number} index - zero-based frame index
  * @access protected
  */
  _playFrameSe(index) {
    var flags = this._seFlags[index];
    for (let i = 0; i < flags.length; i++) {
      if (flags[i] && this.audioTracks[i].active) this.audioTracks[i].start();
    }
  }

  /**
  * Play the Flipnote BGM
  * @access protected
  */
  _playBgm() {
    this.audioTracks[3].start(this.currentTime);
  }

  /**
  * Stop all audio tracks
  * @access protected
  */
  _stopAudio() {
    for (let i = 0; i < this.audioTracks.length; i++) {
      this.audioTracks[i].stop();
    }
  }

  /**
  * Begin Flipnote playback
  */
  play() {
    if ((!this._isOpen) || (!this.paused)) return null;
    this.paused = false;
    if ((!this._hasPlaybackStarted) || ((!this.loop) && (this.currentFrame == this.frameCount - 1))) this._frame = 0;
    this._playBgm();
    this._playbackLoop = setInterval(() => {
      if (this.paused) clearInterval(this._playbackLoop);
      // if the end of the flipnote has been reached
      if (this.currentFrame >= this.frameCount -1) {
        this._stopAudio();
        if (this.loop) {
          this.firstFrame();
          this._playBgm(0);
          this.emit("playback:loop");
        } else {
          this.pause();
          this.emit("playback:end");
        }
      } else {
        this._playFrameSe(this.currentFrame);
        this.nextFrame();
      }
    }, 1000 / this.framerate);
    this._hasPlaybackStarted = true;
    this.emit("playback:start");
  }

  /**
  * Pause Flipnote playback
  */
  pause() {
    if ((!this._isOpen) || (this.paused)) return null;
    // break the playback loop
    clearInterval(this._playbackLoop);
    this.paused = true;
    this._stopAudio();
    this.emit("playback:stop");
  }

  /**
  * Get a specific frame as an image data URL
  * @param {number} index - zero-based frame index
  * @param {string} type - image MIME type, default is image/png
  * @param {number} encoderOptions - number between 0 and 1 indicating image quality if type is image/jpeg or image/webp
  */
  getFrameImage(index, width, height, type, encoderOptions) {
    if (!this._isOpen) return null;
    var canvas = this._imgCanvas;
    if (canvas.width !== width || canvas.height !== height) canvas.setSize(width, height);
    // clamp frame index
    index = Math.max(0, Math.min(index, this.frameCount - 1));
    canvas.setPalette(this.ppm.getFramePalette(index));
    canvas.setBitmaps(this.ppm.decodeFrame(index));
    canvas.refresh();
    return canvas.toImage(type, encoderOptions);
  }

  /**
  * Get a Flipnote thumbnail as an image data URL
  * @param {string} type - image MIME type, default is image/png
  * @param {number} encoderOptions - number between 0 and 1 indicating image quality if type is image/jpeg or image/webp
  */
  getThumbImage(width, height, type, encoderOptions) {
    return this.getFrameImage(this.ppm.thumbFrameIndex, width, height, type, encoderOptions);
  }

  /**
  * Jump to a specific frame
  * @param {number} index - zero-based frame index
  */
  setFrame(index) {
    if ((!this._isOpen) || (index === this.currentFrame)) return null;
    // clamp frame index
    index = Math.max(0, Math.min(Math.floor(index), this.frameCount - 1));
    this._frame = index;
    this._playbackFrameTime = 0;
    this.canvas.setPalette(this.ppm.getFramePalette(index));
    this.canvas.setBitmaps(this.ppm.decodeFrame(index));
    this.canvas.refresh();
    this.emit("frame:update", this.currentFrame);
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