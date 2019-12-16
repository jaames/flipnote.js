/*!
 * flipnote.js v3.2.1
 * Browser-based playback of .ppm and .kwz animations from Flipnote Studio and Flipnote Studio 3D
 * 2018 - 2019 James Daniel
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
})(typeof self !== "undefined" ? self : this, function() {
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./flipnote.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./encoders/gif.ts":
/*!*************************!*\
  !*** ./encoders/gif.ts ***!
  \*************************/
/*! exports provided: GifEncoder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GifEncoder", function() { return GifEncoder; });
/* harmony import */ var _utils_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/index */ "./utils/index.ts");
/* harmony import */ var _lzw__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lzw */ "./encoders/lzw.ts");


var GifEncoder = /** @class */ (function () {
    function GifEncoder(width, height) {
        this.delay = 100;
        // -1 = no repeat, 0 = forever. anything else is repeat count
        this.repeat = -1;
        this.colorDepth = 8;
        this.palette = [];
        this.width = width;
        this.height = height;
        this.data = new _utils_index__WEBPACK_IMPORTED_MODULE_0__["ByteArray"]();
    }
    GifEncoder.fromFlipnote = function (flipnote) {
        var gif = new GifEncoder(flipnote.width, flipnote.height);
        gif.palette = flipnote.globalPalette;
        gif.delay = 100 / flipnote.framerate;
        gif.repeat = flipnote.meta.loop ? -1 : 0;
        gif.init();
        for (var frameIndex = 0; frameIndex < flipnote.frameCount; frameIndex++) {
            gif.writeFrame(flipnote.getFramePixels(frameIndex, true));
        }
        return gif;
    };
    GifEncoder.fromFlipnoteFrame = function (flipnote, frameIndex) {
        var gif = new GifEncoder(flipnote.width, flipnote.height);
        gif.palette = flipnote.globalPalette;
        gif.delay = 100 / flipnote.framerate;
        gif.repeat = flipnote.meta.loop ? -1 : 0;
        gif.init();
        gif.writeFrame(flipnote.getFramePixels(frameIndex, true));
        return gif;
    };
    GifEncoder.prototype.init = function () {
        var paletteSize = this.palette.length;
        for (var p = 1; 1 << p < paletteSize; p += 1) {
            continue;
        }
        this.colorDepth = p;
        this.writeHeader();
        this.writeColorTable();
        this.writeNetscapeExt();
    };
    GifEncoder.prototype.writeHeader = function () {
        var header = new _utils_index__WEBPACK_IMPORTED_MODULE_0__["DataStream"](new ArrayBuffer(13));
        header.writeUtf8('GIF89a');
        // Logical Screen Descriptor
        header.writeUint16(this.width);
        header.writeUint16(this.height);
        header.writeUint8(0x80 | // 1 : global color table flag = 1 (gct used)
            (this.colorDepth - 1) // 6-8 : gct size
        );
        header.writeUint8(0);
        header.writeUint8(0);
        this.data.writeBytes(new Uint8Array(header.buffer));
    };
    GifEncoder.prototype.writeColorTable = function () {
        var palette = new Uint8Array(3 * Math.pow(2, this.colorDepth));
        for (var index = 0, offset = 0; index < this.palette.length; index += 1, offset += 3) {
            palette.set(this.palette[index], offset);
        }
        this.data.writeBytes(palette);
    };
    GifEncoder.prototype.writeGraphicsControlExt = function () {
        var graphicsControlExt = new _utils_index__WEBPACK_IMPORTED_MODULE_0__["DataStream"](new ArrayBuffer(8));
        graphicsControlExt.writeBytes([
            0x21,
            0xF9,
            4,
            0 // bitfield
        ]);
        graphicsControlExt.writeUint16(this.delay); // loop flag
        graphicsControlExt.writeBytes([
            0,
            0
        ]);
        this.data.writeBytes(new Uint8Array(graphicsControlExt.buffer));
    };
    GifEncoder.prototype.writeNetscapeExt = function () {
        var netscapeExt = new _utils_index__WEBPACK_IMPORTED_MODULE_0__["DataStream"](new ArrayBuffer(19));
        netscapeExt.writeBytes([
            0x21,
            0xFF,
            11,
        ]);
        netscapeExt.writeUtf8('NETSCAPE2.0');
        netscapeExt.writeUint8(3); // subblock size
        netscapeExt.writeUint8(1); // loop subblock id
        netscapeExt.writeUint16(this.repeat); // loop flag
        this.data.writeBytes(new Uint8Array(netscapeExt.buffer));
    };
    GifEncoder.prototype.writeImageDesc = function () {
        var desc = new _utils_index__WEBPACK_IMPORTED_MODULE_0__["DataStream"](new ArrayBuffer(10));
        desc.writeUint8(0x2C);
        desc.writeUint16(0); // image left
        desc.writeUint16(0); // image top
        desc.writeUint16(this.width);
        desc.writeUint16(this.height);
        desc.writeUint8(0);
        this.data.writeBytes(new Uint8Array(desc.buffer));
    };
    GifEncoder.prototype.writePixels = function (pixels) {
        var lzw = new _lzw__WEBPACK_IMPORTED_MODULE_1__["LZWEncoder"](this.width, this.height, pixels, this.colorDepth);
        lzw.encode(this.data);
    };
    GifEncoder.prototype.writeFrame = function (pixels) {
        this.writeGraphicsControlExt();
        this.writeImageDesc();
        this.writePixels(pixels);
    };
    GifEncoder.prototype.getBuffer = function () {
        return this.data.getBuffer();
    };
    GifEncoder.prototype.getBlob = function () {
        return new Blob([this.getBuffer()], { type: 'image/gif' });
    };
    GifEncoder.prototype.getUrl = function () {
        return window.URL.createObjectURL(this.getBlob());
    };
    GifEncoder.prototype.getImage = function () {
        var img = new Image(this.width, this.height);
        img.src = this.getUrl();
        return img;
    };
    return GifEncoder;
}());



/***/ }),

/***/ "./encoders/index.ts":
/*!***************************!*\
  !*** ./encoders/index.ts ***!
  \***************************/
/*! exports provided: GifEncoder, WavEncoder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _gif__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gif */ "./encoders/gif.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GifEncoder", function() { return _gif__WEBPACK_IMPORTED_MODULE_0__["GifEncoder"]; });

/* harmony import */ var _wav__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./wav */ "./encoders/wav.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WavEncoder", function() { return _wav__WEBPACK_IMPORTED_MODULE_1__["WavEncoder"]; });



// bmp encoder is deprecated in favor of gif
// export * from './bmp';


/***/ }),

/***/ "./encoders/lzw.ts":
/*!*************************!*\
  !*** ./encoders/lzw.ts ***!
  \*************************/
/*! exports provided: LZWEncoder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LZWEncoder", function() { return LZWEncoder; });
/*
  LZWEncoder.js

  Authors
  Kevin Weiner (original Java version - kweiner@fmsware.com)
  Thibault Imbert (AS3 version - bytearray.org)
  Johan Nordberg (JS version - code@johan-nordberg.com)
  James Daniel (ES6/TS version)

  Acknowledgements
  GIFCOMPR.C - GIF Image compression routines
  Lempel-Ziv compression based on 'compress'. GIF modifications by
  David Rowley (mgardi@watdcsu.waterloo.edu)
  GIF Image compression - modified 'compress'
  Based on: compress.c - File compression ala IEEE Computer, June 1984.
  By Authors: Spencer W. Thomas (decvax!harpo!utah-cs!utah-gr!thomas)
  Jim McKie (decvax!mcvax!jim)
  Steve Davies (decvax!vax135!petsd!peora!srd)
  Ken Turkowski (decvax!decwrl!turtlevax!ken)
  James A. Woods (decvax!ihnp4!ames!jaw)
  Joe Orost (decvax!vax135!petsd!joe)
*/
var EOF = -1;
var BITS = 12;
var HSIZE = 5003; // 80% occupancy
var masks = [
    0x0000, 0x0001, 0x0003, 0x0007, 0x000F, 0x001F,
    0x003F, 0x007F, 0x00FF, 0x01FF, 0x03FF, 0x07FF,
    0x0FFF, 0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF
];
var LZWEncoder = /** @class */ (function () {
    function LZWEncoder(width, height, pixels, colorDepth) {
        this.accum = new Uint8Array(256);
        this.htab = new Int32Array(HSIZE);
        this.codetab = new Int32Array(HSIZE);
        this.cur_accum = 0;
        this.cur_bits = 0;
        this.curPixel = 0;
        this.free_ent = 0; // first unused entry
        // block compression parameters -- after all codes are used up,
        // and compression rate changes, start over.
        this.clear_flg = false;
        // Algorithm: use open addressing double hashing (no chaining) on the
        // prefix code / next character combination. We do a variant of Knuth's
        // algorithm D (vol. 3, sec. 6.4) along with G. Knott's relatively-prime
        // secondary probe. Here, the modular division first probe is gives way
        // to a faster exclusive-or manipulation. Also do block compression with
        // an adaptive reset, whereby the code table is cleared when the compression
        // ratio decreases, but after the table fills. The variable-length output
        // codes are re-sized at this point, and a special CLEAR code is generated
        // for the decompressor. Late addition: construct the table according to
        // file size for noticeable speed improvement on small files. Please direct
        // questions about this implementation to ames!jaw.
        this.g_init_bits = undefined;
        this.ClearCode = undefined;
        this.EOFCode = undefined;
        this.width = width;
        this.height = height;
        this.pixels = pixels;
        this.colorDepth = colorDepth;
        this.initCodeSize = Math.max(2, this.colorDepth);
        this.accum = new Uint8Array(256);
        this.htab = new Int32Array(HSIZE);
        this.codetab = new Int32Array(HSIZE);
        this.cur_accum = 0;
        this.cur_bits = 0;
        this.a_count;
        this.remaining;
        this.curPixel = 0;
        this.free_ent = 0; // first unused entry
        this.maxcode;
        // block compression parameters -- after all codes are used up,
        // and compression rate changes, start over.
        this.clear_flg = false;
        // Algorithm: use open addressing double hashing (no chaining) on the
        // prefix code / next character combination. We do a variant of Knuth's
        // algorithm D (vol. 3, sec. 6.4) along with G. Knott's relatively-prime
        // secondary probe. Here, the modular division first probe is gives way
        // to a faster exclusive-or manipulation. Also do block compression with
        // an adaptive reset, whereby the code table is cleared when the compression
        // ratio decreases, but after the table fills. The variable-length output
        // codes are re-sized at this point, and a special CLEAR code is generated
        // for the decompressor. Late addition: construct the table according to
        // file size for noticeable speed improvement on small files. Please direct
        // questions about this implementation to ames!jaw.
        this.g_init_bits = undefined;
        this.ClearCode = undefined;
        this.EOFCode = undefined;
    }
    // Add a character to the end of the current packet, and if it is 254
    // characters, flush the packet to disk.
    LZWEncoder.prototype.char_out = function (c, outs) {
        this.accum[this.a_count++] = c;
        if (this.a_count >= 254)
            this.flush_char(outs);
    };
    // Clear out the hash table
    // table clear for block compress
    LZWEncoder.prototype.cl_block = function (outs) {
        this.cl_hash(HSIZE);
        this.free_ent = this.ClearCode + 2;
        this.clear_flg = true;
        this.output(this.ClearCode, outs);
    };
    // Reset code table
    LZWEncoder.prototype.cl_hash = function (hsize) {
        for (var i = 0; i < hsize; ++i)
            this.htab[i] = -1;
    };
    LZWEncoder.prototype.compress = function (init_bits, outs) {
        var fcode, c, i, ent, disp, hsize_reg, hshift;
        // Set up the globals: this.g_init_bits - initial number of bits
        this.g_init_bits = init_bits;
        // Set up the necessary values
        this.clear_flg = false;
        this.n_bits = this.g_init_bits;
        this.maxcode = this.get_maxcode(this.n_bits);
        this.ClearCode = 1 << (init_bits - 1);
        this.EOFCode = this.ClearCode + 1;
        this.free_ent = this.ClearCode + 2;
        this.a_count = 0; // clear packet
        ent = this.nextPixel();
        hshift = 0;
        for (fcode = HSIZE; fcode < 65536; fcode *= 2)
            ++hshift;
        hshift = 8 - hshift; // set hash code range bound
        hsize_reg = HSIZE;
        this.cl_hash(hsize_reg); // clear hash table
        this.output(this.ClearCode, outs);
        outer_loop: while ((c = this.nextPixel()) != EOF) {
            fcode = (c << BITS) + ent;
            i = (c << hshift) ^ ent; // xor hashing
            if (this.htab[i] === fcode) {
                ent = this.codetab[i];
                continue;
            }
            else if (this.htab[i] >= 0) { // non-empty slot
                disp = hsize_reg - i; // secondary hash (after G. Knott)
                if (i === 0)
                    disp = 1;
                do {
                    if ((i -= disp) < 0)
                        i += hsize_reg;
                    if (this.htab[i] === fcode) {
                        ent = this.codetab[i];
                        continue outer_loop;
                    }
                } while (this.htab[i] >= 0);
            }
            this.output(ent, outs);
            ent = c;
            if (this.free_ent < 1 << BITS) {
                this.codetab[i] = this.free_ent++; // code -> hasthis.htable
                this.htab[i] = fcode;
            }
            else {
                this.cl_block(outs);
            }
        }
        // Put out the final code.
        this.output(ent, outs);
        this.output(this.EOFCode, outs);
    };
    LZWEncoder.prototype.encode = function (outs) {
        outs.writeByte(this.initCodeSize); // write 'initial code size' byte
        this.remaining = this.width * this.height; // reset navigation variables
        this.curPixel = 0;
        this.compress(this.initCodeSize + 1, outs); // compress and write the pixel data
        outs.writeByte(0); // write block terminator
    };
    // Flush the packet to disk, and reset the this.accumulator
    LZWEncoder.prototype.flush_char = function (outs) {
        if (this.a_count > 0) {
            outs.writeByte(this.a_count);
            outs.writeBytes(this.accum, 0, this.a_count);
            this.a_count = 0;
        }
    };
    LZWEncoder.prototype.get_maxcode = function (n_bits) {
        return (1 << n_bits) - 1;
    };
    // Return the next pixel from the image
    LZWEncoder.prototype.nextPixel = function () {
        if (this.remaining === 0)
            return EOF;
        --this.remaining;
        var pix = this.pixels[this.curPixel++];
        return pix & 0xff;
    };
    LZWEncoder.prototype.output = function (code, outs) {
        this.cur_accum &= masks[this.cur_bits];
        if (this.cur_bits > 0)
            this.cur_accum |= (code << this.cur_bits);
        else
            this.cur_accum = code;
        this.cur_bits += this.n_bits;
        while (this.cur_bits >= 8) {
            this.char_out((this.cur_accum & 0xff), outs);
            this.cur_accum >>= 8;
            this.cur_bits -= 8;
        }
        // If the next entry is going to be too big for the code size,
        // then increase it, if possible.
        if (this.free_ent > this.maxcode || this.clear_flg) {
            if (this.clear_flg) {
                this.maxcode = this.get_maxcode(this.n_bits = this.g_init_bits);
                this.clear_flg = false;
            }
            else {
                ++this.n_bits;
                if (this.n_bits == BITS)
                    this.maxcode = 1 << BITS;
                else
                    this.maxcode = this.get_maxcode(this.n_bits);
            }
        }
        if (code == this.EOFCode) {
            // At EOF, write the rest of the buffer.
            while (this.cur_bits > 0) {
                this.char_out((this.cur_accum & 0xff), outs);
                this.cur_accum >>= 8;
                this.cur_bits -= 8;
            }
            this.flush_char(outs);
        }
    };
    return LZWEncoder;
}());



