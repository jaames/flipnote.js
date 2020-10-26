import {
  ProgramInfo,
  BufferInfo,
  setAttributes,
  createProgramInfoFromProgram,
  createBufferInfoFromArrays,
  setUniforms,
} from 'twgl.js';

import { isBrowser } from '../utils';

import quadShader from './shaders/quad.vert';
import layerDrawShader from './shaders/drawLayer.frag';
import postProcessShader from './shaders/postProcess_sharpBilinear.frag';

/** 
 * Keeps track of WebGl resources so they can be destroyed properly later
 * @internal
 */
interface ResourceMap {
  programs: WebGLProgram[];
  shaders: WebGLShader[];
  textures: WebGLTexture[];
  buffers: WebGLBuffer[];
  framebuffers: WebGLFramebuffer[];
};

/** webgl canvas wrapper class */
export class WebglRenderer {
  public el: HTMLCanvasElement;
  public gl: WebGLRenderingContext;
  public screenWidth: number;
  public screenHeight: number;

  private layerDrawProgram: ProgramInfo; // for drawing layers to a renderbuffer
  private postProcessProgram: ProgramInfo; // for drawing renderbuffer w/ filtering
  private quadBuffer: BufferInfo;
  private paletteTexture: WebGLTexture;
  private layerTexture: WebGLTexture;
  private frameTexture: WebGLTexture;
  private frameBuffer: WebGLFramebuffer;
  private textureWidth: number;
  private textureHeight: number;
  private refs: ResourceMap = {
    programs: [],
    shaders: [],
    textures: [],
    buffers: [],
    framebuffers: []
  };

  constructor(el: HTMLCanvasElement, width=640, height=480) {
    if (!isBrowser) {
      throw new Error('The WebGL renderer is only available in browser environments');
    }
    const gl = <WebGLRenderingContext>el.getContext('webgl', {
      antialias: false,
      alpha: true
    });
    this.el = el;
    this.gl = gl;
    this.layerDrawProgram = this.createProgram(quadShader, layerDrawShader);
    this.postProcessProgram = this.createProgram(quadShader, postProcessShader);
    this.quadBuffer = this.createScreenQuad(-1, -1, 2, 2, 8, 8);
    this.setBuffersAndAttribs(this.layerDrawProgram, this.quadBuffer);
    this.setBuffersAndAttribs(this.postProcessProgram, this.quadBuffer);
    this.paletteTexture = this.createTexture(gl.RGBA, gl.NEAREST, gl.CLAMP_TO_EDGE, 256, 1);
    this.layerTexture = this.createTexture(gl.ALPHA, gl.NEAREST, gl.CLAMP_TO_EDGE);
    this.frameTexture = this.createTexture(gl.RGBA, gl.LINEAR, gl.CLAMP_TO_EDGE);
    this.frameBuffer = this.createFrameBuffer(this.frameTexture);
    this.setCanvasSize(width, height);
  }

