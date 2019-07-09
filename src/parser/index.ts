import { PpmParser } from "./ppm";
import { KwzParser } from "./kwz";

export function Parser(arrayBuffer: ArrayBuffer) {
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
}