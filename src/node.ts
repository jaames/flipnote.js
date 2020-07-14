// Stripped down entrypoint for Node that only contains parsers + encoders

import { parseSource, KwzParser, PpmParser } from './parsers/index'; 
import { GifEncoder, WavEncoder } from './encoders/index';

export default {
  version: VERSION,
  parseSource,
  kwzParser: KwzParser,
  ppmParser: PpmParser,
  gifEncoder: GifEncoder,
  wavEncoder: WavEncoder,
};