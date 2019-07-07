/*!
 * flipnote.js v2.6.2
 * Browser-based playback of .ppm and .kwz animations from Flipnote Studio and Flipnote Studio 3D
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
})(typeof self !== 'undefined' ? self : this, function() {
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./encoders/bmp.js":
/*!*************************!*\
  !*** ./encoders/bmp.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BitmapEncoder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.roundToNearest = roundToNearest;

var _dataStream = __webpack_require__(/*! utils/dataStream */ "./utils/dataStream.js");

var _dataStream2 = _interopRequireDefault(_dataStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// round number to nearest multiple of n
function roundToNearest(value, n) {
  return Math.ceil(value / n) * n;
}

// simple bitmap class for rendering images
// https://en.wikipedia.org/wiki/BMP_file_format

var BitmapEncoder = exports.BitmapEncoder = function () {
  function BitmapEncoder(width, height, bpp) {
    _classCallCheck(this, BitmapEncoder);

    this.width = width;
    this.height = height;
    this.vWidth = roundToNearest(width, 4);
    this.vHeight = roundToNearest(height, 4);
    this.bpp = bpp;
    this.fileHeader = new _dataStream2.default(new ArrayBuffer(14));
    this.fileHeader.writeUtf8("BM"); // "BM" file magic
    // using BITMAPV4HEADER dib header variant:
    this.dibHeader = new _dataStream2.default(new ArrayBuffer(108));
    this.dibHeader.writeUint32(108); // DIB header length
    this.dibHeader.writeInt32(width); // width
    this.dibHeader.writeInt32(height); // height
    this.dibHeader.writeUint16(1); // color panes (always 1)
    this.dibHeader.writeUint16(bpp); // bits per pixel
    this.dibHeader.writeUint32(3); // compression method (3 = BI_BITFIELDS for rgba, 0 = no compression for 8 bit)
    this.dibHeader.writeUint32(this.vWidth * this.height / (bpp / 8)); // image data size, (width * height) / bits per pixel
    this.dibHeader.writeUint32(3780); // x res, pixel per meter
    this.dibHeader.writeUint32(3780); // y res, pixel per meter
    this.dibHeader.writeUint32(0); // the number of colors in the color palette, set by setPalette() method
    this.dibHeader.writeUint32(0); // the number of important colors used, or 0 when every color is important; generally ignored
    this.dibHeader.writeUint32(0x00FF0000); // red channel bitmask
    this.dibHeader.writeUint32(0x0000FF00); // green channel bitmask
    this.dibHeader.writeUint32(0x000000FF); // blue channel bitmask
    this.dibHeader.writeUint32(0xFF000000); // alpha channel bitmask
    this.dibHeader.writeUtf8("Win "); // LCS_WINDOWS_COLOR_SPACE "Win "
    /// rest can be left as nulls
  }

  _createClass(BitmapEncoder, [{
    key: "setFilelength",
    value: function setFilelength(value) {
      this.fileHeader.seek(2);
      this.fileHeader.writeUint32(value);
    }
  }, {
    key: "setPixelOffset",
    value: function setPixelOffset(value) {
      this.fileHeader.seek(10);
      this.fileHeader.writeUint32(value);
    }
  }, {
    key: "setCompression",
    value: function setCompression(value) {
      this.dibHeader.seek(16);
      this.dibHeader.writeUint32(value);
    }
  }, {
    key: "setPaletteCount",
    value: function setPaletteCount(value) {
      this.dibHeader.seek(32);
      this.dibHeader.writeUint32(value);
    }
  }, {
    key: "setPalette",
    value: function setPalette(colors) {
      var palette = new Uint32Array(Math.pow(2, this.bpp));
      for (var index = 0; index < colors.length; index++) {
        var color = colors[index % colors.length];
        // bmp color order is ARGB
        palette[index] = 0xFF000000 | color[0] << 16 | color[1] << 8 | color[2];
      }
      this.setPaletteCount(palette.length); // set number of colors in DIB header
      this.setCompression(0); // set compression to 0 so we're not using 32 bit
      this.palette = palette;
    }
  }, {
    key: "setPixels",
    value: function setPixels(pixelData) {
      var pixels = void 0;
      var pixelsLength = this.vWidth * this.height;
      switch (this.bpp) {
        case 8:
          pixels = new Uint8Array(pixelsLength);
          break;
        case 32:
          pixels = new Uint32Array(pixelsLength);
          break;
      }
      // pixel rows are stored "upside down" in bmps
      var w = this.width;
      for (var y = 0; y < this.height; y++) {
        var srcOffset = w * this.height - (y + 1) * w;
        var destOffset = y * this.width;
        pixels.set(pixelData.slice(srcOffset, srcOffset + this.width), destOffset);
      }
      this.pixels = pixels;
    }
  }, {
    key: "getBlob",
    value: function getBlob() {
      var sections = [this.fileHeader.buffer, this.dibHeader.buffer];
      var headerByteLength = this.fileHeader.byteLength + this.dibHeader.byteLength;
      switch (this.bpp) {
        case 1:
        case 4:
        case 8:
          this.setFilelength(headerByteLength + this.pixels.byteLength + this.palette.byteLength);
          this.setPixelOffset(headerByteLength + this.palette.byteLength);
          sections = sections.concat([this.palette.buffer, this.pixels.buffer]);
          break;
        case 16:
        case 32:
          this.setFilelength(headerByteLength + this.pixels.byteLength);
          this.setPixelOffset(headerByteLength);
          sections = sections.concat([this.pixels.buffer]);
          break;
      }
      return new Blob(sections, { type: "image/bitmap" });
    }
  }, {
    key: "getUrl",
    value: function getUrl() {
      return window.URL.createObjectURL(this.getBlob());
    }
  }, {
    key: "getImage",
    value: function getImage() {
      var img = new Image(this.width, this.height);
      img.src = this.getUrl();
      return img;
    }
  }]);

  return BitmapEncoder;
}();

/***/ }),

/***/ "./encoders/wav.js":
/*!*************************!*\
  !*** ./encoders/wav.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dataStream = __webpack_require__(/*! utils/dataStream */ "./utils/dataStream.js");

var _dataStream2 = _interopRequireDefault(_dataStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var wavEncoder = function () {
  function wavEncoder(sampleRate) {
    var channels = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var bitsPerSample = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 16;

    _classCallCheck(this, wavEncoder);

    this.sampleRate = sampleRate;
    this.channels = channels;
    this.bitsPerSample = bitsPerSample;
    // Write WAV file header
    // Reference: http://www.topherlee.com/software/pcm-tut-wavformat.html
    var headerBuffer = new ArrayBuffer(44);
    var header = new _dataStream2.default(headerBuffer);
    // "RIFF" indent
    header.writeUtf8("RIFF");
    // filesize (set later)
    header.writeUint32(0);
    // "WAVE" indent
    header.writeUtf8("WAVE");
    // "fmt " section header
    header.writeUtf8("fmt ");
    // fmt section length
    header.writeUint32(16);
    // specify audio format is pcm (type 1)
    header.writeUint16(1);
    // number of audio channels
    header.writeUint16(this.channels);
    // audio sample rate
    header.writeUint32(this.sampleRate);
    // byterate = (sampleRate * bitsPerSample * channelCount) / 8
    header.writeUint32(this.sampleRate * this.bitsPerSample * this.channels / 8);
    // blockalign = (bitsPerSample * channels) / 8
    header.writeUint16(this.bitsPerSample * this.channels / 8);
    // bits per sample
    header.writeUint16(this.bitsPerSample);
    // "data" section header
    header.writeUtf8("data");
    // data section length (set later)
    header.writeUint32(0);
    this.header = header;
    this.pcmData = null;
  }

  _createClass(wavEncoder, [{
    key: "writeFrames",
    value: function writeFrames(pcmData) {
      var header = this.header;
      // fill in filesize
      header.seek(4);
      header.writeUint32(header.byteLength + pcmData.byteLength);
      // fill in data section length
      header.seek(40);
      header.writeUint32(pcmData.byteLength);
      this.pcmData = pcmData;
    }
  }, {
    key: "getBlob",
    value: function getBlob() {
      return new Blob([this.header.buffer, this.pcmData.buffer], { type: "audio/wav" });
    }
  }]);

  return wavEncoder;
}();

exports.default = wavEncoder;

/***/ }),

/***/ "./flipnote.js":
/*!*********************!*\
  !*** ./flipnote.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataStream = exports.wavEncoder = exports.bitmapEncoder = exports.kwzParser = exports.ppmParser = exports.parser = exports.default = undefined;

var _player = __webpack_require__(/*! ./player */ "./player/index.js");

var _player2 = _interopRequireDefault(_player);

var _parser = __webpack_require__(/*! ./parser */ "./parser/index.js");

