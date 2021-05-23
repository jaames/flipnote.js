import { isNode, assertNodeEnv, dynamicRequire } from '../utils';
import { ServerResponse } from 'http';
import { LoaderDefinition } from './LoaderDefinition';

/** 
 * Loader for web url strings (Node only)
 * @internal
 */
const nodeUrlLoader: LoaderDefinition<string> = {

  matches: function(source) {
    return isNode && typeof source === 'string';
  },

  load: function(source, resolve, reject) {
    assertNodeEnv();
    const http = dynamicRequire(module, 'https');
    http.get(source, (res: ServerResponse) => {
      const chunks: Buffer[] = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer.buffer);
      });
      res.on('error', (err) => reject(err));
    });
  }

};

export default nodeUrlLoader;