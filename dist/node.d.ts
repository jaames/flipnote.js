import { parseSource, KwzParser, PpmParser } from './parsers/index';
import { GifEncoder, WavEncoder } from './encoders/index';
declare const _default: {
    version: string;
    parseSource: typeof parseSource;
    kwzParser: typeof KwzParser;
    ppmParser: typeof PpmParser;
    gifEncoder: typeof GifEncoder;
    wavEncoder: typeof WavEncoder;
};
export default _default;
