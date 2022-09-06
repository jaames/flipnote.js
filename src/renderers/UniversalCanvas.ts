import { CanvasInterface, CanvasConstructor } from './CanvasInterface';
import { WebglCanvas, WebglCanvasOptions } from './WebGlCanvas';
import { Html5Canvas, Html5CanvasOptions } from './Html5Canvas';
import { FlipnoteParserBase } from '../parsers';

export type UniversalCanvasOptions = WebglCanvasOptions & Html5CanvasOptions;

export class UniversalCanvas implements CanvasInterface {

  /** */
  public subRenderer: CanvasInterface;
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
  /** */
  public isReady = false;
  /** */
  public isHtml5 = false;

  private rendererStack: CanvasConstructor[] = [
    WebglCanvas,
    Html5Canvas
  ];
  private rendererStackIdx = 0;
  private parent: Element;
  private options: Partial<UniversalCanvasOptions> = {};
  
  constructor (parent: Element, width=640, height=480, options: Partial<UniversalCanvasOptions>={}) {
    this.width = width;
    this.height = height;
    this.parent = parent;
    this.options = options;
    this.setSubRenderer(this.rendererStack[0]);
  }

  public fallbackIfPossible() {
    if (this.rendererStackIdx >= this.rendererStack.length)
      throw new Error('No renderer to fall back to');

    this.rendererStackIdx += 1;
    this.setSubRenderer(this.rendererStack[this.rendererStackIdx]);
  }

  private setSubRenderer(Canvas: CanvasConstructor) {
    let immediateLoss = false;

    const renderer = new Canvas(this.parent, this.width, this.height, {
      ...this.options,
      onlost: () => {
        immediateLoss = true;
        this.fallbackIfPossible();
      }
    });

    // if onlost was called immediately, we succeed to the fallback
    if (immediateLoss)
      return;
    
    if (this.note) {
      renderer.setNote(this.note);
      renderer.prevFrameIndex = this.subRenderer?.prevFrameIndex;
      renderer.forceUpdate();
    }

    if (this.subRenderer)
      this.subRenderer.destroy();

    this.isHtml5 = renderer instanceof Html5Canvas;
    this.isReady = true;
    this.subRenderer = renderer;
    this.rendererStackIdx = this.rendererStack.indexOf(Canvas);
  }

  // for backwards compat
  public switchToHtml5() {
    this.setSubRenderer(Html5Canvas);
  }

  public setCanvasSize(width: number, height: number) {
    const renderer = this.subRenderer;
    renderer.setCanvasSize(width, height);
    this.width = width;
    this.width = height;
    this.dstWidth = renderer.dstWidth;
    this.dstHeight = renderer.dstHeight;
  }

  public setNote(note: FlipnoteParserBase) {
    this.note = note;
    this.subRenderer.setNote(note);
    this.prevFrameIndex = undefined;
    this.srcWidth = this.subRenderer.srcWidth;
    this.srcHeight = this.subRenderer.srcHeight;
  }

  public clear(color?: [number, number, number, number]) {
    this.subRenderer.clear(color);
  }

  public drawFrame(frameIndex: number) {
    this.subRenderer.drawFrame(frameIndex);
    this.prevFrameIndex = frameIndex;
  }

  public forceUpdate() {
    this.subRenderer.forceUpdate();
  }

  public getDataUrl(type?: string, quality?: any) {
    return this.subRenderer.getDataUrl();
  }

  async getBlob(type?: string, quality?: any) {
    return this.subRenderer.getBlob();
  }

  public destroy() {
    this.subRenderer.destroy();
    this.note = null;
  }

}