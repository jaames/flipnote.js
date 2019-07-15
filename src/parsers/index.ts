import { loadSource } from '../loaders';
import { PpmParser, PpmMeta } from './ppm';
import { KwzParser, KwzMeta } from './kwz';

export type Flipnote = PpmParser | KwzParser;

export type FlipnoteMeta = PpmMeta | KwzMeta; 

export function parseSource(source: any) {
  return loadSource(source).then((arrayBuffer: ArrayBuffer) => {
    // check the buffer's magic to identify which format it uses
    const data = new DataView(arrayBuffer, 0, 4);
    const magic = data.getUint32(0);
    // check if magic is PARA (ppm magic)
    if (magic === 0x50415241) {
      return new PpmParser(arrayBuffer);
    } 
    // check if magic is KFH (kwz magic)
    else if ((magic & 0xFFFFFF00) === 0x4B464800) {
      return new KwzParser(arrayBuffer);
    }
    return null;
  });
}

export * from './ppm';
export * from './kwz';