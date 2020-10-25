import { isNode } from '../utils';

export default {

  matches: function(source: any): boolean {
    return isNode && (source instanceof Buffer);
  },

  load: function(source: Buffer, resolve: Function, reject: Function): void {
    resolve(source.buffer);
  }

}