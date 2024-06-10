import { isNode } from '../utils';
import { LoaderDefinition } from './types';

/** 
 * Loader for Buffer objects (Node only)
 * @group Loader
 */
export const nodeBufferLoader: LoaderDefinition<Buffer> = {

  name: 'node-buffer',

  matches(source) {
    return isNode && (source instanceof Buffer);
  },

  async load(source) {
    return source.buffer;
  }

};