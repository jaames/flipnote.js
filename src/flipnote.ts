// Entrypoint for web and node

export {
  Flipnote,
  FlipnoteFormat,
  FlipnoteVersion,
  FlipnoteRegion,
  FlipnoteMeta,
  FlipnotePaletteColor,
  FlipnotePaletteDefinition,
  FlipnoteLayerVisibility,
  FlipnoteAudioTrack,
  FlipnoteAudioTrackInfo,
  FlipnoteSoundEffectTrack,
  FlipnoteSoundEffectFlags,
  FlipnoteParserSettings,
  KwzParserSettings,
  PpmParserSettings,
  KwzParser,
  PpmParser
} from './parsers';

export * as utils from './utils/fsid';

export * from './loaders';

export * from './parseSource';

export {
  Player,
  PlayerEvent,
} from './player';

export {
  PlayerMixin
} from './components/PlayerMixin';

export {
  GifImage,
  WavAudio,
} from './encoders';

export {
  CanvasInterface,
  WebglCanvas,
  Html5Canvas,
  UniversalCanvas
} from './renderers';

export {
  WebAudioPlayer
} from './webaudio';

/** 
 * flipnote.js library version (exported as `flipnote.version`).
 * You can find the latest version on the project's [NPM](https://www.npmjs.com/package/flipnote.js) page.
 */
export const version = FLIPNOTEJS_VERSION; // replaced by @rollup/plugin-replace;
