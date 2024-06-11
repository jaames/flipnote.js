import { assert, isBrowser } from '../utils';
import { LoaderDefinition } from './types';

/** 
 * Loader for File objects (browser only)
 * @group Loader
 */
export const fileLoader: LoaderDefinition<File> = {

  name: 'file',

  matches(source) {
    return isBrowser 
      && typeof File !== 'undefined' 
      && typeof FileReader !== 'undefined' 
      && source instanceof File;
  },

  async load(source) {
    return source.arrayBuffer();
  }

};