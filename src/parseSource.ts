import { PpmParser } from './parsers/PpmParser';
import { KwzParser } from './parsers/KwzParser';
import { loadSource, LoaderDefinitionList } from './loaders';

import { Flipnote, FlipnoteParserSettings } from './parsers';

/**
 * Source to load a Flipnote from. Depending on the operating envionment, this can be:
 * - A string representing a web URL
 * - An {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}
 * - A {@link https://developer.mozilla.org/en-US/docs/Web/API/File | File} object (Browser only)
 * - A {@link https://nodejs.org/api/buffer.html | Buffer} object (NodeJS only)
 */
export type FlipnoteSource = string | ArrayBuffer | Buffer | File;

/**
 * Implements loading a Flipnote from a given source type, and returns a promise which resolves to a {@link Flipnote} parser instance.
 */
export type FlipnoteSourceParser<S = FlipnoteSource, D = Flipnote> = (source:S, parserConfig?: Partial<FlipnoteParserSettings>, loaders?: LoaderDefinitionList) => Promise<D>;

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
export const parseSource: FlipnoteSourceParser = (source, parserConfig?, loaders?) => {
  return loadSource(source, loaders)
  .then((arrayBuffer: ArrayBuffer) => {
    return new Promise((resolve, reject) => {
      // check the buffer's magic to identify which format it uses
      const magicBytes = new Uint8Array(arrayBuffer.slice(0, 4));
      const magic = (magicBytes[0] << 24) | (magicBytes[1] << 16) | (magicBytes[2] << 8) | magicBytes[3];
      // check if magic is PARA (ppm magic)
      if (magic === 0x50415241)
        resolve(new PpmParser(arrayBuffer, parserConfig));
      // check if magic is KFH (kwz magic)
      else if ((magic & 0xFFFFFF00) === 0x4B464800)
        resolve(new KwzParser(arrayBuffer, parserConfig));
      // check if magic is KIC (fs3d folder icon)
      else if ((magic & 0xFFFFFF00) === 0x4B494300)
        resolve(new KwzParser(arrayBuffer, parserConfig));
      else
        reject('Could not identify source as a valid Flipnote file');
    });
  });
}