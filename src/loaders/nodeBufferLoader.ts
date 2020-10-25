import { isNode } from '../utils';
import { LoaderDefinition } from './loaderDefinition';

const nodeBufferLoader: LoaderDefinition<Buffer> = {

  matches: function(source: any) {
    return isNode && (source instanceof Buffer);
  },

  load: function(source: Buffer, resolve: Function, reject: Function) {
    resolve(source.buffer);
  }

};

export default nodeBufferLoader;