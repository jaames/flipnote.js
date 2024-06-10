import { LoaderDefinition } from './types';

/** 
 * Loader for ArrayBuffer objects.
 * @group Loader
 */
export const arrayBufferLoader: LoaderDefinition<ArrayBuffer> = {

  name: 'array-buffer',

  matches(source) {
    return source instanceof ArrayBuffer;
  },

  async load(source) {
    return source;
  }

};