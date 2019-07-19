import urlLoader from './urlLoader';
import fileLoader from './fileLoader';
import arrayBufferLoader from './arrayBufferLoader';

const loaders = [
  urlLoader,
  fileLoader,
  arrayBufferLoader
];

export function loadSource(source: any) {
  return new Promise(function (resolve, reject) {
    loaders.forEach(loader => {
      if (loader.matches(source)) {
        loader.load(source, resolve, reject);
      }
    });
  });
}