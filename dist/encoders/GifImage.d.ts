import { Flipnote } from '../parsers';
import { EncoderBase } from './EncoderBase';
/**
 * GIF RGBA palette color definition
 */
export declare type GifPaletteColor = [
    /** Red (0 to 255) */
    number,
    /** Green (0 to 255) */
    number,
    /** Blue (0 to 255) */
    number,
    /** Alpha (0 to 255) */
    number
];
/**
 * Optional GIF encoder settings
 */
export interface GifImageSettings {
    /** Use transparency */
    transparentBg: boolean;
    /** Delay between animated GIF frames, measured in milliseconds */
    delay: number;
    /** Color depth as bits per pixel. Defaults to 8 */
    colorDepth: number;
    /** -1 = no repeat, 0 = repeat forever. Anything else is repeat count */
    repeat: number;
}
/**
 * GIF image encoder
 *
 * Supports static single-frame GIF export as well as animated GIF
 * @category File Encoder
 */
export declare class GifImage extends EncoderBase {
    /**
     * Default GIF encoder settings
     */
    static defaultSettings: GifImageSettings;
    mimeType: string;
    /** Image width */
    width: number;
    /** Image height */
    height: number;
    /** GIF global RGBA color palette. Max 256 colors, alpha channel is ignored */
    palette: GifPaletteColor[];
    /** GIF image settings, such as whether it should loop, the delay between frames, etc */
    settings: GifImageSettings;
    /** Number of current GIF frames */
    frameCount: number;
    private data;
    private compressor;
    /**
     * Create a new GIF image object
     * @param width image width
     * @param height image height
     * @param settings whether the gif should loop, the delay between frames, etc. See {@link GifEncoderSettings}
     */
    constructor(width: number, height: number, settings?: Partial<GifImageSettings>);
    /**
     * Create an animated GIF image from a Flipnote
     *
     * This will encode the entire animation, so depending on the number of frames it could take a while to return.
     * @param flipnote {@link Flipnote} object ({@link PpmParser} or {@link KwzParser} instance)
     * @param settings whether the gif should loop, the delay between frames, etc. See {@link GifEncoderSettings}
     */
    static fromFlipnote(flipnote: Flipnote, settings?: Partial<GifImageSettings>): GifImage;
    /**
     * Create an GIF image from a single Flipnote frame
     * @param flipnote
     * @param frameIndex animation frame index to encode
     * @param settings whether the gif should loop, the delay between frames, etc. See {@link GifEncoderSettings}
     */
    static fromFlipnoteFrame(flipnote: Flipnote, frameIndex: number, settings?: Partial<GifImageSettings>): GifImage;
    /**
     * Add a frame to the GIF image
     * @param pixels Raw pixels to encode, must be an uncompressed 8bit array of palette indices with a size matching image width * image height
     */
    writeFrame(pixels: Uint8Array): void;
    private writeFirstFrame;
    private writeAdditionalFrame;
    private writeHeader;
    private writeColorTable;
    private writeNetscapeExt;
    private writeFrameHeader;
    private writePixels;
    /**
     * Returns the GIF image data as an {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}
     */
    getArrayBuffer(): ArrayBufferLike;
    /**
      * Returns the GIF image data as an {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image | Image} object
      *
      * Note: This method does not work outside of browser environments
      */
    getImage(): HTMLImageElement;
}
