import { CanvasInterface } from './CanvasInterface';
import { WebglCanvasOptions } from './WebGlCanvas';
import { Html5CanvasOptions } from './Html5Canvas';
import { FlipnoteParserBase } from '../parsers';
export declare type UniversalCanvasOptions = WebglCanvasOptions & Html5CanvasOptions;
export declare class UniversalCanvas implements CanvasInterface {
    /** */
    renderer: CanvasInterface;
    /** */
    note: FlipnoteParserBase;
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
    private parent;
    private options;
    private isReady;
    private isHtml5;
    constructor(parent: Element, width?: number, height?: number, options?: Partial<UniversalCanvasOptions>);
    switchToHtml5(): void;
    setCanvasSize(width: number, height: number): void;
    setNote(note: FlipnoteParserBase): void;
    clear(color?: [number, number, number, number]): void;
    drawFrame(frameIndex: number): void;
    forceUpdate(): void;
    getDataUrl(type?: string, quality?: any): string;
    getBlob(type?: string, quality?: any): Promise<Blob>;
    destroy(): void;
}