/***/ }),

/***/ "./encoders/wav.ts":
/*!*************************!*\
  !*** ./encoders/wav.ts ***!
  \*************************/
/*! exports provided: WavEncoder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WavEncoder", function() { return WavEncoder; });
/* harmony import */ var _utils_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/index */ "./utils/index.ts");

var WavEncoder = /** @class */ (function () {
    function WavEncoder(sampleRate, channels, bitsPerSample) {
        if (channels === void 0) { channels = 1; }
        if (bitsPerSample === void 0) { bitsPerSample = 16; }
        this.sampleRate = sampleRate;
        this.channels = channels;
        this.bitsPerSample = bitsPerSample;
        // Write WAV file header
        // Reference: http://www.topherlee.com/software/pcm-tut-wavformat.html
        var headerBuffer = new ArrayBuffer(44);
        var header = new _utils_index__WEBPACK_IMPORTED_MODULE_0__["DataStream"](headerBuffer);
        // 'RIFF' indent
        header.writeUtf8('RIFF');
        // filesize (set later)
        header.writeUint32(0);
        // 'WAVE' indent
        header.writeUtf8('WAVE');
        // 'fmt ' section header
        header.writeUtf8('fmt ');
        // fmt section length
        header.writeUint32(16);
        // specify audio format is pcm (type 1)
        header.writeUint16(1);
        // number of audio channels
        header.writeUint16(this.channels);
        // audio sample rate
        header.writeUint32(this.sampleRate);
        // byterate = (sampleRate * bitsPerSample * channelCount) / 8
        header.writeUint32((this.sampleRate * this.bitsPerSample * this.channels) / 8);
        // blockalign = (bitsPerSample * channels) / 8
        header.writeUint16((this.bitsPerSample * this.channels) / 8);
        // bits per sample
        header.writeUint16(this.bitsPerSample);
        // 'data' section header
        header.writeUtf8('data');
        // data section length (set later)
        header.writeUint32(0);
        this.header = header;
        this.pcmData = null;
    }
    WavEncoder.prototype.writeFrames = function (pcmData) {
        var header = this.header;
        // fill in filesize
        header.seek(4);
        header.writeUint32(header.byteLength + pcmData.byteLength);
        // fill in data section length
        header.seek(40);
        header.writeUint32(pcmData.byteLength);
        this.pcmData = pcmData;
    };
    WavEncoder.prototype.getBlob = function () {
        return new Blob([this.header.buffer, this.pcmData.buffer], { type: 'audio/wav' });
    };
    return WavEncoder;
}());



/***/ }),

/***/ "./flipnote.ts":
/*!*********************!*\
  !*** ./flipnote.ts ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/index */ "./utils/index.ts");
/* harmony import */ var _parsers_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parsers/index */ "./parsers/index.ts");
/* harmony import */ var _player_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./player/index */ "./player/index.ts");
/* harmony import */ var _encoders_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./encoders/index */ "./encoders/index.ts");




// bitmap encoder is deprecated in favor of gif
// import { BitmapEncoder } from './encoders';
/* harmony default export */ __webpack_exports__["default"] = ({
    version: "3.2.1",
    player: _player_index__WEBPACK_IMPORTED_MODULE_2__["Player"],
    parseSource: _parsers_index__WEBPACK_IMPORTED_MODULE_1__["parseSource"],
    kwzParser: _parsers_index__WEBPACK_IMPORTED_MODULE_1__["KwzParser"],
    ppmParser: _parsers_index__WEBPACK_IMPORTED_MODULE_1__["PpmParser"],
    // bitmapEncoder: BitmapEncoder,
    gifEncoder: _encoders_index__WEBPACK_IMPORTED_MODULE_3__["GifEncoder"],
    wavEncoder: _encoders_index__WEBPACK_IMPORTED_MODULE_3__["WavEncoder"],
    utils: _utils_index__WEBPACK_IMPORTED_MODULE_0__,
});


/***/ }),

/***/ "./loaders/arrayBufferLoader.ts":
/*!**************************************!*\
  !*** ./loaders/arrayBufferLoader.ts ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
    matches: function (source) {
        return (source instanceof ArrayBuffer);
    },
    load: function (source, resolve, reject) {
        resolve(source);
    }
});


/***/ }),

/***/ "./loaders/fileLoader.ts":
/*!*******************************!*\
  !*** ./loaders/fileLoader.ts ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
    matches: function (source) {
        return (typeof File !== 'undefined' && source instanceof File);
    },
    load: function (source, resolve, reject) {
        if (typeof FileReader !== 'undefined') {
            var reader_1 = new FileReader();
            reader_1.onload = function (event) {
                resolve(reader_1.result);
            };
            reader_1.onerror = function (event) {
                reject({ type: 'fileReadError' });
            };
            reader_1.readAsArrayBuffer(source);
        }
        else {
            reject();
        }
    }
});


/***/ }),

/***/ "./loaders/index.ts":
/*!**************************!*\
  !*** ./loaders/index.ts ***!
  \**************************/
/*! exports provided: loadSource */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadSource", function() { return loadSource; });
/* harmony import */ var _urlLoader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./urlLoader */ "./loaders/urlLoader.ts");
/* harmony import */ var _fileLoader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fileLoader */ "./loaders/fileLoader.ts");
/* harmony import */ var _arrayBufferLoader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./arrayBufferLoader */ "./loaders/arrayBufferLoader.ts");



var loaders = [
    _urlLoader__WEBPACK_IMPORTED_MODULE_0__["default"],
    _fileLoader__WEBPACK_IMPORTED_MODULE_1__["default"],
    _arrayBufferLoader__WEBPACK_IMPORTED_MODULE_2__["default"]
];
function loadSource(source) {
    return new Promise(function (resolve, reject) {
        loaders.forEach(function (loader) {
            if (loader.matches(source)) {
                loader.load(source, resolve, reject);
            }
        });
    });
}


/***/ }),

/***/ "./loaders/urlLoader.ts":
/*!******************************!*\
  !*** ./loaders/urlLoader.ts ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
    matches: function (source) {
        return typeof source === 'string';
    },
    load: function (source, resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', source, true);
        xhr.responseType = 'arraybuffer';
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response);
                }
                else {
                    reject({
                        type: 'httpError',
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                }
            }
        };
        xhr.send(null);
    }
});


/***/ }),

/***/ "./parsers/adpcm.ts":
/*!**************************!*\
  !*** ./parsers/adpcm.ts ***!
  \**************************/
/*! exports provided: ADPCM_INDEX_TABLE_2, ADPCM_INDEX_TABLE_4, ADPCM_STEP_TABLE, ADPCM_SAMPLE_TABLE_2, ADPCM_SAMPLE_TABLE_4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ADPCM_INDEX_TABLE_2", function() { return ADPCM_INDEX_TABLE_2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ADPCM_INDEX_TABLE_4", function() { return ADPCM_INDEX_TABLE_4; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ADPCM_STEP_TABLE", function() { return ADPCM_STEP_TABLE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ADPCM_SAMPLE_TABLE_2", function() { return ADPCM_SAMPLE_TABLE_2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ADPCM_SAMPLE_TABLE_4", function() { return ADPCM_SAMPLE_TABLE_4; });
var ADPCM_INDEX_TABLE_2 = new Int8Array([
    -1, 2, -1, 2
]);
var ADPCM_INDEX_TABLE_4 = new Int8Array([
    -1, -1, -1, -1, 2, 4, 6, 8,
    -1, -1, -1, -1, 2, 4, 6, 8
]);
// note that this is a slight deviation from the normal adpcm table
var ADPCM_STEP_TABLE = new Int16Array([
    7, 8, 9, 10, 11, 12, 13, 14, 16, 17,
    19, 21, 23, 25, 28, 31, 34, 37, 41, 45,
    50, 55, 60, 66, 73, 80, 88, 97, 107, 118,
    130, 143, 157, 173, 190, 209, 230, 253, 279, 307,
    337, 371, 408, 449, 494, 544, 598, 658, 724, 796,
    876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066,
    2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358,
    5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899,
    15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767, 0
]);
var ADPCM_SAMPLE_TABLE_2 = new Int16Array(90 * 4);
for (var sample = 0; sample < 4; sample++) {
    for (var stepIndex = 0; stepIndex < 90; stepIndex++) {
        var step = ADPCM_STEP_TABLE[stepIndex];
        var diff = step >> 3;
        if (sample & 1)
            diff += step;
        if (sample & 2)
            diff = -diff;
        ADPCM_SAMPLE_TABLE_2[sample + 4 * stepIndex] = diff;
    }
}
var ADPCM_SAMPLE_TABLE_4 = new Int16Array(90 * 16);
for (var sample = 0; sample < 16; sample++) {
    for (var stepIndex = 0; stepIndex < 90; stepIndex++) {
        var step = ADPCM_STEP_TABLE[stepIndex];
        var diff = step >> 3;
        if (sample & 4)
            diff += step;
        if (sample & 2)
            diff += step >> 1;
        if (sample & 1)
            diff += step >> 2;
        if (sample & 8)
            diff = -diff;
        ADPCM_SAMPLE_TABLE_4[sample + 16 * stepIndex] = diff;
    }
}


/***/ }),

