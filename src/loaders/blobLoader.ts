import { isBrowser } from '../utils';
import { LoaderDefinition } from './types';

/** 
 * Loader for Blob objects (browser only)
 * @group Loader
 */
export const blobLoader: LoaderDefinition<Blob> = {

  name: 'blob',

  matches(source) {
    return isBrowser 
      && typeof Blob !== 'undefined'
      && typeof Response !== 'undefined'
      && source instanceof Blob;
  },

  async load(source) {
    return source.arrayBuffer();
  }

};