import { LoaderDefinition } from './types';

import { urlLoader } from './url';
import { fileLoader } from './file';
import { blobLoader } from './blob';
import { nodeBufferLoader } from './nodeBuffer';
import { arrayBufferLoader } from './arrayBuffer';

import { err } from '../utils';

export * from './types';

const LOADER_REGISTRY = new Map<string, LoaderDefinition<any>>();

/**
 * Resolve a source, using the current loaders list.
 * Returns an ArrayBuffer containing the data loaded from the source.
 */
export const load = (source: any): Promise<ArrayBufferLike> => {
  for (let [name, loader] of LOADER_REGISTRY) {
    if (!loader.matches(source))
      continue;

    try {
      return loader.load(source);
    }
    catch (e) {
      err(`Failed to load Flipnote from source, loader "${ name }" failed with error ${ err }`,);
    }
  }
  err('No loader available for source type');
};

/**
 * List all currently registered loaders, as an object.
 */
export const list = () =>
  Object.fromEntries(LOADER_REGISTRY.entries());

/**
 * Clear all currently registered loaders.
 */
export const clear = () => 
  LOADER_REGISTRY.clear();

/**
 * Register a resource loader to use when loading Flipnotes.
 * A loader should take a source and return an ArrayBuffer.
 */
export const register = (loader: LoaderDefinition<any>) => {
  LOADER_REGISTRY.set(loader.name, loader);
};

register(arrayBufferLoader);
register(nodeBufferLoader);
register(blobLoader);
register(fileLoader);
register(urlLoader);