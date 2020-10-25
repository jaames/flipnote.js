import urlLoader from './urlLoader';
import fileLoader from './fileLoader';
import nodeBufferLoader from './nodeBufferLoader';
import arrayBufferLoader from './arrayBufferLoader';

/** @internal */
const loaders = [
  urlLoader,
  fileLoader,
  nodeBufferLoader,
  arrayBufferLoader
];

/** @internal */
export function loadSource(source: any) {
  return new Promise(function (resolve, reject) {
    loaders.forEach(loader => {
      if (loader.matches(source)) {
        loader.load(source, resolve, reject);
      }
    });
  });
}