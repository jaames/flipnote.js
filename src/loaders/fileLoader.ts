import { isBrowser } from '../utils';
import { LoaderDefinition } from './loaderDefinition';

/** 
 * Loader for File objects (browser only)
 * @internal
 */
const fileLoader: LoaderDefinition<File> = {

  matches: function(source) {
    return isBrowser && typeof File !== 'undefined' && source instanceof File;
  },

  load: function(source, resolve, reject) {
    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(reader.result as ArrayBuffer);
      };
      reader.onerror = (event) => {
        reject({type: 'fileReadError'});
      };
      reader.readAsArrayBuffer(source);
    } else {
      reject();
    }
  }

};

export default fileLoader;