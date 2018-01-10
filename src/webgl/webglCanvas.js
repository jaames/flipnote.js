import vertexShader from "./vertexShader.glsl.js";
import fragmentShader from "./fragmentShader.glsl.js";

export default class webglCanvas {
  constructor(el, width, height) {
    el.width = width || 256;
    el.height = height || 192; 
    var gl = el.getContext("webgl", {
      alpha: false,
      antialias: false,
    });
    this.canvas = el;
    this.gl = gl;
    this.program = gl.createProgram();
    this._createShader(gl.VERTEX_SHADER, vertexShader);
    this._createShader(gl.FRAGMENT_SHADER, fragmentShader);
    gl.linkProgram(this.program);
    gl.useProgram(this.program);
    // create quad that fills the screen, this will be our drawing surface
    var vertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1,  1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    // create textures for each layer
    this._createTexture("u_layer1Bitmap", 0, gl.TEXTURE0);
    this._createTexture("u_layer2Bitmap", 1, gl.TEXTURE1);
  }

  _createShader(type, source) {
    var shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    this.gl.attachShader(this.program, shader);
  }

  _createTexture(name, index, texture) {
    var gl = this.gl;
    gl.uniform1i(gl.getUniformLocation(this.program, name), index);
    gl.activeTexture(texture);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  }

  setColor(color, value) {
    this.gl.uniform4f(this.gl.getUniformLocation(this.program, color), value[0]/255, value[1]/255, value[2]/255, value[3]/255);
  }

  setPalette(colors) {
    this.setColor("u_paperColor", colors[0]);
    this.setColor("u_layer1Color", colors[1]);
    this.setColor("u_layer2Color", colors[2]);
  }

  setBitmaps(bitmaps) {
    var gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, 256, 192, 0, gl.ALPHA, gl.UNSIGNED_BYTE, bitmaps[0]);
    gl.activeTexture(gl.TEXTURE1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, 256, 192, 0, gl.ALPHA, gl.UNSIGNED_BYTE, bitmaps[1]);
  }

  refresh() {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
}