import { LoaderDefinition } from './loaderDefinition';
import webUrlLoader from './webUrlLoader';
import nodeUrlLoader from './nodeUrlLoader';
import fileLoader from './fileLoader';
import blobLoader from './blobLoader';
import nodeBufferLoader from './nodeBufferLoader';
import arrayBufferLoader from './arrayBufferLoader';

export * from './loaderDefinition';
export * from './webUrlLoader';
export * from './nodeUrlLoader';
export * from './fileLoader';
export * from './blobLoader';
export * from './nodeBufferLoader';
export * from './arrayBufferLoader';

/**
 * A list of {@link LoaderDefinition} items to use when attempting to load a Flipnote.
 * Loaders are tried in sequence until a matching one is found for the requested input.
 * @category Loader
 */
export type LoaderDefinitionList = LoaderDefinition<any>[];

/** @category Loader */
const DEFAULT_LOADERS: LoaderDefinitionList = [
  webUrlLoader,
  nodeUrlLoader,
  fileLoader,
  blobLoader,
  nodeBufferLoader,
  arrayBufferLoader
];

/** @internal */
export function loadSource(source: any, loaders: LoaderDefinitionList = DEFAULT_LOADERS): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < loaders.length; i++) {
      const loader = loaders[i];
      if (loader.matches(source))
        return loader.load(source, resolve, reject);
    }
    reject('No loader available for source type');
  });
}