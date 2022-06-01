/// <reference types="node" />
import { LoaderDefinitionList } from './loaders';
import { Flipnote, FlipnoteParserSettings } from './parsers';
/**
 * Source to load a Flipnote from. Depending on the operating envionment, this can be:
 * - A string representing a web URL
 * - An {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}
 * - A {@link https://developer.mozilla.org/en-US/docs/Web/API/File | File} object (Browser only)
 * - A {@link https://nodejs.org/api/buffer.html | Buffer} object (NodeJS only)
 */
export declare type FlipnoteSource = string | ArrayBuffer | Buffer | File;
/**
 * Implements loading a Flipnote from a given source type, and returns a promise which resolves to a {@link Flipnote} parser instance.
 */
export declare type FlipnoteSourceParser<S = FlipnoteSource> = (source: S, parserConfig?: Partial<FlipnoteParserSettings>, loaders?: LoaderDefinitionList) => Promise<Flipnote>;
/**
 * Load a Flipnote from a given source, returning a promise with a parser object.
 * It will auto-detect the Flipnote format and return either a {@link PpmParser} or {@link KwzParser} accordingly.
 *
 * @param source - Source to load a Flipnote from. Depending on the operating environment, this can be:
 * - A string representing a web URL
 * - An {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}
 * - A {@link https://developer.mozilla.org/en-US/docs/Web/API/File | File} object (Browser only)
 * - A {@link https://nodejs.org/api/buffer.html | Buffer} object (NodeJS only)
 * You can also pass your own list of loaders to support your own source types.
 * @param parserConfig - Config settings to pass to the parser, see {@link FlipnoteParserSettings}
 * @param loaders - Optional list of file loaders ({@link LoaderDefinition}) when attempting to load a Flipnote. Loaders are tried in sequence until a matching one is found for the requested input.
 */
export declare const parseSource: FlipnoteSourceParser;
