import { LoaderDefinition } from './loaderDefinition';

const fileLoader: LoaderDefinition<File> = {

  matches: function(source: any) {
    return (typeof File !== 'undefined' && source instanceof File);
  },

  load: function(source: File, resolve: Function, reject: Function) {
    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(reader.result);
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