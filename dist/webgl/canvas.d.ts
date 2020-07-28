/** webgl canvas wrapper class */
export declare class WebglCanvas {
    width: number;
    height: number;
    el: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    private layerDrawProgram;
    private postProcessProgram;
    private quadBuffer;
    private layerTexture;
    private frameTexture;
    private frameBuffer;
    private textureWidth;
    private textureHeight;
    private refs;
    constructor(el: HTMLCanvasElement, width?: number, height?: number);
    private initBlendMode;
    private setProgram;
    private createProgram;
    private createScreenQuad;
    private createTexture;
    private createFrameTexture;
    private createFrameBuffer;
    bindScreenBuffer(): void;
    bindFrameBuffer(): void;
    clearFrameBuffer(value: number[]): void;
    setTextureSize(width: number, height: number): void;
    setCanvasSize(width: number, height: number): void;
    drawPixels(pixels: Uint8Array, color1: number[], color2: number[]): void;
    postProcess(): void;
    resize(width?: number, height?: number): void;
    destroy(): void;
}
