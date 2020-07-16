// Stripped down entrypoint for Node that only contains parsers + encoders

import {
  parseSource as _parseSource,
  Flipnote as _Flipnote,
  FlipnoteMeta as _FlipnoteMeta,
  FlipnoteAudioTrack as _FlipnoteAudioTrack,
  KwzParser,
  PpmParser,
} from './parsers/index';

import {
  GifEncoder,
  WavEncoder,
  // bitmap encoder is deprecated in favor of gif
  // BitmapEncoder
} from './encoders/index';

namespace api {
  export const version = VERSION; // replaced by @rollup/plugin-replace; see rollup.config.js

  export type Flipnpte = _Flipnote;
  export type FlipnoteMeta = _FlipnoteMeta;
  export type FlipnoteAudioTrack = _FlipnoteAudioTrack;
  
  export const parseSource = _parseSource;
  export const kwzParser = KwzParser;
  export const ppmParser = PpmParser;
  export const gifEncoder = GifEncoder;
  export const wavEncoder = WavEncoder;
}

export default api;

export const version = VERSION;

export type Flipnpte = _Flipnote;
export type FlipnoteMeta = _FlipnoteMeta;
export type FlipnoteAudioTrack = _FlipnoteAudioTrack;

export const parseSource = _parseSource;
export const kwzParser = KwzParser;
export const ppmParser = PpmParser;
export const gifEncoder = GifEncoder;
export const wavEncoder = WavEncoder;