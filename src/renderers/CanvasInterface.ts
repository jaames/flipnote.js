import type { FlipnoteParserBase, FlipnoteStereoscopicEye } from '../parsers';

/** @internal */
export type CanvasConstructor = {
  new(parent: Element, width: number, height: number, options?: {}): CanvasInterface
}

export enum CanvasStereoscopicMode {
  None,
  Dual,
  // not actually supported, sorry!
  Anaglyph,
};

/** @internal */
export abstract class CanvasInterface {

  note: FlipnoteParserBase;
  width: number;
  height: number;

  srcWidth: number;
  srcHeight: number;
  dstWidth: number;
  dstHeight: number;
  frameIndex: number;

  supportedStereoscopeModes: CanvasStereoscopicMode[];
  stereoscopeMode: CanvasStereoscopicMode;
  stereoscopeStrength: number;

  constructor (parent: Element, width: number, height: number, options?: {}) {}

  abstract setCanvasSize(width: number, height: number): void

  abstract setNote(note: FlipnoteParserBase): void

  abstract clear(color?: [number, number, number, number]): void

  abstract drawFrame(frameIndex: number): void

  abstract requestStereoScopeMode(mode: CanvasStereoscopicMode): void;

  abstract forceUpdate(): void;

  abstract getDataUrl(type?: string, quality?: any): string

  abstract getBlob(type?: string, quality?: any): Promise<Blob>

  abstract destroy(): void
}