
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

enum TextureType {
  Alpha = WebGLRenderingContext.ALPHA,
  LuminanceAlpha = WebGLRenderingContext.LUMINANCE_ALPHA,
};

export enum FilterType {
  Linear = WebGLRenderingContext.LINEAR,
  Nearest = WebGLRenderingContext.NEAREST,
};

export enum DisplayMode {
  PPM,
  KWZ
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
    this.width = el.width = width;
    this.height = el.height = height; 
    var gl = <WebGLRenderingContext>el.getContext('webgl', params);
    var program = gl.createProgram();
    this.el = el;
    this.gl = gl;
    this.program = program;
    // set up shaders
    var vShader = this.createShader(ShaderType.Vertex, vertexShader);
    var fShader = this.createShader(ShaderType.Fragment, fragmentShader);
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    // link program
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      let log = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(log);
    }
    // activate the program
    gl.useProgram(program);
    // create quad that fills the screen, this will be our drawing surface
    var vertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1,  1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    this.refs.buffers.push(vertBuffer);
    // create texture to use as the layer bitmap
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // get uniform locations
    let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      let name = gl.getActiveUniform(program, i).name;
      this.uniforms[name] = gl.getUniformLocation(program, name);
    }
    gl.uniform1i(this.uniforms['u_bitmap'], 0);
    this.setFilter(FilterType.Linear);
    this.setMode(DisplayMode.PPM);
    this.setInputSize(320, 240);
    this.setCanvasSize(this.width, this.height);
    this.refs.textures.push(tex);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  }

  private createShader(type: ShaderType, source: string) {
    var gl = this.gl;
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    // test if shader compilation was successful
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      let log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(log);
    }
    this.refs.shaders.push(shader);
    return shader;
  }

  public setInputSize(width: number, height: number) {
    console.log(width, height)
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
  
  public setMode(mode: DisplayMode) {
    if (mode === DisplayMode.PPM) {
      this.textureType = TextureType.Alpha;
    } else if (DisplayMode.KWZ) {
      this.textureType = TextureType.LuminanceAlpha;
    }
  }

  public toImage(type?: string) {
    return this.el.toDataURL(type);
  }

  public setFilter(filter: FilterType) {
    var gl = this.gl;
    gl.uniform1i(this.uniforms['u_isSmooth'], filter === FilterType.Linear ? 0 : 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  }

  public setColor(color: string, value: number[]) {
    this.gl.uniform4f(this.uniforms[color], value[0]/255, value[1]/255, value[2]/255, 1);
  }

  public setPaperColor(value: number[]) {
    this.gl.clearColor(value[0] / 255, value[1] / 255, value[2] / 255, 1);
  }

  public drawLayer(buffer: Uint8Array, width: number, height: number, color1: number[], color2: number[]) {
    let gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
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
    var refs = this.refs;
    var gl = this.gl;
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