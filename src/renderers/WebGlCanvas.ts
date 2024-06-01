import {
  ProgramInfo,
  BufferInfo,
  setBuffersAndAttributes,
  createProgramInfoFromProgram,
  createBufferInfoFromArrays,
  setUniforms,
} from 'twgl.js';

import { FlipnoteParserBase, FlipnoteStereoscopicEye } from '../parsers';
import { assertBrowserEnv, isBrowser } from '../utils';
import { CanvasInterface, CanvasStereoscopicMode } from './CanvasInterface';

import vertShaderLayer from './shaders/layer.vert';
import fragShaderLayer from './shaders/layer.frag'

import vertShaderUpscale from './shaders/upscale.vert';
import fragShaderUpscale from './shaders/upscale.frag';

/** 
 * Keeps track of WebGl resources so they can be destroyed properly later
 * @internal
 */
interface ResourceMap {
  programs: WebGLProgram[];
  shaders: WebGLShader[];
  textures: WebGLTexture[];
  buffers: WebGLBuffer[];
  frameBuffers: WebGLFramebuffer[];
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
  note: FlipnoteParserBase;
  /** Canvas HTML element being used as a rendering surface */
  canvas: HTMLCanvasElement;
  /** Rendering context - see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext} */
  gl: WebGLRenderingContext;
  /** View width (CSS pixels) */
  width: number;
  /** View height (CSS pixels) */
  height: number;
  /** */
  srcWidth: number;
  /** */
  srcHeight: number;
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
  /** */
  frameIndex: number;
  /** */
  supportedStereoscopeModes = [
    CanvasStereoscopicMode.None,
    CanvasStereoscopicMode.Dual,
    // CanvasStereoscopicMode.Anaglyph, // couldn't get this working, despite spending lots of time on it :/
  ];
  /** */
  stereoscopeMode = CanvasStereoscopicMode.None;
  /** */
  stereoscopeStrength = 0;

  private options: WebglCanvasOptions;
  private layerProgram: ProgramInfo; // for drawing renderbuffer w/ filtering
  private upscaleProgram: ProgramInfo; // for drawing renderbuffer w/ filtering
  private quadBuffer: BufferInfo;
  private paletteBuffer = new Uint32Array(16);

  private layerTexture: WebGLTexture;
  private layerTexturePixelBuffer: Uint32Array;
  private layerTexturePixels: Uint8Array; // will be same memory as layerTexturePixelBuffer, just uint8 for webgl texture

  private frameTexture: WebGLTexture;
  private frameBuffer: WebGLFramebuffer;

  private textureTypes = new Map<WebGLTexture, number>();
  private textureSizes = new Map<WebGLTexture, { width: number, height: number }>();
  private frameBufferTextures = new Map<WebGLFramebuffer, WebGLTexture>();

  private applyFirefoxFix = false;

  private refs: ResourceMap = {
    programs: [],
    shaders: [],
    textures: [],
    buffers: [],
    frameBuffers: []
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
    this.layerProgram = this.createProgram(vertShaderLayer, fragShaderLayer);
    this.upscaleProgram = this.createProgram(vertShaderUpscale, fragShaderUpscale);
    this.quadBuffer = this.createScreenQuad(-1, -1, 2, 2, 1, 1);
    this.setBuffersAndAttribs(this.layerProgram, this.quadBuffer);
    this.layerTexture = this.createTexture(gl.RGBA, gl.LINEAR, gl.CLAMP_TO_EDGE);

    this.frameTexture = this.createTexture(gl.RGBA, gl.LINEAR, gl.CLAMP_TO_EDGE);
    this.frameBuffer = this.createFramebuffer(this.frameTexture);

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    const userAgent = navigator.userAgent;
    const isMacFirefox = userAgent.includes('Firefox') && userAgent.includes('Mac');
    this.applyFirefoxFix = isMacFirefox && renderer.includes('Apple M');
  }

  private createProgram(vertexShaderSource: string, fragmentShaderSource: string) {
    if (this.checkContextLoss()) return;
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
    if (this.checkContextLoss()) return;
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
    if (this.checkContextLoss()) return;
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
    if (this.checkContextLoss()) return;
    setBuffersAndAttributes(this.gl, program.attribSetters, buffer);
  }

