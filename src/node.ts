// Stripped down entrypoint for Node that only contains parsers + encoders

import { 
  parseSource, 
  KwzParser, 
  PpmParser
} from './parsers/index'; 

import {
  GifImage,
  WavAudio
} from './encoders/index';

export default {
  version: VERSION,
  parseSource,
  KwzFile: KwzParser,
  PpmFile: PpmParser,
  GifEncoder: GifImage,
  WavEncoder: WavAudio,
  // legacy
  kwzParser: KwzParser,
  ppmParser: PpmParser,
  gifEncoder: GifImage,
  wavEncoder: WavAudio,
};