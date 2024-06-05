import { PpmParser } from './parsers/PpmParser';
import { KwzParser } from './parsers/KwzParser';
import { loadSource } from './loaders';

import { Flipnote, FlipnoteParserSettings } from './parsers';
import { err } from './utils';

/**
 * Source to load a Flipnote from. Depending on the operating envionment, this can be:
 * - A string representing a web URL
 * - An {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}
 * - A {@link https://developer.mozilla.org/en-US/docs/Web/API/File | File} object (Browser only)
 * - A {@link https://nodejs.org/api/buffer.html | Buffer} object (NodeJS only)
 */
export type FlipnoteSource = string | ArrayBuffer | Buffer | File;

/**
 * Load a Flipnote from a given source, returning a promise with a parser object. 
 * It will auto-detect the Flipnote format and return either a {@link PpmParser} or {@link KwzParser} accordingly.
 * 
 * @param source - Source to load a Flipnote from. Depending on the operating environment, this can be:
 * - A string representing a web URL.
 * - An {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}.
 * - A {@link https://developer.mozilla.org/en-US/docs/Web/API/File | File} object (Browser only).
 * - A {@link https://nodejs.org/api/buffer.html | Buffer} object (NodeJS only).
 * 
 * You can also pass your own list of loaders to support your own source types.
 * 
 * @param parserConfig - Config settings to pass to the parser, see {@link FlipnoteParserSettings}
 * @param loaders - Optional list of file loaders ({@link LoaderDefinition}) when attempting to load a Flipnote. Loaders are tried in sequence until a matching one is found for the requested input.
 */
export const parse = async (
  source: FlipnoteSource,
  parserConfig?: Partial<FlipnoteParserSettings>
): Promise<Flipnote> => {
  const buffer = await loadSource(source);

  if (PpmParser.matchBuffer(buffer))
    return new PpmParser(buffer, parserConfig);

  if (KwzParser.matchBuffer(buffer))
    return new KwzParser(buffer, parserConfig);

  err('Could not identify source as a valid Flipnote file');
};

/**
 * @deprecated Use {@link parse} instead.
 */
export const parseSource = parse;