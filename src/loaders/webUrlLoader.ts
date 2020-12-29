import { isBrowser } from '../utils';
import { LoaderDefinition } from './loaderDefinition';

/** 
 * Loader for web url strings (Browser only)
 * @internal
 */
const webUrlLoader: LoaderDefinition<string> = {

  matches: function(source) {
    return isBrowser && typeof source === 'string';
  },

  load: function(source, resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', source, true);
    xhr.responseType = 'arraybuffer'; 
    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300)
          resolve(xhr.response);
        else
          reject({
            type: 'httpError',
            status: xhr.status,
            statusText: xhr.statusText
          });
      }
    };
    xhr.send(null);
  }

};

export default webUrlLoader;