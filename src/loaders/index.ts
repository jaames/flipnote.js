import { LoaderDefinition } from './types';
import { urlLoader } from './urlLoader';
import { fileLoader } from './fileLoader';
import { blobLoader } from './blobLoader';
import { nodeBufferLoader } from './nodeBufferLoader';
import { arrayBufferLoader } from './arrayBufferLoader';
import { err } from '../utils';

export * from './types';

const LOADER_REGISTRY = new Map<string, LoaderDefinition<any>>();

/** @internal */
export const loadSource = (source: any): Promise<ArrayBuffer> => {
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

export const registerLoader = (loader: LoaderDefinition<any>) => {
  LOADER_REGISTRY.set(loader.name, loader);
};

registerLoader(urlLoader);
registerLoader(fileLoader);
registerLoader(blobLoader);
registerLoader(nodeBufferLoader);
registerLoader(arrayBufferLoader);