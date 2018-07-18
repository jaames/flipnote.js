import kwzParser from "decoder/kwz";
import load from "loader";
import bmp from "encoder/bmp";
import canvas from "webgl/canvas";
import { setInterval } from "timers";

const PALETTE = [
  [0xff, 0xff, 0xff],
  [0x10, 0x10, 0x10],
  [0xff, 0x10, 0x10],
  [0xff, 0xe7, 0x00],
  [0x00, 0x86, 0x31],
  [0x00, 0x38, 0xce],
  [0xff, 0xff, 0xff],
];

export default class kwzTest {

  constructor(src) {
    load(src).then(arrayBuffer => {
      this.kwz = new kwzParser(arrayBuffer);
    });
    let canv = document.createElement("canvas");
    document.body.appendChild(canv);
    this.canvas = new canvas(canv, 320*2, 240*2);
  }

  renderLoop() {

    let index = 0;

    let loop = () => {
      if (index == this.kwz.frameCount) index = 0;
      this.renderFrame(index);
      index += 1;
    }

    setInterval(loop, 1000/8);
  }

  renderFrame(index) {
    let colors = this.kwz.getFramePalette(index);
    this.canvas.drawLayers(this.kwz.decodeFrame(index), colors);
    // this.canvas.refresh();
  }

  createFrameBitmap(index) {
    let frame = this.kwz.getFrameImage(index);
    let palette = this.kwz.getFramePalette(index);
    let img = new bmp(320, 240, 8);
    let colors = [];

    for (const color in palette) {
      var [r, g, b, a] = palette[color];
      var val = (0xFF << 24) | (r << 16) | (g << 8) | (b);
      colors.push(val);
    }

    img.setPalette(colors);
    img.setPixels(frame);

    let imgElement = img.getImage();
    document.body.appendChild(imgElement);
  }

}