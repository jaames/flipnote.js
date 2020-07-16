import { parseSource as _parseSource, Flipnote as _Flipnote, FlipnoteMeta as _FlipnoteMeta, FlipnoteAudioTrack as _FlipnoteAudioTrack, KwzParser, PpmParser } from './parsers/index';
import { GifEncoder, WavEncoder } from './encoders/index';
declare namespace api {
    const version = "4.1.1";
    type Flipnpte = _Flipnote;
    type FlipnoteMeta = _FlipnoteMeta;
    type FlipnoteAudioTrack = _FlipnoteAudioTrack;
    const parseSource: typeof _parseSource;
    const kwzParser: typeof KwzParser;
    const ppmParser: typeof PpmParser;
    const gifEncoder: typeof GifEncoder;
    const wavEncoder: typeof WavEncoder;
}
export default api;
export declare const version = "4.1.1";
export declare type Flipnpte = _Flipnote;
export declare type FlipnoteMeta = _FlipnoteMeta;
export declare type FlipnoteAudioTrack = _FlipnoteAudioTrack;
export declare const parseSource: typeof _parseSource;
export declare const kwzParser: typeof KwzParser;
export declare const ppmParser: typeof PpmParser;
export declare const gifEncoder: typeof GifEncoder;
export declare const wavEncoder: typeof WavEncoder;
