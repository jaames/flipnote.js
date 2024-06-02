/*!!
 * flipnote.js v6.0.0
 * https://flipnote.js.org
 * A JavaScript library for Flipnote Studio animation files
 * 2018 - 2024 James Daniel
 * Flipnote Studio is (c) Nintendo Co., Ltd. This project isn't affiliated with or endorsed by them in any way.
*/
/**
 * Player event types
 */
var PlayerEvent;
(function (PlayerEvent) {
    PlayerEvent["__Any"] = "any";
    PlayerEvent["Play"] = "play";
    PlayerEvent["Pause"] = "pause";
    PlayerEvent["CanPlay"] = "canplay";
    PlayerEvent["CanPlayThrough"] = "canplaythrough";
    PlayerEvent["SeekStart"] = "seeking";
    PlayerEvent["SeekEnd"] = "seeked";
    PlayerEvent["Duration"] = "durationchange";
    PlayerEvent["Loop"] = "loop";
    PlayerEvent["Ended"] = "ended";
    PlayerEvent["VolumeChange"] = "volumechange";
    PlayerEvent["Progress"] = "progress";
    PlayerEvent["TimeUpdate"] = "timeupdate";
    PlayerEvent["FrameUpdate"] = "frameupdate";
    PlayerEvent["FrameNext"] = "framenext";
    PlayerEvent["FramePrev"] = "frameprev";
    PlayerEvent["FrameFirst"] = "framefirst";
    PlayerEvent["FrameLast"] = "framelast";
    PlayerEvent["Ready"] = "ready";
    PlayerEvent["Load"] = "load";
    PlayerEvent["LoadStart"] = "loadstart";
    PlayerEvent["LoadedData"] = "loadeddata";
    PlayerEvent["LoadedMeta"] = "loadedmetadata";
    PlayerEvent["Emptied"] = "emptied";
    PlayerEvent["Close"] = "close";
    PlayerEvent["Error"] = "error";
    PlayerEvent["Destroy"] = "destroy";
})(PlayerEvent || (PlayerEvent = {}));
/** @internal */
const supportedEvents = [
    PlayerEvent.Play,
    PlayerEvent.Pause,
    PlayerEvent.CanPlay,
    PlayerEvent.CanPlayThrough,
    PlayerEvent.SeekStart,
    PlayerEvent.SeekEnd,
    PlayerEvent.Duration,
    PlayerEvent.Loop,
    PlayerEvent.Ended,
    PlayerEvent.VolumeChange,
    PlayerEvent.Progress,
    PlayerEvent.TimeUpdate,
    PlayerEvent.FrameUpdate,
    PlayerEvent.FrameNext,
    PlayerEvent.FramePrev,
    PlayerEvent.FrameFirst,
    PlayerEvent.FrameLast,
    PlayerEvent.Ready,
    PlayerEvent.Load,
    PlayerEvent.LoadStart,
    PlayerEvent.LoadedData,
    PlayerEvent.LoadedMeta,
    PlayerEvent.Emptied,
    PlayerEvent.Close,
    PlayerEvent.Error,
];

