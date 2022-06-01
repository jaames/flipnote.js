import type { FlipnoteParserBase } from '../parsers';
import { assert, assertBrowserEnv, isBrowser } from '../utils';
import { CanvasInterface } from './CanvasInterface';

/**
 * Setup options for {@link Html5Canvas}
 */
export interface Html5CanvasOptions {
  /** Use DPI scaling */
  useDpi: boolean;
  /** Use image smoothing */
  useSmoothing: boolean;
};

/**
 * Flipnote renderer for the [HTML5 2D canvas API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
 */
export class Html5Canvas implements CanvasInterface {

  static defaultOptions: Html5CanvasOptions = {
    useDpi: true,
    useSmoothing: true,
  };

  static isSupported() {
    if (!isBrowser) return false;
    let testCanvas = document.createElement('canvas');
    let testCtx = testCanvas.getContext('2d');
    const supported = testCtx !== null;
    testCanvas = null;
    testCtx = null;
    return supported;
  }

  /** */
  public note: FlipnoteParserBase;
  /** Canvas HTML element being used as a rendering surface */
  public canvas: HTMLCanvasElement;
  /** Rendering context */
  public ctx: CanvasRenderingContext2D;
  /** View width (CSS pixels) */
  public width: number;
  /** View height (CSS pixels) */
  public height: number;
  /** 
   * Backing canvas width (real pixels)
   * Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels
  */
  public dstWidth: number;
  /** 
   * Backing canvas height (real pixels)
   * Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels
  */
  public dstHeight: number;
  /**  */
  public srcWidth: number;
  /**  */
  public srcHeight: number;
  /** */
  public prevFrameIndex: number;

  private options: Html5CanvasOptions;
  private srcCanvas: HTMLCanvasElement;
  private srcCtx: CanvasRenderingContext2D;
  private frameImage: ImageData;
  private paletteBuffer = new Uint32Array(16);
  private frameBuffer: Uint32Array;

  constructor(parent: Element, width: number, height: number, options: Partial<Html5CanvasOptions> = {}) {
    assertBrowserEnv();
    this.options = { ...Html5Canvas.defaultOptions, ...options };
    this.width = width;
    this.height = height;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'FlipnoteCanvas FlipnoteCanvas--html5';
    this.ctx = this.canvas.getContext('2d');
    this.srcCanvas = document.createElement('canvas');
    this.srcCtx = this.srcCanvas.getContext('2d');
    assert(this.ctx !== null && this.srcCtx !== null, 'Could not create HTML5 canvas');
    if (parent) parent.appendChild(this.canvas);
    this.setCanvasSize(width, height);
  }

  /**
   * Resize the canvas surface
   * @param width - New canvas width, in CSS pixels
   * @param height - New canvas height, in CSS pixels
   * 
   * The ratio between `width` and `height` should be 3:4 for best results
   */
  public setCanvasSize(width: number, height: number) {
    const canvas = this.canvas;
    const useDpi = this.options.useDpi;
    const dpi = useDpi ? (window.devicePixelRatio || 1) : 1;
    const internalWidth = width * dpi;
    const internalHeight = height * dpi;
    this.width = width;
    this.height = height;
    this.dstWidth = internalWidth;
    this.dstHeight = internalHeight;
    canvas.style.width = `${ width }px`;
    canvas.style.height = `${ height }px`;
    canvas.width = internalWidth;
    canvas.height = internalHeight;
  }
  
  /**
   */
  public setNote(note: FlipnoteParserBase) {
    const width = note.imageWidth;
    const height = note.imageHeight;
    this.note = note;
    this.srcWidth = width;
    this.srcHeight = height;
    this.srcCanvas.width = width;
    this.srcCanvas.height = height;
    // create image data to fit note size
    this.frameImage = this.srcCtx.createImageData(width, height);
    // uint32 view of the img buffer memory
    this.frameBuffer = new Uint32Array(this.frameImage.data.buffer);
    this.prevFrameIndex = undefined;
    // set canvas alt text
    this.canvas.title = note.getTitle();
  }
  
  /**
   * Clear the canvas
   * @param color optional RGBA color to use as a background color
   */
  public clear(color?: [number, number, number, number]) {
    // clear framebuffer
    this.frameBuffer.fill(0);
    // clear canvas
    this.ctx.clearRect(0, 0, this.dstWidth, this.dstHeight);
    // fill canvas with paper color
    if (color) {
      const [r, g, b, a] = color;
      this.ctx.fillStyle = `rgba(${ r }, ${ g }, ${ b }, ${ a })`;
      this.ctx.fillRect(0, 0, this.dstWidth, this.dstHeight);
    }
  }

  public drawFrame(frameIndex: number) {
    // clear whatever's already been drawn
    this.clear();
    // optionally enable image smoothing
    if (!this.options.useSmoothing)
      this.ctx.imageSmoothingEnabled = false;
    // get frame pixels as RGBA buffer
    this.note.getFramePixelsRgba(frameIndex, this.frameBuffer, this.paletteBuffer);
    // put framebuffer pixels into the src canvas
    this.srcCtx.putImageData(this.frameImage, 0, 0);
    // composite src canvas to dst (so image scaling can be handled)
    this.ctx.drawImage(
      this.srcCanvas, 
      0, 0, 
      this.srcWidth, 
      this.srcHeight,
      0, 0,
      this.dstWidth,
      this.dstHeight
    );
    this.prevFrameIndex = frameIndex;
  }

  public forceUpdate() {
    if (this.prevFrameIndex !== undefined)
      this.drawFrame(this.prevFrameIndex);
  }

  public getDataUrl(type?: string, quality?: any) {
    return this.canvas.toDataURL(type, quality);
  }

  async getBlob(type?: string, quality?: any) {
    return new Promise<Blob>((resolve, reject) => this.canvas.toBlob(resolve, type, quality));
  }

  public destroy() {
    this.frameImage = null;
    this.paletteBuffer = null;
    this.frameBuffer = null;
    this.canvas.parentNode.removeChild(this.canvas);
    this.canvas.width = 1;
    this.canvas.height = 1;
    this.canvas = null;
    this.srcCanvas.width = 1;
    this.srcCanvas.height = 1;
    this.srcCanvas = null;
  }

}