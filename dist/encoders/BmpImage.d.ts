import { Flipnote } from '../parsers/index';
/**
 * round number to nearest multiple of n
 * @internal
 */
export declare function roundToNearest(value: number, n: number): number;
/**
 * Bitmap image encoder
 * https://en.wikipedia.org/wiki/BMP_file_format
 * @category File Encoder
 * @internal
 */
export declare class BitmapImage {
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
    static fromFlipnoteFrame(flipnote: Flipnote, frameIndex: number): BitmapImage;
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
