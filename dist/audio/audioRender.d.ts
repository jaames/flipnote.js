declare function clamp(num: number, min: number, max: number): number;
declare function pcmInt16ToFloat32(src: Int16Array): Float32Array;
declare function audioMixAndInterpolate(src: Int16Array, dst: Int16Array, srcFreq: number, dstFreq: number, add: Boolean): void;