/***/ "./parsers/index.ts":
/*!**************************!*\
  !*** ./parsers/index.ts ***!
  \**************************/
/*! exports provided: parseSource, PpmParser, KwzParser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseSource", function() { return parseSource; });
/* harmony import */ var _loaders_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../loaders/index */ "./loaders/index.ts");
/* harmony import */ var _ppm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ppm */ "./parsers/ppm.ts");
/* harmony import */ var _kwz__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./kwz */ "./parsers/kwz.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PpmParser", function() { return _ppm__WEBPACK_IMPORTED_MODULE_1__["PpmParser"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "KwzParser", function() { return _kwz__WEBPACK_IMPORTED_MODULE_2__["KwzParser"]; });




function parseSource(source) {
    return Object(_loaders_index__WEBPACK_IMPORTED_MODULE_0__["loadSource"])(source)
        .then(function (arrayBuffer) {
        return new Promise(function (resolve, reject) {
            // check the buffer's magic to identify which format it uses
            var data = new DataView(arrayBuffer, 0, 4);
            var magic = data.getUint32(0);
            if (magic === 0x50415241) { // check if magic is PARA (ppm magic)
                resolve(new _ppm__WEBPACK_IMPORTED_MODULE_1__["PpmParser"](arrayBuffer));
            }
            else if ((magic & 0xFFFFFF00) === 0x4B464800) { // check if magic is KFH (kwz magic)
                resolve(new _kwz__WEBPACK_IMPORTED_MODULE_2__["KwzParser"](arrayBuffer));
            }
            else {
                reject();
            }
        });
    });
}




/***/ }),

/***/ "./parsers/kwz.ts":
/*!************************!*\
  !*** ./parsers/kwz.ts ***!
  \************************/
