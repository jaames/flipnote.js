import {
  ProgramInfo,
  BufferInfo,
  setAttributes,
  createProgramInfoFromProgram,
  createBufferInfoFromArrays,
  setUniforms,
} from 'twgl.js';

import type { FlipnoteParserBase } from '../parsers';
import { assert, assertBrowserEnv, isBrowser } from '../utils';
import { CanvasInterface } from './CanvasInterface';
import quadShader from './shaders/quad.vert';
import drawFrame from './shaders/drawFrame.frag';

/** 
 * Keeps track of WebGl resources so they can be destroyed properly later
 * @internal
 */
interface ResourceMap {
  programs: WebGLProgram[];
  shaders: WebGLShader[];
  textures: WebGLTexture[];
  buffers: WebGLBuffer[];
};

/**
 * Settings for {@link WebGlCanvas}
 */
export interface WebglCanvasOptions {
  /** Function to be called if the context is lost */
  onlost: () => void;
  /** Function to be called if the context is restored */
  onrestored: () => void;
  /** Use DPI scaling */
  useDpi: boolean;
};

/**
 * Flipnote renderer for the {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API WebGL} API
 * 
 * Only available in browser contexts
 */
export class WebglCanvas implements CanvasInterface {

  static defaultOptions: WebglCanvasOptions = {
    onlost: () => {},
    onrestored: () => {},
    useDpi: true
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

  /**  */
  public note: FlipnoteParserBase;
  /** Canvas HTML element being used as a rendering surface */
  public canvas: HTMLCanvasElement;
  /** Rendering context - see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext} */
  public gl: WebGLRenderingContext;
  /** View width (CSS pixels) */
  public width: number;
  /** View height (CSS pixels) */
  public height: number;
  /** */
  public srcWidth: number;
  /** */
  public srcHeight: number;
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
  /** */
  public prevFrameIndex: number;

  private options: WebglCanvasOptions;
  private program: ProgramInfo; // for drawing renderbuffer w/ filtering
  private quadBuffer: BufferInfo;
  private paletteBuffer = new Uint32Array(16);
  private frameBuffer: Uint32Array;
  private frameBufferBytes: Uint8Array; // will be same memory as frameBuffer, just uint8 for webgl texture

  private frameTexture: WebGLTexture;
  private refs: ResourceMap = {
    programs: [],
    shaders: [],
    textures: [],
    buffers: []
  };
  private isCtxLost = false;

  /**
   * Creates a new WebGlCanvas instance
   * @param el - Canvas HTML element to use as a rendering surface
   * @param width - Canvas width in CSS pixels
   * @param height - Canvas height in CSS pixels
   * 
   * The ratio between `width` and `height` should be 3:4 for best results
   */
  constructor(parent: Element, width=640, height=480, options: Partial<WebglCanvasOptions> = {}) {
    assertBrowserEnv();
    this.options = { ...WebglCanvas.defaultOptions, ...options };
    this.width = width;
    this.height = height;
    this.canvas = document.createElement('canvas');
    this.canvas.addEventListener('webglcontextlost', this.handleContextLoss, false);
    this.canvas.addEventListener('webglcontextrestored', this.handleContextRestored, false);
    this.canvas.className = 'FlipnoteCanvas FlipnoteCanvas--webgl';
    this.gl = this.canvas.getContext('webgl', {
      antialias: false,
      alpha: true
    });
    if (parent) parent.appendChild(this.canvas);
    this.init();
  }

  private init() {
    this.setCanvasSize(this.width, this.height);
    const gl = this.gl;
    if (this.checkContextLoss()) return;
    this.program = this.createProgram(quadShader, drawFrame);
    this.quadBuffer = this.createScreenQuad(-1, -1, 2, 2, 1, 1);
    this.setBuffersAndAttribs(this.program, this.quadBuffer);
    this.frameTexture = this.createTexture(gl.RGBA, gl.LINEAR, gl.CLAMP_TO_EDGE);
    // set gl constants
    gl.useProgram(this.program.program);
    gl.bindTexture(gl.TEXTURE_2D, this.frameTexture);
  }

  private createProgram(vertexShaderSource: string, fragmentShaderSource: string) {
    if(this.checkContextLoss()) return;
    const gl = this.gl;
    const vert = this.createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const frag = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = gl.createProgram();
    // set up shaders
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    // link program
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(log);
    }
    const programInfo = createProgramInfoFromProgram(gl, program);
    this.refs.programs.push(program);
    return programInfo;
  }

