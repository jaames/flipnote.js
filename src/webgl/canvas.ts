
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

enum ShaderType {
  Vertex = WebGLRenderingContext.VERTEX_SHADER,
  Fragment = WebGLRenderingContext.FRAGMENT_SHADER,
};

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
  private uniforms: UniformMap = {};
  private refs: ResourceMap = {
    shaders: [],
    textures: [],
    buffers: []
  };

  constructor(el: HTMLCanvasElement, width=640, height=480, params={antialias: false, alpha: false}) {
    const gl = <WebGLRenderingContext>el.getContext('webgl', params);
    this.el = el;
    this.gl = gl;
    this.width = el.width = width;
    this.height = el.height = height; 
    this.createProgram();
    this.createScreenQuad();
    this.createBitmapTexture();
    this.setCanvasSize(this.width, this.height);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  }

  private createProgram() {
    const gl = this.gl;
    const program = gl.createProgram();
    // set up shaders
    gl.attachShader(program, this.createShader(ShaderType.Vertex, vertexShader));
    gl.attachShader(program, this.createShader(ShaderType.Fragment, fragmentShader));
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

  private createShader(type: ShaderType, source: string) {
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
  }

  public setCanvasSize(width: number, height: number) {
    this.gl.uniform2f(this.uniforms['u_screenSize'], width, height);
    this.el.width = width;
    this.el.height = height; 
    this.width = width;
    this.height = height;
    this.gl.viewport(0, 0, width, height);
  }
  
  public setLayerType(textureType: TextureType) {
    this.textureType = textureType;
  }

  public toImage(type?: string) {
    return this.el.toDataURL(type);
  }

  public setColor(color: string, value: number[]) {
    this.gl.uniform4f(this.uniforms[color], value[0]/255, value[1]/255, value[2]/255, 1);
  }

  public setPaperColor(value: number[]) {
    this.gl.clearColor(value[0] / 255, value[1] / 255, value[2] / 255, 1);
  }

  public drawLayer(buffer: Uint8Array, width: number, height: number, color1: number[], color2: number[]) {
    const gl = this.gl;
    // gl.activeTexture(gl.TEXTURE0);
    gl.texImage2D(gl.TEXTURE_2D, 0, this.textureType, width, height, 0, this.textureType, gl.UNSIGNED_BYTE, buffer);
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