/*! exports provided: KwzParser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KwzParser", function() { return KwzParser; });
/* harmony import */ var _utils_dataStream__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/dataStream */ "./utils/dataStream.ts");
/* harmony import */ var _adpcm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adpcm */ "./parsers/adpcm.ts");
/* harmony import */ var _kwzTables__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./kwzTables */ "./parsers/kwzTables.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var FRAMERATES = [
    0.2,
    0.5,
    1,
    2,
    4,
    6,
    8,
    12,
    20,
    24,
    30
];
var PALETTE = {
    WHITE: [0xff, 0xff, 0xff],
    BLACK: [0x10, 0x10, 0x10],
    RED: [0xff, 0x10, 0x10],
    YELLOW: [0xff, 0xe7, 0x00],
    GREEN: [0x00, 0x86, 0x31],
    BLUE: [0x00, 0x38, 0xce],
    NONE: [0xff, 0xff, 0xff]
};
;
;
var KwzParser = /** @class */ (function (_super) {
    __extends(KwzParser, _super);
    function KwzParser(arrayBuffer) {
        var _this = _super.call(this, arrayBuffer) || this;
        _this.type = KwzParser.type;
        _this.width = KwzParser.width;
        _this.height = KwzParser.height;
        _this.palette = PALETTE;
        _this.globalPalette = KwzParser.globalPalette;
        _this.sampleRate = KwzParser.sampleRate;
        _this.prevDecodedFrame = null;
        _this.bitIndex = 0;
        _this.bitValue = 0;
        _this.layers = [
            new Uint16Array(KwzParser.width * KwzParser.height),
            new Uint16Array(KwzParser.width * KwzParser.height),
            new Uint16Array(KwzParser.width * KwzParser.height),
        ];
        _this.bitIndex = 0;
        _this.bitValue = 0;
        _this.load();
        return _this;
    }
    KwzParser.prototype.load = function () {
        this.seek(0);
        this.sections = {};
        this.frameMeta = [];
        var fileSize = this.byteLength - 256;
        var offset = 0;
        var sectionCount = 0;
        // counting sections should mitigate against one of mrnbayoh's notehax exploits
        while ((offset < fileSize) && (sectionCount < 6)) {
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
        this.decodeMeta();
        this.decodeFrameMeta();
        this.decodeSoundHeader();
    };
    KwzParser.prototype.readBits = function (num) {
        if (this.bitIndex + num > 16) {
            var nextBits = this.readUint16();
            this.bitValue |= nextBits << (16 - this.bitIndex);
            this.bitIndex -= 16;
        }
        var mask = (1 << num) - 1;
        var result = this.bitValue & mask;
        this.bitValue >>= num;
        this.bitIndex += num;
        return result;
    };
    KwzParser.prototype.decodeMeta = function () {
        this.seek(this.sections['KFH'].offset + 12);
        var creationTimestamp = new Date((this.readUint32() + 946684800) * 1000), modifiedTimestamp = new Date((this.readUint32() + 946684800) * 1000), appVersion = this.readUint32(), rootAuthorId = this.readHex(10), parentAuthorId = this.readHex(10), currentAuthorId = this.readHex(10), rootAuthorName = this.readUtf16(11), parentAuthorName = this.readUtf16(11), currentAuthorName = this.readUtf16(11), rootFilename = this.readUtf8(28), parentFilename = this.readUtf8(28), currentFilename = this.readUtf8(28), frameCount = this.readUint16(), thumbIndex = this.readUint16(), flags = this.readUint16(), frameSpeed = this.readUint8(), layerFlags = this.readUint8();
        this.frameCount = frameCount;
        this.thumbFrameIndex = thumbIndex;
        this.frameSpeed = frameSpeed;
        this.framerate = FRAMERATES[frameSpeed];
        this.meta = {
            lock: (flags & 0x1) === 1,
            loop: ((flags >> 1) & 0x01) === 1,
            frame_count: frameCount,
            frame_speed: frameSpeed,
            thumb_index: thumbIndex,
            timestamp: modifiedTimestamp,
            creation_timestamp: creationTimestamp,
            root: {
                username: rootAuthorName,
                fsid: rootAuthorId,
                filename: rootFilename,
            },
            parent: {
                username: parentAuthorName,
                fsid: parentAuthorId,
                filename: parentFilename,
            },
            current: {
                username: currentAuthorName,
                fsid: currentAuthorId,
                filename: currentFilename,
            },
        };
    };
    KwzParser.prototype.decodeFrameMeta = function () {
        this.frameOffsets = new Uint32Array(this.frameCount);
        this.seek(this.sections['KMI'].offset + 8);
        var offset = this.sections['KMC'].offset + 12;
        for (var i = 0; i < this.frameCount; i++) {
            var frame = {
                flags: this.readUint32(),
                layerSize: [
                    this.readUint16(),
                    this.readUint16(),
                    this.readUint16()
                ],
                frameAuthor: this.readHex(10),
                layerDepth: [
                    this.readUint8(),
                    this.readUint8(),
                    this.readUint8(),
                ],
                soundFlags: this.readUint8(),
                cameraFlag: this.readUint32(),
            };
            this.frameMeta.push(frame);
            this.frameOffsets[i] = offset;
            offset += frame.layerSize[0] + frame.layerSize[1] + frame.layerSize[2];
        }
    };
    KwzParser.prototype.decodeSoundHeader = function () {
        if (this.sections.hasOwnProperty('KSN')) {
            var offset = this.sections['KSN'].offset + 8;
            this.seek(offset);
            var bgmSpeed = this.readUint32();
            this.bgmSpeed = bgmSpeed;
            this.bgmrate = FRAMERATES[bgmSpeed];
            var trackSizes = new Uint32Array(this.buffer, offset + 4, 20);
            this.soundMeta = {
                'bgm': { offset: offset += 28, length: trackSizes[0] },
                'se1': { offset: offset += trackSizes[0], length: trackSizes[1] },
                'se2': { offset: offset += trackSizes[1], length: trackSizes[2] },
                'se3': { offset: offset += trackSizes[2], length: trackSizes[3] },
                'se4': { offset: offset += trackSizes[3], length: trackSizes[4] },
            };
        }
    };
    KwzParser.prototype.getDiffingFlag = function (frameIndex) {
        return ~(this.frameMeta[frameIndex].flags >> 4) & 0x07;
    };
    KwzParser.prototype.getLayerDepths = function (frameIndex) {
        return this.frameMeta[frameIndex].layerDepth;
    };
    // sort layer indices sorted by depth, drom bottom to top
    KwzParser.prototype.getLayerOrder = function (frameIndex) {
        var depths = this.getLayerDepths(frameIndex);
        return [2, 1, 0].sort(function (a, b) { return depths[b] - depths[a]; });
    };
    KwzParser.prototype.decodeFrame = function (frameIndex, diffingFlag, isPrevFrame) {
        if (diffingFlag === void 0) { diffingFlag = 0x7; }
        if (isPrevFrame === void 0) { isPrevFrame = false; }
        // if this frame is being decoded as a prev frame, then we only want to decode the layers necessary
        if (isPrevFrame)
            diffingFlag &= this.getDiffingFlag(frameIndex + 1);
        // the prevDecodedFrame check is an optimisation for decoding frames in full sequence
        if ((frameIndex !== 0) && (this.prevDecodedFrame !== frameIndex - 1) && (diffingFlag))
            this.decodeFrame(frameIndex - 1, diffingFlag = diffingFlag, isPrevFrame = true);
        var meta = this.frameMeta[frameIndex];
        var offset = this.frameOffsets[frameIndex];
        for (var layerIndex = 0; layerIndex < 3; layerIndex++) {
            this.seek(offset);
            var layerSize = meta.layerSize[layerIndex];
            offset += layerSize;
            // if the layer is 38 bytes then it hasn't changed at all since the previous frame, so we can skip it
            if (layerSize === 38)
                continue;
            if (((diffingFlag >> layerIndex) & 0x1) === 0)
                continue;
            this.bitIndex = 16;
            this.bitValue = 0;
            var skip = 0;
            for (var tileOffsetY = 0; tileOffsetY < KwzParser.height; tileOffsetY += 128) {
                for (var tileOffsetX = 0; tileOffsetX < KwzParser.width; tileOffsetX += 128) {
                    for (var subTileOffsetY = 0; subTileOffsetY < 128; subTileOffsetY += 8) {
                        var y = tileOffsetY + subTileOffsetY;
                        if (y >= KwzParser.height)
                            break;
                        for (var subTileOffsetX = 0; subTileOffsetX < 128; subTileOffsetX += 8) {
                            var x = tileOffsetX + subTileOffsetX;
                            if (x >= KwzParser.width)
                                break;
                            if (skip) {
                                skip -= 1;
                                continue;
                            }
                            var pixelOffset = y * KwzParser.width + x;
                            var pixelBuffer = this.layers[layerIndex];
                            var type = this.readBits(3);
                            if (type == 0) {
                                var lineIndex = _kwzTables__WEBPACK_IMPORTED_MODULE_2__["KWZ_TABLE_1"][this.readBits(5)];
                                var pixels = _kwzTables__WEBPACK_IMPORTED_MODULE_2__["KWZ_LINE_TABLE"].subarray(lineIndex * 8, lineIndex * 8 + 8);
                                pixelBuffer.set(pixels, pixelOffset);
                                pixelBuffer.set(pixels, pixelOffset + 320);
                                pixelBuffer.set(pixels, pixelOffset + 640);
                                pixelBuffer.set(pixels, pixelOffset + 960);
                                pixelBuffer.set(pixels, pixelOffset + 1280);
                                pixelBuffer.set(pixels, pixelOffset + 1600);
                                pixelBuffer.set(pixels, pixelOffset + 1920);
                                pixelBuffer.set(pixels, pixelOffset + 2240);
                            }
                            else if (type == 1) {
                                var lineIndex = this.readBits(13);
                                var pixels = _kwzTables__WEBPACK_IMPORTED_MODULE_2__["KWZ_LINE_TABLE"].subarray(lineIndex * 8, lineIndex * 8 + 8);
                                pixelBuffer.set(pixels, pixelOffset);
                                pixelBuffer.set(pixels, pixelOffset + 320);
                                pixelBuffer.set(pixels, pixelOffset + 640);
                                pixelBuffer.set(pixels, pixelOffset + 960);
                                pixelBuffer.set(pixels, pixelOffset + 1280);
                                pixelBuffer.set(pixels, pixelOffset + 1600);
                                pixelBuffer.set(pixels, pixelOffset + 1920);
                                pixelBuffer.set(pixels, pixelOffset + 2240);
                            }
                            else if (type == 2) {
                                var lineValue = this.readBits(5);
                                var lineIndexA = _kwzTables__WEBPACK_IMPORTED_MODULE_2__["KWZ_TABLE_1"][lineValue];
                                var lineIndexB = _kwzTables__WEBPACK_IMPORTED_MODULE_2__["KWZ_TABLE_2"][lineValue];
                                var a = _kwzTables__WEBPACK_IMPORTED_MODULE_2__["KWZ_LINE_TABLE"].subarray(lineIndexA * 8, lineIndexA * 8 + 8);
                                var b = _kwzTables__WEBPACK_IMPORTED_MODULE_2__["KWZ_LINE_TABLE"].subarray(lineIndexB * 8, lineIndexB * 8 + 8);
                                pixelBuffer.set(a, pixelOffset);
                                pixelBuffer.set(b, pixelOffset + 320);
                                pixelBuffer.set(a, pixelOffset + 640);
                                pixelBuffer.set(b, pixelOffset + 960);
                                pixelBuffer.set(a, pixelOffset + 1280);
                                pixelBuffer.set(b, pixelOffset + 1600);
                                pixelBuffer.set(a, pixelOffset + 1920);
                                pixelBuffer.set(b, pixelOffset + 2240);
                            }
                            else if (type == 3) {
                                var lineIndexA = this.readBits(13);
                                var lineIndexB = _kwzTables__WEBPACK_IMPORTED_MODULE_2__["KWZ_TABLE_3"][lineIndexA];
                                var a = _kwzTables__WEBPACK_IMPORTED_MODULE_2__["KWZ_LINE_TABLE"].subarray(lineIndexA * 8, lineIndexA * 8 + 8);
                                var b = _kwzTables__WEBPACK_IMPORTED_MODULE_2__["KWZ_LINE_TABLE"].subarray(lineIndexB * 8, lineIndexB * 8 + 8);
                                pixelBuffer.set(a, pixelOffset);
                                pixelBuffer.set(b, pixelOffset + 320);
                                pixelBuffer.set(a, pixelOffset + 640);
                                pixelBuffer.set(b, pixelOffset + 960);
                                pixelBuffer.set(a, pixelOffset + 1280);
                                pixelBuffer.set(b, pixelOffset + 1600);
                                pixelBuffer.set(a, pixelOffset + 1920);
                                pixelBuffer.set(b, pixelOffset + 2240);
                            }
                            else if (type == 4) {
                                var mask = this.readBits(8);
                                for (var line = 0; line < 8; line++) {
                                    var lineIndex = 0;
                                    if (mask & (1 << line)) {
                                        lineIndex = _kwzTables__WEBPACK_IMPORTED_MODULE_2__["KWZ_TABLE_1"][this.readBits(5)];
                                    }
                                    else {
                                        lineIndex = this.readBits(13);
                                    }
                                    var pixels = _kwzTables__WEBPACK_IMPORTED_MODULE_2__["KWZ_LINE_TABLE"].subarray(lineIndex * 8, lineIndex * 8 + 8);
                                    pixelBuffer.set(pixels, pixelOffset + line * 320);
                                }
                            }
                            else if (type == 5) {
                                skip = this.readBits(5);
                                continue;
                            }
                            // type 6 doesnt exist
                            else if (type == 7) {
                                var pattern = this.readBits(2);
                                var useTable = this.readBits(1);
                                var lineIndexA = 0;
                                var lineIndexB = 0;
                                if (useTable) {
                                    lineIndexA = _kwzTables__WEBPACK_IMPORTED_MODULE_2__["KWZ_TABLE_1"][this.readBits(5)];
                                    lineIndexB = _kwzTables__WEBPACK_IMPORTED_MODULE_2__["KWZ_TABLE_1"][this.readBits(5)];
                                    pattern = (pattern + 1) % 4;
                                }
                                else {
                                    lineIndexA = this.readBits(13);
                                    lineIndexB = this.readBits(13);
                                }
                                var a = _kwzTables__WEBPACK_IMPORTED_MODULE_2__["KWZ_LINE_TABLE"].subarray(lineIndexA * 8, lineIndexA * 8 + 8);
                                var b = _kwzTables__WEBPACK_IMPORTED_MODULE_2__["KWZ_LINE_TABLE"].subarray(lineIndexB * 8, lineIndexB * 8 + 8);
                                if (pattern == 0) {
                                    pixelBuffer.set(a, pixelOffset);
                                    pixelBuffer.set(b, pixelOffset + 320);
                                    pixelBuffer.set(a, pixelOffset + 640);
                                    pixelBuffer.set(b, pixelOffset + 960);
                                    pixelBuffer.set(a, pixelOffset + 1280);
                                    pixelBuffer.set(b, pixelOffset + 1600);
                                    pixelBuffer.set(a, pixelOffset + 1920);
                                    pixelBuffer.set(b, pixelOffset + 2240);
                                }
                                else if (pattern == 1) {
                                    pixelBuffer.set(a, pixelOffset);
                                    pixelBuffer.set(a, pixelOffset + 320);
                                    pixelBuffer.set(b, pixelOffset + 640);
                                    pixelBuffer.set(a, pixelOffset + 960);
                                    pixelBuffer.set(a, pixelOffset + 1280);
                                    pixelBuffer.set(b, pixelOffset + 1600);
                                    pixelBuffer.set(a, pixelOffset + 1920);
                                    pixelBuffer.set(a, pixelOffset + 2240);
                                }
                                else if (pattern == 2) {
                                    pixelBuffer.set(a, pixelOffset);
                                    pixelBuffer.set(b, pixelOffset + 320);
                                    pixelBuffer.set(a, pixelOffset + 640);
                                    pixelBuffer.set(a, pixelOffset + 960);
                                    pixelBuffer.set(b, pixelOffset + 1280);
                                    pixelBuffer.set(a, pixelOffset + 1600);
                                    pixelBuffer.set(a, pixelOffset + 1920);
                                    pixelBuffer.set(b, pixelOffset + 2240);
                                }
                                else if (pattern == 3) {
                                    pixelBuffer.set(a, pixelOffset);
                                    pixelBuffer.set(b, pixelOffset + 320);
                                    pixelBuffer.set(b, pixelOffset + 640);
                                    pixelBuffer.set(a, pixelOffset + 960);
                                    pixelBuffer.set(b, pixelOffset + 1280);
                                    pixelBuffer.set(b, pixelOffset + 1600);
                                    pixelBuffer.set(a, pixelOffset + 1920);
                                    pixelBuffer.set(b, pixelOffset + 2240);
                                }
                            }
                        }
                    }
                }
            }
        }
        this.prevDecodedFrame = frameIndex;
        // return this._layers;
        return [
            new Uint8Array(this.layers[0].buffer),
            new Uint8Array(this.layers[1].buffer),
            new Uint8Array(this.layers[2].buffer),
        ];
    };
    KwzParser.prototype.getFramePalette = function (frameIndex) {
        var flags = this.frameMeta[frameIndex].flags;
        var paletteMap = [
            this.palette.WHITE,
            this.palette.BLACK,
            this.palette.RED,
            this.palette.YELLOW,
            this.palette.GREEN,
            this.palette.BLUE,
            this.palette.NONE
        ];
        return [
            paletteMap[flags & 0xF],
            paletteMap[(flags >> 8) & 0xF],
            paletteMap[(flags >> 12) & 0xF],
            paletteMap[(flags >> 16) & 0xF],
            paletteMap[(flags >> 20) & 0xF],
            paletteMap[(flags >> 24) & 0xF],
            paletteMap[(flags >> 28) & 0xF],
        ];
    };
    // retuns an uint8 array where each item is a pixel's palette index
    KwzParser.prototype.getLayerPixels = function (frameIndex, layerIndex) {
        if (this.prevDecodedFrame !== frameIndex) {
            this.decodeFrame(frameIndex);
        }
        var layers = this.layers[layerIndex];
        var image = new Uint8Array((KwzParser.width * KwzParser.height));
        var paletteOffset = layerIndex * 2 + 1;
        for (var pixelIndex = 0; pixelIndex < layers.length; pixelIndex++) {
            var pixel = layers[pixelIndex];
            if (pixel & 0xff00) {
                image[pixelIndex] = paletteOffset;
            }
            else if (pixel & 0x00ff) {
                image[pixelIndex] = paletteOffset + 1;
            }
        }
        return image;
    };
    // retuns an uint8 array where each item is a pixel's palette index
    KwzParser.prototype.getFramePixels = function (frameIndex, useGlobalPalette) {
        var _this = this;
        if (useGlobalPalette === void 0) { useGlobalPalette = false; }
        var paletteMap;
        if (useGlobalPalette) {
            var framePalette = this.getFramePalette(frameIndex);
            paletteMap = framePalette.map(function (color) { return KwzParser.globalPalette.indexOf(color); });
        }
        else {
            paletteMap = [0, 1, 2, 3, 4, 5, 6];
        }
        var image = new Uint8Array((KwzParser.width * KwzParser.height));
        image.fill(paletteMap[0]);
        var layerOrder = this.getLayerOrder(frameIndex);
        layerOrder.forEach(function (layerIndex) {
            var layer = _this.getLayerPixels(frameIndex, layerIndex);
            // merge layer into image result
            for (var pixelIndex = 0; pixelIndex < layer.length; pixelIndex++) {
                var pixel = layer[pixelIndex];
                if (pixel !== 0) {
                    image[pixelIndex] = paletteMap[pixel];
                }
            }
        });
        return image;
    };
    KwzParser.prototype.decodeSoundFlags = function () {
        return this.frameMeta.map(function (frame) {
            var soundFlags = frame.soundFlags;
            return [
                soundFlags & 0x1,
                (soundFlags >> 1) & 0x1,
                (soundFlags >> 2) & 0x1,
                (soundFlags >> 3) & 0x1,
            ];
        });
    };
    KwzParser.prototype.hasAudioTrack = function (trackIndex) {
        var keys = ['bgm', 'se1', 'se2', 'se3', 'se4'];
        var id = keys[trackIndex];
        return this.soundMeta[id].length > 0;
    };
    KwzParser.prototype.decodeAudio = function (track) {
        var trackMeta = this.soundMeta[track];
        var adpcm = new Uint8Array(this.buffer, trackMeta.offset, trackMeta.length);
        var output = new Int16Array(16364 * 60);
        var outputOffset = 0;
        // initial decoder state
        var prevDiff = 0;
        var prevStepIndex = 40;
        var sample;
        var diff;
        var stepIndex;
        // loop through each byte in the raw adpcm data
        for (var adpcmOffset = 0; adpcmOffset < adpcm.length; adpcmOffset++) {
            var byte = adpcm[adpcmOffset];
            var bitPos = 0;
            while (bitPos < 8) {
                if (prevStepIndex < 18 || bitPos == 6) {
                    // isolate 2-bit sample
                    sample = (byte >> bitPos) & 0x3;
                    // get diff
                    diff = prevDiff + _adpcm__WEBPACK_IMPORTED_MODULE_1__["ADPCM_SAMPLE_TABLE_2"][sample + 4 * prevStepIndex];
                    // get step index
                    stepIndex = prevStepIndex + _adpcm__WEBPACK_IMPORTED_MODULE_1__["ADPCM_INDEX_TABLE_2"][sample];
                    bitPos += 2;
                }
                else {
                    // isolate 4-bit sample
                    sample = (byte >> bitPos) & 0xF;
                    // get diff
                    diff = prevDiff + _adpcm__WEBPACK_IMPORTED_MODULE_1__["ADPCM_SAMPLE_TABLE_4"][sample + 16 * prevStepIndex];
                    // get step index
                    stepIndex = prevStepIndex + _adpcm__WEBPACK_IMPORTED_MODULE_1__["ADPCM_INDEX_TABLE_4"][sample];
                    bitPos += 4;
                }
                // clamp step index and diff
                stepIndex = Math.max(0, Math.min(stepIndex, 79));
                diff = Math.max(-2048, Math.min(diff, 2048));
                // add result to output buffer
                output[outputOffset] = (diff * 16);
                outputOffset += 1;
                // set prev decoder state
                prevStepIndex = stepIndex;
                prevDiff = diff;
            }
        }
        return output.slice(0, outputOffset);
    };
    KwzParser.type = 'KWZ';
    KwzParser.sampleRate = 16364;
    KwzParser.width = 320;
    KwzParser.height = 240;
    KwzParser.globalPalette = [
        PALETTE.BLACK,
        PALETTE.WHITE,
        PALETTE.RED,
        PALETTE.YELLOW,
        PALETTE.GREEN,
        PALETTE.BLUE,
        PALETTE.NONE,
    ];
    return KwzParser;
}(_utils_dataStream__WEBPACK_IMPORTED_MODULE_0__["DataStream"]));



/***/ }),