  private createTexture(type: number, minMag: number, wrap: number, width = 1, height = 1) {
    if (this.checkContextLoss()) return;
    const gl = this.gl;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minMag);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, minMag);
    gl.texImage2D(gl.TEXTURE_2D, 0, type, width, height, 0, type, gl.UNSIGNED_BYTE, null);
    this.refs.textures.push(tex);
    this.textureTypes.set(tex, type);
    this.textureSizes.set(tex, { width, height });
    return tex;
  }

  private resizeTexture(texture: WebGLTexture, width: number, height: number) {
    if (this.checkContextLoss()) return;
    const gl = this.gl;
    const textureType = this.textureTypes.get(texture);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, textureType, width, height, 0, textureType, gl.UNSIGNED_BYTE, null);
    this.textureSizes.set(texture, { width, height });
  }

  private createFramebuffer(texture: WebGLTexture) {
    if (this.checkContextLoss()) return;
    const gl = this.gl;
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    this.refs.frameBuffers.push(fb);
    this.frameBufferTextures.set(fb, texture);
    return fb;
  }

  private useFramebuffer(fb: WebGLFramebuffer, viewX?: number, viewY?: number, viewWidth?: number, viewHeight?: number) {
    if (this.checkContextLoss()) return;
    const gl = this.gl;
    if (fb === null) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      /**
       * Firefox on Apple Silicon Macs seems to have some kind of viewport sizing bug that I can't track down.
       * Details here: https://github.com/jaames/flipnote.js/issues/30#issuecomment-2134602056
       * Not sure what's causing it, but this hack fixes it for now.
       * Need to test whether only specific versions of Firefox are affected, if it's only an Apple Silicon thing, etc, etc...
       */
      if (this.applyFirefoxFix) {
        const srcWidth = this.srcWidth;
        const srcHeight = this.srcHeight;
        const sx = gl.drawingBufferWidth / srcWidth;
        const sy = gl.drawingBufferHeight / srcHeight;
        const adj = srcWidth === 256 ? 1 : 0; // ??????? why
        viewWidth = gl.drawingBufferWidth * (sx - adj);
        viewHeight = gl.drawingBufferHeight * (sy - adj);
        viewX = -(viewWidth - srcWidth * sx);
        viewY = -(viewHeight - srcHeight * sy);
      }
      gl.viewport(viewX ?? 0, viewY ?? 0, viewWidth ?? gl.drawingBufferWidth, viewHeight ?? gl.drawingBufferHeight);
    } 
    else {
      const tex = this.frameBufferTextures.get(fb);
      const { width, height } = this.textureSizes.get(tex);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.viewport(viewX ?? 0, viewY ?? 0, viewWidth ?? width, viewHeight ?? height);
    }
  }

  private resizeFramebuffer(fb: WebGLFramebuffer, width: number, height: number) {
    if (this.checkContextLoss()) return;
    const texture = this.frameBufferTextures.get(fb);
    this.resizeTexture(texture, width, height);
  }

  /**
   * Resize the canvas surface
   * @param width - New canvas width, in CSS pixels
   * @param height - New canvas height, in CSS pixels
   * 
   * The ratio between `width` and `height` should be 3:4 for best results
   */
  setCanvasSize(width: number, height: number) {
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
    this.checkContextLoss();
  }

  /**
   * Sets the note to use for this player
   */
  setNote(note: FlipnoteParserBase) {
    if (this.checkContextLoss()) return;
    const width = note.imageWidth;
    const height = note.imageHeight;
    this.note = note;
    this.srcWidth = width;
    this.srcHeight = height;
    this.resizeFramebuffer(this.frameBuffer, width, height);
    this.resizeTexture(this.layerTexture, width, height);
    this.layerTexturePixelBuffer = new Uint32Array(width * height);
    this.layerTexturePixels = new Uint8Array(this.layerTexturePixelBuffer.buffer); // same memory buffer as rgbaData
    this.frameIndex = undefined;
    // set canvas alt text
    this.canvas.title = note.getTitle();
  }

  /**
   * Clear the canvas
   * @param color optional RGBA color to use as a background color
   */
  clear(color?: [number, number, number, number]) {
    if (this.checkContextLoss()) return;
    const gl = this.gl;
    const paperColor = color ?? this.note.getFramePalette(this.frameIndex)[0];
    const [r, g, b, a] = paperColor;
    gl.clearColor(r / 255, g / 255, b / 255, a / 255);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  /**
   * Draw a frame from the currently loaded Flipnote
   * @param frameIndex 
   */
  drawFrame(frameIndex: number) {
    if (this.checkContextLoss()) return;

    const gl = this.gl;
    const mode = this.stereoscopeMode;
    const strength = this.stereoscopeStrength;
    this.frameIndex = frameIndex;

    if (mode === CanvasStereoscopicMode.None) {
      this.drawLayers(frameIndex);
      this.useFramebuffer(null);
      this.upscale(gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
    else if (mode === CanvasStereoscopicMode.Dual) {
      this.drawLayers(frameIndex, strength, FlipnoteStereoscopicEye.Left);
      this.useFramebuffer(null, 0, 0, gl.drawingBufferWidth / 2, gl.drawingBufferHeight);
      this.upscale(gl.drawingBufferWidth / 2, gl.drawingBufferHeight);

      this.drawLayers(frameIndex, strength, FlipnoteStereoscopicEye.Right);
      this.useFramebuffer(null, gl.drawingBufferWidth / 2, 0, gl.drawingBufferWidth / 2, gl.drawingBufferHeight);
      this.upscale(gl.drawingBufferWidth / 2, gl.drawingBufferHeight);
    }
  }

  private upscale(width: number, height: number) {
    if (this.checkContextLoss()) return;

    const gl = this.gl;
    gl.useProgram(this.upscaleProgram.program);

    setUniforms(this.upscaleProgram, {
      // u_flipY: true,
      u_tex: this.frameTexture,
      u_textureSize: [this.srcWidth, this.srcHeight],
      u_screenSize: [width, height],
    });

    gl.drawElements(gl.TRIANGLES, this.quadBuffer.numElements, this.quadBuffer.elementType, 0);
  }

  requestStereoScopeMode(mode: CanvasStereoscopicMode) {
    if (this.supportedStereoscopeModes.includes(mode))
      this.stereoscopeMode = mode;
    else
      this.stereoscopeMode = CanvasStereoscopicMode.None;
    this.forceUpdate();
  }
   
  forceUpdate() {
    if (this.frameIndex !== undefined)
      this.drawFrame(this.frameIndex);
  }

  /**
   * Returns true if the webGL context has returned an error
   */
  isErrorState() {
    const gl = this.gl;
    return gl === null || gl.getError() !== gl.NO_ERROR;
  }

  private drawLayers(
    frameIndex: number,
    depthStrength = 0,
    depthEye: FlipnoteStereoscopicEye = FlipnoteStereoscopicEye.Left,
    shouldClear = true,
  ) {
    const gl = this.gl;
    const note = this.note;
    const srcWidth = this.srcWidth;
    const srcHeight = this.srcHeight;
    const numLayers = note.numLayers;
    const layerOrder = note.getFrameLayerOrder(frameIndex);
    const layerDepths = note.getFrameLayerDepths(frameIndex);
    
    this.useFramebuffer(this.frameBuffer);

    if (shouldClear)
      this.clear();

    gl.useProgram(this.layerProgram.program);

    for (let i = 0; i < numLayers; i++) {
      const layerIndex = layerOrder[i];
      note.getLayerPixelsRgba(frameIndex, layerIndex, this.layerTexturePixelBuffer, this.paletteBuffer);
      
      setUniforms(this.layerProgram, {
        u_flipY: true,
        u_tex: this.layerTexture,
        u_textureSize: [srcWidth, srcHeight],
        u_3d_mode: this.stereoscopeMode,
        u_3d_eye: depthEye,
        u_3d_depth: layerDepths[layerIndex],
        u_3d_strength: depthStrength,
      });
      
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, srcWidth, srcHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.layerTexturePixels);
      gl.drawElements(gl.TRIANGLES, this.quadBuffer.numElements, this.quadBuffer.elementType, 0);
    }
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
    this.destroy();
    if (e)
      e.preventDefault();
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
  getDataUrl(type?: string, quality?: any) {
    return this.canvas.toDataURL(type, quality);
  }

  async getBlob(type?: string, quality?: any) {
    return new Promise<Blob>((resolve, reject) => this.canvas.toBlob(resolve, type, quality));
  }

  /**
   * Frees any resources used by this canvas instance
   */
  destroy() {
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
    refs.frameBuffers.forEach((fb) => {
      gl.deleteFramebuffer(fb);
    });
    refs.frameBuffers = [];
    refs.programs.forEach((program) => {
      gl.deleteProgram(program);
    });
    refs.programs = [];
    this.paletteBuffer = null;
    this.layerTexturePixelBuffer = null;
    this.layerTexturePixels = null;
    this.textureTypes.clear();
    this.textureSizes.clear();
    this.frameBufferTextures.clear();
    if (canvas && canvas.parentElement) {
      // shrink the canvas to reduce memory usage until it is garbage collected
      canvas.width = 1;
      canvas.height = 1;
      // remove canvas from dom
      canvas.parentNode.removeChild(canvas);
    }
  }
}