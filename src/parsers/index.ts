import { loadSource } from '../loaders/index';
import { FlipnoteParserBase } from './parserBase';
import { PpmParser, PpmMeta } from './ppm';
import { KwzParser, KwzMeta } from './kwz';

export * from './ppm';
export * from './kwz';
export * from './parserBase';

export type Flipnote = FlipnoteParserBase;

export type FlipnoteMeta = PpmMeta | KwzMeta; 

export function parseSource(source: any): Promise<Flipnote> {
  return loadSource(source)
    .then((arrayBuffer: ArrayBuffer) => {
      return new Promise((resolve, reject) => {
        // check the buffer's magic to identify which format it uses
        const magicBytes = new Uint8Array(arrayBuffer.slice(0, 4));
        const magic = (magicBytes[0] << 24) | (magicBytes[1] << 16) | (magicBytes[2] << 8) | magicBytes[3];
        if (magic === 0x50415241) { // check if magic is PARA (ppm magic)
          resolve(new PpmParser(arrayBuffer));
        } else if ((magic & 0xFFFFFF00) === 0x4B464800) { // check if magic is KFH (kwz magic)
          resolve(new KwzParser(arrayBuffer));
        } else {
          reject();
        }
      });
    });
}