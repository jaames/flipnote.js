import { isBrowser } from '../utils';
import { LoaderDefinition } from './LoaderDefinition';

/** 
 * Loader for Blob objects (browser only)
 * @category Loader
 */
const blobLoader: LoaderDefinition<Blob> = {

  matches: function(source) {
    return isBrowser 
      && typeof Blob !== 'undefined'
      && typeof Response !== 'undefined'
      && source instanceof Blob;
  },

  load: function(source, resolve, reject) {
    // https://stackoverflow.com/questions/15341912/how-to-go-from-blob-to-arraybuffer
    new Response(source).arrayBuffer()
      .then(resolve)
      .catch(reject);
  }

};

export default blobLoader;