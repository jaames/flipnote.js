import { 
  DataStream,
  FlipnoteRegion
} from '../utils';

export { FlipnoteRegion } from '../utils';

/** Identifies which animation format a Flipnote uses */
export enum FlipnoteFormat {
  /** Animation format used by Flipnote Studio (Nintendo DSiWare) */
  PPM = 'PPM',
  /** Animation format used by Flipnote Studio 3D (Nintendo 3DS) */
  KWZ = 'KWZ'
};

/** RGBA color */
export type FlipnotePaletteColor = [
  /** Red (0 to 255) */
  number,
  /** Green (0 to 255) */
  number,
  /** Blue (0 to 255) */
  number,
  /** Alpha (0 to 255) */
  number
];

/** Defines the colors used for a given Flipnote format */
export type FlipnotePaletteDefinition = Record<string, FlipnotePaletteColor>;

/** Identifies a Flipnote audio track type */
export enum FlipnoteAudioTrack {
  /** Background music track */
  BGM,
  /** Sound effect 1 track */
  SE1,
  /** Sound effect 2 track */
  SE2,
  /** Sound effect 3 track */
  SE3,
  /** Sound effect 4 track (only used by KWZ files) */
  SE4
};

/** 
 * Contains data about a given audio track; it's file offset and length
 */
export interface FlipnoteAudioTrackInfo {
  ptr: number;
  length: number;
};

/**
 * Flipnote layer visibility 
 */
export type FlipnoteLayerVisibility = Record<number, boolean>;

/**
 * Flipnote version info - provides details about a particular Flipnote version and its author
 */
export interface FlipnoteVersion {
  /** Flipnote unique filename */
  filename: string;
  /** Author's username */
  username: string;
  /** Author's unique Flipnote Studio ID, formatted in the same way that it would appear on the app's settings screen */
  fsid: string;
  /** Author's region */
  region: FlipnoteRegion;
  /** KWZ only - sometimes DSi library notes incorrectly use the PPM filename format instead */
  isDsiFilename?: boolean;
};

/**
 * Flipnote details
 */
export interface FlipnoteMeta {
  /** File lock state. Locked Flipnotes cannot be edited by anyone other than the current author */
  lock: boolean;
  /** Playback loop state. If `true`, playback will loop once the end is reached */
  loop: boolean;
  /** Spinoffs are remixes of another user's Flipnote */
  isSpinoff: boolean;
  /** Total number of animation frames */
  frameCount: number;
  /** In-app frame playback speed */
  frameSpeed: number;
  /** Index of the animation frame used as the Flipnote's thumbnail image */
  thumbIndex: number;
  /** Date representing when the file was last edited */
  timestamp: Date;
  /** Flipnote duration measured in seconds, assuming normal playback speed */
  duration: number;
  /** Metadata about the author of the original Flipnote file */
  root: FlipnoteVersion;
  /** Metadata about the previous author of the Flipnote file */
  parent: FlipnoteVersion;
  /** Metadata about the current author of the Flipnote file */
  current: FlipnoteVersion;
};

/** 
 * Base Flipnote parser class
 * 
 * This doesn't implement any parsing functionality itself, 
 * it just provides a consistent API for every format parser to implement.
 * @category File Parser
*/
export abstract class FlipnoteParser extends DataStream {

