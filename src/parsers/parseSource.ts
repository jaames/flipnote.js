import { loadSource } from '../loaders';
import { PpmParser } from './PpmParser';
import { KwzParser } from './KwzParser';

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
export function parseSource(source: any, parserConfig?: Partial<FlipnoteParserSettings>): Promise<Flipnote> {
  return loadSource(source)
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
      // TODO: KIC (f3ds folder icon) magic check
      else
        reject();
    });
  });
}