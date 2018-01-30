/** convert 4-bit adpcm to float32 pcm (as supported by the AudioBuffer API) 
 *  implementation based on http://www.cs.columbia.edu/~gskc/Code/AdvancedInternetServices/SoundNoiseRatio/dvi_adpcm.c
*/

const indexTable = [
  -1, -1, -1, -1, 2, 4, 6, 8,
  -1, -1, -1, -1, 2, 4, 6, 8
];

const stepSizeTable = [
  7, 8, 9, 10, 11, 12, 13, 14, 16, 17,
  19, 21, 23, 25, 28, 31, 34, 37, 41, 45,
  50, 55, 60, 66, 73, 80, 88, 97, 107, 118,
  130, 143, 157, 173, 190, 209, 230, 253, 279, 307,
  337, 371, 408, 449, 494, 544, 598, 658, 724, 796,
  876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066,
  2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358,
  5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899,
  15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767
];

let statePrevSample = 0,
    statePrevIndex = 0;

/**
* Convert 4-bit adpcm to 32-bit pcm
* @param {Uint8Array} inputBuffer - adpcm buffer
* @returns {Float32Array}
*/
export function decodeAdpcm(inputBuffer) {
  statePrevSample = 0;
  statePrevIndex = 0;
  var outputBuffer = new Float32Array(inputBuffer.length * 2);
  var outputOffset = 0;
  for (var inputOffset = 0; inputOffset < inputBuffer.length; inputOffset++) {
    var byte = inputBuffer[inputOffset];
    // note - Flipnote Studio's adpcm data uses reverse nibble order
    outputBuffer[outputOffset] = decodeSample(byte & 0xF);
    outputBuffer[outputOffset + 1] = decodeSample((byte >> 4) & 0xF);
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
  if (sample & 0x2) difference += (step >> 1);
  if (sample & 0x1) difference += (step >> 2);
  // handle sign bit
  predSample += (sample & 0x8) ? -difference : difference;

  // find new index value
  index += indexTable[sample];
  index = clamp(index, 0, 88);

  // clamp output value
  predSample = clamp(predSample, -32767, 32767);
  statePrevSample = predSample;
  statePrevIndex = index;
  // return a value between -1.0 and 1.0, since that's what's used by JavaScript's AudioBuffer API
  return predSample / 32768;
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