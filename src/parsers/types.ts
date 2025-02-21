/**
 * Flipnote details
 */
export interface FlipnoteMeta {
  /**
   * File lock state. Locked Flipnotes cannot be edited by anyone other than the current author
   */
  lock: boolean;
  /**
   * Playback loop state. If `true`, playback will loop once the end is reached
   */
  loop: boolean;
  /**
   * If `true`, the Flipnote was created using the "Advanced" toolset. This is only used by KWZ files.
   */
  advancedTools: boolean | undefined;
  /**
   * Spinoffs are remixes of another user's Flipnote
   */
  isSpinoff: boolean;
  /**
   * Total number of animation frames
   */
  frameCount: number;
  /**
   * In-app frame playback speed
   */
  frameSpeed: number;
  /**
   * Index of the animation frame used as the Flipnote's thumbnail image
   */
  thumbIndex: number;
  /**
   * Date representing when the file was last edited
   */
  timestamp: Date;
  /**
   * Flipnote duration measured in seconds, assuming normal playback speed
   */
  duration: number;
  /**
   * Metadata about the author of the original Flipnote file
   */
  root: FlipnoteVersion;
  /**
   * Metadata about the previous author of the Flipnote file
   */
  parent: FlipnoteVersion;
  /**
   * Metadata about the current author of the Flipnote file
   */
  current: FlipnoteVersion;
};

/**
 * Flipnote version info - provides details about a particular Flipnote version and its author
 */
export interface FlipnoteVersion {
  /**
   * Flipnote unique filename
   */
  filename: string;
  /**
   * Author's username
   */
  username: string;
  /**
   * Author's unique Flipnote Studio ID, formatted in the same way that it would appear on the app's settings screen
   */
  fsid: string;
  /**
   * Author's region
   */
  region: FlipnoteRegion;
  /**
   * KWZ only - sometimes DSi library notes incorrectly use the PPM filename format instead
   */
  isDsiFilename?: boolean;
};

/**
 * Flipnote region
 */
export enum FlipnoteRegion {
  /**
   * Europe and Oceania
   */
  EUR = 'EUR',
  /**
   * Americas
   */
  USA = 'USA',
  /**
   * Japan
   */
  JPN = 'JPN',
  /**
   * Unidentified (possibly never used)
   */
  UNKNOWN = 'UNKNOWN'
};

/**
 * Identifies which animation format a Flipnote uses
 */
export enum FlipnoteFormat {
  /**
   * Animation format used by Flipnote Studio (Nintendo DSiWare)
   */
  PPM = 'PPM',
  /**
   * Animation format used by Flipnote Studio 3D (Nintendo 3DS)
   */
  KWZ = 'KWZ'
};

/**
 * Buffer format for a FlipnoteThumbImage 
 */
export enum FlipnoteThumbImageFormat {
  Jpeg,
  Rgba
};

/**
 * Represents a decoded Flipnote thumbnail image
 */
export type FlipnoteThumbImage = {
  /**
   * 
   */
  format: FlipnoteThumbImageFormat,
  /**
   * Image width in pixels
   */
  width: number,
  /**
   * Image height in pixels
   */
  height: number,
  /**
   * Image data
   */
  data: ArrayBuffer
};

/**
 * RGBA color
 */
export type FlipnotePaletteColor = [
  /**
   * Red (0 to 255)
   */
  number,
  /**
   * Green (0 to 255)
   */
  number,
  /**
   * Blue (0 to 255)
   */
  number,
  /**
   * Alpha (0 to 255)
   */
  number
];

/**
 * Defines the colors used for a given Flipnote format
 */
export type FlipnotePaletteDefinition = Record<string, FlipnotePaletteColor>;

/**
 * Flipnote layer visibility
 */
export type FlipnoteLayerVisibility = Record<number, boolean>;

/**
 * stereoscopic eye view (left/right) for 3D effects
 */
export enum FlipnoteStereoscopicEye {
  Left,
  Right
};

/**
 * Identifies a Flipnote audio track type
 */
export enum FlipnoteAudioTrack {
  /**
   * Background music track
   */
  BGM,
  /**
   * Sound effect 1 track
   */
  SE1,
  /**
   * Sound effect 2 track
   */
  SE2,
  /**
   * Sound effect 3 track
   */
  SE3,
  /**
   * Sound effect 4 track (only used by KWZ files)
   */
  SE4
};

/**
 * Contains data about a given audio track; it's file offset and length
 */
export interface FlipnoteAudioTrackInfo { ptr: number; length: number; };

/**
 * {@link FlipnoteAudioTrack}, but just sound effect tracks
 */
export enum FlipnoteSoundEffectTrack {
  SE1 = FlipnoteAudioTrack.SE1,
  SE2 = FlipnoteAudioTrack.SE2,
  SE3 = FlipnoteAudioTrack.SE3,
  SE4 = FlipnoteAudioTrack.SE4,
};

/**
 * Flipnote sound flags, indicating which sound effect tracks are used on a given frame
 */
export type FlipnoteSoundEffectFlags = Record<FlipnoteSoundEffectTrack, boolean>;