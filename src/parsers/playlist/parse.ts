import { PpmPlaylist } from './PpmPlaylist';
import { KwzPlaylist } from './KwzPlaylist';

import { FlipnoteFormat } from '../types';

import { load } from '../../loaders';

/**
 * Parse a playlist file (.pls or .lst) from Flipnote Studio or Flipnote Studio 3D.
 */
export const parse = async (format: FlipnoteFormat | 'ppm' | 'kwz', source: any) => {
  const buffer = await load(source);

  if (format === FlipnoteFormat.PPM || format === 'ppm')
    return new PpmPlaylist(buffer);

  if (format === FlipnoteFormat.KWZ || format === 'kwz')
    return new KwzPlaylist(buffer);
};