import { PpmParser } from './parsers/PpmParser';
import { KwzParser } from './parsers/KwzParser';
import { load } from './loaders';

import { Flipnote, FlipnoteParserSettings } from './parsers';
import { err } from './utils';

/**
 * Load a Flipnote from a given source, returning a promise with a parser object. 
 * It will auto-detect the Flipnote format and return either a {@link PpmParser} or {@link KwzParser} accordingly.
 * 
 * @param source - Source to load a Flipnote from. This will attempt to use one of the registered {@link loaders} to load the Flipnote.
 * Depending on the operating environment, the default loader set supports the following sources:
 * - A string representing a web URL.
 * - An {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}.
 * - A {@link https://developer.mozilla.org/en-US/docs/Web/API/File | File} object (Browser only).
 * - A {@link https://nodejs.org/api/buffer.html | Buffer} object (NodeJS only).
 * 
 * @param parserConfig - Config settings to pass to the parser, see {@link FlipnoteParserSettings}.
 */
export const parse = async (
  source: any,
  parserConfig?: Partial<FlipnoteParserSettings>
): Promise<Flipnote> => {
  const buffer = await load(source);

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