import { assert, isBrowser } from '../utils';
import { LoaderDefinition } from './LoaderDefinition';

/** 
 * Loader for File objects (browser only)
 * @internal
 */
const fileLoader: LoaderDefinition<File> = {

  matches: function(source) {
    return isBrowser 
      && typeof File !== 'undefined' 
      && typeof FileReader !== 'undefined' 
      && source instanceof File;
  },

  load: function(source, resolve, reject) {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(reader.result as ArrayBuffer);
    };
    reader.onerror = (event) => {
      reject({type: 'fileReadError'});
    };
    reader.readAsArrayBuffer(source);
  }

};

export default fileLoader;