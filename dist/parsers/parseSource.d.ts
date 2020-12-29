/// <reference types="node" />
import { Flipnote, FlipnoteParserSettings } from './FlipnoteTypes';
/**
 * Source to load a Flipnote from. Depending on the operating envionment, this can be:
 * - A string representing a web URL
 * - An {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}
 * - A {@link https://developer.mozilla.org/en-US/docs/Web/API/File | File} (Browser only)
 * - A {@link https://nodejs.org/api/buffer.html | Buffer} (NodeJS only)
 */
export declare type FlipnoteSource = string | ArrayBuffer | Buffer | File;
/**
 * Load a Flipnote from a given source, returning a promise with a parser object
 *
 * @param source
 * @param parserConfig - Config settings to pass to the parser, see {@link FlipnoteParserSettings}
 */
export declare function parseSource(source: FlipnoteSource, parserConfig?: Partial<FlipnoteParserSettings>): Promise<Flipnote>;
