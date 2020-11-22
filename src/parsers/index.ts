import { loadSource } from '../loaders/index';
import { FlipnoteParser } from './FlipnoteParserTypes';
import { PpmParser, PpmParserSettings } from './PpmParser';
import { KwzParser, KwzParserSettings } from './KwzParser';

export * from './PpmParser';
export * from './KwzParser';
export * from './FlipnoteParserTypes';

export type FlipnoteParserSettings = PpmParserSettings & KwzParserSettings;
export type Flipnote = FlipnoteParser;

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
      else
        reject();
    });
  });
}