/***/ "./parsers/kwzTables.ts":
/*!******************************!*\
  !*** ./parsers/kwzTables.ts ***!
  \******************************/
/*! exports provided: KWZ_TABLE_1, KWZ_TABLE_2, KWZ_TABLE_3, KWZ_LINE_TABLE */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KWZ_TABLE_1", function() { return KWZ_TABLE_1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KWZ_TABLE_2", function() { return KWZ_TABLE_2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KWZ_TABLE_3", function() { return KWZ_TABLE_3; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KWZ_LINE_TABLE", function() { return KWZ_LINE_TABLE; });
// table1 - commonly occuring line offsets
var KWZ_TABLE_1 = new Uint16Array([
    0x0000, 0x0CD0, 0x19A0, 0x02D9, 0x088B, 0x0051, 0x00F3, 0x0009,
    0x001B, 0x0001, 0x0003, 0x05B2, 0x1116, 0x00A2, 0x01E6, 0x0012,
    0x0036, 0x0002, 0x0006, 0x0B64, 0x08DC, 0x0144, 0x00FC, 0x0024,
    0x001C, 0x0004, 0x0334, 0x099C, 0x0668, 0x1338, 0x1004, 0x166C
]);
// table2 - commonly occuring line offsets, but the lines are shifted to the left by one pixel
var KWZ_TABLE_2 = new Uint16Array([
    0x0000, 0x0CD0, 0x19A0, 0x0003, 0x02D9, 0x088B, 0x0051, 0x00F3,
    0x0009, 0x001B, 0x0001, 0x0006, 0x05B2, 0x1116, 0x00A2, 0x01E6,
    0x0012, 0x0036, 0x0002, 0x02DC, 0x0B64, 0x08DC, 0x0144, 0x00FC,
    0x0024, 0x001C, 0x099C, 0x0334, 0x1338, 0x0668, 0x166C, 0x1004
]);
// table3 - line offsets, but the lines are shifted to the left by one pixel
var KWZ_TABLE_3 = new Uint16Array(6561);
var index = 0;
for (var a = 0; a < 2187; a += 729)
    for (var b = 0; b < 729; b += 243)
        for (var c = 0; c < 243; c += 81)
            for (var d = 0; d < 81; d += 27)
                for (var e = 0; e < 27; e += 9)
                    for (var f = 0; f < 9; f += 3)
                        for (var g = 0; g < 3; g += 1)
                            for (var h = 0; h < 6561; h += 2187) {
                                KWZ_TABLE_3[index] = a + b + c + d + e + f + g + h;
                                index += 1;
                            }
// linetable - contains every possible sequence of pixels for each tile line
var KWZ_LINE_TABLE = new Uint16Array(6561 * 8);
var pixelValues = [0x0000, 0xFF00, 0x00FF];
var offset = 0;
for (var a = 0; a < 3; a++)
    for (var b = 0; b < 3; b++)
        for (var c = 0; c < 3; c++)
            for (var d = 0; d < 3; d++)
                for (var e = 0; e < 3; e++)
                    for (var f = 0; f < 3; f++)
                        for (var g = 0; g < 3; g++)
                            for (var h = 0; h < 3; h++) {
                                KWZ_LINE_TABLE.set([
                                    pixelValues[b],
                                    pixelValues[a],
                                    pixelValues[d],
                                    pixelValues[c],
                                    pixelValues[f],
                                    pixelValues[e],
                                    pixelValues[h],
                                    pixelValues[g]
                                ], offset);
                                offset += 8;
                            }


/***/ }),

/***/ "./parsers/ppm.ts":
/*!************************!*\
  !*** ./parsers/ppm.ts ***!
  \************************/