  private createProgram(vertexShaderSource: string, fragmentShaderSource: string) {
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
      let log = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(log);
    }
    const programInfo = createProgramInfoFromProgram(gl, program);
    this.refs.programs.push(program);
    return programInfo;
  }

  private createShader(type: number, source: string) {
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
    for (let name in bufferInfo.attribs) {
      this.refs.buffers.push(bufferInfo.attribs[name].buffer);
    }
    return bufferInfo;
  }

  private setBuffersAndAttribs(program: ProgramInfo, buffer: BufferInfo) {
    const gl = this.gl;
    setAttributes(program.attribSetters, buffer.attribs);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indices);
  }

  private createTexture(type: number, minMag: number, wrap: number, width = 1, height = 1) {
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

  private createFrameBuffer(colorTexture: WebGLTexture) {
    const gl = this.gl;
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    // enable alpha blending
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    // bind a texture to the framebuffer
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTexture, 0);
    this.refs.framebuffers.push(fb);
    return fb;
  }

  public setCanvasSize(width: number, height: number) {
    const dpi = window.devicePixelRatio || 1;
    const internalWidth = width * dpi;
    const internalHeight = height * dpi;
    this.el.width = internalWidth;
    this.el.height = internalHeight;
    this.screenWidth = internalWidth;
    this.screenHeight = internalHeight;
    this.el.style.width = `${ width }px`;
    this.el.style.height = `${ height }px`;
  }

  public setTextureSize(width: number, height: number) {
    const gl = this.gl;
    this.textureWidth = width;
    this.textureHeight = height;
    // resize frame texture
    gl.bindTexture(gl.TEXTURE_2D, this.frameTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.textureWidth, this.textureHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  }

  public clearFrameBuffer(paperColor: number[]) {
    const gl = this.gl;
    // bind to the frame buffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    gl.viewport(0, 0, this.textureWidth, this.textureHeight);
    // clear it using the paper color
    const [r, g, b, a] = paperColor;
    gl.clearColor(r/255, g/255, b/255, a/255);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  public setPalette(colors: number[][]) {
    const gl = this.gl;
    const data = new Uint8Array(256 * 4);
    let dataPtr = 0;
    for (let i = 0; i < colors.length; i++) {
      const [r, g, b, a] = colors[i];
      data[dataPtr++] = r;
      data[dataPtr++] = g;
      data[dataPtr++] = b;
      data[dataPtr++] = a;
    }
    // update layer texture pixels
    gl.bindTexture(gl.TEXTURE_2D, this.paletteTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
  }

  public drawPixels(pixels: Uint8Array, paletteOffset: number) {
    const {
      gl,
      layerDrawProgram,
      layerTexture,
      textureWidth,
      textureHeight,
    } = this;
    // we wanna draw to the frame buffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    gl.viewport(0, 0, textureWidth, textureHeight);
    // using the layer draw program
    gl.useProgram(layerDrawProgram.program);
    // update layer texture pixels
    gl.bindTexture(gl.TEXTURE_2D, layerTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, textureWidth, textureHeight, 0, gl.ALPHA, gl.UNSIGNED_BYTE, pixels);
    // prep uniforms
    setUniforms(layerDrawProgram, {
      u_palette: this.paletteTexture,
      u_paletteOffset: paletteOffset,
      u_bitmap: layerTexture,
      u_textureSize: [textureWidth, textureHeight],
      u_screenSize: [gl.drawingBufferWidth, gl.drawingBufferHeight],
    });
    // draw screen quad
    gl.drawElements(gl.TRIANGLES, this.quadBuffer.numElements, this.quadBuffer.elementType, 0);
  }

  public composite() {
    const gl = this.gl;
    // setting gl.FRAMEBUFFER will draw directly to the screen
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    // using postprocess program
    gl.useProgram(this.postProcessProgram.program);
    // clear whatever's already been drawn
    gl.clear(gl.COLOR_BUFFER_BIT);
    // prep uniforms
    setUniforms(this.postProcessProgram, {
      u_flipY: true,
      u_tex: this.frameTexture,
      u_textureSize: [this.textureWidth, this.textureHeight],
      u_screenSize: [gl.drawingBufferWidth, gl.drawingBufferHeight],
    });
    // draw screen quad
    gl.drawElements(gl.TRIANGLES, this.quadBuffer.numElements, this.quadBuffer.elementType, 0);
  }

  public resize(width=640, height=480) {
    this.setCanvasSize(width, height);
  }

  public destroy() {
    // free resources
    const refs = this.refs;
    const gl = this.gl;
    refs.shaders.forEach((shader) => {
      gl.deleteShader(shader);
    });
    refs.shaders = [];
    refs.framebuffers.forEach((fb) => {
      gl.deleteFramebuffer(fb);
    });
    refs.framebuffers = [];
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
    // shrink the canvas to reduce memory usage until it is garbage collected
    gl.canvas.width = 1;
    gl.canvas.height = 1;
  }
}