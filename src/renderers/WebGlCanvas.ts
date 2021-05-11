import {
  ProgramInfo,
  BufferInfo,
  setAttributes,
  createProgramInfoFromProgram,
  createBufferInfoFromArrays,
  setUniforms,
} from 'twgl.js';

import { FlipnoteParser } from '../parsers';
import { assert, assertBrowserEnv } from '../utils';

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

interface WebglCanvasOptions {
  /** Function to be called if the context is lost */
  onlost: () => void;
  /** Function to be called if the context is restored */
  onrestored: () => void;
  /** Use DPI scaling */
  useDpi: boolean;
};

/**
 * Animation frame renderer, built around the {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API WebGL} API
 * 
 * Only available in browser contexts
 */
export class WebglCanvas {

  static defaultOptions: WebglCanvasOptions = {
    onlost: () => {},
    onrestored: () => {},
    useDpi: true
  };
  /** Canvas HTML element being used as a rendering surface */
  public el: HTMLCanvasElement;
  /** Rendering context - see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext} */
  public gl: WebGLRenderingContext;
  /** View width (CSS pixels) */
  public width: number;
  /** View height (CSS pixels) */
  public height: number;
  /** 
   * Backing canvas width (real pixels)
   * Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels
   */
  public screenWidth: number;
  /** 
   * Backing canvas height (real pixels)
   * Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels
   */
  public screenHeight: number;

  private options: WebglCanvasOptions;
  private program: ProgramInfo; // for drawing renderbuffer w/ filtering
  private quadBuffer: BufferInfo;
  private paletteBuffer = new Uint32Array(16);
  private frameBuffer: Uint32Array;
  private frameBufferBytes: Uint8Array; // will be same memory as frameBuffer, just uint8 for webgl texture

  private frameTexture: WebGLTexture;
  private textureWidth: number;
  private textureHeight: number;
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
    this.el = document.createElement('canvas');
    this.width = width;
    this.height = height;
    this.options = { ...WebglCanvas.defaultOptions, ...options };
    this.el.addEventListener('webglcontextlost', this.handleContextLoss, false);
    this.el.addEventListener('webglcontextrestored', this.handleContextRestored, false);
    this.gl = this.el.getContext('webgl', {
      antialias: false,
      alpha: true
    });
    if (parent) parent.appendChild(this.el);
    this.init();
  }

  private init() {
    const gl = this.gl;
    this.program = this.createProgram(quadShader, drawFrame);
    this.quadBuffer = this.createScreenQuad(-1, -1, 2, 2, 8, 8);
    this.setBuffersAndAttribs(this.program, this.quadBuffer);
    this.frameTexture = this.createTexture(gl.RGBA, gl.LINEAR, gl.CLAMP_TO_EDGE);
    this.setCanvasSize(this.width, this.height);
    // set gl constants
    gl.useProgram(this.program.program);
    gl.bindTexture(gl.TEXTURE_2D, this.frameTexture);
  }

  private createProgram(vertexShaderSource: string, fragmentShaderSource: string) {
    assert(!this.isCtxLost);
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
    assert(!this.isCtxLost);
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
    assert(!this.isCtxLost);
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
    const gl = this.gl;
    setAttributes(program.attribSetters, buffer.attribs);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indices);
  }

  private createTexture(type: number, minMag: number, wrap: number, width = 1, height = 1) {
    assert(!this.isCtxLost);
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
    assert(!this.isCtxLost);
    const dpi = this.options.useDpi ? (window.devicePixelRatio || 1) : 1;
    const internalWidth = width * dpi;
    const internalHeight = height * dpi;
    this.width = width;
    this.height = height;
    this.el.width = internalWidth;
    this.el.height = internalHeight;
    this.screenWidth = internalWidth;
    this.screenHeight = internalHeight;
    this.el.style.width = `${ width }px`;
    this.el.style.height = `${ height }px`;
    const gl = this.gl;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  }

  /**
   * Sets the size of the input pixel arrays
   * @param width 
   * @param height 
   */
  public setInputSize(width: number, height: number) {
    const gl = this.gl;
    this.textureWidth = width;
    this.textureHeight = height;
    // resize frame texture
    gl.bindTexture(gl.TEXTURE_2D, this.frameTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.textureWidth, this.textureHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    this.frameBuffer = new Uint32Array(width * height);
    this.frameBufferBytes = new Uint8Array(this.frameBuffer.buffer); // same memory buffer as rgbaData
  }

  public clear() {
    //  clear whatever's already been drawn
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  public drawFrame(note: FlipnoteParser, frameIndex: number) {
    const {
      gl,
      textureWidth,
      textureHeight,
    } = this;
    // get frame pixels as RGBA buffer
    note.getFramePixelsRgba(frameIndex, this.frameBuffer, this.paletteBuffer);
    // clear whatever's already been drawn
    gl.clear(gl.COLOR_BUFFER_BIT);
    // update texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureWidth, textureHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.frameBufferBytes);
    // prep uniforms
    setUniforms(this.program, {
      u_flipY: true,
      u_tex: this.frameTexture,
      u_textureSize: [this.textureWidth, this.textureHeight],
      u_screenSize: [gl.drawingBufferWidth, gl.drawingBufferHeight],
    });
    // draw!
    gl.drawElements(gl.TRIANGLES, this.quadBuffer.numElements, this.quadBuffer.elementType, 0);
  }

  /**
   * Returns true if the webGL context has returned an error
   */
  public isErrorState() {
    const gl = this.gl;
    const error = gl.getError();
    return error != gl.NO_ERROR && error != gl.CONTEXT_LOST_WEBGL;
  }

  /**
   * Only a certain number of WebGL contexts can be added to a single page before the browser will start culling old contexts. 
   * This method returns true if it has been culled, false if not
   */
  public isLost() {
    return this.gl.isContextLost();
  }

  private handleContextLoss = (e: Event) => {
    e.preventDefault();
    this.destroy();
    this.isCtxLost = true;
    this.options.onlost();
  }

  private handleContextRestored = (e: Event) => {
    this.isCtxLost = false;
    this.init();
    this.options.onrestored();
  }

  /**
   * Frees any resources used by this canvas instance
   */
  public async destroy() {
    const refs = this.refs;
    const gl = this.gl;
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
    // shrink the canvas to reduce memory usage until it is garbage collected
    gl.canvas.width = 1;
    gl.canvas.height = 1;
  }
}