/*! exports provided: PpmParser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PpmParser", function() { return PpmParser; });
/* harmony import */ var _utils_dataStream__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/dataStream */ "./utils/dataStream.ts");
/* harmony import */ var _adpcm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adpcm */ "./parsers/adpcm.ts");
/**
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
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


// internal frame speed value -> FPS table
var FRAMERATES = [
    null,
    0.5,
    1,
    2,
    4,
    6,
    12,
    20,
    30,
];
var PALETTE = {
    WHITE: [0xff, 0xff, 0xff],
    BLACK: [0x0e, 0x0e, 0x0e],
    RED: [0xff, 0x2a, 0x2a],
    BLUE: [0x0a, 0x39, 0xff],
};
;
var PpmParser = /** @class */ (function (_super) {
    __extends(PpmParser, _super);
    function PpmParser(arrayBuffer) {
        var _this = _super.call(this, arrayBuffer) || this;
        _this.type = PpmParser.type;
        _this.width = PpmParser.width;
        _this.height = PpmParser.height;
        _this.palette = PALETTE;
        _this.globalPalette = PpmParser.globalPalette;
        _this.sampleRate = PpmParser.sampleRate;
        _this.prevDecodedFrame = null;
        _this.decodeHeader();
        _this.decodeAnimationHeader();
        _this.decodeSoundHeader();
        _this.decodeMeta();
        // create image buffers
        _this.layers = [
            new Uint8Array(PpmParser.width * PpmParser.height),
            new Uint8Array(PpmParser.width * PpmParser.height)
        ];
        _this.prevLayers = [
            new Uint8Array(PpmParser.width * PpmParser.height),
            new Uint8Array(PpmParser.width * PpmParser.height)
        ];
        _this.prevDecodedFrame = null;
        return _this;
    }
    PpmParser.validateFSID = function (fsid) {
        return /[0159]{1}[0-9A-F]{6}0[0-9A-F]{8}/.test(fsid);
    };
    PpmParser.validateFilename = function (filename) {
        return /[0-9A-F]{6}_[0-9A-F]{13}_[0-9]{3}/.test(filename);
    };
    PpmParser.prototype.readFilename = function () {
        return [
            this.readHex(3),
            this.readUtf8(13),
            this.readUint16().toString().padStart(3, '0')
        ].join('_');
    };
    PpmParser.prototype.readLineEncoding = function () {
        var unpacked = new Uint8Array(PpmParser.height);
        for (var byteIndex = 0; byteIndex < 48; byteIndex++) {
            var byte = this.readUint8();
            // each line's encoding type is stored as a 2-bit value
            for (var bitOffset = 0; bitOffset < 8; bitOffset += 2) {
                unpacked[byteIndex * 4 + bitOffset / 2] = (byte >> bitOffset) & 0x03;
            }
        }
        return unpacked;
    };
    PpmParser.prototype.decodeHeader = function () {
        this.seek(0);
        // decode header
        // https://github.com/pbsds/hatena-server/wiki/PPM-format#file-header
        var magic = this.readUint32();
        this.frameDataLength = this.readUint32();
        this.soundDataLength = this.readUint32();
        this.frameCount = this.readUint16() + 1;
        this.version = this.readUint16();
    };
    PpmParser.prototype.decodeMeta = function () {
        // https://github.com/pbsds/hatena-server/wiki/PPM-format#file-header
        this.seek(0x10);
        var lock = this.readUint16(), thumbIndex = this.readInt16(), rootAuthorName = this.readUtf16(11), parentAuthorName = this.readUtf16(11), currentAuthorName = this.readUtf16(11), parentAuthorId = this.readHex(8, true), currentAuthorId = this.readHex(8, true), parentFilename = this.readFilename(), currentFilename = this.readFilename(), rootAuthorId = this.readHex(8, true);
        this.seek(0x9A);
        var timestamp = new Date((this.readUint32() + 946684800) * 1000);
        this.seek(0x06A6);
        var flags = this.readUint16();
        this.thumbFrameIndex = thumbIndex;
        this.meta = {
            lock: lock === 1,
            loop: (flags >> 1 & 0x01) === 1,
            frame_count: this.frameCount,
            frame_speed: this.frameSpeed,
            bgm_speed: this.bgmSpeed,
            thumb_index: thumbIndex,
            timestamp: timestamp,
            spinoff: (currentAuthorId !== parentAuthorId) || (currentAuthorId !== rootAuthorId),
            root: {
                filename: null,
                username: rootAuthorName,
                fsid: rootAuthorId,
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
            },
        };
    };
    PpmParser.prototype.decodeAnimationHeader = function () {
        var _this = this;
        // jump to the start of the animation data section
        // https://github.com/pbsds/hatena-server/wiki/PPM-format#animation-data-section
        this.seek(0x06A0);
        var offsetTableLength = this.readUint16();
        // skip padding + flags
        this.seek(0x06A8);
        // read frame offsets and build them into a table
        this.frameOffsets = new Uint32Array(offsetTableLength / 4).map(function (value) {
            return 0x06A8 + offsetTableLength + _this.readUint32();
        });
    };
    PpmParser.prototype.decodeSoundHeader = function () {
        // https://github.com/pbsds/hatena-server/wiki/PPM-format#sound-data-section
        // offset = frame data offset + frame data length + sound effect flags
        var offset = 0x06A0 + this.frameDataLength + this.frameCount;
        // account for multiple-of-4 padding
        if (offset % 4 != 0)
            offset += 4 - (offset % 4);
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
            bgm: { offset: offset, length: bgmLen },
            se1: { offset: offset += bgmLen, length: se1Len },
            se2: { offset: offset += se1Len, length: se2Len },
            se3: { offset: offset += se2Len, length: se3Len },
        };
    };
    PpmParser.prototype.isNewFrame = function (frameIndex) {
        this.seek(this.frameOffsets[frameIndex]);
        var header = this.readUint8();
        return (header >> 7) & 0x1;
    };
    PpmParser.prototype.getFramePalette = function (frameIndex) {
        this.seek(this.frameOffsets[frameIndex]);
        var palette = this.palette;
        var header = this.readUint8();
        var paperColor = header & 0x1;
        var pen = [
            palette.BLACK,
            paperColor == 1 ? palette.BLACK : palette.WHITE,
            palette.RED,
            palette.BLUE,
        ];
        return [
            paperColor == 1 ? palette.WHITE : palette.BLACK,
            pen[(header >> 1) & 0x3],
            pen[(header >> 3) & 0x3],
        ];
    };
    PpmParser.prototype.getLayerOrder = function (frameIndex) {
        return [0, 1];
    };
    PpmParser.prototype.decodeFrame = function (frameIndex) {
        if ((frameIndex !== 0) && (this.prevDecodedFrame !== frameIndex - 1) && (!this.isNewFrame(frameIndex)))
            this.decodeFrame(frameIndex - 1);
        // https://github.com/pbsds/hatena-server/wiki/PPM-format#animation-frame
        this.seek(this.frameOffsets[frameIndex]);
        var header = this.readUint8();
        var isNewFrame = (header >> 7) & 0x1;
        var isTranslated = (header >> 5) & 0x3;
        var translateX = 0;
        var translateY = 0;
        // copy the current layer buffers to the previous ones
        this.prevLayers[0].set(this.layers[0]);
        this.prevLayers[1].set(this.layers[1]);
        this.prevDecodedFrame = frameIndex;
        // reset current layer buffers
        this.layers[0].fill(0);
        this.layers[1].fill(0);
        if (isTranslated) {
            translateX = this.readInt8();
            translateY = this.readInt8();
        }
        var layerEncoding = [
            this.readLineEncoding(),
            this.readLineEncoding(),
        ];
        // start decoding layer bitmaps
        for (var layer = 0; layer < 2; layer++) {
            var layerBitmap = this.layers[layer];
            for (var line = 0; line < PpmParser.height; line++) {
                var lineType = layerEncoding[layer][line];
                var chunkOffset = line * PpmParser.width;
                switch (lineType) {
                    // line type 0 = blank line, decode nothing
                    case 0:
                        break;
                    // line types 1 + 2 = compressed bitmap line
                    case 1:
                    case 2:
                        var lineHeader = this.readUint32(false);
                        // line type 2 starts as an inverted line
                        if (lineType == 2)
                            layerBitmap.fill(0xFF, chunkOffset, chunkOffset + PpmParser.width);
                        // loop through each bit in the line header
                        while (lineHeader & 0xFFFFFFFF) {
                            // if the bit is set, this 8-pix wide chunk is stored
                            // else we can just leave it blank and move on to the next chunk
                            if (lineHeader & 0x80000000) {
                                var chunk = this.readUint8();
                                // unpack chunk bits
                                for (var pixel = 0; pixel < 8; pixel++) {
                                    layerBitmap[chunkOffset + pixel] = (chunk >> pixel & 0x1) ? 0xFF : 0x00;
                                }
                            }
                            chunkOffset += 8;
                            // shift lineheader to the left by 1 bit, now on the next loop cycle the next bit will be checked
                            lineHeader <<= 1;
                        }
                        break;
                    // line type 3 = raw bitmap line
                    case 3:
                        while (chunkOffset < (line + 1) * PpmParser.width) {
                            var chunk = this.readUint8();
                            for (var pixel = 0; pixel < 8; pixel++) {
                                layerBitmap[chunkOffset + pixel] = (chunk >> pixel & 0x1) ? 0xFF : 0x00;
                            }
                            chunkOffset += 8;
                        }
                        break;
                }
            }
        }
        // if the current frame is based on changes from the preivous one, merge them by XORing their values
        if (!isNewFrame) {
            var dest = void 0, src = void 0;
            // loop through each line
            for (var y = 0; y < PpmParser.height; y++) {
                // skip to next line if this one falls off the top edge of the screen
                if (y - translateY < 0)
                    continue;
                // stop once the bottom screen edge has been reached
                if (y - translateY >= PpmParser.height)
                    break;
                // loop through each pixel in the line
                for (var x = 0; x < PpmParser.width; x++) {
                    // skip to the next pixel if this one falls off the left edge of the screen
                    if (x - translateX < 0)
                        continue;
                    // stop diffing this line once the right screen edge has been reached
                    if (x - translateX >= PpmParser.width)
                        break;
                    dest = x + y * PpmParser.width;
                    src = dest - (translateX + translateY * PpmParser.width);
                    // diff pixels with a binary XOR
                    this.layers[0][dest] ^= this.prevLayers[0][src];
                    this.layers[1][dest] ^= this.prevLayers[1][src];
                }
            }
        }
        return this.layers;
    };
    // retuns an uint8 array where each item is a pixel's palette index
    PpmParser.prototype.getLayerPixels = function (frameIndex, layerIndex) {
        if (this.prevDecodedFrame !== frameIndex) {
            this.decodeFrame(frameIndex);
        }
        var layer = this.layers[layerIndex];
        var image = new Uint8Array(PpmParser.width * PpmParser.height);
        var layerColor = layerIndex + 1;
        for (var pixel = 0; pixel < image.length; pixel++) {
            if (layer[pixel] !== 0) {
                image[pixel] = layerColor;
            }
        }
        return image;
    };
    // retuns an uint8 array where each item is a pixel's palette index
    PpmParser.prototype.getFramePixels = function (frameIndex, useGlobalPalette) {
        if (useGlobalPalette === void 0) { useGlobalPalette = false; }
        var paletteMap;
        if (useGlobalPalette) {
            var framePalette = this.getFramePalette(frameIndex);
            paletteMap = framePalette.map(function (color) { return PpmParser.globalPalette.indexOf(color); });
        }
        else {
            paletteMap = [0, 1, 2];
        }
        var layers = this.decodeFrame(frameIndex);
        var image = new Uint8Array(PpmParser.width * PpmParser.height);
        image.fill(paletteMap[0]);
        for (var pixel = 0; pixel < image.length; pixel++) {
            var a = layers[0][pixel];
            var b = layers[1][pixel];
            if (b)
                image[pixel] = paletteMap[2];
            if (a)
                image[pixel] = paletteMap[1];
        }
        return image;
    };
    PpmParser.prototype.hasAudioTrack = function (trackIndex) {
        var keys = ['bgm', 'se1', 'se2', 'se3'];
        var id = keys[trackIndex];
        return this.soundMeta[id].length > 0;
    };
    PpmParser.prototype.decodeAudio = function (track) {
        var trackMeta = this.soundMeta[track];
        var adpcm = new Uint8Array(this.buffer, trackMeta.offset, trackMeta.length);
        var output = new Int16Array(adpcm.length * 2);
        var outputOffset = 0;
        // initial decoder state
        var prevDiff = 0;
        var prevStepIndex = 0;
        var sample;
        var diff;
        var stepIndex;
        // loop through each byte in the raw adpcm data
        for (var adpcmOffset = 0; adpcmOffset < adpcm.length; adpcmOffset++) {
            var byte = adpcm[adpcmOffset];
            var bitPos = 0;
            while (bitPos < 8) {
                // isolate 4-bit sample
                sample = (byte >> bitPos) & 0xF;
                // get diff
                diff = prevDiff + _adpcm__WEBPACK_IMPORTED_MODULE_1__["ADPCM_SAMPLE_TABLE_4"][sample + 16 * prevStepIndex];
                // get step index
                stepIndex = prevStepIndex + _adpcm__WEBPACK_IMPORTED_MODULE_1__["ADPCM_INDEX_TABLE_4"][sample];
                // clamp step index and diff
                stepIndex = Math.max(0, Math.min(stepIndex, 79));
                diff = Math.max(-32767, Math.min(diff, 32767));
                // add result to output buffer
                output[outputOffset] = (diff);
                outputOffset += 1;
                // set prev decoder state
                prevStepIndex = stepIndex;
                prevDiff = diff;
                // move to next sample
                bitPos += 4;
            }
        }
        return output;
    };
    PpmParser.prototype.decodeSoundFlags = function () {
        var _this = this;
        this.seek(0x06A0 + this.frameDataLength);
        // per msdn docs - the array map callback is only invoked for array indicies that have assigned values
        // so when we create an array, we need to fill it with something before we can map over it
        var arr = new Array(this.frameCount).fill([]);
        return arr.map(function (value) {
            var byte = _this.readUint8();
            return [byte & 0x1, (byte >> 1) & 0x1, (byte >> 2) & 0x1];
        });
    };
    PpmParser.type = 'PPM';
    PpmParser.sampleRate = 8192;
    PpmParser.width = 256;
    PpmParser.height = 192;
    PpmParser.globalPalette = [
        PALETTE.BLACK,
        PALETTE.WHITE,
        PALETTE.RED,
        PALETTE.BLUE
    ];
    return PpmParser;
}(_utils_dataStream__WEBPACK_IMPORTED_MODULE_0__["DataStream"]));



/***/ }),

/***/ "./player/audio.ts":
/*!*************************!*\
  !*** ./player/audio.ts ***!
  \*************************/
/*! exports provided: AudioTrack */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AudioTrack", function() { return AudioTrack; });
/* harmony import */ var _encoders_wav__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../encoders/wav */ "./encoders/wav.ts");

var AudioTrack = /** @class */ (function () {
    function AudioTrack(id) {
        this.playbackRate = 1;
        this.id = id;
        this.channelCount = 1;
        this.bitsPerSample = 16;
        this.sampleRate = 0;
        this.audio = document.createElement('audio');
        this.audio.preload = 'auto';
        this.isActive = false;
    }
    AudioTrack.prototype.set = function (pcmData, playbackRate) {
        // the HTML5 audio element supports PCM audio if it's in a WAV wrapper
        var wav = new _encoders_wav__WEBPACK_IMPORTED_MODULE_0__["WavEncoder"](this.sampleRate * playbackRate, this.channelCount, this.bitsPerSample);
        wav.writeFrames(pcmData);
        this.url = window.URL.createObjectURL(wav.getBlob());
        // use the blob url for the audio element
        this.audio.src = this.url;
        this.isActive = true;
        this.playbackRate = playbackRate;
        this.length = pcmData.length;
    };
    Object.defineProperty(AudioTrack.prototype, "duration", {
        get: function () {
            return this.audio.duration;
        },
        enumerable: true,
        configurable: true
    });
    AudioTrack.prototype.unset = function () {
        if (this.isActive) {
            window.URL.revokeObjectURL(this.url);
            this.audio.src = '';
            this.audio.load();
            this.isActive = false;
            this.playbackRate = 1;
            this.length = null;
        }
    };
    AudioTrack.prototype.start = function (offset) {
        if (offset === void 0) { offset = 0; }
        if (this.isActive) {
            this.audio.currentTime = offset;
            this.audio.play();
        }
    };
    AudioTrack.prototype.stop = function () {
        if (this.isActive) {
            this.audio.pause();
        }
    };
    return AudioTrack;
}());



/***/ }),

/***/ "./player/index.ts":
/*!*************************!*\
  !*** ./player/index.ts ***!
  \*************************/
/*! exports provided: Player */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Player", function() { return Player; });
/* harmony import */ var _parsers_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../parsers/index */ "./parsers/index.ts");
/* harmony import */ var _audio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./audio */ "./player/audio.ts");
/* harmony import */ var _webgl_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../webgl/index */ "./webgl/index.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



