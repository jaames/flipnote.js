import { FlipnoteParserBase } from '../parsers';
import { CanvasInterface } from './CanvasInterface';
/**
 * Settings for {@link WebGlCanvas}
 */
export interface WebglCanvasOptions {
    /** Function to be called if the context is lost */
    onlost: () => void;
    /** Function to be called if the context is restored */
    onrestored: () => void;
    /** Use DPI scaling */
    useDpi: boolean;
}
/**
 * Flipnote renderer for the {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API WebGL} API
 *
 * Only available in browser contexts
 */
export declare class WebglCanvas implements CanvasInterface {
    static defaultOptions: WebglCanvasOptions;
    static isSupported(): boolean;
    /**  */
    note: FlipnoteParserBase;
    /** Canvas HTML element being used as a rendering surface */
    canvas: HTMLCanvasElement;
    /** Rendering context - see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext} */
    gl: WebGLRenderingContext;
    /** View width (CSS pixels) */
    width: number;
    /** View height (CSS pixels) */
    height: number;
    /** */
    srcWidth: number;
    /** */
    srcHeight: number;
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
    /** */
    prevFrameIndex: number;
    private options;
    private program;
    private quadBuffer;
    private paletteBuffer;
    private frameBuffer;
    private frameBufferBytes;
    private frameTexture;
    private refs;
    private isCtxLost;
    /**
     * Creates a new WebGlCanvas instance
     * @param el - Canvas HTML element to use as a rendering surface
     * @param width - Canvas width in CSS pixels
     * @param height - Canvas height in CSS pixels
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     */
    constructor(parent: Element, width?: number, height?: number, options?: Partial<WebglCanvasOptions>);
    private init;
    private createProgram;
    private createShader;
    private createScreenQuad;
    private setBuffersAndAttribs;
    private createTexture;
    /**
     * Resize the canvas surface
     * @param width - New canvas width, in CSS pixels
     * @param height - New canvas height, in CSS pixels
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     */
    setCanvasSize(width: number, height: number): void;
    /**
     * Sets the size of the input pixel arrays
     * @param width
     * @param height
     */
    setNote(note: FlipnoteParserBase): void;
    /**
     * Clear the canvas
     * @param color optional RGBA color to use as a background color
     */
    clear(color?: [number, number, number, number]): void;
    /**
     * Draw a frame from the currently loaded Flipnote
     * @param frameIndex
     */
    drawFrame(frameIndex: number): void;
    forceUpdate(): void;
    /**
     * Returns true if the webGL context has returned an error
     */
    isErrorState(): boolean;
    /**
     * Only a certain number of WebGL contexts can be added to a single page before the browser will start culling old contexts.
     * This method returns true if it has been culled, false if not
     */
    private checkContextLoss;
    private handleContextLoss;
    private handleContextRestored;
    /**
     *
     * @param type image mime type (`image/jpeg`, `image/png`, etc)
     * @param quality image quality where supported, between 0 and 1
     */
    getDataUrl(type?: string, quality?: any): string;
    getBlob(type?: string, quality?: any): Promise<Blob>;
    /**
     * Frees any resources used by this canvas instance
     */
    destroy(): void;
}
