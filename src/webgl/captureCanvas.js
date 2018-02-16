import canvas from "./canvas";

/** 
 * offscreen webgl canvas for capturing frame images
 * this is kept seperate since preserveDrawingBuffer makes drawing slightly slower
 */
export default class captureCanvas extends canvas {
  constructor() {
    super(document.createElement("canvas"), 256, 192, {
      antialias: true,
      preserveDrawingBuffer: true,
    });
    this.setFilter("linear");
    this.width = 256;
    this.height = 256;
  }

  /**
  * set the image size
  * @param {number} width - image width in pixels 
  * @param {number} height - image height in pixels 
  */
  setSize(width, height) {
    this.resize(width, height);
    this.width = width;
    this.height = height;
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