/** flipnote player API, based on HTMLMediaElement (https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) */
var Player = /** @class */ (function () {
    function Player(el, width, height) {
        this.loop = false;
        this.paused = true;
        this.duration = 0;
        this.isOpen = false;
        this.events = {};
        this._frame = -1;
        this._time = 0;
        this.hasPlaybackStarted = false;
        this.wasPlaying = false;
        this.isSeeking = false;
        // if `el` is a string, use it to select an Element, else assume it's an element
        el = ('string' == typeof el) ? document.querySelector(el) : el;
        this.canvas = new _webgl_index__WEBPACK_IMPORTED_MODULE_2__["WebglCanvas"](el, width, height);
        this.el = this.canvas.el;
        this.customPalette = null;
        this.audioTracks = [
            new _audio__WEBPACK_IMPORTED_MODULE_1__["AudioTrack"]('se1'),
            new _audio__WEBPACK_IMPORTED_MODULE_1__["AudioTrack"]('se2'),
            new _audio__WEBPACK_IMPORTED_MODULE_1__["AudioTrack"]('se3'),
            new _audio__WEBPACK_IMPORTED_MODULE_1__["AudioTrack"]('se4'),
            new _audio__WEBPACK_IMPORTED_MODULE_1__["AudioTrack"]('bgm'),
        ];
    }
    Object.defineProperty(Player.prototype, "currentFrame", {
        get: function () {
            return this._frame;
        },
        set: function (frameIndex) {
            this.setFrame(frameIndex);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "currentTime", {
        get: function () {
            return this.isOpen ? this._time : null;
        },
        set: function (value) {
            if ((this.isOpen) && (value <= this.duration) && (value >= 0)) {
                this.setFrame(Math.round(value / (1 / this.framerate)));
                this._time = value;
                this.emit('progress', this.progress);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "progress", {
        get: function () {
            return this.isOpen ? (this.currentTime / this.duration) * 100 : 0;
        },
        set: function (value) {
            this.currentTime = this.duration * (value / 100);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "volume", {
        get: function () {
            return this.audioTracks[3].audio.volume;
        },
        set: function (value) {
            for (var i = 0; i < this.audioTracks.length; i++) {
                this.audioTracks[i].audio.volume = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "muted", {
        get: function () {
            return this.audioTracks[3].audio.muted;
        },
        set: function (value) {
            for (var i = 0; i < this.audioTracks.length; i++) {
                this.audioTracks[i].audio.muted = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "framerate", {
        get: function () {
            return this.note.framerate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "frameCount", {
        get: function () {
            return this.note.frameCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "frameSpeed", {
        get: function () {
            return this.note.frameSpeed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "audiorate", {
        get: function () {
            return (1 / this.note.bgmrate) / (1 / this.note.framerate);
        },
        enumerable: true,
        configurable: true
    });
    Player.prototype.open = function (source) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.isOpen)
                    this.close();
                return [2 /*return*/, Object(_parsers_index__WEBPACK_IMPORTED_MODULE_0__["parseSource"])(source)
                        .then(function (note) {
                        _this.load(note);
                    })
                        .catch(function (err) {
                        _this.emit('error', err);
                        console.error('Error loading Flipnote:', err);
                    })];
            });
        });
    };
    Player.prototype.close = function () {
        this.pause();
        this.note = null;
        this.isOpen = false;
        this.paused = true;
        this.loop = null;
        this.meta = null;
        this._frame = null;
        this._time = null;
        this.duration = null;
        this.loop = null;
        for (var i = 0; i < this.audioTracks.length; i++) {
            this.audioTracks[i].unset();
        }
        this.seFlags = null;
        this.hasPlaybackStarted = null;
        this.canvas.clear();
    };
    Player.prototype.load = function (note) {
        this.note = note;
        this.meta = note.meta;
        this.type = note.type;
        this.loop = note.meta.loop;
        this.duration = (this.note.frameCount) * (1 / this.note.framerate);
        this.paused = true;
        this.isOpen = true;
        this.audioTracks.forEach(function (track) {
            track.sampleRate = note.sampleRate;
        });
        if (this.customPalette) {
            this.setPalette(this.customPalette);
        }
        if (this.note.hasAudioTrack(1))
            this.audioTracks[0].set(this.note.decodeAudio('se1'), 1);
        if (this.note.hasAudioTrack(2))
            this.audioTracks[1].set(this.note.decodeAudio('se2'), 1);
        if (this.note.hasAudioTrack(3))
            this.audioTracks[2].set(this.note.decodeAudio('se3'), 1);
        if (this.type === 'KWZ' && this.note.hasAudioTrack(4))
            this.audioTracks[3].set(this.note.decodeAudio('se4'), 1);
        if (this.note.hasAudioTrack(0))
            this.audioTracks[4].set(this.note.decodeAudio('bgm'), this.audiorate);
        this.seFlags = this.note.decodeSoundFlags();
        this.hasPlaybackStarted = false;
        this.layerVisibility = {
            1: true,
            2: true,
            3: true
        };
        this.canvas.setInputSize(note.width, note.height);
        this.canvas.setLayerType(this.type === 'PPM' ? _webgl_index__WEBPACK_IMPORTED_MODULE_2__["TextureType"].Alpha : _webgl_index__WEBPACK_IMPORTED_MODULE_2__["TextureType"].LuminanceAlpha);
        this.setFrame(this.note.thumbFrameIndex);
        this._time = 0;
        this.emit('load');
    };
    Player.prototype.play = function () {
        var _this = this;
        if ((!this.isOpen) || (!this.paused))
            return null;
        if ((!this.hasPlaybackStarted) || ((!this.loop) && (this.currentFrame == this.frameCount - 1))) {
            this._time = 0;
        }
        this.paused = false;
        this.playBgm();
        var start = (performance.now() / 1000) - this.currentTime;
        var loop = function (timestamp) {
            if (_this.paused) { // break loop if paused is set to true
                _this.stopAudio();
                return null;
            }
            var time = timestamp / 1000;
            var progress = time - start;
            if (progress > _this.duration) {
                if (_this.loop) {
                    _this.currentTime = 0;
                    _this.playBgm();
                    start = time;
                    _this.emit('playback:loop');
                }
                else {
                    _this.pause();
                    _this.emit('playback:end');
                }
            }
            else {
                _this.currentTime = progress;
            }
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
        this.hasPlaybackStarted = true;
        this.emit('playback:start');
    };
    Player.prototype.pause = function () {
        if ((!this.isOpen) || (this.paused))
            return null;
        this.paused = true;
        this.stopAudio();
        this.emit('playback:stop');
    };
    Player.prototype.setFrame = function (frameIndex) {
        if ((this.isOpen) && (frameIndex !== this.currentFrame)) {
            // clamp frame index
            frameIndex = Math.max(0, Math.min(Math.floor(frameIndex), this.frameCount - 1));
            this.drawFrame(frameIndex);
            this._frame = frameIndex;
            if (this.paused) {
                this._time = frameIndex * (1 / this.framerate);
                this.emit('progress', this.progress);
            }
            else {
                this.playFrameSe(frameIndex);
            }
            this.emit('frame:update', this.currentFrame);
        }
    };
    Player.prototype.nextFrame = function () {
        if ((this.loop) && (this.currentFrame >= this.frameCount - 1)) {
            this.currentFrame = 0;
        }
        else {
            this.currentFrame += 1;
        }
    };
    Player.prototype.prevFrame = function () {
        if ((this.loop) && (this.currentFrame <= 0)) {
            this.currentFrame = this.frameCount - 1;
        }
        else {
            this.currentFrame -= 1;
        }
    };
    Player.prototype.lastFrame = function () {
        this.currentFrame = this.frameCount - 1;
    };
    Player.prototype.firstFrame = function () {
        this.currentFrame = 0;
    };
    Player.prototype.thumbnailFrame = function () {
        this.currentFrame = this.note.thumbFrameIndex;
    };
    Player.prototype.startSeek = function () {
        if (!this.isSeeking) {
            this.wasPlaying = !this.paused;
            this.pause();
            this.isSeeking = true;
        }
    };
    Player.prototype.seek = function (progress) {
        if (this.isSeeking) {
            this.progress = progress;
        }
    };
    Player.prototype.endSeek = function () {
        if ((this.isSeeking) && (this.wasPlaying === true)) {
            this.play();
        }
        this.wasPlaying = false;
        this.isSeeking = false;
    };
    Player.prototype.drawFrame = function (frameIndex) {
        var _this = this;
        var width = this.note.width;
        var height = this.note.height;
        var colors = this.note.getFramePalette(frameIndex);
        var layerBuffers = this.note.decodeFrame(frameIndex);
        this.canvas.setPaperColor(colors[0]);
        this.canvas.clear();
        if (this.note.type === 'PPM') {
            if (this.layerVisibility[2]) {
                this.canvas.drawLayer(layerBuffers[1], width, height, colors[2], [0, 0, 0, 0]);
            }
            if (this.layerVisibility[1]) {
                this.canvas.drawLayer(layerBuffers[0], width, height, colors[1], [0, 0, 0, 0]);
            }
        }
        else if (this.note.type === 'KWZ') {
            // loop through each layer
            this.note.getLayerOrder(frameIndex).forEach(function (layerIndex) {
                // only draw layer if it's visible
                if (_this.layerVisibility[layerIndex + 1]) {
                    _this.canvas.drawLayer(layerBuffers[layerIndex], width, height, colors[layerIndex * 2 + 1], colors[layerIndex * 2 + 2]);
                }
            });
        }
    };
    Player.prototype.forceUpdate = function () {
        if (this.isOpen) {
            this.drawFrame(this.currentFrame);
        }
    };
    Player.prototype.playFrameSe = function (frameIndex) {
        var flags = this.seFlags[frameIndex];
        for (var i = 0; i < flags.length; i++) {
            if (flags[i] && this.audioTracks[i].isActive)
                this.audioTracks[i].start();
        }
    };
    Player.prototype.playBgm = function () {
        this.audioTracks[4].start(this.currentTime);
    };
    Player.prototype.stopAudio = function () {
        for (var i = 0; i < this.audioTracks.length; i++) {
            this.audioTracks[i].stop();
        }
    };
    Player.prototype.resize = function (width, height) {
        this.canvas.resize(width, height);
        this.forceUpdate();
    };
    Player.prototype.setLayerVisibility = function (frameIndex, value) {
        this.layerVisibility[frameIndex] = value;
        this.forceUpdate();
    };
    Player.prototype.setPalette = function (palette) {
        this.customPalette = palette;
        this.note.palette = palette;
        this.forceUpdate();
    };
    Player.prototype.on = function (eventType, callback) {
        var events = this.events;
        (events[eventType] || (events[eventType] = [])).push(callback);
    };
    Player.prototype.off = function (eventType, callback) {
        var callbackList = this.events[eventType];
        if (callbackList)
            callbackList.splice(callbackList.indexOf(callback), 1);
    };
    Player.prototype.emit = function (eventType) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var callbackList = this.events[eventType] || [];
        for (var i = 0; i < callbackList.length; i++) {
            callbackList[i].apply(null, args);
        }
    };
    Player.prototype.clearEvents = function () {
        this.events = {};
    };
    Player.prototype.destroy = function () {
        this.close();
        this.canvas.destroy();
    };
    return Player;
}());



/***/ }),

/***/ "./utils/byteArray.ts":
/*!****************************!*\
  !*** ./utils/byteArray.ts ***!
  \****************************/
/*! exports provided: ByteArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ByteArray", function() { return ByteArray; });
var ByteArray = /** @class */ (function () {
    function ByteArray() {
        this.page = -1;
        this.pages = [];
        this.cursor = 0;
        this.newPage();
    }
    ByteArray.prototype.newPage = function () {
        this.pages[++this.page] = new Uint8Array(ByteArray.pageSize);
        this.cursor = 0;
    };
    ByteArray.prototype.getData = function () {
        var _this = this;
        var data = new Uint8Array((this.page) * ByteArray.pageSize + this.cursor);
        this.pages.map(function (page, index) {
            if (index === _this.page) {
                data.set(page.slice(0, _this.cursor), index * ByteArray.pageSize);
            }
            else {
                data.set(page, index * ByteArray.pageSize);
            }
        });
        return data;
    };
    ByteArray.prototype.getBuffer = function () {
        var data = this.getData();
        return data.buffer;
    };
    ByteArray.prototype.writeByte = function (val) {
        if (this.cursor >= ByteArray.pageSize)
            this.newPage();
        this.pages[this.page][this.cursor++] = val;
    };
    ByteArray.prototype.writeBytes = function (array, offset, length) {
        for (var l = length || array.length, i = offset || 0; i < l; i++)
            this.writeByte(array[i]);
    };
    ByteArray.pageSize = 4096;
    return ByteArray;
}());



/***/ }),

/***/ "./utils/dataStream.ts":
/*!*****************************!*\
  !*** ./utils/dataStream.ts ***!
  \*****************************/
/*! exports provided: SeekOrigin, DataStream */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SeekOrigin", function() { return SeekOrigin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataStream", function() { return DataStream; });
/** datastream serves as a wrapper around the DataView API to help keep track of the offset into the stream */
var SeekOrigin;
(function (SeekOrigin) {
    SeekOrigin[SeekOrigin["Begin"] = 0] = "Begin";
    SeekOrigin[SeekOrigin["Current"] = 1] = "Current";
    SeekOrigin[SeekOrigin["End"] = 2] = "End";
})(SeekOrigin || (SeekOrigin = {}));
;
var DataStream = /** @class */ (function () {
    function DataStream(arrayBuffer) {
        this.buffer = arrayBuffer;
        this.data = new DataView(arrayBuffer);
        this.cursor = 0;
    }
    Object.defineProperty(DataStream.prototype, "bytes", {
        get: function () {
            return new Uint8Array(this.buffer);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataStream.prototype, "byteLength", {
        get: function () {
            return this.data.byteLength;
        },
        enumerable: true,
        configurable: true
    });
    DataStream.prototype.seek = function (offset, whence) {
        switch (whence) {
            case SeekOrigin.End:
                this.cursor = this.data.byteLength + offset;
                break;
            case SeekOrigin.Current:
                this.cursor += offset;
                break;
            case SeekOrigin.Begin:
            default:
                this.cursor = offset;
                break;
        }
    };
    DataStream.prototype.readUint8 = function () {
        var val = this.data.getUint8(this.cursor);
        this.cursor += 1;
        return val;
    };
    DataStream.prototype.writeUint8 = function (value) {
        this.data.setUint8(this.cursor, value);
        this.cursor += 1;
    };
    DataStream.prototype.readInt8 = function () {
        var val = this.data.getInt8(this.cursor);
        this.cursor += 1;
        return val;
    };
    DataStream.prototype.writeInt8 = function (value) {
        this.data.setInt8(this.cursor, value);
        this.cursor += 1;
    };
    DataStream.prototype.readUint16 = function (littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        var val = this.data.getUint16(this.cursor, littleEndian);
        this.cursor += 2;
        return val;
    };
    DataStream.prototype.writeUint16 = function (value, littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        this.data.setUint16(this.cursor, value, littleEndian);
        this.cursor += 2;
    };
    DataStream.prototype.readInt16 = function (littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        var val = this.data.getInt16(this.cursor, littleEndian);
        this.cursor += 2;
        return val;
    };
    DataStream.prototype.writeInt16 = function (value, littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        this.data.setInt16(this.cursor, value, littleEndian);
        this.cursor += 2;
    };
    DataStream.prototype.readUint32 = function (littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        var val = this.data.getUint32(this.cursor, littleEndian);
        this.cursor += 4;
        return val;
    };
    DataStream.prototype.writeUint32 = function (value, littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        this.data.setUint32(this.cursor, value, littleEndian);
        this.cursor += 4;
    };
    DataStream.prototype.readInt32 = function (littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        var val = this.data.getInt32(this.cursor, littleEndian);
        this.cursor += 4;
        return val;
    };
    DataStream.prototype.writeInt32 = function (value, littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        this.data.setInt32(this.cursor, value, littleEndian);
        this.cursor += 4;
    };
    DataStream.prototype.readBytes = function (count) {
        var bytes = new Uint8Array(this.data.buffer, this.cursor, count);
        this.cursor += bytes.byteLength;
        return bytes;
    };
    DataStream.prototype.writeBytes = function (bytes) {
        var _this = this;
        bytes.forEach(function (byte) { return _this.writeUint8(byte); });
    };
    DataStream.prototype.readHex = function (count, reverse) {
        if (reverse === void 0) { reverse = false; }
        var bytes = this.readBytes(count);
        var hex = [];
        for (var i = 0; i < bytes.length; i++) {
            hex.push(bytes[i].toString(16).padStart(2, '0'));
        }
        if (reverse)
            hex.reverse();
        return hex.join('').toUpperCase();
    };
    DataStream.prototype.readUtf8 = function (count) {
        var chars = this.readBytes(count);
        var str = '';
        for (var i = 0; i < chars.length; i++) {
            var char = chars[i];
            if (char === 0)
                break;
            str += String.fromCharCode(char);
        }
        return str;
    };
    DataStream.prototype.writeUtf8 = function (string) {
        for (var i = 0; i < string.length; i++) {
            var char = string.charCodeAt(i);
            this.writeUint8(char);
        }
    };
    DataStream.prototype.readUtf16 = function (count) {
        var chars = new Uint16Array(this.data.buffer, this.cursor, count);
        var str = '';
        for (var i = 0; i < chars.length; i++) {
            var char = chars[i];
            if (char == 0)
                break;
            str += String.fromCharCode(char);
        }
        this.cursor += chars.byteLength;
        return str;
    };
    return DataStream;
}());



/***/ }),

/***/ "./utils/index.ts":
/*!************************!*\
  !*** ./utils/index.ts ***!
  \************************/
/*! exports provided: ByteArray, SeekOrigin, DataStream */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _byteArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./byteArray */ "./utils/byteArray.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ByteArray", function() { return _byteArray__WEBPACK_IMPORTED_MODULE_0__["ByteArray"]; });

/* harmony import */ var _dataStream__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dataStream */ "./utils/dataStream.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SeekOrigin", function() { return _dataStream__WEBPACK_IMPORTED_MODULE_1__["SeekOrigin"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DataStream", function() { return _dataStream__WEBPACK_IMPORTED_MODULE_1__["DataStream"]; });





/***/ }),

/***/ "./webgl/canvas.ts":
/*!*************************!*\
  !*** ./webgl/canvas.ts ***!
  \*************************/
/*! exports provided: TextureType, WebglCanvas */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextureType", function() { return TextureType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebglCanvas", function() { return WebglCanvas; });
/* harmony import */ var _shader_vert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shader.vert */ "./webgl/shader.vert");
/* harmony import */ var _shader_vert__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_shader_vert__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _shader_frag__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shader.frag */ "./webgl/shader.frag");
/* harmony import */ var _shader_frag__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_shader_frag__WEBPACK_IMPORTED_MODULE_1__);


;
var ShaderType;
(function (ShaderType) {
    ShaderType[ShaderType["Vertex"] = WebGLRenderingContext.VERTEX_SHADER] = "Vertex";
    ShaderType[ShaderType["Fragment"] = WebGLRenderingContext.FRAGMENT_SHADER] = "Fragment";
})(ShaderType || (ShaderType = {}));
;
var TextureType;
(function (TextureType) {
    TextureType[TextureType["Alpha"] = WebGLRenderingContext.ALPHA] = "Alpha";
    TextureType[TextureType["LuminanceAlpha"] = WebGLRenderingContext.LUMINANCE_ALPHA] = "LuminanceAlpha";
})(TextureType || (TextureType = {}));
;
/** webgl canvas wrapper class */
var WebglCanvas = /** @class */ (function () {
    function WebglCanvas(el, width, height, params) {
        if (width === void 0) { width = 640; }
        if (height === void 0) { height = 480; }
        if (params === void 0) { params = { antialias: false, alpha: false }; }
        this.uniforms = {};
        this.refs = {
            shaders: [],
            textures: [],
            buffers: []
        };
        var gl = el.getContext('webgl', params);
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
    WebglCanvas.prototype.createProgram = function () {
        var gl = this.gl;
        var program = gl.createProgram();
        // set up shaders
        gl.attachShader(program, this.createShader(ShaderType.Vertex, _shader_vert__WEBPACK_IMPORTED_MODULE_0___default.a));
        gl.attachShader(program, this.createShader(ShaderType.Fragment, _shader_frag__WEBPACK_IMPORTED_MODULE_1___default.a));
        // link program
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            var log = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            throw new Error(log);
        }
        // activate the program
        gl.useProgram(program);
        // map uniform locations
        var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (var index = 0; index < uniformCount; index++) {
            var name_1 = gl.getActiveUniform(program, index).name;
            this.uniforms[name_1] = gl.getUniformLocation(program, name_1);
        }
        this.program = program;
    };
    WebglCanvas.prototype.createScreenQuad = function () {
        var gl = this.gl;
        // create quad that fills the screen, this will be our drawing surface
        var vertBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        this.refs.buffers.push(vertBuffer);
    };
    WebglCanvas.prototype.createBitmapTexture = function () {
        var gl = this.gl;
        // create texture to use as the layer bitmap
        gl.activeTexture(gl.TEXTURE0);
        var tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.uniform1i(this.uniforms['u_bitmap'], 0);
        this.refs.textures.push(tex);
    };
    WebglCanvas.prototype.createShader = function (type, source) {
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
    };
    WebglCanvas.prototype.setInputSize = function (width, height) {
        this.gl.uniform2f(this.uniforms['u_textureSize'], width, height);
    };
    WebglCanvas.prototype.setCanvasSize = function (width, height) {
        this.gl.uniform2f(this.uniforms['u_screenSize'], width, height);
        this.el.width = width;
        this.el.height = height;
        this.width = width;
        this.height = height;
        this.gl.viewport(0, 0, width, height);
    };
    WebglCanvas.prototype.setLayerType = function (textureType) {
        this.textureType = textureType;
    };
    WebglCanvas.prototype.toImage = function (type) {
        return this.el.toDataURL(type);
    };
    WebglCanvas.prototype.setColor = function (color, value) {
        this.gl.uniform4f(this.uniforms[color], value[0] / 255, value[1] / 255, value[2] / 255, 1);
    };
    WebglCanvas.prototype.setPaperColor = function (value) {
        this.gl.clearColor(value[0] / 255, value[1] / 255, value[2] / 255, 1);
    };
    WebglCanvas.prototype.drawLayer = function (buffer, width, height, color1, color2) {
        var gl = this.gl;
        // gl.activeTexture(gl.TEXTURE0);
        gl.texImage2D(gl.TEXTURE_2D, 0, this.textureType, width, height, 0, this.textureType, gl.UNSIGNED_BYTE, buffer);
        this.setColor('u_color1', color1);
        this.setColor('u_color2', color2);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    WebglCanvas.prototype.resize = function (width, height) {
        if (width === void 0) { width = 640; }
        if (height === void 0) { height = 480; }
        this.setCanvasSize(width, height);
    };
    WebglCanvas.prototype.clear = function () {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    };
    WebglCanvas.prototype.destroy = function () {
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
    };
    return WebglCanvas;
}());



/***/ }),

/***/ "./webgl/index.ts":
/*!************************!*\
  !*** ./webgl/index.ts ***!
  \************************/
/*! exports provided: TextureType, WebglCanvas */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvas */ "./webgl/canvas.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TextureType", function() { return _canvas__WEBPACK_IMPORTED_MODULE_0__["TextureType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebglCanvas", function() { return _canvas__WEBPACK_IMPORTED_MODULE_0__["WebglCanvas"]; });




/***/ }),

/***/ "./webgl/shader.frag":
/*!***************************!*\
  !*** ./webgl/shader.frag ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "precision highp float;\n#define GLSLIFY 1\nvarying vec2 v_texel;\nvarying float v_scale;\nuniform vec4 u_color1;\nuniform vec4 u_color2;\nuniform sampler2D u_bitmap;\nuniform bool u_isSmooth;\nuniform vec2 u_textureSize;\nuniform vec2 u_screenSize;\n\nvoid main() {\n  vec2 texel_floored = floor(v_texel);\n  vec2 s = fract(v_texel);\n  float region_range = 0.5 - 0.5 / v_scale;\n  vec2 center_dist = s - 0.5;\n  vec2 f = (center_dist - clamp(center_dist, -region_range, region_range)) * v_scale + 0.5;\n  vec2 mod_texel = texel_floored + f;\n  vec2 coord = mod_texel.xy / u_textureSize.xy;\n  vec2 colorWeights = texture2D(u_bitmap, coord).ra;\n  gl_FragColor = vec4(u_color1.rgb, 1.0) * colorWeights.y + vec4(u_color2.rgb, 1.0) * colorWeights.x;\n}"

/***/ }),

/***/ "./webgl/shader.vert":
/*!***************************!*\
  !*** ./webgl/shader.vert ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nattribute vec4 a_position;\nvarying vec2 v_texel;\nvarying float v_scale;\nuniform vec2 u_textureSize;\nuniform vec2 u_screenSize;\n\nvoid main() {\n  gl_Position = a_position;\n  vec2 uv = a_position.xy * vec2(0.5, -0.5) + 0.5;\n  v_texel = uv * u_textureSize;\n  v_scale = floor(u_screenSize.y / u_textureSize.y + 0.01);\n}"

/***/ })

/******/ })["default"];
});
//# sourceMappingURL=flipnote.js.map