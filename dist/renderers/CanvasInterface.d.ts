import { FlipnoteParserBase } from '../parsers';
/** @internal */
export declare abstract class CanvasInterface {
    note: FlipnoteParserBase;
    width: number;
    height: number;
    srcWidth: number;
    srcHeight: number;
    dstWidth: number;
    dstHeight: number;
    prevFrameIndex: number;
    constructor(parent: Element, width: number, height: number);
    abstract setCanvasSize(width: number, height: number): void;
    abstract setNote(note: FlipnoteParserBase): void;
    abstract clear(color?: [number, number, number, number]): void;
    abstract drawFrame(frameIndex: number): void;
    abstract forceUpdate(): void;
    abstract getDataUrl(type?: string, quality?: any): string;
    abstract getBlob(type?: string, quality?: any): Promise<Blob>;
    abstract destroy(): void;
}
