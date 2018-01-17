import webglCanvas from "webgl/webglCanvas";
import ppmDecoder from "decoder";
import memoAudio from "./audio";
import animLoop from "./animLoop";

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
    this.ppm = new ppmDecoder(buffer);
    this.meta = this.ppm.meta;
    this.frameCount = this.ppm.frameCount;
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
    if ((index >= 0) && (index < this.frameCount)) {
      this.canvas.setPalette(this.ppm.getFramePalette(index));
      this.canvas.setBitmaps(this.ppm.decodeFrame(index));
      this.canvas.refresh();
      this.currentFrame = index;
    }
  }

  nextFrame() {
    this.setFrame(this.currentFrame + 1);
  }

  prevFrame() {
    this.setFrame(this.currentFrame - 1);
  }

  lastFrame() {
    this.setFrame(this.frameCount - 1);
  }

  firstFrame() {
    this.setFrame(0);
  }

}