import { DataStream } from '../utils/index';

export type PaletteColor = [number, number, number]; // r, g, b

export type PaletteDefinition = {
  [key in any]?: PaletteColor;
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
  static globalPalette: PaletteColor[];

  public type: string
  public width: number;
  public height: number;
  public palette: PaletteDefinition;
  public globalPalette: PaletteColor[];

  public meta: any;
  public soundMeta: FlipnoteAudioTrackInfo;

  public frameCount: number;
  public frameSpeed: number;
  public bgmSpeed: number;
  public framerate: number;
  public bgmrate: number;
  public sampleRate: number;
  public thumbFrameIndex: number;

  abstract decodeFrame(frameIndex: number): Uint8Array[];

  abstract getLayerPixels(frameIndex: number, layerIndex: number): Uint8Array | Uint16Array;

  abstract getLayerOrder(frameIndex: number): number[];

  abstract getFramePixels(frameIndex: number): Uint8Array;

  abstract getFramePaletteIndices(frameIndex: number): number[];
  
  abstract getFramePalette(frameIndex: number): PaletteColor[];

  abstract decodeAudio(trackId: FlipnoteAudioTrack): Int16Array;

  abstract decodeSoundFlags(): number[][];

  public hasAudioTrack(trackId: FlipnoteAudioTrack): boolean {
    if (this.soundMeta.hasOwnProperty(trackId) && this.soundMeta[trackId].length > 0) {
      return true;
    } 
    return false;
  }

  public getInt16AudioData(trackId: FlipnoteAudioTrack) {
    return this.decodeAudio(trackId);
  }

  public getFloat32AudioData(trackId: FlipnoteAudioTrack) {
    const pcm16 = this.decodeAudio(trackId);
    const outbuffer = new Float32Array(pcm16.length);
    for (let i = 0; i < pcm16.length; i++) {
      outbuffer[i] = pcm16[i] / 32767;
    }
    return outbuffer;
  }
}