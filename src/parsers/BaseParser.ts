import {
  type FlipnoteMeta,
  type FlipnoteThumbImage,
  type FlipnotePaletteColor,
  type FlipnotePaletteDefinition,
  type FlipnoteLayerVisibility,
  type FlipnoteAudioTrackInfo,
  type FlipnoteSoundEffectFlags,
  FlipnoteFormat,
  FlipnoteStereoscopicEye,
  FlipnoteAudioTrack,
  FlipnoteSoundEffectTrack,
} from './types';

import {
  DataStream,
  assertRange,
} from '../utils';

/** 
 * Base Flipnote parser class
 * 
 * This doesn't implement any parsing functionality itself, 
 * it just provides a consistent API for every format parser to implement.
 * @group File Parser
*/
export abstract class BaseParser extends DataStream {

  /**
   * Static file format info
   */

  /**
   * File format type.
   * @group Meta
   */
  static format: FlipnoteFormat;
  /**
   * Animation frame width.
   * @group Image
   */
  static width: number;
  /**
   * Animation frame height.
   * @group Image
   */
  static height: number;
  /**
   * Animation frame aspect ratio (height / width).
   * @group Image
   */
  static aspect: number;
  /**
   * Number of animation frame layers.
   * @group Image
   */
  static numLayers: number;
  /**
   * Number of colors per layer (aside from transparent).
   * @group Image
   */
  static numLayerColors: number;
  /**
   * Which audio tracks are available in this format.
   * @group Audio
   */
  static audioTracks: FlipnoteAudioTrack[];
  /**
   * Which sound effect tracks are available in this format.
   * @group Audio
   */
  static soundEffectTracks: FlipnoteSoundEffectTrack[];
  /**
   * Audio track base sample rate.
   * @group Audio
   */
  static rawSampleRate: number;
  /**
   * Audio output sample rate.
   * @group Audio
   */
  static sampleRate: number;
  /**
   * Global animation frame color palette.
   * @group Image
   */
  static globalPalette: FlipnotePaletteColor[];
  /**
   * Key used for Flipnote verification, in PEM format.
   * @group Verification
   */
  static publicKey: string;

  /**
   * Instance file format info
   */

  /**
   * Custom object tag
   */
  [Symbol.toStringTag] = 'Flipnote';
  /**
   * File format type, reflects {@link BaseParser.format}.
   * @group Meta
   */
  format: FlipnoteFormat;
  /**
   * Default formats used for {@link getTitle}.
   * @group Meta
   */
  titleFormats = {
    COMMENT: 'Comment by $USERNAME',
    FLIPNOTE: 'Flipnote by $USERNAME',
    ICON: 'Folder icon'
  };
  /**
   * Animation frame width, reflects {@link BaseParser.width}.
   * @group Image
   */
  imageWidth: number;
  /**
   * Animation frame height, reflects {@link BaseParser.height}
   * @group Image
   */
  imageHeight: number;
  /**
   * Animation frame aspect ratio (height / width), reflects {@link BaseParser.aspect}.
   * @group Image
   */
  aspect: number;
  /**
   * X offset for the top-left corner of the animation frame.
   * @group Image
   */
  imageOffsetX: number;
  /**
   * Y offset for the top-left corner of the animation frame.
   * @group Image
   */
  imageOffsetY: number;
  /**
   * Number of animation frame layers, reflects {@link BaseParser.numLayers}.
   * @group Image
   */
  numLayers: number;
  /**
   * Number of colors per layer (aside from transparent), reflects {@link BaseParser.numLayerColors}.
   * @group Image
   */
  numLayerColors: number;
  /**
   * @internal
   */
  srcWidth: number;
  /**
   * Which audio tracks are available in this format, reflects {@link BaseParser.audioTracks}.
   * @group Audio
   */
  audioTracks: FlipnoteAudioTrack[];
  /**
   * Which sound effect tracks are available in this format, reflects {@link BaseParser.soundEffectTracks}.
   * @group Audio
   */
  soundEffectTracks: FlipnoteSoundEffectTrack[];
  /**
   * Audio track base sample rate, reflects {@link BaseParser.rawSampleRate}.
   * @group Audio
   */
  rawSampleRate: number;
  /**
   * Audio output sample rate, reflects {@link BaseParser.sampleRate}.
   * @group Audio
   */
  sampleRate: number;
  /**
   * Global animation frame color palette, reflects {@link BaseParser.globalPalette}.
   * @group Image
   */
  globalPalette: FlipnotePaletteColor[];
  /**
   * Flipnote palette.
   * @group Image
   */
  palette: FlipnotePaletteDefinition;
  /**
   * File metadata, see {@link FlipnoteMeta} for structure.
   * @group Meta
   */
  meta: FlipnoteMeta;
  /**
   * File audio track info, see {@link FlipnoteAudioTrackInfo}.
   * @group Meta
   */
  soundMeta: Map<FlipnoteAudioTrack, FlipnoteAudioTrackInfo> = new Map();
  /**
   * Animation frame global layer visibility.
   * @group Image
   */
  layerVisibility: FlipnoteLayerVisibility = {1: true, 2: true, 3: true};
  /**
   * key used for Flipnote verification, in PEM format.
   * @group Verification
   */
  publicKey: string;

