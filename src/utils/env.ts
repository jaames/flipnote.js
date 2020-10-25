/**
 * Utils to find out information about the current code execution environment
 */

/**
 * Is the code running in a browser environment?
 * @internal
 */
export const isBrowser = typeof window !== 'undefined' 
  && typeof window.document !== 'undefined';

/**
 * Is the code running in a Node environment?
 * @internal
 */
export const isNode = typeof process !== 'undefined'
  && process.versions != null
  && process.versions.node != null;

/**
 * Is the code running in a Web Worker enviornment?
 * @internal
 */
export const isWebWorker = typeof self === 'object'
  && self.constructor
  && self.constructor.name === 'DedicatedWorkerGlobalScope';