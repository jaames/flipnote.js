import * as twgl from 'twgl.js';

import quadShader from './quad.vert';
import layerDrawShader from './drawLayer.frag';
import postProcessShader from './postProcess_sharpBilinear.frag';

const DEBUG = true;

interface ResourceMap {
  programs: WebGLProgram[];
  shaders: WebGLShader[];
  textures: WebGLTexture[];
  buffers: WebGLBuffer[];
};

/** webgl canvas wrapper class */
export class WebglCanvas {

  public width: number;
  public height: number;
  public el: HTMLCanvasElement;
  public gl: WebGLRenderingContext;

  private layerDrawProgram: twgl.ProgramInfo; // for drawing layers to a renderbuffer
  private postProcessProgram: twgl.ProgramInfo; // for drawing renderbuffer w/ filtering
  private quadBuffer: twgl.BufferInfo;
  private layerTexture: WebGLTexture;
  private frameTexture: WebGLTexture;
  private frameBuffer: twgl.FramebufferInfo;
  private textureWidth: number;
  private textureHeight: number;
  private refs: ResourceMap = {
    programs: [],
    shaders: [],
    textures: [],
    buffers: []
  };

  constructor(el: HTMLCanvasElement, width=640, height=480) {
    const gl = <WebGLRenderingContext>el.getContext('webgl', {
      antialias: false,
      alpha: true
    });
    this.el = el;
    this.gl = gl;
    this.layerDrawProgram = this.createProgram(quadShader, layerDrawShader);
    this.postProcessProgram = this.createProgram(quadShader, postProcessShader);
    // legacy:
    // this.compositeProgram = this.createProgram(vertexShader, fragmentShader);
    this.setCanvasSize(width, height);
    this.quadBuffer = this.createScreenQuad(-1, -1, 2, 2, 8, 8);
    twgl.setBuffersAndAttributes(gl, this.layerDrawProgram, this.quadBuffer);
    twgl.setBuffersAndAttributes(gl, this.postProcessProgram, this.quadBuffer);
    this.layerTexture = this.createTexture();
    this.frameTexture = this.createFrameTexture();
    this.frameBuffer = this.createFrameBuffer(this.frameTexture);

    // gl.activeTexture(gl.TEXTURE1);
    // const level = 0;
    // const internalFormat = gl.RGBA;
    // const border = 0;
    // const format = gl.RGBA;
    // const type = gl.UNSIGNED_BYTE;
    // gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, this.width, this.height, border, format, type, null);

    // const fb = gl.createFramebuffer();
    // gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    // const attachmentPoint = gl.COLOR_ATTACHMENT0;
    // gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, this.frameTexture, 0);
    // this.frameBuffer = fb;
    this.initBlendMode();
  }

  private initBlendMode() {
    const gl = this.gl;
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  }

  private setProgram(programInfo: twgl.ProgramInfo) {
    this.gl.useProgram(programInfo.program);
  }

  private createProgram(vertexShader: string, fragmentShader: string) {
    const programInfo = twgl.createProgramInfo(this.gl, [vertexShader, fragmentShader], (errLog) => {
      throw new Error(errLog);
    });
    const { program } = programInfo;
    this.refs.programs.push(program);
    return programInfo;
  }

