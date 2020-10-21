/** webgl canvas wrapper class */
export declare class WebglCanvas {
    el: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    screenWidth: number;
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
    constructor(el: HTMLCanvasElement, width?: number, height?: number);
    private createProgram;
    private createShader;
    private createScreenQuad;
    private setBuffersAndAttribs;
    private createTexture;
    private createFrameBuffer;
    setCanvasSize(width: number, height: number): void;
    setTextureSize(width: number, height: number): void;
    clearFrameBuffer(paperColor: number[]): void;
    setPalette(colors: number[][]): void;
    drawPixels(pixels: Uint8Array, paletteOffset: number): void;
    composite(): void;
    resize(width?: number, height?: number): void;
    destroy(): void;
}
