import { FlipnoteParserBase } from '../parsers';

/** @internal */
export abstract class CanvasInterface {

  public note: FlipnoteParserBase;
  public width: number;
  public height: number;

  public srcWidth: number;
  public srcHeight: number;
  public dstWidth: number;
  public dstHeight: number;
  public prevFrameIndex: number;

  constructor (parent: Element, width: number, height: number) {}

  public abstract setCanvasSize(width: number, height: number): void

  public abstract setNote(note: FlipnoteParserBase): void

  public abstract clear(color?: [number, number, number, number]): void

  public abstract drawFrame(frameIndex: number): void

  public abstract forceUpdate(): void;

  public abstract getDataUrl(type?: string, quality?: any): string

  public abstract getBlob(type?: string, quality?: any): Promise<Blob>

  public abstract destroy(): void
}