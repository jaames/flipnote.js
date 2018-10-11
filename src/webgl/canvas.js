import vertexShader from "./shader.vert";
import fragmentShader from "./shader.frag";

/** webgl canvas wrapper class */
export default class webglCanvas {
  /**
  * Create a rendering canvas
  * @param {HTMLCanvasElement} el - The HTML canvas element
  * @param {number} width - width of the canvas in pixels
  * @param {number} height - height of the canvas in pixels
  * @param {Object} params - optional params to pass to web gl context
  */
  constructor(el, width=640, height=480, params={antialias: false, alpha: false}) {
    this.width = el.width = width;
    this.height = el.height = height; 
    var gl = el.getContext("webgl", params);
    var program = gl.createProgram();
    this.program = program;
    this.el = el;
    this.gl = gl;
    this.refs = {
      shaders:[],
      textures:[],
      buffers: []
    };
    // set up shaders
    var vShader = this._createShader(gl.VERTEX_SHADER, vertexShader);
    var fShader = this._createShader(gl.FRAGMENT_SHADER, fragmentShader);
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
    this.uniforms = {};
    let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      let name = gl.getActiveUniform(program, i).name;
      this.uniforms[name] = gl.getUniformLocation(program, name);
    }
    gl.uniform1i(this.uniforms.u_bitmap, 0);
    this.setFilter("linear");
    this.setMode("PPM");
    this.refs.textures.push(tex);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  }
  
  /**
  * Util to compile and attach a new shader
  * @param {shader type} type - gl.VERTEX_SHADER | gl.FRAGMENT_SHADER
  * @param {string} source - GLSL code for the shader
  * @returns {shader} compiled webgl shader
  * @access protected 
  */
  _createShader(type, source) {
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

  /**
  * get the canvas content as an image
  * @param {string} type - image MIME type, default is image/png
  * @param {number} encoderOptions - number between 0 and 1 indicating image quality if type is image/jpeg or image/webp
  * @returns {DataUrl}
  */
  toImage(type, encoderOptions) {
    return this.el.toDataURL(type, encoderOptions);
  }

  /**
  * Set the texture filter
  * @param {string} filter - "linear" | "nearest"
  */
  setFilter(filter) {
    var gl = this.gl;
    filter = filter == "linear" ? gl.LINEAR : gl.NEAREST;
    gl.uniform1i(this.uniforms.u_isSmooth, filter == "linear" ? 0 : 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  }

  /**
  * Set the canvas mode depending on format
  * @param {string} mode - "KWZ" | "PPM"
  */
  setMode(mode) {
    const { gl } = this;
    if (mode === "PPM") {
      this.textureType = gl.ALPHA;
    } else if (mode === "KWZ") {
      this.textureType = gl.LUMINANCE_ALPHA;
    }
  }

  /**
  * Set a color
  * @param {string} color - name of the color's uniform variable
  * @param {array} value - r,g,b color, each channel's value should be between 0 and 255
  */
  setColor(color, value) {
    this.gl.uniform4f(this.uniforms[color], value[0]/255, value[1]/255, value[2]/255, 1);
  }

  /**
  * Set an palette individual color
  * @param {array} value - r,g,b color, each channel's value should be between 0 and 255
  */
  setPaperColor(value) {
    this.gl.clearColor(value[0] / 255, value[1] / 255, value[2] / 255, 1);
  }

  /**
  * Draw a single frame layer
  * @param {Uint16Array} buffer - layer pixels
  * @param {number} width - layer width
  * @param {number} height - layer height
  * @param {array} color1 - r,g,b for layer color 1, each channel's value should be between 0 and 255
  * @param {array} color2 - r,g,b for layer color 2, each channel's value should be between 0 and 255
  * @param {number} depth - layer depth (kwz only, but currently unused)
  */
  drawLayer(buffer, width, height, color1, color2, depth) {
    let gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    gl.texImage2D(gl.TEXTURE_2D, 0, this.textureType, width, height, 0, this.textureType, gl.UNSIGNED_BYTE, buffer);
    // gl.uniform1f(gl.getUniformLocation(this.program, "u_layerDepth"), -depth/6);
    this.setColor("u_color1", color1);
    this.setColor("u_color2", color2);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  /**
  * Resize canvas
  * @param {number} width - width of the canvas in pixels
  * @param {number} height - height of the canvas in pixels
  */
  resize(width=640, height=480) {
    this.el.width = width;
    this.el.height = height; 
    this.width = width;
    this.height = height;
    this.gl.viewport(0, 0, width, height);
  }

  /**
  * Clear canvas
  */
  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  /** 
  * Destroy this canvas instance
  */
  destroy() {
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