import { isNode } from '../utils';
import { LoaderDefinition } from './LoaderDefinition';

/** 
 * Loader for Buffer objects (Node only)
 * @internal
 */
const nodeBufferLoader: LoaderDefinition<Buffer> = {

  matches: function(source) {
    return isNode && (source instanceof Buffer);
  },

  load: function(source, resolve, reject) {
    resolve(source.buffer);
  }

};

export default nodeBufferLoader;