  /** File format type */
  static format: FlipnoteFormat;
  /** Animation frame width */
  static frameWidth: number;
  /** Animation frame height */
  static frameHeight: number;
  /** Number of animation frame layers */
  static numLayers: number;
  /** Number of colors per layer (aside from transparent) */
  static numLayerColors: number;
  /** Audio track base sample rate */
  static rawSampleRate: number;
  /** Audio output sample rate */
  static sampleRate: number;
  /** Global animation frame color palette */
  static globalPalette: FlipnotePaletteColor[];
  /** File format type, reflects {@link FlipnoteParserBase.format} */
  public format: FlipnoteFormat;
  /** Animation frame width, reflects {@link FlipnoteParserBase.width} */
  public imageWidth: number;
  /** Animation frame height, reflects {@link FlipnoteParserBase.height} */
  public imageHeight: number;
  /** X offset for the top-left corner of the animation frame */
  public imageOffsetX: number;
  /** Y offset for the top-left corner of the animation frame */
  public imageOffsetY: number;
  /** Number of animation frame layers, reflects {@link FlipnoteParserBase.numLayers} */
  public numLayers: number;
  /** Number of colors per layer (aside from transparent), reflects {@link FlipnoteParserBase.numLayerColors} */
  public numLayerColors: number;
  /** @internal */
  public srcWidth: number;
  /** Audio track base sample rate, reflects {@link FlipnoteParserBase.rawSampleRate} */
  public rawSampleRate: number;
  /** Audio output sample rate, reflects {@link FlipnoteParserBase.sampleRate} */
  public sampleRate: number;
  /** Global animation frame color palette, reflects {@link FlipnoteParserBase.globalPalette} */
  public globalPalette: FlipnotePaletteColor[];
  /** Flipnote palette */
  public palette: FlipnotePaletteDefinition;
  /** File metadata, see {@link FlipnoteMeta} for structure */
  public meta: FlipnoteMeta;
  /** File audio track info, see {@link FlipnoteAudioTrackInfo} */
  public soundMeta: Map<FlipnoteAudioTrack, FlipnoteAudioTrackInfo>;
  /** Animation frame global layer visibility */
  public layerVisibility: FlipnoteLayerVisibility = {1: true, 2: true, 3: true};

  /** Spinoffs are remixes of another user's Flipnote */
  public isSpinoff: boolean;
  /** (KWZ only) Indicates whether or not this file is a Flipnote Studio 3D folder icon */
  public isFolderIcon: boolean = false;
  /** (KWZ only) Indicates whether or not this file is a handwritten comment from Flipnote Gallery World */
  public isComment: boolean = false;
  /** (KWZ only) Indicates whether or not this Flipnote is a PPM to KWZ conversion from Flipnote Studio 3D's DSi Library service */
  public isDsiLibraryNote: boolean = false;
  /** Animation frame count */
  public frameCount: number;
  /** In-app animation playback speed */
  public frameSpeed: number;
  /** Animation duration, in seconds */
  public duration: number;
  /** In-app animation playback speed when the BGM track was recorded */
  public bgmSpeed: number;
  /** Animation framerate, measured as frames per second */
  public framerate: number;
  /** Animation framerate when the BGM track was recorded, measured as frames per second */
  public bgmrate: number;
  /** Index of the animation frame used as the Flipnote's thumbnail image */
  public thumbFrameIndex: number;

  /** Get the amount of clipping in the master audio track, useful for determining if a Flipnote's audio is corrupted. Closer to 1.0 = more clipping. Only available after {@link getAudioMasterPcm} has been called */
  public audioClipRatio: number;

  /** 
   * Decode a frame, returning the raw pixel buffers for each layer
   * @category Image
  */
  abstract decodeFrame(frameIndex: number): Uint8Array[];

  /** 
   * Get the pixels for a given frame layer
   * @category Image
  */
  public getLayerPixels(
    frameIndex: number,
    layerIndex: number,
    imageBuffer = new Uint8Array(this.imageWidth * this.imageHeight)
  ) {
    // palette
    const palette = this.getFramePaletteIndices(frameIndex);
    const palettePtr = layerIndex * this.numLayerColors;
    // raw pixels
    const layers = this.decodeFrame(frameIndex);
    const layerBuffer = layers[layerIndex];
    // image dimensions and crop
    const srcStride = this.srcWidth;
    const width = this.imageWidth;
    const height = this.imageHeight;
    const xOffs = this.imageOffsetX;
    const yOffs = this.imageOffsetY;
    // clear image buffer before writing
    imageBuffer.fill(0);
    // convert to palette indices and crop
    for (let srcY = yOffs, dstY = 0; dstY < height; srcY++, dstY++) {
      for (let srcX = xOffs, dstX = 0; dstX < width; srcX++, dstX++) {
        const srcPtr = srcY * srcStride + srcX;
        const dstPtr = dstY * width + dstX;
        let pixel = layerBuffer[srcPtr];
        if (pixel !== 0) imageBuffer[dstPtr] = palette[palettePtr + pixel];
      }
    }
    return imageBuffer;
  }

