import { CanvasInterface } from './CanvasInterface';
import { WebglCanvas, WebglCanvasOptions } from './WebGlCanvas';
import { Html5Canvas, Html5CanvasOptions } from './Html5Canvas';
import { FlipnoteParserBase } from '../parsers';

export type UniversalCanvasOptions = WebglCanvasOptions & Html5CanvasOptions;

export class UniversalCanvas implements CanvasInterface {

  /** */
  public renderer: CanvasInterface;
  /** */
  public note: FlipnoteParserBase;
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

  private parent: Element;
  private options: Partial<UniversalCanvasOptions> = {};
  private isReady = false;
  private isHtml5 = false;
  
  constructor (parent: Element, width=640, height=480, options: Partial<UniversalCanvasOptions>={}) {
    this.parent = parent;
    this.options = options;
    try {
      this.renderer = new WebglCanvas(parent, width, height, {
        ...options,
        // attempt to switch renderer
        onlost: () => {
          console.warn('WebGL failed, attempting HTML5 fallback');
          if (this.isReady && !this.isHtml5) // if the error happened after canvas creation
            this.switchToHtml5();
          else
            throw '';
        }
      });
    }
    catch {
      this.switchToHtml5();
    }
    this.isReady = true;
  }

  public switchToHtml5() {
    const renderer = new Html5Canvas(this.parent, this.width, this.height, this.options);
    if (this.note) {
      renderer.setNote(this.note);
      renderer.prevFrameIndex = this.renderer?.prevFrameIndex;
      renderer.forceUpdate();
    }
    this.isHtml5 = true;
    this.renderer = renderer;
  }

  public setCanvasSize(width: number, height: number) {
    const renderer = this.renderer;
    renderer.setCanvasSize(width, height);
    this.width = width;
    this.width = height;
    this.dstWidth = renderer.dstWidth;
    this.dstHeight = renderer.dstHeight;
  }

  public setNote(note: FlipnoteParserBase) {
    this.note = note;
    this.renderer.setNote(note);
    this.prevFrameIndex = undefined;
    this.srcWidth = this.renderer.srcWidth;
    this.srcHeight = this.renderer.srcHeight;
  }

  public clear(color?: [number, number, number, number]) {
    this.renderer.clear(color);
  }

  public drawFrame(frameIndex: number) {
    this.renderer.drawFrame(frameIndex);
    this.prevFrameIndex = frameIndex;
  }

  public forceUpdate() {
    this.renderer.forceUpdate();
  }

  public getDataUrl(type?: string, quality?: any) {
    return this.renderer.getDataUrl();
  }

  async getBlob(type?: string, quality?: any) {
    return this.renderer.getBlob();
  }

  public destroy() {
    this.renderer.destroy();
    this.note = null;
  }

}