  /**
   * Spinoffs are remixes of another user's Flipnote.
   * @group Meta
   */
  isSpinoff: boolean;
  /**
   * (KWZ only) Indicates whether or not this file is a Flipnote Studio 3D folder icon.
   * @group Meta
   */
  isFolderIcon: boolean = false;
  /**
   * (KWZ only) Indicates whether or not this file is a handwritten comment from Flipnote Gallery World.
   * @group Meta
   */
  isComment: boolean = false;
  /**
   * (KWZ only) Indicates whether or not this Flipnote is a PPM to KWZ conversion from Flipnote Studio 3D's DSi Library service.
   * @group Meta
   */
  isDsiLibraryNote: boolean = false;
  /**
   * Animation frame count.
   * @group Image
   */
  frameCount: number;
  /**
   * In-app animation playback speed.
   * @group Image
   */
  frameSpeed: number;
  /**
   * Animation duration, in seconds.
   * @group Image
   */
  duration: number;
  /**
   * In-app animation playback speed when the BGM track was recorded.
   * @group Image
   */
  bgmSpeed: number;
  /**
   * Animation framerate, measured as frames per second.
   * @group Image
   */
  framerate: number;
  /**
   * Animation framerate when the BGM track was recorded, measured as frames per second.
   * @group Audio
   */
  bgmrate: number;
  /**
   * Index of the animation frame used as the Flipnote's thumbnail image.
   * @group Image
   */
  thumbFrameIndex: number;
  /**
   * Get the amount of clipping in the master audio track, useful for determining if a Flipnote's audio is corrupted. Closer to 1.0 = more clipping. Only available after {@link getAudioMasterPcm} has been called.
   * @group Audio
   */
  audioClipRatio: number;

  /**
   * Get file default title - e.g. "Flipnote by Y", "Comment by X", etc. 
   * A format object can be passed for localization, where `$USERNAME` gets replaced by author name:
   * ```js
   * {
   *  COMMENT: 'Comment by $USERNAME',
   *  FLIPNOTE: 'Flipnote by $USERNAME',
   *  ICON: 'Folder icon'
   * }
   * ```
   * @group Meta
   */
  getTitle(formats = this.titleFormats) {
    if (this.isFolderIcon)
      return formats.ICON;
    const title = this.isComment ? formats.COMMENT : formats.FLIPNOTE;
    return title.replace('$USERNAME', this.meta.current.username);
  }

  /**
   * Returns the Flipnote title when casting a parser instance to a string.
   * 
   * ```js
   * const str = 'Title: ' + note;
   * // str === 'Title: Flipnote by username'
   * ```
   * @group Utility
   */
  toString() {
    return this.getTitle();
  }

  /**
   * Allows for frame index iteration when using the parser instance as a for..of iterator.
   * 
   * ```js
   * for (const frameIndex of note) {
   *   // do something with frameIndex...
   * }
   * ```
   * @group Utility
   */
  *[Symbol.iterator]() {
    for (let i = 0; i < this.frameCount; i++)
      yield i;
  }

  /**
   * Decodes the thumbnail image embedded in the Flipnote. Will return a {@link FlipnoteThumbImage} containing JPEG or raw RGBA data depending on the format.
   * 
   * Note: For most purposes, you should probably just decode the thumbnail frame instead, to get a higher resolution image.
   * @group Meta
   */
  abstract getThumbnailImage(): FlipnoteThumbImage;

