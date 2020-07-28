import { ByteArray } from '../utils/index';
import { Flipnote } from '../parsers/index';
export interface GifEncoderMeta {
    transparentBg: boolean;
    delay: number;
    colorDepth: number;
    repeat: number;
}
export declare type GifEncoderPartialMeta = Partial<GifEncoderMeta>;
export declare class GifEncoder {
    static defaultMeta: GifEncoderMeta;
    width: number;
    height: number;
    palette: number[][];
    data: ByteArray;
    meta: GifEncoderMeta;
    constructor(width: number, height: number, meta?: GifEncoderPartialMeta);
    static fromFlipnote(flipnote: Flipnote, gifMeta?: GifEncoderPartialMeta): GifEncoder;
    static fromFlipnoteFrame(flipnote: Flipnote, frameIndex: number, gifMeta?: GifEncoderPartialMeta): GifEncoder;
    init(): void;
    writeHeader(): void;
    writeColorTable(): void;
    writeGraphicsControlExt(): void;
    writeNetscapeExt(): void;
    writeImageDesc(): void;
    writePixels(pixels: Uint8Array): void;
    writeFrame(pixels: Uint8Array): void;
    getBuffer(): ArrayBufferLike;
    getBlob(): Blob;
    getUrl(): string;
    getImage(): HTMLImageElement;
}
