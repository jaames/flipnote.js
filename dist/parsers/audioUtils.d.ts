/** @internal */
export declare function clamp(n: number, l: number, h: number): number;
/**
 * zero-order hold interpolation
 * @internal
 */
export declare function pcmDsAudioResample(src: Int16Array, srcFreq: number, dstFreq: number): Int16Array;
/** @internal */
export declare function pcmAudioMix(src: Int16Array, dst: Int16Array, dstOffset?: number): void;
/** @internal */
export declare const ADPCM_INDEX_TABLE_2BIT: Int8Array;
/** @internal */
export declare const ADPCM_INDEX_TABLE_4BIT: Int8Array;
/**
 * note that this is a slight deviation from the normal adpcm table
 * @internal
 */
export declare const ADPCM_STEP_TABLE: Int16Array;
/** @internal */
export declare const ADPCM_SAMPLE_TABLE_2BIT: Int16Array;
/** @internal */
export declare const ADPCM_SAMPLE_TABLE_4BIT: Int16Array;
