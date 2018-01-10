import webglCanvas from "webgl/webglCanvas";
import ppmDecoder from "decoder";

export default class memoPlayer {
  constructor(el, width, height) {
    this.canvas = new webglCanvas(el, width, height);
    this._isOpen = false;
    this.currentFrame = 0;
  }

  open(source) {
    var buffer = source;
    this.ppm = new ppmDecoder(buffer);
    this._isOpen = true;
    this.setFrame(0);
  }

  close() {
    this.ppm = null;
    this._isOpen = false;
    this.currentFrame = 0;
  }

  setFrame(index) {
    if (this._isOpen) {
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
  }

  firstFrame() {
  }

}