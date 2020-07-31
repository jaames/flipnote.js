import { DataStream } from '../utils/index';

export type FlipnotePaletteColor = [number, number, number, number]; // r, g, b, a

export type FlipnotePaletteDefinition = {
  [key in any]?: FlipnotePaletteColor;
};

export enum FlipnoteAudioTrack {
  BGM,
  SE1,
  SE2,
  SE3,
  SE4
};

export type FlipnoteAudioTrackInfo = {
  [key in FlipnoteAudioTrack]?: {
    offset: number,
    length: number
  }
}

export abstract class FlipnoteParserBase extends DataStream {

  static type: string;
  static sampleRate: number;
  static width: number;
  static height: number;
  static globalPalette: FlipnotePaletteColor[];

  public type: string
  public width: number;
  public height: number;
  public palette: FlipnotePaletteDefinition;
  public globalPalette: FlipnotePaletteColor[];

  public meta: any;
  public soundMeta: FlipnoteAudioTrackInfo;

  public frameCount: number;
  public frameSpeed: number;
  public bgmSpeed: number;
  public framerate: number;
  public bgmrate: number;
  public rawSampleRate: number;
  public sampleRate: number;
  public thumbFrameIndex: number;

  abstract decodeFrame(frameIndex: number): Uint8Array[];

  abstract getLayerPixels(frameIndex: number, layerIndex: number): Uint8Array;

  abstract getFrameLayerOrder(frameIndex: number): number[];

  abstract getFramePixels(frameIndex: number): Uint8Array;

  abstract getFramePaletteIndices(frameIndex: number): number[];
  
  abstract getFramePalette(frameIndex: number): FlipnotePaletteColor[];

  abstract decodeSoundFlags(): boolean[][];

  // Get raw audio data as bytes
  abstract getAudioTrackRaw(trackId: FlipnoteAudioTrack): Uint8Array;

  abstract decodeAudioTrack(trackId: FlipnoteAudioTrack): Int16Array;

  // Get track audio as a standard int16 PCM buffer, at specified sample rate
  abstract getAudioTrackPcm(trackId: FlipnoteAudioTrack, sampleRate?: number): Int16Array;

  // Get the merged master audio for this note, as int16 PCM buffer at specified sample rate
  abstract getAudioMasterPcm(sampleRate?: number): Int16Array;

  public hasAudioTrack(trackId: FlipnoteAudioTrack): boolean {
    if (this.soundMeta.hasOwnProperty(trackId) && this.soundMeta[trackId].length > 0) {
      return true;
    } 
    return false;
  }
}