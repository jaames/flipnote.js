import canvas from "webgl/canvas";
import parser from "parser";
import loader from "loader";
import audioTrack from "./audio";
import webglCanvas from "../webgl/canvas";

/** flipnote player API, based on HTMLMediaElement (https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) */ 
export default class flipnotePlayer {
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
    this._imgCanvas = new canvas(document.createElement("canvas"), width, height, {
      antialias: true,
      preserveDrawingBuffer: true,
    });
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
    this.smoothRendering = false;
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
    return this.note.framerate;
  }

  /**
  * Get the audio playback rate by comparing audio and frame speeds
  * @access protected
  */
  get _audiorate() {
    return (1 / this.note.bgmrate) / (1 / this.note.framerate);
  }

  /**
  * Load a Flipnote into the player
  * @param {ArrayBuffer} buffer - ppm data
  * @access protected
  */
  _load(buffer) {
    var note = new parser(buffer);
    this.note = note;
    this.meta = note.meta;
    this.type = note.type;
    this.frameCount = note.frameCount;
    this.frameSpeed = note.frameSpeed;
    this.fileLength = note.byteLength;
    this.loop = note.meta.loop == 1;
    this.paused = true;
    this._isOpen = true;
    if (this.note.hasAudioTrack(1)) this.audioTracks[0].set(this.note.decodeAudio("se1"), 1);
    if (this.note.hasAudioTrack(2)) this.audioTracks[1].set(this.note.decodeAudio("se2"), 1);
    if (this.note.hasAudioTrack(3)) this.audioTracks[2].set(this.note.decodeAudio("se3"), 1);
    if (this.note.hasAudioTrack(0)) this.audioTracks[3].set(this.note.decodeAudio("bgm"), this._audiorate);
    this._seFlags = this.note.decodeSoundFlags();
    this._playbackLoop = null;
    this._hasPlaybackStarted = false;
    this.layerVisiblity = {
      1: true,
      2: true,
      3: true
    };
    this.setMode(this.type);
    this.setFrame(this.note.thumbFrameIndex);
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
    this.note = null;
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
  * @param {number|string} index - zero-based frame index, or pass "thumb" to get the thumbnail frame
  * @param {string} type - image MIME type, default is image/png
  * @param {number} encoderOptions - number between 0 and 1 indicating image quality if type is image/jpeg or image/webp
  */
  getFrameImage(index, width, height, type, encoderOptions) {
    if (!this._isOpen) return null;
    var canvas = this._imgCanvas;
    if (canvas.width !== width || canvas.height !== height) canvas.setSize(width, height);
    // clamp frame index
    index = (index == "thumb") ? (this.note.thumbFrameIndex) : (Math.max(0, Math.min(index, this.frameCount - 1)));
    this.drawFrame(index, canvas);
    return canvas.toImage(type, encoderOptions);
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
    this.drawFrame(index, this.canvas);
    this.emit("frame:update", this.currentFrame);
  }

  /**
  * Draw a frame to a given canvas
  * @param {number} index - zero-based frame index
  * @param {webglCanvas} canvas - webgl frame canvas
  */
  drawFrame(frameIndex, canvas) {
    let colors = this.note.getFramePalette(frameIndex);
    let layerBuffers = this.note.decodeFrame(frameIndex);
    canvas.setPaperColor(colors[0]);
    canvas.clear();
    if (this.note.type == "PPM") {
      if (this.layerVisiblity[2]) canvas.drawLayer(layerBuffers[1], 256, 192, colors[2], [0,0,0,0]);
      if (this.layerVisiblity[1]) canvas.drawLayer(layerBuffers[0], 256, 192, colors[1], [0,0,0,0]);
    } else if (this.note.type == "KWZ") {
      if (this.layerVisiblity[3]) canvas.drawLayer(layerBuffers[2], 320, 240, colors[5], colors[6]);
      if (this.layerVisiblity[2]) canvas.drawLayer(layerBuffers[1], 320, 240, colors[3], colors[4]);
      if (this.layerVisiblity[1]) canvas.drawLayer(layerBuffers[0], 320, 240, colors[1], colors[2]);
    }
    
  }

  /**
  * Jump to the thumbnail frame
  */
  thumbnailFrame() {
    this.currentFrame = this.note.thumbFrameIndex;
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
  * Set layer visibility
  * @param {number} index - layer number = 1, 2, 3
  * @param {boolean} value
  */
  setLayerVisibility(index, value) {
    this.layerVisiblity[index] = value;
    this.drawFrame(this.currentFrame, this.canvas);
  }

  /**
  * Set smooth rendering
  * @param {boolean} value
  */
  setSmoothRendering(value) {
    if (this.type == "KWZ") { // kwz doesn't supper linear fltering yet
      var filter = "nearest";
    } else {
      var filter = value ? "linear" : "nearest";
    }
    this.canvas.setFilter(filter);
    this.drawFrame(this.currentFrame, this.canvas);
    this.smoothRendering = value;
  }

  /**
  * Set the mode depending on format
  * @param {string} mode - "KWZ" | "PPM"
  */
  setMode(mode) {
    this.canvas.setMode(mode);
    this._imgCanvas.setMode(mode);
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