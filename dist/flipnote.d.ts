export * from './FlipnoteTypes';
export { FlipnoteFormat, FlipnoteMeta, FlipnoteAudioTrack, FlipnoteAudioTrackInfo, FlipnotePaletteDefinition, FlipnoteLayerVisibility, KwzParser, PpmParser, KwzParserSettings, PpmParserSettings, } from './parsers';
export { parseSource } from './parseSource';
export { Player } from './player';
export { GifImage, WavAudio, } from './encoders';
/**
 * flipnote.js library version (exported as `flipnote.version`). You can find the latest version on the project's [NPM](https://www.npmjs.com/package/flipnote.js) page.
 */
export declare const version = "5.1.4";
