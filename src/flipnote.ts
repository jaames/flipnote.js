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

export const version = VERSION; // replaced by @rollup/plugin-replace; see rollup.config.js