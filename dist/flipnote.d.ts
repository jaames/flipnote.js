import * as utils from './utils/index';
import { parseSource, KwzParser, PpmParser } from './parsers/index';
import { Player } from './player/index';
import { GifEncoder, WavEncoder } from './encoders/index';
declare const _default: {
    version: string;
    player: typeof Player;
    parseSource: typeof parseSource;
    kwzParser: typeof KwzParser;
    ppmParser: typeof PpmParser;
    gifEncoder: typeof GifEncoder;
    wavEncoder: typeof WavEncoder;
    utils: typeof utils;
};
export default _default;
