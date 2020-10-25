/**
 * @internal
 */
export const isBrowser = typeof window !== 'undefined' 
  && typeof window.document !== 'undefined';

/**
 * @internal
 */
export const isNode = typeof process !== 'undefined'
  && process.versions != null
  && process.versions.node != null;

/**
 * @internal
 */
export const isWebWorker = typeof self === 'object'
  && self.constructor
  && self.constructor.name === 'DedicatedWorkerGlobalScope';