  public getLayerPixelsRgba(
    frameIndex: number,
    layerIndex: number,
    imageBuffer = new Uint32Array(this.imageWidth * this.imageHeight),
    paletteBuffer = new Uint32Array(16)
  ) {
    // palette
    this.getFramePaletteUint32(frameIndex, paletteBuffer);
    const palettePtr = layerIndex * this.numLayerColors;
    // raw pixels
    const layers = this.decodeFrame(frameIndex);
    const layerBuffer = layers[layerIndex];
    // image dimensions and crop
    const srcStride = this.srcWidth;
    const width = this.imageWidth;
    const height = this.imageHeight;
    const xOffs = this.imageOffsetX;
    const yOffs = this.imageOffsetY;
    // clear image buffer before writing
    imageBuffer.fill(paletteBuffer[0]);
    // convert to palette indices and crop
    for (let srcY = yOffs, dstY = 0; dstY < height; srcY++, dstY++) {
      for (let srcX = xOffs, dstX = 0; dstX < width; srcX++, dstX++) {
        const srcPtr = srcY * srcStride + srcX;
        const dstPtr = dstY * width + dstX;
        let pixel = layerBuffer[srcPtr];
        if (pixel !== 0) imageBuffer[dstPtr] = paletteBuffer[palettePtr + pixel];
      }
    }
    return imageBuffer;
  }

  /** 
   * Get the layer draw order for a given frame
   * @category Image
  */
  abstract getFrameLayerOrder(frameIndex: number): number[];

  /** 
   * Get the image for a given frame, as palette indices
   * @category Image
  */
  public getFramePixels(
    frameIndex: number,
    imageBuffer = new Uint8Array(this.imageWidth * this.imageHeight)
  ) {
    // image dimensions and crop
    const srcStride = this.srcWidth;
    const width = this.imageWidth;
    const height = this.imageHeight;
    const xOffs = this.imageOffsetX;
    const yOffs = this.imageOffsetY;
    // palette
    const palette = this.getFramePaletteIndices(frameIndex);
    // clear framebuffer with paper color
    imageBuffer.fill(palette[0]);
    // get layer info + decode into buffers
    const layerOrder = this.getFrameLayerOrder(frameIndex);
    const layers = this.decodeFrame(frameIndex);
    // merge layers into framebuffer
    for (let i = 0; i < this.numLayers; i++) {
      const layerIndex = layerOrder[i];
      const layerBuffer = layers[layerIndex];
      const palettePtr = layerIndex * this.numLayerColors;
      // skip if layer is not visible
      if (!this.layerVisibility[layerIndex + 1])
        continue;
      // merge layer into rgb buffer
      for (let srcY = yOffs, dstY = 0; dstY < height; srcY++, dstY++) {
        for (let srcX = xOffs, dstX = 0; dstX < width; srcX++, dstX++) {
          const srcPtr = srcY * srcStride + srcX;
          const dstPtr = dstY * width + dstX;
          let pixel = layerBuffer[srcPtr];
          if (pixel !== 0) imageBuffer[dstPtr] = palette[palettePtr + pixel];
        }
      }
    }
    return imageBuffer;
  }


