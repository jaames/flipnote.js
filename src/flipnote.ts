// Entrypoint for web and node

export {
  parseSource,
  FlipnoteFormat,
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

//* flipnote.js library version (exported as `flipnote.version`) */
export const version = VERSION; // replaced by @rollup/plugin-replace; see rollup.config.js
