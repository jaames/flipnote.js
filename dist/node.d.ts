import { parseSource, KwzFile, PpmFile } from './parsers/index';
import { GifEncoder, WavEncoder } from './encoders/index';
declare const _default: {
    version: string;
    parseSource: typeof parseSource;
    KwzFile: typeof KwzFile;
    PpmFile: typeof PpmFile;
    GifEncoder: typeof GifEncoder;
    WavEncoder: typeof WavEncoder;
    kwzParser: typeof KwzFile;
    ppmParser: typeof PpmFile;
    gifEncoder: typeof GifEncoder;
    wavEncoder: typeof WavEncoder;
};
export default _default;
