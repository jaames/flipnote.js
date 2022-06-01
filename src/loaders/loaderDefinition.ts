/**
 * Resolution function passed to a loader's `load` method. Call when a Flipnote has been loaded successfully.
 * The result should be Flipnote file data as an ArrayBuffer.
 * @category Loader
 */
export type LoaderResolve = (result: ArrayBuffer) => void;

/**
 * Rejection function passed to a loader's `load` method. Call when a Flipnote couldn't be loaded.
 * @category Loader
 */
export type LoaderReject = (err?: any) => void;

/** 
 * Loader interface
 * The goal of a loader is to be able to tell when it can handle a particular source type, and then resolve an ArrayBuffer for that source.
 * @category Loader
 */
export interface LoaderDefinition<T> {
  /** Is this loader able to process the input source type? */
  matches: (source: any) => boolean;
  /** Try loading the source. Passes an ArrayBuffer to resolve() if successful, calls reject() with an optional error if not */
  load: (source: T, resolve: LoaderResolve, reject: LoaderReject) => void;
};