var _parser2 = _interopRequireDefault(_parser);

var _ppm = __webpack_require__(/*! ./parser/ppm */ "./parser/ppm.js");

var _ppm2 = _interopRequireDefault(_ppm);

var _kwz = __webpack_require__(/*! ./parser/kwz */ "./parser/kwz.js");

var _kwz2 = _interopRequireDefault(_kwz);

var _bmp = __webpack_require__(/*! ./encoders/bmp */ "./encoders/bmp.js");

var _bmp2 = _interopRequireDefault(_bmp);

var _wav = __webpack_require__(/*! ./encoders/wav */ "./encoders/wav.js");

var _wav2 = _interopRequireDefault(_wav);

var _dataStream = __webpack_require__(/*! ./utils/dataStream */ "./utils/dataStream.js");

var _dataStream2 = _interopRequireDefault(_dataStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _module = {
  version: "2.6.2",
  player: _player2.default,
  parser: _parser2.default,
  ppmParser: _ppm2.default,
  kwzParser: _kwz2.default
};

exports.default = _module;
exports.parser = _parser2.default;
exports.ppmParser = _ppm2.default;
exports.kwzParser = _kwz2.default;
exports.bitmapEncoder = _bmp2.default;
exports.wavEncoder = _wav2.default;
exports.dataStream = _dataStream2.default;

/***/ }),

/***/ "./loader/arrayBufferLoader.js":
/*!*************************************!*\
  !*** ./loader/arrayBufferLoader.js ***!
  \*************************************/
/*! no static exports found */
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

/***/ "./loader/fileLoader.js":
/*!******************************!*\
  !*** ./loader/fileLoader.js ***!
  \******************************/
/*! no static exports found */
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

/***/ "./loader/index.js":
/*!*************************!*\
  !*** ./loader/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = load;

var _urlLoader = __webpack_require__(/*! ./urlLoader */ "./loader/urlLoader.js");

var _urlLoader2 = _interopRequireDefault(_urlLoader);

var _fileLoader = __webpack_require__(/*! ./fileLoader */ "./loader/fileLoader.js");

var _fileLoader2 = _interopRequireDefault(_fileLoader);

var _arrayBufferLoader = __webpack_require__(/*! ./arrayBufferLoader */ "./loader/arrayBufferLoader.js");

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

/***/ "./loader/urlLoader.js":
/*!*****************************!*\
  !*** ./loader/urlLoader.js ***!
  \*****************************/
/*! no static exports found */
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

/***/ "./parser/index.js":
/*!*************************!*\
  !*** ./parser/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parser;

var _ppm = __webpack_require__(/*! ./ppm */ "./parser/ppm.js");

var _ppm2 = _interopRequireDefault(_ppm);

var _kwz = __webpack_require__(/*! ./kwz */ "./parser/kwz.js");

var _kwz2 = _interopRequireDefault(_kwz);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parser(arrayBuffer) {
  // check the buffer's magic to identify which format it uses
  var data = new DataView(arrayBuffer, 0, 4);
  var magic = data.getUint32(0);
  // check if magic is PARA (ppm magic)
  if (magic == 0x50415241) {
    return new _ppm2.default(arrayBuffer);
  }
  // check if magic is KFH (kwz magic)
  else if ((magic & 0xFFFFFF00) == 0x4B464800) {
      return new _kwz2.default(arrayBuffer);
    }
  return null;
}

/***/ }),

/***/ "./parser/kwz.js":
/*!***********************!*\
  !*** ./parser/kwz.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dataStream2 = __webpack_require__(/*! utils/dataStream */ "./utils/dataStream.js");

var _dataStream3 = _interopRequireDefault(_dataStream2);

var _adpcm = __webpack_require__(/*! utils/adpcm */ "./utils/adpcm.js");

