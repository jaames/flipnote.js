import { LoaderDefinition } from './LoaderDefinition';
import webUrlLoader from './webUrlLoader';
import nodeUrlLoader from './nodeUrlLoader';
import fileLoader from './fileLoader';
import blobLoader from './blobLoader';
import nodeBufferLoader from './nodeBufferLoader';
import arrayBufferLoader from './arrayBufferLoader';

/** @internal */
const loaders: LoaderDefinition<any>[] = [
  webUrlLoader,
  nodeUrlLoader,
  fileLoader,
  blobLoader,
  nodeBufferLoader,
  arrayBufferLoader
];

/** @internal */
export function loadSource(source: any): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < loaders.length; i++) {
      const loader = loaders[i];
      if (loader.matches(source))
        return loader.load(source, resolve, reject);
    }
    reject('No loader available for source type');
  });
}