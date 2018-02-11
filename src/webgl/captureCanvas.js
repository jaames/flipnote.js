import canvas from "./canvas";

/** 
 * offscreen webgl canvas for capturing frame images
 * this is kept seperate since preserveDrawingBuffer makes drawing slightly slower
 */
export default class captureCanvas extends canvas {
  constructor() {
    super(document.createElement("canvas"), 256, 192, {
      antialias: false,
      preserveDrawingBuffer: true,
    });
  }

  /**
  * get the canvas content as an image
  * @param {string} type - image MIME type, default is image/png
  * @param {number} encoderOptions - number between 0 and 1 indicating image quality if type is image/jpeg or image/webp
  */
  toImage(type, encoderOptions) {
    return this.el.toDataURL(type, encoderOptions);
  }
}