  /** 
   * Decode a frame, returning the raw pixel buffers for each layer.
   * @group Image
  */
  abstract decodeFrame(frameIndex: number): Uint8Array[];

  /** 
   * Get the pixels for a given frame layer, as palette indices
   * NOTE: layerIndex are not guaranteed to be sorted by 3D depth in KWZs, use {@link getFrameLayerOrder} to get the correct sort order first
   * NOTE: if the visibility flag for this layer is turned off, the result will be empty
   * @group Image
  */
  getLayerPixels(
    frameIndex: number,
    layerIndex: number,
    imageBuffer = new Uint8Array(this.imageWidth * this.imageHeight),
    depthStrength = 0,
    depthEye: FlipnoteStereoscopicEye = FlipnoteStereoscopicEye.Left,
  ) {
    assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
    assertRange(layerIndex, 0, this.numLayers - 1, 'Layer index');
    // palette
    const palette = this.getFramePaletteIndices(frameIndex);
    const palettePtr = layerIndex * this.numLayerColors;
    // raw pixels
    const layers = this.decodeFrame(frameIndex);
    const layerBuffer = layers[layerIndex];
    const depth = Math.floor(this.getFrameLayerDepths(frameIndex)[layerIndex] * depthStrength);
    const depthShift = ((depthEye == FlipnoteStereoscopicEye.Left) ? -depth : depth);
    // image dimensions and crop
    const srcStride = this.srcWidth;
    const dstStride = this.imageWidth;
    const width = this.imageWidth;
    const height = this.imageHeight;
    const xOffs = this.imageOffsetX;
    const yOffs = this.imageOffsetY;
    // clear image buffer before writing
    imageBuffer.fill(0);
    // handle layer visibility by returning a blank image if the layer is invisible
    if (!this.layerVisibility[layerIndex + 1])
      return imageBuffer;
    // convert to palette indices and crop
    for (let srcY = yOffs, dstY = 0; dstY < height; srcY++, dstY++) {
      for (let srcX = xOffs, dstX = 0; dstX < width; srcX++, dstX++) {
        const srcPtr = srcY * srcStride + srcX;
        const dstPtr = dstY * dstStride + dstX + depthShift;
        let pixel = layerBuffer[srcPtr];
        if (pixel !== 0)
          imageBuffer[dstPtr] = palette[palettePtr + pixel];
      }
    }
    return imageBuffer;
  }

  /** 
   * Get the pixels for a given frame layer, as RGBA pixels
   * NOTE: layerIndex are not guaranteed to be sorted by 3D depth in KWZs, use {@link getFrameLayerOrder} to get the correct sort order first
   * NOTE: if the visibility flag for this layer is turned off, the result will be empty
   * @group Image
  */
  getLayerPixelsRgba(
    frameIndex: number,
    layerIndex: number,
    imageBuffer = new Uint32Array(this.imageWidth * this.imageHeight),
    paletteBuffer = new Uint32Array(16),
    depthStrength = 0,
    depthEye: FlipnoteStereoscopicEye = FlipnoteStereoscopicEye.Left,
  ) {
    assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
    assertRange(layerIndex, 0, this.numLayers - 1, 'Layer index');
    // palette
    this.getFramePaletteUint32(frameIndex, paletteBuffer);
    const palettePtr = layerIndex * this.numLayerColors;
    // raw pixels
    const layers = this.decodeFrame(frameIndex);
    const layerBuffer = layers[layerIndex];
    // depths
    const depth = Math.floor(this.getFrameLayerDepths(frameIndex)[layerIndex] * depthStrength);
    const depthShift = ((depthEye == FlipnoteStereoscopicEye.Left) ? -depth : depth)
    // image dimensions and crop
    const srcStride = this.srcWidth;
    const dstStride = this.imageWidth;
    const width = this.imageWidth - depth;
    const height = this.imageHeight;
    const xOffs = this.imageOffsetX;
    const yOffs = this.imageOffsetY;
    // clear image buffer before writing
    imageBuffer.fill(0);
    // handle layer visibility by returning a blank image if the layer is invisible
    if (!this.layerVisibility[layerIndex + 1])
      return imageBuffer;
    // convert to palette indices and crop
    for (let srcY = yOffs, dstY = 0; dstY < height; srcY++, dstY++) {
      for (let srcX = xOffs, dstX = 0; dstX < width; srcX++, dstX++) {
        const srcPtr = srcY * srcStride + srcX;
        const dstPtr = dstY * dstStride + dstX + depthShift;
        let pixel = layerBuffer[srcPtr];
        if (pixel !== 0)
          imageBuffer[dstPtr] = paletteBuffer[palettePtr + pixel];
      }
    }
    return imageBuffer;
  }

