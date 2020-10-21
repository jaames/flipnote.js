import { loadSource } from '../loaders/index';
import { FlipnoteParserBase } from './FlipnoteParserBase';
import { PpmParser, PpmParserSettings, PpmMeta } from './PpmParser';
import { KwzParser, KwzParserSettings, KwzMeta } from './KwzParser';

export * from './PpmParser';
export * from './KwzParser';
export * from './FlipnoteParserBase';

export type FlipnoteParserConfig = PpmParserSettings | KwzParserSettings;
export type FlipnoteMeta = PpmMeta | KwzMeta; 
export type Flipnote = FlipnoteParserBase<FlipnoteMeta>;

export function parseSource(source: any, parserConfig?: FlipnoteParserConfig): Promise<Flipnote> {
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