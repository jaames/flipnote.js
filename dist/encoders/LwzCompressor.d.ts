import { ByteArray } from '../utils/byteArray';
/** @internal */
export declare class LzwCompressor {
    width: number;
    height: number;
    pixels: Uint8Array;
    colorDepth: number;
    private initCodeSize;
    private accum;
    private htab;
    private codetab;
    private cur_accum;
    private cur_bits;
    private n_bits;
    private a_count;
    private remaining;
    private curPixel;
    private free_ent;
    private maxcode;
    private clear_flg;
    private g_init_bits;
    private ClearCode;
    private EOFCode;
    constructor(width: number, height: number, pixels: Uint8Array, colorDepth: number);
    char_out(c: number, outs: ByteArray): void;
    cl_block(outs: ByteArray): void;
    cl_hash(hsize: number): void;
    compress(init_bits: number, outs: ByteArray): void;
    encode(outs: ByteArray): void;
    flush_char(outs: ByteArray): void;
    get_maxcode(n_bits: number): number;
    nextPixel(): number;
    output(code: number, outs: ByteArray): void;
}