/** @internal */
function createTimeRanges(ranges) {
    return {
        length: ranges.length,
        start: (i) => ranges[i][0],
        end: (i) => ranges[i][1],
    };
}
/** @internal */
function padNumber(num, strLength) {
    return num.toString().padStart(strLength, '0');
}
/** @internal */
function formatTime(seconds) {
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${padNumber(s, 2)}`;
}

var CanvasStereoscopicMode;
(function (CanvasStereoscopicMode) {
    CanvasStereoscopicMode[CanvasStereoscopicMode["None"] = 0] = "None";
    CanvasStereoscopicMode[CanvasStereoscopicMode["Dual"] = 1] = "Dual";
    // not actually supported, sorry!
    CanvasStereoscopicMode[CanvasStereoscopicMode["Anaglyph"] = 2] = "Anaglyph";
})(CanvasStereoscopicMode || (CanvasStereoscopicMode = {}));

/* @license twgl.js 5.5.4 Copyright (c) 2015, Gregg Tavares All Rights Reserved.
Available via the MIT license.
see: http://github.com/greggman/twgl.js for details */
/*
 * Copyright 2019 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */


/*
 * Copyright 2019 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/* DataType */
const BYTE$2                           = 0x1400;
const UNSIGNED_BYTE$3                  = 0x1401;
const SHORT$2                          = 0x1402;
const UNSIGNED_SHORT$3                 = 0x1403;
const INT$3                            = 0x1404;
const UNSIGNED_INT$3                   = 0x1405;
const FLOAT$3                          = 0x1406;
const UNSIGNED_SHORT_4_4_4_4$1       = 0x8033;
const UNSIGNED_SHORT_5_5_5_1$1       = 0x8034;
const UNSIGNED_SHORT_5_6_5$1         = 0x8363;
const HALF_FLOAT$1                   = 0x140B;
const UNSIGNED_INT_2_10_10_10_REV$1  = 0x8368;
const UNSIGNED_INT_10F_11F_11F_REV$1 = 0x8C3B;
const UNSIGNED_INT_5_9_9_9_REV$1     = 0x8C3E;
const FLOAT_32_UNSIGNED_INT_24_8_REV$1 = 0x8DAD;
const UNSIGNED_INT_24_8$1            = 0x84FA;

const glTypeToTypedArray = {};
{
  const tt = glTypeToTypedArray;
  tt[BYTE$2]                           = Int8Array;
  tt[UNSIGNED_BYTE$3]                  = Uint8Array;
  tt[SHORT$2]                          = Int16Array;
  tt[UNSIGNED_SHORT$3]                 = Uint16Array;
  tt[INT$3]                            = Int32Array;
  tt[UNSIGNED_INT$3]                   = Uint32Array;
  tt[FLOAT$3]                          = Float32Array;
  tt[UNSIGNED_SHORT_4_4_4_4$1]         = Uint16Array;
  tt[UNSIGNED_SHORT_5_5_5_1$1]         = Uint16Array;
  tt[UNSIGNED_SHORT_5_6_5$1]           = Uint16Array;
  tt[HALF_FLOAT$1]                     = Uint16Array;
  tt[UNSIGNED_INT_2_10_10_10_REV$1]    = Uint32Array;
  tt[UNSIGNED_INT_10F_11F_11F_REV$1]   = Uint32Array;
  tt[UNSIGNED_INT_5_9_9_9_REV$1]       = Uint32Array;
  tt[FLOAT_32_UNSIGNED_INT_24_8_REV$1] = Uint32Array;
  tt[UNSIGNED_INT_24_8$1]              = Uint32Array;
}

/**
 * Get the GL type for a typedArray
 * @param {ArrayBufferView} typedArray a typedArray
 * @return {number} the GL type for array. For example pass in an `Int8Array` and `gl.BYTE` will
 *   be returned. Pass in a `Uint32Array` and `gl.UNSIGNED_INT` will be returned
 * @memberOf module:twgl/typedArray
 */
function getGLTypeForTypedArray(typedArray) {
  if (typedArray instanceof Int8Array)         { return BYTE$2; }           // eslint-disable-line
  if (typedArray instanceof Uint8Array)        { return UNSIGNED_BYTE$3; }  // eslint-disable-line
  if (typedArray instanceof Uint8ClampedArray) { return UNSIGNED_BYTE$3; }  // eslint-disable-line
  if (typedArray instanceof Int16Array)        { return SHORT$2; }          // eslint-disable-line
  if (typedArray instanceof Uint16Array)       { return UNSIGNED_SHORT$3; } // eslint-disable-line
  if (typedArray instanceof Int32Array)        { return INT$3; }            // eslint-disable-line
  if (typedArray instanceof Uint32Array)       { return UNSIGNED_INT$3; }   // eslint-disable-line
  if (typedArray instanceof Float32Array)      { return FLOAT$3; }          // eslint-disable-line
  throw new Error('unsupported typed array type');
}

/**
 * Get the GL type for a typedArray type
 * @param {ArrayBufferView} typedArrayType a typedArray constructor
 * @return {number} the GL type for type. For example pass in `Int8Array` and `gl.BYTE` will
 *   be returned. Pass in `Uint32Array` and `gl.UNSIGNED_INT` will be returned
 * @memberOf module:twgl/typedArray
 */
function getGLTypeForTypedArrayType(typedArrayType) {
  if (typedArrayType === Int8Array)         { return BYTE$2; }           // eslint-disable-line
  if (typedArrayType === Uint8Array)        { return UNSIGNED_BYTE$3; }  // eslint-disable-line
  if (typedArrayType === Uint8ClampedArray) { return UNSIGNED_BYTE$3; }  // eslint-disable-line
  if (typedArrayType === Int16Array)        { return SHORT$2; }          // eslint-disable-line
  if (typedArrayType === Uint16Array)       { return UNSIGNED_SHORT$3; } // eslint-disable-line
  if (typedArrayType === Int32Array)        { return INT$3; }            // eslint-disable-line
  if (typedArrayType === Uint32Array)       { return UNSIGNED_INT$3; }   // eslint-disable-line
  if (typedArrayType === Float32Array)      { return FLOAT$3; }          // eslint-disable-line
  throw new Error('unsupported typed array type');
}

/**
 * Get the typed array constructor for a given GL type
 * @param {number} type the GL type. (eg: `gl.UNSIGNED_INT`)
 * @return {function} the constructor for a the corresponding typed array. (eg. `Uint32Array`).
 * @memberOf module:twgl/typedArray
 */
function getTypedArrayTypeForGLType(type) {
  const CTOR = glTypeToTypedArray[type];
  if (!CTOR) {
    throw new Error('unknown gl type');
  }
  return CTOR;
}

const isArrayBuffer$1 = typeof SharedArrayBuffer !== 'undefined'
  ? function isArrayBufferOrSharedArrayBuffer(a) {
    return a && a.buffer && (a.buffer instanceof ArrayBuffer || a.buffer instanceof SharedArrayBuffer);
  }
  : function isArrayBuffer(a) {
    return a && a.buffer && a.buffer instanceof ArrayBuffer;
  };

const isTypeWeakMaps = new Map();

function isType(object, type) {
  if (!object || typeof object !== 'object') {
    return false;
  }
  let weakMap = isTypeWeakMaps.get(type);
  if (!weakMap) {
    weakMap = new WeakMap();
    isTypeWeakMaps.set(type, weakMap);
  }
  let isOfType = weakMap.get(object);
  if (isOfType === undefined) {
    const s = Object.prototype.toString.call(object);
    isOfType = s.substring(8, s.length - 1) === type;
    weakMap.set(object, isOfType);
  }
  return isOfType;
}

function isBuffer(gl, t) {
  return typeof WebGLBuffer !== 'undefined' && isType(t, 'WebGLBuffer');
}

function isTexture(gl, t) {
  return typeof WebGLTexture !== 'undefined' && isType(t, 'WebGLTexture');
}

/*
 * Copyright 2019 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

const STATIC_DRAW                  = 0x88e4;
const ARRAY_BUFFER$1                 = 0x8892;
const ELEMENT_ARRAY_BUFFER$2         = 0x8893;
const BUFFER_SIZE                  = 0x8764;

const BYTE$1                         = 0x1400;
const UNSIGNED_BYTE$2                = 0x1401;
const SHORT$1                        = 0x1402;
const UNSIGNED_SHORT$2               = 0x1403;
const INT$2                          = 0x1404;
const UNSIGNED_INT$2                 = 0x1405;
const FLOAT$2                        = 0x1406;
const defaults$2 = {
  attribPrefix: "",
};

function setBufferFromTypedArray(gl, type, buffer, array, drawType) {
  gl.bindBuffer(type, buffer);
  gl.bufferData(type, array, drawType || STATIC_DRAW);
}

/**
 * Given typed array creates a WebGLBuffer and copies the typed array
 * into it.
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext
 * @param {ArrayBuffer|SharedArrayBuffer|ArrayBufferView|WebGLBuffer} typedArray the typed array. Note: If a WebGLBuffer is passed in it will just be returned. No action will be taken
 * @param {number} [type] the GL bind type for the buffer. Default = `gl.ARRAY_BUFFER`.
 * @param {number} [drawType] the GL draw type for the buffer. Default = 'gl.STATIC_DRAW`.
 * @return {WebGLBuffer} the created WebGLBuffer
 * @memberOf module:twgl/attributes
 */
function createBufferFromTypedArray(gl, typedArray, type, drawType) {
  if (isBuffer(gl, typedArray)) {
    return typedArray;
  }
  type = type || ARRAY_BUFFER$1;
  const buffer = gl.createBuffer();
  setBufferFromTypedArray(gl, type, buffer, typedArray, drawType);
  return buffer;
}

function isIndices(name) {
  return name === "indices";
}

// This is really just a guess. Though I can't really imagine using
// anything else? Maybe for some compression?
function getNormalizationForTypedArrayType(typedArrayType) {
  if (typedArrayType === Int8Array)    { return true; }  // eslint-disable-line
  if (typedArrayType === Uint8Array)   { return true; }  // eslint-disable-line
  return false;
}

function getArray$1(array) {
  return array.length ? array : array.data;
}

const texcoordRE = /coord|texture/i;
const colorRE = /color|colour/i;

function guessNumComponentsFromName(name, length) {
  let numComponents;
  if (texcoordRE.test(name)) {
    numComponents = 2;
  } else if (colorRE.test(name)) {
    numComponents = 4;
  } else {
    numComponents = 3;  // position, normals, indices ...
  }

  if (length % numComponents > 0) {
    throw new Error(`Can not guess numComponents for attribute '${name}'. Tried ${numComponents} but ${length} values is not evenly divisible by ${numComponents}. You should specify it.`);
  }

  return numComponents;
}

function getNumComponents$1(array, arrayName, numValues) {
  return array.numComponents || array.size || guessNumComponentsFromName(arrayName, numValues || getArray$1(array).length);
}

function makeTypedArray(array, name) {
  if (isArrayBuffer$1(array)) {
    return array;
  }

  if (isArrayBuffer$1(array.data)) {
    return array.data;
  }

  if (Array.isArray(array)) {
    array = {
      data: array,
    };
  }

  let Type = array.type ? typedArrayTypeFromGLTypeOrTypedArrayCtor(array.type) : undefined;
  if (!Type) {
    if (isIndices(name)) {
      Type = Uint16Array;
    } else {
      Type = Float32Array;
    }
  }
  return new Type(array.data);
}

function glTypeFromGLTypeOrTypedArrayType(glTypeOrTypedArrayCtor) {
  return typeof glTypeOrTypedArrayCtor === 'number'
      ? glTypeOrTypedArrayCtor
      : glTypeOrTypedArrayCtor ? getGLTypeForTypedArrayType(glTypeOrTypedArrayCtor) : FLOAT$2;
}

function typedArrayTypeFromGLTypeOrTypedArrayCtor(glTypeOrTypedArrayCtor) {
  return typeof glTypeOrTypedArrayCtor === 'number'
      ? getTypedArrayTypeForGLType(glTypeOrTypedArrayCtor)
      : glTypeOrTypedArrayCtor || Float32Array;
}

function attribBufferFromBuffer(gl, array/*, arrayName */) {
  return {
    buffer: array.buffer,
    numValues: 2 * 3 * 4,  // safely divided by 2, 3, 4
    type: glTypeFromGLTypeOrTypedArrayType(array.type),
    arrayType: typedArrayTypeFromGLTypeOrTypedArrayCtor(array.type),
  };
}

function attribBufferFromSize(gl, array/*, arrayName*/) {
  const numValues = array.data || array;
  const arrayType = typedArrayTypeFromGLTypeOrTypedArrayCtor(array.type);
  const numBytes = numValues * arrayType.BYTES_PER_ELEMENT;
  const buffer = gl.createBuffer();
  gl.bindBuffer(ARRAY_BUFFER$1, buffer);
  gl.bufferData(ARRAY_BUFFER$1, numBytes, array.drawType || STATIC_DRAW);
  return {
    buffer,
    numValues,
    type: getGLTypeForTypedArrayType(arrayType),
    arrayType,
  };
}

function attribBufferFromArrayLike(gl, array, arrayName) {
  const typedArray = makeTypedArray(array, arrayName);
  return {
    arrayType: typedArray.constructor,
    buffer: createBufferFromTypedArray(gl, typedArray, undefined, array.drawType),
    type: getGLTypeForTypedArray(typedArray),
    numValues: 0,
  };
}

/**
 * The info for an attribute. This is effectively just the arguments to `gl.vertexAttribPointer` plus the WebGLBuffer
 * for the attribute.
 *
 * @typedef {Object} AttribInfo
 * @property {number[]|ArrayBufferView} [value] a constant value for the attribute. Note: if this is set the attribute will be
 *    disabled and set to this constant value and all other values will be ignored.
 * @property {number} [numComponents] the number of components for this attribute.
 * @property {number} [size] synonym for `numComponents`.
 * @property {number} [type] the type of the attribute (eg. `gl.FLOAT`, `gl.UNSIGNED_BYTE`, etc...) Default = `gl.FLOAT`
 * @property {boolean} [normalize] whether or not to normalize the data. Default = false
 * @property {number} [offset] offset into buffer in bytes. Default = 0
 * @property {number} [stride] the stride in bytes per element. Default = 0
 * @property {number} [divisor] the divisor in instances. Default = 0.
 *    Requires WebGL2 or the ANGLE_instanced_arrays extension.
 *    and, if you're using WebGL1 you must have called {@link module:twgl.addExtensionsToContext}
 * @property {WebGLBuffer} buffer the buffer that contains the data for this attribute
 * @property {number} [drawType] the draw type passed to gl.bufferData. Default = gl.STATIC_DRAW
 * @memberOf module:twgl
 */

/**
 * @typedef {(Int8ArrayConstructor|Uint8ArrayConstructor|Int16ArrayConstructor|Uint16ArrayConstructor|Int32ArrayConstructor|Uint32ArrayConstructor|Float32ArrayConstructor)} TypedArrayConstructor
 */

/**
 * Use this type of array spec when TWGL can't guess the type or number of components of an array
 * @typedef {Object} FullArraySpec
 * @property {number[]|ArrayBufferView} [value] a constant value for the attribute. Note: if this is set the attribute will be
 *    disabled and set to this constant value and all other values will be ignored.
 * @property {(number|number[]|ArrayBufferView)} [data] The data of the array. A number alone becomes the number of elements of type.
 * @property {number} [numComponents] number of components for `vertexAttribPointer`. Default is based on the name of the array.
 *    If `coord` is in the name assumes `numComponents = 2`.
 *    If `color` is in the name assumes `numComponents = 4`.
 *    otherwise assumes `numComponents = 3`
 * @property {number|TypedArrayConstructor} [type] type. This is used if `data` is a JavaScript array, or `buffer` is passed in, or `data` is a number.
 *   It can either be the constructor for a typedarray. (eg. `Uint8Array`) OR a WebGL type, (eg `gl.UNSIGNED_BYTE`).
 *   For example if you want colors in a `Uint8Array` you might have a `FullArraySpec` like `{ type: gl.UNSIGNED_BYTE, data: [255,0,255,255, ...], }`.
 * @property {number} [size] synonym for `numComponents`.
 * @property {boolean} [normalize] normalize for `vertexAttribPointer`. Default is true if type is `Int8Array` or `Uint8Array` otherwise false.
 * @property {number} [stride] stride for `vertexAttribPointer`. Default = 0
 * @property {number} [offset] offset for `vertexAttribPointer`. Default = 0
 * @property {number} [divisor] divisor for `vertexAttribDivisor`. Default = 0.
 *     Requires WebGL2 or the ANGLE_instanced_arrays extension.
 *     and, if you using WebGL1 you must have called {@link module:twgl.addExtensionsToContext}
 * @property {string} [attrib] name of attribute this array maps to. Defaults to same name as array prefixed by the default attribPrefix.
 * @property {string} [name] synonym for `attrib`.
 * @property {string} [attribName] synonym for `attrib`.
 * @property {WebGLBuffer} [buffer] Buffer to use for this attribute. This lets you use your own buffer
 *    but you will need to supply `numComponents` and `type`. You can effectively pass an `AttribInfo`
 *    to provide this. Example:
 *
 *         const bufferInfo1 = twgl.createBufferInfoFromArrays(gl, {
 *           position: [1, 2, 3, ... ],
 *         });
 *         const bufferInfo2 = twgl.createBufferInfoFromArrays(gl, {
 *           position: bufferInfo1.attribs.position,  // use the same buffer from bufferInfo1
 *         });
 *
 * @property {number} [drawType] the draw type passed to gl.bufferData. Default = gl.STATIC_DRAW
 * @memberOf module:twgl
 */

/**
 * An individual array in {@link module:twgl.Arrays}
 *
 * When passed to {@link module:twgl.createBufferInfoFromArrays} if an ArraySpec is `number[]` or `ArrayBufferView`
 * the types will be guessed based on the name. `indices` will be `Uint16Array`, everything else will
 * be `Float32Array`. If an ArraySpec is a number it's the number of floats for an empty (zeroed) buffer.
 *
 * @typedef {(number|number[]|ArrayBufferView|module:twgl.FullArraySpec)} ArraySpec
 * @memberOf module:twgl
 */

/**
 * This is a JavaScript object of arrays by name. The names should match your shader's attributes. If your
 * attributes have a common prefix you can specify it by calling {@link module:twgl.setAttributePrefix}.
 *
 *     Bare JavaScript Arrays
 *
 *         var arrays = {
 *            position: [-1, 1, 0],
 *            normal: [0, 1, 0],
 *            ...
 *         }
 *
 *     Bare TypedArrays
 *
 *         var arrays = {
 *            position: new Float32Array([-1, 1, 0]),
 *            color: new Uint8Array([255, 128, 64, 255]),
 *            ...
 *         }
 *
 * *   Will guess at `numComponents` if not specified based on name.
 *
 *     If `coord` is in the name assumes `numComponents = 2`
 *
 *     If `color` is in the name assumes `numComponents = 4`
 *
 *     otherwise assumes `numComponents = 3`
 *
 * Objects with various fields. See {@link module:twgl.FullArraySpec}.
 *
 *     var arrays = {
 *       position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
 *       texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
 *       normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],     },
 *       indices:  { numComponents: 3, data: [0, 1, 2, 1, 2, 3],                       },
 *     };
 *
 * @typedef {Object.<string, module:twgl.ArraySpec>} Arrays
 * @memberOf module:twgl
 */


/**
 * Creates a set of attribute data and WebGLBuffers from set of arrays
 *
 * Given
 *
 *      var arrays = {
 *        position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
 *        texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
 *        normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],     },
 *        color:    { numComponents: 4, data: [255, 255, 255, 255, 255, 0, 0, 255, 0, 0, 255, 255], type: Uint8Array, },
 *        indices:  { numComponents: 3, data: [0, 1, 2, 1, 2, 3],                       },
 *      };
 *
 * returns something like
 *
 *      var attribs = {
 *        position: { numComponents: 3, type: gl.FLOAT,         normalize: false, buffer: WebGLBuffer, },
 *        texcoord: { numComponents: 2, type: gl.FLOAT,         normalize: false, buffer: WebGLBuffer, },
 *        normal:   { numComponents: 3, type: gl.FLOAT,         normalize: false, buffer: WebGLBuffer, },
 *        color:    { numComponents: 4, type: gl.UNSIGNED_BYTE, normalize: true,  buffer: WebGLBuffer, },
 *      };
 *
 * notes:
 *
 * *   Arrays can take various forms
 *
 *     Bare JavaScript Arrays
 *
 *         var arrays = {
 *            position: [-1, 1, 0],
 *            normal: [0, 1, 0],
 *            ...
 *         }
 *
 *     Bare TypedArrays
 *
 *         var arrays = {
 *            position: new Float32Array([-1, 1, 0]),
 *            color: new Uint8Array([255, 128, 64, 255]),
 *            ...
 *         }
 *
 * *   Will guess at `numComponents` if not specified based on name.
 *
 *     If `coord` is in the name assumes `numComponents = 2`
 *
 *     If `color` is in the name assumes `numComponents = 4`
 *
 *     otherwise assumes `numComponents = 3`
 *
 * @param {WebGLRenderingContext} gl The webgl rendering context.
 * @param {module:twgl.Arrays} arrays The arrays
 * @param {module:twgl.BufferInfo} [srcBufferInfo] a BufferInfo to copy from
 *   This lets you share buffers. Any arrays you supply will override
 *   the buffers from srcBufferInfo.
 * @return {Object.<string, module:twgl.AttribInfo>} the attribs
 * @memberOf module:twgl/attributes
 */
function createAttribsFromArrays(gl, arrays) {
  const attribs = {};
  Object.keys(arrays).forEach(function(arrayName) {
    if (!isIndices(arrayName)) {
      const array = arrays[arrayName];
      const attribName = array.attrib || array.name || array.attribName || (defaults$2.attribPrefix + arrayName);
      if (array.value) {
        if (!Array.isArray(array.value) && !isArrayBuffer$1(array.value)) {
          throw new Error('array.value is not array or typedarray');
        }
        attribs[attribName] = {
          value: array.value,
        };
      } else {
        let fn;
        if (array.buffer && array.buffer instanceof WebGLBuffer) {
          fn = attribBufferFromBuffer;
        } else if (typeof array === "number" || typeof array.data === "number") {
          fn = attribBufferFromSize;
        } else {
          fn = attribBufferFromArrayLike;
        }
        const {buffer, type, numValues, arrayType} = fn(gl, array, arrayName);
        const normalization = array.normalize !== undefined ? array.normalize : getNormalizationForTypedArrayType(arrayType);
        const numComponents = getNumComponents$1(array, arrayName, numValues);
        attribs[attribName] = {
          buffer:        buffer,
          numComponents: numComponents,
          type:          type,
          normalize:     normalization,
          stride:        array.stride || 0,
          offset:        array.offset || 0,
          divisor:       array.divisor === undefined ? undefined : array.divisor,
          drawType:      array.drawType,
        };
      }
    }
  });
  gl.bindBuffer(ARRAY_BUFFER$1, null);
  return attribs;
}

function getBytesPerValueForGLType(gl, type) {
  if (type === BYTE$1)           return 1;  // eslint-disable-line
  if (type === UNSIGNED_BYTE$2)  return 1;  // eslint-disable-line
  if (type === SHORT$1)          return 2;  // eslint-disable-line
  if (type === UNSIGNED_SHORT$2) return 2;  // eslint-disable-line
  if (type === INT$2)            return 4;  // eslint-disable-line
  if (type === UNSIGNED_INT$2)   return 4;  // eslint-disable-line
  if (type === FLOAT$2)          return 4;  // eslint-disable-line
  return 0;
}

// Tries to get the number of elements from a set of arrays.
const positionKeys = ['position', 'positions', 'a_position'];

function getNumElementsFromAttributes(gl, attribs) {
  let key;
  let ii;
  for (ii = 0; ii < positionKeys.length; ++ii) {
    key = positionKeys[ii];
    if (key in attribs) {
      break;
    }
    key = defaults$2.attribPrefix + key;
    if (key in attribs) {
      break;
    }
  }
  if (ii === positionKeys.length) {
    key = Object.keys(attribs)[0];
  }
  const attrib = attribs[key];
  if (!attrib.buffer) {
    return 1; // There's no buffer
  }
  gl.bindBuffer(ARRAY_BUFFER$1, attrib.buffer);
  const numBytes = gl.getBufferParameter(ARRAY_BUFFER$1, BUFFER_SIZE);
  gl.bindBuffer(ARRAY_BUFFER$1, null);

  const bytesPerValue = getBytesPerValueForGLType(gl, attrib.type);
  const totalElements = numBytes / bytesPerValue;
  const numComponents = attrib.numComponents || attrib.size;
  // TODO: check stride
  const numElements = totalElements / numComponents;
  if (numElements % 1 !== 0) {
    throw new Error(`numComponents ${numComponents} not correct for length ${length}`);
  }
  return numElements;
}

/**
 * @typedef {Object} BufferInfo
 * @property {number} numElements The number of elements to pass to `gl.drawArrays` or `gl.drawElements`.
 * @property {number} [elementType] The type of indices `UNSIGNED_BYTE`, `UNSIGNED_SHORT` etc..
 * @property {WebGLBuffer} [indices] The indices `ELEMENT_ARRAY_BUFFER` if any indices exist.
 * @property {Object.<string, module:twgl.AttribInfo>} [attribs] The attribs appropriate to call `setAttributes`
 * @memberOf module:twgl
 */

/**
 * Creates a BufferInfo from an object of arrays.
 *
 * This can be passed to {@link module:twgl.setBuffersAndAttributes} and to
 * {@link module:twgl:drawBufferInfo}.
 *
 * Given an object like
 *
 *     var arrays = {
 *       position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
 *       texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
 *       normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],     },
 *       indices:  { numComponents: 3, data: [0, 1, 2, 1, 2, 3],                       },
 *     };
 *
 *  Creates an BufferInfo like this
 *
 *     bufferInfo = {
 *       numElements: 4,        // or whatever the number of elements is
 *       indices: WebGLBuffer,  // this property will not exist if there are no indices
 *       attribs: {
 *         position: { buffer: WebGLBuffer, numComponents: 3, },
 *         normal:   { buffer: WebGLBuffer, numComponents: 3, },
 *         texcoord: { buffer: WebGLBuffer, numComponents: 2, },
 *       },
 *     };
 *
 *  The properties of arrays can be JavaScript arrays in which case the number of components
 *  will be guessed.
 *
 *     var arrays = {
 *        position: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0],
 *        texcoord: [0, 0, 0, 1, 1, 0, 1, 1],
 *        normal:   [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
 *        indices:  [0, 1, 2, 1, 2, 3],
 *     };
 *
 *  They can also be TypedArrays
 *
 *     var arrays = {
 *        position: new Float32Array([0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0]),
 *        texcoord: new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]),
 *        normal:   new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]),
 *        indices:  new Uint16Array([0, 1, 2, 1, 2, 3]),
 *     };
 *
 *  Or AugmentedTypedArrays
 *
 *     var positions = createAugmentedTypedArray(3, 4);
 *     var texcoords = createAugmentedTypedArray(2, 4);
 *     var normals   = createAugmentedTypedArray(3, 4);
 *     var indices   = createAugmentedTypedArray(3, 2, Uint16Array);
 *
 *     positions.push([0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0]);
 *     texcoords.push([0, 0, 0, 1, 1, 0, 1, 1]);
 *     normals.push([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);
 *     indices.push([0, 1, 2, 1, 2, 3]);
 *
 *     var arrays = {
 *        position: positions,
 *        texcoord: texcoords,
 *        normal:   normals,
 *        indices:  indices,
 *     };
 *
 * For the last example it is equivalent to
 *
 *     var bufferInfo = {
 *       attribs: {
 *         position: { numComponents: 3, buffer: gl.createBuffer(), },
 *         texcoord: { numComponents: 2, buffer: gl.createBuffer(), },
 *         normal: { numComponents: 3, buffer: gl.createBuffer(), },
 *       },
 *       indices: gl.createBuffer(),
 *       numElements: 6,
 *     };
 *
 *     gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.position.buffer);
 *     gl.bufferData(gl.ARRAY_BUFFER, arrays.position, gl.STATIC_DRAW);
 *     gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.texcoord.buffer);
 *     gl.bufferData(gl.ARRAY_BUFFER, arrays.texcoord, gl.STATIC_DRAW);
 *     gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.normal.buffer);
 *     gl.bufferData(gl.ARRAY_BUFFER, arrays.normal, gl.STATIC_DRAW);
 *     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferInfo.indices);
 *     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, arrays.indices, gl.STATIC_DRAW);
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext
 * @param {module:twgl.Arrays} arrays Your data
 * @param {module:twgl.BufferInfo} [srcBufferInfo] An existing
 *        buffer info to start from. WebGLBuffers etc specified
 *        in the srcBufferInfo will be used in a new BufferInfo
 *        with any arrays specified overriding the ones in
 *        srcBufferInfo.
 * @return {module:twgl.BufferInfo} A BufferInfo
 * @memberOf module:twgl/attributes
 */
function createBufferInfoFromArrays(gl, arrays, srcBufferInfo) {
  const newAttribs = createAttribsFromArrays(gl, arrays);
  const bufferInfo = Object.assign({}, srcBufferInfo ? srcBufferInfo : {});
  bufferInfo.attribs = Object.assign({}, srcBufferInfo ? srcBufferInfo.attribs : {}, newAttribs);
  const indices = arrays.indices;
  if (indices) {
    const newIndices = makeTypedArray(indices, "indices");
    bufferInfo.indices = createBufferFromTypedArray(gl, newIndices, ELEMENT_ARRAY_BUFFER$2);
    bufferInfo.numElements = newIndices.length;
    bufferInfo.elementType = getGLTypeForTypedArray(newIndices);
  } else if (!bufferInfo.numElements) {
    bufferInfo.numElements = getNumElementsFromAttributes(gl, bufferInfo.attribs);
  }

  return bufferInfo;
}

/*
 * Copyright 2019 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/**
 * Gets the gl version as a number
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext
 * @return {number} version of gl
 * @private
 */
//function getVersionAsNumber(gl) {
//  return parseFloat(gl.getParameter(gl.VERSION).substr(6));
//}

/**
 * Check if context is WebGL 2.0
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext
 * @return {bool} true if it's WebGL 2.0
 * @memberOf module:twgl
 */
function isWebGL2(gl) {
  // This is the correct check but it's slow
  //  return gl.getParameter(gl.VERSION).indexOf("WebGL 2.0") === 0;
  // This might also be the correct check but I'm assuming it's slow-ish
  // return gl instanceof WebGL2RenderingContext;
  return !!gl.texStorage2D;
}

// NOTE: Chrome supports 2D canvas in a Worker (behind flag as of v64 but
//       not only does Firefox NOT support it but Firefox freezes immediately
//       if you try to create one instead of just returning null and continuing.
//  : (global.OffscreenCanvas && (new global.OffscreenCanvas(1, 1)).getContext("2d"));  // OffscreenCanvas may not support 2d

// NOTE: We can maybe remove some of the need for the 2d canvas. In WebGL2
// we can use the various unpack settings. Otherwise we could try using
// the ability of an ImageBitmap to be cut. Unfortunately cutting an ImageBitmap
// is async and the current TWGL code expects a non-Async result though that
// might not be a problem. ImageBitmap though is not available in Edge or Safari
// as of 2018-01-02

/* PixelFormat */
const ALPHA                          = 0x1906;
const RGB                            = 0x1907;
const RGBA$1                           = 0x1908;
const LUMINANCE                      = 0x1909;
const LUMINANCE_ALPHA                = 0x190A;
const DEPTH_COMPONENT$1                = 0x1902;
const DEPTH_STENCIL$1                  = 0x84F9;

const RG                           = 0x8227;
const RG_INTEGER                   = 0x8228;
const RED                          = 0x1903;
const RED_INTEGER                  = 0x8D94;
const RGB_INTEGER                  = 0x8D98;
const RGBA_INTEGER                 = 0x8D99;

const formatInfo = {};
{
  // NOTE: this is named `numColorComponents` vs `numComponents` so we can let Uglify mangle
  // the name.
  const f = formatInfo;
  f[ALPHA]           = { numColorComponents: 1, };
  f[LUMINANCE]       = { numColorComponents: 1, };
  f[LUMINANCE_ALPHA] = { numColorComponents: 2, };
  f[RGB]             = { numColorComponents: 3, };
  f[RGBA$1]            = { numColorComponents: 4, };
  f[RED]             = { numColorComponents: 1, };
  f[RED_INTEGER]     = { numColorComponents: 1, };
  f[RG]              = { numColorComponents: 2, };
  f[RG_INTEGER]      = { numColorComponents: 2, };
  f[RGB]             = { numColorComponents: 3, };
  f[RGB_INTEGER]     = { numColorComponents: 3, };
  f[RGBA$1]            = { numColorComponents: 4, };
  f[RGBA_INTEGER]    = { numColorComponents: 4, };
  f[DEPTH_COMPONENT$1] = { numColorComponents: 1, };
  f[DEPTH_STENCIL$1]   = { numColorComponents: 2, };
}

const TEXTURE0                       = 0x84c0;

const ARRAY_BUFFER                   = 0x8892;
const ELEMENT_ARRAY_BUFFER$1           = 0x8893;

const ACTIVE_UNIFORMS                = 0x8b86;
const ACTIVE_ATTRIBUTES              = 0x8b89;
const TRANSFORM_FEEDBACK_VARYINGS    = 0x8c83;
const ACTIVE_UNIFORM_BLOCKS          = 0x8a36;
const UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER   = 0x8a44;
const UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER = 0x8a46;
const UNIFORM_BLOCK_DATA_SIZE                     = 0x8a40;
const UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES        = 0x8a43;

const FLOAT                         = 0x1406;
const FLOAT_VEC2                    = 0x8B50;
const FLOAT_VEC3                    = 0x8B51;
const FLOAT_VEC4                    = 0x8B52;
const INT                           = 0x1404;
const INT_VEC2                      = 0x8B53;
const INT_VEC3                      = 0x8B54;
const INT_VEC4                      = 0x8B55;
const BOOL                          = 0x8B56;
const BOOL_VEC2                     = 0x8B57;
const BOOL_VEC3                     = 0x8B58;
const BOOL_VEC4                     = 0x8B59;
const FLOAT_MAT2                    = 0x8B5A;
const FLOAT_MAT3                    = 0x8B5B;
const FLOAT_MAT4                    = 0x8B5C;
const SAMPLER_2D                    = 0x8B5E;
const SAMPLER_CUBE                  = 0x8B60;
const SAMPLER_3D                    = 0x8B5F;
const SAMPLER_2D_SHADOW             = 0x8B62;
const FLOAT_MAT2x3                  = 0x8B65;
const FLOAT_MAT2x4                  = 0x8B66;
const FLOAT_MAT3x2                  = 0x8B67;
const FLOAT_MAT3x4                  = 0x8B68;
const FLOAT_MAT4x2                  = 0x8B69;
const FLOAT_MAT4x3                  = 0x8B6A;
const SAMPLER_2D_ARRAY              = 0x8DC1;
const SAMPLER_2D_ARRAY_SHADOW       = 0x8DC4;
const SAMPLER_CUBE_SHADOW           = 0x8DC5;
const UNSIGNED_INT                  = 0x1405;
const UNSIGNED_INT_VEC2             = 0x8DC6;
const UNSIGNED_INT_VEC3             = 0x8DC7;
const UNSIGNED_INT_VEC4             = 0x8DC8;
const INT_SAMPLER_2D                = 0x8DCA;
const INT_SAMPLER_3D                = 0x8DCB;
const INT_SAMPLER_CUBE              = 0x8DCC;
const INT_SAMPLER_2D_ARRAY          = 0x8DCF;
const UNSIGNED_INT_SAMPLER_2D       = 0x8DD2;
const UNSIGNED_INT_SAMPLER_3D       = 0x8DD3;
const UNSIGNED_INT_SAMPLER_CUBE     = 0x8DD4;
const UNSIGNED_INT_SAMPLER_2D_ARRAY = 0x8DD7;

const TEXTURE_2D$1                    = 0x0DE1;
const TEXTURE_CUBE_MAP              = 0x8513;
const TEXTURE_3D                    = 0x806F;
const TEXTURE_2D_ARRAY              = 0x8C1A;

const typeMap = {};

/**
 * Returns the corresponding bind point for a given sampler type
 * @private
 */
function getBindPointForSamplerType(gl, type) {
  return typeMap[type].bindPoint;
}

// This kind of sucks! If you could compose functions as in `var fn = gl[name];`
// this code could be a lot smaller but that is sadly really slow (T_T)

function floatSetter(gl, location) {
  return function(v) {
    gl.uniform1f(location, v);
  };
}

function floatArraySetter(gl, location) {
  return function(v) {
    gl.uniform1fv(location, v);
  };
}

function floatVec2Setter(gl, location) {
  return function(v) {
    gl.uniform2fv(location, v);
  };
}

function floatVec3Setter(gl, location) {
  return function(v) {
    gl.uniform3fv(location, v);
  };
}

function floatVec4Setter(gl, location) {
  return function(v) {
    gl.uniform4fv(location, v);
  };
}

function intSetter(gl, location) {
  return function(v) {
    gl.uniform1i(location, v);
  };
}

function intArraySetter(gl, location) {
  return function(v) {
    gl.uniform1iv(location, v);
  };
}

function intVec2Setter(gl, location) {
  return function(v) {
    gl.uniform2iv(location, v);
  };
}

function intVec3Setter(gl, location) {
  return function(v) {
    gl.uniform3iv(location, v);
  };
}

function intVec4Setter(gl, location) {
  return function(v) {
    gl.uniform4iv(location, v);
  };
}

function uintSetter(gl, location) {
  return function(v) {
    gl.uniform1ui(location, v);
  };
}

function uintArraySetter(gl, location) {
  return function(v) {
    gl.uniform1uiv(location, v);
  };
}

function uintVec2Setter(gl, location) {
  return function(v) {
    gl.uniform2uiv(location, v);
  };
}

function uintVec3Setter(gl, location) {
  return function(v) {
    gl.uniform3uiv(location, v);
  };
}

function uintVec4Setter(gl, location) {
  return function(v) {
    gl.uniform4uiv(location, v);
  };
}

function floatMat2Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix2fv(location, false, v);
  };
}