  /**
   * Determines if a given frame is a video key frame or not. This returns an array of booleans for each layer, since keyframe encoding is done on a per-layer basis.
   * @param frameIndex
   * @group Image
  */
  abstract getIsKeyFrame(frameIndex: number): boolean[];

  /**
   * Get the 3D depths for each layer in a given frame.
   * @param frameIndex
   * @group Image
  */
  abstract getFrameLayerDepths(frameIndex: number): number[];

  /**
   * Get the FSID for a given frame's original author.
   * @param frameIndex
   * @group Meta
   */
  abstract getFrameAuthor(frameIndex: number): string;

  /** 
   * Get the camera flags for a given frame, if there are any
   * @group Image
   * @returns Array of booleans, indicating whether each layer uses a photo or not
  */
  abstract getFrameCameraFlags(frameIndex: number): boolean[];

  /** 
   * Get the layer draw order for a given frame
   * @group Image
  */
  abstract getFrameLayerOrder(frameIndex: number): number[];

  /** 
   * Get the image for a given frame, as palette indices
   * @group Image
  */
  getFramePixels(
    frameIndex: number,
    imageBuffer = new Uint8Array(this.imageWidth * this.imageHeight),
    depthStrength = 0,
    depthEye: FlipnoteStereoscopicEye = FlipnoteStereoscopicEye.Left,
  ) {
    // image dimensions and crop
    const srcStride = this.srcWidth;
    const dstStride = this.imageWidth;
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
    const layerDepth = this.getFrameLayerDepths(frameIndex);
    const layers = this.decodeFrame(frameIndex);
    // merge layers into framebuffer
    for (let i = 0; i < this.numLayers; i++) {
      const layerIndex = layerOrder[i];
      const layerBuffer = layers[layerIndex];
      const palettePtr = layerIndex * this.numLayerColors;
      const depth = Math.floor(layerDepth[layerIndex] * depthStrength);
      const depthShift = ((depthEye == FlipnoteStereoscopicEye.Left) ? -depth : depth);
      // skip if layer is not visible
      if (!this.layerVisibility[layerIndex + 1])
        continue;
      // merge layer into rgb buffer
      for (let srcY = yOffs, dstY = 0; dstY < height; srcY++, dstY++) {
        for (let srcX = xOffs, dstX = 0; dstX < width; srcX++, dstX++) {
          const srcPtr = srcY * srcStride + srcX;
          const dstPtr = dstY * width + dstX + depthShift;
          let pixel = layerBuffer[srcPtr];
          if (pixel !== 0)
            imageBuffer[dstPtr] = palette[palettePtr + pixel];
        }
      }
    }
    return imageBuffer;
  }


  /**
   * Get the image for a given frame as an uint32 array of RGBA pixels
   * @group Image
   */
  getFramePixelsRgba(
    frameIndex: number,
    imageBuffer = new Uint32Array(this.imageWidth * this.imageHeight),
    paletteBuffer = new Uint32Array(16),
    depthStrength = 0,
    depthEye: FlipnoteStereoscopicEye = FlipnoteStereoscopicEye.Left,
  ) {
    assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
    // image dimensions and crop
    const srcStride = this.srcWidth;
    const dstStride = this.imageWidth;
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
    const layerDepth = this.getFrameLayerDepths(frameIndex);
    const layers = this.decodeFrame(frameIndex);
    // merge layers into framebuffer
    for (let i = 0; i < this.numLayers; i++) {
      const layerIndex = layerOrder[i];
      
      // skip if layer is not visible
      if (!this.layerVisibility[layerIndex + 1])
        continue;
        
      const layerBuffer = layers[layerIndex];
      const palettePtr = layerIndex * this.numLayerColors;
      const depth = Math.floor(layerDepth[layerIndex] * depthStrength);
      const depthShift = ((depthEye == FlipnoteStereoscopicEye.Left) ? -depth : depth);

      for (let srcY = yOffs, dstY = 0; srcY < height; srcY++, dstY++) {
        for (let srcX = xOffs, dstX = 0; srcX < width; srcX++, dstX++) {
          const srcPtr = srcY * srcStride + srcX;
          const dstPtr = dstY * dstStride + dstX + depthShift;
          let pixel = layerBuffer[srcPtr];
          if (pixel !== 0)
            imageBuffer[dstPtr] = paletteBuffer[palettePtr + pixel];
        }
      }
    }
    return imageBuffer;
  }

