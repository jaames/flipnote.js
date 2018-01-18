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
    return FRAMERATES[this.ppm.frameSpeed];
  }

  open(source) {
    var buffer = source;
    var ppm = new ppmDecoder(buffer);
    var meta = ppm.meta;
    this.ppm = ppm;
    this.meta = meta;
    this.frameCount = ppm.frameCount;
    this.loop = meta.loop == 1;
    // this.audio = new memoAudio(this.ppm.decodeAudio("bgm"));
    // this.audio.playbackRate = (1 / this.ppm.bgmFramerate) / (1 / this.ppm.framerate);
    // this.audio.play();
    this._isOpen = true;
    this.paused = true;
    this._animLoopFrame = 0;
    this._lastFrameTime = 0;
    this.setFrame(0);
  }

  close() {
    this.ppm = null;
    this._isOpen = false;
    this.currentFrame = 0;
    this.paused = true;
  }

  _animLoopFn(now) {
    var dt = (now - this._lastFrameTime) / (1000 / 60);
    if (this._animLoopFrame >= 60 / this.framerate) {
      this.nextFrame();
      this._animLoopFrame = 0;
    }
    if (this.currentFrame == this.frameCount -1) {
      (this.loop ? this.firstFrame : this.pause)();
    }
    this._animLoopFrame += dt;
    this._lastFrameTime = now;
    if (!this.paused) requestAnimationFrame(this._animLoopFn.bind(this));
  }

  play() {
    if (!this._isOpen) return null;
    this.paused = false;
    this._lastFrameTime = performance.now();
    this._animLoopFn(this._lastFrameTime);
  }

  pause() {
    if (!this._isOpen) return null;
    this.paused = true;
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
    this.currentTime = 0;
  }

}