import type { FlipnoteParserBase } from '../parsers';
import { CanvasInterface } from './CanvasInterface';
/**
 * Setup options for {@link Html5Canvas}
 */
export interface Html5CanvasOptions {
    /** Use DPI scaling */
    useDpi: boolean;
    /** Use image smoothing */
    useSmoothing: boolean;
}
/**
 * Flipnote renderer for the [HTML5 2D canvas API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
 */
export declare class Html5Canvas implements CanvasInterface {
    static defaultOptions: Html5CanvasOptions;
    static isSupported(): boolean;
    /** */
    note: FlipnoteParserBase;
    /** Canvas HTML element being used as a rendering surface */
    canvas: HTMLCanvasElement;
    /** Rendering context */
    ctx: CanvasRenderingContext2D;
    /** View width (CSS pixels) */
    width: number;
    /** View height (CSS pixels) */
    height: number;
    /**
     * Backing canvas width (real pixels)
     * Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels
    */
    dstWidth: number;
    /**
     * Backing canvas height (real pixels)
     * Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels
    */
    dstHeight: number;
    /**  */
    srcWidth: number;
    /**  */
    srcHeight: number;
    /** */
    prevFrameIndex: number;
    private options;
    private srcCanvas;
    private srcCtx;
    private frameImage;
    private paletteBuffer;
    private frameBuffer;
    constructor(parent: Element, width: number, height: number, options?: Partial<Html5CanvasOptions>);
    /**
     * Resize the canvas surface
     * @param width - New canvas width, in CSS pixels
     * @param height - New canvas height, in CSS pixels
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     */
    setCanvasSize(width: number, height: number): void;
    /**
     */
    setNote(note: FlipnoteParserBase): void;
    /**
     * Clear the canvas
     * @param color optional RGBA color to use as a background color
     */
    clear(color?: [number, number, number, number]): void;
    drawFrame(frameIndex: number): void;
    forceUpdate(): void;
    getDataUrl(type?: string, quality?: any): string;
    getBlob(type?: string, quality?: any): Promise<Blob>;
    destroy(): void;
}
