/*!
 * flipnote.js v1.5.1
 * Real-time, browser-based playback of Flipnote Studio's .ppm animation format
 * 2018 James Daniel
 * github.com/jaames/flipnote.js
 * Flipnote Studio is (c) Nintendo Co., Ltd.
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["flipnote"] = factory();
	else
		root["flipnote"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vertexShaderGlsl = __webpack_require__(3);

var _vertexShaderGlsl2 = _interopRequireDefault(_vertexShaderGlsl);

var _fragmentShaderGlsl = __webpack_require__(4);

var _fragmentShaderGlsl2 = _interopRequireDefault(_fragmentShaderGlsl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** webgl canvas wrapper class */
var webglCanvas = function () {
  /**
  * Create a rendering canvas
  * @param {HTMLCanvasElement} el - The HTML canvas element
  * @param {number} width - width of the canvas in pixels
  * @param {number} height - height of the canvas in pixels
  * @param {Object} params - optional params to pass to web gl context
  */
  function webglCanvas(el, width, height, params) {
    _classCallCheck(this, webglCanvas);

    el.width = width || 256;
    el.height = height || 192;
    var gl = el.getContext("webgl", params || { antialias: false });
    var program = gl.createProgram();
    this.program = program;
    this.el = el;
    this.gl = gl;
    this.refs = {
      shaders: [],
      textures: [],
      buffers: []
    };
    // set up shaders
    var vShader = this._createShader(gl.VERTEX_SHADER, _vertexShaderGlsl2.default);
    var fShader = this._createShader(gl.FRAGMENT_SHADER, _fragmentShaderGlsl2.default);
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    // link program
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    // activate the program
    gl.useProgram(program);
    // create quad that fills the screen, this will be our drawing surface
    var vertBuffer = gl.createBuffer();
    this.refs.buffers.push(vertBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    // create textures for each layer
    this._createTexture("u_layer1Bitmap", 0, gl.TEXTURE0);
    this._createTexture("u_layer2Bitmap", 1, gl.TEXTURE1);
    this.setFilter();
    this.setLayerVisibilty(1, true);
    this.setLayerVisibilty(2, true);
  }

  /**
  * Util to compile and attach a new shader
  * @param {shader type} type - gl.VERTEX_SHADER | gl.FRAGMENT_SHADER
  * @param {string} source - GLSL code for the shader
  * @returns {shader} compiled webgl shader
  * @access protected 
  */


  _createClass(webglCanvas, [{
    key: "_createShader",
    value: function _createShader(type, source) {
      var gl = this.gl;
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      // test if shader compilation was successful
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      this.refs.shaders.push(shader);
      return shader;
    }

    /**
    * Util to set up a texture
    * @param {string} name - name of the texture's uniform variable
    * @param {number} index - texture index
    * @param {texture} texture - webgl texture unit, gl.TEXTURE0, gl.TEXTURE1, etc
    * @access protected 
    */

  }, {
    key: "_createTexture",
    value: function _createTexture(name, index, texture) {
      var gl = this.gl;
      gl.uniform1i(gl.getUniformLocation(this.program, name), index);
      gl.activeTexture(texture);
      var tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      this.refs.textures.push(tex);
    }

    /**
    * Set the texture filter
    * @param {string} filter - "linear" | "nearest"
    */

  }, {
    key: "setFilter",
    value: function setFilter(filter) {
      var gl = this.gl;
      filter = filter == "linear" ? gl.LINEAR : gl.NEAREST;
      [gl.TEXTURE0, gl.TEXTURE1].map(function (texture) {
        gl.activeTexture(texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      });
    }

    /**
    * Set layer visibility
    * @param {number} layerIndex - 1 or 2
    * @param {number} flag - 1 - show, 0 = hide
    */

  }, {
    key: "setLayerVisibilty",
    value: function setLayerVisibilty(layerIndex, flag) {
      this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_layer" + layerIndex + "Visibility"), flag);
    }

    /**
    * Set an palette individual color
    * @param {string} color - name of the color's uniform variable
    * @param {array} value - r,g,b,a color, each channel's value should be between 0.0 and 1.0
    */

  }, {
    key: "setColor",
    value: function setColor(color, value) {
      this.gl.uniform4f(this.gl.getUniformLocation(this.program, color), value[0] / 255, value[1] / 255, value[2] / 255, value[3] / 255);
    }

    /**
    * Set the palette
    * @param {array} colors - array of r,g,b,a colors with channel values from 0.0 to 1.0, in order of paper, layer1, layer2
    */

  }, {
    key: "setPalette",
    value: function setPalette(colors) {
      this.setColor("u_paperColor", colors[0]);
      this.setColor("u_layer1Color", colors[1]);
      this.setColor("u_layer2Color", colors[2]);
    }

    /**
    * Set layer bitmaps
    * @param {array} buffers - array of two uint8 buffers, one for each layer
    */

  }, {
    key: "setBitmaps",
    value: function setBitmaps(buffers) {
      var gl = this.gl;
      gl.activeTexture(gl.TEXTURE0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, 256, 192, 0, gl.ALPHA, gl.UNSIGNED_BYTE, buffers[0]);
      gl.activeTexture(gl.TEXTURE1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, 256, 192, 0, gl.ALPHA, gl.UNSIGNED_BYTE, buffers[1]);
    }

    /**
    * Resize canvas
    * @param {number} width - width of the canvas in pixels
    * @param {number} height - height of the canvas in pixels
    */

  }, {
    key: "resize",
    value: function resize() {
      var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 256;
      var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 192;

      this.el.width = width;
      this.el.height = height;
      this.gl.viewport(0, 0, width, height);
    }

    /**
    * Redraw canvas
    */

  }, {
    key: "refresh",
    value: function refresh() {
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    /**
    * Clear canvas
    */

  }, {
    key: "clear",
    value: function clear() {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    /** 
    * Destroy this canvas instance
    */

  }, {
    key: "destroy",
    value: function destroy() {
      // free resources
      var refs = this.refs;
      var gl = this.gl;
      refs.shaders.forEach(function (shader) {
        gl.deleteShader(shader);
      });
      refs.shaders = [];
      refs.textures.forEach(function (texture) {
        gl.deleteTexture(texture);
      });
      refs.textures = [];
      refs.buffers.forEach(function (buffer) {
        gl.deleteBuffer(buffer);
      });
      refs.buffers = [];
      gl.deleteProgram(this.program);
      // shrink the canvas to reduce memory usage until its garbage collected
      gl.canvas.width = 1;
      gl.canvas.height = 1;
    }
  }]);

  return webglCanvas;
}();

exports.default = webglCanvas;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _player = __webpack_require__(2);

var _player2 = _interopRequireDefault(_player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import decoder from "./decoder";

module.exports = {
  version: "1.5.1",
  player: _player2.default
  // decoder: decoder,
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _canvas = __webpack_require__(0);

var _canvas2 = _interopRequireDefault(_canvas);

var _captureCanvas = __webpack_require__(5);

var _captureCanvas2 = _interopRequireDefault(_captureCanvas);

var _decoder = __webpack_require__(6);

var _decoder2 = _interopRequireDefault(_decoder);

var _loader = __webpack_require__(9);

var _loader2 = _interopRequireDefault(_loader);

var _audio = __webpack_require__(13);

var _audio2 = _interopRequireDefault(_audio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// internal framerate value -> FPS table
var FRAMERATES = {
  1: 0.5,
  2: 1,
  3: 2,
  4: 4,
  5: 6,
  6: 12,
  7: 20,
  8: 30
};

/** flipnote player API, based on HTMLMediaElement (https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) */

var ppmPlayer = function () {
  /**
  * Create new flipnote player
  * @param {string | HTMLCanvasElement} el - HTML Canvas Element to use, or CSS selector for one
  * @param {number} width - canvas width in pixels
  * @param {number} height - canvas height in pixels
  */
  function ppmPlayer(el, width, height) {
    _classCallCheck(this, ppmPlayer);

    // if `el` is a string, use it to select an Element, else assume it's an element
    el = "string" == typeof el ? document.querySelector(el) : el;
    this.canvas = new _canvas2.default(el, width, height);
    this._imgCanvas = new _captureCanvas2.default();
    this._isOpen = false;
    this._events = {};
    this.loop = false;
    this.currentFrame = 0;
    this.paused = true;
    this.audioTracks = [new _audio2.default("se1"), new _audio2.default("se2"), new _audio2.default("se3"), new _audio2.default("bgm")];
  }

  /**
  * Get the index of the current frame 
  */


  _createClass(ppmPlayer, [{
    key: "_load",


    /**
    * Load a Flipnote into the player
    * @param {ArrayBuffer} buffer - ppm data
    * @access protected
    */
    value: function _load(buffer) {
      var ppm = new _decoder2.default(buffer);
      var meta = ppm.meta;
      this.ppm = ppm;
      this.meta = meta;
      this.frameCount = ppm.frameCount;
      this.frameSpeed = ppm.frameSpeed;
      this.fileLength = ppm.fileLength;
      this.loop = meta.loop == 1;
      this.paused = true;
      this._isOpen = true;
      if (ppm.soundMeta.se1.length) this.audioTracks[0].set(this.ppm.decodeAudio("se1"), 1);
      if (ppm.soundMeta.se2.length) this.audioTracks[1].set(this.ppm.decodeAudio("se2"), 1);
      if (ppm.soundMeta.se3.length) this.audioTracks[2].set(this.ppm.decodeAudio("se3"), 1);
      if (ppm.soundMeta.bgm.length) this.audioTracks[3].set(this.ppm.decodeAudio("bgm"), this._audiorate);
      this._seFlags = this.ppm.decodeSoundFlags();
      this._playbackFrameTime = 0;
      this._lastFrameTime = 0;
      this._hasPlaybackStarted = false;
      this.setFrame(this.ppm.thumbFrameIndex);
      this.emit("load");
    }

    /**
    * Load a Flipnote into the player
    * @param {String} source - ppm url
    */

  }, {
    key: "open",
    value: function open(source) {
      var _this = this;

      if (this._isOpen) this.close();
      return (0, _loader2.default)(source).then(function (buffer) {
        _this._load(buffer);
      }).catch(function (err) {
        console.error("Error loading Flipnote:", err);
      });
    }

    /**
    * Close the currently loaded Flipnote and clear the player canvas
    */

  }, {
    key: "close",
    value: function close() {
      this.pause();
      this.ppm = null;
      this._isOpen = false;
      this.paused = true;
      this.loop = null;
      this.meta = null;
      this.frameCount = null;
      this.frameSpeed = null;
      this._frame = 0;
      for (var i = 0; i < this.audioTracks.length; i++) {
        this.audioTracks[i].unset();
      }
      this._seFlags = null;
      this._hasPlaybackStarted = null;
      this.canvas.clear();
      this._imgCanvas.clear();
    }

    /**
    * Destroy this player instance cleanly
    */

  }, {
    key: "destroy",
    value: function destroy() {
      this.close();
      this.canvas.destroy();
      this._imgCanvas.destroy();
    }

    /**
    * Play the sound effects for a given frame
    * @param {number} index - zero-based frame index
    * @access protected
    */

  }, {
    key: "_playFrameSe",
    value: function _playFrameSe(index) {
      var flags = this._seFlags[index];
      for (var i = 0; i < flags.length; i++) {
        if (flags[i] && this.audioTracks[i].active) this.audioTracks[i].start();
      }
    }

    /**
    * Play the Flipnote BGM
    * @access protected
    */

  }, {
    key: "_playBgm",
    value: function _playBgm() {
      this.audioTracks[3].start(this.currentTime);
    }

    /**
    * Stop all audio tracks
    * @access protected
    */

  }, {
    key: "_stopAudio",
    value: function _stopAudio() {
      for (var i = 0; i < this.audioTracks.length; i++) {
        this.audioTracks[i].stop();
      }
    }

    /**
    * Internal requestAnimationFrame handler
    * @param {number} now - current time
    * @access protected
    */

  }, {
    key: "_playbackLoop",
    value: function _playbackLoop(now) {
      var dt = (now - this._lastFrameTime) / (1000 / 60);
      var frame = this.currentFrame;
      if (this._playbackFrameTime >= 60 / this.framerate) {
        this._playFrameSe(frame);
        this.nextFrame();
        this._playbackFrameTime = 0;
      }
      if (frame >= this.frameCount - 1) {
        this._stopAudio();
        if (this.loop) {
          this.firstFrame();
          this._playBgm(0);
          this.emit("playback:loop");
        } else {
          this.pause();
          this.emit("playback:end");
        }
      }
      this._playbackFrameTime += dt;
      this._lastFrameTime = now;
      if (!this.paused) requestAnimationFrame(this._playbackLoop.bind(this));
    }

    /**
    * Begin Flipnote playback
    */

  }, {
    key: "play",
    value: function play() {
      if (!this._isOpen || !this.paused) return null;
      this.paused = false;
      if (!this._hasPlaybackStarted || !this.loop && this.currentFrame == this.frameCount - 1) this._frame = 0;
      this._lastFrameTime = performance.now();
      this._playBgm();
      this._playbackLoop(this._lastFrameTime);
      this._hasPlaybackStarted = true;
      this.emit("playback:start");
    }

    /**
    * Pause Flipnote playback
    */

  }, {
    key: "pause",
    value: function pause() {
      if (!this._isOpen || this.paused) return null;
      // break the playback loop
      this.paused = true;
      this._stopAudio();
      this.emit("playback:stop");
    }

    /**
    * Get a specific frame as an image data URL
    * @param {number} index - zero-based frame index
    * @param {string} type - image MIME type, default is image/png
    * @param {number} encoderOptions - number between 0 and 1 indicating image quality if type is image/jpeg or image/webp
    */

  }, {
    key: "getFrameImage",
    value: function getFrameImage(index, width, height, type, encoderOptions) {
      if (!this._isOpen) return null;
      var canvas = this._imgCanvas;
      if (canvas.width !== width || canvas.height !== height) canvas.setSize(width, height);
      // clamp frame index
      index = Math.max(0, Math.min(index, this.frameCount - 1));
      canvas.setPalette(this.ppm.getFramePalette(index));
      canvas.setBitmaps(this.ppm.decodeFrame(index));
      canvas.refresh();
      return canvas.toImage(type, encoderOptions);
    }

    /**
    * Get a Flipnote thumbnail as an image data URL
    * @param {string} type - image MIME type, default is image/png
    * @param {number} encoderOptions - number between 0 and 1 indicating image quality if type is image/jpeg or image/webp
    */

  }, {
    key: "getThumbImage",
    value: function getThumbImage(width, height, type, encoderOptions) {
      return this.getFrameImage(this.ppm.thumbFrameIndex, width, height, type, encoderOptions);
    }

    /**
    * Jump to a specific frame
    * @param {number} index - zero-based frame index
    */

  }, {
    key: "setFrame",
    value: function setFrame(index) {
      if (!this._isOpen || index === this.currentFrame) return null;
      // clamp frame index
      index = Math.max(0, Math.min(Math.floor(index), this.frameCount - 1));
      this._frame = index;
      this._playbackFrameTime = 0;
      this.canvas.setPalette(this.ppm.getFramePalette(index));
      this.canvas.setBitmaps(this.ppm.decodeFrame(index));
      this.canvas.refresh();
      this.emit("frame:update", this.currentFrame);
    }

    /**
    * Jump to the thumbnail frame
    */

  }, {
    key: "thumbnailFrame",
    value: function thumbnailFrame() {
      this.currentFrame = this.ppm.thumbFrameIndex;
    }

    /**
    * Jump to the next frame in the animation
    */

  }, {
    key: "nextFrame",
    value: function nextFrame() {
      if (this.loop && this.currentFrame >= this.frameCount - 1) {
        this.currentFrame = 0;
      } else {
        this.currentFrame += 1;
      }
    }

    /**
    * Jump to the previous frame in the animation
    */

  }, {
    key: "prevFrame",
    value: function prevFrame() {
      if (this.loop && this.currentFrame <= 0) {
        this.currentFrame = this.frameCount - 1;
      } else {
        this.currentFrame -= 1;
      }
    }

    /**
    * Jump to the last frame in the animation
    */

  }, {
    key: "lastFrame",
    value: function lastFrame() {
      this.currentFrame = this.frameCount - 1;
    }

    /**
    * Jump to the first frame in the animation
    */

  }, {
    key: "firstFrame",
    value: function firstFrame() {
      this.currentFrame = 0;
    }

    /**
    * Resize player canvas
    * @param {number} width - canvas width in pixels
    * @param {number} height - canvas height in pixels
    */

  }, {
    key: "resize",
    value: function resize(width, height) {
      this.canvas.resize(width, height);
    }

    /**
    * Register an event callback
    * @param {string} eventType - event type
    * @param {function} callback - event callback function
    */

  }, {
    key: "on",
    value: function on(eventType, callback) {
      var events = this._events;
      (events[eventType] || (events[eventType] = [])).push(callback);
    }

    /**
    * Remove an event callback
    * @param {string} eventType - event type
    * @param {function} callback - event callback function
    */

  }, {
    key: "off",
    value: function off(eventType, callback) {
      var callbackList = this._events[eventType];
      if (callbackList) callbackList.splice(callbackList.indexOf(callback), 1);
    }

    /**
    * Emit an event (used internally)
    * @param {string} eventType - event type
    * @param {...} args - arguments to be passed to event callback
    */

  }, {
    key: "emit",
    value: function emit(eventType) {
      var callbackList = this._events[eventType] || [];

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      for (var i = 0; i < callbackList.length; i++) {
        callbackList[i].apply(null, args);
      }
    }
  }, {
    key: "currentFrame",
    get: function get() {
      return this._frame;
    }

    /**
    * Set the current frame
    */
    ,
    set: function set(index) {
      this.setFrame(index);
    }

    /**
    * Get current playback time in seconds
    */

  }, {
    key: "currentTime",
    get: function get() {
      return this._isOpen ? this.currentFrame * (1 / this.framerate) : null;
    }

    /**
    * Set current playback time in seconds
    */
    ,
    set: function set(value) {
      if (this._isOpen && value < this.duration && value > 0) {
        this.setFrame(Math.round(value / (1 / this.framerate)));
        this._playbackFrameTime = 0;
      }
    }

    /**
    * Get audio volume
    */

  }, {
    key: "volume",
    get: function get() {
      return this.audioTracks[3].audio.volume;
    }

    /**
    * Set audio volume
    */
    ,
    set: function set(value) {
      for (var i = 0; i < this.audioTracks.length; i++) {
        this.audioTracks[i].audio.volume = value;
      }
    }

    /**
    * Get audio mute
    */

  }, {
    key: "muted",
    get: function get() {
      return this.audioTracks[3].audio.muted;
    }

    /**
    * Set audio mute
    */
    ,
    set: function set(value) {
      for (var i = 0; i < this.audioTracks.length; i++) {
        this.audioTracks[i].audio.muted = value;
      }
    }

    /**
    * Get the duration of the Flipnote in seconds
    */

  }, {
    key: "duration",
    get: function get() {
      return this._isOpen ? this.frameCount * (1 / this.framerate) : null;
    }

    /**
    * Get the Flipnote framerate in frames-per-second
    */

  }, {
    key: "framerate",
    get: function get() {
      return FRAMERATES[this.frameSpeed];
    }

    /**
    * Get the audio playback rate by comparing audio and frame speeds
    * @access protected
    */

  }, {
    key: "_audiorate",
    get: function get() {
      return 1 / FRAMERATES[this.ppm.bgmSpeed] / (1 / FRAMERATES[this.frameSpeed]);
    }
  }]);

  return ppmPlayer;
}();

exports.default = ppmPlayer;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\nattribute vec4 a_position;\nvarying vec2 v_texcoord;\nvoid main() {\n  gl_Position = a_position;\n  v_texcoord = a_position.xy * vec2(0.5, -0.5) + 0.5;\n}";

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\nprecision mediump float;\nvarying vec2 v_texcoord;\nuniform vec4 u_paperColor;\nuniform vec4 u_layer1Color;\nuniform vec4 u_layer2Color;\nuniform bool u_layer1Visibility;\nuniform bool u_layer2Visibility;\nuniform sampler2D u_layer1Bitmap;\nuniform sampler2D u_layer2Bitmap;\nvoid main() {\n  float layer1 = u_layer1Visibility ? texture2D(u_layer1Bitmap, v_texcoord).a * 255.0 : 0.0;\n  float layer2 = u_layer2Visibility ? texture2D(u_layer2Bitmap, v_texcoord).a * 255.0 : 0.0;\n  gl_FragColor = mix(mix(u_paperColor, u_layer2Color, layer2), u_layer1Color, layer1);\n}";

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _canvas2 = __webpack_require__(0);

var _canvas3 = _interopRequireDefault(_canvas2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** 
 * offscreen webgl canvas for capturing frame images
 * this is kept seperate since preserveDrawingBuffer makes drawing slightly slower
 */
var captureCanvas = function (_canvas) {
  _inherits(captureCanvas, _canvas);

  function captureCanvas() {
    _classCallCheck(this, captureCanvas);

    var _this = _possibleConstructorReturn(this, (captureCanvas.__proto__ || Object.getPrototypeOf(captureCanvas)).call(this, document.createElement("canvas"), 256, 192, {
      antialias: true,
      preserveDrawingBuffer: true
    }));

    _this.setFilter("linear");
    _this.width = 256;
    _this.height = 256;
    return _this;
  }

  /**
  * set the image size
  * @param {number} width - image width in pixels 
  * @param {number} height - image height in pixels 
  */


  _createClass(captureCanvas, [{
    key: "setSize",
    value: function setSize(width, height) {
      this.resize(width, height);
      this.width = width;
      this.height = height;
    }

    /**
    * get the canvas content as an image
    * @param {string} type - image MIME type, default is image/png
    * @param {number} encoderOptions - number between 0 and 1 indicating image quality if type is image/jpeg or image/webp
    */

  }, {
    key: "toImage",
    value: function toImage(type, encoderOptions) {
      return this.el.toDataURL(type, encoderOptions);
    }
  }]);

  return captureCanvas;
}(_canvas3.default);

exports.default = captureCanvas;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fileReader2 = __webpack_require__(7);

var _fileReader3 = _interopRequireDefault(_fileReader2);

var _adpcm = __webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * PPM decoder
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Reads frames, audio, and metadata from Flipnote Studio PPM files 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Based on my Python PPM decoder implementation (https://github.com/jaames/flipnote-tools)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Credits:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  PPM format reverse-engineering and documentation:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - bricklife (http://ugomemo.g.hatena.ne.jp/bricklife/20090307/1236391313)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - mirai-iro (http://mirai-iro.hatenablog.jp/entry/20090116/ugomemo_ppm)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - harimau_tigris (http://ugomemo.g.hatena.ne.jp/harimau_tigris)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - steven (http://www.dsibrew.org/wiki/User:Steven)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - yellows8 (http://www.dsibrew.org/wiki/User:Yellows8)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - PBSDS (https://github.com/pbsds)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - jaames (https://github.com/jaames)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Identifying the PPM sound codec:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - Midmad from Hatena Haiku
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - WDLMaster from hcs64.com
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Helping me to identify issues with the Python decoder that this is based on:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - Austin Burk (https://sudomemo.net)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Lastly, a huge thanks goes to Nintendo for creating Flipnote Studio, 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  and to Hatena for providing the Flipnote Hatena online service, both of which inspired so many c:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var WIDTH = 256;
var HEIGHT = 192;
var BLACK = [14, 14, 14, 255];
var WHITE = [255, 255, 255, 255];
var BLUE = [10, 57, 255, 255];
var RED = [255, 42, 42, 255];

var ppmDecoder = function (_fileReader) {
  _inherits(ppmDecoder, _fileReader);

  /**
  * Create a ppmDecoder instance
  * @param {ArrayBuffer} arrayBuffer - data to read from
  */
  function ppmDecoder(arrayBuffer) {
    _classCallCheck(this, ppmDecoder);

    var _this = _possibleConstructorReturn(this, (ppmDecoder.__proto__ || Object.getPrototypeOf(ppmDecoder)).call(this, arrayBuffer));

    _this.seek(4);
    // decode header
    // https://github.com/pbsds/hatena-server/wiki/PPM-format#file-header
    _this._frameDataLength = _this.readUint32();
    _this._soundDataLength = _this.readUint32();
    _this.frameCount = Math.min(_this.readUint16() + 1, 999);
    _this.seek(18);
    _this.thumbFrameIndex = _this.readUint16();
    // jump to the start of the animation data section
    // https://github.com/pbsds/hatena-server/wiki/PPM-format#animation-data-section
    _this.seek(0x06A0);
    var offsetTableLength = _this.readUint16();
    // skip padding + flags
    _this.seek(0x06A8);
    // read frame offsets and build them into a table
    _this._frameOffsets = new Uint32Array(offsetTableLength / 4).map(function (value) {
      return 0x06A8 + offsetTableLength + _this.readUint32();
    });
    _this._decodeSoundHeader();
    _this.meta = _this._decodeMeta();
    // create image buffers
    _this._layers = [new Uint8Array(WIDTH * HEIGHT), new Uint8Array(WIDTH * HEIGHT)];
    _this._prevLayers = [new Uint8Array(WIDTH * HEIGHT), new Uint8Array(WIDTH * HEIGHT)];
    _this._prevFrameIndex = 0;
    return _this;
  }

  _createClass(ppmDecoder, [{
    key: "_seekToFrame",


    /**
    * Seek the buffer position to the start of a given frame
    * @param {number} index - zero-based frame index to jump to
    * @access protected
    */
    value: function _seekToFrame(index) {
      this.seek(this._frameOffsets[index]);
    }

    /**
    * Seek the buffer position to the start of a given audio track
    * @param {string} track - track name, "bgm" | "se1" | "se2" | "se3"
    * @access protected
    */

  }, {
    key: "_seekToAudio",
    value: function _seekToAudio(track) {
      this.seek(this.soundMeta[track].offset);
    }

    /**
    * Read an UTF-16 little-endian string (for usernames)
    * @param {number} length - max length of the string in bytes (including padding)
    * @returns {string}
    * @access protected
    */

  }, {
    key: "_readUtf16",
    value: function _readUtf16(length) {
      var str = "";
      var terminated = false;
      for (var i = 0; i < length / 2; i++) {
        var char = this.readUint16();
        // utf16 stings in flipnotes are terminated with null bytes (0x00) 
        if (terminated || char == 0) {
          terminated = true;
          continue;
        }
        str += String.fromCharCode(char);
      }
      return str;
    }

    /**
    * Read a hex string (for FSIDs and filenames)
    * @param {number} length - max length of the string in bytes
    * @param {boolean} reverse - defaults to false, if true, the string will be read in reverse byte order
    * @returns {string}
    * @access protected
    */

  }, {
    key: "_readHex",
    value: function _readHex(length) {
      var reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var ret = [];
      for (var i = 0; i < length; i++) {
        ret.push(this.readUint8().toString(16).padStart(2, "0"));
      }
      if (reverse) ret.reverse();
      return ret.join("").toUpperCase();
    }

    /**
    * Read a HEX string 
    * @returns {string}
    * @access protected
    */

  }, {
    key: "_readFilename",
    value: function _readFilename() {
      var str = "";
      // filename starts with 3 hex bytes
      str += this._readHex(3) + "_";
      // then 13 byte utf8 string
      for (var i = 0; i < 13; i++) {
        str += String.fromCharCode(this.readUint8());
      }
      str += "_";
      // then 2-byte edit count padded to 3 chars
      str += this.readUint16().toString().padStart(3, "0");
      return str;
    }

    /**
    * Unpack the line encoding flags for all 192 lines in a layer
    * @returns {array}
    * @access protected
    */

  }, {
    key: "_readLineEncoding",
    value: function _readLineEncoding() {
      var unpacked = new Uint8Array(HEIGHT);
      for (var byteOffset = 0; byteOffset < 48; byteOffset++) {
        var byte = this.readUint8();
        // each line's encoding type is stored as a 2-bit value
        for (var bitOffset = 0; bitOffset < 8; bitOffset += 2) {
          unpacked[byteOffset * 4 + bitOffset / 2] = byte >> bitOffset & 0x03;
        }
      }
      return unpacked;
    }

    /**
    * Decode the main PPM metadata, like username, timestamp, etc
    * @returns {object}
    * @access protected
    */

  }, {
    key: "_decodeMeta",
    value: function _decodeMeta() {
      // https://github.com/pbsds/hatena-server/wiki/PPM-format#file-header
      this.seek(0x10);
      var lock = this.readUint16(),
          thumbIndex = this.readInt16(),
          rootAuthorName = this._readUtf16(22),
          parentAuthorName = this._readUtf16(22),
          currentAuthorName = this._readUtf16(22),
          parentAuthorId = this._readHex(8, true),
          currentAuthorId = this._readHex(8, true),
          parentFilename = this._readFilename(),
          currentFilename = this._readFilename(),
          rootAuthorId = this._readHex(8, true);
      this.seek(0x9A);
      var timestamp = new Date((this.readUint32() + 946684800) * 1000);
      this.seek(0x06A6);
      var flags = this.readUint16();
      return {
        lock: lock,
        loop: flags >> 1 & 0x01,
        frame_count: this.frameCount,
        frame_speed: this.frameSpeed,
        bgm_speed: this.bgmSpeed,
        thumb_index: thumbIndex,
        timestamp: timestamp,
        spinoff: currentAuthorId !== parentAuthorId || currentAuthorId !== rootAuthorId,
        root: {
          username: rootAuthorName,
          fsid: rootAuthorId
        },
        parent: {
          username: parentAuthorName,
          fsid: parentAuthorId,
          filename: parentFilename
        },
        current: {
          username: currentAuthorName,
          fsid: currentAuthorId,
          filename: currentFilename
        }
      };
    }

    /**
    * Decode the sound header to get audio track lengths and frame/bgm sppeds
    * @access protected
    */

  }, {
    key: "_decodeSoundHeader",
    value: function _decodeSoundHeader() {
      // https://github.com/pbsds/hatena-server/wiki/PPM-format#sound-data-section
      // offset = frame data offset + frame data length + sound effect flags
      var offset = 0x06A0 + this._frameDataLength + this.frameCount;
      // account for multiple-of-4 padding
      if (offset % 4 != 0) offset += 4 - offset % 4;
      this.seek(offset);
      var bgmLen = this.readUint32();
      var se1Len = this.readUint32();
      var se2Len = this.readUint32();
      var se3Len = this.readUint32();
      this.frameSpeed = 8 - this.readUint8();
      this.bgmSpeed = 8 - this.readUint8();
      offset += 32;
      this.soundMeta = {
        "bgm": { offset: offset, length: bgmLen },
        "se1": { offset: offset += bgmLen, length: se1Len },
        "se2": { offset: offset += se1Len, length: se2Len },
        "se3": { offset: offset += se2Len, length: se3Len }
      };
    }

    /**
    * Check whether or not a given frame is based on the previous one
    * @param {number} index - zero-based frame index 
    * @returns {boolean}
    */

  }, {
    key: "_isFrameNew",
    value: function _isFrameNew(index) {
      this._seekToFrame(index);
      var header = this.readUint8();
      return header >> 7 & 0x1;
    }

    /**
    * Helper to decode necessary previous frames if the current frame is difference-based
    * @param {number} index - zero-based frame index 
    */

  }, {
    key: "_decodePrevFrames",
    value: function _decodePrevFrames(index) {
      var backTrack = 0;
      var isNew = 0;
      while (!isNew) {
        backTrack += 1;
        isNew = this._isFrameNew(index - backTrack);
      }
      backTrack = index - backTrack;
      while (backTrack < index) {
        this.decodeFrame(backTrack, false);
        backTrack += 1;
      }
      // jump back to where we were and skip flag byte
      this._seekToFrame(index);
      this.seek(1, 1);
    }

    /**
    * Get the color palette for a given frame
    * @param {number} index - zero-based frame index 
    * @returns {array} rgba palette in order of paper, layer1, layer2
    */

  }, {
    key: "getFramePalette",
    value: function getFramePalette(index) {
      this._seekToFrame(index);
      var header = this.readUint8();
      var paperColor = header & 0x1;
      var pen = [null, paperColor == 1 ? BLACK : WHITE, RED, BLUE];
      return [paperColor == 1 ? WHITE : BLACK, pen[header >> 1 & 0x3], // layer 1 color
      pen[header >> 3 & 0x3]];
    }

    /**
    * Decode a frame
    * @param {number} index - zero-based frame index 
    * @param {boolean} decodePrev - defaults to true, set to false to not bother decoding previous frames
    */

  }, {
    key: "decodeFrame",
    value: function decodeFrame(index) {
      var decodePrev = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      // https://github.com/pbsds/hatena-server/wiki/PPM-format#animation-frame
      this._seekToFrame(index);
      var header = this.readUint8();
      var isNewFrame = header >> 7 & 0x1;
      var isTranslated = header >> 5 & 0x3;
      var translateX = 0;
      var translateY = 0;

      if (decodePrev && !isNewFrame && index !== this._prevFrameIndex + 1) {
        this._decodePrevFrames(index);
      }
      // copy the current layer buffers to the previous ones
      this._prevLayers[0].set(this._layers[0]);
      this._prevLayers[1].set(this._layers[1]);
      this._prevFrameIndex = index;
      // reset current layer buffers
      this._layers[0].fill(0);
      this._layers[1].fill(0);

      if (isTranslated) {
        translateX = this.readInt8();
        translateY = this.readInt8();
      }

      var layerEncoding = [this._readLineEncoding(), this._readLineEncoding()];
      // start decoding layer bitmaps
      for (var layer = 0; layer < 2; layer++) {
        var layerBitmap = this._layers[layer];
        for (var line = 0; line < HEIGHT; line++) {
          var chunkOffset = line * WIDTH;
          var lineType = layerEncoding[layer][line];
          switch (lineType) {
            // line type 0 = blank line, decode nothing
            case 0:
              break;
            // line types 1 + 2 = compressed bitmap line
            case 1:
            case 2:
              var lineHeader = this.readUint32(false);
              // line type 2 starts as an inverted line
              if (lineType == 2) layerBitmap.fill(1, chunkOffset, chunkOffset + WIDTH);
              // loop through each bit in the line header
              while (lineHeader & 0xFFFFFFFF) {
                // if the bit is set, this 8-pix wide chunk is stored
                // else we can just leave it blank and move on to the next chunk
                if (lineHeader & 0x80000000) {
                  var chunk = this.readUint8();
                  // unpack chunk bits
                  for (var pixel = 0; pixel < 8; pixel++) {
                    layerBitmap[chunkOffset + pixel] = chunk >> pixel & 0x1;
                  }
                }
                chunkOffset += 8;
                // shift lineheader to the left by 1 bit, now on the next loop cycle the next bit will be checked
                lineHeader <<= 1;
              }
              break;
            // line type 3 = raw bitmap line
            case 3:
              while (chunkOffset < (line + 1) * WIDTH) {
                var chunk = this.readUint8();
                for (var pixel = 0; pixel < 8; pixel++) {
                  layerBitmap[chunkOffset + pixel] = chunk >> pixel & 0x1;
                }
                chunkOffset += 8;
              }
              break;
          }
        }
      }
      // if the current frame is based on changes from the preivous one, merge them by XORing their values
      if (!isNewFrame) {
        var dest, src;
        for (var y = 0; y < HEIGHT; y++) {
          for (var x = 0; x < WIDTH; x++) {
            dest = x + y * WIDTH;
            src = dest - (translateX + translateY * WIDTH);
            if (!(x - translateX > WIDTH || x - translateX < 0)) {
              this._layers[0][dest] ^= this._prevLayers[0][src];
              this._layers[1][dest] ^= this._prevLayers[1][src];
            }
          }
        }
      }
      return this._layers;
    }

    /**
    * Decode an audio track to 32-bit adpcm
    * @param {string} track - track name, "bgm" | "se1" | "se2" | "se3"
    * @returns {Int16Array}
    */

  }, {
    key: "decodeAudio",
    value: function decodeAudio(track) {
      var _this2 = this;

      this._seekToAudio(track);
      var buffer = new Uint8Array(this.soundMeta[track].length).map(function (value) {
        return _this2.readUint8();
      });
      return (0, _adpcm.decodeAdpcm)(buffer);
    }

    /**
    * Decode the sound effect usage for each frame
    * @returns {array}
    */

  }, {
    key: "decodeSoundFlags",
    value: function decodeSoundFlags() {
      var _this3 = this;

      this.seek(0x06A0 + this._frameDataLength);
      // per msdn docs - the array map callback is only invoked for array indicies that have assigned values
      // so when we create an array, we need to fill it with something before we can map over it
      var arr = new Array(this.frameCount).fill([]);
      return arr.map(function (value) {
        var byte = _this3.readUint8();
        return [byte & 0x1, byte >> 1 & 0x1, byte >> 2 & 0x1];
      });
    }
  }], [{
    key: "validateFSID",
    value: function validateFSID(fsid) {
      return (/[0159]{1}[0-9A-F]{6}0[0-9A-F]{8}/.test(fsid)
      );
    }
  }, {
    key: "validateFilename",
    value: function validateFilename(filename) {
      return (/[0-9A-F]{6}_[0-9A-F]{13}_[0-9]{3}/.test(filename)
      );
    }
  }]);

  return ppmDecoder;
}(_fileReader3.default);

exports.default = ppmDecoder;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** file reader serves as a wrapper around the DataView API to help keep track of the offset into the file */
var fileReader = function () {
  /**
  * Create a fileReader instance
  * @param {ArrayBuffer} arrayBuffer - data to read from
  */
  function fileReader(arrayBuffer) {
    _classCallCheck(this, fileReader);

    this._data = new DataView(arrayBuffer);
    this._offset = 0;
  }

  /**
  * Get the length of the file
  * @returns {number}
  */


  _createClass(fileReader, [{
    key: "seek",


    /**
    * based on the seek method from Python's file objects - https://www.tutorialspoint.com/python/file_seek.htm
    * @param {number} offset - position of the read pointer within the file
    * @param {number} whence - (optional) defaults to absolute file positioning,
    *                          1 = offset is relative to the current position
    *                          2 = offset is relative to the file's end
    */
    value: function seek(offset, whence) {
      switch (whence) {
        case 2:
          this._offset = this._data.byteLength + offset;
          break;
        case 1:
          this._offset += offset;
          break;
        case 0:
        default:
          this._offset = offset;
          break;
      }
    }

    /**
    * Read an unsigned 8-bit integer from the file, and automatically increment the offset
    * @returns {number}
    */

  }, {
    key: "readUint8",
    value: function readUint8() {
      var val = this._data.getUint8(this._offset);
      this._offset += 1;
      return val;
    }

    /**
    * Read a signed 8-bit integer from the file, and automatically increment the offset
    * @returns {number}
    */

  }, {
    key: "readInt8",
    value: function readInt8() {
      var val = this._data.getInt8(this._offset);
      this._offset += 1;
      return val;
    }

    /**
    * Read an unsigned 16-bit integer from the file, and automatically increment the offset
    * @param {boolean} littleEndian - defaults to true, set to false to read data in big endian byte order
    * @returns {number}
    */

  }, {
    key: "readUint16",
    value: function readUint16() {
      var littleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var val = this._data.getUint16(this._offset, littleEndian);
      this._offset += 2;
      return val;
    }

    /**
    * Read a signed 16-bit integer from the file, and automatically increment the offset
    * @param {boolean} littleEndian - defaults to true, set to false to read data in big endian byte order
    * @returns {number}
    */

  }, {
    key: "readInt16",
    value: function readInt16() {
      var littleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var val = this._data.getInt16(this._offset, littleEndian);
      this._offset += 2;
      return val;
    }

    /**
    * Read an unsigned 32-bit integer from the file, and automatically increment the offset
    * @param {boolean} littleEndian - defaults to true, set to false to read data in big endian byte order
    * @returns {number}
    */

  }, {
    key: "readUint32",
    value: function readUint32() {
      var littleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var val = this._data.getUint32(this._offset, littleEndian);
      this._offset += 4;
      return val;
    }

    /**
    * Read a signed 32-bit integer from the file, and automatically increment the offset
    * @param {boolean} littleEndian - defaults to true, set to false to read data in big endian byte order
    * @returns {number}
    */

  }, {
    key: "readInt32",
    value: function readInt32() {
      var littleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var val = this._data.getInt32(this._offset, littleEndian);
      this._offset += 4;
      return val;
    }
  }, {
    key: "fileLength",
    get: function get() {
      return this._data.byteLength;
    }
  }]);

  return fileReader;
}();

exports.default = fileReader;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeAdpcm = decodeAdpcm;
/** convert 4-bit adpcm to 16-bit pcm
 *  implementation based on http://www.cs.columbia.edu/~gskc/Code/AdvancedInternetServices/SoundNoiseRatio/dvi_adpcm.c
*/

var indexTable = [-1, -1, -1, -1, 2, 4, 6, 8, -1, -1, -1, -1, 2, 4, 6, 8];

var stepSizeTable = [7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45, 50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130, 143, 157, 173, 190, 209, 230, 253, 279, 307, 337, 371, 408, 449, 494, 544, 598, 658, 724, 796, 876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358, 5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899, 15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767];

var statePrevSample = 0,
    statePrevIndex = 0;

/**
* Convert 4-bit adpcm to 16-bit pcm
* @param {Uint8Array} inputBuffer - adpcm buffer
* @returns {Int16Array}
*/
function decodeAdpcm(inputBuffer) {
  statePrevSample = 0;
  statePrevIndex = 0;
  var outputBuffer = new Int16Array(inputBuffer.length * 2);
  var outputOffset = 0;
  for (var inputOffset = 0; inputOffset < inputBuffer.length; inputOffset++) {
    var byte = inputBuffer[inputOffset];
    // note - Flipnote Studio's adpcm data uses reverse nibble order
    outputBuffer[outputOffset] = decodeSample(byte & 0xF);
    outputBuffer[outputOffset + 1] = decodeSample(byte >> 4 & 0xF);
    outputOffset += 2;
  }
  return outputBuffer;
};

/**
* Unpack a single adpcm 4-bit sample
* @param {number} sample - sample value
* @returns {number}
* @access protected
*/
function decodeSample(sample) {
  var predSample = statePrevSample;
  var index = statePrevIndex;
  var step = stepSizeTable[index];
  var difference = step >> 3;

  // compute difference and new predicted value
  if (sample & 0x4) difference += step;
  if (sample & 0x2) difference += step >> 1;
  if (sample & 0x1) difference += step >> 2;
  // handle sign bit
  predSample += sample & 0x8 ? -difference : difference;

  // find new index value
  index += indexTable[sample];
  index = clamp(index, 0, 88);

  // clamp output value
  predSample = clamp(predSample, -32767, 32767);
  statePrevSample = predSample;
  statePrevIndex = index;
  return predSample;
};

/**
* Util to clamp a number within a given range
* @param {number} num - input value
* @param {number} min - minimun value
* @param {number} max - maximum value
* @returns {number}
* @access protected
*/
function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = load;

var _urlLoader = __webpack_require__(10);

var _urlLoader2 = _interopRequireDefault(_urlLoader);

var _fileLoader = __webpack_require__(11);

var _fileLoader2 = _interopRequireDefault(_fileLoader);

var _arrayBufferLoader = __webpack_require__(12);

var _arrayBufferLoader2 = _interopRequireDefault(_arrayBufferLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loaders = [_urlLoader2.default, _fileLoader2.default, _arrayBufferLoader2.default];

function load(source) {
  return new Promise(function (resolve, reject) {
    for (var i = 0; i < loaders.length; i++) {
      var loader = loaders[i];
      if (loader.matches(source)) {
        loader.load(source, resolve, reject);
        break;
      }
    }
  });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  matches: function matches(source) {
    return typeof source === "string";
  },

  load: function load(source, resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", source, true);
    xhr.responseType = "arraybuffer";
    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            type: "httpError",
            status: xhr.status,
            statusText: xhr.statusText
          });
        }
      }
    };
    xhr.send(null);
  }

};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  matches: function matches(source) {
    return source instanceof File;
  },

  load: function load(source, resolve, reject) {
    var reader = new FileReader();
    reader.onload = function (event) {
      resolve(event.target.result);
    };
    reader.onerror = function (event) {
      reject({ type: "fileReadError" });
    };
    reader.readAsArrayBuffer(source);
  }

};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  matches: function matches(source) {
    return source instanceof ArrayBuffer;
  },

  load: function load(source, resolve, reject) {
    resolve(source);
  }

};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var audioTrack = function () {
  /**
  * Create a new audio player
  */
  function audioTrack(id) {
    _classCallCheck(this, audioTrack);

    this.id = id;
    this.channelCount = 1;
    this.bitsPerSample = 16;
    this.sampleRate = 8192;
    this.playbackRate = 1;
    this.audio = document.createElement("audio");
    this.audio.preload = true;
    this.active = false;
  }

  /**
  * Set the audio track
  * @param {Int16Array} pcmData - mono-channel 16-bit PCM audio
  * @param {number} playbackRate - audio playback rate (1 = default)
  */


  _createClass(audioTrack, [{
    key: "set",
    value: function set(pcmData, playbackRate) {
      // the HTML5 audio element supports PCM audio if it's in a WAV wrapper
      // to do this we write a WAV header and prepend it to the raw PCM data
      // WAV header reference: http://www.topherlee.com/software/pcm-tut-wavformat.html
      var header = new DataView(new ArrayBuffer(44));
      // "RIFF" indent
      header.setUint32(0, 1179011410, true);
      // filesize
      header.setUint32(4, header.byteLength + pcmData.byteLength, true);
      // "WAVE" indent
      header.setUint32(8, 1163280727, true);
      // "fmt " section header
      header.setUint32(12, 544501094, true);
      // fmt section length
      header.setUint32(16, 16, true);
      // specify audio format is pcm (type 1)
      header.setUint16(20, 1, true);
      // number of audio channels
      header.setUint16(22, this.channelCount, true);
      // audio sample rate
      header.setUint32(24, this.sampleRate * playbackRate, true);
      // byterate = (sampleRate * bitsPerSample * channelCount) / 8
      header.setUint32(28, this.sampleRate * playbackRate * this.bitsPerSample * this.channelCount / 8, true);
      // blockalign = (bitsPerSample * channels) / 8
      header.setUint16(32, this.bitsPerSample * this.channelCount / 8, true);
      // bits per sample
      header.setUint16(34, this.bitsPerSample, true);
      // "data" section header
      header.setUint32(36, 1635017060, true);
      // data section length
      header.setUint32(40, pcmData.byteLength, true);
      // create blob from joining the wav header and pcm data
      this.url = window.URL.createObjectURL(new Blob([header.buffer, pcmData.buffer], { type: "audio/wav" }));
      // use the blob url for the audio element
      this.audio.src = this.url;
      this.active = true;
      this.playbackRate = playbackRate;
      this.length = pcmData.length;
    }
  }, {
    key: "unset",


    /**
    * Clear the audio track
    */
    value: function unset() {
      if (this.active) {
        window.URL.revokeObjectURL(this.url);
        this.audio.src = "";
        this.audio.load();
        this.active = false;
        this.playbackRate = 1;
        this.length = null;
      }
    }

    /**
    * Start audio playback
    * @param {number} offset - offset to begin playback at
    */

  }, {
    key: "start",
    value: function start(offset) {
      if (this.active) {
        this.audio.currentTime = offset || 0;
        this.audio.play();
      }
    }

    /**
    * Stop audio playback
    */

  }, {
    key: "stop",
    value: function stop() {
      if (this.active) {
        this.audio.pause();
      }
    }
  }, {
    key: "duration",
    get: function get() {
      return this.audio.duration;
    }
  }]);

  return audioTrack;
}();

exports.default = audioTrack;

/***/ })
/******/ ]);
});
//# sourceMappingURL=flipnote.js.map