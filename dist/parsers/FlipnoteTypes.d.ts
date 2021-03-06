import { FlipnoteParserBase } from './FlipnoteParserBase';
import { PpmParserSettings } from './PpmParser';
import { KwzParserSettings } from './KwzParser';
/** Optional settings to pass to a Flipnote parser instance. See {@link PpmParserSettings} and {@link KwzParserSettings} */
export declare type FlipnoteParserSettings = Partial<PpmParserSettings & KwzParserSettings>;
/** Flipnote type. An object with this type is guranteed to implement the {@link FlipnoteParser} API. */
export declare type Flipnote = FlipnoteParserBase;
