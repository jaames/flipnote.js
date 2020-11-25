import { LoaderDefinition } from './loaderDefinition';
import webUrlLoader from './webUrlLoader';
import nodeUrlLoader from './nodeUrlLoader';
import fileLoader from './fileLoader';
import nodeBufferLoader from './nodeBufferLoader';
import arrayBufferLoader from './arrayBufferLoader';

/** @internal */
const loaders: LoaderDefinition<any>[] = [
  webUrlLoader,
  nodeUrlLoader,
  fileLoader,
  nodeBufferLoader,
  arrayBufferLoader
];

/** @internal */
export function loadSource(source: any): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < loaders.length; i++) {
      const loader = loaders[i];
      if (loader.matches(source)) {
        loader.load(source, resolve, reject);
        return;
      }
    }
    reject('No loader available for source type');
  });
}