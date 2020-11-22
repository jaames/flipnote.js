/// <reference types="node" />
import { Flipnote } from '../parsers/index';
/**
 * GIF RGBA palette color definition
 */
declare type GifPaletteColor = [
/** Red (0 to 255) */
number, 
/** Green (0 to 255) */
number, 
/** Blue (0 to 255) */
number, 
/** Alpha (0 to 255) */
number];
/**
 * Optional GIF encoder settings
 */
export interface GifEncoderSettings {
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
export declare class GifImage {
    /**
     * Default GIF encoder settings
     */
    static defaultSettings: GifEncoderSettings;
    /** Image width */
    width: number;
    /** Image height */
    height: number;
    /** GIF global RGBA color palette. Max 256 colors, alpha channel is ignored */
    palette: GifPaletteColor[];
    /** GIF image settings, such as whether it should loop, the delay between frames, etc */
    settings: GifEncoderSettings;
    /** Number of current GIF frames */
    numFrames: number;
    private data;
    private compressor;
    private dataUrl;
    /**
     * Create a new GIF image object
     * @param width image width
     * @param height image height
     * @param settings image settings, such as whether it should loop, the delay between frames, etc
     */
    constructor(width: number, height: number, settings?: Partial<GifEncoderSettings>);
    /**
     * Create an animated GIF image from a Flipnote
     *
     * This will encode the entire animation, so depending on the number of frames it could take a while to return.
     * @param flipnote {@link PpmParser} or {@link KwzParser} instance
     * @param settings image settings, such as whether it should loop, the delay between frames, etc
     */
    static fromFlipnote(flipnote: Flipnote, settings?: Partial<GifEncoderSettings>): GifImage;
    /**
     * Create an GIF image from a single Flipnote frame
     * @param flipnote {@link PpmParser} or {@link KwzParser} instance
     * @param frameIndex animation frame index to encode
     * @param settings image settings, such as whether it should loop, the delay between frames, etc
     */
    static fromFlipnoteFrame(flipnote: Flipnote, frameIndex: number, settings?: Partial<GifEncoderSettings>): GifImage;
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
     * Returns the GIF image data as an ArrayBuffer
     */
    getArrayBuffer(): ArrayBuffer;
    /**
     * Returns the GIF image data as a NodeJS Buffer
     *
     * Note: This method does not work outside of node.js environments
     *
     * Buffer API: https://nodejs.org/api/buffer.html
     */
    getBuffer(): Buffer;
    /**
     * Returns the GIF image data as a file blob
     *
     * Blob API: https://developer.mozilla.org/en-US/docs/Web/API/Blob
     */
    getBlob(): Blob;
    /**
     * Returns the GIF image data as an object URL
     *
     * Note: This method does not work outside of browser environments
     *
     * Object URL API: https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
     */
    getUrl(): string;
    /**
     * Revokes this image's object URL if one has been created
     *
     * Note: This method does not work outside of browser environments
     *
     * Object URL API: https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
     */
    revokeUrl(): void;
    /**
     * Returns the GIF image data as an Image object
     *
     * Note: This method does not work outside of browser environments
     *
     * Image API: https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image
     */
    getImage(): HTMLImageElement;
}
export {};