  /**
   * Get the image for a given frame as an uint32 array of RGBA pixels
   * @category Image
   */
  public getFramePixelsRgba(
    frameIndex: number,
    imageBuffer = new Uint32Array(this.imageWidth * this.imageHeight),
    paletteBuffer = new Uint32Array(16)
  ) {
    // image dimensions and crop
    const srcStride = this.srcWidth;
    const width = this.imageWidth;
    const height = this.imageHeight;
    const xOffs = this.imageOffsetX;
    const yOffs = this.imageOffsetY;
    // palette
    this.getFramePaletteUint32(frameIndex, paletteBuffer);
    // clear framebuffer with paper color
    imageBuffer.fill(paletteBuffer[0]);
    // get layer info + decode into buffers
    const layerOrder = this.getFrameLayerOrder(frameIndex);
    const layers = this.decodeFrame(frameIndex);
    // merge layers into framebuffer
    for (let i = 0; i < this.numLayers; i++) {
      const layerIndex = layerOrder[i];
      const layerBuffer = layers[layerIndex];
      const palettePtr = layerIndex * this.numLayerColors;
      // skip if layer is not visible
      if (!this.layerVisibility[layerIndex + 1])
        continue;
      // merge layer into rgb buffer
      for (let srcY = yOffs, dstY = 0; dstY < height; srcY++, dstY++) {
        for (let srcX = xOffs, dstX = 0; dstX < width; srcX++, dstX++) {
          const srcPtr = srcY * srcStride + srcX;
          const dstPtr = dstY * width + dstX;
          let pixel = layerBuffer[srcPtr];
          if (pixel !== 0) imageBuffer[dstPtr] = paletteBuffer[palettePtr + pixel];
        }
      }
    }
    return imageBuffer;
  }

  /** 
   * Get the color palette indices for a given frame. RGBA colors for these values can be indexed from {@link FlipnoteParserBase.globalPalette}
   * @category Image
  */
  abstract getFramePaletteIndices(frameIndex: number): number[];
  
  /** 
   * Get the color palette for a given frame, as a list of `[r,g,b,a]` colors
   * @category Image
  */
  abstract getFramePalette(frameIndex: number): FlipnotePaletteColor[];

  /** 
   * Get the color palette for a given frame, as an uint32 array
   * @category Image
  */
  public getFramePaletteUint32(
    frameIndex: number,
    paletteBuffer = new Uint32Array(16)
  ) {
    const colors = this.getFramePalette(frameIndex);
    paletteBuffer.fill(0);
    colors.forEach(([r, g, b, a], i) => paletteBuffer[i] = (a << 24) | (b << 16) | (g << 8) | r);
    return paletteBuffer;
  }

  /** 
   * Get the sound effect flags for every frame in the Flipnote
   * @category Audio
  */
  abstract decodeSoundFlags(): boolean[][];

  /** 
   * Get the raw compressed audio data for a given track
   * @returns byte array
   * @category Audio
  */
  abstract getAudioTrackRaw(trackId: FlipnoteAudioTrack): Uint8Array;

  /** 
   * Get the decoded audio data for a given track, using the track's native samplerate
   * @returns Signed 16-bit PCM audio
   * @category Audio
  */
  abstract decodeAudioTrack(trackId: FlipnoteAudioTrack): Int16Array;

  /** 
   * Get the decoded audio data for a given track, using the specified samplerate
   * @returns Signed 16-bit PCM audio
   * @category Audio
  */
  abstract getAudioTrackPcm(trackId: FlipnoteAudioTrack, sampleRate?: number): Int16Array;

  /** 
   * Get the full mixed audio for the Flipnote, using the specified samplerate
   * @returns Signed 16-bit PCM audio
   * @category Audio
  */
  abstract getAudioMasterPcm(sampleRate?: number): Int16Array;

  /** 
   * Does an audio track exist in the Flipnote?
   * @category Audio
  */
  public hasAudioTrack(trackId: FlipnoteAudioTrack): boolean {
    return this.soundMeta.has(trackId) && this.soundMeta.get(trackId).length > 0;
  }
}