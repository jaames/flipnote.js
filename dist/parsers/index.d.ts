import { FlipnoteParserBase } from './parserBase';
import { PpmMeta } from './ppm';
import { KwzMeta } from './kwz';
export * from './ppm';
export * from './kwz';
export * from './parserBase';
export declare type Flipnote = FlipnoteParserBase;
export declare type FlipnoteMeta = PpmMeta | KwzMeta;
export declare function parseSource(source: any): Promise<Flipnote>;
