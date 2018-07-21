import ppmParser from "./ppm";
import kwzParser from "./kwz";

export default function parser(arrayBuffer) {
  let data = new DataView(arrayBuffer, 0, 4);
  let magic = data.getUint32(0);
  // check if magic is PARA (ppm magic)
  if (magic == 0x50415241) {
    return new ppmParser(arrayBuffer);
  } 
  // check if magic is KFH (kwz magic)
  else if ((magic & 0xFFFFFF00) == 0x4B464800) {
    return new kwzParser(arrayBuffer);
  }
}