  /** 
   * Get the color palette indices for a given frame. RGBA colors for these values can be indexed from {@link BaseParser.globalPalette}
   * @group Image
  */
  abstract getFramePaletteIndices(frameIndex: number): number[];
  
  /** 
   * Get the color palette for a given frame, as a list of `[r,g,b,a]` colors
   * @group Image
  */
  abstract getFramePalette(frameIndex: number): FlipnotePaletteColor[];

  /** 
   * Get the color palette for a given frame, as an uint32 array
   * @group Image
  */
  getFramePaletteUint32(
    frameIndex: number,
    paletteBuffer = new Uint32Array(16)
  ) {
    assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
    const colors = this.getFramePalette(frameIndex);
    paletteBuffer.fill(0);
    colors.forEach(([r, g, b, a], i) => paletteBuffer[i] = (a << 24) | (b << 16) | (g << 8) | r);
    return paletteBuffer;
  }

  /** 
   * Get the sound effect flags for every frame in the Flipnote
   * @group Audio
  */
  abstract decodeSoundFlags(): boolean[][];

  /**
   * Get the sound effect usage flags for every frame
   * @group Audio
   */
  abstract getSoundEffectFlags(): FlipnoteSoundEffectFlags[];

  /**
   * Get the sound effect usage flags for a given frame
   * @group Audio
   */
  abstract getFrameSoundEffectFlags(frameIndex: number): FlipnoteSoundEffectFlags;

  /**
   * Get the usage flags for a given track across every frame
   * @returns an array of booleans for every frame, indicating whether the track is used on that frame
   * @group Audio
   */
  getSoundEffectFlagsForTrack(trackId: FlipnoteSoundEffectTrack) {
    return this.getSoundEffectFlags().map(flags => flags[trackId]);
  };

  /**
   * Is a given track used on a given frame
   * @group Audio
   */
  isSoundEffectUsedOnFrame(trackId: FlipnoteSoundEffectTrack, frameIndex: number) {
    assertRange(frameIndex, 0, this.frameCount - 1, 'Frame index');
    if (!this.soundEffectTracks.includes(trackId))
      return false;
    return this.getFrameSoundEffectFlags(frameIndex)[trackId];
  }

  /** 
   * Does an audio track exist in the Flipnote?
   * @returns boolean
   * @group Audio
  */
  hasAudioTrack(trackId: FlipnoteAudioTrack): boolean {
    return this.soundMeta.has(trackId) && this.soundMeta.get(trackId).length > 0;
  }

  /** 
   * Get the raw compressed audio data for a given track
   * @returns byte array
   * @group Audio
  */
  abstract getAudioTrackRaw(trackId: FlipnoteAudioTrack): Uint8Array;

  /** 
   * Get the decoded audio data for a given track, using the track's native samplerate
   * @returns Signed 16-bit PCM audio
   * @group Audio
  */
  abstract decodeAudioTrack(trackId: FlipnoteAudioTrack): Int16Array;

  /** 
   * Get the decoded audio data for a given track, using the specified samplerate
   * @returns Signed 16-bit PCM audio
   * @group Audio
  */
  abstract getAudioTrackPcm(trackId: FlipnoteAudioTrack, sampleRate?: number): Int16Array;

  /** 
   * Get the full mixed audio for the Flipnote, using the specified samplerate
   * @returns Signed 16-bit PCM audio
   * @group Audio
  */
  abstract getAudioMasterPcm(sampleRate?: number): Int16Array;

  /**
   * Get the body of the Flipnote - the data that is digested for computing the signature
   * @returns content data as Uint8Array
   * @group Verification
   */
  abstract getBody(): Uint8Array;

  /**
   * Get the Flipnote's signature data
   * @returns signature data as Uint8Array
   * @group Verification
   */
  abstract getSignature(): Uint8Array;

  /**
   * Verify whether this Flipnote's signature is valid
   * @async
   * @returns boolean
   * @group Verification
   */
  abstract verify(): Promise<boolean>;
}