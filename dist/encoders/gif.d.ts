import { ByteArray } from '../utils/index';
import { Flipnote } from '../parsers/index';
export declare class GifEncoder {
    width: number;
    height: number;
    delay: number;
    repeat: number;
    colorDepth: number;
    palette: number[][];
    data: ByteArray;
    constructor(width: number, height: number);
    static fromFlipnote(flipnote: Flipnote): GifEncoder;
    static fromFlipnoteFrame(flipnote: Flipnote, frameIndex: number): GifEncoder;
    init(): void;
    writeHeader(): void;
    writeColorTable(): void;
    writeGraphicsControlExt(): void;
    writeNetscapeExt(): void;
    writeImageDesc(): void;
    writePixels(pixels: Uint8Array): void;
    writeFrame(pixels: Uint8Array): void;
    getBuffer(): ArrayBuffer | SharedArrayBuffer;
    getBlob(): Blob;
    getUrl(): string;
    getImage(): HTMLImageElement;
}
