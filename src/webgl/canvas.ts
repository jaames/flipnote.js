
import vertexShader from './shader.vert';
import fragmentShader from './shader.frag';

interface UniformMap {
  [key : string]: WebGLUniformLocation;
};

interface ResourceMap {
  shaders: WebGLShader[],
  textures: WebGLTexture[],
  buffers: WebGLBuffer[]
}

export enum TextureType {
  Alpha = WebGLRenderingContext.ALPHA,
  LuminanceAlpha = WebGLRenderingContext.LUMINANCE_ALPHA,
};

/** webgl canvas wrapper class */
export class WebglCanvas {

  public width: number;
  public height: number;
  public el: HTMLCanvasElement;
  public gl: WebGLRenderingContext;

  private program: WebGLProgram;
  private textureType: TextureType;
  private textureBuffer: Uint8ClampedArray;
  private textureWidth: number;
  private textureHeight: number;
  private uniforms: UniformMap = {};
  private refs: ResourceMap = {
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
    this.createProgram();
    this.setCanvasSize(width, height);
    this.createScreenQuad();
    this.createBitmapTexture();
    this.setTextureFmt(TextureType.Alpha, 256, 192);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  }

  private createProgram() {
    const gl = this.gl;
    const program = gl.createProgram();
    // set up shaders
    gl.attachShader(program, this.createShader(gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(program, this.createShader(gl.FRAGMENT_SHADER, fragmentShader));
    // link program
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      let log = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(log);
    }
    // activate the program
    gl.useProgram(program);
    // map uniform locations
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let index = 0; index < uniformCount; index++) {
      const name = gl.getActiveUniform(program, index).name;
      this.uniforms[name] = gl.getUniformLocation(program, name);
    }
    this.program = program;
  }

  private createScreenQuad() {
    const gl = this.gl;
    // create quad that fills the screen, this will be our drawing surface
    const vertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1,  1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    this.refs.buffers.push(vertBuffer);
  }

  private createBitmapTexture() {
    const gl = this.gl;
    // create texture to use as the layer bitmap
    gl.activeTexture(gl.TEXTURE0);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(this.uniforms['u_bitmap'], 0);
    this.refs.textures.push(tex);
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

  public setInputSize(width: number, height: number) {
    this.gl.uniform2f(this.uniforms['u_textureSize'], width, height);
    this.setTextureFmt(this.textureType, width, height);
  }

  public setCanvasSize(width: number, height: number) {
    const dpi = window.devicePixelRatio || 1;
    const internalWidth = width * dpi;
    const internalHeight = height * dpi;
    this.el.width = internalWidth;
    this.el.height = internalHeight;
    this.width = internalWidth;
    this.height = internalHeight;
    this.gl.viewport(0, 0, internalWidth, internalHeight);
    this.gl.uniform2f(this.uniforms['u_screenSize'], internalWidth, internalHeight);
    this.el.style.width = `${ width }px`;
    this.el.style.height = `${ height }px`;
  }
  
  public setTextureFmt(textureType: TextureType, width: number, height: number) {
    this.textureType = textureType;
    this.textureWidth = width;
    this.textureHeight = height;
    if (textureType === TextureType.Alpha)
      this.textureBuffer = new Uint8ClampedArray(width * height);
    else if (textureType === TextureType.LuminanceAlpha)
      this.textureBuffer = new Uint8ClampedArray(width * height * 2);
  }

  public toImage(type?: string) {
    return this.el.toDataURL(type);
  }

  public setColor(color: string, value: number[]) {
    this.gl.uniform4f(this.uniforms[color], value[0] / 255, value[1] / 255, value[2] / 255, value[3] / 255);
  }

  public setPaperColor(value: number[]) {
    this.gl.clearColor(value[0] / 255, value[1] / 255, value[2] / 255, value[3] / 255);
  }

  private copyPixelsToTexture(pixels: Uint8Array) {
    const data = this.textureBuffer;
    data.fill(0);
    if (this.textureType === TextureType.Alpha) {
      for (let i = 0; i < pixels.length; i++) {
        if (pixels[i] === 1)
          data[i] = 0xFF;
      }
    }
    else if (this.textureType === TextureType.LuminanceAlpha) {
      for (let i = 0, o = 0; i < pixels.length; i++, o+=2) {
        if (pixels[i] === 1)
          data[o + 1] = 0xFF;
        else if (pixels[i] === 2)
          data[o] = 0xFF;
      }
    }
  }

  public drawPixels(pixels: Uint8Array, color1: number[], color2: number[]) {
    const gl = this.gl;
    this.copyPixelsToTexture(pixels);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      this.textureType,
      this.textureWidth,
      this.textureHeight,
      0, 
      this.textureType, 
      gl.UNSIGNED_BYTE, 
      this.textureBuffer
    );
    this.setColor('u_color1', color1);
    this.setColor('u_color2', color2);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  public resize(width=640, height=480) {
    this.setCanvasSize(width, height);
  }

  public clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
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
    gl.deleteProgram(this.program);
    // shrink the canvas to reduce memory usage until it is garbage collected
    gl.canvas.width = 1;
    gl.canvas.height = 1;
  }
}