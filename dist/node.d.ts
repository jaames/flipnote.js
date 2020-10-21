import { parseSource, KwzParser, PpmParser } from './parsers/index';
import { GifImage, WavAudio } from './encoders/index';
declare const _default: {
    version: string;
    parseSource: typeof parseSource;
    KwzFile: typeof KwzParser;
    PpmFile: typeof PpmParser;
    GifEncoder: typeof GifImage;
    WavEncoder: typeof WavAudio;
    kwzParser: typeof KwzParser;
    ppmParser: typeof PpmParser;
    gifEncoder: typeof GifImage;
    wavEncoder: typeof WavAudio;
};
export default _default;
