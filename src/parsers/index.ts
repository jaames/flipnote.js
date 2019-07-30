import { loadSource } from '../loaders/index';
import { PpmParser, PpmMeta } from './ppm';
import { KwzParser, KwzMeta } from './kwz';

export type Flipnote = PpmParser | KwzParser;

export type FlipnoteMeta = PpmMeta | KwzMeta; 

export function parseSource(source: any) {
  return loadSource(source)
    .then((arrayBuffer: ArrayBuffer) => {
      return new Promise((resolve, reject) => {
        // check the buffer's magic to identify which format it uses
        const data = new DataView(arrayBuffer, 0, 4);
        const magic = data.getUint32(0);
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

export * from './ppm';
export * from './kwz';