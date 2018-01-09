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

    var program = gl.createProgram();
    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vertexShader);
    gl.compileShader(vs);
    gl.attachShader(program, vs);
    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fragmentShader);
    gl.compileShader(fs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);
    this.program = program;

     // create quad that fills the screen, this will be our drawing surface
     var positions = [1,  1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1];
     var vertBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
     gl.enableVertexAttribArray(0);
     gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
 
     // create an RGB palette
     this.palette = new Uint8Array(256 * 4);
     gl.uniform1i(gl.getUniformLocation(program, "u_palette"), 0);
     // create palette texture
     gl.activeTexture(gl.TEXTURE0);
     var paletteTex = gl.createTexture();
     gl.bindTexture(gl.TEXTURE_2D, paletteTex);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.palette);
 
     // create image buffer
     this.layers = [
       new Uint8Array(256 * 192),
       new Uint8Array(256 * 192)
     ];
 
     this.layers_prev = [
       new Uint8Array(256 * 192),
       new Uint8Array(256 * 192)
     ];
 
     gl.uniform1i(gl.getUniformLocation(program, "u_layer_1"), 1);
     gl.activeTexture(gl.TEXTURE1);
     this._initBitmap(this.layers[0]);
     gl.uniform1i(gl.getUniformLocation(program, "u_layer_2"), 2);    
     gl.activeTexture(gl.TEXTURE2);
     this._initBitmap(this.layers[1]);
 
     gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);

  }

  _initBitmap(pixelBuffer) {
    var gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, 256, 192, 0, gl.ALPHA, gl.UNSIGNED_BYTE, this.layers[1])
  }

  setPalette(colors) {
    this.palette[0] = colors[0][0];
    this.palette[1] = colors[0][1];
    this.palette[2] = colors[0][2];
    this.palette[3] = 255;
    this.palette[4] =  colors[1][0];
    this.palette[5] =  colors[1][1];
    this.palette[6] =  colors[1][2];
    this.palette[7] = 255;
    this.palette[8] =  colors[2][0];
    this.palette[9] =  colors[2][1];
    this.palette[10] =  colors[2][2];
    this.palette[11] = 255;
    var gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.palette);
  }

  setIsNewFrame(isNewFrame) {
    this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_isNewFrame"), isNewFrame); 
  }

  openFrame(isNewFrame) {
    this.isNewFrame = isNewFrame;
    this.layers_prev[0].set(this.layers[0]);
    this.layers_prev[1].set(this.layers[1]);
    this.layers[0].fill(0);
    this.layers[1].fill(0);
    
  }

  closeFrame() {
    if (!this.isNewFrame) {
      var layer_curr;
      var layer_prev;
      for (let layer = 0; layer < 2; layer++) {
        for (let i = 0; i < this.layers[layer].length; i++) {
          this.layers[layer][i] = this.layers[layer][i] ^ this.layers_prev[layer][i];
        }
      }
    }
    var gl = this.gl;
    gl.activeTexture(gl.TEXTURE1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, 256, 192, 0, gl.ALPHA, gl.UNSIGNED_BYTE, this.layers[0]);
    gl.activeTexture(gl.TEXTURE2);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, 256, 192, 0, gl.ALPHA, gl.UNSIGNED_BYTE, this.layers[1]);
  }

  redraw() {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
}