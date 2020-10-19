// Main entrypoint for web

import {
  parseSource as _parseSource,
  Flipnote as _Flipnote,
  FlipnoteMeta as _FlipnoteMeta,
  FlipnoteAudioTrack as _FlipnoteAudioTrack,
  KwzFile as _KwzFile,
  PpmFile as _PpmFile,
} from './parsers';

import {
  Player as _Player
} from './player';

import {
  GifEncoder as _GifEncoder,
  WavEncoder as _WavEncoder,
  // bitmap encoder is deprecated in favor of gif
  // BitmapEncoder
} from './encoders';

namespace api {
  export const version = VERSION; // replaced by @rollup/plugin-replace; see rollup.config.js

  export type Flipnpte = _Flipnote;
  export type FlipnoteMeta = _FlipnoteMeta;
  export type FlipnoteAudioTrack = _FlipnoteAudioTrack;
  
  export const Player = _Player;
  export const parseSource = _parseSource;
  export const KwzFile = _KwzFile;
  export const PpmFile = _PpmFile;
  export const GifEncoder = _GifEncoder;
  export const WavEncoder = _WavEncoder;

  // legacy
  export const player = _Player;
  export const kwzParser = _KwzFile;
  export const ppmParser = _PpmFile;
  export const gifEncoder = _GifEncoder;
  export const wavEncoder = _WavEncoder;
}

export default api;

export const version = VERSION;

export type Flipnpte = _Flipnote;
export type FlipnoteMeta = _FlipnoteMeta;
export type FlipnoteAudioTrack = _FlipnoteAudioTrack;

export const Player = _Player;
export const parseSource = _parseSource;
export const KwzFile = _KwzFile;
export const PpmFile = _PpmFile;
export const GifEncoder = _GifEncoder;
export const WavEncoder = _WavEncoder;

// legacy
export const player = _Player;
export const kwzParser = _KwzFile;
export const ppmParser = _PpmFile;
export const gifEncoder = _GifEncoder;
export const wavEncoder = _WavEncoder;