function floatMat3Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix3fv(location, false, v);
  };
}

function floatMat4Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix4fv(location, false, v);
  };
}

function floatMat23Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix2x3fv(location, false, v);
  };
}

function floatMat32Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix3x2fv(location, false, v);
  };
}

function floatMat24Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix2x4fv(location, false, v);
  };
}

function floatMat42Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix4x2fv(location, false, v);
  };
}

function floatMat34Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix3x4fv(location, false, v);
  };
}

function floatMat43Setter(gl, location) {
  return function(v) {
    gl.uniformMatrix4x3fv(location, false, v);
  };
}

function samplerSetter(gl, type, unit, location) {
  const bindPoint = getBindPointForSamplerType(gl, type);
  return isWebGL2(gl) ? function(textureOrPair) {
    let texture;
    let sampler;
    if (!textureOrPair || isTexture(gl, textureOrPair)) {
      texture = textureOrPair;
      sampler = null;
    } else {
      texture = textureOrPair.texture;
      sampler = textureOrPair.sampler;
    }
    gl.uniform1i(location, unit);
    gl.activeTexture(TEXTURE0 + unit);
    gl.bindTexture(bindPoint, texture);
    gl.bindSampler(unit, sampler);
  } : function(texture) {
    gl.uniform1i(location, unit);
    gl.activeTexture(TEXTURE0 + unit);
    gl.bindTexture(bindPoint, texture);
  };
}

function samplerArraySetter(gl, type, unit, location, size) {
  const bindPoint = getBindPointForSamplerType(gl, type);
  const units = new Int32Array(size);
  for (let ii = 0; ii < size; ++ii) {
    units[ii] = unit + ii;
  }

  return isWebGL2(gl) ? function(textures) {
    gl.uniform1iv(location, units);
    textures.forEach(function(textureOrPair, index) {
      gl.activeTexture(TEXTURE0 + units[index]);
      let texture;
      let sampler;
      if (!textureOrPair || isTexture(gl, textureOrPair)) {
        texture = textureOrPair;
        sampler = null;
      } else {
        texture = textureOrPair.texture;
        sampler = textureOrPair.sampler;
      }
      gl.bindSampler(unit, sampler);
      gl.bindTexture(bindPoint, texture);
    });
  } : function(textures) {
    gl.uniform1iv(location, units);
    textures.forEach(function(texture, index) {
      gl.activeTexture(TEXTURE0 + units[index]);
      gl.bindTexture(bindPoint, texture);
    });
  };
}

typeMap[FLOAT]                         = { Type: Float32Array, size:  4, setter: floatSetter,      arraySetter: floatArraySetter, };
typeMap[FLOAT_VEC2]                    = { Type: Float32Array, size:  8, setter: floatVec2Setter,  cols: 2, };
typeMap[FLOAT_VEC3]                    = { Type: Float32Array, size: 12, setter: floatVec3Setter,  cols: 3, };
typeMap[FLOAT_VEC4]                    = { Type: Float32Array, size: 16, setter: floatVec4Setter,  cols: 4, };
typeMap[INT]                           = { Type: Int32Array,   size:  4, setter: intSetter,        arraySetter: intArraySetter, };
typeMap[INT_VEC2]                      = { Type: Int32Array,   size:  8, setter: intVec2Setter,    cols: 2, };
typeMap[INT_VEC3]                      = { Type: Int32Array,   size: 12, setter: intVec3Setter,    cols: 3, };
typeMap[INT_VEC4]                      = { Type: Int32Array,   size: 16, setter: intVec4Setter,    cols: 4, };
typeMap[UNSIGNED_INT]                  = { Type: Uint32Array,  size:  4, setter: uintSetter,       arraySetter: uintArraySetter, };
typeMap[UNSIGNED_INT_VEC2]             = { Type: Uint32Array,  size:  8, setter: uintVec2Setter,   cols: 2, };
typeMap[UNSIGNED_INT_VEC3]             = { Type: Uint32Array,  size: 12, setter: uintVec3Setter,   cols: 3, };
typeMap[UNSIGNED_INT_VEC4]             = { Type: Uint32Array,  size: 16, setter: uintVec4Setter,   cols: 4, };
typeMap[BOOL]                          = { Type: Uint32Array,  size:  4, setter: intSetter,        arraySetter: intArraySetter, };
typeMap[BOOL_VEC2]                     = { Type: Uint32Array,  size:  8, setter: intVec2Setter,    cols: 2, };
typeMap[BOOL_VEC3]                     = { Type: Uint32Array,  size: 12, setter: intVec3Setter,    cols: 3, };
typeMap[BOOL_VEC4]                     = { Type: Uint32Array,  size: 16, setter: intVec4Setter,    cols: 4, };
typeMap[FLOAT_MAT2]                    = { Type: Float32Array, size: 32, setter: floatMat2Setter,  rows: 2, cols: 2, };
typeMap[FLOAT_MAT3]                    = { Type: Float32Array, size: 48, setter: floatMat3Setter,  rows: 3, cols: 3, };
typeMap[FLOAT_MAT4]                    = { Type: Float32Array, size: 64, setter: floatMat4Setter,  rows: 4, cols: 4, };
typeMap[FLOAT_MAT2x3]                  = { Type: Float32Array, size: 32, setter: floatMat23Setter, rows: 2, cols: 3, };
typeMap[FLOAT_MAT2x4]                  = { Type: Float32Array, size: 32, setter: floatMat24Setter, rows: 2, cols: 4, };
typeMap[FLOAT_MAT3x2]                  = { Type: Float32Array, size: 48, setter: floatMat32Setter, rows: 3, cols: 2, };
typeMap[FLOAT_MAT3x4]                  = { Type: Float32Array, size: 48, setter: floatMat34Setter, rows: 3, cols: 4, };
typeMap[FLOAT_MAT4x2]                  = { Type: Float32Array, size: 64, setter: floatMat42Setter, rows: 4, cols: 2, };
typeMap[FLOAT_MAT4x3]                  = { Type: Float32Array, size: 64, setter: floatMat43Setter, rows: 4, cols: 3, };
typeMap[SAMPLER_2D]                    = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D$1,       };
typeMap[SAMPLER_CUBE]                  = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP, };
typeMap[SAMPLER_3D]                    = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_3D,       };
typeMap[SAMPLER_2D_SHADOW]             = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D$1,       };
typeMap[SAMPLER_2D_ARRAY]              = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY, };
typeMap[SAMPLER_2D_ARRAY_SHADOW]       = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY, };
typeMap[SAMPLER_CUBE_SHADOW]           = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP, };
typeMap[INT_SAMPLER_2D]                = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D$1,       };
typeMap[INT_SAMPLER_3D]                = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_3D,       };
typeMap[INT_SAMPLER_CUBE]              = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP, };
typeMap[INT_SAMPLER_2D_ARRAY]          = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY, };
typeMap[UNSIGNED_INT_SAMPLER_2D]       = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D$1,       };
typeMap[UNSIGNED_INT_SAMPLER_3D]       = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_3D,       };
typeMap[UNSIGNED_INT_SAMPLER_CUBE]     = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_CUBE_MAP, };
typeMap[UNSIGNED_INT_SAMPLER_2D_ARRAY] = { Type: null,         size:  0, setter: samplerSetter,    arraySetter: samplerArraySetter, bindPoint: TEXTURE_2D_ARRAY, };

function floatAttribSetter(gl, index) {
  return function(b) {
    if (b.value) {
      gl.disableVertexAttribArray(index);
      switch (b.value.length) {
        case 4:
          gl.vertexAttrib4fv(index, b.value);
          break;
        case 3:
          gl.vertexAttrib3fv(index, b.value);
          break;
        case 2:
          gl.vertexAttrib2fv(index, b.value);
          break;
        case 1:
          gl.vertexAttrib1fv(index, b.value);
          break;
        default:
          throw new Error('the length of a float constant value must be between 1 and 4!');
      }
    } else {
      gl.bindBuffer(ARRAY_BUFFER, b.buffer);
      gl.enableVertexAttribArray(index);
      gl.vertexAttribPointer(
          index, b.numComponents || b.size, b.type || FLOAT, b.normalize || false, b.stride || 0, b.offset || 0);
      if (gl.vertexAttribDivisor) {
        gl.vertexAttribDivisor(index, b.divisor || 0);
      }
    }
  };
}

function intAttribSetter(gl, index) {
  return function(b) {
    if (b.value) {
      gl.disableVertexAttribArray(index);
      if (b.value.length === 4) {
        gl.vertexAttrib4iv(index, b.value);
      } else {
        throw new Error('The length of an integer constant value must be 4!');
      }
    } else {
      gl.bindBuffer(ARRAY_BUFFER, b.buffer);
      gl.enableVertexAttribArray(index);
      gl.vertexAttribIPointer(
          index, b.numComponents || b.size, b.type || INT, b.stride || 0, b.offset || 0);
      if (gl.vertexAttribDivisor) {
        gl.vertexAttribDivisor(index, b.divisor || 0);
      }
    }
  };
}

function uintAttribSetter(gl, index) {
  return function(b) {
    if (b.value) {
      gl.disableVertexAttribArray(index);
      if (b.value.length === 4) {
        gl.vertexAttrib4uiv(index, b.value);
      } else {
        throw new Error('The length of an unsigned integer constant value must be 4!');
      }
    } else {
      gl.bindBuffer(ARRAY_BUFFER, b.buffer);
      gl.enableVertexAttribArray(index);
      gl.vertexAttribIPointer(
          index, b.numComponents || b.size, b.type || UNSIGNED_INT, b.stride || 0, b.offset || 0);
      if (gl.vertexAttribDivisor) {
        gl.vertexAttribDivisor(index, b.divisor || 0);
      }
    }
  };
}

function matAttribSetter(gl, index, typeInfo) {
  const defaultSize = typeInfo.size;
  const count = typeInfo.count;

  return function(b) {
    gl.bindBuffer(ARRAY_BUFFER, b.buffer);
    const numComponents = b.size || b.numComponents || defaultSize;
    const size = numComponents / count;
    const type = b.type || FLOAT;
    const typeInfo = typeMap[type];
    const stride = typeInfo.size * numComponents;
    const normalize = b.normalize || false;
    const offset = b.offset || 0;
    const rowOffset = stride / count;
    for (let i = 0; i < count; ++i) {
      gl.enableVertexAttribArray(index + i);
      gl.vertexAttribPointer(
          index + i, size, type, normalize, stride, offset + rowOffset * i);
      if (gl.vertexAttribDivisor) {
        gl.vertexAttribDivisor(index + i, b.divisor || 0);
      }
    }
  };
}



const attrTypeMap = {};
attrTypeMap[FLOAT]             = { size:  4, setter: floatAttribSetter, };
attrTypeMap[FLOAT_VEC2]        = { size:  8, setter: floatAttribSetter, };
attrTypeMap[FLOAT_VEC3]        = { size: 12, setter: floatAttribSetter, };
attrTypeMap[FLOAT_VEC4]        = { size: 16, setter: floatAttribSetter, };
attrTypeMap[INT]               = { size:  4, setter: intAttribSetter,   };
attrTypeMap[INT_VEC2]          = { size:  8, setter: intAttribSetter,   };
attrTypeMap[INT_VEC3]          = { size: 12, setter: intAttribSetter,   };
attrTypeMap[INT_VEC4]          = { size: 16, setter: intAttribSetter,   };
attrTypeMap[UNSIGNED_INT]      = { size:  4, setter: uintAttribSetter,  };
attrTypeMap[UNSIGNED_INT_VEC2] = { size:  8, setter: uintAttribSetter,  };
attrTypeMap[UNSIGNED_INT_VEC3] = { size: 12, setter: uintAttribSetter,  };
attrTypeMap[UNSIGNED_INT_VEC4] = { size: 16, setter: uintAttribSetter,  };
attrTypeMap[BOOL]              = { size:  4, setter: intAttribSetter,   };
attrTypeMap[BOOL_VEC2]         = { size:  8, setter: intAttribSetter,   };
attrTypeMap[BOOL_VEC3]         = { size: 12, setter: intAttribSetter,   };
attrTypeMap[BOOL_VEC4]         = { size: 16, setter: intAttribSetter,   };
attrTypeMap[FLOAT_MAT2]        = { size:  4, setter: matAttribSetter,   count: 2, };
attrTypeMap[FLOAT_MAT3]        = { size:  9, setter: matAttribSetter,   count: 3, };
attrTypeMap[FLOAT_MAT4]        = { size: 16, setter: matAttribSetter,   count: 4, };

