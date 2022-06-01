import { LoaderDefinition } from './LoaderDefinition';
export * from './LoaderDefinition';
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
export declare type LoaderDefinitionList = LoaderDefinition<any>[];
/** @internal */
export declare function loadSource(source: any, loaders?: LoaderDefinitionList): Promise<ArrayBuffer>;
