export declare enum TextureType {
    Alpha,
    LuminanceAlpha
}
/** webgl canvas wrapper class */
export declare class WebglCanvas {
    width: number;
    height: number;
    el: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    private program;
    private textureType;
    private uniforms;
    private refs;
    constructor(el: HTMLCanvasElement, width?: number, height?: number, params?: {
        antialias: boolean;
        alpha: boolean;
    });
    private createProgram;
    private createScreenQuad;
    private createBitmapTexture;
    private createShader;
    setInputSize(width: number, height: number): void;
    setCanvasSize(width: number, height: number): void;
    setLayerType(textureType: TextureType): void;
    toImage(type?: string): string;
    setColor(color: string, value: number[]): void;
    setPaperColor(value: number[]): void;
    drawLayer(buffer: Uint8Array, width: number, height: number, color1: number[], color2: number[]): void;
    resize(width?: number, height?: number): void;
    clear(): void;
    destroy(): void;
}
