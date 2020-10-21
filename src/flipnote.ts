// Main entrypoint for web

export {
  parseSource,
  Flipnote,
  FlipnoteMeta,
  FlipnoteAudioTrack,
  KwzParser,
  PpmParser,
} from './parsers';

export {
  Player
} from './player';

export {
  GifImage,
  WavAudio,
  // bitmap encoder is deprecated in favor of gif
  // BitmapEncoder
} from './encoders';

// namespace api {
//   export const version = VERSION; // replaced by @rollup/plugin-replace; see rollup.config.js

//   export type Flipnote = _Flipnote;
//   export type FlipnoteMeta = _FlipnoteMeta;
//   export type FlipnoteAudioTrack = _FlipnoteAudioTrack;
  
//   export const Player = _Player;
//   export const parseSource = _parseSource;
//   export const KwzFile = _KwzFile;
//   export const PpmFile = _PpmFile;
//   export const GifEncoder = _GifEncoder;
//   export const WavEncoder = _WavEncoder;

//   // legacy
//   export const player = _Player;
//   export const kwzParser = _KwzFile;
//   export const ppmParser = _PpmFile;
//   export const gifEncoder = _GifEncoder;
//   export const wavEncoder = _WavEncoder;
// }

// export default api;

// export const version = VERSION;

// export type Flipnote = _Flipnote;
// export type FlipnoteMeta = _FlipnoteMeta;
// export type FlipnoteAudioTrack = _FlipnoteAudioTrack;

// export const Player = _Player;
// export const parseSource = _parseSource;
// export const KwzFile = _KwzFile;
// export const PpmFile = _PpmFile;
// export const GifEncoder = _GifEncoder;
// export const WavEncoder = _WavEncoder;

// // legacy
// export const player = _Player;
// export const kwzParser = _KwzFile;
// export const ppmParser = _PpmFile;
// export const gifEncoder = _GifEncoder;
// export const wavEncoder = _WavEncoder;