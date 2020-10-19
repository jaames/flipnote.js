// Stripped down entrypoint for Node that only contains parsers + encoders

import { 
  parseSource, 
  KwzFile, 
  PpmFile
} from './parsers/index'; 

import {
  GifEncoder,
  WavEncoder
} from './encoders/index';

export default {
  version: VERSION,
  parseSource,
  KwzFile: KwzFile,
  PpmFile: PpmFile,
  GifEncoder: GifEncoder,
  WavEncoder: WavEncoder,
  // legacy
  kwzParser: KwzFile,
  ppmParser: PpmFile,
  gifEncoder: GifEncoder,
  wavEncoder: WavEncoder,
};