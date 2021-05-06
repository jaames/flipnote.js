interface WebglRendererOptions {
    /** Function to be called if the context is lost */
    onlost: () => void;
    /** Function to be called if the context is restored */
    onrestored: () => void;
}
/**
 * Animation frame renderer, built around the {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API WebGL} API
 *
 * Only available in browser contexts
 */
export declare class WebglRenderer {
    static defaultOptions: WebglRendererOptions;
    /** Canvas HTML element being used as a rendering surface */
    el: HTMLCanvasElement;
    /** Rendering context - see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext} */
    gl: WebGLRenderingContext;
    /** View width (CSS pixels) */
    width: number;
    /** View height (CSS pixels) */
    height: number;
    /**
     * Backing canvas width (real pixels)
     * Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels
     */
    screenWidth: number;
    /**
     * Backing canvas height (real pixels)
     * Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels
     */
    screenHeight: number;
    private options;
    private postProcessProgram;
    private quadBuffer;
    private paletteData;
    private rgbaData;
    private rgbaDataBytes;
    private frameTexture;
    private textureWidth;
    private textureHeight;
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
    constructor(el: HTMLCanvasElement, width?: number, height?: number, options?: Partial<WebglRendererOptions>);
    init(): void;
    private createProgram;
    private createShader;
    private createScreenQuad;
    private setBuffersAndAttribs;
    private createTexture;
    private createFrameBuffer;
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
    setInputSize(width: number, height: number): void;
    /**
     * Clear frame buffer
     * @param colors - Paper color as `[R, G, B, A]`
     */
    clearFrameBuffer(paperColor: number[]): void;
    /**
     * Set the color palette to use for the next {@link drawPixels} call
     * @param colors - Array of colors as `[R, G, B, A]`
     */
    setPalette(colors: number[][]): void;
    /**
     * Draw pixels to the frame buffer
     *
     * Note: use {@link composite} to draw the frame buffer to the canvas
     * @param pixels - Array of color indices for every pixl
     * @param paletteOffset - Palette offset index for the pixels being drawn
     */
    drawPixels(pixels: Uint8Array, paletteOffset: number): void;
    /**
     * Composites the current frame buffer into the canvas, applying post-processing effects like scaling filters if enabled
     */
    composite(): void;
    /**
     * Returns true if the webGL context has returned an error
     */
    isErrorState(): boolean;
    /**
     * Only a certain number of WebGL contexts can be added to a single page before the browser will start culling old contexts.
     * This method returns true if it has been culled, false if not
     */
    isLost(): boolean;
    private handleContextLoss;
    private handleContextRestored;
    /**
     * Frees any resources used by this canvas instance
     */
    destroy(): Promise<void>;
}
export {};
