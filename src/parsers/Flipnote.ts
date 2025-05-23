import type { BaseParser } from './BaseParser';
import type { PpmParserSettings } from './PpmParser';
import type { KwzParserSettings } from './KwzParser';

/**
 * Optional settings to pass to a Flipnote parser instance. See {@link PpmParserSettings} and {@link KwzParserSettings}
 */
export type FlipnoteParserSettings = Partial<PpmParserSettings & KwzParserSettings>;

/**
 * Flipnote type. An object with this type is guaranteed to implement the {@link BaseParser} API.
 */
export type Flipnote = BaseParser;