/**
 * Returns true if attribute/uniform is a reserved/built in
 *
 * It makes no sense to me why GL returns these because it's
 * illegal to call `gl.getUniformLocation` and `gl.getAttribLocation`
 * with names that start with `gl_` (and `webgl_` in WebGL)
 *
 * I can only assume they are there because they might count
 * when computing the number of uniforms/attributes used when you want to
 * know if you are near the limit. That doesn't really make sense
 * to me but the fact that these get returned are in the spec.
 *
 * @param {WebGLActiveInfo} info As returned from `gl.getActiveUniform` or
 *    `gl.getActiveAttrib`.
 * @return {bool} true if it's reserved
 * @private
 */
function isBuiltIn(info) {
  const name = info.name;
  return name.startsWith("gl_") || name.startsWith("webgl_");
}

const tokenRE = /(\.|\[|]|\w+)/g;
const isDigit = s => s >= '0' && s <= '9';
function addSetterToUniformTree(fullPath, setter, node, uniformSetters) {
  const tokens = fullPath.split(tokenRE).filter(s => s !== '');
  let tokenNdx = 0;
  let path = '';

  for (;;) {
    const token = tokens[tokenNdx++];  // has to be name or number
    path += token;
    const isArrayIndex = isDigit(token[0]);
    const accessor = isArrayIndex
        ? parseInt(token)
        : token;
    if (isArrayIndex) {
      path += tokens[tokenNdx++];  // skip ']'
    }
    const isLastToken = tokenNdx === tokens.length;
    if (isLastToken) {
      node[accessor] = setter;
      break;
    } else {
      const token = tokens[tokenNdx++];  // has to be . or [
      const isArray = token === '[';
      const child = node[accessor] || (isArray ? [] : {});
      node[accessor] = child;
      node = child;
      uniformSetters[path] = uniformSetters[path] || function(node) {
        return function(value) {
          setUniformTree(node, value);
        };
      }(child);
      path += token;
    }
  }
}

/**
 * Creates setter functions for all uniforms of a shader
 * program.
 *
 * @see {@link module:twgl.setUniforms}
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {WebGLProgram} program the program to create setters for.
 * @returns {Object.<string, function>} an object with a setter by name for each uniform
 * @memberOf module:twgl/programs
 */
function createUniformSetters(gl, program) {
  let textureUnit = 0;

  /**
   * Creates a setter for a uniform of the given program with it's
   * location embedded in the setter.
   * @param {WebGLProgram} program
   * @param {WebGLUniformInfo} uniformInfo
   * @returns {function} the created setter.
   */
  function createUniformSetter(program, uniformInfo, location) {
    const isArray = uniformInfo.name.endsWith("[0]");
    const type = uniformInfo.type;
    const typeInfo = typeMap[type];
    if (!typeInfo) {
      throw new Error(`unknown type: 0x${type.toString(16)}`); // we should never get here.
    }
    let setter;
    if (typeInfo.bindPoint) {
      // it's a sampler
      const unit = textureUnit;
      textureUnit += uniformInfo.size;
      if (isArray) {
        setter = typeInfo.arraySetter(gl, type, unit, location, uniformInfo.size);
      } else {
        setter = typeInfo.setter(gl, type, unit, location, uniformInfo.size);
      }
    } else {
      if (typeInfo.arraySetter && isArray) {
        setter = typeInfo.arraySetter(gl, location);
      } else {
        setter = typeInfo.setter(gl, location);
      }
    }
    setter.location = location;
    return setter;
  }

  const uniformSetters = {};
  const uniformTree = {};
  const numUniforms = gl.getProgramParameter(program, ACTIVE_UNIFORMS);

  for (let ii = 0; ii < numUniforms; ++ii) {
    const uniformInfo = gl.getActiveUniform(program, ii);
    if (isBuiltIn(uniformInfo)) {
      continue;
    }
    let name = uniformInfo.name;
    // remove the array suffix.
    if (name.endsWith("[0]")) {
      name = name.substr(0, name.length - 3);
    }
    const location = gl.getUniformLocation(program, uniformInfo.name);
    // the uniform will have no location if it's in a uniform block
    if (location) {
      const setter = createUniformSetter(program, uniformInfo, location);
      uniformSetters[name] = setter;
      addSetterToUniformTree(name, setter, uniformTree, uniformSetters);
    }
  }

  return uniformSetters;
}

/**
 * @typedef {Object} TransformFeedbackInfo
 * @property {number} index index of transform feedback
 * @property {number} type GL type
 * @property {number} size 1 - 4
 * @memberOf module:twgl
 */

/**
 * Create TransformFeedbackInfo for passing to bindTransformFeedbackInfo.
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {WebGLProgram} program an existing WebGLProgram.
 * @return {Object<string, module:twgl.TransformFeedbackInfo>}
 * @memberOf module:twgl
 */
function createTransformFeedbackInfo(gl, program) {
  const info = {};
  const numVaryings = gl.getProgramParameter(program, TRANSFORM_FEEDBACK_VARYINGS);
  for (let ii = 0; ii < numVaryings; ++ii) {
    const varying = gl.getTransformFeedbackVarying(program, ii);
    info[varying.name] = {
      index: ii,
      type: varying.type,
      size: varying.size,
    };
  }
  return info;
}

/**
 * @typedef {Object} UniformData
 * @property {string} name The name of the uniform
 * @property {number} type The WebGL type enum for this uniform
 * @property {number} size The number of elements for this uniform
 * @property {number} blockNdx The block index this uniform appears in
 * @property {number} offset The byte offset in the block for this uniform's value
 * @memberOf module:twgl
 */

/**
 * The specification for one UniformBlockObject
 *
 * @typedef {Object} BlockSpec
 * @property {number} index The index of the block.
 * @property {number} size The size in bytes needed for the block
 * @property {number[]} uniformIndices The indices of the uniforms used by the block. These indices
 *    correspond to entries in a UniformData array in the {@link module:twgl.UniformBlockSpec}.
 * @property {bool} usedByVertexShader Self explanatory
 * @property {bool} usedByFragmentShader Self explanatory
 * @property {bool} used Self explanatory
 * @memberOf module:twgl
 */

/**
 * A `UniformBlockSpec` represents the data needed to create and bind
 * UniformBlockObjects for a given program
 *
 * @typedef {Object} UniformBlockSpec
 * @property {Object.<string, module:twgl.BlockSpec>} blockSpecs The BlockSpec for each block by block name
 * @property {UniformData[]} uniformData An array of data for each uniform by uniform index.
 * @memberOf module:twgl
 */

/**
 * Creates a UniformBlockSpec for the given program.
 *
 * A UniformBlockSpec represents the data needed to create and bind
 * UniformBlockObjects
 *
 * @param {WebGL2RenderingContext} gl A WebGL2 Rendering Context
 * @param {WebGLProgram} program A WebGLProgram for a successfully linked program
 * @return {module:twgl.UniformBlockSpec} The created UniformBlockSpec
 * @memberOf module:twgl/programs
 */
function createUniformBlockSpecFromProgram(gl, program) {
  const numUniforms = gl.getProgramParameter(program, ACTIVE_UNIFORMS);
  const uniformData = [];
  const uniformIndices = [];

  for (let ii = 0; ii < numUniforms; ++ii) {
    uniformIndices.push(ii);
    uniformData.push({});
    const uniformInfo = gl.getActiveUniform(program, ii);
    uniformData[ii].name = uniformInfo.name;
  }

  [
    [ "UNIFORM_TYPE", "type" ],
    [ "UNIFORM_SIZE", "size" ],  // num elements
    [ "UNIFORM_BLOCK_INDEX", "blockNdx" ],
    [ "UNIFORM_OFFSET", "offset", ],
  ].forEach(function(pair) {
    const pname = pair[0];
    const key = pair[1];
    gl.getActiveUniforms(program, uniformIndices, gl[pname]).forEach(function(value, ndx) {
      uniformData[ndx][key] = value;
    });
  });

  const blockSpecs = {};

  const numUniformBlocks = gl.getProgramParameter(program, ACTIVE_UNIFORM_BLOCKS);
  for (let ii = 0; ii < numUniformBlocks; ++ii) {
    const name = gl.getActiveUniformBlockName(program, ii);
    const blockSpec = {
      index: gl.getUniformBlockIndex(program, name),
      usedByVertexShader: gl.getActiveUniformBlockParameter(program, ii, UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER),
      usedByFragmentShader: gl.getActiveUniformBlockParameter(program, ii, UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER),
      size: gl.getActiveUniformBlockParameter(program, ii, UNIFORM_BLOCK_DATA_SIZE),
      uniformIndices: gl.getActiveUniformBlockParameter(program, ii, UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES),
    };
    blockSpec.used = blockSpec.usedByVertexShader || blockSpec.usedByFragmentShader;
    blockSpecs[name] = blockSpec;
  }

  return {
    blockSpecs: blockSpecs,
    uniformData: uniformData,
  };
}

function setUniformTree(tree, values) {
  for (const name in values) {
    const prop = tree[name];
    if (typeof prop === 'function') {
      prop(values[name]);
    } else {
      setUniformTree(tree[name], values[name]);
    }
  }
}

/**
 * Set uniforms and binds related textures.
 *
 * example:
 *
 *     const programInfo = createProgramInfo(
 *         gl, ["some-vs", "some-fs"]);
 *
 *     const tex1 = gl.createTexture();
 *     const tex2 = gl.createTexture();
 *
 *     ... assume we setup the textures with data ...
 *
 *     const uniforms = {
 *       u_someSampler: tex1,
 *       u_someOtherSampler: tex2,
 *       u_someColor: [1,0,0,1],
 *       u_somePosition: [0,1,1],
 *       u_someMatrix: [
 *         1,0,0,0,
 *         0,1,0,0,
 *         0,0,1,0,
 *         0,0,0,0,
 *       ],
 *     };
 *
 *     gl.useProgram(programInfo.program);
 *
 * This will automatically bind the textures AND set the
 * uniforms.
 *
 *     twgl.setUniforms(programInfo, uniforms);
 *
 * For the example above it is equivalent to
 *
 *     let texUnit = 0;
 *     gl.activeTexture(gl.TEXTURE0 + texUnit);
 *     gl.bindTexture(gl.TEXTURE_2D, tex1);
 *     gl.uniform1i(u_someSamplerLocation, texUnit++);
 *     gl.activeTexture(gl.TEXTURE0 + texUnit);
 *     gl.bindTexture(gl.TEXTURE_2D, tex2);
 *     gl.uniform1i(u_someSamplerLocation, texUnit++);
 *     gl.uniform4fv(u_someColorLocation, [1, 0, 0, 1]);
 *     gl.uniform3fv(u_somePositionLocation, [0, 1, 1]);
 *     gl.uniformMatrix4fv(u_someMatrix, false, [
 *         1,0,0,0,
 *         0,1,0,0,
 *         0,0,1,0,
 *         0,0,0,0,
 *       ]);
 *
 * Note it is perfectly reasonable to call `setUniforms` multiple times. For example
 *
 *     const uniforms = {
 *       u_someSampler: tex1,
 *       u_someOtherSampler: tex2,
 *     };
 *
 *     const moreUniforms {
 *       u_someColor: [1,0,0,1],
 *       u_somePosition: [0,1,1],
 *       u_someMatrix: [
 *         1,0,0,0,
 *         0,1,0,0,
 *         0,0,1,0,
 *         0,0,0,0,
 *       ],
 *     };
 *
 *     twgl.setUniforms(programInfo, uniforms);
 *     twgl.setUniforms(programInfo, moreUniforms);
 *
 * You can also add WebGLSamplers to uniform samplers as in
 *
 *     const uniforms = {
 *       u_someSampler: {
 *         texture: someWebGLTexture,
 *         sampler: someWebGLSampler,
 *       },
 *     };
 *
 * In which case both the sampler and texture will be bound to the
 * same unit.
 *
 * @param {(module:twgl.ProgramInfo|Object.<string, function>)} setters a `ProgramInfo` as returned from `createProgramInfo` or the setters returned from
 *        `createUniformSetters`.
 * @param {Object.<string, ?>} values an object with values for the
 *        uniforms.
 *   You can pass multiple objects by putting them in an array or by calling with more arguments.For example
 *
 *     const sharedUniforms = {
 *       u_fogNear: 10,
 *       u_projection: ...
 *       ...
 *     };
 *
 *     const localUniforms = {
 *       u_world: ...
 *       u_diffuseColor: ...
 *     };
 *
 *     twgl.setUniforms(programInfo, sharedUniforms, localUniforms);
 *
 *     // is the same as
 *
 *     twgl.setUniforms(programInfo, [sharedUniforms, localUniforms]);
 *
 *     // is the same as
 *
 *     twgl.setUniforms(programInfo, sharedUniforms);
 *     twgl.setUniforms(programInfo, localUniforms};
 *
 *   You can also fill out structure and array values either via
 *   shortcut. Example
 *
 *     // -- in shader --
 *     struct Light {
 *       float intensity;
 *       vec4 color;
 *       float nearFar[2];
 *     };
 *     uniform Light lights[2];
 *
 *     // in JavaScript
 *
 *     twgl.setUniforms(programInfo, {
 *       lights: [
 *         { intensity: 5.0, color: [1, 0, 0, 1], nearFar[0.1, 10] },
 *         { intensity: 2.0, color: [0, 0, 1, 1], nearFar[0.2, 15] },
 *       ],
 *     });
 *
 *   or the more traditional way
 *
 *     twgl.setUniforms(programInfo, {
 *       "lights[0].intensity": 5.0,
 *       "lights[0].color": [1, 0, 0, 1],
 *       "lights[0].nearFar": [0.1, 10],
 *       "lights[1].intensity": 2.0,
 *       "lights[1].color": [0, 0, 1, 1],
 *       "lights[1].nearFar": [0.2, 15],
 *     });
 *
 *   You can also specify partial paths
 *
 *     twgl.setUniforms(programInfo, {
 *       'lights[1]': { intensity: 5.0, color: [1, 0, 0, 1], nearFar[0.2, 15] },
 *     });
 *
 *   But you can not specify leaf array indices
 *
 *     twgl.setUniforms(programInfo, {
 *       'lights[1].nearFar[1]': 15,     // BAD! nearFar is a leaf
 *       'lights[1].nearFar': [0.2, 15], // GOOD
 *     });
 *
 * @memberOf module:twgl/programs
 */
function setUniforms(setters, ...args) {  // eslint-disable-line
  const actualSetters = setters.uniformSetters || setters;
  const numArgs = args.length;
  for (let aNdx = 0; aNdx < numArgs; ++aNdx) {
    const values = args[aNdx];
    if (Array.isArray(values)) {
      const numValues = values.length;
      for (let ii = 0; ii < numValues; ++ii) {
        setUniforms(actualSetters, values[ii]);
      }
    } else {
      for (const name in values) {
        const setter = actualSetters[name];
        if (setter) {
          setter(values[name]);
        }
      }
    }
  }
}

/**
 * Creates setter functions for all attributes of a shader
 * program. You can pass this to {@link module:twgl.setBuffersAndAttributes} to set all your buffers and attributes.
 *
 * @see {@link module:twgl.setAttributes} for example
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {WebGLProgram} program the program to create setters for.
 * @return {Object.<string, function>} an object with a setter for each attribute by name.
 * @memberOf module:twgl/programs
 */
function createAttributeSetters(gl, program) {
  const attribSetters = {
  };

  const numAttribs = gl.getProgramParameter(program, ACTIVE_ATTRIBUTES);
  for (let ii = 0; ii < numAttribs; ++ii) {
    const attribInfo = gl.getActiveAttrib(program, ii);
    if (isBuiltIn(attribInfo)) {
      continue;
    }
    const index = gl.getAttribLocation(program, attribInfo.name);
    const typeInfo = attrTypeMap[attribInfo.type];
    const setter = typeInfo.setter(gl, index, typeInfo);
    setter.location = index;
    attribSetters[attribInfo.name] = setter;
  }

  return attribSetters;
}

/**
 * Sets attributes and binds buffers (deprecated... use {@link module:twgl.setBuffersAndAttributes})
 *
 * Example:
 *
 *     const program = createProgramFromScripts(
 *         gl, ["some-vs", "some-fs");
 *
 *     const attribSetters = createAttributeSetters(program);
 *
 *     const positionBuffer = gl.createBuffer();
 *     const texcoordBuffer = gl.createBuffer();
 *
 *     const attribs = {
 *       a_position: {buffer: positionBuffer, numComponents: 3},
 *       a_texcoord: {buffer: texcoordBuffer, numComponents: 2},
 *     };
 *
 *     gl.useProgram(program);
 *
 * This will automatically bind the buffers AND set the
 * attributes.
 *
 *     setAttributes(attribSetters, attribs);
 *
 * Properties of attribs. For each attrib you can add
 * properties:
 *
 * *   type: the type of data in the buffer. Default = gl.FLOAT
 * *   normalize: whether or not to normalize the data. Default = false
 * *   stride: the stride. Default = 0
 * *   offset: offset into the buffer. Default = 0
 * *   divisor: the divisor for instances. Default = undefined
 *
 * For example if you had 3 value float positions, 2 value
 * float texcoord and 4 value uint8 colors you'd setup your
 * attribs like this
 *
 *     const attribs = {
 *       a_position: {buffer: positionBuffer, numComponents: 3},
 *       a_texcoord: {buffer: texcoordBuffer, numComponents: 2},
 *       a_color: {
 *         buffer: colorBuffer,
 *         numComponents: 4,
 *         type: gl.UNSIGNED_BYTE,
 *         normalize: true,
 *       },
 *     };
 *
 * @param {Object.<string, function>} setters Attribute setters as returned from createAttributeSetters
 * @param {Object.<string, module:twgl.AttribInfo>} buffers AttribInfos mapped by attribute name.
 * @memberOf module:twgl/programs
 * @deprecated use {@link module:twgl.setBuffersAndAttributes}
 * @private
 */
