export { Flipnote, FlipnoteFormat, FlipnoteVersion, FlipnoteRegion, FlipnoteMeta, FlipnoteAudioTrack, FlipnoteAudioTrackInfo, FlipnotePaletteDefinition, FlipnotePaletteColor, FlipnoteLayerVisibility, FlipnoteParserSettings, KwzParserSettings, PpmParserSettings, KwzParser, PpmParser } from './parsers';
export * as utils from './utils/fsid';
export { parseSource } from './parseSource';
export { Player, PlayerEvent, } from './player';
export { PlayerMixin } from './components/PlayerMixin';
export { GifImage, WavAudio, } from './encoders';
export { WebglCanvas } from './renderers';
/**
 * flipnote.js library version (exported as `flipnote.version`). You can find the latest version on the project's [NPM](https://www.npmjs.com/package/flipnote.js) page.
 */
export declare const version = "5.5.1";
