import { CanvasInterface, CanvasConstructor, CanvasStereoscopicMode } from './CanvasInterface';
import { WebglCanvas, WebglCanvasOptions } from './WebGlCanvas';
import { Html5Canvas, Html5CanvasOptions } from './Html5Canvas';
import { FlipnoteParserBase } from '../parsers';

export type UniversalCanvasOptions = WebglCanvasOptions & Html5CanvasOptions;

export class UniversalCanvas implements CanvasInterface {

  /** */
  renderer: CanvasInterface;
  /** */
  note: FlipnoteParserBase;
  /** View width (CSS pixels) */
  width: number;
  /** View height (CSS pixels) */
  height: number;
  /** 
   * Backing canvas width (real pixels)
   * Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels
  */
  dstWidth: number;
  /** 
   * Backing canvas height (real pixels)
   * Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels
  */
  dstHeight: number;
  /**  */
  srcWidth: number;
  /**  */
  srcHeight: number;
  /** */
  frameIndex: number;
  /** */
  isReady = false;
  /** */
  isHtml5 = false;
  /** */
  supportedStereoscopeModes: CanvasStereoscopicMode[] = [];
  /** */
  stereoscopeMode = CanvasStereoscopicMode.None;
  /** */
  stereoscopeStrength = 1;

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
      renderer.frameIndex = this.renderer?.frameIndex;
      renderer.forceUpdate();
    }

    if (this.renderer)
      this.renderer.destroy();

    this.isHtml5 = renderer instanceof Html5Canvas;
    this.isReady = true;
    this.renderer = renderer;
    this.rendererStackIdx = this.rendererStack.indexOf(Canvas);
    this.supportedStereoscopeModes = renderer.supportedStereoscopeModes;
    renderer.stereoscopeStrength = this.stereoscopeStrength;
    this.requestStereoScopeMode(this.stereoscopeMode);
  }

  fallbackIfPossible() {
    if (this.rendererStackIdx >= this.rendererStack.length)
      throw new Error('No renderer to fall back to');

    this.rendererStackIdx += 1;
    this.setSubRenderer(this.rendererStack[this.rendererStackIdx]);
  }

  // for backwards compat
  switchToHtml5() {
    this.setSubRenderer(Html5Canvas);
  }

  setCanvasSize(width: number, height: number) {
    const renderer = this.renderer;
    renderer.setCanvasSize(width, height);
    this.width = width;
    this.width = height;
    this.dstWidth = renderer.dstWidth;
    this.dstHeight = renderer.dstHeight;
  }

  setNote(note: FlipnoteParserBase) {
    this.note = note;
    this.renderer.setNote(note);
    this.frameIndex = undefined;
    this.srcWidth = this.renderer.srcWidth;
    this.srcHeight = this.renderer.srcHeight;
  }

  clear(color?: [number, number, number, number]) {
    this.renderer.clear(color);
  }

  drawFrame(frameIndex: number) {
    this.renderer.drawFrame(frameIndex);
    this.frameIndex = frameIndex;
  }

  forceUpdate() {
    this.renderer.forceUpdate();
  }
  
  requestStereoScopeMode(mode: CanvasStereoscopicMode) {
    this.renderer.requestStereoScopeMode(mode);
    this.stereoscopeMode = this.renderer.stereoscopeMode;
  }

  getDataUrl(type?: string, quality?: any) {
    return this.renderer.getDataUrl();
  }

  async getBlob(type?: string, quality?: any) {
    return this.renderer.getBlob();
  }

  destroy() {
    this.renderer.destroy();
    this.note = null;
  }

}