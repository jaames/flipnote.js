import { LoaderDefinition } from './LoaderDefinition';

/** 
 * Loader for ArrayBuffer objects
 * @category Loader
 */
const arrayBufferLoader: LoaderDefinition<ArrayBuffer> = {

  matches: function(source) {
    return (source instanceof ArrayBuffer);
  },

  load: function(source, resolve, reject) {
    resolve(source);
  }

};

export default arrayBufferLoader;