function setAttributes(setters, buffers) {
  for (const name in buffers) {
    const setter = setters[name];
    if (setter) {
      setter(buffers[name]);
    }
  }
}

/**
 * Sets attributes and buffers including the `ELEMENT_ARRAY_BUFFER` if appropriate
 *
 * Example:
 *
 *     const programInfo = createProgramInfo(
 *         gl, ["some-vs", "some-fs");
 *
 *     const arrays = {
 *       position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
 *       texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
 *     };
 *
 *     const bufferInfo = createBufferInfoFromArrays(gl, arrays);
 *
 *     gl.useProgram(programInfo.program);
 *
 * This will automatically bind the buffers AND set the
 * attributes.
 *
 *     setBuffersAndAttributes(gl, programInfo, bufferInfo);
 *
 * For the example above it is equivalent to
 *
 *     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
 *     gl.enableVertexAttribArray(a_positionLocation);
 *     gl.vertexAttribPointer(a_positionLocation, 3, gl.FLOAT, false, 0, 0);
 *     gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
 *     gl.enableVertexAttribArray(a_texcoordLocation);
 *     gl.vertexAttribPointer(a_texcoordLocation, 4, gl.FLOAT, false, 0, 0);
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext.
 * @param {(module:twgl.ProgramInfo|Object.<string, function>)} setters A `ProgramInfo` as returned from {@link module:twgl.createProgramInfo} or Attribute setters as returned from {@link module:twgl.createAttributeSetters}
 * @param {(module:twgl.BufferInfo|module:twgl.VertexArrayInfo)} buffers a `BufferInfo` as returned from {@link module:twgl.createBufferInfoFromArrays}.
 *   or a `VertexArrayInfo` as returned from {@link module:twgl.createVertexArrayInfo}
 * @memberOf module:twgl/programs
 */
function setBuffersAndAttributes(gl, programInfo, buffers) {
  if (buffers.vertexArrayObject) {
    gl.bindVertexArray(buffers.vertexArrayObject);
  } else {
    setAttributes(programInfo.attribSetters || programInfo, buffers.attribs);
    if (buffers.indices) {
      gl.bindBuffer(ELEMENT_ARRAY_BUFFER$1, buffers.indices);
    }
  }
}

/**
 * @typedef {Object} ProgramInfo
 * @property {WebGLProgram} program A shader program
 * @property {Object<string, function>} uniformSetters object of setters as returned from createUniformSetters,
 * @property {Object<string, function>} attribSetters object of setters as returned from createAttribSetters,
 * @property {module:twgl.UniformBlockSpec} [uniformBlockSpec] a uniform block spec for making UniformBlockInfos with createUniformBlockInfo etc..
 * @property {Object<string, module:twgl.TransformFeedbackInfo>} [transformFeedbackInfo] info for transform feedbacks
 * @memberOf module:twgl
 */

/**
 * Creates a ProgramInfo from an existing program.
 *
 * A ProgramInfo contains
 *
 *     programInfo = {
 *        program: WebGLProgram,
 *        uniformSetters: object of setters as returned from createUniformSetters,
 *        attribSetters: object of setters as returned from createAttribSetters,
 *     }
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext
 *        to use.
 * @param {WebGLProgram} program an existing WebGLProgram.
 * @return {module:twgl.ProgramInfo} The created ProgramInfo.
 * @memberOf module:twgl/programs
 */
function createProgramInfoFromProgram(gl, program) {
  const uniformSetters = createUniformSetters(gl, program);
  const attribSetters = createAttributeSetters(gl, program);
  const programInfo = {
    program,
    uniformSetters,
    attribSetters,
  };

  if (isWebGL2(gl)) {
    programInfo.uniformBlockSpec = createUniformBlockSpecFromProgram(gl, program);
    programInfo.transformFeedbackInfo = createTransformFeedbackInfo(gl, program);
  }

  return programInfo;
}

/**
 * Assert condition is true
 * @internal
 */
function assert(condition, errMsg = 'Assert failed') {
    if (!condition)
        throw new Error(errMsg);
}
/**
 * Assert that a numerical value is between upper and lower bounds
 * @internal
 */
function assertRange(value, min, max, name = '') {
    assert(value >= min && value <= max, `${name || 'value'} ${value} should be between ${min} and ${max}`);
}

/**
 * Webpack tries to replace inline calles to require() with polyfills,
 * but we don't want that, since we only use require to add extra features in NodeJs environments
 *
 * Modified from:
 * https://github.com/getsentry/sentry-javascript/blob/bd35d7364191ebed994fb132ff31031117c1823f/packages/utils/src/misc.ts#L9-L11
 * https://github.com/getsentry/sentry-javascript/blob/89bca28994a0eaab9bc784841872b12a1f4a875c/packages/hub/src/hub.ts#L340
 * @internal
 */
function dynamicRequire(nodeModule, p) {
    try {
        return nodeModule.require(p);
    }
    catch {
        throw new Error(`Could not require(${p})`);
    }
}
/**
 * Safely get global scope object
 * @internal
 */
function getGlobalObject() {
    return isNode
        ? global
        : typeof window !== 'undefined'
            ? window
            : typeof self !== 'undefined'
                ? self
                : {};
}
/**
 * Utils to find out information about the current code execution environment
 */
/**
 * Is the code running in a browser environment?
 * @internal
 */
const isBrowser = typeof window !== 'undefined'
    && typeof window.document !== 'undefined';
/**
 * Assert that the current environment should support browser APIs
 * @internal
 */
function assertBrowserEnv() {
    return assert(isBrowser, 'This feature is only available in browser environments');
}
/**
 * Is the code running in a Node environment?
 * @internal
 */
const isNode = typeof process !== 'undefined'
    && process.versions != null
    && process.versions.node != null;
// TODO: Deno support?
/**
 * Is the code running in a Web Worker enviornment?
 * @internal
 */
const isWebWorker = typeof self === 'object'
    && self.constructor
    && self.constructor.name === 'DedicatedWorkerGlobalScope';

/**
 * same SubtleCrypto API is available in browser and node, but in node it isn't global
 * @internal
 */
(() => {
    if (isBrowser || isWebWorker) {
        const global = getGlobalObject();
        return (global.crypto || global.msCrypto).subtle;
    }
    else if (isNode)
        return dynamicRequire(module, 'crypto').webcrypto.subtle;
})();

/**
 * Gracefully handles a given Promise factory.
 * @internal
 * @example
 * const [ error, data ] = await until(() => asyncAction())
 */
const until = async (promise) => {
    try {
        const data = await promise().catch((error) => {
            throw error;
        });
        return [null, data];
    }
    catch (error) {
        return [error, null];
    }
};

/**
 * Flipnote region
 */
var FlipnoteRegion;
(function (FlipnoteRegion) {
    /** Europe and Oceania */
    FlipnoteRegion["EUR"] = "EUR";
    /** Americas */
    FlipnoteRegion["USA"] = "USA";
    /** Japan */
    FlipnoteRegion["JPN"] = "JPN";
    /** Unidentified (possibly never used) */
    FlipnoteRegion["UNKNOWN"] = "UNKNOWN";
})(FlipnoteRegion || (FlipnoteRegion = {}));
/**
 * Match an FSID from Flipnote Studio
 * e.g. 1440D700CEF78DA8
 * @internal
 */
const REGEX_PPM_FSID = /^[0159]{1}[0-9A-F]{6}0[0-9A-F]{8}$/;
/**
 * @internal
 * There are several known exceptions to the FSID format, all from Nintendo or Hatena developer and event accounts (mario, zelda 25th, etc).
 * This list was compiled from data provided by the Flipnote Archive, so it can be considered comprehensive enough to match any Flipnote you may encounter.
 */
const PPM_FSID_SPECIAL_CASE = [
    '01FACA7A4367FC5F',
    '03D6E959E2F9A42D',
    '03F80445160587FA',
    '04068426E1008915',
    '092A3EC8199FD5D5',
    '0B8D56BA1BD441B8',
    '0E61C75C9B5AD90B',
    '14E494E35A443235'
];
/**
 * @internal
 */
PPM_FSID_SPECIAL_CASE.map(id => convertPpmFsidToKwzFsidSuffix(id));
/**
 * Convert a PPM Flipnote Studio ID to the format used by KWZ Flipnote Studio IDs (as seen in Nintendo DSi Library Flipnotes).
 * Will return `null` if the conversion could not be made.
 *
 * NOTE: KWZ Flipnote Studio IDs contain an extra two characters at the beginning. It is not possible to resolve these from a PPM Flipnote Studio ID.
 */
function convertPpmFsidToKwzFsidSuffix(fsid) {
    if (REGEX_PPM_FSID.test(fsid))
        return (fsid.slice(14, 16) + fsid.slice(12, 14) + '-' + fsid.slice(10, 12) + fsid.slice(8, 10) + '-' + fsid.slice(6, 8) + fsid.slice(4, 6) + '-' + fsid.slice(2, 4) + fsid.slice(0, 2)).toLowerCase();
    return null;
}

