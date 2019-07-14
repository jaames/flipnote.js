import { DataStream } from './utils/dataStream';
import { parseSource, KwzParser, PpmParser } from './parser'; 
import { Player } from './player';
import { BitmapEncoder } from './encoders/bmp';
import { GifEncoder } from './encoders/gif';

export default {
  dataStream: DataStream,
  kwzParser: KwzParser,
  ppmParser: PpmParser,
  player: Player,
  bitmapEncoder: BitmapEncoder,
  gifEncoder: GifEncoder,
  parseSource,
}