import webglCanvas from "webgl/webglCanvas";
import parser from "parser";

export default class memoPlayer {
  constructor(el, width, height) {
    this.canvas = new webglCanvas(el, width, height);
    this.isOpen = false;
    this.currentFrame = 0;
  }

  open(source) {
    var buffer = source;
    this.ppm = new parser(buffer);
    this.isOpen = true;
    this.setFrame(0);
  }

  close() {
    this.ppm = null;
    this.isOpen = false;
    this.currentFrame = 0;
  }

  setFrame(index) {
    if (this.isOpen) {
      this.canvas.setPalette(this.ppm.decodeFramePalette(index));
      this.ppm.decodeFrame(index, this.canvas);
      this.canvas.redraw();
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