/** @internal */
((function () {
    if (!isBrowser) {
        return function () { };
    }
    const a = document.createElement('a');
    return function (blob, filename) {
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}))();

/** Identifies which animation format a Flipnote uses */
var FlipnoteFormat;
(function (FlipnoteFormat) {
    /** Animation format used by Flipnote Studio (Nintendo DSiWare) */
    FlipnoteFormat["PPM"] = "PPM";
    /** Animation format used by Flipnote Studio 3D (Nintendo 3DS) */
    FlipnoteFormat["KWZ"] = "KWZ";
})(FlipnoteFormat || (FlipnoteFormat = {}));
/** Buffer format for a FlipnoteThumbImage  */
var FlipnoteThumbImageFormat;
(function (FlipnoteThumbImageFormat) {
    FlipnoteThumbImageFormat[FlipnoteThumbImageFormat["Jpeg"] = 0] = "Jpeg";
    FlipnoteThumbImageFormat[FlipnoteThumbImageFormat["Rgba"] = 1] = "Rgba";
})(FlipnoteThumbImageFormat || (FlipnoteThumbImageFormat = {}));
/** stereoscopic eye view (left/right) for 3D effects */
var FlipnoteStereoscopicEye;
(function (FlipnoteStereoscopicEye) {
    FlipnoteStereoscopicEye[FlipnoteStereoscopicEye["Left"] = 0] = "Left";
    FlipnoteStereoscopicEye[FlipnoteStereoscopicEye["Right"] = 1] = "Right";
})(FlipnoteStereoscopicEye || (FlipnoteStereoscopicEye = {}));
/** Identifies a Flipnote audio track type */
var FlipnoteAudioTrack;
(function (FlipnoteAudioTrack) {
    /** Background music track */
    FlipnoteAudioTrack[FlipnoteAudioTrack["BGM"] = 0] = "BGM";
    /** Sound effect 1 track */
    FlipnoteAudioTrack[FlipnoteAudioTrack["SE1"] = 1] = "SE1";
    /** Sound effect 2 track */
    FlipnoteAudioTrack[FlipnoteAudioTrack["SE2"] = 2] = "SE2";
    /** Sound effect 3 track */
    FlipnoteAudioTrack[FlipnoteAudioTrack["SE3"] = 3] = "SE3";
    /** Sound effect 4 track (only used by KWZ files) */
    FlipnoteAudioTrack[FlipnoteAudioTrack["SE4"] = 4] = "SE4";
})(FlipnoteAudioTrack || (FlipnoteAudioTrack = {}));
/** {@link FlipnoteAudioTrack}, but just sound effect tracks */
var FlipnoteSoundEffectTrack;
(function (FlipnoteSoundEffectTrack) {
    FlipnoteSoundEffectTrack[FlipnoteSoundEffectTrack["SE1"] = 1] = "SE1";
    FlipnoteSoundEffectTrack[FlipnoteSoundEffectTrack["SE2"] = 2] = "SE2";
    FlipnoteSoundEffectTrack[FlipnoteSoundEffectTrack["SE3"] = 3] = "SE3";
    FlipnoteSoundEffectTrack[FlipnoteSoundEffectTrack["SE4"] = 4] = "SE4";
})(FlipnoteSoundEffectTrack || (FlipnoteSoundEffectTrack = {}));

/** File format type */
FlipnoteFormat.PPM;
/** Which audio tracks are available in this format */
[
    FlipnoteAudioTrack.BGM,
    FlipnoteAudioTrack.SE1,
    FlipnoteAudioTrack.SE2,
    FlipnoteAudioTrack.SE3
];
/** Which sound effect tracks are available in this format */
[
    FlipnoteSoundEffectTrack.SE1,
    FlipnoteSoundEffectTrack.SE2,
    FlipnoteSoundEffectTrack.SE3,
];

/**
 * Pre computed bitmasks for readBits; done as a slight optimisation
 * @internal
 */
const BITMASKS = new Uint16Array(16);
for (let i = 0; i < 16; i++) {
    BITMASKS[i] = (1 << i) - 1;
}
/**
 * Every possible sequence of pixels for each 8-pixel line
 * @internal
 */
const KWZ_LINE_TABLE = new Uint8Array(6561 * 8);
/**
 * Same lines as KWZ_LINE_TABLE, but the pixels are shift-rotated to the left by one place
 * @internal
 */
const KWZ_LINE_TABLE_SHIFT = new Uint8Array(6561 * 8);
/** @internal */
var offset = 0;
for (let a = 0; a < 3; a++)
    for (let b = 0; b < 3; b++)
        for (let c = 0; c < 3; c++)
            for (let d = 0; d < 3; d++)
                for (let e = 0; e < 3; e++)
                    for (let f = 0; f < 3; f++)
                        for (let g = 0; g < 3; g++)
                            for (let h = 0; h < 3; h++) {
                                KWZ_LINE_TABLE.set([b, a, d, c, f, e, h, g], offset);
                                KWZ_LINE_TABLE_SHIFT.set([a, d, c, f, e, h, g, b], offset);
                                offset += 8;
                            }
/**
 * Commonly used lines - represents lines where all the pixels are empty, full,
 * or include a pattern produced by the paint tool, etc
 * @internal
 */
const KWZ_LINE_TABLE_COMMON = new Uint8Array(32 * 8);
/**
 * Same lines as common line table, but shift-rotates one place to the left
 * @internal
 */
const KWZ_LINE_TABLE_COMMON_SHIFT = new Uint8Array(32 * 8);
[
    0x0000, 0x0CD0, 0x19A0, 0x02D9, 0x088B, 0x0051, 0x00F3, 0x0009,
    0x001B, 0x0001, 0x0003, 0x05B2, 0x1116, 0x00A2, 0x01E6, 0x0012,
    0x0036, 0x0002, 0x0006, 0x0B64, 0x08DC, 0x0144, 0x00FC, 0x0024,
    0x001C, 0x0004, 0x0334, 0x099C, 0x0668, 0x1338, 0x1004, 0x166C
].forEach((value, i) => {
    const lineTablePtr = value * 8;
    const pixels = KWZ_LINE_TABLE.subarray(lineTablePtr, lineTablePtr + 8);
    const shiftPixels = KWZ_LINE_TABLE_SHIFT.subarray(lineTablePtr, lineTablePtr + 8);
    KWZ_LINE_TABLE_COMMON.set(pixels, i * 8);
    KWZ_LINE_TABLE_COMMON_SHIFT.set(shiftPixels, i * 8);
});
/** File format type */
FlipnoteFormat.KWZ;
/** Which audio tracks are available in this format */
[
    FlipnoteAudioTrack.BGM,
    FlipnoteAudioTrack.SE1,
    FlipnoteAudioTrack.SE2,
    FlipnoteAudioTrack.SE3,
    FlipnoteAudioTrack.SE4,
];
/** Which sound effect tracks are available in this format */
[
    FlipnoteSoundEffectTrack.SE1,
    FlipnoteSoundEffectTrack.SE2,
    FlipnoteSoundEffectTrack.SE3,
    FlipnoteSoundEffectTrack.SE4,
];

var vertShaderLayer = "#define GLSLIFY 1\nattribute vec4 position;attribute vec2 texcoord;varying vec2 v_uv;uniform bool u_flipY;uniform vec2 u_textureSize;uniform int u_3d_eye;uniform float u_3d_depth;uniform float u_3d_strength;void main(){vec4 pos=position;float depthDirection=u_3d_eye==0 ?-1.0 : 1.0;float depthShift=floor(u_3d_depth*u_3d_strength)/(u_textureSize.x/2.0)*depthDirection;pos.x+=depthShift;pos.y*=u_flipY ?-1.0 : 1.0;v_uv=texcoord;gl_Position=pos;}"; // eslint-disable-line

var fragShaderLayer = "precision highp float;\n#define GLSLIFY 1\nvarying vec2 v_uv;uniform sampler2D u_tex;uniform int u_3d_mode;void main(){vec4 col=texture2D(u_tex,v_uv);if(col.a==0.0){discard;}gl_FragColor=col;}"; // eslint-disable-line

var vertShaderUpscale = "#define GLSLIFY 1\nattribute vec4 position;attribute vec2 texcoord;varying vec2 v_texel;varying vec2 v_uv;varying float v_scale;uniform bool u_flipY;uniform vec2 u_textureSize;uniform vec2 u_screenSize;void main(){v_uv=texcoord;v_scale=floor(u_screenSize.y/u_textureSize.y+0.01);gl_Position=position;if(u_flipY){gl_Position.y*=-1.;}}"; // eslint-disable-line

var fragShaderUpscale = "precision highp float;\n#define GLSLIFY 1\nvarying vec2 v_uv;uniform sampler2D u_tex;varying float v_scale;uniform vec2 u_textureSize;uniform vec2 u_screenSize;void main(){vec2 v_texel=v_uv*u_textureSize;vec2 texel_floored=floor(v_texel);vec2 s=fract(v_texel);float region_range=0.5-0.5/v_scale;vec2 center_dist=s-0.5;vec2 f=(center_dist-clamp(center_dist,-region_range,region_range))*v_scale+0.5;vec2 mod_texel=texel_floored+f;vec2 coord=mod_texel.xy/u_textureSize.xy;gl_FragColor=texture2D(u_tex,coord);}"; // eslint-disable-line

/**
 * Flipnote renderer for the {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API WebGL} API
 *
 * Only available in browser contexts
 */
class WebglCanvas {
    static isSupported() {
        if (!isBrowser)
            return false;
        let testCanvas = document.createElement('canvas');
        let testCtx = testCanvas.getContext('2d');
        const supported = testCtx !== null;
        testCanvas = null;
        testCtx = null;
        return supported;
    }
    /**
     * Creates a new WebGlCanvas instance
     * @param el - Canvas HTML element to use as a rendering surface
     * @param width - Canvas width in CSS pixels
     * @param height - Canvas height in CSS pixels
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     */
    constructor(parent, width = 640, height = 480, options = {}) {
        /** */
        this.supportedStereoscopeModes = [
            CanvasStereoscopicMode.None,
            CanvasStereoscopicMode.Dual,
            // CanvasStereoscopicMode.Anaglyph, // couldn't get this working, despite spending lots of time on it :/
        ];
        /** */
        this.stereoscopeMode = CanvasStereoscopicMode.None;
        /** */
        this.stereoscopeStrength = 0;
        this.paletteBuffer = new Uint32Array(16);
        this.textureTypes = new Map();
        this.textureSizes = new Map();
        this.frameBufferTextures = new Map();
        this.applyFirefoxFix = false;
        this.refs = {
            programs: [],
            shaders: [],
            textures: [],
            buffers: [],
            frameBuffers: []
        };
        this.isCtxLost = false;
        this.handleContextLoss = (e) => {
            this.destroy();
            if (e)
                e.preventDefault();
            if (!this.isCtxLost)
                this.options.onlost();
            this.isCtxLost = true;
        };
        this.handleContextRestored = (e) => {
            this.isCtxLost = false;
            this.init();
            this.options.onrestored();
        };
        assertBrowserEnv();
        this.options = { ...WebglCanvas.defaultOptions, ...options };
        this.width = width;
        this.height = height;
        this.canvas = document.createElement('canvas');
        this.canvas.addEventListener('webglcontextlost', this.handleContextLoss, false);
        this.canvas.addEventListener('webglcontextrestored', this.handleContextRestored, false);
        this.canvas.className = 'FlipnoteCanvas FlipnoteCanvas--webgl';
        this.gl = this.canvas.getContext('webgl', {
            antialias: false,
            alpha: true
        });
        if (parent)
            parent.appendChild(this.canvas);
        this.init();
    }
    init() {
        this.setCanvasSize(this.width, this.height);
        const gl = this.gl;
        if (this.checkContextLoss())
            return;
        this.layerProgram = this.createProgram(vertShaderLayer, fragShaderLayer);
        this.upscaleProgram = this.createProgram(vertShaderUpscale, fragShaderUpscale);
        this.quadBuffer = this.createScreenQuad(-1, -1, 2, 2, 1, 1);
        this.setBuffersAndAttribs(this.layerProgram, this.quadBuffer);
        this.layerTexture = this.createTexture(gl.RGBA, gl.LINEAR, gl.CLAMP_TO_EDGE);
        this.frameTexture = this.createTexture(gl.RGBA, gl.LINEAR, gl.CLAMP_TO_EDGE);
        this.frameBuffer = this.createFramebuffer(this.frameTexture);
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        const userAgent = navigator.userAgent;
        const isMacFirefox = userAgent.includes('Firefox') && userAgent.includes('Mac');
        this.applyFirefoxFix = isMacFirefox && renderer.includes('Apple M');
    }
    createProgram(vertexShaderSource, fragmentShaderSource) {
        if (this.checkContextLoss())
            return;
        const gl = this.gl;
        const vert = this.createShader(gl.VERTEX_SHADER, vertexShaderSource);
        const frag = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
        const program = gl.createProgram();
        // set up shaders
        gl.attachShader(program, vert);
        gl.attachShader(program, frag);
        // link program
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const log = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            throw new Error(log);
        }
        const programInfo = createProgramInfoFromProgram(gl, program);
        this.refs.programs.push(program);
        return programInfo;
    }
    createShader(type, source) {
        if (this.checkContextLoss())
            return;
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
    // creating a subdivided quad seems to produce slightly nicer texture filtering
    createScreenQuad(x0, y0, width, height, xSubdivs, ySubdivs) {
        if (this.checkContextLoss())
            return;
        const numVerts = (xSubdivs + 1) * (ySubdivs + 1);
        const numVertsAcross = xSubdivs + 1;
        const positions = new Float32Array(numVerts * 2);
        const texCoords = new Float32Array(numVerts * 2);
        let positionPtr = 0;
        let texCoordPtr = 0;
        for (let y = 0; y <= ySubdivs; y++) {
            for (let x = 0; x <= xSubdivs; x++) {
                const u = x / xSubdivs;
                const v = y / ySubdivs;
                positions[positionPtr++] = x0 + width * u;
                positions[positionPtr++] = y0 + height * v;
                texCoords[texCoordPtr++] = u;
                texCoords[texCoordPtr++] = v;
            }
        }
        const indices = new Uint16Array(xSubdivs * ySubdivs * 2 * 3);
        let indicesPtr = 0;
        for (let y = 0; y < ySubdivs; y++) {
            for (let x = 0; x < xSubdivs; x++) {
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
        const bufferInfo = createBufferInfoFromArrays(this.gl, {
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
        // collect references to buffer objects
        for (let name in bufferInfo.attribs)
            this.refs.buffers.push(bufferInfo.attribs[name].buffer);
        return bufferInfo;
    }
    setBuffersAndAttribs(program, buffer) {
        if (this.checkContextLoss())
            return;
        setBuffersAndAttributes(this.gl, program.attribSetters, buffer);
    }
    createTexture(type, minMag, wrap, width = 1, height = 1) {
        if (this.checkContextLoss())
            return;
        const gl = this.gl;
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minMag);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, minMag);
        gl.texImage2D(gl.TEXTURE_2D, 0, type, width, height, 0, type, gl.UNSIGNED_BYTE, null);
        this.refs.textures.push(tex);
        this.textureTypes.set(tex, type);
        this.textureSizes.set(tex, { width, height });
        return tex;
    }
    resizeTexture(texture, width, height) {
        if (this.checkContextLoss())
            return;
        const gl = this.gl;
        const textureType = this.textureTypes.get(texture);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, textureType, width, height, 0, textureType, gl.UNSIGNED_BYTE, null);
        this.textureSizes.set(texture, { width, height });
    }
    createFramebuffer(texture) {
        if (this.checkContextLoss())
            return;
        const gl = this.gl;
        const fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        this.refs.frameBuffers.push(fb);
        this.frameBufferTextures.set(fb, texture);
        return fb;
    }
    useFramebuffer(fb, viewX, viewY, viewWidth, viewHeight) {
        if (this.checkContextLoss())
            return;
        const gl = this.gl;
        if (fb === null) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            /**
             * Firefox on Apple Silicon Macs seems to have some kind of viewport sizing bug that I can't track down.
             * Details here: https://github.com/jaames/flipnote.js/issues/30#issuecomment-2134602056
             * Not sure what's causing it, but this hack fixes it for now.
             * Need to test whether only specific versions of Firefox are affected, if it's only an Apple Silicon thing, etc, etc...
             */
            if (this.applyFirefoxFix) {
                const srcWidth = this.srcWidth;
                const srcHeight = this.srcHeight;
                const sx = gl.drawingBufferWidth / srcWidth;
                const sy = gl.drawingBufferHeight / srcHeight;
                const adj = srcWidth === 256 ? 1 : 0; // ??????? why
                viewWidth = gl.drawingBufferWidth * (sx - adj);
                viewHeight = gl.drawingBufferHeight * (sy - adj);
                viewX = -(viewWidth - srcWidth * sx);
                viewY = -(viewHeight - srcHeight * sy);
            }
            gl.viewport(viewX ?? 0, viewY ?? 0, viewWidth ?? gl.drawingBufferWidth, viewHeight ?? gl.drawingBufferHeight);
        }
        else {
            const tex = this.frameBufferTextures.get(fb);
            const { width, height } = this.textureSizes.get(tex);
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            gl.viewport(viewX ?? 0, viewY ?? 0, viewWidth ?? width, viewHeight ?? height);
        }
    }
    resizeFramebuffer(fb, width, height) {
        if (this.checkContextLoss())
            return;
        const texture = this.frameBufferTextures.get(fb);
        this.resizeTexture(texture, width, height);
    }
    /**
     * Resize the canvas surface
     * @param width - New canvas width, in CSS pixels
     * @param height - New canvas height, in CSS pixels
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     */
    setCanvasSize(width, height) {
        const dpi = this.options.useDpi ? (window.devicePixelRatio || 1) : 1;
        const internalWidth = width * dpi;
        const internalHeight = height * dpi;
        this.width = width;
        this.height = height;
        this.canvas.width = internalWidth;
        this.canvas.height = internalHeight;
        this.dstWidth = internalWidth;
        this.dstHeight = internalHeight;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.checkContextLoss();
    }
    /**
     * Sets the note to use for this player
     */
    setNote(note) {
        if (this.checkContextLoss())
            return;
        const width = note.imageWidth;
        const height = note.imageHeight;
        this.note = note;
        this.srcWidth = width;
        this.srcHeight = height;
        this.resizeFramebuffer(this.frameBuffer, width, height);
        this.resizeTexture(this.layerTexture, width, height);
        this.layerTexturePixelBuffer = new Uint32Array(width * height);
        this.layerTexturePixels = new Uint8Array(this.layerTexturePixelBuffer.buffer); // same memory buffer as rgbaData
        this.frameIndex = undefined;
        // set canvas alt text
        this.canvas.title = note.getTitle();
    }
    /**
     * Clear the canvas
     * @param color optional RGBA color to use as a background color
     */
    clear(color) {
        if (this.checkContextLoss())
            return;
        const gl = this.gl;
        const paperColor = color ?? this.note.getFramePalette(this.frameIndex)[0];
        const [r, g, b, a] = paperColor;
        gl.clearColor(r / 255, g / 255, b / 255, a / 255);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    /**
     * Draw a frame from the currently loaded Flipnote
     * @param frameIndex
     */
    drawFrame(frameIndex) {
        if (this.checkContextLoss())
            return;
        const gl = this.gl;
        const mode = this.stereoscopeMode;
        const strength = this.stereoscopeStrength;
        this.frameIndex = frameIndex;
        if (mode === CanvasStereoscopicMode.None) {
            this.drawLayers(frameIndex);
            this.useFramebuffer(null);
            this.upscale(gl.drawingBufferWidth, gl.drawingBufferHeight);
        }
        else if (mode === CanvasStereoscopicMode.Dual) {
            this.drawLayers(frameIndex, strength, FlipnoteStereoscopicEye.Left);
            this.useFramebuffer(null, 0, 0, gl.drawingBufferWidth / 2, gl.drawingBufferHeight);
            this.upscale(gl.drawingBufferWidth / 2, gl.drawingBufferHeight);
            this.drawLayers(frameIndex, strength, FlipnoteStereoscopicEye.Right);
            this.useFramebuffer(null, gl.drawingBufferWidth / 2, 0, gl.drawingBufferWidth / 2, gl.drawingBufferHeight);
            this.upscale(gl.drawingBufferWidth / 2, gl.drawingBufferHeight);
        }
    }
    upscale(width, height) {
        if (this.checkContextLoss())
            return;
        const gl = this.gl;
        gl.useProgram(this.upscaleProgram.program);
        setUniforms(this.upscaleProgram, {
            // u_flipY: true,
            u_tex: this.frameTexture,
            u_textureSize: [this.srcWidth, this.srcHeight],
            u_screenSize: [width, height],
        });
        gl.drawElements(gl.TRIANGLES, this.quadBuffer.numElements, this.quadBuffer.elementType, 0);
    }
    requestStereoScopeMode(mode) {
        if (this.supportedStereoscopeModes.includes(mode))
            this.stereoscopeMode = mode;
        else
            this.stereoscopeMode = CanvasStereoscopicMode.None;
        this.forceUpdate();
    }
    forceUpdate() {
        if (this.frameIndex !== undefined)
            this.drawFrame(this.frameIndex);
    }
    /**
     * Returns true if the webGL context has returned an error
     */
    isErrorState() {
        const gl = this.gl;
        return gl === null || gl.getError() !== gl.NO_ERROR;
    }
    drawLayers(frameIndex, depthStrength = 0, depthEye = FlipnoteStereoscopicEye.Left, shouldClear = true) {
        const gl = this.gl;
        const note = this.note;
        const srcWidth = this.srcWidth;
        const srcHeight = this.srcHeight;
        const numLayers = note.numLayers;
        const layerOrder = note.getFrameLayerOrder(frameIndex);
        const layerDepths = note.getFrameLayerDepths(frameIndex);
        this.useFramebuffer(this.frameBuffer);
        if (shouldClear)
            this.clear();
        gl.useProgram(this.layerProgram.program);
        for (let i = 0; i < numLayers; i++) {
            const layerIndex = layerOrder[i];
            note.getLayerPixelsRgba(frameIndex, layerIndex, this.layerTexturePixelBuffer, this.paletteBuffer);
            setUniforms(this.layerProgram, {
                u_flipY: true,
                u_tex: this.layerTexture,
                u_textureSize: [srcWidth, srcHeight],
                u_3d_mode: this.stereoscopeMode,
                u_3d_eye: depthEye,
                u_3d_depth: layerDepths[layerIndex],
                u_3d_strength: depthStrength,
            });
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, srcWidth, srcHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.layerTexturePixels);
            gl.drawElements(gl.TRIANGLES, this.quadBuffer.numElements, this.quadBuffer.elementType, 0);
        }
    }
    /**
     * Only a certain number of WebGL contexts can be added to a single page before the browser will start culling old contexts.
     * This method returns true if it has been culled, false if not
     */
    checkContextLoss() {
        const isLost = this.isCtxLost || this.isErrorState();
        if (isLost)
            this.handleContextLoss();
        return isLost;
    }
    /**
     *
     * @param type image mime type (`image/jpeg`, `image/png`, etc)
     * @param quality image quality where supported, between 0 and 1
     */
    getDataUrl(type, quality) {
        return this.canvas.toDataURL(type, quality);
    }
    async getBlob(type, quality) {
        return new Promise((resolve, reject) => this.canvas.toBlob(resolve, type, quality));
    }
    /**
     * Frees any resources used by this canvas instance
     */
    destroy() {
        const refs = this.refs;
        const gl = this.gl;
        const canvas = this.canvas;
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
        refs.frameBuffers.forEach((fb) => {
            gl.deleteFramebuffer(fb);
        });
        refs.frameBuffers = [];
        refs.programs.forEach((program) => {
            gl.deleteProgram(program);
        });
        refs.programs = [];
        this.paletteBuffer = null;
        this.layerTexturePixelBuffer = null;
        this.layerTexturePixels = null;
        this.textureTypes.clear();
        this.textureSizes.clear();
        this.frameBufferTextures.clear();
        if (canvas && canvas.parentElement) {
            // shrink the canvas to reduce memory usage until it is garbage collected
            canvas.width = 1;
            canvas.height = 1;
            // remove canvas from dom
            canvas.parentNode.removeChild(canvas);
        }
    }
}
WebglCanvas.defaultOptions = {
    onlost: () => { },
    onrestored: () => { },
    useDpi: true
};

/**
 * Flipnote renderer for the [HTML5 2D canvas API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
 */
class Html5Canvas {
    static isSupported() {
        if (!isBrowser)
            return false;
        let testCanvas = document.createElement('canvas');
        let testCtx = testCanvas.getContext('2d');
        const supported = testCtx !== null;
        testCanvas = null;
        testCtx = null;
        return supported;
    }
    constructor(parent, width, height, options = {}) {
        /** */
        this.supportedStereoscopeModes = [
            CanvasStereoscopicMode.None
        ];
        /** */
        this.stereoscopeMode = CanvasStereoscopicMode.None;
        /** */
        this.stereoscopeStrength = 0;
        this.paletteBuffer = new Uint32Array(16);
        assertBrowserEnv();
        this.options = { ...Html5Canvas.defaultOptions, ...options };
        this.width = width;
        this.height = height;
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'FlipnoteCanvas FlipnoteCanvas--html5';
        this.ctx = this.canvas.getContext('2d');
        this.srcCanvas = document.createElement('canvas');
        this.srcCtx = this.srcCanvas.getContext('2d');
        assert(this.ctx !== null && this.srcCtx !== null, 'Could not create HTML5 canvas');
        if (parent)
            parent.appendChild(this.canvas);
        this.setCanvasSize(width, height);
    }
    /**
     * Resize the canvas surface
     * @param width - New canvas width, in CSS pixels
     * @param height - New canvas height, in CSS pixels
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     */
    setCanvasSize(width, height) {
        const canvas = this.canvas;
        const useDpi = this.options.useDpi;
        const dpi = useDpi ? (window.devicePixelRatio || 1) : 1;
        const internalWidth = width * dpi;
        const internalHeight = height * dpi;
        this.width = width;
        this.height = height;
        this.dstWidth = internalWidth;
        this.dstHeight = internalHeight;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.width = internalWidth;
        canvas.height = internalHeight;
    }
    /**
     */
    setNote(note) {
        const width = note.imageWidth;
        const height = note.imageHeight;
        this.note = note;
        this.srcWidth = width;
        this.srcHeight = height;
        this.srcCanvas.width = width;
        this.srcCanvas.height = height;
        // create image data to fit note size
        this.frameImage = this.srcCtx.createImageData(width, height);
        // uint32 view of the img buffer memory
        this.frameBuffer = new Uint32Array(this.frameImage.data.buffer);
        this.frameIndex = undefined;
        // set canvas alt text
        this.canvas.title = note.getTitle();
    }
    /**
     * Clear the canvas
     * @param color optional RGBA color to use as a background color
     */
    clear(color) {
        // clear framebuffer
        this.frameBuffer.fill(0);
        // clear canvas
        this.ctx.clearRect(0, 0, this.dstWidth, this.dstHeight);
        // fill canvas with paper color
        if (color) {
            const [r, g, b, a] = color;
            this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
            this.ctx.fillRect(0, 0, this.dstWidth, this.dstHeight);
        }
    }
    drawFrame(frameIndex) {
        // clear whatever's already been drawn
        this.clear();
        // optionally enable image smoothing
        if (!this.options.useSmoothing)
            this.ctx.imageSmoothingEnabled = false;
        // get frame pixels as RGBA buffer
        this.note.getFramePixelsRgba(frameIndex, this.frameBuffer, this.paletteBuffer);
        // put framebuffer pixels into the src canvas
        this.srcCtx.putImageData(this.frameImage, 0, 0);
        // composite src canvas to dst (so image scaling can be handled)
        this.ctx.drawImage(this.srcCanvas, 0, 0, this.srcWidth, this.srcHeight, 0, 0, this.dstWidth, this.dstHeight);
        this.frameIndex = frameIndex;
    }
    requestStereoScopeMode(mode) {
        if (this.supportedStereoscopeModes.includes(mode))
            this.stereoscopeMode = mode;
        else
            this.stereoscopeMode = CanvasStereoscopicMode.None;
        this.forceUpdate();
    }
    forceUpdate() {
        if (this.frameIndex !== undefined)
            this.drawFrame(this.frameIndex);
    }
    getDataUrl(type, quality) {
        return this.canvas.toDataURL(type, quality);
    }
    async getBlob(type, quality) {
        return new Promise((resolve, reject) => this.canvas.toBlob(resolve, type, quality));
    }
    destroy() {
        this.frameImage = null;
        this.paletteBuffer = null;
        this.frameBuffer = null;
        this.canvas.parentNode.removeChild(this.canvas);
        this.canvas.width = 1;
        this.canvas.height = 1;
        this.canvas = null;
        this.srcCanvas.width = 1;
        this.srcCanvas.height = 1;
        this.srcCanvas = null;
    }
}
Html5Canvas.defaultOptions = {
    useDpi: true,
    useSmoothing: true,
};

class UniversalCanvas {
    constructor(parent, width = 640, height = 480, options = {}) {
        /** */
        this.isReady = false;
        /** */
        this.isHtml5 = false;
        /** */
        this.supportedStereoscopeModes = [];
        /** */
        this.stereoscopeMode = CanvasStereoscopicMode.None;
        /** */
        this.stereoscopeStrength = 1;
        this.rendererStack = [
            WebglCanvas,
            Html5Canvas
        ];
        this.rendererStackIdx = 0;
        this.options = {};
        this.width = width;
        this.height = height;
        this.parent = parent;
        this.options = options;
        this.setSubRenderer(this.rendererStack[0]);
    }
    setSubRenderer(Canvas) {
        let immediateLoss = false;
        const renderer = new Canvas(this.parent, this.width, this.height, {
            ...this.options,
            onlost: () => {
                immediateLoss = true;
                this.fallbackIfPossible();
            }
        });
        // if onlost was called immediately, we succeed to the fallback
        if (immediateLoss)
            return;
        if (this.note) {
            renderer.setNote(this.note);
            renderer.frameIndex = this.renderer?.frameIndex;
            renderer.forceUpdate();
        }
        if (this.renderer)
            this.renderer.destroy();
        this.isHtml5 = renderer instanceof Html5Canvas;
        this.isReady = true;
        this.renderer = renderer;
        this.rendererStackIdx = this.rendererStack.indexOf(Canvas);
        this.supportedStereoscopeModes = renderer.supportedStereoscopeModes;
        renderer.stereoscopeStrength = this.stereoscopeStrength;
        this.requestStereoScopeMode(this.stereoscopeMode);
    }
    fallbackIfPossible() {
        if (this.rendererStackIdx >= this.rendererStack.length)
            throw new Error('No renderer to fall back to');
        this.rendererStackIdx += 1;
        this.setSubRenderer(this.rendererStack[this.rendererStackIdx]);
    }
    // for backwards compat
    switchToHtml5() {
        this.setSubRenderer(Html5Canvas);
    }
    setCanvasSize(width, height) {
        const renderer = this.renderer;
        renderer.setCanvasSize(width, height);
        this.width = width;
        this.width = height;
        this.dstWidth = renderer.dstWidth;
        this.dstHeight = renderer.dstHeight;
    }
    setNote(note) {
        this.note = note;
        this.renderer.setNote(note);
        this.frameIndex = undefined;
        this.srcWidth = this.renderer.srcWidth;
        this.srcHeight = this.renderer.srcHeight;
    }
    clear(color) {
        this.renderer.clear(color);
    }
    drawFrame(frameIndex) {
        this.renderer.drawFrame(frameIndex);
        this.frameIndex = frameIndex;
    }
    forceUpdate() {
        this.renderer.forceUpdate();
    }
    requestStereoScopeMode(mode) {
        this.renderer.requestStereoScopeMode(mode);
        this.stereoscopeMode = this.renderer.stereoscopeMode;
    }
    getDataUrl(type, quality) {
        return this.renderer.getDataUrl();
    }
    async getBlob(type, quality) {
        return this.renderer.getBlob();
    }
    destroy() {
        this.renderer.destroy();
        this.note = null;
    }
}

/** @internal */
const _AudioContext = (() => {
    if (isBrowser)
        return (window.AudioContext || window.webkitAudioContext);
    return null;
})();
/**
 * Audio player built around the {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API | Web Audio API}
 *
 * Capable of playing PCM streams, with volume adjustment and an optional equalizer. Only available in browser contexts
 */
class WebAudioPlayer {
    constructor() {
        /** Whether the audio is being run through an equalizer or not */
        this.useEq = false;
        /** Whether to connect the output to an audio analyser (see {@link analyser}) */
        this.useAnalyser = false;
        /** Default equalizer settings. Credit to {@link https://www.sudomemo.net/ | Sudomemo} for these */
        this.eqSettings = [
            [31.25, 4.1],
            [62.5, 1.2],
            [125, 0],
            [250, -4.1],
            [500, -2.3],
            [1000, 0.5],
            [2000, 6.5],
            [8000, 5.1],
            [16000, 5.1]
        ];
        this._volume = 1;
        this._loop = false;
        this._startTime = 0;
        this._ctxStartTime = 0;
        this.nodeRefs = [];
        assertBrowserEnv();
    }
    /** The audio output volume. Range is 0 to 1 */
    set volume(value) {
        this.setVolume(value);
    }
    get volume() {
        return this._volume;
    }
    /** Whether the audio should loop after it has ended */
    set loop(value) {
        this._loop = value;
        if (this.source)
            this.source.loop = value;
    }
    get loop() {
        return this._loop;
    }
    getCtx() {
        if (!this.ctx)
            this.ctx = new _AudioContext();
        return this.ctx;
    }
    /**
     * Set the audio buffer to play
     * @param inputBuffer
     * @param sampleRate - For best results, this should be a multiple of 16364
     */
    setBuffer(inputBuffer, sampleRate) {
        const ctx = this.getCtx();
        const numSamples = inputBuffer.length;
        const audioBuffer = ctx.createBuffer(1, numSamples, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        if (inputBuffer instanceof Float32Array)
            channelData.set(inputBuffer, 0);
        else if (inputBuffer instanceof Int16Array) {
            for (let i = 0; i < numSamples; i++) {
                channelData[i] = inputBuffer[i] / 32768;
            }
        }
        this.buffer = audioBuffer;
        this.sampleRate = sampleRate;
    }
    connectEqNodesTo(inNode) {
        const ctx = this.getCtx();
        const eqSettings = this.eqSettings;
        let lastNode = inNode;
        eqSettings.forEach(([frequency, gain], index) => {
            const node = ctx.createBiquadFilter();
            this.nodeRefs.push(node);
            node.frequency.value = frequency;
            node.gain.value = gain;
            if (index === 0)
                node.type = 'lowshelf';
            else if (index === eqSettings.length - 1)
                node.type = 'highshelf';
            else
                node.type = 'peaking';
            lastNode.connect(node);
            lastNode = node;
        });
        return lastNode;
    }
    initNodes() {
        const ctx = this.getCtx();
        this.nodeRefs = [];
        const source = ctx.createBufferSource();
        this.nodeRefs.push(source);
        source.buffer = this.buffer;
        const gainNode = ctx.createGain();
        this.nodeRefs.push(gainNode);
        if (this.useEq) {
            const eq = this.connectEqNodesTo(source);
            eq.connect(gainNode);
        }
        else {
            source.connect(gainNode);
        }
        if (this.useAnalyser) {
            const analyserNode = ctx.createAnalyser();
            this.nodeRefs.push(analyserNode);
            this.analyser = analyserNode;
            gainNode.connect(analyserNode);
            analyserNode.connect(ctx.destination);
        }
        else {
            this.analyser = undefined;
            gainNode.connect(ctx.destination);
        }
        this.source = source;
        this.gainNode = gainNode;
        this.setVolume(this._volume);
    }
    setAnalyserEnabled(on) {
        this.useAnalyser = on;
        this.initNodes();
    }
    /**
     * Sets the audio volume level
     * @param value - range is 0 to 1
     */
    setVolume(value) {
        this._volume = value;
        if (this.gainNode) {
            // human perception of loudness is logarithmic, rather than linear
            // https://www.dr-lex.be/info-stuff/volumecontrols.html
            this.gainNode.gain.value = Math.pow(value, 2);
        }
    }
    /**
     * Begin playback from a specific point
     *
     * Note that the WebAudioPlayer doesn't keep track of audio playback itself. We rely on the {@link Player} API for that.
     * @param currentTime initial playback position, in seconds
     */
    playFrom(currentTime) {
        this.initNodes();
        this._startTime = currentTime;
        this._ctxStartTime = this.ctx.currentTime;
        this.source.loop = this._loop;
        this.source.start(0, currentTime);
    }
    /**
     * Stops the audio playback
     */
    stop() {
        if (this.source)
            this.source.stop(0);
    }
    /**
     * Get the current playback time, in seconds
     */
    getCurrentTime() {
        return this._startTime + (this.ctx.currentTime - this._ctxStartTime);
    }
    /**
     * Frees any resources used by this canvas instance
     */
    async destroy() {
        this.stop();
        const ctx = this.getCtx();
        this.nodeRefs.forEach(node => node.disconnect());
        this.nodeRefs = [];
        this.analyser = undefined;
        if (ctx.state !== 'closed' && typeof ctx.close === 'function')
            await ctx.close();
        this.buffer = null;
    }
}

/**
 * Flipnote Player API (exported as `flipnote.Player`) - provides a {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement | MediaElement}-like interface for loading Flipnotes and playing them.
 * This is intended for cases where you want to implement your own player UI, if you just want a pre-built player with some nice UI controls, check out the {@page Web Components} page instead!
 *
 * ### Create a new player
 *
 * You'll need an element in your page's HTML to act as a wrapper for the player:
 *
 * ```html
 *  <div id="player-wrapper"></div>
 * ```
 *
 * Then you can create a new `Player` instance by passing a CSS selector that matches the wrapper element, plus the desired width and height.
 *
 * ```js
 *  const player = new flipnote.Player('#player-wrapper', 320, 240);
 * ```
 *
 * ### Load a Flipnote
 *
 * Load a Flipnote from a valid {@link FlipnoteSource}:
 *
 * ```js
 * player.load('./path/to/flipnote.ppm');
 * ```
 *
 * ### Listen to events
 *
 * Use the {@link on} method to register event listeners:
 *
 * ```js
 *  player.on('play', function() {
 *    // do something when the Flipnote starts playing...
 *  });
 * ```
 */
class Player {
    /**
     * Create a new Player instance
     *
     * @param parent - Element to mount the rendering canvas to
     * @param width - Canvas width (pixels)
     * @param height - Canvas height (pixels)
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     */
    constructor(parent, width, height, parserSettings = {}) {
        /** Animation duration, in seconds */
        this.duration = 0;
        /** Automatically begin playback after a Flipnote is loaded */
        this.autoplay = false;
        /** Array of events supported by this player */
        this.supportedEvents = supportedEvents;
        /** @internal */
        this._src = null;
        /** @internal */
        this._loop = false;
        /** @internal */
        this._volume = 1;
        /** @internal */
        this._muted = false;
        /** @internal */
        this._frame = null;
        /** @internal */
        this._hasEnded = false;
        /** @internal */
        this.isNoteLoaded = false;
        /** @internal */
        this.events = new Map();
        /** @internal */
        this.playbackStartTime = 0;
        /** @internal */
        this.playbackTime = 0;
        /** @internal */
        this.playbackLoopId = null;
        /** @internal */
        this.showThumbnail = true;
        /** @internal */
        this.hasPlaybackStarted = false;
        /** @internal */
        this.isPlaying = false;
        /** @internal */
        this.wasPlaying = false;
        /** @internal */
        this.isSeeking = false;
        /** @internal */
        this.lastParser = undefined;
        /** @internal */
        this.lastLoaders = undefined;
        /**
         * Playback animation loop
         * @internal
         * @category Playback Control
         */
        this.playbackLoop = (timestamp) => {
            if (!this.isPlaying)
                return;
            const now = timestamp / 1000;
            const duration = this.duration;
            const currAudioTime = this.audio.getCurrentTime();
            let currPlaybackTime = now - this.playbackStartTime;
            // try to keep playback time in sync with the audio if there's any slipping
            if (Math.abs((currPlaybackTime % duration) - (currAudioTime % duration)) > 0.01)
                currPlaybackTime = currAudioTime;
            // handle playback end, if reached
            if (currPlaybackTime >= duration) {
                if (this.loop) {
                    this.playbackStartTime = now;
                    this.emit(PlayerEvent.Loop);
                }
                else {
                    this.pause();
                    this._hasEnded = true;
                    this.emit(PlayerEvent.Ended);
                    return;
                }
            }
            this.setCurrentTime(currPlaybackTime % duration);
            this.playbackLoopId = requestAnimationFrame(this.playbackLoop);
        };
        assertBrowserEnv();
        // if parent is a string, use it to select an Element, else assume it's an Element
        const mountPoint = ('string' == typeof parent) ? document.querySelector(parent) : parent;
        this.parserSettings = parserSettings;
        this.renderer = new UniversalCanvas(mountPoint, width, height, {
            onlost: () => this.emit(PlayerEvent.Error),
            onrestored: () => this.reload()
        });
        this.audio = new WebAudioPlayer();
        this.el = mountPoint;
        // this.canvasEl = this.renderer.el;
    }
    /** The currently loaded Flipnote source, if there is one */
    get src() {
        return this._src;
    }
    set src(source) {
        throw new Error('Setting a Player source has been deprecated, please use the load() method instead');
    }
    /** Indicates whether playback is currently paused */
    get paused() {
        return !this.isPlaying;
    }
    set paused(isPaused) {
        if (isPaused)
            this.pause();
        else
            this.play();
    }
    /** Current animation frame index */
    get currentFrame() {
        return this._frame;
    }
    set currentFrame(frameIndex) {
        this.setCurrentFrame(frameIndex);
    }
    /** Current animation playback position, in seconds */
    get currentTime() {
        return this.isNoteLoaded ? this.playbackTime : null;
    }
    set currentTime(value) {
        this.setCurrentTime(value);
    }
    /** Current animation playback progress, as a percentage out of 100 */
    get progress() {
        return this.isNoteLoaded ? (this.playbackTime / this.duration) * 100 : null;
    }
    set progress(value) {
        this.setProgress(value);
    }
    /** Audio volume, range `0` to `1` */
    get volume() {
        return this.getVolume();
    }
    set volume(value) {
        this.setVolume(value);
    }
    /** Audio mute state */
    get muted() {
        return this.getMuted();
    }
    set muted(value) {
        this.setMuted(value);
    }
    /** Indicates whether playback should loop once the end is reached */
    get loop() {
        return this.getLoop();
    }
    set loop(value) {
        this.setLoop(value);
    }
    /** Animation frame rate, measured in frames per second */
    get framerate() {
        return this.note.framerate;
    }
    /** Animation frame count */
    get frameCount() {
        return this.note.frameCount;
    }
    /** Animation frame speed */
    get frameSpeed() {
        return this.note.frameSpeed;
    }
    /**
     * Implementation of the `HTMLMediaElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered | buffered } property
     * @category HTMLVideoElement compatibility
     */
    get buffered() {
        return createTimeRanges([[0, this.duration]]);
    }
    /**
     * Implementation of the `HTMLMediaElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seekable | seekable} property
     * @category HTMLVideoElement compatibility
     */
    get seekable() {
        return createTimeRanges([[0, this.duration]]);
    }
    /**
     * Implementation of the `HTMLMediaElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentSrc | currentSrc} property
     * @category HTMLVideoElement compatibility
     */
    get currentSrc() {
        return this._src;
    }
    /**
     * Implementation of the `HTMLVideoElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoWidth | videoWidth} property
     * @category HTMLVideoElement compatibility
     */
    get videoWidth() {
        return this.isNoteLoaded ? this.note.imageWidth : 0;
    }
    /**
     * Implementation of the `HTMLVideoElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoHeight | videoHeight} property
     * @category HTMLVideoElement compatibility
     */
    get videoHeight() {
        return this.isNoteLoaded ? this.note.imageHeight : 0;
    }
    /**
     * Open a Flipnote from a source
     * @category Lifecycle
     */
    async load(source, getParser, loaders) {
        // close currently open note first
        if (this.isNoteLoaded)
            this.closeNote();
        // keep track of source
        this._src = source;
        // if no source specified, just reset everything
        if (!source)
            return this.openNote(this.note);
        // otherwise do a normal load
        this.emit(PlayerEvent.LoadStart);
        const [err, note] = await until(() => getParser(source, this.parserSettings, loaders));
        if (err) {
            this.emit(PlayerEvent.Error, err);
            throw new Error(`Error loading Flipnote: ${err.message}`);
        }
        this.lastParser = getParser;
        this.lastLoaders = loaders;
        this.openNote(note);
    }
    /**
     * Reload the current Flipnote
     */
    async reload() {
        if (this.note && this.lastParser)
            return await this.load(this.note.buffer, this.lastParser, this.lastLoaders);
    }
    /**
     * Reload the current Flipnote
     */
    async updateSettings(settings) {
        this.parserSettings = settings;
        return await this.reload();
    }
    /**
     * Close the currently loaded Flipnote
     * @category Lifecycle
     */
    closeNote() {
        this.pause();
        this.note = null;
        this.isNoteLoaded = false;
        this.meta = null;
        this._src = null;
        this._frame = 0;
        // this.playbackFrame = null;
        this.playbackTime = 0;
        this.duration = 0;
        this.loop = false;
        this.isPlaying = false;
        this.wasPlaying = false;
        this.hasPlaybackStarted = false;
        this.showThumbnail = true;
        this.renderer.clear();
    }
    /**
     * Open a Flipnote into the player
     * @category Lifecycle
     */
    openNote(note) {
        if (this.isNoteLoaded)
            this.closeNote();
        this.note = note;
        this.meta = note.meta;
        this.emit(PlayerEvent.LoadedMeta);
        this.noteFormat = note.format;
        this.duration = note.duration;
        this.playbackTime = 0;
        this._frame = 0;
        this.isNoteLoaded = true;
        this.isPlaying = false;
        this.wasPlaying = false;
        this.hasPlaybackStarted = false;
        this.layerVisibility = note.layerVisibility;
        this.showThumbnail = true;
        this.audio.setBuffer(note.getAudioMasterPcm(), note.sampleRate);
        this.emit(PlayerEvent.CanPlay);
        this.emit(PlayerEvent.CanPlayThrough);
        this.setLoop(note.meta.loop);
        this.renderer.setNote(note);
        this.drawFrame(note.thumbFrameIndex);
        this.emit(PlayerEvent.LoadedData);
        this.emit(PlayerEvent.Load);
        this.emit(PlayerEvent.Ready);
        if (this.autoplay)
            this.play();
    }
    /**
     * Set the current playback time
     * @category Playback Control
     */
    setCurrentTime(value) {
        this.assertNoteLoaded();
        const i = Math.floor(value / (1 / this.framerate));
        this.setCurrentFrame(i);
        this.playbackTime = value;
        this.emit(PlayerEvent.Progress, this.progress);
    }
    /**
     * Get the current playback time
     * @category Playback Control
     */
    getCurrentTime() {
        return this.currentTime;
    }
    /**
     * Get the current time as a counter string, like `"0:00 / 1:00"`
     * @category Playback Control
     */
    getTimeCounter() {
        const currentTime = formatTime(Math.max(this.currentTime, 0));
        const duration = formatTime(this.duration);
        return `${currentTime} / ${duration}`;
    }
    /**
     * Get the current frame index as a counter string, like `"001 / 999"`
     * @category Playback Control
     */
    getFrameCounter() {
        const frame = padNumber(this.currentFrame + 1, 3);
        const total = padNumber(this.frameCount, 3);
        return `${frame} / ${total}`;
    }
    /**
     * Set the current playback progress as a percentage (`0` to `100`)
     * @category Playback Control
     */
    setProgress(value) {
        this.assertNoteLoaded();
        assertRange(value, 0, 100, 'progress');
        this.currentTime = this.duration * (value / 100);
    }
    /**
     * Get the current playback progress as a percentage (0 to 100)
     * @category Playback Control
     */
    getProgress() {
        return this.progress;
    }
    /**
     * Begin animation playback starting at the current position
     * @category Playback Control
     */
    async play() {
        this.assertNoteLoaded();
        if (this.isPlaying)
            return;
        // if the flipnote hasn't looped and is at the end, rewind it to 0
        if (this._hasEnded) {
            this.playbackTime = 0;
            this._hasEnded = false;
        }
        const now = performance.now();
        this.playbackStartTime = (now / 1000) - this.playbackTime;
        this.isPlaying = true;
        this.hasPlaybackStarted = true;
        this.playAudio();
        this.playbackLoop(now);
        this.emit(PlayerEvent.Play);
    }
    /**
     * Pause animation playback at the current position
     * @category Playback Control
     */
    pause() {
        if (!this.isPlaying)
            return;
        this.isPlaying = false;
        if (this.playbackLoopId !== null)
            cancelAnimationFrame(this.playbackLoopId);
        this.stopAudio();
        this.emit(PlayerEvent.Pause);
    }
    /**
     * Resumes animation playback if paused, otherwise pauses
     * @category Playback Control
     */
    togglePlay() {
        if (!this.isPlaying)
            this.play();
        else
            this.pause();
    }
    /**
     * Determines if playback is currently paused
     * @category Playback Control
     */
    getPaused() {
        return !this.isPlaying;
    }
    /**
     * Get the duration of the Flipnote in seconds
     * @category Playback Control
     */
    getDuration() {
        return this.duration;
    }
    /**
     * Determines if playback is looped
     * @category Playback Control
     */
    getLoop() {
        return this._loop;
    }
    /**
     * Set the playback loop
     * @category Playback Control
     */
    setLoop(loop) {
        this._loop = loop;
        this.audio.loop = loop;
    }
    /**
     * Switch the playback loop between on and off
     * @category Playback Control
     */
    toggleLoop() {
        this.setLoop(!this._loop);
    }
    /**
     * Jump to a given animation frame
     * @category Frame Control
     */
    setCurrentFrame(newFrameValue) {
        this.assertNoteLoaded();
        const newFrameIndex = Math.max(0, Math.min(Math.floor(newFrameValue), this.frameCount - 1));
        if (newFrameIndex === this.currentFrame && !this.showThumbnail)
            return;
        this._frame = newFrameIndex;
        this.drawFrame(newFrameIndex);
        this.showThumbnail = false;
        if (!this.isPlaying) {
            this.playbackTime = newFrameIndex * (1 / this.framerate);
            this.emit(PlayerEvent.SeekEnd);
        }
        this.emit(PlayerEvent.FrameUpdate, this.currentFrame);
        this.emit(PlayerEvent.Progress, this.progress);
        this.emit(PlayerEvent.TimeUpdate, this.currentFrame);
    }
    /**
     * Jump to the next animation frame
     * If the animation loops, and is currently on its last frame, it will wrap to the first frame
     * @category Frame Control
     */
    nextFrame() {
        if ((this.loop) && (this.currentFrame === this.frameCount - 1))
            this.currentFrame = 0;
        else
            this.currentFrame += 1;
        this.emit(PlayerEvent.FrameNext);
    }
    /**
     * Jump to the next animation frame
     * If the animation loops, and is currently on its first frame, it will wrap to the last frame
     * @category Frame Control
     */
    prevFrame() {
        if ((this.loop) && (this.currentFrame === 0))
            this.currentFrame = this.frameCount - 1;
        else
            this.currentFrame -= 1;
        this.emit(PlayerEvent.FramePrev);
    }
    /**
     * Jump to the last animation frame
     * @category Frame Control
     */
    lastFrame() {
        this.currentFrame = this.frameCount - 1;
        this.emit(PlayerEvent.FrameLast);
    }
    /**
     * Jump to the first animation frame
     * @category Frame Control
     */
    firstFrame() {
        this.currentFrame = 0;
        this.emit(PlayerEvent.FrameFirst);
    }
    /**
     * Jump to the thumbnail frame
     * @category Frame Control
     */
    thumbnailFrame() {
        this.currentFrame = this.note.thumbFrameIndex;
    }
    /**
     * Begins a seek operation
     * @category Playback Control
     */
    startSeek() {
        if (!this.isSeeking) {
            this.emit(PlayerEvent.SeekStart);
            this.wasPlaying = this.isPlaying;
            this.pause();
            this.isSeeking = true;
        }
    }
    /**
     * Seek the playback progress to a different position
     * @param position - animation playback position, range `0` to `1`
     * @category Playback Control
     */
    seek(position) {
        if (this.isSeeking)
            this.progress = position * 100;
    }
    /**
     * Ends a seek operation
     * @category Playback Control
     */
    endSeek() {
        if (this.isSeeking && this.wasPlaying === true)
            this.play();
        this.wasPlaying = false;
        this.isSeeking = false;
    }
    /**
     * Draws the specified animation frame to the canvas. Note that this doesn't update the playback time or anything, it simply decodes a given frame and displays it.
     * @param frameIndex
     * @category Display Control
     */
    drawFrame(frameIndex) {
        this.renderer.drawFrame(frameIndex);
    }
    /**
     * Forces the current animation frame to be redrawn
     * @category Display Control
     */
    forceUpdate() {
        this.renderer.forceUpdate();
    }
    /**
     * Resize the playback canvas to a new size
     * @param width - new canvas width (pixels)
     * @param height - new canvas height (pixels)
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     *
     * @category Display Control
     */
    resize(width, height) {
        if (height !== width * .75)
            console.warn(`Canvas width to height ratio should be 3:4 for best results (got ${width}x${height})`);
        this.renderer.setCanvasSize(width, height);
        this.forceUpdate();
    }
    /**
     * Sets whether an animation layer should be visible throughout the entire animation
     * @param layer - layer index, starting at 1
     * @param value - `true` for visible, `false` for invisible
     *
     * @category Display Control
     */
    setLayerVisibility(layer, value) {
        this.note.layerVisibility[layer] = value;
        this.layerVisibility[layer] = value;
        this.forceUpdate();
    }
    /**
     * Returns the visibility state for a given layer
     * @param layer - layer index, starting at 1
     *
     * @category Display Control
     */
    getLayerVisibility(layer) {
        return this.layerVisibility[layer];
    }
    /**
     * Toggles whether an animation layer should be visible throughout the entire animation
     *
     * @category Display Control
     */
    toggleLayerVisibility(layerIndex) {
        this.setLayerVisibility(layerIndex, !this.layerVisibility[layerIndex]);
    }
    playAudio() {
        this.audio.playFrom(this.currentTime);
    }
    stopAudio() {
        this.audio.stop();
    }
    /**
     * Toggle audio Sudomemo equalizer filter
     * @category Audio Control
     */
    toggleAudioEq() {
        this.setAudioEq(!this.audio.useEq);
    }
    /**
     * Turn audio Sudomemo equalizer filter on or off
     * @category Audio Control
     */
    setAudioEq(state) {
        if (this.isPlaying) {
            this.wasPlaying = true;
            this.stopAudio();
        }
        this.audio.useEq = state;
        if (this.wasPlaying) {
            this.wasPlaying = false;
            this.playAudio();
        }
    }
    /**
     * Turn the audio off
     * @category Audio Control
     */
    mute() {
        this.setMuted(true);
    }
    /**
     * Turn the audio on
     * @category Audio Control
     */
    unmute() {
        this.setMuted(false);
    }
    /**
     * Turn the audio on or off
     * @category Audio Control
     */
    setMuted(isMute) {
        if (isMute)
            this.audio.volume = 0;
        else
            this.audio.volume = this._volume;
        this._muted = isMute;
        this.emit(PlayerEvent.VolumeChange, this.audio.volume);
    }
    /**
     * Get the audio mute state
     * @category Audio Control
     */
    getMuted() {
        return this.volume === 0 ? true : this._muted;
    }
    /**
     * Switch the audio between muted and unmuted
     * @category Audio Control
     */
    toggleMuted() {
        this.setMuted(!this._muted);
    }
    /**
     * Set the audio volume
     * @category Audio Control
     */
    setVolume(volume) {
        assertRange(volume, 0, 1, 'volume');
        this._volume = volume;
        this.audio.volume = volume;
        this.emit(PlayerEvent.VolumeChange, this.audio.volume);
    }
    /**
     * Get the current audio volume
     * @category Audio Control
     */
    getVolume() {
        return this._muted ? 0 : this._volume;
    }
    /**
     * Implementation of the `HTMLVideoElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/seekToNextFrame | seekToNextFrame} method
     * @category HTMLVideoElement compatibility
     */
    seekToNextFrame() {
        this.nextFrame();
    }
    /**
     * Implementation of the `HTMLMediaElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/fastSeek | fastSeek} method
     * @category HTMLVideoElement compatibility
     */
    fastSeek(time) {
        this.currentTime = time;
    }
    /**
     * Implementation of the `HTMLVideoElement` {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/getVideoPlaybackQuality | getVideoPlaybackQuality } method
     * @category HTMLVideoElement compatibility
     */
    canPlayType(mediaType) {
        switch (mediaType) {
            case 'application/x-ppm':
            case 'application/x-kwz':
            case 'video/x-ppm':
            case 'video/x-kwz':
            // lauren is planning on registering these officially
            case 'video/vnd.nintendo.ugomemo.ppm':
            case 'video/vnd.nintendo.ugomemo.kwz':
                return 'probably';
            case 'application/octet-stream':
                return 'maybe';
            // and koizumi is planning his revenge
            case 'video/vnd.nintendo.ugomemo.fykt':
            default:
                return '';
        }
    }
    /**
     * Implementation of the `HTMLVideoElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/getVideoPlaybackQuality](getVideoPlaybackQuality) method
     * @category HTMLVideoElement compatibility
     */
    getVideoPlaybackQuality() {
        const quality = {
            creationTime: 0,
            droppedVideoFrames: 0,
            // @ts-ignore
            corruptedVideoFrames: 0,
            totalVideoFrames: this.frameCount
        };
        return quality;
    }
    /**
     * Implementation of the `HTMLVideoElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestPictureInPicture](requestPictureInPicture) method. Not currently working, only a stub.
     * @category HTMLVideoElement compatibility
     */
    requestPictureInPicture() {
        throw new Error('Not implemented');
    }
    /**
     * Implementation of the `HTMLVideoElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/captureStream](captureStream) method. Not currently working, only a stub.
     * @category HTMLVideoElement compatibility
     */
    captureStream() {
        throw new Error('Not implemented');
    }
    /**
     * Add an event callback
     * @category Event API
     */
    on(eventType, listener) {
        const events = this.events;
        const eventList = Array.isArray(eventType) ? eventType : [eventType];
        eventList.forEach(eventType => {
            if (!events.has(eventType))
                events.set(eventType, [listener]);
            else
                events.get(eventType).push(listener);
        });
    }
    /**
     * Remove an event callback
     * @category Event API
     */
    off(eventType, callback) {
        const events = this.events;
        const eventList = Array.isArray(eventType) ? eventType : [eventType];
        eventList.forEach(eventType => {
            if (!events.has(eventType))
                return;
            const callbackList = events.get(eventType);
            events.set(eventType, callbackList.splice(callbackList.indexOf(callback), 1));
        });
    }
    /**
     * Emit an event - mostly used internally
     * @category Event API
     */
    emit(eventType, ...args) {
        const events = this.events;
        if (eventType !== PlayerEvent.__Any && events.has(eventType)) {
            const callbackList = events.get(eventType);
            callbackList.forEach(callback => callback.apply(null, args));
            // call onwhatever() function for this event, if one has been added
            const listenerName = `on${eventType}`;
            const thisAsAny = this;
            if (typeof thisAsAny[listenerName] === 'function')
                thisAsAny[listenerName].apply(null, args);
        }
        // "any" event listeners fire for all events, and receive eventType as their first param
        if (events.has(PlayerEvent.__Any)) {
            const callbackList = events.get(PlayerEvent.__Any);
            callbackList.forEach(callback => callback.apply(null, [eventType, ...args]));
        }
    }
    /**
     * Remove all registered event callbacks
     * @category Event API
     */
    clearEvents() {
        this.events.clear();
    }
    /**
     * Destroy a Player instance
     * @category Lifecycle
     */
    async destroy() {
        this.clearEvents();
        this.emit(PlayerEvent.Destroy);
        this.closeNote();
        await this.renderer.destroy();
        await this.audio.destroy();
    }
    /**
     * Returns true if the player supports a given event or method name
     */
    supports(name) {
        const isEvent = this.supportedEvents.includes(name);
        const isMethod = typeof this[name] === 'function';
        return isEvent || isMethod;
    }
    /** @internal */
    assertNoteLoaded() {
        assert(this.isNoteLoaded, 'No Flipnote is currently loaded in this player');
    }
}

export { Player, PlayerEvent, supportedEvents };
