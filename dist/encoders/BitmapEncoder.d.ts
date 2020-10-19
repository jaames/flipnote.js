import { Flipnote } from '../parsers/index';
export declare function roundToNearest(value: number, n: number): number;
export declare class BitmapEncoder {
    width: number;
    height: number;
    bpp: number;
    private vWidth;
    private vHeight;
    private fileHeader;
    private dibHeader;
    private palette;
    private pixels;
    constructor(width: number, height: number, bpp: number);
    static fromFlipnoteFrame(flipnote: Flipnote, frameIndex: number): BitmapEncoder;
    setFilelength(value: number): void;
    setPixelOffset(value: number): void;
    setCompression(value: number): void;
    setPaletteCount(value: number): void;
    setPalette(colors: number[][]): void;
    setPixels(pixelData: Uint8Array): void;
    getBlob(): Blob;
    getUrl(): string;
    getImage(): HTMLImageElement;
}
