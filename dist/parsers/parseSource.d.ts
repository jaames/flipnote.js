import { Flipnote, FlipnoteParserSettings } from './FlipnoteTypes';
/**
 * Load a Flipnote from a given source, returning a promise with a parser object
 *
 * @param source - Depending on the operating envionment, this can be:
 * - A string representing a web URL
 * - An {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}
 * - A {@link https://developer.mozilla.org/en-US/docs/Web/API/File | File} (Browser only)
 * - A {@link https://nodejs.org/api/buffer.html | Buffer} (NodeJS only)
 * @param parserConfig - Config settings to pass to the parser, see {@link FlipnoteParserSettings}
 */
export declare function parseSource(source: any, parserConfig?: Partial<FlipnoteParserSettings>): Promise<Flipnote>;
