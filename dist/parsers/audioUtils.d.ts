export declare function clamp(n: number, l: number, h: number): number;
export declare function pcmDsAudioResample(src: Int16Array, srcFreq: number, dstFreq: number): Int16Array;
export declare function pcmAudioMix(src: Int16Array, dst: Int16Array, dstOffset?: number): void;
export declare const ADPCM_INDEX_TABLE_2BIT: Int8Array;
export declare const ADPCM_INDEX_TABLE_4BIT: Int8Array;
export declare const ADPCM_STEP_TABLE: Int16Array;
export declare const ADPCM_SAMPLE_TABLE_2BIT: Int16Array;
export declare const ADPCM_SAMPLE_TABLE_4BIT: Int16Array;