  private createScreenQuad(
    x0: number, 
    y0: number,
    width: number,
    height: number,
    xSubdivisions: number,
    ySubdivisions: number,
    flipUv: boolean = false
  ) {
    const numVerts = (xSubdivisions + 1) * (ySubdivisions + 1);
    const numVertsAcross = xSubdivisions + 1;
    const positions = new Float32Array(numVerts * 2);
    const texCoords = new Float32Array(numVerts * 2);
    let positionPtr = 0;
    let texCoordPtr = 0;
    for (let y = 0; y <= ySubdivisions; y++) {
      for (let x = 0; x <= xSubdivisions; x++) {
        const u = x / xSubdivisions;
        const v = y / ySubdivisions;
        positions[positionPtr++] = x0 + width * u;
        positions[positionPtr++] = y0 + height * v;
        texCoords[texCoordPtr++] = u;
        texCoords[texCoordPtr++] = v;
      }
    }
    const indices = new Uint16Array(xSubdivisions * ySubdivisions * 2 * 3);
    let indicesPtr = 0;
    for (let y = 0; y < ySubdivisions; y++) {
      for (let x = 0; x < xSubdivisions; x++) {
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
    return twgl.createBufferInfoFromArrays(this.gl, {
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
  }

  private createTexture() {
    const gl = this.gl;
    const tex = twgl.createTexture(gl, {
      auto: false,
      minMag: gl.NEAREST,
      wrap: gl.CLAMP_TO_EDGE
    });
    return tex;
  }

  private createFrameTexture() {
    const gl = this.gl;
    const tex = twgl.createTexture(gl, {
      auto: false,
      src: null,
      width: 1,
      height: 1,
      minMag: gl.LINEAR,
      wrap: gl.CLAMP_TO_EDGE
    });
    return tex;
  }

  private createFrameBuffer(colorTexture: WebGLTexture) {
    const gl = this.gl;
    const fb = twgl.createFramebufferInfo(gl, [{
      format: gl.RGBA,
      attach: gl.COLOR_ATTACHMENT0,
      attachment: colorTexture
    }], this.textureWidth, this.textureHeight);
    // if (DEBUG) {
    //   const check = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    //   switch (check) {
    //     case gl.FRAMEBUFFER_COMPLETE:
    //       // success
    //       console.log('success')
    //       break;
    //     case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
    //       console.log('incomplete attachment')
    //       break;
    //     case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
    //       console.log('missing attachment')
    //       break;
    //   }
    // }
    return fb;
  }

  public bindScreenBuffer() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.width, this.height);
  }

  public bindFrameBuffer() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer.framebuffer);
    gl.viewport(0, 0, this.textureWidth, this.textureHeight);
  }

  public clearFrameBuffer(value: number[]) {
    const gl = this.gl;
    const [ r, g, b, a ] = value;
    this.bindFrameBuffer();
    gl.clearColor(r/255, g/255, b/255, a/255);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  public setTextureSize(width: number, height: number) {
    const gl = this.gl;
    this.textureWidth = width;
    this.textureHeight = height;
    twgl.resizeTexture(gl, this.frameTexture, {
      width, 
      height
    })
    twgl.resizeFramebufferInfo(gl, this.frameBuffer, [], width, height);
  }

  public setCanvasSize(width: number, height: number) {
    const dpi = window.devicePixelRatio || 1;
    const internalWidth = width * dpi;
    const internalHeight = height * dpi;
    this.el.width = internalWidth;
    this.el.height = internalHeight;
    this.width = internalWidth;
    this.height = internalHeight;
    this.el.style.width = `${ width }px`;
    this.el.style.height = `${ height }px`;
  }

  public drawPixels(pixels: Uint8Array, color1: number[], color2: number[]) {
    const gl = this.gl;
    const layerDrawProgram = this.layerDrawProgram;
    const width = this.textureWidth;
    const height = this.textureHeight;
    const [r1, g1, b1, a1] = color1;
    const [r2, g2, b2, a2] = color2;
    this.bindFrameBuffer();
    gl.useProgram(layerDrawProgram.program);
    twgl.setUniforms(layerDrawProgram, {
      u_debugWireframe: false,
      u_bitmap: this.layerTexture,
      u_screenSize: [this.width, this.height],
      u_textureSize: [width, height],
      u_color1: [r1/255, g1/255, b1/255, a1/255],
      u_color2: [r2/255, g2/255, b2/255, a2/255],
    });
    gl.activeTexture(gl.TEXTURE0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, width, height, 0, gl.ALPHA, gl.UNSIGNED_BYTE, pixels);
    twgl.drawBufferInfo(gl, this.quadBuffer);
    // if (DEBUG) {
    //   twgl.setUniforms(layerDrawProgram, {
    //     u_debugWireframe: true,
    //   });
    //   twgl.drawBufferInfo(gl, this.quadBuffer, gl.LINES);
    // }
  }

  public postProcess() {
    const gl = this.gl;
    gl.useProgram(this.postProcessProgram.program);
    this.bindScreenBuffer();
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    twgl.setUniforms(this.postProcessProgram, {
      u_debugWireframe: false,
      u_flipY: true,
      u_screenSize: [this.width, this.height],
      u_tex: this.frameTexture,
      u_textureSize: [this.textureWidth, this.textureHeight],
    });
    twgl.drawBufferInfo(gl, this.quadBuffer);
    // if (DEBUG) {
    //   twgl.setUniforms(this.postProcessProgram, {
    //     u_debugWireframe: true,
    //   });
    //   twgl.drawBufferInfo(gl, this.quadBuffer, gl.LINES);
    // }
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