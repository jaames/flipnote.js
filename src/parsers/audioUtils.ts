/** @internal */
export function clamp(n: number, l: number, h: number) {
  if (n < l)
    return l;
  if (n > h)
    return h;
  return n;
}


/** 
 * zero-order hold interpolation
 * @internal
 */
export function pcmDsAudioResample(src: Int16Array, srcFreq: number, dstFreq: number) {
  const srcDuration = src.length / srcFreq;
  const dstLength = srcDuration * dstFreq;
  const dst = new Int16Array(dstLength);
  const adjFreq = (srcFreq) / dstFreq;
  for (let n = 0; n < dst.length; n++) {
    dst[n] = src[Math.floor(n * adjFreq)];
  }
  return dst;
}

/** @internal */
export function pcmAudioMix(src: Int16Array, dst: Int16Array, dstOffset: number = 0) {
  const srcSize = src.length;
  const dstSize = dst.length;
  for (let n = 0; n < srcSize; n++) {
    if (dstOffset + n > dstSize)
      break;
    // half src volume
    const samp = dst[dstOffset + n] + (src[n] / 2);
    dst[dstOffset + n] = clamp(samp, -32768, 32767);
  }
}

/** @internal */
export const ADPCM_INDEX_TABLE_2BIT = new Int8Array([
  -1, 2, -1, 2
]);

/** @internal */
export const ADPCM_INDEX_TABLE_4BIT = new Int8Array([
  -1, -1, -1, -1, 2, 4, 6, 8,
  -1, -1, -1, -1, 2, 4, 6, 8
]);

/** 
 * note that this is a slight deviation from the normal adpcm table
 * @internal 
 */
export const ADPCM_STEP_TABLE = new Int16Array([
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

/** @internal */
export const ADPCM_SAMPLE_TABLE_2BIT = new Int16Array(90 * 4);
for (let sample = 0; sample < 4; sample++) {
  for (let stepIndex = 0; stepIndex < 90; stepIndex++) {
    let step = ADPCM_STEP_TABLE[stepIndex];
    let diff = step >> 3;
    if (sample & 1) diff += step;
    if (sample & 2) diff = -diff;
    ADPCM_SAMPLE_TABLE_2BIT[sample + 4 * stepIndex] = diff;
  }
}

/** @internal */
export const ADPCM_SAMPLE_TABLE_4BIT = new Int16Array(90 * 16);
for (let sample = 0; sample < 16; sample++) {
  for (let stepIndex = 0; stepIndex < 90; stepIndex++) {
    let step = ADPCM_STEP_TABLE[stepIndex];
    let diff = step >> 3;
    if (sample & 4) diff += step;
    if (sample & 2) diff += step >> 1;
    if (sample & 1) diff += step >> 2;
    if (sample & 8) diff = -diff;
    ADPCM_SAMPLE_TABLE_4BIT[sample + 16 * stepIndex] = diff;
  }
}