  private createShader(type: number, source: string) {
    if(this.checkContextLoss()) return;
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    // test if shader compilation was successful
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(log);
    }
    this.refs.shaders.push(shader);
    return shader;
  }

  // creating a subdivided quad seems to produce slightly nicer texture filtering
  private createScreenQuad(x0: number, y0: number, width: number, height: number, xSubdivs: number, ySubdivs: number) {
    if(this.checkContextLoss()) return;
    const numVerts = (xSubdivs + 1) * (ySubdivs + 1);
    const numVertsAcross = xSubdivs + 1;
    const positions = new Float32Array(numVerts * 2);
    const texCoords = new Float32Array(numVerts * 2);
    let positionPtr = 0;
    let texCoordPtr = 0;
    for (let y = 0; y <= ySubdivs; y++) {
      for (let x = 0; x <= xSubdivs; x++) {
        const u = x / xSubdivs;
        const v = y / ySubdivs;
        positions[positionPtr++] = x0 + width * u;
        positions[positionPtr++] = y0 + height * v;
        texCoords[texCoordPtr++] = u;
        texCoords[texCoordPtr++] = v;
      }
    }
    const indices = new Uint16Array(xSubdivs * ySubdivs * 2 * 3);
    let indicesPtr = 0;
    for (let y = 0; y < ySubdivs; y++) {
      for (let x = 0; x < xSubdivs; x++) {
        // triangle 1
        indices[indicesPtr++] = (y + 0) * numVertsAcross + x;
        indices[indicesPtr++] = (y + 1) * numVertsAcross + x;
        indices[indicesPtr++] = (y + 0) * numVertsAcross + x + 1;
        // triangle 2
        indices[indicesPtr++] = (y + 0) * numVertsAcross + x + 1;
        indices[indicesPtr++] = (y + 1) * numVertsAcross + x;
        indices[indicesPtr++] = (y + 1) * numVertsAcross + x + 1;
      }
    }
    const bufferInfo = createBufferInfoFromArrays(this.gl, {
      position: {
        numComponents: 2,
        data: positions
      },
      texcoord: {
        numComponents: 2,
        data: texCoords
      },
      indices: indices
    });
    // collect references to buffer objects
    for (let name in bufferInfo.attribs)
      this.refs.buffers.push(bufferInfo.attribs[name].buffer);
    return bufferInfo;
  }

  private setBuffersAndAttribs(program: ProgramInfo, buffer: BufferInfo) {
    if(this.checkContextLoss()) return;
    const gl = this.gl;
    setAttributes(program.attribSetters, buffer.attribs);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indices);
  }

  private createTexture(type: number, minMag: number, wrap: number, width = 1, height = 1) {
    if(this.checkContextLoss()) return;
    const gl = this.gl;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minMag);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, minMag);
    gl.texImage2D(gl.TEXTURE_2D, 0, type, width, height, 0, type, gl.UNSIGNED_BYTE, null);
    this.refs.textures.push(tex);
    return tex;
  }

  /**
   * Resize the canvas surface
   * @param width - New canvas width, in CSS pixels
   * @param height - New canvas height, in CSS pixels
   * 
   * The ratio between `width` and `height` should be 3:4 for best results
   */
  public setCanvasSize(width: number, height: number) {
    const dpi = this.options.useDpi ? (window.devicePixelRatio || 1) : 1;
    const internalWidth = width * dpi;
    const internalHeight = height * dpi;
    this.width = width;
    this.height = height;
    this.canvas.width = internalWidth;
    this.canvas.height = internalHeight;
    this.dstWidth = internalWidth;
    this.dstHeight = internalHeight;
    this.canvas.style.width = `${ width }px`;
    this.canvas.style.height = `${ height }px`;
    const gl = this.gl;
    if(this.checkContextLoss()) return;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  }

  /**
   * Sets the note to use for this player
   */
  public setNote(note: FlipnoteParserBase) {
    if(this.checkContextLoss()) return;
    const gl = this.gl;
    const width = note.imageWidth;
    const height = note.imageHeight;
    this.note = note;
    this.srcWidth = width;
    this.srcHeight = height;
    // resize frame texture
    gl.bindTexture(gl.TEXTURE_2D, this.frameTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.srcWidth, this.srcHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    this.frameBuffer = new Uint32Array(width * height);
    this.frameBufferBytes = new Uint8Array(this.frameBuffer.buffer); // same memory buffer as rgbaData
    this.prevFrameIndex = undefined;
    // set canvas alt text
    this.canvas.title = note.getTitle();
  }

  /**
   * Clear the canvas
   * @param color optional RGBA color to use as a background color
   */
  public clear(color?: [number, number, number, number]) {
    if(this.checkContextLoss()) return;
    if (color) {
      const [r, g, b, a] = color;
      this.gl.clearColor(r / 255, g / 255, b / 255, a /255);
    }
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  /**
   * Draw a frame from the currently loaded Flipnote
   * @param frameIndex 
   */
  public drawFrame(frameIndex: number) {
    if(this.checkContextLoss()) return;
    const {
      gl,
      srcWidth: textureWidth,
      srcHeight: textureHeight,
    } = this;
    // get frame pixels as RGBA buffer
    this.note.getFramePixelsRgba(frameIndex, this.frameBuffer, this.paletteBuffer);
    // clear whatever's already been drawn
    // const paperColor = note.getFramePalette(frameIndex)[0];
    // this.clear(paperColor);
    gl.clear(this.gl.COLOR_BUFFER_BIT);
    // update texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureWidth, textureHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.frameBufferBytes);
    // prep uniforms
    setUniforms(this.program, {
      u_flipY: true,
      u_tex: this.frameTexture,
      u_textureSize: [this.srcWidth, this.srcHeight],
      u_screenSize: [gl.drawingBufferWidth, gl.drawingBufferHeight],
    });
    // draw!
    gl.drawElements(gl.TRIANGLES, this.quadBuffer.numElements, this.quadBuffer.elementType, 0);
    this.prevFrameIndex = frameIndex;
  }
   
  public forceUpdate() {
    if (this.prevFrameIndex !== undefined)
      this.drawFrame(this.prevFrameIndex);
  }

  /**
   * Returns true if the webGL context has returned an error
   */
  public isErrorState() {
    const gl = this.gl;
    return gl === null || gl.getError() !== gl.NO_ERROR;
  }

  /**
   * Only a certain number of WebGL contexts can be added to a single page before the browser will start culling old contexts. 
   * This method returns true if it has been culled, false if not
   */
  private checkContextLoss() {
    const isLost = this.isCtxLost || this.isErrorState();
    if (isLost) 
      this.handleContextLoss();
    return isLost;
  }

  private handleContextLoss = (e?: Event) => {
    if (e) e.preventDefault();
    this.destroy();
    if (!this.isCtxLost)
      this.options.onlost();
    this.isCtxLost = true;
  }

  private handleContextRestored = (e?: Event) => {
    this.isCtxLost = false;
    this.init();
    this.options.onrestored();
  }

  /**
   * 
   * @param type image mime type (`image/jpeg`, `image/png`, etc)
   * @param quality image quality where supported, between 0 and 1
   */
  public getDataUrl(type?: string, quality?: any) {
    return this.canvas.toDataURL(type, quality);
  }

  async getBlob(type?: string, quality?: any) {
    return new Promise<Blob>((resolve, reject) => this.canvas.toBlob(resolve, type, quality));
  }

  /**
   * Frees any resources used by this canvas instance
   */
  public destroy() {
    const refs = this.refs;
    const gl = this.gl;
    const canvas = this.canvas;
    refs.shaders.forEach((shader) => {
      gl.deleteShader(shader);
    });
    refs.shaders = [];
    refs.textures.forEach((texture) => {
      gl.deleteTexture(texture);
    });
    refs.textures = [];
    refs.buffers.forEach((buffer) => {
      gl.deleteBuffer(buffer);
    });
    refs.buffers = [];
    refs.programs.forEach((program) => {
      gl.deleteProgram(program);
    });
    refs.programs = [];
    this.paletteBuffer = null;
    this.frameBuffer = null;
    this.frameBufferBytes = null;
    if (canvas && canvas.parentElement) {
      // shrink the canvas to reduce memory usage until it is garbage collected
      canvas.width = 1;
      canvas.height = 1;
      // remove canvas from dom
      canvas.parentNode.removeChild(canvas);
    }
  }
}