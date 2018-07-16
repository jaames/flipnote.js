import kwzParser from "decoder/kwz";
import load from "loader";
import bmp from "encoder/bmp";

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
  }

  createFrameBitmap(index) {
    let frame = this.kwz.getFrameImage(index);
    let palette = this.kwz.getFramePalette(index);
    let img = new bmp(320, 240, 8);
    let colors = [];

    for (const color in palette) {
      var [r, g, b] = PALETTE[palette[color]];
      var val = (0xFF << 24) | (r << 16) | (g << 8) | (b);
      colors.push(val);
    }

    img.setPalette(colors);
    img.setPixels(frame);

    let imgElement = img.getImage();
    document.body.appendChild(imgElement);
  }

}