var _bmp = __webpack_require__(/*! encoders/bmp */ "./encoders/bmp.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FRAMERATES = [0.2, 0.5, 1, 2, 4, 6, 8, 12, 20, 24, 30];

var PALETTE = {
  WHITE: [0xff, 0xff, 0xff],
  BLACK: [0x10, 0x10, 0x10],
  RED: [0xff, 0x10, 0x10],
  YELLOW: [0xff, 0xe7, 0x00],
  GREEN: [0x00, 0x86, 0x31],
  BLUE: [0x00, 0x38, 0xce],
  NONE: [0xff, 0xff, 0xff]
};

var PALETTE_INDEX_MAP = ['WHITE', 'BLACK', 'RED', 'YELLOW', 'GREEN', 'BLUE', 'NONE'];

// table1 - commonly occuring line offsets
var TABLE_1 = new Uint16Array([0x0000, 0x0CD0, 0x19A0, 0x02D9, 0x088B, 0x0051, 0x00F3, 0x0009, 0x001B, 0x0001, 0x0003, 0x05B2, 0x1116, 0x00A2, 0x01E6, 0x0012, 0x0036, 0x0002, 0x0006, 0x0B64, 0x08DC, 0x0144, 0x00FC, 0x0024, 0x001C, 0x0004, 0x0334, 0x099C, 0x0668, 0x1338, 0x1004, 0x166C]);
// table2 - commonly occuring line offsets, but the lines are shifted to the left by one pixel
var TABLE_2 = new Uint16Array([0x0000, 0x0CD0, 0x19A0, 0x0003, 0x02D9, 0x088B, 0x0051, 0x00F3, 0x0009, 0x001B, 0x0001, 0x0006, 0x05B2, 0x1116, 0x00A2, 0x01E6, 0x0012, 0x0036, 0x0002, 0x02DC, 0x0B64, 0x08DC, 0x0144, 0x00FC, 0x0024, 0x001C, 0x099C, 0x0334, 0x1338, 0x0668, 0x166C, 0x1004]);
// table3 - line offsets, but the lines are shifted to the left by one pixel
var TABLE_3 = new Uint16Array(6561);
var values = [0, 3, 7, 1, 4, 8, 2, 5, 6];
var index = 0;
for (var a = 0; a < 9; a++) {
  for (var b = 0; b < 9; b++) {
    for (var c = 0; c < 9; c++) {
      for (var d = 0; d < 9; d++) {
        TABLE_3[index] = ((values[a] * 9 + values[b]) * 9 + values[c]) * 9 + values[d];
        index++;
      }
    }
  }
} // linetable - contains every possible sequence of pixels for each tile line
var LINE_TABLE = new Uint16Array(6561 * 8);
var values = [0x0000, 0xFF00, 0x00FF];
var offset = 0;
for (var _a = 0; _a < 3; _a++) {
  for (var _b = 0; _b < 3; _b++) {
    for (var _c = 0; _c < 3; _c++) {
      for (var _d = 0; _d < 3; _d++) {
        for (var e = 0; e < 3; e++) {
          for (var f = 0; f < 3; f++) {
            for (var g = 0; g < 3; g++) {
              for (var h = 0; h < 3; h++) {
                LINE_TABLE.set([values[_b], values[_a], values[_d], values[_c], values[f], values[e], values[h], values[g]], offset);
                offset += 8;
              }
            }
          }
        }
      }
    }
  }
}
var kwzParser = function (_dataStream) {
  _inherits(kwzParser, _dataStream);

  function kwzParser(arrayBuffer) {
    _classCallCheck(this, kwzParser);

    var _this = _possibleConstructorReturn(this, (kwzParser.__proto__ || Object.getPrototypeOf(kwzParser)).call(this, arrayBuffer));

    _this.type = "KWZ";
    _this._layers = [new Uint16Array(320 * 240), new Uint16Array(320 * 240), new Uint16Array(320 * 240)];
    _this._bitIndex = 0;
    _this._bitValue = 0;
    _this.load();
    return _this;
  }

  _createClass(kwzParser, [{
    key: "load",
    value: function load() {
      this.seek(0);
      this.sections = {};
      var size = this.byteLength - 256;
      var offset = 0;
      var sectionCount = 0;
      // counting sections should mitigate against one of mrnbayoh's notehax exploits
      while (offset < size && sectionCount < 6) {
        this.seek(offset);
        var sectionMagic = this.readUtf8(4).substring(0, 3);
        var sectionLength = this.readUint32();
        this.sections[sectionMagic] = {
          offset: offset,
          length: sectionLength
        };
        offset += sectionLength + 8;
        sectionCount += 1;
      }

      this._decodeMeta();
      this._decodeFrameMeta();
      this._decodeSoundHeader();
      this.sampleRate = 16364;
      this.palette = PALETTE;
      this._prevDecodedFrame = null;
    }
  }, {
    key: "readBits",
    value: function readBits(num) {
      if (this._bitIndex + num > 16) {
        var nextBits = this.readUint16();
        this._bitValue |= nextBits << 16 - this._bitIndex;
        this._bitIndex -= 16;
      }
      var mask = (1 << num) - 1;
      var result = this._bitValue & mask;
      this._bitValue >>= num;
      this._bitIndex += num;
      return result;
    }
  }, {
    key: "_decodeMeta",
    value: function _decodeMeta() {
      this.seek(this.sections["KFH"].offset + 12);
      var creationTimestamp = new Date((this.readUint32() + 946684800) * 1000),
          modifiedTimestamp = new Date((this.readUint32() + 946684800) * 1000),
          appVersion = this.readUint32(),
          rootAuthorId = this.readHex(10),
          parentAuthorId = this.readHex(10),
          currentAuthorId = this.readHex(10),
          rootAuthorName = this.readUtf16(11),
          parentAuthorName = this.readUtf16(11),
          currentAuthorName = this.readUtf16(11),
          rootFilename = this.readUtf8(28),
          parentFilename = this.readUtf8(28),
          currentFilename = this.readUtf8(28),
          frameCount = this.readUint16(),
          thumbIndex = this.readUint16(),
          flags = this.readUint16(),
          frameSpeed = this.readUint8(),
          layerFlags = this.readUint8();
      this.frameCount = frameCount;
      this.thumbFrameIndex = thumbIndex;
      this.frameSpeed = frameSpeed;
      this.framerate = FRAMERATES[frameSpeed];
      this.meta = {
        lock: flags & 0x1,
        loop: flags >> 1 & 0x01,
        frame_count: frameCount,
        frame_speed: frameSpeed,
        thumb_index: thumbIndex,
        timestamp: modifiedTimestamp,
        creation_timestamp: creationTimestamp,
        root: {
          username: rootAuthorName,
          fsid: rootAuthorId,
          filename: rootFilename
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
  }, {
    key: "_decodeFrameMeta",
    value: function _decodeFrameMeta() {
      this.frameMeta = [];
      this.frameOffsets = [];
      this.seek(this.sections["KMI"].offset + 8);
      offset = this.sections["KMC"].offset + 12;
      for (var i = 0; i < this.frameCount; i++) {
        var frame = {
          flags: this.readUint32(),
          layerSize: [this.readUint16(), this.readUint16(), this.readUint16()],
          frameAuthor: this.readHex(10),
          layerDepth: [this.readUint8(), this.readUint8(), this.readUint8()],
          soundFlags: this.readUint8(),
          cameraFlag: this.readUint32()
        };
        this.frameMeta.push(frame);
        this.frameOffsets.push(offset);
        offset += frame.layerSize[0] + frame.layerSize[1] + frame.layerSize[2];
      }
    }
  }, {
    key: "_decodeSoundHeader",
    value: function _decodeSoundHeader() {
      var offset = this.sections["KSN"].offset + 8;
      this.seek(offset);
      var bgmSpeed = this.readUint32();
      this.bgmSpeed = bgmSpeed;
      this.bgmrate = FRAMERATES[bgmSpeed];
      var trackSizes = new Uint32Array(this.buffer, offset + 4, 20);
      this.soundMeta = {
        "bgm": { offset: offset += 28, length: trackSizes[0] },
        "se1": { offset: offset += trackSizes[0], length: trackSizes[1] },
        "se2": { offset: offset += trackSizes[1], length: trackSizes[2] },
        "se3": { offset: offset += trackSizes[2], length: trackSizes[3] },
        "se4": { offset: offset += trackSizes[3], length: trackSizes[4] }
      };
    }
  }, {
    key: "getDiffingFlag",
    value: function getDiffingFlag(frameIndex) {
      return ~(this.frameMeta[frameIndex].flags >> 4) & 0x07;
    }
  }, {
    key: "getLayerDepths",
    value: function getLayerDepths(frameIndex) {
      return this.frameMeta[frameIndex].layerDepth;
    }

    // sort layer indices sorted by depth, drom bottom to top

  }, {
    key: "getLayerOrder",
    value: function getLayerOrder(frameIndex) {
      var depths = this.getLayerDepths(frameIndex);
      return [2, 1, 0].sort(function (a, b) {
        return depths[b] - depths[a];
      });
    }
  }, {
    key: "decodeFrame",
    value: function decodeFrame(frameIndex) {
      var diffingFlag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0x7;
      var isPrevFrame = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      // if this frame is being decoded as a prev frame, then we only want to decode the layers necessary
      if (isPrevFrame) diffingFlag &= this.getDiffingFlag(frameIndex + 1);
      // the prevDecodedFrame check is an optimisation for decoding frames in full sequence
      if (frameIndex !== 0 && this._prevDecodedFrame !== frameIndex - 1 && diffingFlag) this.decodeFrame(frameIndex - 1, diffingFlag = diffingFlag, isPrevFrame = true);

      var meta = this.frameMeta[frameIndex];
      var offset = this.frameOffsets[frameIndex];

      for (var layerIndex = 0; layerIndex < 3; layerIndex++) {
        this.seek(offset);
        var layerSize = meta.layerSize[layerIndex];
        offset += layerSize;

        // if the layer is 38 bytes then it hasn't changed at all since the previous frame, so we can skip it
        if (layerSize === 38) continue;

        if (diffingFlag >> layerIndex & 0x1 === 0) continue;

        this._bitIndex = 16;
        this._bitValue = 0;
        var skip = 0;

        for (var tileOffsetY = 0; tileOffsetY < 240; tileOffsetY += 128) {
          for (var tileOffsetX = 0; tileOffsetX < 320; tileOffsetX += 128) {
            for (var subTileOffsetY = 0; subTileOffsetY < 128; subTileOffsetY += 8) {
              var y = tileOffsetY + subTileOffsetY;
              if (y >= 240) break;

              for (var subTileOffsetX = 0; subTileOffsetX < 128; subTileOffsetX += 8) {
                var x = tileOffsetX + subTileOffsetX;
                if (x >= 320) break;

                if (skip) {
                  skip -= 1;
                  continue;
                }

                var pixelOffset = y * 320 + x;
                var pixelBuffer = this._layers[layerIndex];

                var type = this.readBits(3);

                if (type == 0) {
                  var lineIndex = TABLE_1[this.readBits(5)];
                  var pixels = LINE_TABLE.subarray(lineIndex * 8, lineIndex * 8 + 8);
                  pixelBuffer.set(pixels, pixelOffset);
                  pixelBuffer.set(pixels, pixelOffset + 320);
                  pixelBuffer.set(pixels, pixelOffset + 640);
                  pixelBuffer.set(pixels, pixelOffset + 960);
                  pixelBuffer.set(pixels, pixelOffset + 1280);
                  pixelBuffer.set(pixels, pixelOffset + 1600);
                  pixelBuffer.set(pixels, pixelOffset + 1920);
                  pixelBuffer.set(pixels, pixelOffset + 2240);
                } else if (type == 1) {
                  var _lineIndex = this.readBits(13);
                  var _pixels = LINE_TABLE.subarray(_lineIndex * 8, _lineIndex * 8 + 8);
                  pixelBuffer.set(_pixels, pixelOffset);
                  pixelBuffer.set(_pixels, pixelOffset + 320);
                  pixelBuffer.set(_pixels, pixelOffset + 640);
                  pixelBuffer.set(_pixels, pixelOffset + 960);
                  pixelBuffer.set(_pixels, pixelOffset + 1280);
                  pixelBuffer.set(_pixels, pixelOffset + 1600);
                  pixelBuffer.set(_pixels, pixelOffset + 1920);
                  pixelBuffer.set(_pixels, pixelOffset + 2240);
                } else if (type == 2) {
                  var lineValue = this.readBits(5);
                  var lineIndexA = TABLE_1[lineValue];
                  var lineIndexB = TABLE_2[lineValue];
                  var _a2 = LINE_TABLE.subarray(lineIndexA * 8, lineIndexA * 8 + 8);
                  var _b2 = LINE_TABLE.subarray(lineIndexB * 8, lineIndexB * 8 + 8);
                  pixelBuffer.set(_a2, pixelOffset);
                  pixelBuffer.set(_b2, pixelOffset + 320);
                  pixelBuffer.set(_a2, pixelOffset + 640);
                  pixelBuffer.set(_b2, pixelOffset + 960);
                  pixelBuffer.set(_a2, pixelOffset + 1280);
                  pixelBuffer.set(_b2, pixelOffset + 1600);
                  pixelBuffer.set(_a2, pixelOffset + 1920);
                  pixelBuffer.set(_b2, pixelOffset + 2240);
                } else if (type == 3) {
                  var _lineIndexA = this.readBits(13);
                  var _lineIndexB = TABLE_3[_lineIndexA];
                  var _a3 = LINE_TABLE.subarray(_lineIndexA * 8, _lineIndexA * 8 + 8);
                  var _b3 = LINE_TABLE.subarray(_lineIndexB * 8, _lineIndexB * 8 + 8);
                  pixelBuffer.set(_a3, pixelOffset);
                  pixelBuffer.set(_b3, pixelOffset + 320);
                  pixelBuffer.set(_a3, pixelOffset + 640);
                  pixelBuffer.set(_b3, pixelOffset + 960);
                  pixelBuffer.set(_a3, pixelOffset + 1280);
                  pixelBuffer.set(_b3, pixelOffset + 1600);
                  pixelBuffer.set(_a3, pixelOffset + 1920);
                  pixelBuffer.set(_b3, pixelOffset + 2240);
                } else if (type == 4) {
                  var mask = this.readBits(8);
                  for (var line = 0; line < 8; line++) {
                    var _lineIndex2 = 0;
                    if (mask & 1 << line) {
                      _lineIndex2 = TABLE_1[this.readBits(5)];
                    } else {
                      _lineIndex2 = this.readBits(13);
                    }
                    var _pixels2 = LINE_TABLE.subarray(_lineIndex2 * 8, _lineIndex2 * 8 + 8);
                    pixelBuffer.set(_pixels2, pixelOffset + line * 320);
                  }
                } else if (type == 5) {
                  skip = this.readBits(5);
                  continue;
                }

                // type 6 doesnt exist

                else if (type == 7) {
                    var pattern = this.readBits(2);
                    var useTable = this.readBits(1);
                    var _lineIndexA2 = 0;
                    var _lineIndexB2 = 0;

                    if (useTable) {
                      _lineIndexA2 = TABLE_1[this.readBits(5)];
                      _lineIndexB2 = TABLE_1[this.readBits(5)];
                      pattern = (pattern + 1) % 4;
                    } else {
                      _lineIndexA2 = this.readBits(13);
                      _lineIndexB2 = this.readBits(13);
                    }

                    var _a4 = LINE_TABLE.subarray(_lineIndexA2 * 8, _lineIndexA2 * 8 + 8);
                    var _b4 = LINE_TABLE.subarray(_lineIndexB2 * 8, _lineIndexB2 * 8 + 8);

                    if (pattern == 0) {
                      pixelBuffer.set(_a4, pixelOffset);
                      pixelBuffer.set(_b4, pixelOffset + 320);
                      pixelBuffer.set(_a4, pixelOffset + 640);
                      pixelBuffer.set(_b4, pixelOffset + 960);
                      pixelBuffer.set(_a4, pixelOffset + 1280);
                      pixelBuffer.set(_b4, pixelOffset + 1600);
                      pixelBuffer.set(_a4, pixelOffset + 1920);
                      pixelBuffer.set(_b4, pixelOffset + 2240);
                    } else if (pattern == 1) {
                      pixelBuffer.set(_a4, pixelOffset);
                      pixelBuffer.set(_a4, pixelOffset + 320);
                      pixelBuffer.set(_b4, pixelOffset + 640);
                      pixelBuffer.set(_a4, pixelOffset + 960);
                      pixelBuffer.set(_a4, pixelOffset + 1280);
                      pixelBuffer.set(_b4, pixelOffset + 1600);
                      pixelBuffer.set(_a4, pixelOffset + 1920);
                      pixelBuffer.set(_a4, pixelOffset + 2240);
                    } else if (pattern == 2) {
                      pixelBuffer.set(_a4, pixelOffset);
                      pixelBuffer.set(_b4, pixelOffset + 320);
                      pixelBuffer.set(_a4, pixelOffset + 640);
                      pixelBuffer.set(_a4, pixelOffset + 960);
                      pixelBuffer.set(_b4, pixelOffset + 1280);
                      pixelBuffer.set(_a4, pixelOffset + 1600);
                      pixelBuffer.set(_a4, pixelOffset + 1920);
                      pixelBuffer.set(_b4, pixelOffset + 2240);
                    } else if (pattern == 3) {
                      pixelBuffer.set(_a4, pixelOffset);
                      pixelBuffer.set(_b4, pixelOffset + 320);
                      pixelBuffer.set(_b4, pixelOffset + 640);
                      pixelBuffer.set(_a4, pixelOffset + 960);
                      pixelBuffer.set(_b4, pixelOffset + 1280);
                      pixelBuffer.set(_b4, pixelOffset + 1600);
                      pixelBuffer.set(_a4, pixelOffset + 1920);
                      pixelBuffer.set(_b4, pixelOffset + 2240);
                    }
                  }
              }
            }
          }
        }
      }

      this._prevDecodedFrame = frameIndex;
      // return this._layers;
      return [new Uint8Array(this._layers[0].buffer), new Uint8Array(this._layers[1].buffer), new Uint8Array(this._layers[2].buffer)];
    }
  }, {
    key: "getFramePalette",
    value: function getFramePalette(frameIndex) {
      var flags = this.frameMeta[frameIndex].flags;
      return [this.palette[PALETTE_INDEX_MAP[flags & 0xF]], // paper color
      this.palette[PALETTE_INDEX_MAP[flags >> 8 & 0xF]], // layer A color 1
      this.palette[PALETTE_INDEX_MAP[flags >> 12 & 0xF]], // layer A color 2
      this.palette[PALETTE_INDEX_MAP[flags >> 16 & 0xF]], // layer B color 1
      this.palette[PALETTE_INDEX_MAP[flags >> 20 & 0xF]], // layer B color 2
      this.palette[PALETTE_INDEX_MAP[flags >> 24 & 0xF]], // layer C color 1
      this.palette[PALETTE_INDEX_MAP[flags >> 28 & 0xF]]];
    }

    // retuns an uint8 array where each item is a pixel's palette index

  }, {
    key: "getLayerPixels",
    value: function getLayerPixels(frameIndex, layerIndex) {
      if (this._prevDecodedFrame !== frameIndex) {
        this.decodeFrame(frameIndex);
      }
      var layer = this._layers[layerIndex];
      var image = new Uint8Array(320 * 240);
      var paletteOffset = layerIndex * 2 + 1;
      for (var _index = 0; _index < layer.length; _index++) {
        var pixel = layer[_index];
        if (pixel & 0xff00) {
          image[_index] = paletteOffset;
        } else if (pixel & 0x00ff) {
          image[_index] = paletteOffset + 1;
        }
      }
      return image;
    }

    // retuns an uint8 array where each item is a pixel's palette index

  }, {
    key: "getFramePixels",
    value: function getFramePixels(frameIndex) {
      var _this2 = this;

      var image = new Uint8Array(320 * 240);
      var layerOrder = this.getLayerOrder(frameIndex);
      layerOrder.forEach(function (layerIndex) {
        var layer = _this2.getLayerPixels(frameIndex, layerIndex);
        // merge layer into image result
        for (var _index2 = 0; _index2 < layer.length; _index2++) {
          var pixel = layer[_index2];
          if (pixel !== 0) {
            image[_index2] = pixel;
          }
        }
      });
      return image;
    }
  }, {
    key: "getFrameBitmap",
    value: function getFrameBitmap(frameIndex) {
      var bmp = new _bmp.BitmapEncoder(320, 240, 8);
      bmp.setPixels(this.getFramePixels(frameIndex));
      bmp.setPalette(this.getFramePalette(frameIndex));
      return bmp;
    }
  }, {
    key: "decodeSoundFlags",
    value: function decodeSoundFlags() {
      return this.frameMeta.map(function (frame) {
        var soundFlags = frame.soundFlags;
        return [soundFlags & 0x1, soundFlags >> 1 & 0x1, soundFlags >> 2 & 0x1, soundFlags >> 3 & 0x1];
      });
    }
  }, {
    key: "hasAudioTrack",
    value: function hasAudioTrack(trackIndex) {
      var id = ["bgm", "se1", "se2", "se3", "se4"][trackIndex];
      return this.soundMeta[id].length > 0;
    }
  }, {
    key: "decodeAudio",
    value: function decodeAudio(track) {
      var meta = this.soundMeta[track];
      var output = new Int16Array(16364 * 60);
      var outputOffset = 0;
      var adpcm = new Uint8Array(this.buffer, meta.offset, meta.length);
      // initial decoder state
      var prevDiff = 0;
      var prevStepIndex = 40;
      var sample, diff, stepIndex;
      // loop through each byte in the raw adpcm data
      for (var _index3 = 0; _index3 < adpcm.length; _index3++) {
        var byte = adpcm[_index3];
        var bitPos = 0;
        while (bitPos < 8) {
          if (prevStepIndex < 18 || bitPos == 6) {
            // isolate 2-bit sample
            sample = byte >> bitPos & 0x3;
            // get diff
            diff = prevDiff + _adpcm.ADPCM_SAMPLE_TABLE_2[sample + 4 * prevStepIndex];
            // get step index
            stepIndex = prevStepIndex + _adpcm.ADPCM_INDEX_TABLE_2[sample];
            bitPos += 2;
          } else {
            // isolate 4-bit sample
            sample = byte >> bitPos & 0xF;
            // get diff
            diff = prevDiff + _adpcm.ADPCM_SAMPLE_TABLE_4[sample + 16 * prevStepIndex];
            // get step index
            stepIndex = prevStepIndex + _adpcm.ADPCM_INDEX_TABLE_4[sample];
            bitPos += 4;
          }
          // clamp step index and diff
          stepIndex = Math.max(0, Math.min(stepIndex, 79));
          diff = Math.max(-2048, Math.min(diff, 2048));
          // add result to output buffer
          output[outputOffset] = diff * 16;
          outputOffset += 1;
          // set prev decoder state
          prevStepIndex = stepIndex;
          prevDiff = diff;
        }
      }
      return output.slice(0, outputOffset);
    }
  }]);

  return kwzParser;
}(_dataStream3.default);

exports.default = kwzParser;

/***/ }),

/***/ "./parser/ppm.js":
/*!***********************!*\
  !*** ./parser/ppm.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dataStream2 = __webpack_require__(/*! utils/dataStream */ "./utils/dataStream.js");

var _dataStream3 = _interopRequireDefault(_dataStream2);

var _adpcm = __webpack_require__(/*! utils/adpcm */ "./utils/adpcm.js");

var _bmp = __webpack_require__(/*! encoders/bmp */ "./encoders/bmp.js");

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

var WIDTH = 256;
var HEIGHT = 192;

var PALETTE = {
  WHITE: [0xff, 0xff, 0xff],
  BLACK: [0x0e, 0x0e, 0x0e],
  RED: [0xff, 0x2a, 0x2a],
  BLUE: [0x0a, 0x39, 0xff]
};

var ppmParser = function (_dataStream) {
  _inherits(ppmParser, _dataStream);

  /**
  * Create a ppmDecoder instance
  * @param {ArrayBuffer} arrayBuffer - data to read from
  */
  function ppmParser(arrayBuffer) {
    _classCallCheck(this, ppmParser);

    var _this = _possibleConstructorReturn(this, (ppmParser.__proto__ || Object.getPrototypeOf(ppmParser)).call(this, arrayBuffer));

    _this.type = "PPM";
    _this._decodeHeader();
    _this._decodeAnimationHeader();
    _this._decodeSoundHeader();
    _this._decodeMeta();
    _this.sampleRate = 8192;
    _this.palette = PALETTE;
    // create image buffers
    _this._layers = [new Uint8Array(WIDTH * HEIGHT), new Uint8Array(WIDTH * HEIGHT)];
    _this._prevLayers = [new Uint8Array(WIDTH * HEIGHT), new Uint8Array(WIDTH * HEIGHT)];
    _this._prevDecodedFrame = null;
    return _this;
  }

  _createClass(ppmParser, [{
    key: "readFilename",


    /**
    * Read a packed filename
    * @returns {string}
    * @access protected
    */
    value: function readFilename() {
      return [this.readHex(3), this.readUtf8(13), this.readUint16().toString().padStart(3, "0")].join("_");
    }

    /**
    * Unpack the line encoding flags for all 192 lines in a layer
    * @returns {array}
    * @access protected
    */

  }, {
    key: "readLineEncoding",
    value: function readLineEncoding() {
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
  }, {
    key: "_decodeHeader",
    value: function _decodeHeader() {
      this.seek(0);
      // decode header
      // https://github.com/pbsds/hatena-server/wiki/PPM-format#file-header
      var magic = this.readUint32();
      this._frameDataLength = this.readUint32();
      this._soundDataLength = this.readUint32();
      this.frameCount = this.readUint16() + 1;
      this.version = this.readUint16();
    }
  }, {
    key: "_decodeMeta",
    value: function _decodeMeta() {
      // https://github.com/pbsds/hatena-server/wiki/PPM-format#file-header
      this.seek(0x10);
      var lock = this.readUint16(),
          thumbIndex = this.readInt16(),
          rootAuthorName = this.readUtf16(11),
          parentAuthorName = this.readUtf16(11),
          currentAuthorName = this.readUtf16(11),
          parentAuthorId = this.readHex(8, true),
          currentAuthorId = this.readHex(8, true),
          parentFilename = this.readFilename(),
          currentFilename = this.readFilename(),
          rootAuthorId = this.readHex(8, true);
      this.seek(0x9A);
      var timestamp = new Date((this.readUint32() + 946684800) * 1000);
      this.seek(0x06A6);
      var flags = this.readUint16();
      this.thumbFrameIndex = thumbIndex;
      this.meta = {
        lock: lock,
        loop: flags >> 1 & 0x01,
        frame_count: this.frameCount,
        frame_speed: this.frameSpeed,
        bgm_speed: this.bgmSpeed,
        thumb_index: thumbIndex,
        timestamp: timestamp,
        spinoff: currentAuthorId !== parentAuthorId || currentAuthorId !== rootAuthorId,
        root: {
          filename: null,
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
  }, {
    key: "_decodeAnimationHeader",
    value: function _decodeAnimationHeader() {
      var _this2 = this;

      // jump to the start of the animation data section
      // https://github.com/pbsds/hatena-server/wiki/PPM-format#animation-data-section
      this.seek(0x06A0);
      var offsetTableLength = this.readUint16();
      // skip padding + flags
      this.seek(0x06A8);
      // read frame offsets and build them into a table
      this._frameOffsets = new Uint32Array(offsetTableLength / 4).map(function (value) {
        return 0x06A8 + offsetTableLength + _this2.readUint32();
      });
    }
  }, {
    key: "_decodeSoundHeader",
    value: function _decodeSoundHeader() {
      // https://github.com/pbsds/hatena-server/wiki/PPM-format#sound-data-section
      // offset = frame data offset + frame data length + sound effect flags
      var offset = 0x06A0 + this._frameDataLength + this.frameCount;
      // account for multiple-of-4 padding
      if (offset % 2 != 0) offset += 4 - offset % 4;
      this.seek(offset);
      var bgmLen = this.readUint32();
      var se1Len = this.readUint32();
      var se2Len = this.readUint32();
      var se3Len = this.readUint32();
      this.frameSpeed = 8 - this.readUint8();
      this.bgmSpeed = 8 - this.readUint8();
      offset += 32;
      this.framerate = FRAMERATES[this.frameSpeed];
      this.bgmrate = FRAMERATES[this.bgmSpeed];
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
    key: "isNewFrame",
    value: function isNewFrame(index) {
      this.seek(this._frameOffsets[index]);
      var header = this.readUint8();
      return header >> 7 & 0x1;
    }

    /**
    * Get the color palette for a given frame
    * @param {number} index - zero-based frame index 
    * @returns {array} rgba palette in order of paper, layer1, layer2
    */

  }, {
    key: "getFramePalette",
    value: function getFramePalette(index) {
      this.seek(this._frameOffsets[index]);
      var palette = this.palette;
      var header = this.readUint8();
      var paperColor = header & 0x1;
      var pen = [palette.BLACK, paperColor == 1 ? palette.BLACK : palette.WHITE, palette.RED, palette.BLUE];
      return [paperColor == 1 ? palette.WHITE : palette.BLACK, pen[header >> 1 & 0x3], // layer 1 color
      pen[header >> 3 & 0x3]];
    }

    /**
    * Decode a frame
    * @param {number} index - zero-based frame index 
    * @returns {array} - 2 uint8 arrays representing each layer
    * */

  }, {
    key: "decodeFrame",
    value: function decodeFrame(index) {
      if (index !== 0 && this._prevDecodedFrame !== index - 1 && !this.isNewFrame(index)) this.decodeFrame(index - 1);
      // https://github.com/pbsds/hatena-server/wiki/PPM-format#animation-frame
      this.seek(this._frameOffsets[index]);
      var header = this.readUint8();
      var isNewFrame = header >> 7 & 0x1;
      var isTranslated = header >> 5 & 0x3;
      var translateX = 0;
      var translateY = 0;
      // copy the current layer buffers to the previous ones
      this._prevLayers[0].set(this._layers[0]);
      this._prevLayers[1].set(this._layers[1]);
      this._prevDecodedFrame = index;
      // reset current layer buffers
      this._layers[0].fill(0);
      this._layers[1].fill(0);

      if (isTranslated) {
        translateX = this.readInt8();
        translateY = this.readInt8();
      }

      var layerEncoding = [this.readLineEncoding(), this.readLineEncoding()];
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
              if (lineType == 2) layerBitmap.fill(0xFF, chunkOffset, chunkOffset + WIDTH);
              // loop through each bit in the line header
              while (lineHeader & 0xFFFFFFFF) {
                // if the bit is set, this 8-pix wide chunk is stored
                // else we can just leave it blank and move on to the next chunk
                if (lineHeader & 0x80000000) {
                  var chunk = this.readUint8();
                  // unpack chunk bits
                  for (var pixel = 0; pixel < 8; pixel++) {
                    layerBitmap[chunkOffset + pixel] = chunk >> pixel & 0x1 ? 0xFF : 0x00;
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
                  layerBitmap[chunkOffset + pixel] = chunk >> pixel & 0x1 ? 0xFF : 0x00;
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
        // loop through each line
        for (var y = 0; y < HEIGHT; y++) {
          // skip to next line if this one falls off the top edge of the screen
          if (y - translateY < 0) continue;
          // stop once the bottom screen edge has been reached
          if (y - translateY >= HEIGHT) break;
          // loop through each pixel in the line
          for (var x = 0; x < WIDTH; x++) {
            // skip to the next pixel if this one falls off the left edge of the screen
            if (x - translateX < 0) continue;
            // stop diffing this line once the right screen edge has been reached
            if (x - translateX >= WIDTH) break;
            dest = x + y * WIDTH;
            src = dest - (translateX + translateY * WIDTH);
            // diff pixels with a binary XOR
            this._layers[0][dest] ^= this._prevLayers[0][src];
            this._layers[1][dest] ^= this._prevLayers[1][src];
          }
        }
      }
      return this._layers;
    }

    // retuns an uint8 array where each item is a pixel's palette index

  }, {
    key: "getLayerPixels",
    value: function getLayerPixels(frameIndex, layerIndex) {
      if (this._prevDecodedFrame !== frameIndex) {
        this.decodeFrame(frameIndex);
      }
      var layer = this._layers[layerIndex];
      var image = new Uint8Array(256 * 192);
      var layerColor = layerIndex + 1;
      for (var pixel = 0; pixel < image.length; pixel++) {
        if (layer[pixel] !== 0) {
          image[pixel] = layerColor;
        }
      }
      return image;
    }

    // retuns an uint8 array where each item is a pixel's palette index

  }, {
    key: "getFramePixels",
    value: function getFramePixels(frameIndex) {
      var layers = this.decodeFrame(frameIndex);
      var image = new Uint8Array(256 * 192);
      for (var pixel = 0; pixel < image.length; pixel++) {
        var a = layers[0][pixel];
        var b = layers[1][pixel];
        if (b) image[pixel] = 2;
        if (a) image[pixel] = 1;
      }
      return image;
    }
  }, {
    key: "getFrameBitmap",
    value: function getFrameBitmap(frameIndex) {
      var bmp = new _bmp.BitmapEncoder(256, 192, 8);
      bmp.setPixels(this.getFramePixels(frameIndex));
      bmp.setPalette(this.getFramePalette(frameIndex));
      return bmp;
    }
  }, {
    key: "hasAudioTrack",
    value: function hasAudioTrack(trackIndex) {
      var id = ["bgm", "se1", "se2", "se3"][trackIndex];
      return this.soundMeta[id].length > 0;
    }

    /**
    * Decode an audio track to 32-bit adpcm
    * @param {string} track - track name, "bgm" | "se1" | "se2" | "se3"
    * @returns {Int16Array}
    */

  }, {
    key: "decodeAudio",
    value: function decodeAudio(track) {
      var meta = this.soundMeta[track];
      var adpcm = new Uint8Array(this.buffer, meta.offset, meta.length);
      var output = new Int16Array(adpcm.length * 2);
      var outputOffset = 0;
      // initial decoder state
      var prevDiff = 0;
      var prevStepIndex = 0;
      var sample, diff, stepIndex;
      // loop through each byte in the raw adpcm data
      for (var index = 0; index < adpcm.length; index++) {
        var byte = adpcm[index];
        var bitPos = 0;
        while (bitPos < 8) {
          // isolate 4-bit sample
          sample = byte >> bitPos & 0xF;
          // get diff
          diff = prevDiff + _adpcm.ADPCM_SAMPLE_TABLE_4[sample + 16 * prevStepIndex];
          // get step index
          stepIndex = prevStepIndex + _adpcm.ADPCM_INDEX_TABLE_4[sample];
          // clamp step index and diff
          stepIndex = Math.max(0, Math.min(stepIndex, 79));
          diff = Math.max(-32767, Math.min(diff, 32767));
          // add result to output buffer
          output[outputOffset] = diff;
          outputOffset += 1;
          // set prev decoder state
          prevStepIndex = stepIndex;
          prevDiff = diff;
          // move to next sample
          bitPos += 4;
        }
      }
      return output;
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

  return ppmParser;
}(_dataStream3.default);

exports.default = ppmParser;

/***/ }),

/***/ "./player/audio.js":
/*!*************************!*\
  !*** ./player/audio.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wav = __webpack_require__(/*! encoders/wav */ "./encoders/wav.js");

var _wav2 = _interopRequireDefault(_wav);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var audioTrack = function () {
  /**
  * Create a new audio player
  */
  function audioTrack(id, type) {
    _classCallCheck(this, audioTrack);

    this.id = id;
    this.channelCount = 1;
    this.bitsPerSample = 16;
    this.sampleRate = 0;
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
      var wav = new _wav2.default(this.sampleRate * playbackRate, this.channelCount, this.bitsPerSample);
      wav.writeFrames(pcmData);
      this.url = window.URL.createObjectURL(wav.getBlob());
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

/***/ }),

/***/ "./player/index.js":
/*!*************************!*\
  !*** ./player/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _canvas = __webpack_require__(/*! webgl/canvas */ "./webgl/canvas.js");

var _canvas2 = _interopRequireDefault(_canvas);

var _parser = __webpack_require__(/*! parser */ "./parser/index.js");

var _parser2 = _interopRequireDefault(_parser);

var _loader = __webpack_require__(/*! loader */ "./loader/index.js");

var _loader2 = _interopRequireDefault(_loader);

var _audio = __webpack_require__(/*! ./audio */ "./player/audio.js");

var _audio2 = _interopRequireDefault(_audio);

var _canvas3 = __webpack_require__(/*! ../webgl/canvas */ "./webgl/canvas.js");

var _canvas4 = _interopRequireDefault(_canvas3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** flipnote player API, based on HTMLMediaElement (https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) */
var flipnotePlayer = function () {
  /**
  * Create new flipnote player
  * @param {string | HTMLCanvasElement} el - HTML Canvas Element to use, or CSS selector for one
  * @param {number} width - canvas width in pixels
  * @param {number} height - canvas height in pixels
  */
  function flipnotePlayer(el, width, height) {
    _classCallCheck(this, flipnotePlayer);

    // if `el` is a string, use it to select an Element, else assume it's an element
    el = "string" == typeof el ? document.querySelector(el) : el;
    this.canvas = new _canvas2.default(el, width, height);
    this._imgCanvas = new _canvas2.default(document.createElement("canvas"), width, height, {
      antialias: true,
      preserveDrawingBuffer: true
    });
    this._isOpen = false;
    this._events = {};
    this.loop = false;
    this.currentFrame = 0;
    this.paused = true;
    this.customPalette = null;
    this.audioTracks = [new _audio2.default("se1"), new _audio2.default("se2"), new _audio2.default("se3"), new _audio2.default("se4"), new _audio2.default("bgm")];
    this.smoothRendering = false;
  }

  /**
  * Get the index of the current frame 
  */


  _createClass(flipnotePlayer, [{
    key: "_load",


    /**
    * Load a Flipnote into the player
    * @param {ArrayBuffer} buffer - ppm data
    * @access protected
    */
    value: function _load(buffer) {
      var note = new _parser2.default(buffer);
      this.note = note;
      this.meta = note.meta;
      this.type = note.type;
      this.frameCount = note.frameCount;
      this.frameSpeed = note.frameSpeed;
      this.fileLength = note.byteLength;
      this.loop = note.meta.loop == 1;
      this.paused = true;
      this._isOpen = true;
      this.audioTracks.forEach(function (track) {
        track.sampleRate = note.sampleRate;
      });
      if (this.customPalette) {
        this.setPalette(this.customPalette);
      }
      if (this.note.hasAudioTrack(1)) this.audioTracks[0].set(this.note.decodeAudio("se1"), 1);
      if (this.note.hasAudioTrack(2)) this.audioTracks[1].set(this.note.decodeAudio("se2"), 1);
      if (this.note.hasAudioTrack(3)) this.audioTracks[2].set(this.note.decodeAudio("se3"), 1);
      if (this.type === "KWZ" && this.note.hasAudioTrack(4)) this.audioTracks[3].set(this.note.decodeAudio("se4"), 1);
      if (this.note.hasAudioTrack(0)) this.audioTracks[4].set(this.note.decodeAudio("bgm"), this._audiorate);
      this._seFlags = this.note.decodeSoundFlags();
      this._playbackLoop = null;
      this._hasPlaybackStarted = false;
      this.layerVisiblity = {
        1: true,
        2: true,
        3: true
      };
      this.setMode(this.type);
      this.setFrame(this.note.thumbFrameIndex);
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
      this.note = null;
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
      this.audioTracks[4].start(this.currentTime);
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
    * Begin Flipnote playback
    */

  }, {
    key: "play",
    value: function play() {
      var _this2 = this;

      if (!this._isOpen || !this.paused) return null;
      this.paused = false;
      if (!this._hasPlaybackStarted || !this.loop && this.currentFrame == this.frameCount - 1) this._frame = 0;
      this._playBgm();
      this._playbackLoop = setInterval(function () {
        if (_this2.paused) clearInterval(_this2._playbackLoop);
        // if the end of the flipnote has been reached
        if (_this2.currentFrame >= _this2.frameCount - 1) {
          _this2._stopAudio();
          if (_this2.loop) {
            _this2.firstFrame();
            _this2._playBgm(0);
            _this2.emit("playback:loop");
          } else {
            _this2.pause();
            _this2.emit("playback:end");
          }
        } else {
          _this2._playFrameSe(_this2.currentFrame);
          _this2.nextFrame();
        }
      }, 1000 / this.framerate);
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
      clearInterval(this._playbackLoop);
      this.paused = true;
      this._stopAudio();
      this.emit("playback:stop");
    }

    /**
    * Get a specific frame as an image data URL
    * @param {number|string} index - zero-based frame index, or pass "thumb" to get the thumbnail frame
    * @param {string} type - image MIME type, default is image/png
    * @param {number} encoderOptions - number between 0 and 1 indicating image quality if type is image/jpeg or image/webp
    */

  }, {
    key: "getFrameImage",
    value: function getFrameImage(index, width, height, type, encoderOptions) {
      if (!this._isOpen) return null;
      var canvas = this._imgCanvas;
      if (canvas.width !== width || canvas.height !== height) canvas.resize(width, height);
      // clamp frame index
      index = index == "thumb" ? this.note.thumbFrameIndex : Math.max(0, Math.min(index, this.frameCount - 1));
      this.drawFrame(index, canvas);
      return canvas.toImage(type, encoderOptions);
    }
  }, {
    key: "setPalette",
    value: function setPalette(palette) {
      this.customPalette = palette;
      this.note.palette = palette;
      this.forceUpdate();
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
      this.drawFrame(index, this.canvas);
      this.emit("frame:update", this.currentFrame);
    }

    /**
    * Draw a frame to a given canvas
    * @param {number} index - zero-based frame index
    * @param {webglCanvas} canvas - webgl frame canvas
    */

  }, {
    key: "drawFrame",
    value: function drawFrame(frameIndex, canvas) {
      var _this3 = this;

      var colors = this.note.getFramePalette(frameIndex);
      var layerBuffers = this.note.decodeFrame(frameIndex);
      canvas.setPaperColor(colors[0]);
      canvas.clear();
      if (this.note.type == "PPM") {
        if (this.layerVisiblity[2]) canvas.drawLayer(layerBuffers[1], 256, 192, colors[2], [0, 0, 0, 0]);
        if (this.layerVisiblity[1]) canvas.drawLayer(layerBuffers[0], 256, 192, colors[1], [0, 0, 0, 0]);
      } else if (this.note.type == "KWZ") {
        // loop through each layer
        this.note.getLayerOrder(frameIndex).forEach(function (layerIndex) {
          // only draw layer if it's visible
          if (_this3.layerVisiblity[layerIndex + 1]) {
            canvas.drawLayer(layerBuffers[layerIndex], 320, 240, colors[layerIndex * 2 + 1], colors[layerIndex * 2 + 2]);
          }
        });
      }
    }

    /**
    * Jump to the thumbnail frame
    */

  }, {
    key: "thumbnailFrame",
    value: function thumbnailFrame() {
      this.currentFrame = this.note.thumbFrameIndex;
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
      this.forceUpdate();
    }

    /**
    * Set layer visibility
    * @param {number} index - layer number = 1, 2, 3
    * @param {boolean} value
    */

  }, {
    key: "setLayerVisibility",
    value: function setLayerVisibility(index, value) {
      this.layerVisiblity[index] = value;
      this.forceUpdate();
    }

    /**
    * Set smooth rendering
    * @param {boolean} value
    */

  }, {
    key: "setSmoothRendering",
    value: function setSmoothRendering(value) {
      var filter = value ? "linear" : "nearest";
      this.canvas.setFilter(filter);
      this.forceUpdate();
      this.smoothRendering = value;
    }

    /**
    * Set the mode depending on format
    * @param {string} mode - "KWZ" | "PPM"
    */

  }, {
    key: "setMode",
    value: function setMode(mode) {
      this.canvas.setMode(mode);
      this._imgCanvas.setMode(mode);
    }

    /**
    * Force the player to redraw
    */

  }, {
    key: "forceUpdate",
    value: function forceUpdate() {
      if (this._isOpen) {
        this.drawFrame(this.currentFrame, this.canvas);
      }
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
      return this.note.framerate;
    }

    /**
    * Get the audio playback rate by comparing audio and frame speeds
    * @access protected
    */

  }, {
    key: "_audiorate",
    get: function get() {
      return 1 / this.note.bgmrate / (1 / this.note.framerate);
    }
  }]);

  return flipnotePlayer;
}();

exports.default = flipnotePlayer;

/***/ }),

/***/ "./utils/adpcm.js":
/*!************************!*\
  !*** ./utils/adpcm.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var ADPCM_INDEX_TABLE_2 = exports.ADPCM_INDEX_TABLE_2 = new Int8Array([-1, 2, -1, 2]);

var ADPCM_INDEX_TABLE_4 = exports.ADPCM_INDEX_TABLE_4 = new Int8Array([-1, -1, -1, -1, 2, 4, 6, 8, -1, -1, -1, -1, 2, 4, 6, 8]);

// note that this is a slight deviation from the normal adpcm table
var ADPCM_STEP_TABLE = exports.ADPCM_STEP_TABLE = new Int16Array([7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45, 50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130, 143, 157, 173, 190, 209, 230, 253, 279, 307, 337, 371, 408, 449, 494, 544, 598, 658, 724, 796, 876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358, 5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899, 15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767, 0]);

var ADPCM_SAMPLE_TABLE_2 = exports.ADPCM_SAMPLE_TABLE_2 = new Int16Array(90 * 4);
for (var sample = 0; sample < 4; sample++) {
  for (var stepIndex = 0; stepIndex < 90; stepIndex++) {
    var step = ADPCM_STEP_TABLE[stepIndex];
    var diff = step >> 3;
    if (sample & 1) diff += step;
    if (sample & 2) diff = -diff;
    ADPCM_SAMPLE_TABLE_2[sample + 4 * stepIndex] = diff;
  }
}

var ADPCM_SAMPLE_TABLE_4 = exports.ADPCM_SAMPLE_TABLE_4 = new Int16Array(90 * 16);
for (var _sample = 0; _sample < 16; _sample++) {
  for (var _stepIndex = 0; _stepIndex < 90; _stepIndex++) {
    var _step = ADPCM_STEP_TABLE[_stepIndex];
    var _diff = _step >> 3;
    if (_sample & 4) _diff += _step;
    if (_sample & 2) _diff += _step >> 1;
    if (_sample & 1) _diff += _step >> 2;
    if (_sample & 8) _diff = -_diff;
    ADPCM_SAMPLE_TABLE_4[_sample + 16 * _stepIndex] = _diff;
  }
}

/***/ }),

/***/ "./utils/dataStream.js":
/*!*****************************!*\
  !*** ./utils/dataStream.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** datastream serves as a wrapper around the DataView API to help keep track of the offset into the stream */
var dataStream = function () {
  /**
  * Create a fileReader instance
  * @param {ArrayBuffer} arrayBuffer - data to read from
  */
  function dataStream(arrayBuffer) {
    _classCallCheck(this, dataStream);

    this.buffer = arrayBuffer;
    this._data = new DataView(arrayBuffer);
    this._offset = 0;
  }

  /**
  * Get the length of the stream
  * @returns {number}
  */


  _createClass(dataStream, [{
    key: "seek",


    /**
    * based on the seek method from Python's file objects - https://www.tutorialspoint.com/python/file_seek.htm
    * @param {number} offset - position of the read pointer within the stream
    * @param {number} whence - (optional) defaults to absolute file positioning,
    *                          1 = offset is relative to the current position
    *                          2 = offset is relative to the stream's end
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
    * Read an unsigned 8-bit integer from the stream, and automatically increment the offset
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
    * Write an unsigned 8-bit integer to the stream, and automatically increment the offset
    * @param {number} value - value to write
    */

  }, {
    key: "writeUint8",
    value: function writeUint8(value) {
      this._data.setUint8(this._offset, value);
      this._offset += 1;
    }

    /**
    * Read a signed 8-bit integer from the stream, and automatically increment the offset
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
    * Write a signed 8-bit integer to the stream, and automatically increment the offset
    * @param {number} value - value to write
    */

  }, {
    key: "writeInt8",
    value: function writeInt8(value) {
      this._data.setInt8(this._offset, value);
      this._offset += 1;
    }

    /**
    * Read an unsigned 16-bit integer from the stream, and automatically increment the offset
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
    * Write an unsigned 16-bit integer to the stream, and automatically increment the offset
    * @param {number} value - value to write
    * @param {boolean} littleEndian - defaults to true, set to false to write data in big endian byte order
    */

  }, {
    key: "writeUint16",
    value: function writeUint16(value) {
      var littleEndian = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      this._data.setUint16(this._offset, value, littleEndian);
      this._offset += 2;
    }

    /**
    * Read a signed 16-bit integer from the stream, and automatically increment the offset
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
    * Write a signed 16-bit integer to the stream, and automatically increment the offset
    * @param {number} value - value to write
    * @param {boolean} littleEndian - defaults to true, set to false to write data in big endian byte order
    */

  }, {
    key: "writeInt16",
    value: function writeInt16(value) {
      var littleEndian = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      this._data.setInt16(this._offset, value, littleEndian);
      this._offset += 2;
    }

    /**
    * Read an unsigned 32-bit integer from the stream, and automatically increment the offset
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
    * Write an unsigned 32-bit integer to the stream, and automatically increment the offset
    * @param {number} value - value to write
    * @param {boolean} littleEndian - defaults to true, set to false to write data in big endian byte order
    */

  }, {
    key: "writeUint32",
    value: function writeUint32(value) {
      var littleEndian = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      this._data.setUint32(this._offset, value, littleEndian);
      this._offset += 4;
    }

    /**
    * Read a signed 32-bit integer from the stream, and automatically increment the offset
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

    /**
    * Write a signed 32-bit integer to the stream, and automatically increment the offset
    * @param {number} value - value to write
    * @param {boolean} littleEndian - defaults to true, set to false to write data in big endian byte order
    */

  }, {
    key: "writeInt32",
    value: function writeInt32(value) {
      var littleEndian = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      this._data.setInt32(this._offset, value, littleEndian);
      this._offset += 4;
    }
  }, {
    key: "readBytes",
    value: function readBytes(count) {
      var bytes = new Uint8Array(this._data.buffer, this._offset, count);
      this._offset += bytes.byteLength;
      return bytes;
    }

    /**
    * Read bytes and return a hex string
    * @param {number} count - number of bytes to read
    * @param {bool} reverse - pass true to reverse byte order
    * @returns {string}
    */

  }, {
    key: "readHex",
    value: function readHex(count) {
      var reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var bytes = this.readBytes(count);
      var hex = [];
      for (var i = 0; i < bytes.length; i++) {
        hex.push(bytes[i].toString(16).padStart(2, "0"));
      }
      if (reverse) hex.reverse();
      return hex.join("").toUpperCase();
    }

    /**
    * Read (simple) utf8 string
    * @param {number} count - number of characters to read
    * @returns {string}
    */

  }, {
    key: "readUtf8",
    value: function readUtf8(count) {
      var chars = this.readBytes(count);
      var str = "";
      for (var i = 0; i < chars.length; i++) {
        var char = chars[i];
        if (char == 0) break;
        str += String.fromCharCode(char);
      }
      return str;
    }

    /**
    * Write (simple) utf8 string
    * @param {string} string - string to write
    */

  }, {
    key: "writeUtf8",
    value: function writeUtf8(string) {
      for (var i = 0; i < string.length; i++) {
        var char = string.charCodeAt(i);
        this.writeUint8(char);
      }
    }

    /**
    * Read (simple) utf16 string
    * @param {number} count - number of characters to read
    * @returns {string}
    */

  }, {
    key: "readUtf16",
    value: function readUtf16(count) {
      var chars = new Uint16Array(this._data.buffer, this._offset, count);
      this._offset += chars.byteLength;
      var str = "";
      for (var i = 0; i < chars.length; i++) {
        var char = chars[i];
        if (char == 0) break;
        str += String.fromCharCode(char);
      }
      return str;
    }
  }, {
    key: "byteLength",
    get: function get() {
      return this._data.byteLength;
    }
  }]);

  return dataStream;
}();

exports.default = dataStream;

/***/ }),

/***/ "./webgl/canvas.js":
/*!*************************!*\
  !*** ./webgl/canvas.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _shader = __webpack_require__(/*! ./shader.vert */ "./webgl/shader.vert");

var _shader2 = _interopRequireDefault(_shader);

var _shader3 = __webpack_require__(/*! ./shader.frag */ "./webgl/shader.frag");

var _shader4 = _interopRequireDefault(_shader3);

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
  function webglCanvas(el) {
    var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 640;
    var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 480;
    var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { antialias: false, alpha: false };

    _classCallCheck(this, webglCanvas);

    this.width = el.width = width;
    this.height = el.height = height;
    var gl = el.getContext("webgl", params);
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
    var vShader = this._createShader(gl.VERTEX_SHADER, _shader2.default);
    var fShader = this._createShader(gl.FRAGMENT_SHADER, _shader4.default);
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    // link program
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      var log = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(log);
    }
    // activate the program
    gl.useProgram(program);
    // create quad that fills the screen, this will be our drawing surface
    var vertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW);
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
    var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < uniformCount; i++) {
      var name = gl.getActiveUniform(program, i).name;
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


  _createClass(webglCanvas, [{
    key: "_createShader",
    value: function _createShader(type, source) {
      var gl = this.gl;
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      // test if shader compilation was successful
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var log = gl.getShaderInfoLog(shader);
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

  }, {
    key: "toImage",
    value: function toImage(type, encoderOptions) {
      return this.el.toDataURL(type, encoderOptions);
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
      gl.uniform1i(this.uniforms.u_isSmooth, filter == "linear" ? 0 : 1);
      gl.activeTexture(gl.TEXTURE0);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    }

    /**
    * Set the canvas mode depending on format
    * @param {string} mode - "KWZ" | "PPM"
    */

  }, {
    key: "setMode",
    value: function setMode(mode) {
      var gl = this.gl;

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

  }, {
    key: "setColor",
    value: function setColor(color, value) {
      this.gl.uniform4f(this.uniforms[color], value[0] / 255, value[1] / 255, value[2] / 255, 1);
    }

    /**
    * Set an palette individual color
    * @param {array} value - r,g,b color, each channel's value should be between 0 and 255
    */

  }, {
    key: "setPaperColor",
    value: function setPaperColor(value) {
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

  }, {
    key: "drawLayer",
    value: function drawLayer(buffer, width, height, color1, color2, depth) {
      var gl = this.gl;
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

  }, {
    key: "resize",
    value: function resize() {
      var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 640;
      var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 480;

      this.el.width = width;
      this.el.height = height;
      this.width = width;
      this.height = height;
      this.gl.viewport(0, 0, width, height);
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
      // shrink the canvas to reduce memory usage until it is garbage collected
      gl.canvas.width = 1;
      gl.canvas.height = 1;
    }
  }]);

  return webglCanvas;
}();

exports.default = webglCanvas;

/***/ }),

/***/ "./webgl/shader.frag":
/*!***************************!*\
  !*** ./webgl/shader.frag ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\n#define GLSLIFY 1\nvarying vec2 v_texcoord;\nuniform vec4 u_color1;\nuniform vec4 u_color2;\nuniform sampler2D u_bitmap;\nuniform bool u_isSmooth;\nvoid main() {\n  float weightColor1 = texture2D(u_bitmap, v_texcoord).a;\n  float weightColor2 = texture2D(u_bitmap, v_texcoord).r;\n  float alpha = 1.0;\n  if (u_isSmooth) {\n    weightColor1 = smoothstep(0.0, .9, weightColor1);\n    weightColor2 = smoothstep(0.0, .9, weightColor2);\n    float alpha = weightColor1 + weightColor2;\n  }\n  gl_FragColor = vec4(u_color1.rgb, alpha) * weightColor1 + vec4(u_color2.rgb, alpha) * weightColor2;\n}\n"

/***/ }),

/***/ "./webgl/shader.vert":
/*!***************************!*\
  !*** ./webgl/shader.vert ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nattribute vec4 a_position;\nvarying vec2 v_texcoord;\nvoid main() {\n  gl_Position = a_position;\n  v_texcoord = a_position.xy * vec2(0.5, -0.5) + 0.5;\n}"

/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./flipnote.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./flipnote.js */"./flipnote.js");


/***/ })

/******/ })["default"];
});
//# sourceMappingURL=flipnote.js.map