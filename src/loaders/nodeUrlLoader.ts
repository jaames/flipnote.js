import { isNode } from '../utils';
import { ServerResponse } from 'http';
import { LoaderDefinition } from './loaderDefinition';

const nodeUrlLoader: LoaderDefinition<string> = {

  matches: function(source: any) {
    return isNode && typeof source === 'string';
  },

  load: function(source: string, resolve: Function, reject: Function) {
    const http = require('https');
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