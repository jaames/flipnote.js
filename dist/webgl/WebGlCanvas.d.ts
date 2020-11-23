/**
 * Animation frame renderer, built around the {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API WebGL} API
 *
 * Only available in browser contexts
 */
export declare class WebglRenderer {
    /** Canvas HTML element being used as a rendering surface */
    el: HTMLCanvasElement;
    /** Rendering context - see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext} */
    gl: WebGLRenderingContext;
    /**
     * Backing canvas width (pixels)
     * Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels
     */
    screenWidth: number;
    /**
     * Backing canvas height (pixels)
     * Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels
     */
    screenHeight: number;
    private layerDrawProgram;
    private postProcessProgram;
    private quadBuffer;
    private paletteTexture;
    private layerTexture;
    private frameTexture;
    private frameBuffer;
    private textureWidth;
    private textureHeight;
    private refs;
    /**
     * Creates a new WebGlCanvas instance
     * @param el - Canvas HTML element to use as a rendering surface
     * @param width - Canvas width in CSS pixels
     * @param height - Canvas height in CSS pixels
     *
     * The ratio between `width` and `height` should be 3:4 for best results
     */
    constructor(el: HTMLCanvasElement, width?: number, height?: number);
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
    resize(width?: number, height?: number): void;
    /**
     * Frees any resources used by this canvas instance
     */
    destroy(): void;
}
