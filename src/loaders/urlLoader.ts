import { assert } from '../utils';
import { LoaderDefinition } from './types';

/** 
 * Loader for web url strings (Browser only)
 * @group Loader
 */
export const urlLoader: LoaderDefinition<string> = {

  name: 'url',

  matches(source) {
    return typeof source === 'string';
  },

  async load(source) {
    const response = await fetch(source);
    assert(response.status >= 200 && response.status < 300, `Failed to load Flipnote from URL, response failed with status ${response.status}`);
    return await response.arrayBuffer();
  }

};