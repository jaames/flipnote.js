import webglCanvas from "webgl/webglCanvas";
import ppmDecoder from "decoder";
import memoAudio from "./audio";

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

export default class memoPlayer {
  constructor(el, width, height) {
    // if `el` is a string, use it to select an Element, else assume it's an element
    el = ("string" == typeof el) ? document.querySelector(el) : el;
    this.canvas = new webglCanvas(el, width, height);
    this._isOpen = false;
    this.loop = false;
    this.currentFrame = 0;
    this.paused = true;
  }

  get currentFrame() {
    return this._frame;
  }

  set currentFrame(index) {
    this.setFrame(index);
  }

  get currentTime() {
    return this._isOpen ? this.currentFrame * (1 / this.ppm.framerate) : null;
  }

  set currentTime(value) {
    if ((this._isOpen) && (value < this.duration) && (value > 0)) {
      this.setFrame(Math.round(value / (1 / this.ppm.framerate)));
    }
  }

  get duration() {
    return this._isOpen ? this.frameCount * (1 / this.ppm.framerate) : null;
  }

  get framerate() {
    return FRAMERATES[this.frameSpeed];
  }

  get _audiorate() {
    return (1 / FRAMERATES[this.ppm.bgmSpeed]) / (1 / this.framerate);
  }

  open(source) {
    var buffer = source;
    var ppm = new ppmDecoder(buffer);
    var meta = ppm.meta;
    this.ppm = ppm;
    this.meta = meta;
    this.frameCount = ppm.frameCount;
    this.frameSpeed = ppm.frameSpeed;
    this.loop = meta.loop == 1;
    this._bgmAudio = ppm.soundMeta.bgm.length > 0 ? new memoAudio(this.ppm.decodeAudio("bgm")) : null;
    if (this._bgmAudio) this._bgmAudio.playbackRate = this._audiorate;
    this._seAudio = [
      ppm.soundMeta.se1.length > 0 ? new memoAudio(this.ppm.decodeAudio("se1")) : null,
      ppm.soundMeta.se2.length > 0 ? new memoAudio(this.ppm.decodeAudio("se2")) : null,
      ppm.soundMeta.se3.length > 0 ? new memoAudio(this.ppm.decodeAudio("se3")) : null,
    ];
    this._seFlags = this.ppm.decodeSoundFlags();
    this._isOpen = true;
    this.paused = true;
    this._playbackFrameTime = 0;
    this._lastFrameTime = 0;
    this._events = {};
    this.setFrame(0);
    this.emit("load");
  }

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
    this.canvas.clear();
  }

  _playbackLoop(now) {
    var dt = (now - this._lastFrameTime) / (1000 / 60);
    if (this._playbackFrameTime >= 60 / this.framerate) {
      this.nextFrame();
      this._playbackFrameTime = 0;
    }
    if (this.currentFrame == this.frameCount -1) {
      if (this.loop) {
        this.firstFrame();
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

  play() {
    if (!this._isOpen) return null;
    this.paused = false;
    if ((!this.loop) && (this.currentFrame == this.frameCount - 1)) this._frame = 0;
    this._lastFrameTime = performance.now();
    this._playbackLoop(this._lastFrameTime);
    this.emit("playback:start");
  }

  pause() {
    if (!this._isOpen) return null;
    // break the playback loop
    this.paused = true;
    this.emit("playback:stop");
  }

  setFrame(index) {
    if (!this._isOpen) return null;
    // clamp frame index
    index = Math.max(0, Math.min(index, this.frameCount - 1));
    this.canvas.setPalette(this.ppm.getFramePalette(index));
    this.canvas.setBitmaps(this.ppm.decodeFrame(index));
    this.canvas.refresh();
    this._frame = index;
  }

  nextFrame() {
    if ((this.loop) && (this.currentFrame >= this.frameCount -1)) {
      this.currentFrame = 0;
    } else {
      this.currentFrame += 1;
    }
  }

  prevFrame() {
    if ((this.loop) && (this.currentFrame <= 0)) {
      this.currentFrame = this.frameCount - 1;
    } else {
      this.currentFrame -= 1;
    }
  }

  lastFrame() {
    this.currentFrame = this.frameCount - 1;
  }

  firstFrame() {
    this.currentFrame = 0;
  }

  on(eventType, callback) {
    var events = this._events;
    (events[eventType] || (events[eventType] = [])).push(callback);
  }

  off(eventType, callback) {
    var callbackList = this._events[eventType];
    if (callbackList) callbackList.splice(callbackList.indexOf(callback), 1);
  }

  emit(eventType, ...args) {
    var callbackList = this._events[eventType] || [];
    for (var i = 0; i < callbackList.length; i++) {
      callbackList[i].apply(null, args); 
    }
  }

}