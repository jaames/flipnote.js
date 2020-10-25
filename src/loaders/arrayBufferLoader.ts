import { LoaderDefinition } from './loaderDefinition';

const arrayBufferLoader: LoaderDefinition<ArrayBuffer> = {

  matches: function(source: any) {
    return (source instanceof ArrayBuffer);
  },

  load: function(source: ArrayBuffer, resolve: Function, reject: Function) {
    resolve(source);
  }

};

export default arrayBufferLoader;