/** @internal */
export declare function clamp(n: number, l: number, h: number): number;
/**
 * Zero-order hold interpolation
 * Credit to SimonTime for the original C version
 * @internal
 */
export declare function pcmDsAudioResample(src: Int16Array, srcFreq: number, dstFreq: number): Int16Array;
/** @internal */
export declare const ADPCM_INDEX_TABLE_2BIT: Int8Array;
/** @internal */
export declare const ADPCM_INDEX_TABLE_4BIT: Int8Array;
/** @internal */
export declare const ADPCM_STEP_TABLE: Int16Array;
/**
 * Get a ratio of how many audio samples hit the pcm_s16_le clipping bounds
 * This can be used to detect corrupted audio
 * @internal
 */
export declare function pcmGetClippingRatio(src: Int16Array): number;
